import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import '../styles/share-modal.css';

const qrOptions = {
  width: 220,
  height: 220,
  type: 'svg',
  margin: 8,
  qrOptions: { errorCorrectionLevel: 'H' },
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
  cornersSquareOptions: { type: 'extra-rounded', color: '#a855f7' },
  cornersDotOptions:    { type: 'dot',           color: '#d946ef' },
  backgroundOptions:    { color: '#ffffff' },
};

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default function ShareModal({ isOpen, onClose, shareLink }) {
  const qrContainerRef = useRef(null);
  const qrCodeRef      = useRef(null);
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const downloadQR = () => {
    if (qrCodeRef.current)
      qrCodeRef.current.download({ name: 'Tu_Regalo_QR', extension: 'png' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>

        {/* Botón cerrar */}
        <button className="share-close" onClick={onClose} aria-label="Cerrar">
          <IconClose />
        </button>

        {/* Encabezado */}
        <h2 className="share-title">¡Tu regalo está listo!</h2>
        <p className="share-subtitle">
          Comparte el enlace o el código QR con esa persona especial.
        </p>

        {/* QR */}
        <div className="qr-frame">
          <div ref={qrContainerRef} className="qr-canvas" />
        </div>

        {/* Link copiable */}
        <button
          className={`share-link-box ${copied ? 'share-link-box--copied' : ''}`}
          onClick={copyToClipboard}
          title="Clic para copiar"
          aria-label="Copiar enlace"
        >
          <span className="share-link-text">{shareLink}</span>
          <span className="share-link-icon">
            {copied ? <IconCheck /> : <IconCopy />}
          </span>
        </button>

        {/* Acciones */}
        <div className="share-actions">
          <button
            onClick={copyToClipboard}
            className={`share-btn share-btn--primary ${copied ? 'share-btn--copied' : ''}`}
          >
            {copied ? 'Copiado' : 'Copiar enlace'}
          </button>
          <div className="share-actions-row">
            <button onClick={downloadQR} className="share-btn share-btn--secondary">
              <IconDownload />
              Descargar QR
            </button>
            <button onClick={onClose} className="share-btn share-btn--secondary">
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
