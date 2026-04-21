import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import '../styles/modal.css';

const MAX_IMAGE_SIZE_MB = 8;
const MAX_AUDIO_SIZE_MB = 15;

const matchesAccept = (file, accept = '') => {
  if (!accept) return true;

  const rules = accept
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (!rules.length) return true;

  const fileType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();

  return rules.some((rule) => {
    if (rule.endsWith('/*')) {
      const baseType = rule.slice(0, -1);
      return fileType.startsWith(baseType);
    }

    if (rule.startsWith('.')) {
      return fileName.endsWith(rule);
    }

    return fileType === rule;
  });
};

const exceedsSizeLimit = (file, accept = '') => {
  const fileSizeMB = file.size / (1024 * 1024);

  if (accept.includes('audio/')) {
    return fileSizeMB > MAX_AUDIO_SIZE_MB;
  }

  if (accept.includes('image/')) {
    return fileSizeMB > MAX_IMAGE_SIZE_MB;
  }

  return fileSizeMB > MAX_IMAGE_SIZE_MB;
};

export default function CustomizeModal({ config, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progreso, setProgreso] = useState(''); // Para mostrarle al usuario qué está pasando

  const handleFileUpload = async (e, field) => {
    setIsProcessing(true);
    setProgreso(`Procesando ${field.label}...`);
    const files = Array.from(e.target.files);
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
          `Archivo demasiado grande para ${field.label}. Maximo: ${
            (field.accept || '').includes('audio/') ? MAX_AUDIO_SIZE_MB : MAX_IMAGE_SIZE_MB
          }MB.`,
        );
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
      const fileName = `${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
      const filePath = `${config.id}/${fileName}`; // Lo guarda ordenado por proyecto

      const { error } = await supabase.storage
        .from('archivos_usuarios')
        .upload(filePath, fileToUpload);

      if (error) {
        console.error("Error subiendo archivo:", error);
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

  const handleChange = (e, field) => {
    if (field.type === 'file') {
      handleFileUpload(e, field);
    } else {
      setFormData({ ...formData, [field.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing) {
      alert("Espera un segundito a que los archivos terminen de subir...");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Personaliza tu Regalo</h2>
        <a href="https://google.com" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-external-link-alt">  a</i>
        </a>
        <p>Llena los datos para <strong className='title-name-proyect'>{config.name}</strong></p>

        <form onSubmit={handleSubmit} className="custom-form">
          {config.fields.map((field, index) => (
            <div key={index} className="form-group">
              <label>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder || ''}
                accept={field.accept || ''}
                multiple={field.multiple || false}
                onChange={(e) => handleChange(e, field)}
                required={field.required ?? !field.label.includes('(Opcional)')}
              />
            </div>
          ))}

          {progreso && <p style={{color: '#52BFF2', fontSize: '0.85rem', margin: '5px 0'}}>{progreso}</p>}

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