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
    // Agarramos el QR que generó la librería
    const originalCanvas = qrRef.current.querySelector('canvas');
    
    // 1. Creamos un canvas temporal (invisible) para armar la imagen final
    const canvasFinal = document.createElement('canvas');
    const padding = 20; // Aquí decides de qué grosor quieres el borde blanco
    const size = originalCanvas.width;

    // El tamaño final será el QR + el padding de ambos lados
    canvasFinal.width = size + (padding * 2);
    canvasFinal.height = size + (padding * 2);

    const ctx = canvasFinal.getContext('2d');

    // 2. Pintamos todo el fondo de BLANCO primero
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasFinal.width, canvasFinal.height);

    // 3. Dibujamos tu QR original encima, empujándolo para que quede en el centro
    ctx.drawImage(originalCanvas, padding, padding);

    // 4. Ahora sí, descargamos este NUEVO canvas que ya tiene el fondo y el padding
    const pngUrl = canvasFinal.toDataURL("image/png");
    
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
        
        <div style={{color:'#333', margin: '20px 0', background: '#f5f5f5', padding: '15px', borderRadius: '10px', wordBreak: 'break-all', fontSize: '0.9rem' }}>
          <strong>{shareLink}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }} ref={qrRef}>
          {/* Aquí se genera el QR mágicamente */}
          <QRCodeCanvas style={{padding: '10px', background: '#fff'}} value={shareLink} size={150} level={"H"} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={copyToClipboard} className="btn-blue" style={{ width: '100%' }}>
            Copiar Enlace
          </button>
          <button onClick={downloadQR} className="btn-white-home" style={{ width: '100%', border: '2px solid #52BFF2', color: '#52BFF2' }}>
            Descargar QR
          </button>
          <button onClick={onClose} className="btn-white-home" style={{ width: '100%', marginTop: '10px' }}>
            Cerrar y Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}