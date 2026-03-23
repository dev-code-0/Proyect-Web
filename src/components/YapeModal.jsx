import React from 'react';

export default function YapeModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{color: '#333'}}>Apóyanos</h2>
        <p style={{color: '#666', marginBottom: '15px'}}>¡Gracias por ayudar a mantener Code Free!</p>
        
        {/* Asegúrate de tener una imagen llamada yape-qr.png en la carpeta public */}
        <img src="/yape-qr.png" alt="QR de Yape" style={{ width: '200px', borderRadius: '10px' }} />
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <a href="/yape-qr.png" download="QR_Yape_CodeFree.png" className="btn-blue">
            Descargar QR
          </a>
          <button onClick={onClose} className="btn-gray">Cerrar</button>
        </div>
      </div>
    </div>
  );
}