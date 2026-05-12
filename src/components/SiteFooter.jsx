import { Link } from 'react-router-dom';
import '../styles/site-footer.css';

const WHATSAPP_COMUNIDAD = 'https://chat.whatsapp.com/IGo1Z3EGz827anxc9QifNj';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-divider" aria-hidden="true" />
      <div className="footer-links">
        <Link to="/suggestions" className="footer-btn">
          Enviar sugerencia
        </Link>
        <Link to="/questions" className="footer-btn">
          Preguntas frecuentes
        </Link>
        <Link to="/donations" className="footer-btn">
          Apóyanos
        </Link>
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
    </footer>
  );
}
