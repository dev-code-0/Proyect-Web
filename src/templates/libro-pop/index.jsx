import React, { useState, useEffect, useRef, useMemo } from 'react';
import './style.css';
import Image1 from './images/image1.avif';
import Image2 from './images/image2.avif';
import Image3 from './images/image3.avif';
import musicaUrl from './musica.mp3';
import { AntiInspectGuard } from '../../lib/antiInspect';
import usePreloadImages from '../../hooks/usePreloadImages';

const ArrowRight = () => (
  <svg className="hint-icon-lpu" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

const ArrowLeft = () => (
  <svg className="hint-icon-lpu" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg className="close-icon-lpu" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const OrnamentSvg = () => (
  <svg className="cover-ornament-svg-lpu" viewBox="0 0 100 20" fill="currentColor">
    <path d="M5,10 Q20,2 42,10 Q20,18 5,10 Z"/>
    <path d="M95,10 Q80,2 58,10 Q80,18 95,10 Z"/>
    <circle cx="50" cy="10" r="4"/>
    <circle cx="43" cy="10" r="2.2"/>
    <circle cx="57" cy="10" r="2.2"/>
  </svg>
);

const HeartSvg = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: '1em', height: '1em', display: 'block' }}>
    <path d="M8 14S2 10.5 2 6.5C2 4 4 2.5 6 3c1 .3 1.7 1 2 2 .3-1 1-1.7 2-2 2-.5 4 1 4 3.5C14 10.5 8 14 8 14z"/>
  </svg>
);

const StarSvg = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: '1em', height: '1em', display: 'block' }}>
    <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.7 4.08L8 10.4l-3.7 2.1.7-4.08L2 5.5l4.15-.75L8 1z"/>
  </svg>
);

export default function LibroPopUpTemplate({ data, isPreview }) {
  const titulo  = data?.titulo  || "Nuestra Historia";
  const nombre  = data?.nombre  || "María";
  const mensaje = data?.mensaje || "";
  const fotos   = data?.fotos?.length > 0 ? data.fotos : [Image1, Image2, Image3];

  usePreloadImages(fotos);

  const maxSpreads = 3;
  const [currentSpread, setCurrentSpread] = useState(isPreview ? 1 : 0);
  const [animatingLeaf, setAnimatingLeaf]  = useState(null);
  const [showParticles, setShowParticles]  = useState(false);

  const bgAudioRef      = useRef(null);
  const audioCtxRef     = useRef(null);
  const musicStarted    = useRef(false);
  const fadeInterval    = useRef(null);

  // Sonido de vuelta de página — Web Audio API, sin assets externos
  const playTurnSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.18), ctx.sampleRate);
      const ch  = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
      }
      const src  = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch (_) {}
  };

  // Música de fondo: fade in al abrir, fade out al cerrar
  const isOpen = currentSpread > 0;
  useEffect(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;
    if (fadeInterval.current) clearInterval(fadeInterval.current);

    if (isOpen) {
      if (!musicStarted.current) {
        audio.volume = 0;
        audio.play().catch(() => {});
        musicStarted.current = true;
      }
      fadeInterval.current = setInterval(() => {
        if (audio.volume < 0.32) {
          audio.volume = Math.min(audio.volume + 0.02, 0.32);
        } else {
          clearInterval(fadeInterval.current);
        }
      }, 80);
    } else if (musicStarted.current) {
      fadeInterval.current = setInterval(() => {
        if (audio.volume > 0.01) {
          audio.volume = Math.max(audio.volume - 0.03, 0);
        } else {
          audio.volume = 0;
          audio.pause();
          musicStarted.current = false;
          clearInterval(fadeInterval.current);
        }
      }, 80);
    }
    return () => clearInterval(fadeInterval.current);
  }, [isOpen]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      const audio = bgAudioRef.current;
      if (audio) { audio.pause(); audio.volume = 0; }
      clearInterval(fadeInterval.current);
    };
  }, []);

  const nextPage = (e) => {
    e.stopPropagation();
    if (currentSpread < maxSpreads) {
      playTurnSound();
      setAnimatingLeaf(currentSpread);
      setCurrentSpread(prev => prev + 1);
      setTimeout(() => setAnimatingLeaf(null), 1200);
    }
  };

  const prevPage = (e) => {
    e.stopPropagation();
    if (currentSpread > 0) {
      playTurnSound();
      setAnimatingLeaf(currentSpread - 1);
      setCurrentSpread(prev => prev - 1);
      setTimeout(() => setAnimatingLeaf(null), 1200);
    }
  };

  useEffect(() => {
    let timer;
    if (currentSpread === maxSpreads) {
      timer = setTimeout(() => setShowParticles(true), 1200);
    } else {
      setShowParticles(false);
    }
    return () => clearTimeout(timer);
  }, [currentSpread]);

  // Posiciones fijas al montar — no recalcular en cada render
  const particleData = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      isHeart:  i % 2 === 0,
      left:     Math.random() * 100,
      delay:    Math.random() * 1.5,
      duration: Math.random() * 2 + 2.5,
      size:     Math.random() * 10 + 8,
      rx:       (Math.random() - 0.5) * 150,
    })),
  []);

  const particles = particleData.map((p, i) => (
    <div
      key={`p-${i}`}
      className="particle-magic-lpu"
      style={{
        left:              `${p.left}%`,
        animationDelay:    `${p.delay}s`,
        animationDuration: `${p.duration}s`,
        '--size':          `${p.size}px`,
        '--rx':            `${p.rx}px`,
        color:             p.isHeart ? '#e8436a' : '#f5c342',
      }}
    >
      {p.isHeart ? <HeartSvg /> : <StarSvg />}
    </div>
  ));

  const getLeafStyle = (index) => {
    const isTurned   = currentSpread > index;
    const isAnimating = animatingLeaf === index;
    let z = isTurned ? index + 1 : 100 - index;
    if (isAnimating) z = 999;
    return { zIndex: z, transform: `rotateY(${isTurned ? -180 : 0}deg)` };
  };

  const isFrontActive = (index) => currentSpread === index;
  const isBackActive  = (index) => currentSpread === index + 1;

  return (
    <AntiInspectGuard>
      <div className="template-wrapper-lpu">
        <audio ref={bgAudioRef} src={musicaUrl} loop preload="none" />

        <div className={`bg-title-lpu ${currentSpread > 0 ? 'hidden-lpu' : ''}`}>
          Un regalo para ti...
        </div>

        <div className="scene-lpu">
          <div className={`book-lpu ${currentSpread > 0 ? 'is-open-lpu' : ''}`}>

            <div className="book-spine-lpu">
              <div className="spine-ribs-lpu"></div>
              <div className="spine-ribs-lpu"></div>
              <div className="spine-ribs-lpu"></div>
            </div>

            {/* ==========================================
                HOJA 0 — PORTADA + PRÓLOGO
                ========================================== */}
            <div className="leaf-lpu" style={getLeafStyle(0)}>

              <div className="page-lpu page-front-lpu cover-front-lpu" onClick={nextPage}>
                <div className="cover-border-lpu">
                  <div className="cover-content-lpu">
                    <h1 className="cover-title-lpu gold-foil-lpu">{titulo}</h1>
                    <div className="cover-ornament-lpu">
                      <OrnamentSvg />
                    </div>
                    <p className="cover-subtitle-lpu">Para {nombre}</p>
                  </div>
                </div>
                <div className="click-hint-lpu hint-glow-lpu">
                  Toca para abrir <ArrowRight />
                </div>
              </div>

              <div className="page-lpu page-back-lpu paper-page-lpu" onClick={prevPage}>
                <div className={`page-content-lpu left-page-lpu ${isBackActive(0) ? 'active-content-lpu' : ''}`}>
                  <div className="corner-decor-lpu top-left-lpu"></div>
                  <div className="corner-decor-lpu bottom-left-lpu"></div>
                  <div className="click-hint-lpu hint-left-lpu"><ArrowLeft /> Cerrar</div>
                  <div className="dedication-lpu">
                    <h2 className="gold-foil-lpu anim-el-lpu" style={{'--delay': '0.2s'}}>Prólogo</h2>
                    <p className="anim-el-lpu" style={{'--delay': '0.4s'}}>
                      Hay historias que se escriben solas, sin darte cuenta. Esta empezó el día que llegaste a mi vida y cambió cada página en blanco que tenía por delante.
                    </p>
                    <p className="mt-lpu anim-el-lpu" style={{'--delay': '0.6s'}}>
                      Cada vez que pienso en ti, encuentro palabras que antes no sabía que existían.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================
                HOJA 1 — CAP. I + CAP. II
                ========================================== */}
            <div className="leaf-lpu" style={getLeafStyle(1)}>

              <div className="page-lpu page-front-lpu paper-page-lpu" onClick={nextPage}>
                <div className={`page-content-lpu right-page-lpu ${isFrontActive(1) ? 'active-content-lpu' : ''}`}>
                  <div className="corner-decor-lpu top-right-lpu"></div>
                  <div className="corner-decor-lpu bottom-right-lpu"></div>
                  <div className="click-hint-lpu hint-right-lpu">Avanzar <ArrowRight /></div>
                  <h3 className="chapter-title-lpu gold-foil-lpu anim-el-lpu" style={{'--delay': '0.3s'}}>I. El Principio</h3>
                  <p className="text-body-lpu anim-el-lpu" style={{'--delay': '0.5s'}}>
                    Hay momentos que se quedan grabados para siempre. Tú eres uno de esos momentos —el mejor de todos.
                  </p>
                  <div className="polaroid-lpu tilt-right-lpu anim-pic-lpu" style={{'--delay': '0.8s', '--rot': '4deg'}}>
                    <div className="polaroid-pin-lpu"></div>
                    <div className="img-wrapper-lpu">
                      <img src={fotos[0]} alt="Momento 1" />
                    </div>
                    <span>El primer capítulo</span>
                  </div>
                </div>
              </div>

              <div className="page-lpu page-back-lpu paper-page-lpu" onClick={prevPage}>
                <div className={`page-content-lpu left-page-lpu ${isBackActive(1) ? 'active-content-lpu' : ''}`}>
                  <div className="corner-decor-lpu top-left-lpu"></div>
                  <div className="corner-decor-lpu bottom-left-lpu"></div>
                  <div className="click-hint-lpu hint-left-lpu"><ArrowLeft /> Volver</div>
                  <h3 className="chapter-title-lpu gold-foil-lpu anim-el-lpu" style={{'--delay': '0.2s'}}>II. Tú y Yo</h3>
                  <div className="polaroid-lpu tilt-left-lpu anim-pic-lpu" style={{'--delay': '0.5s', '--rot': '-4deg'}}>
                    <div className="polaroid-tape-lpu"></div>
                    <div className="img-wrapper-lpu">
                      <img src={fotos[1] || fotos[0]} alt="Momento 2" />
                    </div>
                    <span>El capítulo favorito</span>
                  </div>
                  <p className="text-body-lpu mt-lpu anim-el-lpu" style={{'--delay': '0.8s'}}>
                    Contigo, lo ordinario se vuelve extraordinario. Cada día a tu lado es una página que quiero leer una y otra vez.
                  </p>
                </div>
              </div>
            </div>

            {/* ==========================================
                HOJA 2 — CAP. III + PÁGINA FINAL IZQ
                ========================================== */}
            <div className="leaf-lpu" style={getLeafStyle(2)}>

              <div className="page-lpu page-front-lpu paper-page-lpu" onClick={nextPage}>
                <div className={`page-content-lpu right-page-lpu ${isFrontActive(2) ? 'active-content-lpu' : ''}`}>
                  <div className="corner-decor-lpu top-right-lpu"></div>
                  <div className="corner-decor-lpu bottom-right-lpu"></div>
                  <div className="click-hint-lpu hint-right-lpu">Descubrir <ArrowRight /></div>
                  <h3 className="chapter-title-lpu gold-foil-lpu anim-el-lpu" style={{'--delay': '0.3s'}}>III. Lo Que Viene</h3>
                  <p className="text-body-lpu anim-el-lpu" style={{'--delay': '0.5s'}}>
                    Todavía nos quedan tantas páginas por escribir. Y si puedo elegir con quién escribirlas, te elijo a ti, siempre.
                  </p>
                  <p className="text-body-lpu mt-lpu anim-el-lpu hint-text-lpu" style={{'--delay': '0.8s'}}>
                    Hay una última sorpresa esperándote...
                  </p>
                </div>
              </div>

              <div className="page-lpu page-back-lpu paper-page-lpu" onClick={prevPage}>
                <div className={`page-content-lpu left-page-lpu ${isBackActive(2) ? 'active-content-lpu' : ''}`}>
                  <div className="corner-decor-lpu top-left-lpu"></div>
                  <div className="corner-decor-lpu bottom-left-lpu"></div>
                  <div className="click-hint-lpu hint-left-lpu"><ArrowLeft /> Volver</div>
                  <h2 className="final-title-lpu gold-foil-lpu anim-el-lpu" style={{'--delay': '0.2s'}}>Mi Parte Favorita</h2>
                  <div className="fancy-divider-lpu anim-el-lpu" style={{'--delay': '0.4s'}}></div>
                  <p className="final-text-lpu anim-el-lpu" style={{'--delay': '0.6s'}}>
                    "No sé escribir poesía. Pero si pudiera, cada verso sería sobre ti."
                  </p>
                  <div className="signature-lpu anim-el-lpu" style={{'--delay': '0.9s'}}>Con todo mi amor.</div>
                </div>
              </div>
            </div>

            {/* ==========================================
                BASE — DIORAMA POP-UP (página derecha fija)
                ========================================== */}
            <div className="base-page-lpu paper-page-lpu" style={{ zIndex: 0 }}>
              <div className="bookmark-ribbon-lpu"></div>

              <div className="page-content-lpu right-page-lpu diorama-container-lpu">
                <div className="corner-decor-lpu top-right-lpu"></div>
                <div className="corner-decor-lpu bottom-right-lpu"></div>

                <button
                  className="close-book-btn-lpu"
                  onClick={(e) => { e.stopPropagation(); setCurrentSpread(0); }}
                >
                  <CloseIcon /> Cerrar
                </button>

                {mensaje ? (
                  <p className={`diorama-mensaje-lpu ${currentSpread === maxSpreads ? 'mensaje-visible-lpu' : ''}`}>
                    {mensaje}
                  </p>
                ) : null}

                <div className="popup-diorama-lpu">

                  <div className={`popup-layer-lpu layer-back-lpu ${currentSpread === maxSpreads ? 'is-popped-lpu' : ''}`}>
                    <div className="archway-glow-lpu"></div>
                    <div className="archway-lpu">
                      <div className="archway-inner-lpu"></div>
                    </div>
                  </div>

                  <div className={`popup-layer-lpu layer-mid-lpu ${currentSpread === maxSpreads ? 'is-popped-lpu' : ''}`}>
                    <div className="photo-frame-lpu gold-border-lpu">
                      <img src={fotos[2] || fotos[0]} alt="Final" className="popup-img-lpu" />
                    </div>
                  </div>

                  <div className={`popup-layer-lpu layer-front-lpu ${currentSpread === maxSpreads ? 'is-popped-lpu' : ''}`}>
                    <div className="front-decor-lpu">
                      <span className="decor-text-lpu gold-foil-lpu">Para siempre</span>
                    </div>
                  </div>

                  {showParticles && (
                    <div className="particles-wrapper-lpu">
                      {particles}
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AntiInspectGuard>
  );
}
