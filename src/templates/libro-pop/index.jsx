import React, { useState, useEffect, useRef } from 'react';

export default function LibroPopUpTemplate({ data }) {
  // ==========================================
  // DATOS Y ESTADOS
  // ==========================================
  const nombre = data?.nombre || "Mi Amor";
  const titulo = data?.titulo || "Nuestra Historia";
  const foto1 = data?.foto || data?.fotos?.[0] || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop";
  const foto2 = data?.fotos?.[1] || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop";

  const maxSpreads = 3; // 0: Portada, 1: Intro, 2: Memorias, 3: Pop-Up
  const [currentSpread, setCurrentSpread] = useState(0);
  const [animatingLeaf, setAnimatingLeaf] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const audioRef = useRef(null);

  // ==========================================
  // LÓGICA DE INTERACCIÓN Y FÍSICA 3D
  // ==========================================
  const playTurnSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play prevented"));
    }
  };

  const nextPage = (e) => {
    e.stopPropagation();
    if (currentSpread < maxSpreads) {
      playTurnSound();
      setAnimatingLeaf(currentSpread); // Bloquea Z-index durante giro
      setCurrentSpread(prev => prev + 1);
      setTimeout(() => setAnimatingLeaf(null), 1200); // 1.2s es la duración de la transición CSS
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

  // Activar partículas en la última página
  useEffect(() => {
    let timer;
    if (currentSpread === maxSpreads) {
      timer = setTimeout(() => setShowParticles(true), 1200);
    } else {
      setShowParticles(false);
    }
    return () => clearTimeout(timer);
  }, [currentSpread]);

  // Generador de Destellos y Corazones Mágicos
  const particles = Array.from({ length: 25 }).map((_, i) => {
    const isHeart = i % 2 === 0;
    const randomX = (Math.random() - 0.5) * 150;
    return (
      <div 
        key={`p-${i}`} 
        className="particle-magic-lpu"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 1.5}s`,
          animationDuration: `${Math.random() * 2 + 2.5}s`,
          '--size': `${Math.random() * 10 + 8}px`,
          '--rx': `${randomX}px`
        }}
      >
        {isHeart ? '❤' : '✨'}
      </div>
    );
  });

  // ==========================================
  // MOTOR DE APILAMIENTO Z-INDEX (Evita cortes)
  // ==========================================
  const getLeafStyle = (index) => {
    const isTurned = currentSpread > index;
    const isAnimating = animatingLeaf === index;
    
    // Si se está animando, va por encima de todo.
    // Si está a la derecha (no girada), se apilan hacia abajo (100 - index).
    // Si está a la izquierda (girada), se apilan hacia arriba (index).
    let z = isTurned ? index + 1 : 100 - index;
    if (isAnimating) z = 999;

    return {
      zIndex: z,
      // Se eliminó el translateZ de aquí para que las páginas no "se hundan" al girar.
      transform: `rotateY(${isTurned ? -180 : 0}deg)`
    };
  };

  const isFrontActive = (index) => currentSpread === index;
  const isBackActive = (index) => currentSpread === index + 1;

  return (
    <div className="template-wrapper-lpu">
      <audio ref={audioRef} preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_b293e5066a.mp3?filename=page-turn-1-101416.mp3" type="audio/mp3" />
      </audio>

      <div className={`bg-title-lpu ${currentSpread > 0 ? 'hidden-lpu' : ''}`}>
        Un regalo para ti...
      </div>

      <div className="scene-lpu">
        {/* El libro se traslada exactamente a la mitad de su ancho al abrirse (50%) para centrarse perfecto */}
        <div className={`book-lpu ${currentSpread > 0 ? 'is-open-lpu' : ''}`}>
          
          <div className="book-spine-lpu">
            <div className="spine-ribs-lpu"></div>
            <div className="spine-ribs-lpu"></div>
            <div className="spine-ribs-lpu"></div>
          </div>

          {/* ==========================================
              HOJA 0 (PORTADA Y PÁG. 1 IZQ)
              ========================================== */}
          <div className="leaf-lpu" style={getLeafStyle(0)}>
            {/* PORTADA */}
            <div className="page-lpu page-front-lpu cover-front-lpu" onClick={nextPage}>
              <div className="cover-border-lpu">
                <div className="cover-content-lpu">
                  <h1 className="cover-title-lpu gold-foil-lpu">{titulo}</h1>
                  <div className="cover-ornament-lpu gold-foil-lpu">❦</div>
                  <p className="cover-subtitle-lpu">Para {nombre}</p>
                </div>
              </div>
              <div className="click-hint-lpu hint-glow-lpu">Toca para abrir ➦</div>
            </div>

            {/* PÁGINA IZQ (PRÓLOGO) */}
            <div className="page-lpu page-back-lpu paper-page-lpu" onClick={prevPage}>
              <div className={`page-content-lpu left-page-lpu ${isBackActive(0) ? 'active-content-lpu' : ''}`}>
                <div className="corner-decor-lpu top-left-lpu"></div>
                <div className="corner-decor-lpu bottom-left-lpu"></div>
                <div className="click-hint-lpu hint-left-lpu">⇦ Cerrar</div>
                
                <div className="dedication-lpu">
                  <h2 className="gold-foil-lpu anim-el-lpu" style={{'--delay': '0.2s'}}>Prólogo</h2>
                  <p className="anim-el-lpu" style={{'--delay': '0.4s'}}>
                    Toda gran historia tiene un comienzo. El mío empezó en el exacto momento en que nuestras miradas se cruzaron.
                  </p>
                  <p className="mt-lpu anim-el-lpu" style={{'--delay': '0.6s'}}>
                    Este pequeño libro es un viaje a través de mis sentimientos por ti. Cada página es un latido de mi corazón.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================
              HOJA 1 (PÁGINAS DERECHA E IZQUIERDA CENTRALES)
              ========================================== */}
          <div className="leaf-lpu" style={getLeafStyle(1)}>
            {/* PÁGINA DERECHA (CAP I) */}
            <div className="page-lpu page-front-lpu paper-page-lpu" onClick={nextPage}>
              <div className={`page-content-lpu right-page-lpu ${isFrontActive(1) ? 'active-content-lpu' : ''}`}>
                <div className="corner-decor-lpu top-right-lpu"></div>
                <div className="corner-decor-lpu bottom-right-lpu"></div>
                <div className="click-hint-lpu hint-right-lpu">Avanzar ➦</div>
                
                <h3 className="chapter-title-lpu gold-foil-lpu anim-el-lpu" style={{'--delay': '0.3s'}}>I: La Magia</h3>
                <p className="text-body-lpu anim-el-lpu" style={{'--delay': '0.5s'}}>
                  Dicen que la magia no existe, pero yo difiero. La encuentro en tu sonrisa y en la paz de tu voz.
                </p>
                
                <div className="polaroid-lpu tilt-right-lpu anim-pic-lpu" style={{'--delay': '0.8s', '--rot': '4deg'}}>
                  <div className="polaroid-pin-lpu"></div>
                  <div className="img-wrapper-lpu">
                    <img src={foto1} alt="Momento 1" />
                  </div>
                  <span>Nuestro inicio</span>
                </div>
              </div>
            </div>

            {/* PÁGINA IZQUIERDA (CAP II) */}
            <div className="page-lpu page-back-lpu paper-page-lpu" onClick={prevPage}>
              <div className={`page-content-lpu left-page-lpu ${isBackActive(1) ? 'active-content-lpu' : ''}`}>
                <div className="corner-decor-lpu top-left-lpu"></div>
                <div className="corner-decor-lpu bottom-left-lpu"></div>
                <div className="click-hint-lpu hint-left-lpu">⇦ Volver</div>
                
                <h3 className="chapter-title-lpu gold-foil-lpu anim-el-lpu" style={{'--delay': '0.2s'}}>II: Nosotros</h3>
                
                <div className="polaroid-lpu tilt-left-lpu anim-pic-lpu" style={{'--delay': '0.5s', '--rot': '-4deg'}}>
                  <div className="polaroid-tape-lpu"></div>
                  <div className="img-wrapper-lpu">
                    <img src={foto2} alt="Momento 2" />
                  </div>
                  <span>Cada instante cuenta</span>
                </div>
                
                <p className="text-body-lpu mt-lpu anim-el-lpu" style={{'--delay': '0.8s'}}>
                  A tu lado, los días normales se vuelven aventuras extraordinarias.
                </p>
              </div>
            </div>
          </div>

          {/* ==========================================
              HOJA 2 (PÁGINA DERECHA Y FINAL IZQUIERDA)
              ========================================== */}
          <div className="leaf-lpu" style={getLeafStyle(2)}>
            {/* PÁGINA DERECHA (CAP III) */}
            <div className="page-lpu page-front-lpu paper-page-lpu" onClick={nextPage}>
              <div className={`page-content-lpu right-page-lpu ${isFrontActive(2) ? 'active-content-lpu' : ''}`}>
                <div className="corner-decor-lpu top-right-lpu"></div>
                <div className="corner-decor-lpu bottom-right-lpu"></div>
                <div className="click-hint-lpu hint-right-lpu">Descubrir ➦</div>
                
                <h3 className="chapter-title-lpu gold-foil-lpu anim-el-lpu" style={{'--delay': '0.3s'}}>III: El Futuro</h3>
                <p className="text-body-lpu anim-el-lpu" style={{'--delay': '0.5s'}}>
                  Mi mayor deseo es que las páginas de nuestro libro nunca se acaben y sigamos escribiendo recuerdos juntos.
                </p>
                <p className="text-body-lpu mt-lpu anim-el-lpu hint-text-lpu" style={{'--delay': '0.8s'}}>
                  Pasa a la última página, tengo una sorpresa más para ti...
                </p>
              </div>
            </div>

            {/* PÁGINA IZQUIERDA (CARTA FINAL) */}
            <div className="page-lpu page-back-lpu paper-page-lpu" onClick={prevPage}>
              <div className={`page-content-lpu left-page-lpu ${isBackActive(2) ? 'active-content-lpu' : ''}`}>
                <div className="corner-decor-lpu top-left-lpu"></div>
                <div className="corner-decor-lpu bottom-left-lpu"></div>
                <div className="click-hint-lpu hint-left-lpu">⇦ Volver</div>
                
                <h2 className="final-title-lpu gold-foil-lpu anim-el-lpu" style={{'--delay': '0.2s'}}>Mi Favorita</h2>
                <div className="fancy-divider-lpu anim-el-lpu" style={{'--delay': '0.4s'}}></div>
                
                <p className="final-text-lpu anim-el-lpu" style={{'--delay': '0.6s'}}>
                  "Cada capítulo a tu lado es mi parte favorita de la vida. Eres la historia que siempre quiero seguir leyendo."
                </p>
                
                <div className="signature-lpu anim-el-lpu" style={{'--delay': '0.9s'}}>Te amo infinito.</div>
              </div>
            </div>
          </div>

          {/* ==========================================
              BASE DEL LIBRO (POP-UP ESTÁTICO DERECHA)
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
                ✖ Cerrar 
              </button>

              {/* DIORAMA POP-UP (Despliegue mágico al final) */}
              <div className="popup-diorama-lpu">
                
                <div className={`popup-layer-lpu layer-back-lpu ${currentSpread === maxSpreads ? 'is-popped-lpu' : ''}`}>
                  <div className="archway-glow-lpu"></div>
                  <div className="archway-lpu">
                    <div className="archway-inner-lpu"></div>
                  </div>
                </div>

                <div className={`popup-layer-lpu layer-mid-lpu ${currentSpread === maxSpreads ? 'is-popped-lpu' : ''}`}>
                  <div className="photo-frame-lpu gold-border-lpu">
                    <img src={foto1} alt="Final" className="popup-img-lpu" />
                  </div>
                </div>

                <div className={`popup-layer-lpu layer-front-lpu ${currentSpread === maxSpreads ? 'is-popped-lpu' : ''}`}>
                  <div className="front-decor-lpu">
                    <span className="decor-text-lpu gold-foil-lpu">Por Siempre</span>
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

      {/* ==========================================
          ESTILOS CSS (DISEÑO MATE Y PROPORCIONES FLUIDAS)
          ========================================== */}
      <style>{`
        .template-wrapper-lpu {
          container-type: size;
          width: 100%;
          height: 100%;
          min-height: 400px;
          background: radial-gradient(circle at top right, #341235 0%, #15051a 60%, #08010a 100%);
          font-family: 'Georgia', serif;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          
          /* EL SECRETO DEL ESCALADO PERFECTO: Todo se basa en --book-w */
          /* clamp asegura que no desborde un preview-box de 320px, pero crezca en desktop */
          --book-w: clamp(130px, 45cqw, 400px);
          --book-h: calc(var(--book-w) * 1.45); /* Aspect ratio perfecto */
          
          /* Sistema de tipografía fluida basado en el ancho del libro */
          --fz-h1: calc(var(--book-w) * 0.15);
          --fz-h2: calc(var(--book-w) * 0.11);
          --fz-h3: calc(var(--book-w) * 0.09);
          --fz-p: calc(var(--book-w) * 0.055);
          --fz-small: calc(var(--book-w) * 0.045);
        }

        .template-wrapper-lpu * { box-sizing: border-box; }

        .bg-title-lpu {
          position: absolute; top: 8%;
          color: transparent;
          background: linear-gradient(45deg, #f9d976, #fff, #f9d976);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          font-family: 'Dancing Script', cursive, serif;
          font-size: clamp(2rem, 8cqw, 4rem);
          transition: opacity 0.8s ease, transform 0.8s ease;
          animation: shine 3s linear infinite, floatTitle 4s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 10px rgba(249, 217, 118, 0.3));
        }
        .bg-title-lpu.hidden-lpu { opacity: 0; transform: translateY(-20px); }

        @keyframes floatTitle { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }

        .gold-foil-lpu {
          background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text; background-clip: text;
          animation: shine 4s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }

        /* --- ESCENA Y CÁMARA 3D --- */
        .scene-lpu {
          width: 100%; height: 100%;
          perspective: 2000px;
          display: flex; align-items: center; justify-content: center;
        }

        /* --- EL LIBRO --- */
        .book-lpu {
          position: relative;
          width: var(--book-w); height: var(--book-h);
          transform-style: preserve-3d;
          transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
          transform: rotateX(15deg) rotateY(-10deg) rotateZ(2deg);
        }

        /* Centrado impecable: translateX(50%) mueve el libro exactamente la mitad de su ancho */
        .book-lpu.is-open-lpu {
          transform: translateX(50%) rotateX(10deg) rotateY(0deg) rotateZ(0deg);
        }

        .book-spine-lpu {
          position: absolute; top: 0; left: -14px;
          width: 14px; height: 100%;
          background: linear-gradient(to right, #1a050d, #4a0d24, #2a0814);
          transform-origin: right center; transform: rotateY(-90deg);
          border-radius: 6px 0 0 6px;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.9);
          display: flex; flex-direction: column; justify-content: space-evenly; align-items: center;
        }
        .spine-ribs-lpu {
          width: 100%; height: 3px; background: rgba(0,0,0,0.4);
          border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(0,0,0,0.8);
        }

        .bookmark-ribbon-lpu {
          position: absolute; top: -2px; left: 15%;
          width: 12%; height: calc(100% + 20px);
          background: linear-gradient(to right, #8b0000, #c8102e, #8b0000);
          z-index: -1; transform-origin: top; transform: translateZ(-2px);
          box-shadow: 2px 5px 10px rgba(0,0,0,0.4);
          clip-path: polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 10px), 0 100%);
        }

        /* --- LAS HOJAS (LEAVES) --- */
        .leaf-lpu {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          transform-style: preserve-3d;
          transform-origin: left center;
          transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }

        .page-lpu {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          border-radius: 2px 6px 6px 2px;
          overflow: hidden;
        }

        /* Separación milimétrica para evitar Z-Fighting al rotar */
        .page-front-lpu { transform: rotateY(0deg) translateZ(1px); }
        .page-back-lpu { transform: rotateY(180deg) translateZ(1px); border-radius: 6px 2px 2px 6px; }

        /* --- PORTADA --- */
        .cover-front-lpu {
          background: radial-gradient(circle at 50% 50%, #5e112c 0%, #2a0814 100%);
          border: 1px solid #1a050d;
          box-shadow: inset 4px 0 15px rgba(0,0,0,0.7), 6px 12px 25px rgba(0,0,0,0.7);
          display: flex; align-items: center; justify-content: center;
          padding: calc(var(--book-w) * 0.05);
        }

        .cover-border-lpu {
          width: 100%; height: 100%;
          border: 2px double rgba(212, 175, 55, 0.6);
          border-radius: 2px 4px 4px 2px;
          display: flex; align-items: center; justify-content: center; position: relative;
        }
        .cover-border-lpu::before, .cover-border-lpu::after {
          content: ''; position: absolute; width: 15px; height: 15px; border: 2px solid #d4af37;
        }
        .cover-border-lpu::before { top: 4px; left: 4px; border-right: none; border-bottom: none; }
        .cover-border-lpu::after { bottom: 4px; right: 4px; border-left: none; border-top: none; }

        .cover-content-lpu { text-align: center; padding: 5px; }

        .cover-title-lpu {
          font-size: var(--fz-h1); margin: 0;
          text-transform: uppercase; letter-spacing: 1px;
          text-shadow: 2px 2px 5px rgba(0,0,0,0.9); line-height: 1.1;
        }

        .cover-ornament-lpu {
          font-size: var(--fz-h2); margin: 5px 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }

        .cover-subtitle-lpu {
          font-family: 'Dancing Script', cursive, serif; color: #e5c386;
          font-size: var(--fz-h3); text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
        }

        /* --- INTERIORES (PAPEL VINTAGE) --- */
        .paper-page-lpu, .cover-inner-lpu, .base-page-lpu {
          background: #fdf5e6;
          background-image: radial-gradient(rgba(0,0,0,0.02) 1px, transparent 1px);
          background-size: 4px 4px;
          box-shadow: inset 0 0 25px rgba(139, 69, 19, 0.1);
        }

        .base-page-lpu {
          position: absolute; inset: 0;
          border-radius: 2px 6px 6px 2px;
          box-shadow: 8px 15px 25px rgba(0,0,0,0.7);
        }

        .page-content-lpu {
          position: absolute; inset: 0;
          padding: calc(var(--book-w) * 0.08);
          display: flex; flex-direction: column;
        }

        .right-page-lpu { background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.03) 10%, transparent 20%); }
        .left-page-lpu { background: linear-gradient(270deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.03) 10%, transparent 20%); }

        .corner-decor-lpu {
          position: absolute; width: 12px; height: 12px;
          border: 1px solid rgba(212, 175, 55, 0.4); pointer-events: none;
        }
        .top-left-lpu { top: 6px; left: 6px; border-right: none; border-bottom: none; }
        .top-right-lpu { top: 6px; right: 6px; border-left: none; border-bottom: none; }
        .bottom-left-lpu { bottom: 6px; left: 6px; border-right: none; border-top: none; }
        .bottom-right-lpu { bottom: 6px; right: 6px; border-left: none; border-top: none; }

        /* --- SISTEMA DE ANIMACIÓN AL PASAR PÁGINAS --- */
        .anim-el-lpu {
          opacity: 0;
          transform: translateY(10px) scale(0.95);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          transition-delay: var(--delay, 0s);
        }
        .anim-pic-lpu {
          opacity: 0;
          transform: translateY(20px) rotate(0deg) scale(0.8);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          transition-delay: var(--delay, 0s);
        }

        .active-content-lpu .anim-el-lpu { opacity: 1; transform: translateY(0) scale(1); }
        .active-content-lpu .anim-pic-lpu { opacity: 1; transform: translateY(0) rotate(var(--rot)) scale(1); }

        /* Pistas de Click */
        .click-hint-lpu {
          position: absolute; font-size: calc(var(--book-w) * 0.035);
          color: rgba(92, 20, 46, 0.6); text-transform: uppercase;
          letter-spacing: 1px; font-family: sans-serif; pointer-events: none; font-weight: bold;
        }
        
        .hint-glow-lpu {
          bottom: 12px; color: #fff; background: rgba(212, 175, 55, 0.8);
          padding: 4px 10px; border-radius: 12px; box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
          animation: pulseAnim 2s infinite;
        }
        @keyframes pulseAnim { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }

        .hint-right-lpu { bottom: 8px; right: 8px; }
        .hint-left-lpu  { bottom: 8px; left: 8px; }

        /* --- TIPOGRAFÍA --- */
        .chapter-title-lpu {
          font-size: var(--fz-h2);
          border-bottom: 1px solid rgba(212, 175, 55, 0.5);
          padding-bottom: 2px; margin-top: 0; margin-bottom: 6px; text-align: center;
        }

        .text-body-lpu {
          font-size: var(--fz-p);
          line-height: 1.45; color: #3a2a2f; text-align: justify; margin: 0;
        }
        .mt-lpu { margin-top: 8px; }
        .hint-text-lpu { font-style: italic; color: #6a1b3d; font-weight: bold; text-align: center;}

        .dedication-lpu { text-align: center; margin-top: 8px; }
        .dedication-lpu h2 { font-style: italic; font-size: var(--fz-h2); margin: 0 0 8px 0; }
        .dedication-lpu p { font-size: var(--fz-p); line-height: 1.4; color: #4a363d; margin-bottom: 6px;}

        .final-title-lpu { text-align: center; font-size: var(--fz-h2); margin-top: 5px; margin-bottom: 5px; }
        .fancy-divider-lpu {
          width: 50%; height: 1px; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 6px auto;
        }

        .final-text-lpu {
          font-family: 'Dancing Script', cursive, serif;
          text-align: center; font-size: var(--fz-h3);
          color: #5c142e; margin: 10px 0; line-height: 1.3;
        }
        .signature-lpu {
          text-align: right; font-weight: bold; color: #7c1f43;
          font-size: var(--fz-small); margin-top: auto; margin-bottom: 8px;
        }

        /* --- POLAROIDS --- */
        .polaroid-lpu {
          background: #fffafa; padding: 4px 4px 12px 4px;
          box-shadow: 2px 4px 10px rgba(0,0,0,0.25); margin: 8px auto;
          width: 80%; display: flex; flex-direction: column; align-items: center;
          position: relative; transition: transform 0.3s ease;
        }
        
        .polaroid-pin-lpu {
          position: absolute; top: 3px; left: 50%; transform: translateX(-50%);
          width: 5px; height: 5px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ff8a8a, #800020); box-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .polaroid-tape-lpu {
          position: absolute; top: -4px; left: 50%; transform: translateX(-50%) rotate(-5deg);
          width: 25px; height: 10px; background: rgba(255,255,255,0.6); box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .img-wrapper-lpu {
          width: 100%; aspect-ratio: 1/1; overflow: hidden; border: 1px solid rgba(0,0,0,0.05);
        }
        .polaroid-lpu img { width: 100%; height: 100%; object-fit: cover; }
        .polaroid-lpu span {
          margin-top: 4px; font-family: 'Dancing Script', cursive, serif;
          color: #4a363d; font-size: var(--fz-small);
        }

        /* --- BOTÓN DE CIERRE --- */
        .close-book-btn-lpu {
          position: absolute; top: 6px; right: 6px;
          background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.5);
          border-radius: 12px; padding: 2px 6px; font-size: var(--fz-small);
          color: #5c142e; cursor: pointer; z-index: 100; font-weight: bold; transition: all 0.3s;
        }
        .close-book-btn-lpu:hover { background: rgba(212, 175, 55, 0.4); transform: scale(1.05); }

        /* ========================================================
           SISTEMA DIORAMA POP-UP 3D (Escalado Perfecto)
           ======================================================== */
        .diorama-container-lpu {
          perspective: 800px; justify-content: flex-end; padding-bottom: 10px;
        }

        .popup-diorama-lpu {
          position: relative; width: 100%; height: 60%;
          transform-style: preserve-3d;
        }

        .popup-layer-lpu {
          position: absolute; bottom: 0; left: 50%;
          transform-style: preserve-3d; transform-origin: bottom center;
          transform: translateX(-50%) rotateX(-90deg);
          opacity: 0; transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
        }

        /* Elevación reducida y controlada para no salir del borde en Z */
        .popup-layer-lpu.is-popped-lpu.layer-back-lpu  { transition-delay: 0.6s; transform: translateX(-50%) rotateX(0deg) translateZ(4px); opacity: 1; }
        .popup-layer-lpu.is-popped-lpu.layer-mid-lpu   { transition-delay: 0.8s; transform: translateX(-50%) rotateX(0deg) translateZ(20px); opacity: 1; }
        .popup-layer-lpu.is-popped-lpu.layer-front-lpu { transition-delay: 1.0s; transform: translateX(-50%) rotateX(0deg) translateZ(40px); opacity: 1; }

        /* Capas Pop-up con aspect-ratio para fotos para evitar achatamiento */
        .layer-back-lpu { width: 90%; height: 95%; }
        .archway-glow-lpu {
          position: absolute; inset: -5px;
          background: radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%);
          animation: pulseGlow 2s infinite alternate; border-radius: 50% 50% 0 0;
        }
        @keyframes pulseGlow { 0% { opacity: 0.5; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1.05); } }

        .archway-lpu {
          width: 100%; height: 100%; background: #fffdf9;
          border: 2px solid #d4af37; border-radius: 50% 50% 0 0;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.15); padding: 4px; position: relative; z-index: 2;
        }
        .archway-inner-lpu {
          width: 100%; height: 100%; border: 1px dashed #d4af37;
          border-radius: 48% 48% 0 0; background: radial-gradient(ellipse at bottom, #fff4e6 0%, #fdf5e6 100%);
        }

        .layer-mid-lpu { width: 70%; height: auto; aspect-ratio: 1/1.2; bottom: 5%; }
        .gold-border-lpu { border: 2px solid #d4af37; }
        .photo-frame-lpu {
          width: 100%; height: 100%; background: white; padding: 4px 4px 10px 4px;
          box-shadow: 3px 6px 12px rgba(0,0,0,0.3); border-radius: 2px;
        }
        .popup-img-lpu { width: 100%; height: 100%; object-fit: cover; border-radius: 2px; }

        .layer-front-lpu { width: 85%; height: 18%; bottom: 10%; }
        .front-decor-lpu {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.95); backdrop-filter: blur(4px);
          border-radius: 12px; border: 2px solid #d4af37; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .decor-text-lpu {
          font-size: var(--fz-h3); font-weight: bold;
          font-family: 'Dancing Script', cursive, serif; margin: 0; padding: 0; line-height: 1;
        }

        /* --- PARTÍCULAS MÁGICAS --- */
        .particles-wrapper-lpu {
          position: absolute; inset: 0; pointer-events: none; transform: translateZ(60px);
        }
        .particle-magic-lpu {
          position: absolute; bottom: 0; color: #ff4d6d;
          font-size: var(--size); text-shadow: 0 0 5px rgba(255, 255, 255, 0.8); opacity: 0;
          animation: magicFloat-lpu linear forwards;
        }
        @keyframes magicFloat-lpu {
          0% { transform: translateY(0) translateX(0) scale(0.5) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-120px) translateX(var(--rx)) scale(1.2) rotate(90deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}