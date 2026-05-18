import React, { useState, useRef, useEffect } from "react";
import './style.css'
import usePreloadImages from "../../hooks/usePreloadImages";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Image1 from './Images/Image1.avif'
import Image2 from './Images/Image2.avif'
import Image3 from './Images/Image3.avif'
import Image4 from './Images/Image4.avif'
import Image5 from './Images/Image5.avif'
import Image6 from './Images/Image6.avif'
import Song from './song.mp3'

const TextWithLineBreaks = ({ text }) => {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

// Colores compartidos entre SVG y canvas
const PETAL_COLORS = ['#ffb3c6', '#ffc2d1', '#ff8fab', '#ffe5ec', '#ffffff', '#ffd6e0', '#ffccd5'];

// RNG con semilla para posiciones de flores deterministas (idénticas en cada carga)
const makeRng = () => {
  let s = 0x12345678;
  return () => { s = (Math.imul(1664525, s) + 1013904223) | 0; return (s >>> 0) / 0xFFFFFFFF; };
};

// Centros de clusters en el viewBox 0 0 400 450
const CLUSTER_DEFS = [
  { x: 8,   y: 68, s: 20, n: 12 },
  { x: 42,  y: 63, s: 18, n: 10 },
  { x: 74,  y: 50, s: 22, n: 13 },
  { x: 130, y: 48, s: 20, n: 12 },
  { x: 107, y: 55, s: 18, n: 10 },
  { x: 156, y: 57, s: 16, n: 10 },
  { x: 180, y: 41, s: 20, n: 14 },
  { x: 196, y: 38, s: 24, n: 18 },
  { x: 205, y: 42, s: 16, n: 10 },
  { x: 280, y: 55, s: 18, n: 10 },
  { x: 234, y: 57, s: 16, n: 10 },
  { x: 314, y: 50, s: 22, n: 13 },
  { x: 260, y: 48, s: 20, n: 12 },
  { x: 384, y: 68, s: 20, n: 12 },
  { x: 352, y: 63, s: 18, n: 10 },
];

const rng = makeRng();
const BLOSSOM_CIRCLES = CLUSTER_DEFS.flatMap(({ x, y, s, n }) =>
  Array.from({ length: n }, () => ({
    cx: x + (rng() - 0.5) * s * 2,
    cy: y + (rng() - 0.5) * s * 2,
    r:  rng() * 9 + 5,
    color: PETAL_COLORS[Math.floor(rng() * PETAL_COLORS.length)],
    opacity: rng() * 0.25 + 0.72,
  }))
);

export default function App({ data, isPreview }) {
  const nombre   = data?.nombre || "Mi Amor";
  const dateUser = data?.fecha  || "2025-12-25T00:00:00";

  const procesarFotos = (fotos) => {
    const base = (!fotos || fotos.length === 0)
      ? [Image1, Image2, Image3, Image4, Image5, Image6]
      : fotos;
    let arr = [...base];
    while (arr.length < 10) arr = [...arr, ...base];
    return arr;
  };

  const misFotos   = procesarFotos(data?.fotos);
  usePreloadImages(misFotos);

  const srcMusica  = data?.audio || Song;
  const textoCarta = data?.carta || `Hola, ${nombre}.\n\nHe diseñado este pequeño espacio pensando en la paz y la felicidad que me das todos los días. Quería crear un rincón tranquilo y hermoso, exactamente como se siente estar a tu lado.\n\nCada uno de estos pétalos representa un momento único que hemos compartido. Nuestro tiempo juntos es mi mayor tesoro, lleno de risas y un amor que crece cada segundo.\n\nPrometo cuidarte y elegirte todos los días. Eres mi inspiración constante.\n\nTe amo con el alma entera.`;

  const mensajesFlotantes = [
    { title: "Te quiero",   sub: "Más que ayer, menos que mañana." },
    { title: "Mi Destino",  sub: "Cada día te elijo a ti." },
    { title: "Magia Pura",  sub: "Juntos es mi lugar feliz." },
    { title: "Mi Sonrisa",  sub: "Gracias por existir." },
  ];

  const [isStarted,      setIsStarted]      = useState(!!isPreview);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [timer,          setTimer]          = useState({ days: "00", hours: "00", mins: "00", secs: "00" });
  const [msgIndex,       setMsgIndex]       = useState(0);
  const [isMsgActive,    setIsMsgActive]    = useState(true);
  const [typewriterText, setTypewriterText] = useState("");

  const audioRef         = useRef(null);
  const treeTrunkRef     = useRef(null);
  const canvasRef        = useRef(null);
  const typingIntervalRef = useRef(null);
  const swiperInstanceRef = useRef(null);

  // Contador de tiempo
  useEffect(() => {
    if (!isStarted) return;
    const tick = () => {
      const diff = new Date() - new Date(dateUser);
      setTimer({
        days:  Math.floor(diff / 86400000).toString().padStart(2, "0"),
        hours: Math.floor((diff / 3600000) % 24).toString().padStart(2, "0"),
        mins:  Math.floor((diff / 60000) % 60).toString().padStart(2, "0"),
        secs:  Math.floor((diff / 1000) % 60).toString().padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isStarted, dateUser]);

  // Textos cinematográficos rotativos
  useEffect(() => {
    if (!isStarted) return;
    const id = setInterval(() => {
      setIsMsgActive(false);
      setTimeout(() => {
        setMsgIndex(p => (p + 1) % mensajesFlotantes.length);
        setIsMsgActive(true);
      }, 1200);
    }, 6000);
    return () => clearInterval(id);
  }, [isStarted, mensajesFlotantes.length]);

  // Árbol crece desde abajo
  useEffect(() => {
    if (!isStarted || !treeTrunkRef.current) return;
    treeTrunkRef.current.classList.add("grown-sr");
  }, [isStarted]);

  // Canvas — pétalos cayendo (cubre toda la pantalla, pausa con modal)
  useEffect(() => {
    if (!isStarted || isModalOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const petals = Array.from({ length: 40 }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vy:    Math.random() * 0.7 + 0.35,
      angle: Math.random() * Math.PI * 2,
      va:    (Math.random() - 0.5) * 0.025,
      size:  Math.random() * 4.5 + 4,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      amp:   Math.random() * 0.7 + 0.2,
      freq:  Math.random() * 0.012 + 0.008,
      phase: Math.random() * Math.PI * 2,
    }));

    let frameId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach(p => {
        p.y     += p.vy;
        p.angle += p.va;
        p.x     += Math.sin(p.y * p.freq + p.phase) * p.amp;
        if (p.y > canvas.height + 15) {
          p.y = -12;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = 0.87;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      frameId = requestAnimationFrame(draw);
    };

    // Arrancar después de que el árbol esté visible
    const delay = setTimeout(() => { frameId = requestAnimationFrame(draw); }, 2800);

    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isStarted, isModalOpen]);

  // Modal: typewriter + Swiper
  useEffect(() => {
    if (isModalOpen) {
      setTypewriterText("");
      let i = 0;
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = setInterval(() => {
        if (i < textoCarta.length) {
          setTypewriterText(prev => prev + textoCarta.charAt(i));
          i++;
        } else {
          clearInterval(typingIntervalRef.current);
        }
      }, 35);

      const t = setTimeout(() => {
        swiperInstanceRef.current = new Swiper(".swiper-sr", {
          effect: "coverflow",
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: "auto",
          spaceBetween: 15,
          loop: true,
          observer: true,
          observeParents: true,
          autoplay: { delay: 2000, disableOnInteraction: false },
          coverflowEffect: { rotate: 35, stretch: 0, depth: 150, modifier: 1, slideShadows: true },
          pagination: { el: ".swiper-pagination-sr", dynamicBullets: true },
        });
      }, 100);

      return () => clearTimeout(t);
    } else {
      clearInterval(typingIntervalRef.current);
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    }
  }, [isModalOpen, textoCarta]);

  const handleStart = () => {
    setIsStarted(true);
    if (!isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsMusicPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) audioRef.current.pause();
    else                audioRef.current.play();
    setIsMusicPlaying(p => !p);
  };

  const handleOpenSorpresa = () => {
    setIsModalOpen(true);
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 },
        colors: ['#ff4d6d', '#ff8fab', '#ffc2d1', '#ffffff', '#c9184a'] });
    });
  };

  const skipTypewriter = () => {
    clearInterval(typingIntervalRef.current);
    setTypewriterText(textoCarta);
  };

  return (
    <div className="app-container-sr">

      {/* Luces Ambientales */}
      <div className="ambient-light-sr light-1-sr" />
      <div className="ambient-light-sr light-2-sr" />
      <div className="ambient-light-sr light-3-sr" />

      {/* Canvas de pétalos cayendo — cubre toda la pantalla */}
      <canvas ref={canvasRef} className="petals-canvas-sr" />

      <audio ref={audioRef} src={srcMusica} loop preload="none" />

      {/* Botón Música */}
      <button onClick={toggleMusic} className={`music-btn-sr glass-premium-sr ${isMusicPlaying ? "music-on-sr" : "music-off-sr"}`}>
        <svg className="music-icon-sr" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.236l8-1.6V11.114A4.369 4.369 0 0015 11c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      </button>

      {/* PANTALLA INICIAL */}
      <div className={`screen-sr screen-initial-sr ${isStarted ? "is-hidden-sr" : "is-visible-sr"}`}>
        <div className="glass-premium-sr initial-card-sr">
          <h1 className="font-serif-sr initial-title-sr">Para {nombre}</h1>
          <p className="initial-subtitle-sr">Toca para comenzar</p>
          <button onClick={handleStart} className="start-btn-sr">
            <svg className="start-icon-sr" viewBox="0 0 32 29.6">
              <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ESCENA PRINCIPAL */}
      <div className={`screen-sr screen-main-sr ${isStarted ? "is-visible-sr" : "is-hidden-sr"}`}>

        {/* Textos Cinematográficos */}
        <div className="text-container-sr">
          <div className={`cinematic-fade-sr ${isMsgActive ? "active-sr" : ""}`}>
            <span className="font-script-sr text-gradient-sr msg-title-sr">
              {mensajesFlotantes[msgIndex].title}
            </span>
            <span className="font-serif-sr msg-sub-sr">
              {mensajesFlotantes[msgIndex].sub}
            </span>
          </div>
        </div>

        {/* Árbol de Cerezo */}
        <div className="tree-container-sr">
          <svg
            ref={treeTrunkRef}
            id="tree-trunk-sr"
            viewBox="0 0 400 450"
            className="tree-svg-sr"
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              <linearGradient id="trunkGrad-sr" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#3e2210" />
                <stop offset="40%"  stopColor="#6b3a1f" />
                <stop offset="100%" stopColor="#3e2210" />
              </linearGradient>
            </defs>

            {/* Tronco */}
            <path d="M200,450 C196,420 188,390 186,355 C183,318 183,285 195,245"
              stroke="url(#trunkGrad-sr)" strokeWidth="26" fill="none" strokeLinecap="round" />

            {/* Tronco superior (hasta segunda bifurcación) */}
            <path d="M195,245 C194,222 194,200 194,165"
              stroke="#6b3a1f" strokeWidth="18" fill="none" strokeLinecap="round" />

            {/* Rama principal izquierda */}
            <path d="M195,245 C175,220 148,198 115,175"
              stroke="#6b3a1f" strokeWidth="12" fill="none" strokeLinecap="round" />

            {/* Rama principal derecha */}
            <path d="M195,245 C215,220 252,198 285,175"
              stroke="#6b3a1f" strokeWidth="12" fill="none" strokeLinecap="round" />

            {/* Centro-izquierda secundaria */}
            <path d="M194,165 C178,148 158,128 140,110"
              stroke="#7a4a28" strokeWidth="9" fill="none" strokeLinecap="round" />

            {/* Centro-derecha secundaria */}
            <path d="M194,165 C210,148 232,128 252,110"
              stroke="#7a4a28" strokeWidth="9" fill="none" strokeLinecap="round" />

            {/* Centro arriba */}
            <path d="M194,165 C193,143 192,120 192,95"
              stroke="#7a4a28" strokeWidth="11" fill="none" strokeLinecap="round" />

            {/* Izquierda exterior secundaria */}
            <path d="M115,175 C88,158 62,140 38,118"
              stroke="#7a4a28" strokeWidth="9" fill="none" strokeLinecap="round" />

            {/* Izquierda interior secundaria */}
            <path d="M115,175 C108,150 105,122 107,94"
              stroke="#7a4a28" strokeWidth="8" fill="none" strokeLinecap="round" />

            {/* Derecha exterior secundaria */}
            <path d="M285,175 C312,158 338,140 355,118"
              stroke="#7a4a28" strokeWidth="9" fill="none" strokeLinecap="round" />

            {/* Derecha interior secundaria */}
            <path d="M285,175 C283,148 281,120 282,94"
              stroke="#7a4a28" strokeWidth="8" fill="none" strokeLinecap="round" />

            {/* Terciarias — extremo izquierdo desde (38,118) */}
            <path d="M38,118 Q24,93 8,68"   stroke="#8a5530" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M38,118 Q40,90 42,63"  stroke="#8a5530" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Terciarias — izquierda interior desde (107,94) */}
            <path d="M107,94 Q90,72 74,50"   stroke="#8a5530" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M107,94 Q119,71 130,48" stroke="#8a5530" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Terciarias — centro-izquierda desde (140,110) */}
            <path d="M140,110 Q124,83 107,55" stroke="#8a5530" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M140,110 Q148,84 156,57" stroke="#8a5530" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Terciarias — centro desde (192,95) */}
            <path d="M192,95 Q186,68 180,41" stroke="#8a5530" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M192,95 Q194,67 196,38" stroke="#8a5530" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M192,95 Q199,69 205,42" stroke="#8a5530" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Terciarias — centro-derecha desde (252,110) */}
            <path d="M252,110 Q266,83 280,55" stroke="#8a5530" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M252,110 Q243,84 234,57" stroke="#8a5530" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Terciarias — derecha interior desde (282,94) */}
            <path d="M282,94 Q298,72 314,50"  stroke="#8a5530" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M282,94 Q271,71 260,48"  stroke="#8a5530" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Terciarias — extremo derecho desde (355,118) */}
            <path d="M355,118 Q370,93 384,68" stroke="#8a5530" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M355,118 Q354,91 352,63" stroke="#8a5530" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Flores (círculos SVG estáticos en las puntas de ramas) */}
            {BLOSSOM_CIRCLES.map((b, i) => (
              <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.color} opacity={b.opacity} />
            ))}
          </svg>
        </div>

        {/* Dock Inferior */}
        <div className={`glass-premium-sr bottom-dock-sr ${isStarted ? "is-active-sr" : ""}`}>
          <p className="font-serif-sr dock-title-sr">Nuestro Tiempo Mágico</p>
          <div className="timer-row-sr">
            <div className="time-block-sr">
              <span className="time-value-sr text-gradient-sr font-serif-sr">{timer.days}</span>
              <span className="time-label-sr">Días</span>
            </div>
            <span className="timer-sep-sr">:</span>
            <div className="time-block-sr">
              <span className="time-value-sr text-gradient-sr font-serif-sr">{timer.hours}</span>
              <span className="time-label-sr">Hrs</span>
            </div>
            <span className="timer-sep-sr">:</span>
            <div className="time-block-sr">
              <span className="time-value-sr text-gradient-sr font-serif-sr">{timer.mins}</span>
              <span className="time-label-sr">Min</span>
            </div>
            <span className="timer-sep-sr">:</span>
            <div className="time-block-sr">
              <span className="time-value-sr text-gradient-sr font-serif-sr">{timer.secs}</span>
              <span className="time-label-sr">Seg</span>
            </div>
          </div>
          <button onClick={handleOpenSorpresa} className="btn-premium-sr carta-btn-sr">
            <svg className="carta-btn-icon-sr" fill="currentColor" viewBox="0 0 32 29.6">
              <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
            </svg>
            <span className="carta-btn-text-sr">Ver Sorpresa</span>
          </button>
        </div>
      </div>

      {/* MODAL */}
      <div className={`modal-overlay-sr ${isModalOpen ? "modal-open-sr" : "modal-closed-sr"}`}>
        <div className="glass-premium-sr modal-content-sr">
          <button onClick={() => setIsModalOpen(false)} className="modal-close-btn-sr">
            <svg className="close-icon-sr" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="modal-scroll-area-sr">
            <div className="modal-top-section-sr">
              <div className="modal-bg-gradient-sr" />
              <div className="modal-bg-glow-sr" />
              {isModalOpen && (
                <div className="swiper swiper-sr">
                  <div className="swiper-wrapper">
                    {misFotos.map((foto, i) => (
                      <div key={i} className="swiper-slide custom-slide-sr">
                        <div className="custom-slide-img-container-sr">
                          <img src={foto} loading="eager" className="custom-slide-img-sr" alt={`Recuerdo ${i + 1}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="swiper-pagination swiper-pagination-sr" />
                </div>
              )}
            </div>

            <div className="modal-bottom-section-sr">
              <h2 className="font-script-sr text-gradient-sr modal-title-sr">Mi lugar seguro...</h2>
              <div
                className="modal-text-sr"
                onClick={skipTypewriter}
                style={{ cursor: typewriterText.length < textoCarta.length ? 'pointer' : 'default' }}
              >
                <TextWithLineBreaks text={typewriterText} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
