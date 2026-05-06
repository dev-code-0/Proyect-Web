import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useArbol } from './useArbol';
import './arbol.css';

// ─── SVG icons ────────────────────────────────────────────────────────────────
const IconTree = ({ size = 64 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M17 8C8 10 5.9 16.17 3.82 21L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-12 5a9 9 0 0 0-3 5c-.5-1.6-.5-3.2 0-4.7C8.5 7.2 13 5 17 8z" />
    <path d="M11 21.11A17.16 17.16 0 0 1 11 17c.5-2.5 2-4.8 4-6l-1 2a10.5 10.5 0 0 1-1 3.5" opacity=".5" />
    <rect x="11" y="20" width="2" height="4" rx="1" />
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

const IconLeaf = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M17 8C8 10 5.9 16.17 3.82 21L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-12 5a9 9 0 0 0-3 5c-.5-1.6-.5-3.2 0-4.7C8.5 7.2 13 5 17 8z" />
  </svg>
);

const IconClose = ({ size = 12 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" width={size} height={size} aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

// ─── Theme config ─────────────────────────────────────────────────────────────
const TEMA_BG = {
  cerezo: '#0a0005',
  roble:  '#030a00',
  otono:  '#0a0500',
  noche:  '#000510',
};
const TEMA_GLOW = {
  cerezo: 'rgba(255,107,157,0.85)',
  roble:  'rgba(74,222,128,0.85)',
  otono:  'rgba(249,115,22,0.85)',
  noche:  'rgba(129,140,248,0.85)',
};

// ─── Photo overlay titles & messages ─────────────────────────────────────────
const PHOTO_TITLES = [
  'Tu Amor', 'Mi Raíz', 'Tu Fuerza', 'Siempre Mamá',
  'Tu Abrazo', 'Mi Hogar', 'Tu Sonrisa', 'Mi Todo',
];

const PHOTO_MESSAGES = [
  'Tu amor ha sido el suelo fértil donde crecí. Gracias por darme raíces fuertes y alas para volar.',
  'Como el árbol que nace de una semilla, yo nací de tu amor. Todo lo que soy te lo debo a ti.',
  'En cada momento difícil, tu fuerza fue mi refugio. Eres la persona más valiente que conozco.',
  'No importa el tiempo que pase, siempre serás mi mamá, mi guía, mi luz favorita en este mundo.',
  'Tu abrazo es el lugar más seguro del universo. Ahí todo duele menos y todo tiene sentido.',
  'Donde tú estás, ahí está mi hogar. Gracias por construir un nido lleno de amor para mí.',
  'Tu sonrisa ilumina cualquier habitación. Espero que hoy sea el día que más hayas sonreído.',
  'Eres absolutamente todo para mí. Cada recuerdo contigo es un tesoro que guardo en el corazón.',
];

const TIP_COUNT = 18;

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDisplayFotos(rawFotos, tema) {
  const base = Array.isArray(rawFotos) ? rawFotos.slice(0, 8) : [];
  if (base.length === 0) return [];

  const expanded = [];
  while (expanded.length < TIP_COUNT) expanded.push(...base);
  expanded.length = TIP_COUNT;

  const seed = hashString(`${base.join('|')}|${tema || 'cerezo'}|${TIP_COUNT}`);
  const rand = mulberry32(seed);
  return shuffle([...expanded], rand);
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, speed = 35) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);
  const timerRef                  = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    if (!text) return;
    let i = 0;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timerRef.current); setDone(true); }
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [text, speed]);

  return { displayed, done };
}

// ─── Splash screen ────────────────────────────────────────────────────────────
function SplashScreen({ titulo, mensaje, para, glow, glowColor, onStart }) {
  return (
    <div className="am-splash">
      <div className="am-splash-card">
        <span className="am-splash-icon" style={{ color: glowColor }}>
          <IconTree size={72} />
        </span>

        <h1
          className="am-splash-title"
          style={{ textShadow: `0 0 8px rgba(255,255,255,.9), 0 0 30px ${glow}, 0 0 60px ${glow}` }}
        >
          {titulo}
        </h1>

        {para && <p className="am-splash-para">Para {para}</p>}

        {mensaje && <p className="am-splash-mensaje">{mensaje}</p>}

        <button className="am-splash-btn" onClick={onStart}>
          Ver el árbol
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ArbolScene({ data }) {
  const [started, setStarted] = useState(false);

  const tema     = data?.tema || 'cerezo';
  const glow     = TEMA_GLOW[tema] || TEMA_GLOW.cerezo;
  const bg       = TEMA_BG[tema]   || TEMA_BG.cerezo;
  const titulo   = data?.titulo  || 'Árbol de Momentos';
  const mensaje  = data?.mensaje || 'Un árbol lleno de recuerdos, cultivado con amor.';
  const para     = data?.para    || '';

  const glowColor = glow.replace('0.85', '1');

  const wrapperStyle = {
    background: bg,
    '--am-bg':         bg,
    '--am-glow-color': glowColor,
  };

  if (!started) {
    return (
      <div className="am-wrapper" style={wrapperStyle}>
        <SplashScreen
          titulo={titulo}
          mensaje={mensaje}
          para={para}
          glow={glow}
          glowColor={glowColor}
          onStart={() => setStarted(true)}
        />
      </div>
    );
  }

  return (
    <ArbolView
      data={data}
      titulo={titulo}
      para={para}
      glow={glow}
      glowColor={glowColor}
      wrapperStyle={wrapperStyle}
    />
  );
}

// ─── Tree view (Three.js active) ──────────────────────────────────────────────
function ArbolView({ data, titulo, para, glow, glowColor, wrapperStyle }) {
  const containerRef   = useRef(null);
  const [activeLeaf, setActiveLeaf] = useState(null);

  const fotosKey     = Array.isArray(data?.fotos) ? data.fotos.join('|') : '';
  const temaKey      = data?.tema || 'cerezo';
  const displayFotos = useMemo(
    () => buildDisplayFotos(data?.fotos, temaKey),
    [fotosKey, temaKey],
  );

  const leafTitle   = activeLeaf !== null ? PHOTO_TITLES[activeLeaf % PHOTO_TITLES.length]   : '';
  const leafMessage = activeLeaf !== null ? PHOTO_MESSAGES[activeLeaf % PHOTO_MESSAGES.length] : '';

  const { displayed, done } = useTypewriter(activeLeaf !== null ? leafMessage : '');

  const onLeafClickRef = useRef(null);
  useEffect(() => {
    onLeafClickRef.current = (idx) => setActiveLeaf((prev) => (prev === idx ? null : idx));
  }, []);

  const enrichedData = useMemo(() => ({
    tema:         data?.tema,
    musica:       data?.musica,
    displayFotos,
  }), [data?.tema, data?.musica, displayFotos]);

  const { replayIntro } = useArbol(containerRef, enrichedData, onLeafClickRef);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="am-wrapper" style={wrapperStyle}>
      <div ref={containerRef} className="am-canvas" />

      <h1 className="am-titulo">{titulo}</h1>

      {para && (
        <div className="am-firma-badge">
          <span className="am-firma-label">Para</span>
          <span className="am-firma-nombre" style={{ textShadow: `0 0 20px ${glow}, 0 0 40px ${glow}` }}>
            {para}
          </span>
        </div>
      )}

      <p className="am-tap-hint">Toca una hoja para abrirla</p>

      <div className="am-controls">
        <button className="am-btn" onClick={replayIntro} title="Reiniciar animación" aria-label="Reiniciar">
          <IconReplay />
        </button>
        <button className="am-btn" onClick={handleFullscreen} title="Pantalla completa" aria-label="Pantalla completa">
          <IconFullscreen />
        </button>
      </div>

      {activeLeaf !== null && (
        <div className="am-overlay" onClick={() => setActiveLeaf(null)}>
          <div className="am-overlay-card" onClick={(e) => e.stopPropagation()}>

            <span
              className="am-overlay-leaf-icon"
              style={{ color: glowColor, filter: `drop-shadow(0 0 8px ${glowColor})` }}
              aria-hidden="true"
            >
              <IconLeaf />
            </span>

            {displayFotos[activeLeaf % Math.max(displayFotos.length, 1)] && (
              <img
                src={displayFotos[activeLeaf % displayFotos.length]}
                alt={`Momento ${activeLeaf + 1}`}
                className="am-overlay-img"
                style={{ boxShadow: `0 0 0 3px rgba(255,255,255,.08), 0 0 32px ${glow}, 0 8px 32px rgba(0,0,0,.5)` }}
              />
            )}

            <p className="am-overlay-photo-title" style={{ textShadow: `0 0 20px ${glow}` }}>
              {leafTitle}
            </p>

            <p className="am-overlay-typewriter">
              {displayed}
              {!done && <span className="am-cursor" />}
            </p>

            <button className="am-overlay-cerrar" onClick={() => setActiveLeaf(null)}>
              <span>Cerrar</span>
              <IconClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
