import { Link } from 'react-router-dom';
import BackgroundAnimation from './BackgroundAnimation';
import '../styles/not-found.css';

const LostGiftSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="notfound-svg" aria-hidden="true">
    {/* Sombra interior del cuerpo */}
    <rect x="12" y="48" width="76" height="44" rx="5"
      fill="currentColor" opacity="0.07"/>
    {/* Cuerpo de la caja */}
    <rect x="12" y="48" width="76" height="44" rx="5"
      stroke="currentColor" strokeWidth="2.5"/>
    {/* Tapa */}
    <rect x="8" y="35" width="84" height="15" rx="4"
      fill="currentColor" opacity="0.1"/>
    <rect x="8" y="35" width="84" height="15" rx="4"
      stroke="currentColor" strokeWidth="2.5"/>
    {/* Cinta vertical */}
    <rect x="46" y="35" width="8" height="57" rx="2"
      fill="currentColor" opacity="0.18"/>
    {/* Cinta horizontal en tapa */}
    <rect x="8" y="40" width="84" height="5" rx="2"
      fill="currentColor" opacity="0.12"/>
    {/* Lazo izquierdo */}
    <path d="M50 35 C42 21 22 22 27 34"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Lazo derecho */}
    <path d="M50 35 C58 21 78 22 73 34"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Nudo central */}
    <circle cx="50" cy="35" r="4.5" fill="currentColor"/>
    {/* Signo de interrogación en la caja */}
    <text x="50" y="78" textAnchor="middle"
      fontSize="26" fontWeight="800" fill="currentColor" opacity="0.9"
      fontFamily="sans-serif">?</text>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function NotFound({
  id,
  title    = 'Plantilla no encontrada',
  subtitle = 'Puede que la dirección sea incorrecta o que la plantilla haya sido eliminada. Vuelve al inicio para ver todas las disponibles.',
}) {
  return (
    <>
      <BackgroundAnimation />
      <div className="notfound-container">

        <div className="notfound-icon-wrap">
          <LostGiftSVG />
        </div>

        <p className="notfound-code">404</p>

        <h1 className="notfound-title">{title}</h1>

        {id && (
          <p className="notfound-detail">
            <code className="notfound-id">"{id}"</code> no existe en el catálogo.
          </p>
        )}

        <p className="notfound-sub">{subtitle}</p>

        <Link to="/" className="notfound-btn">
          Ir al inicio
          <ArrowIcon />
        </Link>

      </div>
    </>
  );
}
