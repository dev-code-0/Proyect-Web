import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import Music from './musica.mp3';

const MENSAJE_DEFAULT = [
  'Dicen que los girasoles siempre buscan la luz del sol para crecer y brillar. Desde que llegaste a mi vida, tú te has convertido en esa luz que ilumina mis días y me llena de calidez.',
  'Este detalle es para recordarte lo mucho que significas para mí. Cada momento a tu lado es tan hermoso y especial como ver florecer un campo de girasoles.',
  'Gracias por tu amor, por tu compañía y por hacer que mi mundo sea un lugar mejor. Eres mi persona favorita y siempre giraré hacia ti, buscando tu sonrisa.',
];

const FRASES = [
  'te quiero mucho',
  'eres muy especial',
  'nunca te vayas',
  'eres mi todo',
  'te pienso siempre',
  'mi persona favorita',
  'gracias por existir',
  'eres mi sol',
  'contigo es mejor',
  'te extraño siempre',
  'eres única',
  'te adoro',
];

const PARTICULAS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${3 + Math.random() * 4}s`,
}));

export default function GirasolesParaTi({ data, isPreview }) {
  const [fase, setFase] = useState('inicio'); // 'inicio' | 'saliendo' | 'abierto'
  const [mostrarCarta, setMostrarCarta] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [estrellas, setEstrellas] = useState([]);
  const audioRef = useRef(null);
  const splashRef = useRef(null);

  const nombre = data?.nombre || 'María';
  const mensajePersonal = data?.mensaje?.trim() || '';
  const dedicatoria = data?.dedicatoria || 'Te quiero con todo mi corazón.';
  const audioSrc = data?.audioUrl || Music;

  useEffect(() => {
    if (fase !== 'abierto') return;
    const timer = setTimeout(() => setMostrarCarta(true), 4500);
    return () => clearTimeout(timer);
  }, [fase]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // Estrellas fugaces — activas solo en fase abierto
  useEffect(() => {
    if (fase !== 'abierto') return;
    const timeouts = [];

    const spawnStar = () => {
      const id = Date.now() + Math.random();
      const side = Math.floor(Math.random() * 4);
      let startX, startY;
      if (side === 0)      { startX = 5 + Math.random() * 90; startY = -6; }
      else if (side === 1) { startX = 106; startY = 5 + Math.random() * 90; }
      else if (side === 2) { startX = 5 + Math.random() * 90; startY = 106; }
      else                 { startX = -6; startY = 5 + Math.random() * 90; }

      const targetX = 25 + Math.random() * 50;
      const targetY = 20 + Math.random() * 60;
      const frase = FRASES[Math.floor(Math.random() * FRASES.length)];

      setEstrellas(prev => {
        if (prev.length >= 2) return prev;
        return [...prev, { id, startX, startY, targetX, targetY, frase }];
      });

      const removeTimer = setTimeout(() => {
        setEstrellas(prev => prev.filter(e => e.id !== id));
      }, 5400);
      timeouts.push(removeTimer);

      const nextTimer = setTimeout(spawnStar, 7000 + Math.random() * 5000);
      timeouts.push(nextTimer);
    };

    const firstTimer = setTimeout(spawnStar, 3000);
    timeouts.push(firstTimer);

    return () => timeouts.forEach(clearTimeout);
  }, [fase]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  const manejarApertura = async () => {
    if (fase !== 'inicio') return;

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }

    if (!isPreview) {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 90,
        spread: 70,
        colors: ['#ffcc00', '#ff8c00', '#ffea00', '#ff9d00', '#fff'],
        origin: { y: 0.6 },
      });
    }

    const { animate } = await import('animejs');
    setFase('saliendo');
    animate(splashRef.current, {
      opacity: [1, 0],
      scale: [1, 0.95],
      duration: 600,
      ease: 'inQuad',
      onComplete: () => setFase('abierto'),
    });
  };

  return (
    <div className="regalo-virtual-container-gi">
      <audio ref={audioRef} src={audioSrc} preload="none" loop />

      {fase !== 'inicio' && (
        <button
          className="btn-audio-gi"
          onClick={toggleAudio}
          aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        >
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>
      )}

      <div className="fondo-estrellas-gi">
        {PARTICULAS.map(p => (
          <div
            key={p.id}
            className="particula-gi"
            style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}
      </div>

      {(fase === 'inicio' || fase === 'saliendo') && (
        <div ref={splashRef} className="pantalla-inicio-gi">
          <h1 className="titulo-tocar-gi">
            <strong>Hola {nombre}</strong>
            <br />
            Tengo algo especial para ti
          </h1>
          <button className="boton-abrir-gi" onClick={manejarApertura} disabled={fase === 'saliendo'}>
            <IconGirasol />
            Abrir
          </button>
        </div>
      )}

      {fase === 'abierto' && (
        <div className="contenido-abierto-gi">
          <div className="seccion-flores-gi">
            <h1 className="titulo-principal-gi">
              Para ti <br /> con mucho cariño
            </h1>
            <div className="resplandor-fondo-gi" />

            <div className="jardin-girasoles-gi">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`girasol-wrapper-gi girasol-${i + 1}-gi`}>
                  <div
                    className="girasol-balanceo-gi"
                    style={{
                      animationDuration: `${3.5 + i * 0.4}s`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    <div className="tallo-gi">
                      <div className="hoja-gi hoja-izq-gi" />
                      <div className="hoja-gi hoja-der-gi" />
                    </div>
                    <div className="cabeza-girasol-gi">
                      <div
                        className="petalos-gi"
                        style={{ animation: `giro-lento-petalos-gi ${25 + i * 3}s linear infinite` }}
                      >
                        {Array.from({ length: 12 }).map((_, p) => (
                          <div key={p} className="petalo-gi" style={{ transform: `rotate(${p * 30}deg)` }} />
                        ))}
                      </div>
                      <div className="centro-girasol-gi" />
                      <div
                        className="rocio-gi"
                        style={{
                          animationDuration: `${1.5 + (i % 3)}s`,
                          animationDelay: `${i * 0.5}s`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overlay de estrellas fugaces — confinado a la seccion flores */}
            <div className="overlay-estrellas-gi" aria-hidden="true">
              {estrellas.map(e => (
                <EstrellaSingle key={e.id} {...e} />
              ))}
            </div>

            {mostrarCarta && (
              <div className="indicador-scroll-gi">
                <IconChevronDown />
                <span>Desliza hacia abajo</span>
              </div>
            )}
          </div>

          {mostrarCarta && (
            <div className="seccion-carta-gi">
              <div className="tarjeta-mensaje-gi">
                <h2 className="titulo-carta-gi">Para ti</h2>
                {MENSAJE_DEFAULT.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {mensajePersonal && (
                  <>
                    <div className="separador-carta-gi" />
                    <p className="mensaje-personal-gi">{mensajePersonal}</p>
                  </>
                )}
                <p className="firma-gi">{dedicatoria}</p>
              </div>

              <div className="girasol-final-gi">
                <div className="cabeza-girasol-gi grande-gi">
                  <div className="petalos-gi">
                    {Array.from({ length: 16 }).map((_, p) => (
                      <div key={p} className="petalo-gi" style={{ transform: `rotate(${p * 22.5}deg)` }} />
                    ))}
                  </div>
                  <div className="centro-girasol-gi" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EstrellaSingle({ startX, startY, targetX, targetY, frase }) {
  const dotRef = useRef(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Doble rAF: asegura que el estilo inicial se pinte antes de que la transicion arranque
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (dotRef.current) {
          dotRef.current.style.left = `${targetX}%`;
          dotRef.current.style.top = `${targetY}%`;
        }
      })
    );
    const timer = setTimeout(() => setShowText(true), 2700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [targetX, targetY]);

  return (
    <>
      {!showText && (
        <div
          ref={dotRef}
          className="estrella-punto-gi"
          style={{ left: `${startX}%`, top: `${startY}%` }}
        />
      )}
      {showText && (
        <div
          className="estrella-frase-gi"
          style={{ left: `${targetX}%`, top: `${targetY}%` }}
        >
          {frase}
        </div>
      )}
    </>
  );
}

function IconGirasol() {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
      <circle cx="32" cy="32" r="10" />
      <ellipse cx="32" cy="10" rx="6" ry="10" />
      <ellipse cx="32" cy="54" rx="6" ry="10" />
      <ellipse cx="10" cy="32" rx="10" ry="6" />
      <ellipse cx="54" cy="32" rx="10" ry="6" />
      <ellipse cx="17" cy="17" rx="6" ry="10" transform="rotate(-45 17 17)" />
      <ellipse cx="47" cy="17" rx="6" ry="10" transform="rotate(45 47 17)" />
      <ellipse cx="17" cy="47" rx="6" ry="10" transform="rotate(45 17 47)" />
      <ellipse cx="47" cy="47" rx="6" ry="10" transform="rotate(-45 47 47)" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
