import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabase';
import '../styles/modal.css';

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

      const { data, error } = await supabase.storage
        .from('archivos_usuarios')
        .upload(filePath, fileToUpload);

      if (error) {
        console.error("Error subiendo archivo:", error);
        continue;
      }

      // 3. OBTENER EL LINK PÚBLICO
      const { data: publicData } = supabase.storage
        .from('archivos_usuarios')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(publicData.publicUrl);
    }

    // 4. GUARDAMOS LAS URLs LISTAS
    if (field.multiple) {
      setFormData({ ...formData, [field.name]: uploadedUrls });
    } else {
      setFormData({ ...formData, [field.name]: uploadedUrls[0] });
    }
    
    setProgreso('');
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
        <p>Llena los datos para <strong>{config.name}</strong></p>

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
                required={!field.label.includes('(Opcional)')}
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