import React, { useRef, useState, useEffect } from 'react';
import { useGalaxy } from './useGalaxy';
import './galaxia.css';
import inicioGif   from './inicio.gif';
import musicaDefault from './Music.mp3';

// ─── Theme helpers ────────────────────────────────────────────────────────────
const TEMA_BG = {
  cosmos:    '#020b18',
  romantica: '#080010',
  dorada:    '#0d0800',
  esmeralda: '#001a0d',
};
const TEMA_GLOW = {
  cosmos:    'rgba(79, 172, 254, 0.85)',
  romantica: 'rgba(255, 107, 157, 0.85)',
  dorada:    'rgba(255, 210, 0, 0.85)',
  esmeralda: 'rgba(16, 185, 129, 0.85)',
};

// ─── Per-photo content (displayed in overlay) ─────────────────────────────────
const PHOTO_TITLES = [
  'Para Siempre',
  'Mi Tesoro',
  'Amor Infinito',
  'Mi Mundo',
  'Tu Sonrisa',
  'Mi Todo',
  'Alma Gemela',
  'Mi Cielo',
];

const PHOTO_MESSAGES = [
  'No me importa cuántas vidas tenga que vivir, en cada una de ellas te elegiré a ti. Para siempre y un día más.',
  'Eres el tesoro más grande que la vida me ha dado. Contigo todo tiene sentido y nada me falta.',
  'Mi amor por ti no tiene límites ni fronteras. Crece cada día, igual que tú creces en mi corazón.',
  'Eres mi mundo entero, mi razón de despertar cada mañana con una sonrisa. Te amo infinitamente.',
  'Cuando sonríes, el universo se detiene. Esa sonrisa es mi lugar favorito en todo el mundo.',
  'Eres absolutamente todo para mí. Cada momento a tu lado es un regalo que atesoro eternamente.',
  'Dos almas que se encontraron para no separarse jamás. Contigo he encontrado mi verdadero hogar.',
  'Eres mi cielo azul en los días grises, mi sol en la tormenta, mi calma perfecta en el caos.',
];

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, speed = 35) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [text, speed]);

  return { displayed, done };
}

// ─── Splash screen ────────────────────────────────────────────────────────────
function SplashScreen({ titulo, mensaje, para, glow, onStart }) {
  return (
    <div className="gm-splash">
      <div className="gm-splash-card">
        <h1 className="gm-splash-title" style={{ textShadow: `0 0 8px rgba(255,255,255,.9), 0 0 30px ${glow}, 0 0 60px ${glow}` }}>
          {titulo}
        </h1>

        <img src={inicioGif} className="gm-splash-gif" alt="" />

        {para && (
          <p className="gm-splash-para">Para {para}</p>
        )}

        {mensaje && (
          <p className="gm-splash-mensaje">{mensaje}</p>
        )}

        <button className="gm-splash-btn" onClick={onStart}>
          Iniciar
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GalaxyScene({ data }) {
  const [started, setStarted] = useState(false);

  const tema  = data?.tema  || 'romantica';
  const glow  = TEMA_GLOW[tema] || TEMA_GLOW.romantica;
  const bg    = TEMA_BG[tema]   || TEMA_BG.romantica;

  const titulo  = data?.titulo  || 'Galaxia de Recuerdos';
  const mensaje = data?.mensaje || 'Un universo de recuerdos creado especialmente para ti.';
  const para    = data?.para    || '';

  const wrapperStyle = {
    background: bg,
    '--gm-bg':   bg,
    '--gm-glow': glow,
  };

  if (!started) {
    return (
      <div className="gm-wrapper" style={wrapperStyle}>
        <SplashScreen
          titulo={titulo}
          mensaje={mensaje}
          para={para}
          glow={glow}
          onStart={() => setStarted(true)}
        />
      </div>
    );
  }

  return (
    <GalaxyView
      data={data}
      titulo={titulo}
      para={para}
      glow={glow}
      wrapperStyle={wrapperStyle}
      musicaDefault={musicaDefault}
    />
  );
}

// ─── Galaxy view (Three.js active) ───────────────────────────────────────────
function GalaxyView({ data, titulo, para, mensaje, glow, wrapperStyle, musicaDefault }) {
  const containerRef = useRef(null);
  const [activePortal, setActivePortal] = useState(null);

  // Duplicate user photos to always fill 8 slots
  const rawFotos = Array.isArray(data?.fotos) ? data.fotos.slice(0, 8) : [];
  const displayFotos = rawFotos.length > 0
    ? Array.from({ length: 8 }, (_, i) => rawFotos[i % rawFotos.length])
    : [];

  // Per-portal content
  const portalTitle   = activePortal !== null ? PHOTO_TITLES[activePortal % PHOTO_TITLES.length]   : '';
  const portalMessage = activePortal !== null ? PHOTO_MESSAGES[activePortal % PHOTO_MESSAGES.length] : '';

  // Typewriter — resets whenever activePortal changes (also on reopen)
  const { displayed, done } = useTypewriter(activePortal !== null ? portalMessage : '');

  // Stable click ref for Three.js — updated in effect to avoid render-time ref write
  const onPortalClickRef = useRef(null);
  useEffect(() => {
    onPortalClickRef.current = (idx) => setActivePortal((prev) => (prev === idx ? null : idx));
  }, []); // setActivePortal is stable

  // Enrich data with default music
  const enrichedData = {
    ...data,
    musica: data?.musica || musicaDefault,
    displayFotos,
  };

  const { replayIntro } = useGalaxy(containerRef, enrichedData, onPortalClickRef);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="gm-wrapper" style={wrapperStyle}>
      <div ref={containerRef} className="gm-canvas" />

      {/* Title */}
      <h1 className="gm-titulo">{titulo}</h1>

      {/* Para badge — top right */}
      {para && (
        <div className="gm-firma-badge">
          <span className="gm-firma-label">Para</span>
          <span className="gm-firma-nombre" style={{ textShadow: `0 0 20px ${glow}, 0 0 40px ${glow}` }}>
            {para}
          </span>
        </div>
      )}

      {/* Empty state */}
      {displayFotos.length === 0 && (
        <div className="gm-empty">
          <span className="gm-empty-icon">✨</span>
          <p>Personaliza tu regalo para ver tus fotos entre las estrellas</p>
        </div>
      )}

      {displayFotos.length > 0 && (
        <p className="gm-tap-hint">Toca una estrella para abrirla</p>
      )}

      {/* Controls */}
      <div className="gm-controls">
        <button className="gm-btn" onClick={replayIntro} title="Reiniciar animación">↩</button>
        <button className="gm-btn" onClick={handleFullscreen} title="Pantalla completa">⛶</button>
      </div>

      {/* Photo overlay */}
      {activePortal !== null && (
        <div className="gm-overlay" onClick={() => setActivePortal(null)}>
          <div className="gm-overlay-card" onClick={(e) => e.stopPropagation()}>

            {/* Heart accent */}
            <span className="gm-overlay-heart" style={{ color: glow, filter: `drop-shadow(0 0 8px ${glow})` }}>
              ♥
            </span>

            {/* Circular photo */}
            {displayFotos[activePortal] && (
              <img
                src={displayFotos[activePortal]}
                alt={`Momento ${activePortal + 1}`}
                className="gm-overlay-img"
                style={{ boxShadow: `0 0 0 3px rgba(255,255,255,.08), 0 0 32px ${glow}, 0 8px 32px rgba(0,0,0,.5)` }}
              />
            )}

            {/* Per-photo title */}
            <p className="gm-overlay-photo-title" style={{ textShadow: `0 0 20px ${glow}` }}>
              {portalTitle}
            </p>

            {/* Typewriter message */}
            <p className="gm-overlay-typewriter">
              {displayed}
              {!done && <span className="gm-cursor" />}
            </p>

            {/* Close button */}
            <button
              className="gm-overlay-cerrar"
              onClick={() => setActivePortal(null)}
            >
              Cerrar +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
