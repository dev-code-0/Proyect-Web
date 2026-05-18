import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import CitySearch from '../templates/vuelo-global/CitySearch';
import '../styles/modal.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const MAX_IMAGE_SIZE_MB = 8;
const MAX_AUDIO_SIZE_MB = 15;
const MAX_FILES_PER_UPLOAD = 10;

// Firmas de formatos permitidos. Cada entrada: { bytes, offset }
// Validamos por CATEGORÍA (imagen/audio), no por MIME declarado:
// el navegador a veces miente con formatos modernos (.avif, .heic).
const IMAGE_SIGNATURES = [
  { bytes: [0xFF, 0xD8, 0xFF], offset: 0 },                   // JPEG / JPG
  { bytes: [0x89, 0x50, 0x4E, 0x47], offset: 0 },             // PNG
  { bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 },             // GIF (87a / 89a)
  { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },             // WEBP (contenedor RIFF)
  { bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },             // AVIF / HEIC / HEIF (ftyp box)
  { bytes: [0x42, 0x4D], offset: 0 },                         // BMP
  { bytes: [0x49, 0x49, 0x2A, 0x00], offset: 0 },             // TIFF little-endian
  { bytes: [0x4D, 0x4D, 0x00, 0x2A], offset: 0 },             // TIFF big-endian
  { bytes: [0x00, 0x00, 0x01, 0x00], offset: 0 },             // ICO
  { bytes: [0x38, 0x42, 0x50, 0x53], offset: 0 },             // PSD (Photoshop)
];

const AUDIO_SIGNATURES = [
  { bytes: [0x49, 0x44, 0x33], offset: 0 },                   // MP3 con tag ID3
  { bytes: [0xFF, 0xFB], offset: 0 },                         // MP3 frame
  { bytes: [0xFF, 0xF3], offset: 0 },                         // MP3 frame
  { bytes: [0xFF, 0xF2], offset: 0 },                         // MP3 frame
  { bytes: [0x4F, 0x67, 0x67, 0x53], offset: 0 },             // OGG
  { bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },             // M4A / MP4 audio (ftyp)
  { bytes: [0x66, 0x4C, 0x61, 0x43], offset: 0 },             // FLAC
  { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },             // WAV (RIFF)
];

const readMagicBytes = (file, count = 16) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => resolve(new Uint8Array(e.target.result));
    reader.readAsArrayBuffer(file.slice(0, count));
  });

const matchesSignature = (bytes, { bytes: sig, offset }) =>
  sig.every((byte, i) => bytes[offset + i] === byte);

const validateMagicNumber = async (file, accept = '') => {
  const bytes = await readMagicBytes(file);
  const acceptLower = accept.toLowerCase();

  // Si el campo acepta imágenes, validamos contra firmas de imagen
  if (acceptLower.includes('image/') || acceptLower.includes('image')) {
    if (IMAGE_SIGNATURES.some((sig) => matchesSignature(bytes, sig))) return true;
  }

  // Si el campo acepta audio
  if (acceptLower.includes('audio/') || acceptLower.includes('audio')) {
    if (AUDIO_SIGNATURES.some((sig) => matchesSignature(bytes, sig))) return true;
  }

  return false;
};

const matchesAccept = (file, accept = '') => {
  if (!accept) return true;
  const rules = accept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!rules.length) return true;
  const fileType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();
  return rules.some((rule) => {
    if (rule.endsWith('/*')) return fileType.startsWith(rule.slice(0, -1));
    if (rule.startsWith('.')) return fileName.endsWith(rule);
    return fileType === rule;
  });
};

const exceedsSizeLimit = (file, accept = '') => {
  const fileSizeMB = file.size / (1024 * 1024);
  if (accept.includes('audio/')) return fileSizeMB > MAX_AUDIO_SIZE_MB;
  return fileSizeMB > MAX_IMAGE_SIZE_MB;
};


export default function CustomizeModal({ config, onClose, onSave }) {
  const [formData, setFormData] = useState(() => {
    const defaults = {};
    (config.fields || []).forEach((f) => {
      if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
    });
    return defaults;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progreso, setProgreso] = useState('');
  const [notification, setNotification] = useState('');
  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const handleFileUpload = async (e, field) => {
    setIsProcessing(true);
    setProgreso(`Procesando ${field.label}...`);
    const rawFiles = Array.from(e.target.files);
    const files = rawFiles.slice(0, field.maxFiles || MAX_FILES_PER_UPLOAD);
    const uploadedUrls = [];

    for (const file of files) {
      if (!matchesAccept(file, field.accept || '')) {
        setProgreso('');
        notify(`Tipo de archivo no permitido para ${field.label}.`);
        continue;
      }

      if (exceedsSizeLimit(file, field.accept || '')) {
        setProgreso('');
        notify(
          `Archivo demasiado grande para ${field.label}. Máximo: ${
            (field.accept || '').includes('audio/') ? MAX_AUDIO_SIZE_MB : MAX_IMAGE_SIZE_MB
          }MB.`,
        );
        continue;
      }

      // Validación de magic number (verifica bytes reales, no solo la extensión)
      setProgreso('Verificando archivo...');
      const magicOk = await validateMagicNumber(file, field.accept || '');
      if (!magicOk) {
        setProgreso('');
        notify(`El archivo "${file.name}" no es válido o su tipo no está permitido.`);
        continue;
      }

      let fileToUpload = file;

      // 1. COMPRESIÓN Y CONVERSIÓN A WEBP (Solo si es imagen)
      if (file.type.startsWith('image/')) {
        setProgreso(`Comprimiendo imagen a WebP...`);
        const options = {
          maxSizeMB: 0.5, // Máximo 500KB (súper ligero)
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          fileType: 'image/webp' // Convierte cualquier foto a WebP
        };
        try {
          fileToUpload = await imageCompression(file, options);
        } catch (error) {
          console.error("Error comprimiendo imagen:", error);
        }
      }

      // 2. SUBIDA VÍA EDGE FUNCTION (rate limit + validación server-side)
      setProgreso(`Subiendo archivo a la nube...`);
      const kind = file.type.startsWith('audio/') ? 'audio' : 'image';
      const fd = new FormData();
      fd.append('file', fileToUpload, fileToUpload.name || `file.${kind === 'audio' ? 'mp3' : 'webp'}`);
      fd.append('fileType', kind);
      fd.append('templateId', config.id);

      let uploadUrl = '';
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/upload-file`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
          body: fd,
        });
        const result = await res.json();
        if (!res.ok) {
          notify(result.error || 'Error subiendo archivo.');
          setProgreso('');
          continue;
        }
        uploadUrl = result.url;
      } catch (err) {
        if (import.meta.env.DEV) console.error('Error subiendo archivo:', err);
        notify('Error subiendo archivo. Intenta de nuevo.');
        setProgreso('');
        continue;
      }

      uploadedUrls.push(uploadUrl);
    }

    // 4. GUARDAMOS LAS URLs LISTAS
    if (field.multiple) {
      setFormData({ ...formData, [field.name]: uploadedUrls });
    } else {
      setFormData({ ...formData, [field.name]: uploadedUrls[0] });
    }
    
    if (!uploadedUrls.length) notify('No se subió ningún archivo válido.');
    setProgreso('');
    setIsProcessing(false);
  };

  const sanitizeText = (value, maxLength = 200) =>
    value
      .replace(/[<>`]/g, '') // elimina caracteres XSS básicos; React escapa " y ' por defecto
      .slice(0, maxLength);

  const handleChange = (e, field) => {
    if (field.type === 'file') {
      handleFileUpload(e, field);
    } else {
      const maxLength = field.maxLength || 200;
      const rawValue = e.target.value;
      const cleanedValue = field.onlyDigits
        ? rawValue.replace(/\D+/g, '').slice(0, maxLength)
        : sanitizeText(rawValue, maxLength);
      setFormData({ ...formData, [field.name]: cleanedValue });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing) {
      notify("Espera a que los archivos terminen de subir.");
      return;
    }

    // Verifica que todos los campos de archivo requeridos tengan URLs subidas
    const camposFaltantes = config.fields.filter((field) => {
      if (field.type !== 'file') return false;
      const isOptional = field.required === false || (field.label || '').toLowerCase().includes('(opcional)');
      if (isOptional) return false;
      const value = formData[field.name];
      if (field.multiple) return !Array.isArray(value) || value.length === 0;
      return !value;
    });

    if (camposFaltantes.length) {
      notify(`Falta subir: ${camposFaltantes.map((f) => f.label).join(', ')}`);
      return;
    }

    onSave(formData);
  };

  const needsAudio = config.fields.some((f) => {
    const accept = (f.accept || '').toLowerCase();
    const label = (f.label || '').toLowerCase();
    const name = (f.name || '').toLowerCase();
    return accept.includes('audio')
      || /canci[oó]n|m[uú]sica|audio|song/.test(label)
      || /musica|audio|song/.test(name);
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Personaliza tu Regalo</h2>
        <p>Llena los datos para <strong className='title-name-proyect'>{config.name}</strong></p>

        {notification && (
          <p className="modal-notification">{notification}</p>
        )}

        {needsAudio && (
          <a
            href="https://download-tik-tok.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="tiktok-cta"
          >
            <span className="tiktok-cta-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                <path d="M23.58 14.84c-2.97 0-5.39 2.41-5.39 5.38 0 2.97 2.42 5.38 5.39 5.38 2.86 0 5.19-2.25 5.35-5.08.02-.09.03-18.52.03-18.52 0-.48-.22-.93-.61-1.21-.38-.28-.88-.36-1.33-.22L11.86 5.28c-.63.2-1.05.78-1.05 1.44v14.59a5.37 5.37 0 0 0-2.39-.58c-2.97 0-5.38 2.42-5.38 5.39 0 2.96 2.41 5.38 5.38 5.38 2.87 0 5.19-2.26 5.35-5.08.02-.1.04-12.73.04-12.73l12.15-3.78v5.51c-.72-.36-1.52-.58-2.38-.58z"/>
              </svg>
            </span>
            <span className="tiktok-cta-text">
              <strong>¿Necesitas un audio de TikTok?</strong>
              <span>Descárgalo gratis aquí y súbelo</span>
            </span>
            <span className="tiktok-cta-arrow" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
              </svg>
            </span>
          </a>
        )}

        <form onSubmit={handleSubmit} className="custom-form">
          {config.fields.map((field, index) => (
            <div key={index} className="form-group">
              <label>{field.label}</label>
              {field.type === 'select' ? (
                <select
                  onChange={(e) => handleChange(e, field)}
                  required={field.required ?? !field.label.includes('(Opcional)')}
                  defaultValue=""
                >
                  <option value="" disabled>Selecciona una opción...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder || ''}
                  maxLength={field.maxLength || 500}
                  rows={4}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => handleChange(e, field)}
                  required={field.required ?? !field.label.includes('(Opcional)')}
                />
              ) : field.type === 'city' ? (
                <CitySearch
                  value={formData[field.name]}
                  onChange={(cityObj) => setFormData({ ...formData, [field.name]: cityObj })}
                  placeholder={field.placeholder || ''}
                  accentColor="var(--accent)"
                  allowExactPin={field.exactPin !== false}
                />
              ) : (
                <>
                  <input
                    type={field.type}
                    placeholder={field.placeholder || ''}
                    accept={field.accept || ''}
                    multiple={field.multiple || false}
                    inputMode={field.inputMode}
                    pattern={field.pattern}
                    value={field.type === 'file' ? undefined : (formData[field.name] ?? '')}
                    onChange={(e) => handleChange(e, field)}
                    required={field.required ?? !field.label.includes('(Opcional)')}
                    disabled={(field.type === 'file' && isProcessing) || (!!field.enabledIf && !formData[field.enabledIf])}
                    title={field.enabledIf && !formData[field.enabledIf] ? 'Primero sube tu música' : undefined}
                  />
                  {field.type === 'file' && isProcessing && (
                    <p className="form-upload-warning">
                      Espera a que termine la subida actual antes de agregar más archivos.
                    </p>
                  )}
                </>
              )}
            </div>
          ))}

          {progreso && <p className="form-progress">{progreso}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-gray">Cancelar</button>
            <button type="submit" className="btn-blue" disabled={isProcessing}>
              {isProcessing ? 'Cargando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}