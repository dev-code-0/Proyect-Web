import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useJardin } from './useJardin';
import './jardin.css';
import defaultMusic from './music.mp3';
import confetti from 'canvas-confetti';

// ─── Placeholder photos (canvas-generated) ───────────────────────────────────
const PLACEHOLDER_PALETTES = {
  rosas:     [['#ff6b9d','#c9184a'],['#ff8fab','#ff4d6d'],['#ffb3c1','#ff758c'],['#f72585','#b5179e'],['#ff6b9d','#ff4d6d'],['#ffc8dd','#ff85a1']],
  girasoles: [['#ffd200','#f77f00'],['#ffc100','#d62828'],['#ffbe0b','#fb5607'],['#ffe169','#f3a712'],['#ffd200','#fb5607'],['#ffd166','#ef476f']],
  lavanda:   [['#c084fc','#a855f7'],['#d946ef','#9333ea'],['#e879f9','#7c3aed'],['#c084fc','#8b5cf6'],['#a78bfa','#7c3aed'],['#f0abfc','#c026d3']],
  primavera: [['#34d399','#10b981'],['#6ee7b7','#059669'],['#a7f3d0','#34d399'],['#d1fae5','#6ee7b7'],['#34d399','#059669'],['#6ee7b7','#10b981']],
};

function generatePlaceholderFoto(tema, index) {
  const palette = PLACEHOLDER_PALETTES[tema] || PLACEHOLDER_PALETTES.rosas;
  const [c1, c2] = palette[index % palette.length];
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  // Subtle inner circle accent
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(128, 128, 70, 0, Math.PI * 2);
  ctx.fill();
  return canvas.toDataURL('image/png');
}

// ─── SVG icons ────────────────────────────────────────────────────────────────
const IconLeaf = ({ size = 48 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-5 8Z"/>
  </svg>
);

const IconReplay = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <path d="M21 12a9 9 0 1 1-3.5-7.13"/>
    <polyline points="21 3 21 9 15 9"/>
  </svg>
);

const IconFullscreen = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
    <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"/>
  </svg>
);

const IconFlower = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M12 22a4 4 0 0 1-4-4c0-1.5.9-2.8 2.2-3.4a4 4 0 0 1-3.4-2.2C6 11.1 6 10.1 6.4 9.2A4 4 0 0 1 2 5a4 4 0 0 1 7.2-2.4A4 4 0 0 1 12 2a4 4 0 0 1 2.8 1.6A4 4 0 0 1 22 5a4 4 0 0 1-4.4 4.2c.4.9.4 1.9 0 2.8a4 4 0 0 1-3.4 2.2c1.3.6 2.2 1.9 2.2 3.4a4 4 0 0 1-4 4zm0-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
  </svg>
);

const IconClose = ({ size = 12 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width={size} height={size} aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>
);

const IconCamera = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const IconPlay = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconPause = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
);

// ─── Theme helpers ────────────────────────────────────────────────────────────
const TEMA_BG = {
  rosas:     '#0a0005',
  girasoles: '#0a0800',
  lavanda:   '#05000a',
  primavera: '#000a05',
};
const TEMA_GLOW = {
  rosas:     'rgba(255,107,157,0.85)',
  girasoles: 'rgba(255,210,0,0.85)',
  lavanda:   'rgba(192,132,252,0.85)',
  primavera: 'rgba(52,211,153,0.85)',
};

// ─── Per-flower overlay content ───────────────────────────────────────────────
const PHOTO_TITLES = [
  'Un Recuerdo Especial',
  'Siempre Contigo',
  'Tu Amor me Guía',
  'Gracias, Mamá',
  'Mi Mayor Tesoro',
  'Para Ti, con Amor',
  'Momentos Eternos',
  'Mi Refugio Siempre',
];

const PHOTO_MESSAGES = [
  'En cada momento que vivimos juntos hay una flor que nace en mi corazón. Gracias por ser mi jardín más bello.',
  'Caminar a tu lado es lo más hermoso que me ha dado la vida. Siempre te llevaré en cada paso que dé.',
  'Tu presencia ha sido mi luz en los días oscuros, mi sombra en el sol, mi calma en la tormenta. Gracias.',
  'No existen palabras suficientes para decirte cuánto te agradezco todo lo que has dado por mí. Lo eres todo.',
  'Eres el tesoro más grande que guarda mi corazón. Te amo hoy, mañana y todos los días que me queden.',
  'Este jardín lo planté con cada recuerdo tuyo, con cada abrazo, con cada sonrisa. Es solo para ti.',
  'Algunos momentos son tan especiales que se quedan para siempre en el alma. Este es uno de ellos, contigo.',
  'Donde sea que estés, mi amor por ti llena cada rincón del mundo. Eres mi refugio eterno.',
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
  const [loading, setLoading] = useState(true);
  const iconColor = glow.replace('rgba(', 'rgb(').replace(/,[^,)]+\)/, ')');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="jm-splash">
      <div className="jm-splash-card">
        <div className="jm-splash-icon" style={{ color: iconColor }}>
          <IconLeaf size={52} />
        </div>

        <h1 className="jm-splash-title" style={{ textShadow: `0 0 8px rgba(255,255,255,.9), 0 0 30px ${glow}, 0 0 60px ${glow}` }}>
          {titulo}
        </h1>

        {para && (
          <p className="jm-splash-para">Para {para}</p>
        )}

        {mensaje && (
          <p className="jm-splash-mensaje">{mensaje}</p>
        )}

        {loading ? (
          <p className="jm-splash-loading" style={{ color: glow }}>Cargando la magia...</p>
        ) : (
          <button className="jm-splash-btn" onClick={onStart} style={{ borderColor: glow }}>
            Entrar al jardín
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function JardinScene({ data }) {
  const [started, setStarted] = useState(false);

  const tema   = data?.tema   || 'rosas';
  const glow   = TEMA_GLOW[tema] || TEMA_GLOW.rosas;
  const bg     = TEMA_BG[tema]   || TEMA_BG.rosas;
  const titulo  = data?.titulo  || 'Jardín de Recuerdos';
  const mensaje = data?.mensaje || 'Un jardín lleno de amor, creado especialmente para ti.';
  const de      = data?.de     || '';
  const para    = data?.para   || '';

  const wrapperStyle = {
    background: bg,
    '--jm-bg':   bg,
    '--jm-glow': glow,
  };

  if (!started) {
    return (
      <div className="jm-wrapper" style={wrapperStyle}>
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
    <JardinView
      data={data}
      titulo={titulo}
      de={de}
      para={para}
      glow={glow}
      wrapperStyle={wrapperStyle}
    />
  );
}

// ─── Garden view (Three.js active) ───────────────────────────────────────────
function JardinView({ data, titulo, de, para, glow, wrapperStyle }) {
  const containerRef   = useRef(null);
  const [activeFlower, setActiveFlower] = useState(null);

  const tema      = data?.tema || 'rosas';
  const fotosKey  = Array.isArray(data?.fotos) ? data.fotos.join('|') : '';

  // Placeholders (6 gradient images) — only recomputed when tema changes
  const placeholders = useMemo(
    () => Array.from({ length: 18 }, (_, i) => generatePlaceholderFoto(tema, i)),
    [tema]
  );

  const displayFotos = useMemo(() => {
    const arr = Array.isArray(data?.fotos) ? data.fotos.slice(0, 8) : [];
    if (arr.length === 0) return placeholders;
    // Tile photos to always fill 18 flowers around Saturn
    return Array.from({ length: 18 }, (_, i) => arr[i % arr.length]);
  }, [fotosKey, placeholders]);

  // Per-flower overlay text
  const flowerTitle   = activeFlower !== null ? PHOTO_TITLES[activeFlower   % PHOTO_TITLES.length]   : '';
  const flowerMessage = activeFlower !== null ? PHOTO_MESSAGES[activeFlower % PHOTO_MESSAGES.length] : '';
  const { displayed, done } = useTypewriter(activeFlower !== null ? flowerMessage : '');

  // Stable ref so Three.js never captures stale closure
  const onFlowerClickRef = useRef(null);
  const [touring, setTouring] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  useEffect(() => {
    onFlowerClickRef.current = (idx) => {
      setTouring(false);
      setActiveFlower((prev) => {
        if (prev !== idx) {
          const m = glow.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          const hex = m
            ? `#${parseInt(m[1]).toString(16).padStart(2,'0')}${parseInt(m[2]).toString(16).padStart(2,'0')}${parseInt(m[3]).toString(16).padStart(2,'0')}`
            : '#ff6b9d';
          confetti({
            particleCount: 72,
            spread: 80,
            origin: { y: 0.55 },
            colors: [hex, '#ffffff', '#fff0f8', hex],
            startVelocity: 30,
            gravity: 1.15,
            scalar: 0.82,
            decay: 0.91,
          });
        }
        return prev === idx ? null : idx;
      });
    };
  }, [glow]);

  // Tour logic
  useEffect(() => {
    let timer;
    if (touring) {
      if (activeFlower === null) {
        timer = setTimeout(() => {
          setActiveFlower(tourIndex);
        }, 1500); // Wait 1.5s between flowers
      } else {
        timer = setTimeout(() => {
          setActiveFlower(null);
          setTourIndex((prev) => (prev + 1) % displayFotos.length);
        }, 7500); // 7.5s to read the message
      }
    }
    return () => clearTimeout(timer);
  }, [touring, activeFlower, tourIndex, displayFotos.length]);

  // Memoize so the Three.js effect only restarts on meaningful changes
  const enrichedData = useMemo(() => ({
    tema:         data?.tema,
    musica:       data?.musica || defaultMusic,
    displayFotos,
  }), [data?.tema, data?.musica, displayFotos]);

  const { replayIntro } = useJardin(containerRef, enrichedData, onFlowerClickRef);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleTakePhoto = () => {
    if (containerRef.current?.takePhoto) {
      containerRef.current.takePhoto();
    }
  };

  return (
    <div className="jm-wrapper" style={wrapperStyle}>
      <div ref={containerRef} className="jm-canvas" />

      {/* Title */}
      <h1 className="jm-titulo">{titulo}</h1>

      {/* De / Para badge — top right */}
      {(de || para) && (
        <div className="jm-firma-badge">
          {de && (
            <>
              <span className="jm-firma-label">De</span>
              <span className="jm-firma-nombre" style={{ textShadow: `0 0 20px ${glow}, 0 0 40px ${glow}` }}>
                {de}
              </span>
            </>
          )}
          {de && para && <span className="jm-firma-sep" />}
          {para && (
            <>
              <span className="jm-firma-label">Para</span>
              <span className="jm-firma-nombre" style={{ textShadow: `0 0 20px ${glow}, 0 0 40px ${glow}` }}>
                {para}
              </span>
            </>
          )}
        </div>
      )}

      <p className="jm-tap-hint">Toca una flor para abrirla</p>

      {/* Controls */}
      <div className="jm-controls">
        <button className="jm-btn" onClick={() => setTouring(!touring)} title={touring ? "Pausar tour" : "Modo tour automático"} aria-label="Tour">
          {touring ? <IconPause /> : <IconPlay />}
        </button>
        <button className="jm-btn" onClick={handleTakePhoto} title="Tomar foto" aria-label="Foto">
          <IconCamera />
        </button>
        <button className="jm-btn" onClick={replayIntro} title="Reiniciar animación" aria-label="Reiniciar">
          <IconReplay />
        </button>
        <button className="jm-btn" onClick={handleFullscreen} title="Pantalla completa" aria-label="Pantalla completa">
          <IconFullscreen />
        </button>
      </div>

      {/* Photo overlay */}
      {activeFlower !== null && (
        <div className="jm-overlay" onClick={() => setActiveFlower(null)}>
          <div className="jm-overlay-card" onClick={(e) => e.stopPropagation()}>

            {/* Flower accent */}
            <span className="jm-overlay-flower"
              style={{ color: glow, filter: `drop-shadow(0 0 8px ${glow})` }}
              aria-hidden="true">
              <IconFlower />
            </span>

            {/* Circular photo */}
            {displayFotos[activeFlower] && (
              <img
                src={displayFotos[activeFlower]}
                alt={`Recuerdo ${activeFlower + 1}`}
                className="jm-overlay-img"
                style={{ boxShadow: `0 0 0 3px rgba(255,255,255,.07), 0 0 32px ${glow}, 0 8px 32px rgba(0,0,0,.55)` }}
              />
            )}

            {/* Per-flower title */}
            <p className="jm-overlay-photo-title" style={{ textShadow: `0 0 20px ${glow}` }}>
              {flowerTitle}
            </p>

            {/* Typewriter message */}
            <p className="jm-overlay-typewriter">
              {displayed}
              {!done && <span className="jm-cursor" />}
            </p>

            {/* Close */}
            <button className="jm-overlay-cerrar" onClick={() => setActiveFlower(null)}>
              <span>Cerrar</span>
              <IconClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
