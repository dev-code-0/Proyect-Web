import { useState, useEffect, useRef } from "react";
import "./style.css";
import Image1 from "./images/image1.jpeg";
import Image2 from "./images/image2.jpeg";
import Image3 from "./images/image3.jpeg";
import ILOVEYOUSO from "./images/I-love-you-so.mp3";

// ─────────────────────────────────────────────
//  SVG: Caja futurista / cyberpunk
// ─────────────────────────────────────────────
function BoxSVG({ isOpen, isShaking }) {
  return (
    <svg
      className={`box-svg ${isShaking ? "box-shake" : ""}`}
      viewBox="0 0 220 240"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Definiciones: filtros de brillo neón ── */}
      <defs>
        <filter id="neon-magenta" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="neon-cyan" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="boxBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0033" />
          <stop offset="100%" stopColor="#000814" />
        </linearGradient>
        <linearGradient id="boxLid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#200040" />
          <stop offset="100%" stopColor="#001428" />
        </linearGradient>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="100%" stopColor="#ff00ff" />
        </linearGradient>
      </defs>

      {/* ── Cuerpo principal de la caja ── */}
      <rect
        className="box-body"
        x="15" y="110" width="190" height="120"
        rx="6"
        fill="url(#boxBody)"
        stroke="#ff00ff"
        strokeWidth="1.5"
        filter="url(#neon-magenta)"
      />

      {/* Líneas de detalle lateral izquierdo */}
      <line x1="15" y1="135" x2="205" y2="135" stroke="#ff00ff" strokeWidth="0.5" opacity="0.4" />
      <line x1="15" y1="160" x2="205" y2="160" stroke="#ff00ff" strokeWidth="0.5" opacity="0.2" />
      <line x1="15" y1="205" x2="205" y2="205" stroke="#ff00ff" strokeWidth="0.5" opacity="0.2" />

      {/* Panel de circuito izquierdo */}
      <rect x="22" y="145" width="40" height="25" rx="3" fill="none" stroke="#00ffff" strokeWidth="0.7" opacity="0.5" />
      <line x1="30" y1="152" x2="54" y2="152" stroke="#00ffff" strokeWidth="0.5" opacity="0.5" />
      <line x1="30" y1="158" x2="46" y2="158" stroke="#00ffff" strokeWidth="0.5" opacity="0.5" />
      <circle cx="57" cy="155" r="2" fill="#00ffff" opacity="0.6" className="circuit-dot" />

      {/* Panel de circuito derecho */}
      <rect x="158" y="145" width="40" height="25" rx="3" fill="none" stroke="#00ffff" strokeWidth="0.7" opacity="0.5" />
      <line x1="166" y1="152" x2="190" y2="152" stroke="#00ffff" strokeWidth="0.5" opacity="0.5" />
      <line x1="174" y1="158" x2="190" y2="158" stroke="#00ffff" strokeWidth="0.5" opacity="0.5" />
      <circle cx="163" cy="155" r="2" fill="#00ffff" opacity="0.6" className="circuit-dot" />

      {/* ── Cinta vertical ── */}
      <rect x="100" y="110" width="18" height="120" fill="url(#ribbonGrad)" opacity="0.6" />

      {/* ── Tapa de la caja ── */}
      <g className={`box-lid ${isOpen ? "lid-open" : ""}`}>
        <rect
          x="8" y="88" width="204" height="30"
          rx="5"
          fill="url(#boxLid)"
          stroke="#ff00ff"
          strokeWidth="1.5"
          filter="url(#neon-magenta)"
        />
        {/* Cinta horizontal en la tapa */}
        <rect x="8" y="88" width="204" height="30" rx="5" fill="url(#ribbonGrad)" opacity="0.15" />
        <rect x="100" y="88" width="18" height="30" fill="url(#ribbonGrad)" opacity="0.7" />
        {/* Moño central */}
        <ellipse cx="109" cy="88" rx="22" ry="14" fill="none" stroke="#ff00ff" strokeWidth="1.5" filter="url(#neon-magenta)" />
        <ellipse cx="109" cy="88" rx="14" ry="8" fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.6" />
        <circle cx="109" cy="88" r="4" fill="#ff00ff" filter="url(#neon-magenta)" />

        {/* Detalles de tapa */}
        <line x1="8" y1="103" x2="212" y2="103" stroke="#ff00ff" strokeWidth="0.5" opacity="0.3" />
        <rect x="20" y="93" width="30" height="10" rx="2" fill="none" stroke="#00ffff" strokeWidth="0.5" opacity="0.4" />
        <rect x="168" y="93" width="30" height="10" rx="2" fill="none" stroke="#00ffff" strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* ── Resplandor interior (visible cuando abierta) ── */}
      {isOpen && (
        <ellipse
          className="inner-glow"
          cx="109" cy="110"
          rx="60" ry="12"
          fill="#00ffff"
          opacity="0.35"
          filter="url(#neon-cyan)"
        />
      )}

      {/* ── Sombra base ── */}
      <ellipse cx="109" cy="238" rx="80" ry="8" fill="#ff00ff" opacity="0.12" />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  SVG: Partículas de explosión neón
// ─────────────────────────────────────────────
function ParticlesBurst() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    angle: (360 / 24) * i,
    r: 3 + Math.random() * 5,
    dist: 60 + Math.random() * 80,
    color: i % 2 === 0 ? "#00ffff" : "#ff00ff",
    delay: Math.random() * 0.3,
    size: 2 + Math.random() * 4,
  }));

  return (
    <svg className="particles-burst" viewBox="-160 -160 320 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow-particle">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.dist;
        const y = Math.sin(rad) * p.dist;
        return (
          <g key={p.id}>
            <circle
              cx={x} cy={y} r={p.size}
              fill={p.color}
              filter="url(#glow-particle)"
              className="particle-dot"
              style={{ animationDelay: `${p.delay}s` }}
            />
            <line
              x1="0" y1="0"
              x2={x * 0.6} y2={y * 0.6}
              stroke={p.color}
              strokeWidth="0.8"
              opacity="0.4"
              className="particle-line"
              style={{ animationDelay: `${p.delay}s` }}
            />
          </g>
        );
      })}
      {/* Flash central */}
      <circle cx="0" cy="0" r="18" fill="#ffffff" className="center-flash" filter="url(#glow-particle)" />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  SVG: Corazón latiendo
// ─────────────────────────────────────────────
function HeartSVG() {
  return (
    <svg className="heart-svg" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="heart-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path
        d="M50 80 C50 80 10 55 10 30 C10 15 22 5 35 8 C42 10 48 15 50 20 C52 15 58 10 65 8 C78 5 90 15 90 30 C90 55 50 80 50 80Z"
        fill="#00ffff"
        filter="url(#heart-glow)"
        className="heart-path"
      />
      <path
        d="M50 80 C50 80 10 55 10 30 C10 15 22 5 35 8 C42 10 48 15 50 20 C52 15 58 10 65 8 C78 5 90 15 90 30 C90 55 50 80 50 80Z"
        fill="none"
        stroke="#ff00ff"
        strokeWidth="1.5"
        filter="url(#heart-glow)"
        className="heart-outline"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  SVG: Flecha scroll-down
// ─────────────────────────────────────────────
function ScrollArrow() {
  return (
    <svg className="scroll-arrow" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="arrow-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <polyline
        points="8,10 20,26 32,10"
        fill="none" stroke="#00ffff" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        filter="url(#arrow-glow)"
      />
      <polyline
        points="8,24 20,40 32,24"
        fill="none" stroke="#00ffff" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        opacity="0.5"
        filter="url(#arrow-glow)"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────
//  Componente Foto Polaroid
// ─────────────────────────────────────────────
const ROTATIONS = [-6, 4, -3, 7, -5, 3, -4, 6, -2, 5];

function PolaroidPhoto({ url, index }) {
  const rot = ROTATIONS[index % ROTATIONS.length];
  return (
    <div
      className="polaroid fade-in-up"
      style={{
        transform: `rotate(${rot}deg)`,
        animationDelay: `${index * 0.15}s`,
      }}
    >
      <div className="polaroid-img-wrap">
        <img src={url} alt={`Foto ${index + 1}`} loading="lazy" />
        <div className="polaroid-shimmer" />
      </div>
      <div className="polaroid-foot" />
    </div>
  );
}

// ─────────────────────────────────────────────
//  Reproductor de Audio mínimo
// ─────────────────────────────────────────────
function AudioPlayer({ src, autoStart }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (autoStart && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [autoStart]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    const p = (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
    setProgress(p);
  };

  const seek = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  return (
    <div className="glass-panel audio-player">
      <audio ref={audioRef} src={src} onTimeUpdate={onTimeUpdate} loop />
      <button className="audio-btn" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}>
        {playing ? (
          <svg viewBox="0 0 24 24" width="22" height="22">
            <rect x="5" y="4" width="4" height="16" fill="#00ffff" />
            <rect x="15" y="4" width="4" height="16" fill="#00ffff" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22">
            <polygon points="5,3 21,12 5,21" fill="#00ffff" />
          </svg>
        )}
      </button>
      <div className="audio-track" onClick={seek}>
        <div className="audio-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="audio-label">{playing ? "▶ SONANDO" : "▐▐ PAUSA"}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function HypeboxMisteriosa({ data = {} }) {
    const nombre = data?.nombre || "Tú";
    const remitente = data?.remitente || "Alguien especial";
    const mensaje_corto = data?.mensaje_corto || "¡Este regalo es para ti!";
    const fotos = data?.fotos && data.fotos.length > 0 ? data.fotos : [Image1, Image2, Image3];
    const audio = data?.audio || ILOVEYOUSO;

  

  // Estados de la experiencia
  const [phase, setPhase] = useState("locked");   // locked | opening | open
  const [shaking, setShaking] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const revealRef = useRef(null);

  const handleUnlock = () => {
    // 1. Vibrar la caja
    setShaking(true);
    setTimeout(() => setShaking(false), 600);

    // 2. Iniciar apertura
    setTimeout(() => {
      setPhase("opening");
      setAudioReady(true);
    }, 400);

    // 3. Mostrar contenido
    setTimeout(() => {
      setPhase("open");
      revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 2200);
  };

  return (
    <div className="hypebox-root">
      {/* ══════════════════════════════════════
          SECCIÓN 1: PORTADA LOCKED
      ══════════════════════════════════════ */}
      {phase !== "open" && (
        <section className="section-cover">
          {/* Título principal */}
          <div className="cover-top">
            <span className="cover-eyebrow">// SISTEMA ACTIVADO //</span>
            <h1 className="cover-title">
              <span className="char-animate">H</span>
              <span className="char-animate" style={{ animationDelay: "0.05s" }}>Y</span>
              <span className="char-animate" style={{ animationDelay: "0.1s" }}>P</span>
              <span className="char-animate" style={{ animationDelay: "0.15s" }}>E</span>
              <span className="char-animate" style={{ animationDelay: "0.2s" }}>B</span>
              <span className="char-animate" style={{ animationDelay: "0.25s" }}>O</span>
              <span className="char-animate" style={{ animationDelay: "0.3s" }}>X</span>
            </h1>
            <p className="cover-subtitle">RECIBIDA · SELLADA · ESPERANDO</p>
          </div>

          {/* Caja central levitando */}
          <div className="box-wrap">
            <div className="box-levitate">
              <BoxSVG isOpen={phase === "opening"} isShaking={shaking} />
            </div>

            {/* Ráfaga de partículas al abrir */}
            {phase === "opening" && (
              <div className="particles-wrap">
                <ParticlesBurst />
              </div>
            )}

            {/* Glow base bajo la caja */}
            <div className="box-ground-glow" />
          </div>

          {/* Indicador de destinatario */}
          <p className="cover-for">
            DESTINADO A: <span className="neon-cyan">{nombre.toUpperCase()}</span>
          </p>

          {/* Botón de desbloqueo */}
          {phase === "locked" && (
            <button
              className="glass-panel unlock-btn"
              onClick={handleUnlock}
              aria-label="Desbloquear Hypebox"
            >
              <span className="unlock-icon">⬡</span>
              <span className="unlock-text">DESBLOQUEAR HYPEBOX</span>
              <span className="unlock-icon">⬡</span>
            </button>
          )}

          {/* Estado de apertura */}
          {phase === "opening" && (
            <div className="opening-status glass-panel">
              <span className="status-dot" />
              DESBLOQUEANDO SISTEMA...
            </div>
          )}

          {/* Decoración de esquinas */}
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />

          {/* Scanline decorativo */}
          <div className="scanline" />
        </section>
      )}

      {/* ══════════════════════════════════════
          SECCIÓN 3: REVELACIÓN (CONTENIDO)
      ══════════════════════════════════════ */}
      {phase === "open" && (
        <section className="section-reveal" ref={revealRef}>
          {/* Header de revelación */}
          <div className="reveal-header">
            <span className="reveal-eyebrow">// ACCESO CONCEDIDO //</span>
            <h2 className="reveal-title">
              ¡ES PARA TI,{" "}
              <span className="neon-yellow">{nombre.toUpperCase()}</span>!
            </h2>
            <div className="reveal-line" />
          </div>

          {/* Panel del mensaje */}
          <div className="glass-panel message-panel">
            <div className="message-cursor">▋</div>
            <p className="message-text">{mensaje_corto}</p>
            <div className="message-tag">MSG_CIFRADO · SOLO PARA TI</div>
          </div>

          {/* Galería de Polaroids */}
          <div className="gallery-section">
            <h3 className="gallery-label">// MEMORIES_ARCHIVE //</h3>
            <div className="polaroid-grid">
              {fotos.map((url, i) => (
                <PolaroidPhoto key={i} url={url} index={i} />
              ))}
            </div>
          </div>

          {/* Flecha scroll-down */}
          <div className="scroll-hint">
            <span className="scroll-label">SEGUIR BAJANDO</span>
            <ScrollArrow />
          </div>

          {/* ══════════════════════════════════
              SECCIÓN 4: CIERRE / FOOTER
          ══════════════════════════════════ */}
          <section className="section-footer">
            {/* Separador neón */}
            <div className="footer-separator">
              <div className="sep-line" />
              <HeartSVG />
              <div className="sep-line" />
            </div>

            {/* Firma */}
            <div className="glass-panel sender-panel">
              <div className="sender-tag">ORIGEN · VERIFICADO</div>
              <p className="sender-label">De parte de:</p>
              <h3 className="sender-name">{remitente.toUpperCase()}</h3>
              <div className="sender-badge">✦ AUTENTICADO ✦</div>
            </div>

            {/* Reproductor de audio */}
            {audio && (
              <div className="audio-section">
                <p className="audio-eyebrow">// AUDIO_MENSAJE //</p>
                <AudioPlayer src={audio} autoStart={audioReady} />
              </div>
            )}

            {/* Cierre */}
            <div className="footer-end">
              <span className="footer-code">HYPEBOX_v2.0.26</span>
              <div className="footer-dots">
                <span className="fdot" />
                <span className="fdot" style={{ animationDelay: "0.3s" }} />
                <span className="fdot" style={{ animationDelay: "0.6s" }} />
              </div>
            </div>
          </section>
        </section>
      )}
    </div>
  );
}