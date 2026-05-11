import React from 'react';
import '../styles/modal.css';

export default function YapeModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content yape-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="yape-title">Apóyanos</h2>
        <p className="yape-subtitle">¡Gracias por ayudar a mantener Sorpresa Virtual!</p>

        <img
          src="/yape-qr.png"
          alt="QR de Yape para apoyar Sorpresa Virtual"
          className="yape-qr-img"
        />

        <div className="yape-actions">
          <a href="/yape-qr.png" download="QR_Yape_SorpresaVirtual.png" className="btn-blue">
            Descargar QR
          </a>
          <button onClick={onClose} className="btn-gray">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
