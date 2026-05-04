import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import '../styles/modal.css';

const MAX_IMAGE_SIZE_MB = 8;
const MAX_AUDIO_SIZE_MB = 15;
const MAX_FILES_PER_UPLOAD = 5;

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

const randomId = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

export default function CustomizeModal({ config, onClose, onSave }) {
  const [formData, setFormData] = useState(() => {
    const defaults = {};
    (config.fields || []).forEach((f) => {
      if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
    });
    return defaults;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progreso, setProgreso] = useState(''); // Para mostrarle al usuario qué está pasando

  const handleFileUpload = async (e, field) => {
    setIsProcessing(true);
    setProgreso(`Procesando ${field.label}...`);
    const rawFiles = Array.from(e.target.files);
    const files = rawFiles.slice(0, field.maxFiles || MAX_FILES_PER_UPLOAD);
    const uploadedUrls = [];

    for (const file of files) {
      if (!matchesAccept(file, field.accept || '')) {
        setProgreso('');
        alert(`Tipo de archivo no permitido para ${field.label}.`);
        continue;
      }

      if (exceedsSizeLimit(file, field.accept || '')) {
        setProgreso('');
        alert(
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
        alert(`El archivo "${file.name}" no es válido o su tipo no está permitido.`);
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

      // 2. SUBIDA A SUPABASE
      setProgreso(`Subiendo archivo a la nube...`);
      const fileExt = fileToUpload.type === 'image/webp' ? 'webp' : file.name.split('.').pop();
      const fileName = `${randomId()}.${fileExt}`;
      const filePath = `${config.id}/${fileName}`; // Lo guarda ordenado por proyecto

      const { error } = await supabase.storage
        .from('archivos_usuarios')
        .upload(filePath, fileToUpload);

      if (error) {
        if (import.meta.env.DEV) console.error("Error subiendo archivo:", error);
        setProgreso(`Error subiendo archivo: ${error.message || 'intenta de nuevo.'}`);
        continue;
      }

      // 3. OBTENER EL LINK PÚBLICO
      const { data: publicData } = supabase.storage
        .from('archivos_usuarios')
        .getPublicUrl(filePath);

      if (!publicData?.publicUrl) {
        setProgreso('No se pudo obtener URL publica del archivo.');
        continue;
      }
      
      uploadedUrls.push(publicData.publicUrl);
    }

    // 4. GUARDAMOS LAS URLs LISTAS
    if (field.multiple) {
      setFormData({ ...formData, [field.name]: uploadedUrls });
    } else {
      setFormData({ ...formData, [field.name]: uploadedUrls[0] });
    }
    
    setProgreso(uploadedUrls.length ? '' : 'No se subio ningun archivo valido.');
    setIsProcessing(false);
  };

  const sanitizeText = (value, maxLength = 200) =>
    value
      .replace(/[<>"'`]/g, '') // elimina caracteres XSS básicos
      .slice(0, maxLength);

  const handleChange = (e, field) => {
    if (field.type === 'file') {
      handleFileUpload(e, field);
    } else {
      const maxLength = field.maxLength || 200;
      setFormData({ ...formData, [field.name]: sanitizeText(e.target.value, maxLength) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing) {
      alert("Espera un segundito a que los archivos terminen de subir...");
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
      alert(`Falta subir: ${camposFaltantes.map((f) => f.label).join(', ')}`);
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

        {needsAudio && (
          <a
            href="https://download-tik-tok.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="tiktok-cta"
          >
            <span className="tiktok-cta-icon" aria-hidden="true">🎵</span>
            <span className="tiktok-cta-text">
              <strong>¿Necesitas un audio de TikTok?</strong>
              <span>Descárgalo gratis aquí y súbelo</span>
            </span>
            <span className="tiktok-cta-arrow" aria-hidden="true">↗</span>
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
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder || ''}
                  accept={field.accept || ''}
                  multiple={field.multiple || false}
                  value={field.type === 'file' ? undefined : (formData[field.name] ?? '')}
                  onChange={(e) => handleChange(e, field)}
                  required={field.required ?? !field.label.includes('(Opcional)')}
                />
              )}
            </div>
          ))}

          {progreso && <p style={{color: 'var(--accent)', fontSize: '0.85rem', margin: '5px 0'}}>{progreso}</p>}

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