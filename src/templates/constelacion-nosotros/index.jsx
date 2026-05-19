import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useConstelacion } from './useConstelacion.js';
import PergaminoExport from './PergaminoExport.jsx';
import './style.css';

// ─── Theme tokens (UI side — Three.js side handled in useConstelacion) ──────
const THEME_GLOW = {
  cosmos:    'rgba(154, 212, 255, 0.85)',
  romantica: 'rgba(255, 158, 197, 0.85)',
  dorada:    'rgba(255, 217, 122, 0.85)',
  esmeralda: 'rgba(158, 243, 196, 0.85)',
};

const THEME_BG = {
  cosmos:    '#020b18',
  romantica: '#080010',
  dorada:    '#0d0800',
  esmeralda: '#001a0d',
};

// ─── SVG icons (cero emojis, fill=currentColor) ───────────────────────────────
const IconStar = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M12 .9l3.3 7.5 8.1.8-6.2 5.5 1.9 8.1L12 18.5 4.9 22.8l1.9-8.1L.6 9.2l8.1-.8L12 .9z" />
  </svg>
);

const IconScroll = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <path d="M8 2h11a3 3 0 0 1 3 3v3H8V2z" />
    <path d="M16 22H5a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3h3" />
    <path d="M8 2v17a3 3 0 0 0 3 3" />
    <path d="M11 7h6M11 11h6" />
  </svg>
);

const IconReplay = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-3.5-7.13" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const IconVolume = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const IconVolumeOff = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const IconClose = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width={size} height={size} aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const IconChevronLeft = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── Preview placeholders (when no fotos uploaded) ────────────────────────────
const PREVIEW_FALLBACKS = [
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="%234facfe"/><stop offset="1" stop-color="%2300f2fe"/></linearGradient></defs><rect width="80" height="80" fill="url(%23g)"/><text x="40" y="46" text-anchor="middle" fill="white" font-size="34" font-family="serif">A</text></svg>`
  ),
];

function fallbackPhotos(n) {
  const colors = [
    ['#4facfe', '#00f2fe'],
    ['#ff6b9d', '#ffb3d1'],
    ['#ffd200', '#ff8a00'],
    ['#10b981', '#34d399'],
    ['#a855f7', '#ec4899'],
    ['#fb7185', '#fcd34d'],
    ['#22d3ee', '#a78bfa'],
    ['#f472b6', '#fbbf24'],
  ];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return Array.from({ length: n }, (_, i) => {
    const [c1, c2] = colors[i % colors.length];
    const letter = letters[i % letters.length];
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g${i}' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='100' height='100' fill='url(%23g${i})'/><text x='50' y='62' text-anchor='middle' fill='white' font-size='52' font-family='Georgia, serif' font-weight='700'>${letter}</text></svg>`
    );
  });
}

// ─── Per-photo titles for the modal ──────────────────────────────────────────
const DEFAULT_TITLES = [
  'Primer encuentro',
  'Primer beso',
  'Primer viaje',
  'Primera promesa',
  'Aniversario',
  'Día perfecto',
  'Madrugada compartida',
  'Para siempre',
];

export default function ConstelacionNosotros({ data, isPreview }) {
  const resolved = useMemo(() => ({
    tema: 'cosmos',
    nombre_constelacion: 'Nuestra Constelación',
    ...data,
  }), [data]);

  return <ConstelacionView data={resolved} isPreview={isPreview} />;
}

function ConstelacionView({ data }) {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const splashTimerRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [splashOut, setSplashOut] = useState(false);
  const [activeStar, setActiveStar] = useState(null);
  const [showPergamino, setShowPergamino] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const tema = data?.tema || 'cosmos';
  const glow = THEME_GLOW[tema] || THEME_GLOW.cosmos;
  const bg = THEME_BG[tema] || THEME_BG.cosmos;

  // Photos (with fallback for empty preview)
  const fotosArr = Array.isArray(data?.fotos) ? data.fotos.slice(0, 8) : [];
  const displayFotos = useMemo(() => {
    if (fotosArr.length >= 3) return fotosArr;
    return fallbackPhotos(Math.max(5, fotosArr.length || 5));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fotosArr.join('|')]);

  // Parse dates from textarea (one per line)
  const fechas = useMemo(() => {
    if (!data?.fechas) return [];
    return String(data.fechas).split('\n').map(s => s.trim()).filter(Boolean);
  }, [data?.fechas]);

  // Stable click ref so Three.js callback can read the latest
  const onStarClickRef = useRef(null);
  useEffect(() => {
    onStarClickRef.current = (idx) => setActiveStar(prev => (prev === idx ? null : idx));
  }, []);

  const enriched = useMemo(() => ({
    tema,
    displayFotos,
    nombre_constelacion: data?.nombre_constelacion,
    seed: data?.nombre_constelacion || 'default-constelacion',
  }), [tema, displayFotos, data?.nombre_constelacion]);

  const { replay } = useConstelacion(containerRef, enriched, onStarClickRef);

  useEffect(() => () => {
    if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleStart = () => {
    setSplashOut(true);
    if (data?.musica) {
      const audio = new Audio(data.musica);
      audio.loop = true;
      audio.volume = 0;
      audioRef.current = audio;
      audio.play().catch(() => {});
      let v = 0;
      const t = setInterval(() => {
        v = Math.min(v + 0.018, 0.7);
        if (audioRef.current) audioRef.current.volume = v;
        if (v >= 0.7) clearInterval(t);
      }, 60);
    }
    splashTimerRef.current = setTimeout(() => setStarted(true), 480);
  };

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(m => !m);
  };

  const handlePrev = () => setActiveStar(p => (p - 1 + displayFotos.length) % displayFotos.length);
  const handleNext = () => setActiveStar(p => (p + 1) % displayFotos.length);

  const wrapperStyle = {
    background: bg,
    '--cn-bg': bg,
    '--cn-glow': glow,
  };

  const starTitle = activeStar !== null ? DEFAULT_TITLES[activeStar % DEFAULT_TITLES.length] : '';
  const starDate = activeStar !== null ? (fechas[activeStar] || '') : '';

  return (
    <div className="cn-wrapper" style={wrapperStyle}>
      {/* Three.js canvas always mounted so we see the sky behind the splash */}
      <div ref={containerRef} className="cn-canvas" />

      {/* Constellation title floats over the sky after start */}
      {started && (
        <div className="cn-floating-title" style={{ textShadow: `0 0 16px ${glow}, 0 0 38px ${glow}` }}>
          <span className="cn-floating-title-text">{data?.nombre_constelacion || 'Nuestra Constelación'}</span>
          {data?.pareja_a && data?.pareja_b && (
            <span className="cn-floating-title-sub">{data.pareja_a} <span className="cn-amp">·</span> {data.pareja_b}</span>
          )}
        </div>
      )}

      {/* Splash overlay */}
      {!started && (
        <div className={`cn-splash${splashOut ? ' cn-splash--out' : ''}`}>
          <div className="cn-splash-card" style={{ borderColor: glow.replace('0.85)', '0.3)') }}>
            <div className="cn-splash-icon" style={{ color: glow }}>
              <IconStar size={56} />
            </div>
            <h1 className="cn-splash-title" style={{ textShadow: `0 0 14px ${glow}, 0 0 38px ${glow}` }}>
              {data?.nombre_constelacion || 'Nuestra Constelación'}
            </h1>
            {data?.pareja_a && data?.pareja_b && (
              <p className="cn-splash-pair">
                {data.pareja_a} <span className="cn-amp" style={{ color: glow }}>·</span> {data.pareja_b}
              </p>
            )}
            {data?.fecha_inicio && (
              <p className="cn-splash-date">Desde {data.fecha_inicio}</p>
            )}
            <p className="cn-splash-desc">
              Nuestra historia escrita en las estrellas. Toca cada una para revivir el momento.
            </p>
            <button className="cn-splash-btn" onClick={handleStart}>
              Mirar al cielo
            </button>
          </div>
        </div>
      )}

      {/* Main UI after splash */}
      {started && (
        <>
          <p className="cn-tap-hint">Toca una estrella para abrirla</p>

          <div className="cn-controls">
            <button className="cn-btn" onClick={replay} title="Reiniciar animación" aria-label="Reiniciar">
              <IconReplay />
            </button>
            {data?.musica && (
              <button className="cn-btn" onClick={toggleMute} title={isMuted ? 'Activar sonido' : 'Silenciar'} aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}>
                {isMuted ? <IconVolumeOff /> : <IconVolume />}
              </button>
            )}
            <button className="cn-btn cn-btn--primary" onClick={() => setShowPergamino(true)} title="Descargar Registro Estelar" aria-label="Descargar registro">
              <IconScroll />
              <span className="cn-btn-label">Registro</span>
            </button>
          </div>

          {/* Star overlay */}
          {activeStar !== null && (
            <div className="cn-overlay" onClick={() => setActiveStar(null)}>
              <div
                className="cn-overlay-card"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: bg,
                  borderColor: glow.replace('0.85)', '0.3)'),
                  boxShadow: `0 0 50px rgba(0,0,0,0.6), 0 0 40px ${glow.replace('0.85)', '0.08)')} inset`,
                }}
              >
                <div className="cn-overlay-icon" style={{ color: glow, filter: `drop-shadow(0 0 8px ${glow})` }}>
                  <IconStar />
                </div>

                {displayFotos[activeStar] && (
                  <img
                    src={displayFotos[activeStar]}
                    alt={`Estrella ${activeStar + 1}`}
                    className="cn-overlay-img"
                    style={{ boxShadow: `0 0 0 2px rgba(255,255,255,0.1), 0 0 28px ${glow}, 0 8px 32px rgba(0,0,0,0.5)` }}
                  />
                )}

                <h3 className="cn-overlay-title" style={{ textShadow: `0 0 20px ${glow}` }}>
                  {starTitle}
                </h3>

                {starDate && (
                  <p className="cn-overlay-date">{starDate}</p>
                )}

                <div className="cn-overlay-nav">
                  <button className="cn-nav-btn" onClick={handlePrev} aria-label="Anterior">
                    <IconChevronLeft />
                  </button>
                  <span className="cn-overlay-counter">
                    {activeStar + 1} / {displayFotos.length}
                  </span>
                  <button className="cn-nav-btn" onClick={handleNext} aria-label="Siguiente">
                    <IconChevronRight />
                  </button>
                </div>

                <button className="cn-overlay-cerrar" onClick={() => setActiveStar(null)}>
                  <span>Cerrar</span>
                  <IconClose />
                </button>
              </div>
            </div>
          )}

          {/* Pergamino export modal */}
          {showPergamino && (
            <PergaminoExport
              data={data}
              theme={tema}
              onClose={() => setShowPergamino(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
