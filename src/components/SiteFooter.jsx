import React, { useState } from 'react';
import YapeModal from './YapeModal';
import FeedbackModal from './FeedbackModal';
import '../styles/site-footer.css';

const WHATSAPP_COMUNIDAD = 'https://chat.whatsapp.com/IGo1Z3EGz827anxc9QifNj';

export default function SiteFooter() {
  const [showYape, setShowYape] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <footer className="site-footer">
      <div className="footer-divider" aria-hidden="true" />
      <div className="footer-links">
        <button onClick={() => setShowFeedback(true)} className="footer-btn">
          Enviar sugerencia
        </button>
        <button onClick={() => setShowYape(true)} className="footer-btn">
          Apóyanos
        </button>
        <a
          href={WHATSAPP_COMUNIDAD}
          target="_blank"
          rel="noreferrer"
          className="footer-btn"
        >
          Comunidad de WhatsApp
        </a>
      </div>
      <p className="footer-copy">© 2025 Sorpresa Virtual — Regalos digitales únicos</p>

      {showYape && <YapeModal onClose={() => setShowYape(false)} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </footer>
  );
}
