import React, { useState, useEffect, useRef } from 'react';
import './style.css';

export default function CajaMusicalTemplate({ data }) {
  // ==========================================
  // DATOS Y FALLBACKS
  // ==========================================
  const nombre = data?.nombre || "Mi Princesa";
  const titulo = data?.titulo || "Magia para ti";
  const mensaje = data?.mensaje || "En esta cajita de cristal guardo nuestros recuerdos más hermosos. Eres la magia que transformó mi vida en un cuento de hadas. Te amo.";
  
  const fotos = data?.fotos?.length >= 4 
    ? data.fotos.slice(0, 4) 
    : [
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop"
      ];

  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trailDots, setTrailDots] = useState([]);
  
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  let trailIdRef = useRef(0);

  // ==========================================
  // INTERACCIÓN, PARALLAX Y POLVO DE HADAS
  // ==========================================
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Parallax
    if (!isOpen) {
      const x = ((e.clientX - left) / width - 0.5) * 2;
      const y = ((e.clientY - top) / height - 0.5) * 2;
      setMousePos({ x, y });
    }

    // Polvo de hadas (Mouse Trail)
    const newDot = {
      id: trailIdRef.current++,
      x: e.clientX - left,
      y: e.clientY - top,
      size: Math.random() * 8 + 4,
      color: ['#ffb5a7', '#fcd5ce', '#f8edeb', '#ff99c8'][Math.floor(Math.random() * 4)]
    };
    
    setTrailDots(prev => [...prev, newDot]);
    
    setTimeout(() => {
      setTrailDots(prev => prev.filter(dot => dot.id !== newDot.id));
    }, 1000); // El polvo desaparece después de 1 segundo
  };

  const handleMouseLeave = () => {
    if (!isOpen) setMousePos({ x: 0, y: 0 });
  };

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log(err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleOpen = () => {
    if (isOpen) return; 
    setIsOpen(true);
    setMousePos({ x: 0, y: 0 }); // Centrar vista al abrir
    
    if (audioRef.current && !isPlaying) {
      audioRef.current.volume = 0.6;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
    }

    triggerExplosion();
  };

  // Efecto Máquina de Escribir
  useEffect(() => {
    if (isOpen) {
      let i = 0;
      const startTimer = setTimeout(() => {
        const typingInterval = setInterval(() => {
          setTypedText(mensaje.slice(0, i));
          i++;
          if (i > mensaje.length) clearInterval(typingInterval);
        }, 40);
        return () => clearInterval(typingInterval);
      }, 2500);
      return () => clearTimeout(startTimer);
    }
  }, [isOpen, mensaje]);

  // ==========================================
  // MOTOR CANVAS: PÉTALOS, CORAZONES Y ESTRELLAS
  // ==========================================
  const particles = useRef([]);
  let animationFrameId;

  const triggerExplosion = () => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.55; 

    // Generar Partículas Mixtas
    for (let i = 0; i < 120; i++) {
      const typeRand = Math.random();
      let pType = 'circle';
      if (typeRand > 0.7) pType = 'petal';
      else if (typeRand > 0.4) pType = 'heart';
      else if (typeRand > 0.2) pType = 'star';

      particles.current.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 25,
        vy: (Math.random() - 1) * 22 - 6,
        size: Math.random() * 8 + 4,
        color: ['#ff758f', '#ffb5a7', '#ffd700', '#fff0f3'][Math.floor(Math.random() * 4)],
        life: 1,
        decay: Math.random() * 0.008 + 0.004,
        type: pType,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.4,
        swaySpeed: Math.random() * 0.1 + 0.05,
        swayAmp: Math.random() * 3 + 1
      });
    }

    animateParticles(ctx, canvas);
  };

  // Dibujo de un pétalo de rosa/sakura
  const drawPetal = (ctx, x, y, size, color, alpha, rot) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-size, -size * 0.5, -size, size, 0, size);
    ctx.bezierCurveTo(size, size, size, -size * 0.5, 0, 0);
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();
  };

  const drawHeart = (ctx, x, y, size, color, alpha, rot) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, size * 0.6, 0, size * 0.8, 0, size);
    ctx.bezierCurveTo(0, size * 0.8, size / 2, size * 0.6, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size * 0.3);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();
  };

  const drawStar = (ctx, x, y, radius, color, alpha, rot) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, 0 - radius);
    for (let i = 0; i < 5; i++) {
      ctx.rotate(Math.PI / 5);
      ctx.lineTo(0, 0 - (radius * 0.4));
      ctx.rotate(Math.PI / 5);
      ctx.lineTo(0, 0 - radius);
    }
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();
  };

  const animateParticles = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = false;

    particles.current.forEach(p => {
      if (p.life > 0) {
        activeParticles = true;
        
        // Física general
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravedad suave
        p.rot += p.rotSpeed;
        p.life -= p.decay;

        // Efecto de mecerse en el viento para pétalos
        if (p.type === 'petal') {
          p.x += Math.sin(p.life * 100 * p.swaySpeed) * p.swayAmp;
          p.vy *= 0.96; // Los pétalos caen más lento (fricción de aire)
        }

        // Rebote en el suelo
        if (p.y > canvas.height - 20) {
          p.y = canvas.height - 20;
          p.vy *= -0.5;
          p.vx *= 0.8;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.vx *= -0.8;
        }

        // Dibujar según tipo
        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size * 1.5, p.color, Math.max(0, p.life), p.rot);
        } else if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size * 1.2, p.color, Math.max(0, p.life), p.rot);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size * 1.8, p.color, Math.max(0, p.life), p.rot);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fill();
        }
      }
    });

    if (activeParticles) {
      animationFrameId = requestAnimationFrame(() => animateParticles(ctx, canvas));
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className={`template-wrapper-c3d ${isOpen ? 'is-open-c3d' : ''}`} 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={(e) => handleMouseMove(e.touches[0])}
      style={{
        '--mx': mousePos.x,
        '--my': mousePos.y
      }}
    >
      
      {/* POLVO DE HADAS (MOUSE TRAIL) */}
      {trailDots.map(dot => (
        <div 
          key={dot.id} 
          className="fairy-dust-c3d" 
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            boxShadow: `0 0 8px ${dot.color}`
          }} 
        />
      ))}

      {/* MÚSICA ROMÁNTICA */}
      <audio ref={audioRef} loop preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1bc8.mp3?filename=romantic-piano-10192.mp3" type="audio/mp3" />
      </audio>

      {/* BOTÓN DE VINILO (MÚSICA) */}
      <div className={`vinyl-btn-c3d ${isPlaying ? 'spinning-c3d' : ''}`} onClick={toggleMusic}>
        <div className="vinyl-grooves-c3d"></div>
        <div className="vinyl-label-c3d">❤</div>
      </div>

      {/* MARIPOSAS MÁGICAS CSS */}
      <div className="butterfly-c3d b-one"><div className="wing-l"></div><div className="wing-r"></div></div>
      <div className="butterfly-c3d b-two"><div className="wing-l"></div><div className="wing-r"></div></div>

      {/* CANVAS PARA EFECTOS VISUALES */}
      <canvas ref={canvasRef} className="magic-canvas-c3d" />

      {/* TÍTULO DE FONDO */}
      <div className="title-layer-c3d">
        <h1 className="main-title-c3d">{titulo}</h1>
        <p className="subtitle-c3d">Toca para descubrir la magia</p>
      </div>

      {/* ESCENA 3D */}
      <div className="scene-c3d">
        
        {/* LA CAJA CON PARALLAX */}
        <div className="box-wrapper-c3d" onClick={handleOpen}>
          
          <div className="box-aura-c3d"></div>

          {/* SOMBRA EN EL SUELO */}
          <div className="box-shadow-c3d"></div>

          {/* CUERPO DE LA CAJA */}
          <div className="box-body-c3d">
            <div className="side-c3d front-c3d">
              <div className="ribbon-v-c3d"></div>
              {/* Cerradura de corazón brillante */}
              <div className="heart-lock-c3d pulse-glow-c3d">❤</div>
            </div>
            <div className="side-c3d back-c3d"><div className="ribbon-v-c3d"></div></div>
            <div className="side-c3d left-c3d"><div className="ribbon-v-c3d"></div></div>
            <div className="side-c3d right-c3d"><div className="ribbon-v-c3d"></div></div>
            <div className="side-c3d bottom-c3d"></div>
            
            {/* Interior Mágico de la caja */}
            <div className="side-c3d inner-bottom-c3d">
              <div className="inner-glow-c3d"></div>
            </div>
          </div>

          {/* TAPA DE LA CAJA (Vuela al abrir) */}
          <div className="box-lid-c3d">
            <div className="lid-side-c3d lid-top-c3d">
              <div className="ribbon-v-c3d"></div>
              <div className="ribbon-h-c3d"></div>
              <div className="bow-c3d">
                <div className="bow-loop-c3d loop-left-c3d"></div>
                <div className="bow-loop-c3d loop-right-c3d"></div>
                <div className="bow-center-c3d"></div>
              </div>
            </div>
            <div className="lid-side-c3d lid-front-c3d"><div className="ribbon-v-c3d"></div></div>
            <div className="lid-side-c3d lid-back-c3d"><div className="ribbon-v-c3d"></div></div>
            <div className="lid-side-c3d lid-left-c3d"><div className="ribbon-h-c3d"></div></div>
            <div className="lid-side-c3d lid-right-c3d"><div className="ribbon-h-c3d"></div></div>
          </div>

          {/* CARRUSEL TIPO "MÓVIL COLGANTE" CON NÚCLEO DE LUZ */}
          <div className="carousel-wrapper-c3d">
            <div className="carousel-pillar-c3d">
              <div className="pillar-top-orb-c3d"></div>
              {/* NÚCLEO DE CRISTAL */}
              <div className="crystal-core-c3d">✧</div>
            </div>
            <div className="carousel-spinner-c3d">
              {fotos.map((src, index) => (
                <div 
                  key={index} 
                  className="carousel-panel-c3d" 
                  style={{ '--rotY': `${index * 90}deg` }}
                >
                  <div className="hanging-string-c3d"></div>
                  <div className="photo-frame-c3d">
                    <img src={src} alt={`Recuerdo ${index + 1}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* MENSAJE FINAL (Carta Glassmorphism con Sello de Cera) */}
      <div className="message-card-c3d">
        <div className="wax-seal-c3d">❤</div>
        <h2 className="rose-gold-text-c3d">Para {nombre}</h2>
        <div className="divider-c3d"></div>
        <p>
          {typedText}
          {isOpen && typedText.length < mensaje.length && <span className="cursor-c3d">|</span>}
        </p>
        <span className="signature-c3d" style={{ opacity: typedText.length === mensaje.length ? 1 : 0 }}>
          Con todo mi amor 💖
        </span>
      </div>
      
    </div>
  );
}