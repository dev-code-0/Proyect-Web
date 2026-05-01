import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import '../styles/modal.css';

const qrOptions = {
  width: 220,
  height: 220,
  type: 'svg',
  margin: 8,
  qrOptions: {
    errorCorrectionLevel: 'H',
  },
  dotsOptions: {
    type: 'rounded',
    gradient: {
      type: 'linear',
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: '#d946ef' },
        { offset: 1, color: '#f472b6' },
      ],
    },
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#a855f7',
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#d946ef',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
};

export default function ShareModal({ isOpen, onClose, shareLink }) {
  const qrContainerRef = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !qrContainerRef.current) return;

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling({ ...qrOptions, data: shareLink });
      qrContainerRef.current.innerHTML = '';
      qrCodeRef.current.append(qrContainerRef.current);
    } else {
      qrCodeRef.current.update({ data: shareLink });
    }
  }, [isOpen, shareLink]);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('¡Enlace copiado al portapapeles!');
    }).catch(err => {
      console.error('Error al copiar el enlace', err);
    });
  };

  const downloadQR = () => {
    if (!qrCodeRef.current) return;
    qrCodeRef.current.download({ name: 'Tu_Regalo_QR', extension: 'png' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-modal" onClick={(e) => e.stopPropagation()}>
        <h2>¡Tu regalo está listo!</h2>
        <p>Comparte este enlace o el código QR con esa persona especial.</p>

        <div style={{ color: 'var(--accent)', margin: '20px 0', background: 'var(--bg)', padding: '15px', borderRadius: '10px', wordBreak: 'break-all', fontSize: '0.85rem', border: '1px solid rgba(160, 100, 255, 0.25)' }}>
          <strong>{shareLink}</strong>
        </div>

        <div className="qr-frame">
          <div ref={qrContainerRef} className="qr-canvas" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={copyToClipboard} className="btn-blue" style={{ width: '100%' }}>
            Copiar Enlace
          </button>
          <button onClick={downloadQR} className="btn-white-home" style={{ width: '100%' }}>
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
