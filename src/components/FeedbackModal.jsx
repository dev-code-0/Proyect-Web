import React, { useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function FeedbackModal({ onClose }) {
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const enviarSugerencia = async () => {
    if (!mensaje.trim()) {
      alert("Por favor escribe algo antes de enviar.");
      return;
    }
    
    setEnviando(true);

    // Insertamos el mensaje en Supabase
    const { error } = await supabase
      .from('sugerencias')
      .insert([{ mensaje: mensaje }]);

    setEnviando(false);

    if (error) {
      alert("Hubo un error al enviar. Intenta de nuevo.");
      console.error(error);
    } else {
      setExito(true);
      // Cerramos el modal automáticamente después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ backgroundColor: '#222', borderRadius: '20px', padding: '25px', width: '100%', maxWidth: '400px', textAlign: 'center', color: 'white', border: '1px solid #444' }}>
        
        {exito ? (
          <div>
            <h2 style={{ color: '#2ba52e' }}>¡Enviado!</h2>
            <p>Gracias por tu sugerencia.</p>
          </div>
        ) : (
          <>
            <h2 style={{ marginTop: 0 }}>Enviar Sugerencia</h2>
            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '20px' }}>Escribe tu idea, queja o recomendación para mejorar la plataforma.</p>
            
            <textarea 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe aquí..."
              style={{ width: '100%', height: '120px', borderRadius: '15px', padding: '15px', boxSizing: 'border-box', backgroundColor: '#333', color: 'white', border: 'none', resize: 'none', marginBottom: '20px', fontSize: '16px' }}
            />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={onClose} 
                disabled={enviando}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#555', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancelar
              </button>
              <button 
                onClick={enviarSugerencia} 
                disabled={enviando}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ff1e68', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {enviando ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}