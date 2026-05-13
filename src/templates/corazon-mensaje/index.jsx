import React, { useState, useEffect, useRef, useCallback } from 'react';
import './style.css'
import Music from './songs/musica.mp3'; // Música predeterminada
import Exposion1 from './songs/explosion1.mp3'; // Sonido de explosión 1
import Exposion2 from './songs/explosion2.mp3'; // Sonido de explosión 2
import Exposion3 from './songs/explosion3.mp3'; // Sonido de explosión 3
import Explocion4 from './songs/explosion4.mp3'; // Sonido de explosión 4
import { AntiInspectGuard } from '../../lib/antiInspect';



export default function FuegosAmorTemplate({ data }) {
  // ==========================================
  // DATOS Y ESTADOS
  // ==========================================
  const nombre = data?.nombre || "Mi Amor";
  const musicaURL = data?.musicaURL || Music; // URL de la música personalizada o predeterminada
  const explosionSounds = [Exposion1, Exposion2, Exposion3, Explocion4]; // Array de sonidos de explosión
  
  const mensajesEspeciales = [
    "Flores amarillas para la amistad que ilumina mis días",
    "Un detalle amarillo para la persona que siempre me acompaña 💛",
    "La amistad verdadera también florece en amarillo 🌻",
    "Eres luz en mi vida, por eso estas flores son para ti 🌟",
    "Flores amarillas: símbolo de la alegría de tenerte 💖"
  ];

  const coloresRomanticos = [
    "#ffeb99", "#ffe066", "#ffd633", "#ffcc00", "#ffc200",
    "#ffb700", "#ffad00", "#ffa300", "#ff9900", "#ff8f00"
  ];

  const [isStarted, setIsStarted] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [floatingTexts, setFloatingTexts] = useState([]);
  
  // Referencias
  const containerRef = useRef(null);
  const canvasRef = useRef(null); 
  const audioRef = useRef(null);
  const fireworksRef = useRef([]);
  const textIdCounter = useRef(0);
  
  // Funciones de utilidad matemática
  const random = (min, max) => Math.random() * (max - min) + min;

  // ==========================================
  // GESTOR DE TEXTOS FLOTANTES ("TE QUIERO")
  // ==========================================
  // Usamos una referencia para que la clase Firework pueda llamarla sin problemas de dependencias
  const addFloatingTextRef = useRef((x, y, color) => {
    const id = textIdCounter.current++;
    const text = Math.random() < 0.7 ? "TE QUIERO" : "TE ADORO";
    
    setFloatingTexts(prev => [...prev, { id, x, y, color, text }]);
    
    // Auto-eliminar después de 8 segundos (duración de la animación CSS)
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 8000);
  });

  // ==========================================
  // SECUENCIA DE MENSAJES CENTRALES
  // ==========================================
  useEffect(() => {
    if (!isStarted) return;
    
    let index = 0;
    setCurrentMessage(mensajesEspeciales[index]);
    
    const interval = setInterval(() => {
      index++;
      if (index < mensajesEspeciales.length) {
        setCurrentMessage(mensajesEspeciales[index]);
      } else {
        // Al terminar el array, lo oculta un rato y vuelve a empezar
        setCurrentMessage("");
        setTimeout(() => {
          index = 0;
          setCurrentMessage(mensajesEspeciales[index]);
        }, 4000);
      }
    }, 6000); // Cambia cada 6 segundos

    return () => clearInterval(interval);
  }, [isStarted]);

  // ==========================================
  // CLASES DEL MOTOR DE FUEGOS ARTIFICIALES
  // ==========================================
  useEffect(() => {
    if (!isStarted || !canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    // Pre-cargar audios de explosión
    const preloadedExplosions = explosionSounds.map(src => {
      const audio = new Audio(src);
      audio.preload = "none";
      return audio;
    });


    // Ajustar al tamaño del contenedor
    const resizeCanvas = () => {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ==========================================
    // LÓGICA DE PARTÍCULAS (CÓDIGO ORIGINAL ADAPTADO)
    // ==========================================
    class HeartParticle {
      constructor(x, y, angle, color) {
        const t = angle;
        const sizeBase = 10;
        this.x = x;
        this.y = y;
        // Fórmula paramétrica del corazón
        this.vx = sizeBase * 16 * Math.pow(Math.sin(t), 3) * 0.08;
        this.vy = -sizeBase * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.08;
        this.alpha = 1;
        this.color = color;
        this.size = random(3, 7); // Escala ajustada para pantallas
        this.rotation = random(0, Math.PI * 2);
        this.rotationSpeed = random(-0.05, 0.05);
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.96; // Fricción
        this.vy *= 0.96;
        this.vy += 0.04; // Gravedad suave
        this.alpha -= 0.005; // Desvanecimiento
        this.rotation += this.rotationSpeed;
      }

      drawHeart(ctx, x, y, size, color, alpha, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(size, size);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -3, -5, -3, -5, 0);
        ctx.bezierCurveTo(-5, 3, 0, 5, 0, 7);
        ctx.bezierCurveTo(0, 5, 5, 3, 5, 0);
        ctx.bezierCurveTo(5, -3, 0, -3, 0, 0);
        ctx.closePath();
        
        const grd = ctx.createRadialGradient(0, 0, 1, 0, 0, 7);
        grd.addColorStop(0, color);
        grd.addColorStop(1, `${color}00`);
        
        ctx.fillStyle = grd;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      draw() {
        if (this.alpha <= 0) return;
        this.drawHeart(ctx, this.x, this.y, this.size / 6, this.color, this.alpha, this.rotation);
      }
    }

    class Firework {
      constructor(x, y) {
        this.x = x || random(canvas.width * 0.1, canvas.width * 0.9);
        this.y = canvas.height;
        this.targetY = y || random(canvas.height * 0.1, canvas.height * 0.4);
        this.exploded = false;
        this.particles = [];
        this.color = coloresRomanticos[Math.floor(random(0, coloresRomanticos.length))];
        this.speed = random(3, 6);
        this.size = random(2, 4);
        this.sparkles = [];
        
        // Estela inicial del cohete
        for (let i = 0; i < 5; i++) {
          this.sparkles.push({
            x: this.x, y: this.y,
            size: random(1, 2), alpha: 1, speed: random(-1, 1)
          });
        }
      }

      update() {
        if (!this.exploded) {
          this.y -= this.speed;
          
          this.sparkles.forEach(spark => {
            spark.x += random(-1, 1);
            spark.y -= this.speed * 0.5;
            spark.alpha -= 0.03;
          });
          
          if (Math.random() < 0.4) {
            this.sparkles.push({
              x: this.x, y: this.y, size: random(1, 2), alpha: 1, speed: random(-1, 1)
            });
          }
          
          this.sparkles = this.sparkles.filter(s => s.alpha > 0);

          if (this.y <= this.targetY) {
            this.explode();
          }
        }
        
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.alpha > 0);
      }

      explode() {
        this.exploded = true;

        // --- REPRODUCIR SONIDO DE EXPLOSIÓN ---
        if (preloadedExplosions.length > 0) {
          const randomAudio = preloadedExplosions[Math.floor(random(0, preloadedExplosions.length))];
          // Clonamos el nodo para que los sonidos se puedan superponer si explotan varios a la vez
          const soundClone = randomAudio.cloneNode();
          soundClone.volume = 0.6;
          soundClone.play().catch(e => console.log("Audio play error:", e));
        }
        // --------------------------------------
        
        // 1. Explosión en forma circular básica
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
          this.particles.push(new HeartParticle(this.x, this.y, a, this.color));
        }
        
        // 2. Probabilidad del 40% de que la explosión tome forma paramétrica de corazón gigante
        if (Math.random() < 0.4) {
          for (let a = 0; a < Math.PI * 2; a += 0.15) {
            const t = a;
            const px = 16 * Math.pow(Math.sin(t), 3);
            const py = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            this.particles.push(new HeartParticle(
              this.x + px * 1.5, 
              this.y + py * 1.5, 
              a, 
              coloresRomanticos[Math.floor(random(0, coloresRomanticos.length))]
            ));
          }
        }
        
        // 3. Agregar los textos flotantes "TE QUIERO"
        for (let i = 0; i < 3; i++) {
          addFloatingTextRef.current(
            this.x + random(-40, 40), 
            this.y + random(-40, 40), 
            this.color
          );
        }
      }

      draw() {
        if (!this.exploded) {
          // Dibujar estela
          this.sparkles.forEach(spark => {
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, spark.alpha);
            ctx.fill();
            ctx.globalAlpha = 1;
          });
          
          // Dibujar cohete ascendente
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        
        // Dibujar partículas de la explosión
        this.particles.forEach(p => p.draw());
      }
    }

    // Función para lanzar fuego aleatorio (Accesible desde onClick)
    const launchFirework = (x, y) => {
      fireworksRef.current.push(new Firework(x, y));
    };
    // Guardamos la función en el ref del contenedor para usarla en el onClick
    containerRef.current.launchFirework = launchFirework;

    // Lanzamiento automático
    const autoLaunch = setInterval(() => {
      launchFirework();
    }, 2000); // Cada 2 segundos

    // Bucle principal de animación
    const animate = () => {
      // Efecto de desvanecimiento suave en el fondo para crear estelas
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];
        fw.update();
        fw.draw();
        
        if (fw.exploded && fw.particles.length === 0) {
          fireworksRef.current.splice(i, 1);
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(autoLaunch);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isStarted]);

  // ==========================================
  // MANEJADOR DE CLICS
  // ==========================================
  const handleInteraction = (e) => {
    if (!isStarted) {
      setIsStarted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(err => console.log("Audio play error:", err));
      }
      return;
    }

    if (containerRef.current && containerRef.current.launchFirework) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      containerRef.current.launchFirework(x, y);
    }
  };

  // Generador de Estrellas de Fondo Estáticas (DOM)
  const bgStars = Array.from({ length: 70 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.2
  }));

  return (
    <AntiInspectGuard>
    <div 
      className="wrapper-fa" 
      ref={containerRef}
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* ==========================================
          MÚSICA DE FONDO (Piano Romántico)
          ========================================== */}
      <audio ref={audioRef} loop preload="none">
        <source src={musicaURL} type="audio/mpeg" />
      </audio>

      {/* ==========================================
          ESTRELLAS CSS TITILANTES (Fondo)
          ========================================== */}
      {bgStars.map(star => (
        <div 
          key={star.id} 
          className="star-fa"
          style={{
            width: `${star.size}px`, height: `${star.size}px`,
            left: star.left, top: star.top,
            animationDelay: star.delay, opacity: star.opacity
          }}
        />
      ))}

      {/* ==========================================
          CANVAS (Fuegos Artificiales)
          ========================================== */}
      <canvas ref={canvasRef} className="fireworks-canvas-fa" />

      {/* ==========================================
          MENSAJE CENTRAL FLOTANTE (Fade In/Out)
          ========================================== */}
      {isStarted && currentMessage && (
        <div className="center-message-fa" key={currentMessage}>
          {currentMessage}
        </div>
      )}

      {/* ==========================================
          TEXTOS FLOTANTES "TE QUIERO"
          ========================================== */}
      {floatingTexts.map(t => (
        <div 
          key={t.id} 
          className="floating-text-fa"
          style={{ left: t.x, top: t.y, color: t.color }}
        >
          {t.text}
        </div>
      ))}

      {/* ==========================================
          NOMBRE INFERIOR
          ========================================== */}
      {isStarted && (
        <div className="bottom-name-fa"><p>Para {nombre}</p></div>
      )}

      {/* ==========================================
          BOTÓN DE INICIO
          ========================================== */}
      {!isStarted && (
        <button className="play-btn-fa pulse-btn-fa">
          Toca para comenzar
        </button>
      )}

      {/* ==========================================
          ESTILOS CSS
          ========================================== */}
      
    </div>
    </AntiInspectGuard>
  );
}