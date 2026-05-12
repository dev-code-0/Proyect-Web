import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/donations.css';

const AMOUNTS = [1, 3, 5, 10, 20];

const IMPACT_MESSAGES = [
  { stat: '20+', text: 'plantillas creadas, disponibles gratis para todos' },
  { stat: '100%', text: 'gratuito gracias a quienes apoyan el proyecto' },
  { stat: '3',   text: 'nuevas plantillas lanzadas este mes por la comunidad' },
];

const HeartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease' }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

export default function Donations() {
  const [selected, setSelected] = useState(5);
  const [impactIdx, setImpactIdx] = useState(0);
  const [impactVisible, setImpactVisible] = useState(true);
  const [pressedAmount, setPressedAmount] = useState(null);
  const [altOpen, setAltOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setImpactVisible(false);
      setTimeout(() => {
        setImpactIdx(i => (i + 1) % IMPACT_MESSAGES.length);
        setImpactVisible(true);
      }, 350);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const handleAmountPress = (amount) => {
    setPressedAmount(amount);
    setSelected(amount);
    setTimeout(() => setPressedAmount(null), 180);
  };

  const current = IMPACT_MESSAGES[impactIdx];

  return (
    <div className="donations-page">

      <nav className="don-nav">
        <Link to="/" className="don-back">
          <ArrowLeftIcon />
          <span>Volver</span>
        </Link>
        <img src="/logo-horizontal.svg" alt="Sorpresa Virtual" className="don-logo" width="130" height="40" />
      </nav>

      <section className="don-hero">
        <div className="don-badge">
          <span className="don-badge-dot" aria-hidden="true" />
          <span>Proyecto independiente</span>
        </div>
        <h1 className="don-title">Sé parte de la magia de Sorpresa Virtual</h1>
        <p className="don-subtitle">
          Apoya con lo que puedas. Gracias a ti el servicio sigue siendo gratis para todos.
        </p>
      </section>

      {/* ── Tarjeta principal Yape ── */}
      <div className="don-flow-card">

        <div className="don-step">
          <div className="don-step-header">
            <span className="don-step-num">1</span>
            <span className="don-step-label">¿Cuánto quieres aportar?</span>
          </div>
          <div className="don-amount-grid" role="group" aria-label="Montos de donación">
            {AMOUNTS.map((amount) => {
              const isSelected = selected === amount;
              const isPressed  = pressedAmount === amount;
              return (
                <button
                  key={amount}
                  className={[
                    'don-amount-btn',
                    isSelected ? 'don-amount-selected' : '',
                    isPressed  ? 'don-amount-pressed'  : '',
                  ].join(' ')}
                  onClick={() => handleAmountPress(amount)}
                  aria-pressed={isSelected}
                  aria-label={`Donar S/${amount}`}
                >
                  {isSelected && <span className="don-check-icon" aria-hidden="true"><CheckIcon /></span>}
                  <span className="don-amount-currency">S/</span>
                  <span className="don-amount-value">{amount}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="don-divider" aria-hidden="true" />

        <div className="don-step">
          <div className="don-step-header">
            <span className="don-step-num">2</span>
            <span className="don-step-label">Escanea con Yape</span>
          </div>
          <div className="don-qr-wrap">
            <div className="don-qr-glow" aria-hidden="true" />
            <img
              src="/yape-qr.png"
              alt="QR de Yape — Sorpresa Virtual"
              className="don-qr-img"
              loading="eager"
              decoding="async"
            />
          </div>
          <p className="don-qr-hint">Abre Yape &rarr; escanear &rarr; apunta aqui</p>
          <a
            href="/yape-qr.png"
            download="QR_Yape_SorpresaVirtual.png"
            className="don-secondary-btn"
            aria-label="Guardar QR de Yape en mi celular"
          >
            <DownloadIcon />
            <span>Guardar QR en mi celular</span>
          </a>
        </div>

        <div className="don-divider" aria-hidden="true" />

        <div className="don-step">
          <div className="don-step-header">
            <span className="don-step-num">3</span>
            <span className="don-step-label">
              Escribe <strong className="don-step-amount">S/{selected}</strong> en Yape y confirma
            </span>
          </div>
          <p className="don-step-note">
            El QR identifica la cuenta. Tu ingresas el monto en la app.
          </p>
        </div>

        <div className="don-divider" aria-hidden="true" />

        {/* Flujo alternativo colapsable */}
        <div className="don-alt-flow">
          <button
            className="don-alt-toggle"
            onClick={() => setAltOpen(o => !o)}
            aria-expanded={altOpen}
          >
            <span>¿No puedes escanear? Ver otra forma</span>
            <ChevronIcon open={altOpen} />
          </button>

          {altOpen && (
            <div className="don-alt-steps">
              <div className="don-alt-step">
                <span className="don-alt-num">1</span>
                <span>Descarga el QR con el botón de arriba</span>
              </div>
              <div className="don-alt-step">
                <span className="don-alt-num">2</span>
                <span>Abre Yape &rarr; escanear &rarr; selecciona imagen</span>
              </div>
              <div className="don-alt-step">
                <span className="don-alt-num">3</span>
                <span>Escribe <strong className="don-step-amount">S/{selected}</strong> y confirma</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── Card Internacional — próximamente ── */}
      <div className="don-intl-card">
        <div className="don-intl-icon">
          <GlobeIcon />
        </div>
        <div className="don-intl-body">
          <span className="don-intl-name">Donaciones internacionales</span>
          <span className="don-intl-sub">Pronto con tarjeta desde cualquier parte del mundo</span>
        </div>
        <span className="don-intl-pill">Pronto</span>
      </div>

      {/* ── Impacto ── */}
      <section className="don-impact" aria-live="polite" aria-atomic="true">
        <div className={`don-impact-card${impactVisible ? '' : ' don-impact-fade'}`}>
          <span className="don-impact-icon-wrap" aria-hidden="true"><HeartIcon /></span>
          <span className="don-impact-stat">{current.stat}</span>
          <span className="don-impact-text">{current.text}</span>
        </div>
      </section>

      <p className="don-trust">
        Tu aporte va directo a servidores y nuevas plantillas. Sin comisiones de nuestra parte. Gracias.
      </p>

    </div>
  );
}
