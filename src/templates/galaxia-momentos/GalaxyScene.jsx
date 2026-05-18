import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useGalaxy } from './useGalaxy';
import './galaxia.css';
import inicioGif     from './inicio.gif';
import musicaDefault from './Music.mp3';
import Image1 from './Images/Image1.avif';
import Image2 from './Images/Image2.avif';
import Image3 from './Images/Image3.avif';
import Image4 from './Images/Image4.avif';
import Image5 from './Images/Image5.avif';
import Image6 from './Images/Image6.avif';

const PREVIEW_FOTOS = [Image1, Image2, Image3, Image4, Image5, Image6];

// ─── SVG icons ────────────────────────────────────────────────────────────────
const IconSparkle = ({ size = 48 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M12 0l1.6 9 9.4 3-9.4 3-1.6 9-1.6-9-9.4-3 9.4-3z" />
  </svg>
);

const IconReplay = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-3.5-7.13" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const IconFullscreen = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" />
  </svg>
);

const IconHeart = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
  </svg>
);

const IconClose = ({ size = 12 }) => (
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

// ─── Per-photo content ────────────────────────────────────────────────────────
const PHOTO_TITLES = [
  'Para Siempre', 'Mi Tesoro', 'Amor Infinito', 'Mi Mundo',
  'Tu Sonrisa',   'Mi Todo',   'Alma Gemela',   'Mi Cielo',
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

// ─── Entry point ──────────────────────────────────────────────────────────────
export default function GalaxyScene({ data }) {
  const resolved = { tema: 'romantica', ...data };
  return <GalaxyView data={resolved} />;
}

// ─── Galaxy view ─────────────────────────────────────────────────────────────
function GalaxyView({ data }) {
  const containerRef   = useRef(null);
  const audioRef       = useRef(null);
  const splashTimerRef = useRef(null);
  const swipeStartX    = useRef(null);

  const [started,     setStarted]     = useState(false);
  const [splashOut,   setSplashOut]   = useState(false);
  const [activePortal, setActivePortal] = useState(null);
  const [isMuted,     setIsMuted]     = useState(false);

  const tema  = data?.tema  || 'romantica';
  const glow  = TEMA_GLOW[tema] || TEMA_GLOW.romantica;
  const bg    = TEMA_BG[tema]   || TEMA_BG.romantica;

  const titulo  = data?.titulo  || 'Galaxia de Momentos';
  const mensaje = data?.mensaje || 'Un universo de recuerdos creado especialmente para ti.';
  const para    = data?.para    || '';

  const wrapperStyle = { background: bg, '--gm-bg': bg, '--gm-glow': glow };

  // Photo duplication
  const fotosKey = Array.isArray(data?.fotos) ? data.fotos.join('|') : '';
  const displayFotos = useMemo(() => {
    const arr = Array.isArray(data?.fotos) ? data.fotos.slice(0, 8) : [];
    return arr.length === 0
      ? [...PREVIEW_FOTOS, ...PREVIEW_FOTOS]
      : [...arr, ...arr];
  }, [fotosKey]);

  // Per-portal content
  const portalTitle   = activePortal !== null ? PHOTO_TITLES[activePortal % PHOTO_TITLES.length]     : '';
  const portalMessage = activePortal !== null ? PHOTO_MESSAGES[activePortal % PHOTO_MESSAGES.length] : '';
  const { displayed, done } = useTypewriter(activePortal !== null ? portalMessage : '');

  // Stable click ref
  const onPortalClickRef = useRef(null);
  useEffect(() => {
    onPortalClickRef.current = (idx) =>
      setActivePortal((prev) => (prev === idx ? null : idx));
  }, []);

  // Three.js — canvas always active (starts in explore mode showing galaxy)
  const enrichedData = useMemo(() => ({
    tema: data?.tema,
    displayFotos,
  }), [data?.tema, displayFotos]);

  const { replayIntro } = useGalaxy(containerRef, enrichedData, onPortalClickRef);

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    };
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleStart = () => {
    setSplashOut(true);
    replayIntro();

    const src = data?.musica || musicaDefault;
    if (src) {
      const audio = new Audio(src);
      audio.loop   = true;
      audio.volume = 0;
      audioRef.current = audio;
      audio.play().catch(() => {});
      let vol = 0;
      const fadeTimer = setInterval(() => {
        vol = Math.min(vol + 0.016, 0.78);
        if (audioRef.current) audioRef.current.volume = vol;
        if (vol >= 0.78) clearInterval(fadeTimer);
      }, 60);
    }

    splashTimerRef.current = setTimeout(() => setStarted(true), 500);
  };

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !audioRef.current.muted;
    setIsMuted((m) => !m);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // Overlay navigation
  const handlePrev = () =>
    setActivePortal((prev) => (prev - 1 + displayFotos.length) % displayFotos.length);
  const handleNext = () =>
    setActivePortal((prev) => (prev + 1) % displayFotos.length);

  // Swipe detection (pointer events, works mouse + touch)
  const handleSwipeStart = (e) => { swipeStartX.current = e.clientX; };
  const handleSwipeEnd   = (e) => {
    if (swipeStartX.current === null) return;
    const delta = e.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (delta >  50) handlePrev();
    else if (delta < -50) handleNext();
  };
  const handleSwipeCancel = () => { swipeStartX.current = null; };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="gm-wrapper" style={wrapperStyle}>

      {/* Canvas — always in DOM so Three.js shows galaxy behind the splash */}
      <div ref={containerRef} className="gm-canvas" />

      {/* Splash — overlay that fades out on Iniciar */}
      {!started && (
        <div className={`gm-splash${splashOut ? ' gm-splash--out' : ''}`}>
          <div className="gm-splash-card">
            <h1
              className="gm-splash-title"
              style={{ textShadow: `0 0 8px rgba(255,255,255,.9), 0 0 30px ${glow}, 0 0 60px ${glow}` }}
            >
              {titulo}
            </h1>

            <img src={inicioGif} className="gm-splash-gif" alt="" />

            {para && <p className="gm-splash-para">Para {para}</p>}

            {mensaje && <p className="gm-splash-mensaje">{mensaje}</p>}

            <button className="gm-splash-btn" onClick={handleStart}>
              Iniciar
            </button>
          </div>
        </div>
      )}

      {/* Main UI — appears after splash */}
      {started && (
        <>
          <h1 className="gm-titulo">{titulo}</h1>

          {para && (
            <div className="gm-firma-badge">
              <span className="gm-firma-label">Para</span>
              <span
                className="gm-firma-nombre"
                style={{ textShadow: `0 0 20px ${glow}, 0 0 40px ${glow}` }}
              >
                {para}
              </span>
            </div>
          )}

          {displayFotos.length === 0 && (
            <div className="gm-empty" style={{ color: glow }}>
              <span className="gm-empty-icon"><IconSparkle /></span>
              <p>Personaliza tu regalo para ver tus fotos entre las estrellas</p>
            </div>
          )}

          {displayFotos.length > 0 && (
            <p className="gm-tap-hint">Toca una estrella para abrirla</p>
          )}

          <div className="gm-controls">
            <button className="gm-btn" onClick={replayIntro} title="Reiniciar animación" aria-label="Reiniciar">
              <IconReplay />
            </button>
            <button
              className="gm-btn"
              onClick={toggleMute}
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <IconVolumeOff /> : <IconVolume />}
            </button>
            <button className="gm-btn" onClick={handleFullscreen} title="Pantalla completa" aria-label="Pantalla completa">
              <IconFullscreen />
            </button>
          </div>

          {/* Photo overlay */}
          {activePortal !== null && (
            <div className="gm-overlay" onClick={() => setActivePortal(null)}>
              <div
                className="gm-overlay-card"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={handleSwipeStart}
                onPointerUp={handleSwipeEnd}
                onPointerCancel={handleSwipeCancel}
              >
                <span
                  className="gm-overlay-heart"
                  style={{ color: glow, filter: `drop-shadow(0 0 8px ${glow})` }}
                  aria-hidden="true"
                >
                  <IconHeart />
                </span>

                {displayFotos[activePortal] && (
                  <img
                    src={displayFotos[activePortal]}
                    alt={`Momento ${activePortal + 1}`}
                    className="gm-overlay-img"
                    style={{
                      boxShadow: `0 0 0 3px rgba(255,255,255,.08), 0 0 32px ${glow}, 0 8px 32px rgba(0,0,0,.5)`,
                    }}
                  />
                )}

                <p className="gm-overlay-photo-title" style={{ textShadow: `0 0 20px ${glow}` }}>
                  {portalTitle}
                </p>

                <p className="gm-overlay-typewriter">
                  {displayed}
                  {!done && <span className="gm-cursor" />}
                </p>

                {/* Prev / counter / next */}
                <div className="gm-overlay-nav">
                  <button className="gm-nav-btn" onClick={handlePrev} aria-label="Foto anterior">
                    <IconChevronLeft />
                  </button>
                  <span className="gm-overlay-counter">
                    {activePortal + 1} / {displayFotos.length}
                  </span>
                  <button className="gm-nav-btn" onClick={handleNext} aria-label="Foto siguiente">
                    <IconChevronRight />
                  </button>
                </div>

                <button className="gm-overlay-cerrar" onClick={() => setActivePortal(null)}>
                  <span>Cerrar</span>
                  <IconClose />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
