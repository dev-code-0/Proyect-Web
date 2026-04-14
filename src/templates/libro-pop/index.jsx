import React, { useState, useEffect, useRef } from 'react';
import './style.css'
import Image1 from './images/image1.avif'
import Image2 from './images/image2.avif'
import Image3 from './images/image3.avif'

export default function LibroPopUpTemplate({ data }) {
  // ==========================================
  // DATOS Y ESTADOS
  // ==========================================
  const titulo = data?.titulo || "Nuestra Historia";
  const nombre = data?.nombre || "María";
  const fotos = data?.fotos && data.fotos.length > 0? data.fotos
      : [Image1, Image2, Image3]; // Array de fotos para el libro

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
                    <img src={fotos[0]} alt="Momento 1" />
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
                    <img src={fotos[1]} alt="Momento 2" />
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
                    <img src={fotos[2]} alt="Final" className="popup-img-lpu" />
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


    </div>
  );
}