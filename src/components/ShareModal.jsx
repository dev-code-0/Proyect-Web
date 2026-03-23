import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import '../styles/modal.css'; // Reusamos los estilos oscuros del overlay

export default function ShareModal({ isOpen, onClose, shareLink }) {
  const qrRef = useRef();

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert("¡Enlace copiado al portapapeles!");
    }).catch(err => {
      console.error('Error al copiar el enlace', err);
    });
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "Tu_Regalo_QR.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-modal" onClick={(e) => e.stopPropagation()}>
        <h2>¡Tu regalo está listo!</h2>
        <p>Comparte este enlace o el código QR con esa persona especial.</p>
        
        <div style={{ margin: '20px 0', background: '#f5f5f5', padding: '15px', borderRadius: '10px', wordBreak: 'break-all', fontSize: '0.9rem' }}>
          <strong>{shareLink}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }} ref={qrRef}>
          {/* Aquí se genera el QR mágicamente */}
          <QRCodeCanvas value={shareLink} size={150} level={"H"} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={copyToClipboard} className="btn-blue" style={{ width: '100%' }}>
            Copiar Enlace
          </button>
          <button onClick={downloadQR} className="btn-white" style={{ width: '100%', border: '2px solid #52BFF2', color: '#52BFF2' }}>
            Descargar QR
          </button>
          <button onClick={onClose} className="btn-gray" style={{ width: '100%', marginTop: '10px' }}>
            Cerrar y Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}