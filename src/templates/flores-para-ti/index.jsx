import React, { useState, useEffect, useRef } from 'react';

export default function FloresParaTiTemplate({ data }) {
  const titulo = data?.titulo || "Flores Para Ti 🌻";
  
  // ==========================================
  // ESTADOS
  // ==========================================
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  
  // Referencias
  const containerRef = useRef(null);
  const particleContainerRef = useRef(null);
  const fallingContainerRef = useRef(null);
  const audioRef = useRef(null);

  // ==========================================
  // INICIALIZACIÓN DE ANIMACIONES
  // ==========================================
  useEffect(() => {
    // Las flores crecen después de 1 segundo
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(loadTimer);
  }, []);

  // ==========================================
  // MOTOR DE PARTÍCULAS Y FLORES CAYENDO (60FPS)
  // ==========================================
  useEffect(() => {
    if (!particleContainerRef.current || !fallingContainerRef.current) return;

    let animationFrameId;
    let lastParticleTime = 0;
    let lastFlowerTime = 0;
    const particleInterval = 150; // Ms entre luciérnagas
    const flowerInterval = 400; // Ms entre flores cayendo

    const createParticle = (x, y) => {
      const pContainer = particleContainerRef.current;
      if (!pContainer) return;
      
      const particle = document.createElement('div');
      particle.className = 'particle-fl';
      const size = Math.random() * 5 + 2;
      
      // Estilos en línea para evitar reflows masivos
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      pContainer.appendChild(particle);
      
      // Auto-destrucción
      setTimeout(() => {
        if(pContainer.contains(particle)) particle.remove();
      }, 6000);
    };

    const createFallingFlower = () => {
      const fContainer = fallingContainerRef.current;
      if (!fContainer) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'falling-flower-wrapper-fl';
      
      const flower = document.createElement('div');
      flower.className = 'falling-flower-fl';
      
      const animDuration = Math.random() * 7 + 6; // Caen entre 6 y 13 segs
      const size = Math.random() * 25 + 15; // Tamaño

      wrapper.style.left = `${Math.random() * 90}cqw`;
      wrapper.style.animationDuration = `${animDuration}s`;
      
      flower.style.animationDuration = `${Math.random() * 2 + 3}s`;
      flower.style.width = `${size}px`;
      flower.style.height = `${size}px`;
      flower.style.filter = `blur(${Math.random() * 1.5}px)`;
      flower.style.opacity = (Math.random() * 0.4 + 0.6).toString();

      wrapper.appendChild(flower);
      fContainer.appendChild(wrapper);

      setTimeout(() => {
        if(fContainer.contains(wrapper)) wrapper.remove();
      }, animDuration * 1000 + 500);
    };

    const animationLoop = (timestamp) => {
      // Crear Luciérnagas
      if (timestamp - lastParticleTime > particleInterval) {
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;
        
        createParticle(Math.random() * width, Math.random() * height);
        // Luciérnagas concentradas cerca de las flores
        createParticle((width / 2) + (Math.random() - 0.5) * (width * 0.8), height * 0.7 + (Math.random() - 0.5) * (height * 0.3));
        
        lastParticleTime = timestamp;
      }

      // Crear Flores Cayendo
      if (timestamp - lastFlowerTime > flowerInterval) {
        createFallingFlower();
        lastFlowerTime = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationFrameId = requestAnimationFrame(animationLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // ==========================================
  // REPRODUCTOR DE MÚSICA (GLASSMORPHISM)
  // ==========================================
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setCurrentTime(formatTime(currentTime));
      setProgress((currentTime / duration) * 100 || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(formatTime(audioRef.current.duration));
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.log(e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  };

  // ==========================================
  // COMPONENTES REUTILIZABLES PARA DIBUJAR FLORES LIMPIAMENTE
  // ==========================================
  // Genera los 12 pétalos rotados perfectamente
  const renderPetals = () => (
    [...Array(12)].map((_, i) => (
      <div 
        key={`petal-${i}`} 
        className="flower-leaf-fl" 
        style={{ transform: `translate(-50%, -10%) rotate(${i * 30}deg)` }} 
      />
    ))
  );

  // Genera las 8 semillas brillantes del centro
  const renderSeeds = () => (
    [...Array(8)].map((_, i) => (
      <div key={`seed-${i}`} className={`flower-light-fl flower-light-${i + 1}-fl`} />
    ))
  );

  return (
    <div className={`wrapper-fl ${!isLoaded ? 'not-loaded-fl' : ''}`} ref={containerRef}>
      
      {/* Fondo Mágico de Luces */}
      <div className="background-fl"></div>

      {/* AUDIO */}
      <audio 
        ref={audioRef} 
        loop 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src="https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1bc8.mp3?filename=romantic-piano-10192.mp3" type="audio/mpeg" />
      </audio>

      {/* CONTENEDORES DE PARTÍCULAS (Manejados por JS) */}
      <div id="falling-flower-container-fl" ref={fallingContainerRef}></div>
      <div id="particle-container-fl" ref={particleContainerRef}></div>

      {/* TÍTULO PRINCIPAL */}
      <h1 className="love-title-fl">{titulo}</h1>

      {/* REPRODUCTOR DE MÚSICA GLASSMORPHISM */}
      <div className="music-player-fl">
        <button className="play-pause-btn-fl" onClick={togglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <div className="progress-container-fl">
          <div className="song-info-fl">Nuestra Canción amor❤️</div>
          <div className="progress-bar-fl" onClick={handleProgressClick}>
            <div className="progress-fill-fl" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="time-display-fl">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>
        </div>
      </div>

      {/* ==========================================
          LAS FLORES (REFACTORIZADAS)
          ========================================== */}
      <div className="flowers-fl">
        
        {/* Flor 1 */}
        <div className="flower-fl flower-1-fl">
          <div className="flower-leafs-fl flower-leafs-1-fl">
            {renderPetals()}
            <div className="flower-white-circle-fl"></div>
            {renderSeeds()}
          </div>
          <div className="flower-line-fl">
            <div className="flower-line-leaf-fl leaf-1-fl"></div>
            <div className="flower-line-leaf-fl leaf-2-fl"></div>
            <div className="flower-line-leaf-fl leaf-3-fl"></div>
            <div className="flower-line-leaf-fl leaf-4-fl"></div>
          </div>
        </div>

        {/* Flor 2 */}
        <div className="flower-fl flower-2-fl">
          <div className="flower-leafs-fl flower-leafs-2-fl">
            {renderPetals()}
            <div className="flower-white-circle-fl"></div>
            {renderSeeds()}
          </div>
          <div className="flower-line-fl">
            <div className="flower-line-leaf-fl leaf-1-fl"></div>
            <div className="flower-line-leaf-fl leaf-2-fl"></div>
            <div className="flower-line-leaf-fl leaf-3-fl"></div>
            <div className="flower-line-leaf-fl leaf-4-fl"></div>
          </div>
        </div>

        {/* Flor 3 */}
        <div className="flower-fl flower-3-fl">
          <div className="flower-leafs-fl flower-leafs-3-fl">
            {renderPetals()}
            <div className="flower-white-circle-fl"></div>
            {renderSeeds()}
          </div>
          <div className="flower-line-fl">
            <div className="flower-line-leaf-fl leaf-1-fl"></div>
            <div className="flower-line-leaf-fl leaf-2-fl"></div>
            <div className="flower-line-leaf-fl leaf-3-fl"></div>
            <div className="flower-line-leaf-fl leaf-4-fl"></div>
          </div>
        </div>

        {/* Flor 4 (Fondo) */}
        <div className="flower-fl flower-4-fl">
          <div className="flower-leafs-fl flower-leafs-4-fl">
            {renderPetals()}
            <div className="flower-white-circle-fl"></div>
            {renderSeeds()}
          </div>
          <div className="flower-line-fl">
            <div className="flower-line-leaf-fl leaf-1-fl"></div>
            <div className="flower-line-leaf-fl leaf-2-fl"></div>
            <div className="flower-line-leaf-fl leaf-3-fl"></div>
            <div className="flower-line-leaf-fl leaf-4-fl"></div>
          </div>
        </div>

        {/* Flor 5 (Fondo) */}
        <div className="flower-fl flower-5-fl">
          <div className="flower-leafs-fl flower-leafs-5-fl">
            {renderPetals()}
            <div className="flower-white-circle-fl"></div>
            {renderSeeds()}
          </div>
          <div className="flower-line-fl">
            <div className="flower-line-leaf-fl leaf-1-fl"></div>
            <div className="flower-line-leaf-fl leaf-2-fl"></div>
            <div className="flower-line-leaf-fl leaf-3-fl"></div>
            <div className="flower-line-leaf-fl leaf-4-fl"></div>
          </div>
        </div>

        {/* Flor 6 (Fondo Lejano) */}
        <div className="flower-fl flower-6-fl">
          <div className="flower-leafs-fl">
            {renderPetals()}
            <div className="flower-white-circle-fl"></div>
            {[...Array(4)].map((_, i) => <div key={`seed6-${i}`} className={`flower-light-fl flower-light-${i + 1}-fl`} />)}
          </div>
          <div className="flower-line-fl">
            <div className="flower-line-leaf-fl leaf-1-fl"></div>
            <div className="flower-line-leaf-fl leaf-2-fl"></div>
            <div className="flower-line-leaf-fl leaf-3-fl"></div>
            <div className="flower-line-leaf-fl leaf-4-fl"></div>
          </div>
        </div>

        {/* Flor 7 (Fondo Lejano) */}
        <div className="flower-fl flower-7-fl">
          <div className="flower-leafs-fl">
            {renderPetals()}
            <div className="flower-white-circle-fl"></div>
            {[...Array(4)].map((_, i) => <div key={`seed7-${i}`} className={`flower-light-fl flower-light-${i + 1}-fl`} />)}
          </div>
          <div className="flower-line-fl">
            <div className="flower-line-leaf-fl leaf-1-fl"></div>
            <div className="flower-line-leaf-fl leaf-2-fl"></div>
            <div className="flower-line-leaf-fl leaf-3-fl"></div>
            <div className="flower-line-leaf-fl leaf-4-fl"></div>
          </div>
        </div>

        {/* Hierba Decorativa Inferior (10 piezas generadas de forma limpia) */}
        {[...Array(10)].map((_, i) => (
          <div key={`grass-${i}`} className="growing-grass-fl">
            <div className={`flower-grass-fl flower-grass-${i + 1}-fl`}>
              <div className="flower-grass-top-fl"></div>
              <div className="flower-grass-bottom-fl"></div>
              {/* Dependiendo del pasto, dibujamos de 3 a 8 hojas */}
              {[...Array(i === 0 || i === 1 ? 8 : (i === 8 || i === 9 ? 3 : 6))].map((_, j) => (
                <div key={`gleaf-${j}`} className={`flower-grass-leaf-fl flower-grass-leaf-${j + 1}-fl`}></div>
              ))}
              <div className="flower-grass-overlay-fl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
          ESTILOS CSS OPTIMIZADOS (cqi EN VEZ DE vmin)
          ========================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap');

        /* --- CONTENEDOR RAÍZ --- */
        .wrapper-fl {
          container-type: inline-size;
          width: 100%; height: 100%; min-height: 400px;
          display: flex; align-items: flex-end; justify-content: center;
          background-color: #000; overflow: hidden; perspective: 1000px;
          position: relative; font-family: "Sour Gummy", system-ui, cursive;
          
          /* VARIABLES MAESTRAS (Reemplazo perfecto de vmin por cqi para responsive real) */
          --v: 1cqi; 
          --fl-speed: 0.8s;
          --speed-leaf: 2s;
          
          /* Paleta Premium */
          --petal-start: #ff8c00; --petal-mid: #ffd700; --petal-end: #ffff00;
          --petal-shadow: rgba(255, 215, 0, 0.4);
          --center-1: #654321; --center-2: #8b4513; --center-3: #2f1b14;
          --center-shadow: rgba(139, 69, 19, 0.6);
          --stem-1: #2d5016; --stem-2: #4a7c23; --stem-3: #6b8e23;
          --leaf-1: rgba(45, 80, 22, 0.6); --leaf-2: #4a7c23; --leaf-3: #6b8e23;
          --grass-color: #4a7c23;
          --light-seeds-1: #ffb700; --light-seeds-2: #ffea00;
          --light-seeds-shadow: rgba(255, 200, 0, 0.8);
        }

        /* Pausar animaciones hasta que cargue */
        .not-loaded-fl * { animation-play-state: paused !important; }

        /* --- FONDO MÁGICO BOKEH --- */
        .background-fl {
          position: absolute; inset: 0;
          background-image: 
            radial-gradient(ellipse at bottom, #2b1f00 0%, #000 100%),
            url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop');
          background-size: cover; background-position: center;
          opacity: 0.35; filter: blur(5px); z-index: 0; pointer-events: none;
          mix-blend-mode: screen;
        }

        /* --- TÍTULO BRILLANTE --- */
        .love-title-fl {
          position: absolute; top: clamp(15px, 5%, 30px); left: 50%; transform: translateX(-50%);
          color: #ffff00; font-size: clamp(1.8rem, 8cqi, 3.5rem);
          font-weight: bold; text-align: center; z-index: 100;
          text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff0, 0 0 30px #ff0;
          white-space: nowrap; pointer-events: none;
        }

        /* --- REPRODUCTOR GLASSMORPHISM --- */
        .music-player-fl {
          position: absolute; top: clamp(70px, 18%, 120px); left: 50%; transform: translateX(-50%);
          background: rgba(30, 20, 10, 0.6); padding: 10px 15px;
          border-radius: 20px; border: 1px solid rgba(255, 215, 0, 0.2);
          box-shadow: 0 8px 32px rgba(255, 215, 0, 0.15);
          display: flex; align-items: center; gap: 12px; z-index: 100;
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          width: 80%; max-width: 300px; transition: all 0.3s;
        }
        .music-player-fl:hover { border-color: rgba(255, 215, 0, 0.5); box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3); }

        .play-pause-btn-fl {
          background: linear-gradient(135deg, #ffd700, #ff8c00); border: none;
          border-radius: 50%; width: 36px; height: 36px; display: flex;
          align-items: center; justify-content: center; cursor: pointer;
          color: #2f1b14; transition: transform 0.2s; flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(255, 140, 0, 0.4);
        }
        .play-pause-btn-fl:hover { transform: scale(1.1); }
        .play-pause-btn-fl svg { width: 18px; height: 18px; fill: currentColor; }

        .progress-container-fl { flex: 1; display: flex; flex-direction: column; gap: 5px; }
        .song-info-fl { font-size: 0.85rem; color: #ffd700; text-shadow: 0 1px 2px rgba(0,0,0,0.8); font-weight: 600; letter-spacing: 0.5px;}
        
        .progress-bar-fl {
          width: 100%; height: 4px; background: rgba(255,255,255,0.2);
          border-radius: 2px; overflow: hidden; cursor: pointer;
        }
        .progress-fill-fl {
          height: 100%; background: linear-gradient(90deg, #ff8c00, #ffff00);
          border-radius: 2px; transition: width 0.1s linear; box-shadow: 0 0 5px #ffff00;
        }
        .time-display-fl { display: flex; justify-content: space-between; font-size: 0.7rem; color: rgba(255, 215, 0, 0.8); }

        /* --- MOTOR DE PARTÍCULAS CANVAS (JS-Driven) --- */
        #particle-container-fl, #falling-flower-container-fl {
          position: absolute; inset: 0; pointer-events: none; z-index: 99; overflow: hidden;
        }
        #falling-flower-container-fl { z-index: 0; } /* Detrás de las flores grandes */

        /* Partículas subiendo (Luciérnagas) */
        .particle-fl {
          position: absolute; background: #ffea00; border-radius: 50%;
          box-shadow: 0 0 8px #ffea00, 0 0 15px #ffb700; opacity: 0;
          animation: riseUp-fl 6s ease-out forwards;
        }
        @keyframes riseUp-fl {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-40vh) scale(0); opacity: 0; }
        }

        /* Flores SVG Cayendo */
        .falling-flower-wrapper-fl {
          position: absolute; top: -50px; animation: fallDown-fl linear forwards; will-change: transform;
        }
        .falling-flower-fl {
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="%23FFD700" d="M50 0 L58.7 34.5 L90.5 25 L65.5 41.3 L99 61.8 L61.8 61.8 L75 90.5 L50 67 L25 90.5 L38.2 61.8 L1 61.8 L34.5 41.3 L9.5 25 L41.3 34.5 Z"/><circle cx="50" cy="50" r="20" fill="%23654321"/></svg>');
          background-size: contain; background-repeat: no-repeat;
          animation: sway-fl ease-in-out infinite alternate; will-change: transform;
        }
        @keyframes fallDown-fl { to { transform: translateY(110vh); opacity: 0; } }
        @keyframes sway-fl { from { transform: translateX(-30px) rotate(-45deg); } to { transform: translateX(30px) rotate(45deg); } }


        /* ========================================================
           EL JARDÍN DE FLORES (3D CSS ADAPTADO A cqi)
           ======================================================== */
        .flowers-fl {
          position: absolute; bottom: 0; width: 100%; height: 100%;
          transform-origin: bottom center; z-index: 2; pointer-events: none;
        }

        .flower-fl { position: absolute; bottom: calc(var(--v) * 10); transform-origin: bottom center; z-index: 50; }

        /* Estructura Flor 1 */
        .flower-1-fl { animation: moveFlower-1-fl 4s linear infinite; left: 50%; }
        .flower-1-fl .flower-line-fl { height: calc(var(--v) * 55); animation-delay: 0.3s; }
        .flower-1-fl .leaf-1-fl { animation: bloomLeaf-R-fl var(--fl-speed) 1.6s backwards; }
        .flower-1-fl .leaf-2-fl { animation: bloomLeaf-R-fl var(--fl-speed) 1.4s backwards; }
        .flower-1-fl .leaf-3-fl { animation: bloomLeaf-L-fl var(--fl-speed) 1.2s backwards; }
        .flower-1-fl .leaf-4-fl { animation: bloomLeaf-L-fl var(--fl-speed) 1s backwards; }
        .flower-leafs-1-fl { animation-delay: 1.1s; }

        /* Estructura Flor 2 */
        .flower-2-fl { left: 50%; transform: rotate(20deg); animation: moveFlower-2-fl 4s linear infinite; }
        .flower-2-fl .flower-line-fl { height: calc(var(--v) * 45); animation-delay: 0.6s; }
        .flower-2-fl .leaf-1-fl { animation: bloomLeaf-R-fl var(--fl-speed) 1.9s backwards; }
        .flower-2-fl .leaf-2-fl { animation: bloomLeaf-R-fl var(--fl-speed) 1.7s backwards; }
        .flower-2-fl .leaf-3-fl { animation: bloomLeaf-L-fl var(--fl-speed) 1.5s backwards; }
        .flower-2-fl .leaf-4-fl { animation: bloomLeaf-L-fl var(--fl-speed) 1.3s backwards; }
        .flower-leafs-2-fl { animation-delay: 1.4s; }

        /* Estructura Flor 3 */
        .flower-3-fl { left: 50%; transform: rotate(-15deg); animation: moveFlower-3-fl 4s linear infinite; }
        .flower-3-fl .flower-line-fl { height: calc(var(--v) * 55); animation-delay: 0.9s; }
        .flower-3-fl .leaf-1-fl { animation: bloomLeaf-R-fl var(--fl-speed) 2.5s backwards; }
        .flower-3-fl .leaf-2-fl { animation: bloomLeaf-R-fl var(--fl-speed) 2.3s backwards; }
        .flower-3-fl .leaf-3-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.1s backwards; }
        .flower-3-fl .leaf-4-fl { animation: bloomLeaf-L-fl var(--fl-speed) 1.9s backwards; }
        .flower-leafs-3-fl { animation-delay: 1.7s; }

        /* Estructura Flor 4 (Fondo Izquierda) */
        .flower-4-fl { left: 15%; z-index: -6; transform: rotate(10deg); animation: moveFlower-4-fl 3.5s linear infinite; }
        .flower-4-fl .flower-line-fl { height: calc(var(--v) * 80); animation-delay: 1.2s; }
        .flower-4-fl .leaf-1-fl { animation: bloomLeaf-R-fl var(--fl-speed) 2.8s backwards; }
        .flower-4-fl .leaf-2-fl { animation: bloomLeaf-R-fl var(--fl-speed) 2.6s backwards; }
        .flower-4-fl .leaf-3-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.4s backwards; }
        .flower-4-fl .leaf-4-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.2s backwards; }
        .flower-leafs-4-fl { animation-delay: 2.0s; }

        /* Estructura Flor 5 (Fondo Derecha) */
        .flower-5-fl { left: 85%; z-index: -7; transform: rotate(-25deg); animation: moveFlower-5-fl 4.5s linear infinite; }
        .flower-5-fl .flower-line-fl { height: calc(var(--v) * 85); animation-delay: 1.9s; }
        .flower-5-fl .leaf-1-fl { animation: bloomLeaf-R-fl var(--fl-speed) 2.7s backwards; }
        .flower-5-fl .leaf-2-fl { animation: bloomLeaf-R-fl var(--fl-speed) 2.5s backwards; }
        .flower-5-fl .leaf-3-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.3s backwards; }
        .flower-5-fl .leaf-4-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.1s backwards; }
        .flower-leafs-5-fl { animation-delay: 2.0s; }

        /* Estructura Flor 6 */
        .flower-6-fl { left: 5%; z-index: -8; transform: rotate(-30deg); animation: moveFlower-6-fl 5s linear infinite; }
        .flower-6-fl .flower-line-fl { height: calc(var(--v) * 75); animation-delay: 2.2s; }
        .flower-6-fl .flower-leafs-fl { animation-delay: 2.3s; }
        .flower-6-fl .leaf-1-fl { animation: bloomLeaf-R-fl var(--fl-speed) 2.9s backwards; }
        .flower-6-fl .leaf-2-fl { animation: bloomLeaf-R-fl var(--fl-speed) 2.7s backwards; }
        .flower-6-fl .leaf-3-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.5s backwards; }
        .flower-6-fl .leaf-4-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.4s backwards; }

        /* Estructura Flor 7 */
        .flower-7-fl { left: 95%; z-index: -9; transform: rotate(15deg); animation: moveFlower-7-fl 4.8s linear infinite; }
        .flower-7-fl .flower-line-fl { height: calc(var(--v) * 70); animation-delay: 2.5s; }
        .flower-7-fl .flower-leafs-fl { animation-delay: 2.6s; }
        .flower-7-fl .leaf-1-fl { animation: bloomLeaf-R-fl var(--fl-speed) 3.2s backwards; }
        .flower-7-fl .leaf-2-fl { animation: bloomLeaf-R-fl var(--fl-speed) 3.0s backwards; }
        .flower-7-fl .leaf-3-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.8s backwards; }
        .flower-7-fl .leaf-4-fl { animation: bloomLeaf-L-fl var(--fl-speed) 2.7s backwards; }


        /* PETALOS Y CORAZÓN */
        .flower-leafs-fl { position: relative; animation: bloomFlower-fl 2s backwards; }
        .flower-leafs-fl::after { 
          content: ""; position: absolute; left: 0; top: 0; transform: translate(-50%, -100%); 
          width: calc(var(--v) * 8); height: calc(var(--v) * 8); background-color: #6bf0ff; filter: blur(calc(var(--v) * 10)); 
        }
        
        .flower-leaf-fl {
          position: absolute; bottom: 0; left: 50%; width: calc(var(--v) * 20); height: calc(var(--v) * 5); 
          border-radius: 10% 100% 10% 100%; 
          background-image: linear-gradient(to top, var(--petal-start), var(--petal-mid), var(--petal-end));
          transform-origin: bottom center; opacity: 0.95;
          box-shadow: inset 0 0 calc(var(--v) * 1) rgba(255, 255, 255, 0.7), 0 0 calc(var(--v) * 3) var(--petal-shadow); 
          z-index: 2;
        }

        .flower-white-circle-fl {
          position: absolute; left: calc(var(--v) * -4); top: calc(var(--v) * -4); 
          width: calc(var(--v) * 8); height: calc(var(--v) * 8); border-radius: 50%;
          background-image: radial-gradient(circle at 30% 30%, var(--center-1), var(--center-2), var(--center-3));
          box-shadow: inset 0 0 calc(var(--v) * 2) rgba(0, 0, 0, 0.8), 0 0 calc(var(--v) * 1) var(--center-shadow);
        }
        .flower-white-circle-fl::after {
          content: ""; position: absolute; left: 46%; top: 31%; transform: translate(-50%, -50%); 
          width: 80%; height: 80%; z-index: 3; border-radius: inherit;
          background-image: repeating-conic-gradient(from 0deg, var(--center-3) 0deg 15deg, var(--center-1) 15deg 30deg), radial-gradient(circle at center, var(--center-2), var(--center-1));
        }

        /* TALLO Y HOJAS */
        .flower-line-fl {
          width: calc(var(--v) * 1.5);
          background-image: linear-gradient(to left, rgba(0,0,0,0.3), transparent, rgba(255,255,255,0.2)), linear-gradient(to top, transparent 10%, var(--stem-1), var(--stem-2), var(--stem-3));
          box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.7); 
          animation: growLine-fl 4s backwards;
          position: absolute; left: 50%; transform: translateX(-50%); bottom: 0;
        }
        
        .flower-line-leaf-fl {
          --w: calc(var(--v) * 7); --h: calc(var(--w) + calc(var(--v) * 2)); 
          position: absolute; top: 20%; left: 90%; width: var(--w); height: var(--h);
          border-top-right-radius: var(--h); border-bottom-left-radius: var(--h);
          background-image: linear-gradient(to top, var(--leaf-1), var(--leaf-2), var(--leaf-3));
          box-shadow: inset 0 0 calc(var(--v) * 1) rgba(0, 0, 0, 0.3);
        }
        .leaf-1-fl { transform: rotate(70deg) rotateY(30deg); }
        .leaf-2-fl { top: 45%; transform: rotate(70deg) rotateY(30deg); }
        .leaf-3-fl, .leaf-4-fl {
          border-top-right-radius: 0; border-bottom-left-radius: 0; border-top-left-radius: var(--h); border-bottom-right-radius: var(--h); 
          left: -460%; top: 12%; transform: rotate(-70deg) rotateY(30deg);
        }
        .leaf-4-fl { top: 40%; }

        /* SEMILLAS BRILLANTES DE LA FLOR */
        .flower-light-fl {
          position: absolute; bottom: 0; width: calc(var(--v) * 1); height: calc(var(--v) * 1);
          background-color: var(--light-seeds-1); border-radius: 50%; filter: blur(calc(var(--v) * 0.1));
          animation: seedGlow-fl 6s linear infinite backwards; 
          box-shadow: 0 0 calc(var(--v) * 1.5) var(--light-seeds-shadow);
        }
        .flower-light-fl:nth-child(odd) { background-color: var(--light-seeds-2); }
        .flower-light-1-fl { left: calc(var(--v) * -2); animation-delay: 1s; } 
        .flower-light-2-fl { left: calc(var(--v) * 3); animation-delay: 0.5s; }
        .flower-light-3-fl { left: calc(var(--v) * -5); animation-delay: 0.3s; } 
        .flower-light-4-fl { left: calc(var(--v) * 5); animation-delay: 0.9s; }
        .flower-light-5-fl { left: calc(var(--v) * -1); animation-delay: 1.5s; } 
        .flower-light-6-fl { left: calc(var(--v) * -3); animation-delay: 3s; }
        .flower-light-7-fl { left: calc(var(--v) * 2); animation-delay: 2s; } 
        .flower-light-8-fl { left: calc(var(--v) * -5); animation-delay: 3.5s; }

        /* --- PASTO INFERIOR --- */
        .growing-grass-fl { animation: growGrassGroup-fl 1s 2s backwards; position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; pointer-events: none;}
        .flower-grass-fl {
          --c: var(--grass-color); --line-w: calc(var(--v) * 2);
          position: absolute; bottom: calc(var(--v) * 10); left: 50%;
          display: flex; flex-direction: column; align-items: flex-end; 
          z-index: 20; transform-origin: bottom center; will-change: transform;
        }
        
        .flower-grass-1-fl { left: 10%; animation: moveGrass-fl 2s linear infinite; transform: rotate(-48deg) rotateY(40deg); }
        .flower-grass-2-fl { left: 20%; transform: scale(0.9) rotate(75deg) rotateX(10deg) rotateY(-200deg); opacity: 0.8; z-index: 0; animation: moveGrass-2-fl 1.5s linear infinite; }
        .flower-grass-3-fl { left: 30%; transform: scale(1.1) rotate(-30deg) rotateY(45deg); opacity: 0.9; z-index: 15; animation: moveGrass-3-fl 2.2s linear infinite; }
        .flower-grass-4-fl { left: 40%; transform: scale(1.0) rotate(60deg) rotateX(15deg) rotateY(-180deg); opacity: 0.7; z-index: 5; animation: moveGrass-4-fl 1.8s linear infinite; }
        .flower-grass-5-fl { left: 50%; transform: scale(1.1) rotate(-60deg) rotateY(60deg); opacity: 0.85; z-index: 12; animation: moveGrass-5-fl 2.5s linear infinite; }
        .flower-grass-6-fl { left: 60%; transform: scale(0.95) rotate(35deg) rotateY(-45deg); opacity: 0.9; z-index: 15; animation: moveGrass-6-fl 2.3s linear infinite; }
        .flower-grass-7-fl { left: 70%; transform: scale(0.85) rotate(-70deg) rotateX(20deg) rotateY(170deg); opacity: 0.75; z-index: 8; animation: moveGrass-7-fl 1.9s linear infinite; }
        .flower-grass-8-fl { left: 80%; transform: scale(0.9) rotate(50deg) rotateY(-70deg); opacity: 0.8; z-index: 10; animation: moveGrass-8-fl 2.1s linear infinite; }
        .flower-grass-9-fl { left: 90%; transform: scale(1.2) rotate(20deg) rotateY(90deg); opacity: 0.6; z-index: 2; animation: moveGrass-9-fl 1.6s linear infinite; }
        .flower-grass-10-fl{ left: 95%; transform: scale(0.8) rotate(-45deg) rotateY(-120deg); opacity: 0.65; z-index: 3; animation: moveGrass-10-fl 2.0s linear infinite; }

        .flower-grass-top-fl { width: calc(var(--v) * 8); height: calc(var(--v) * 12); border-top-right-radius: 100%; border-right: var(--line-w) solid var(--c); transform-origin: bottom center; transform: rotate(-2deg); }
        .flower-grass-bottom-fl { margin-top: -2px; width: var(--line-w); height: calc(var(--v) * 30); background-image: linear-gradient(to top, transparent, var(--c)); }
        
        .flower-grass-leaf-fl {
          --size: calc(var(--v) * 8); position: absolute; width: calc(var(--size) * 2.1); height: var(--size);
          border-top-left-radius: var(--size); border-top-right-radius: var(--size);
          background-image: linear-gradient(to top, transparent, transparent 30%, var(--c)); z-index: 100;
        }
        .flower-grass-leaf-1-fl { top: -6%; left: 20%; --size: calc(var(--v) * 6); transform: rotate(-20deg); animation: growLeaf-1-fl var(--speed-leaf) 2.6s backwards; }
        .flower-grass-leaf-2-fl { top: -5%; left: -75%; --size: calc(var(--v) * 7); transform: rotate(10deg); animation: growLeaf-2-fl var(--speed-leaf) 2.4s linear backwards; }
        .flower-grass-leaf-3-fl { top: 5%; left: 40%; --size: calc(var(--v) * 8); transform: rotate(-18deg) rotateX(-20deg); animation: growLeaf-3-fl var(--speed-leaf) 2.2s linear backwards; }
        .flower-grass-leaf-4-fl { top: 6%; left: -95%; --size: calc(var(--v) * 9); transform: rotate(2deg); animation: growLeaf-4-fl var(--speed-leaf) 2s linear backwards; }
        .flower-grass-leaf-5-fl { top: 20%; left: 40%; --size: calc(var(--v) * 9); transform: rotate(-24deg) rotateX(-20deg); animation: growLeaf-5-fl var(--speed-leaf) 1.8s linear backwards; }
        .flower-grass-leaf-6-fl { top: 22%; left: -130%; --size: calc(var(--v) * 11); transform: rotate(10deg); animation: growLeaf-6-fl var(--speed-leaf) 1.6s linear backwards; }
        .flower-grass-leaf-7-fl { top: 39%; left: 50%; --size: calc(var(--v) * 9); transform: rotate(-10deg); animation: growLeaf-7-fl var(--speed-leaf) 1.4s linear backwards; }
        .flower-grass-leaf-8-fl { top: 40%; left: -160%; --size: calc(var(--v) * 12); transform: rotate(10deg); animation: growLeaf-8-fl var(--speed-leaf) 1.2s linear backwards; }
        
        .flower-grass-overlay-fl { position: absolute; top: -10%; right: 0%; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.1); filter: blur(calc(var(--v) * 1.5)); z-index: 100; }

        /* --- KEYFRAMES --- */
        @keyframes bloomFlower-fl { from { transform: scale(0); } }
        @keyframes growLine-fl { from { height: 0; border-radius: calc(var(--v) * 1); } }
        @keyframes bloomLeaf-R-fl { from { transform-origin: left; transform: rotate(70deg) rotateY(30deg) scale(0); } }
        @keyframes bloomLeaf-L-fl { from { transform-origin: right; transform: rotate(-70deg) rotateY(30deg) scale(0); } }
        
        @keyframes seedGlow-fl { 
          from { opacity: 0; transform: translateY(0) rotate(0deg); } 
          20% { opacity: 1; transform: translateY(calc(var(--v) * -2)) translateX(calc(var(--v) * -1)) rotate(45deg); } 
          40% { opacity: 1; transform: translateY(calc(var(--v) * -6)) translateX(calc(var(--v) * 1)) rotate(90deg); } 
          60% { transform: translateY(calc(var(--v) * -9)) translateX(calc(var(--v) * -1)) rotate(135deg); } 
          80% { transform: translateY(calc(var(--v) * -12)) translateX(calc(var(--v) * 2)) rotate(180deg); opacity: 0.5; } 
          to { transform: translateY(calc(var(--v) * -18)) rotate(225deg); opacity: 0; } 
        }

        /* Movimientos de flores (Sway) */
        @keyframes moveFlower-1-fl { from, to { transform: rotate(2deg); } 50% { transform: rotate(-2deg); } }
        @keyframes moveFlower-2-fl { from, to { transform: rotate(18deg); } 50% { transform: rotate(14deg); } }
        @keyframes moveFlower-3-fl { from, to { transform: rotate(-18deg); } 50% { transform: rotate(-20deg) rotateY(-10deg); } }
        @keyframes moveFlower-4-fl { from, to { transform: rotate(9deg); } 50% { transform: rotate(12deg) rotateY(9deg); } }
        @keyframes moveFlower-5-fl { from, to { transform: rotate(-5deg); } 50% { transform: rotate(-8deg) rotateY(5deg); } }
        @keyframes moveFlower-6-fl { from, to { transform: rotate(-20deg); } 50% { transform: rotate(-24deg) rotateY(-8deg); } }
        @keyframes moveFlower-7-fl { from, to { transform: rotate(22deg); } 50% { transform: rotate(25deg) rotateY(10deg); } }

        /* Crecimiento y movimiento del pasto */
        @keyframes growGrassGroup-fl { from { transform: scale(0); } }
        @keyframes growLeaf-1-fl { from { transform-origin: bottom left; transform: rotate(-20deg) scale(0); } }
        @keyframes growLeaf-2-fl { from { transform-origin: bottom right; transform: rotate(10deg) scale(0); } }
        @keyframes growLeaf-3-fl { from { transform-origin: bottom left; transform: rotate(-18deg) rotateX(-20deg) scale(0); } }
        @keyframes growLeaf-4-fl { from { transform-origin: bottom right; transform: rotate(2deg) scale(0); } }
        @keyframes growLeaf-5-fl { from { transform-origin: bottom left; transform: rotate(-24deg) rotateX(-20deg) scale(0); } }
        @keyframes growLeaf-6-fl { from { transform-origin: bottom right; transform: rotate(10deg) scale(0); } }
        @keyframes growLeaf-7-fl { from { transform-origin: bottom left; transform: rotate(-10deg) scale(0); } }
        @keyframes growLeaf-8-fl { from { transform-origin: bottom right; transform: rotate(10deg) scale(0); } }
        
        @keyframes moveGrass-fl { from, to { transform: rotate(-48deg) rotateY(40deg); } 50% { transform: rotate(-50deg) rotateY(40deg); } }
        @keyframes moveGrass-2-fl { from, to { transform: scale(0.9) rotate(75deg) rotateX(10deg) rotateY(-200deg); } 50% { transform: scale(0.9) rotate(79deg) rotateX(10deg) rotateY(-200deg); } }
        @keyframes moveGrass-3-fl { from, to { transform: scale(1.1) rotate(-30deg) rotateY(45deg); } 50% { transform: scale(1.1) rotate(-33deg) rotateY(50deg); } }
        @keyframes moveGrass-4-fl { from, to { transform: scale(1.0) rotate(60deg) rotateX(15deg) rotateY(-180deg); } 50% { transform: scale(1.0) rotate(63deg) rotateX(18deg) rotateY(-175deg); } }
        @keyframes moveGrass-5-fl { from, to { transform: scale(1.1) rotate(-60deg) rotateY(60deg); } 50% { transform: scale(1.1) rotate(-57deg) rotateY(65deg); } }
        @keyframes moveGrass-6-fl { from, to { transform: scale(0.95) rotate(35deg) rotateY(-45deg); } 50% { transform: scale(0.95) rotate(38deg) rotateY(-40deg); } }
        @keyframes moveGrass-7-fl { from, to { transform: scale(0.85) rotate(-70deg) rotateX(20deg) rotateY(170deg); } 50% { transform: scale(0.85) rotate(-67deg) rotateX(23deg) rotateY(175deg); } }
        @keyframes moveGrass-8-fl { from, to { transform: scale(0.9) rotate(50deg) rotateY(-70deg); } 50% { transform: scale(0.9) rotate(53deg) rotateY(-65deg); } }
        @keyframes moveGrass-9-fl { from, to { transform: scale(1.2) rotate(20deg) rotateY(90deg); } 50% { transform: scale(1.2) rotate(23deg) rotateY(95deg); } }
        @keyframes moveGrass-10-fl { from, to { transform: scale(0.8) rotate(-45deg) rotateY(-120deg); } 50% { transform: scale(0.8) rotate(-42deg) rotateY(-115deg); } }

      `}</style>
    </div>
  );
}