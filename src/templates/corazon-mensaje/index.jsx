import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './style.css';
import Music from './songs/musica.mp3';
import Exposion1 from './songs/explosion1.mp3';
import Exposion2 from './songs/explosion2.mp3';
import Exposion3 from './songs/explosion3.mp3';
import Explocion4 from './songs/explosion4.mp3';
import { AntiInspectGuard } from '../../lib/antiInspect';

const MENSAJES_FALLBACK = [
  "Eres lo mejor que me ha pasado",
  "Cada momento contigo vale todo",
  "Mi corazon late solo por ti",
  "Te quiero mas de lo que las palabras pueden decir",
  "Eres mi todo",
];

const COLORES = [
  "#ff0a54", "#ff477e", "#ff6b9d", "#c9184a",
  "#e63980", "#ff4d6d", "#ff758c", "#fb3e7a",
  "#d62560", "#ff85a1",
];

export default function FuegosDeAmorTemplate({ data }) {
  const nombre      = data?.nombre  || "Mi Amor";
  const musicaURL   = data?.song    || Music;
  const explosionSounds = [Exposion1, Exposion2, Exposion3, Explocion4];

  const mensajesRotacion = useMemo(() => {
    if (data?.mensaje) return [data.mensaje, ...MENSAJES_FALLBACK.slice(0, 2)];
    return MENSAJES_FALLBACK;
  }, [data?.mensaje]);

  const [isStarted,      setIsStarted]      = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [floatingTexts,  setFloatingTexts]  = useState([]);

  const containerRef  = useRef(null);
  const canvasRef     = useRef(null);
  const audioRef      = useRef(null);
  const fireworksRef  = useRef([]);
  const textIdCounter = useRef(0);
  const timeoutIdsRef = useRef([]);

  const random = (min, max) => Math.random() * (max - min) + min;

  const addFloatingTextRef = useRef((x, y, color) => {
    const id   = textIdCounter.current++;
    const text = Math.random() < 0.7 ? "TE QUIERO" : "TE ADORO";
    setFloatingTexts(prev => [...prev, { id, x, y, color, text }]);
    const tid = setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 8000);
    timeoutIdsRef.current.push(tid);
  });

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  // Secuencia de mensajes centrales
  useEffect(() => {
    if (!isStarted) return;
    let index = 0;
    setCurrentMessage(mensajesRotacion[index]);
    const interval = setInterval(() => {
      index++;
      if (index < mensajesRotacion.length) {
        setCurrentMessage(mensajesRotacion[index]);
      } else {
        setCurrentMessage("");
        const tid = setTimeout(() => {
          index = 0;
          setCurrentMessage(mensajesRotacion[index]);
        }, 4000);
        timeoutIdsRef.current.push(tid);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isStarted, mensajesRotacion]);

  // Motor de fuegos artificiales
  useEffect(() => {
    if (!isStarted || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let animationId;

    const preloadedExplosions = explosionSounds.map(src => {
      const audio = new Audio(src);
      audio.preload = "none";
      return audio;
    });

    const resizeCanvas = () => {
      canvas.width  = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class HeartParticle {
      constructor(x, y, angle, color) {
        const t = angle;
        const sizeBase = 10;
        this.x  = x;
        this.y  = y;
        this.vx = sizeBase * 16 * Math.pow(Math.sin(t), 3) * 0.08;
        this.vy = -sizeBase * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.08;
        this.alpha         = 1;
        this.color         = color;
        this.size          = random(3, 7);
        this.rotation      = random(0, Math.PI * 2);
        this.rotationSpeed = random(-0.05, 0.05);
      }

      update() {
        this.x  += this.vx;
        this.y  += this.vy;
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += 0.04;
        this.alpha    -= 0.005;
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
        ctx.fillStyle   = grd;
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
        this.x        = x || random(canvas.width * 0.1, canvas.width * 0.9);
        this.y        = canvas.height;
        this.targetY  = y || random(canvas.height * 0.1, canvas.height * 0.4);
        this.exploded = false;
        this.particles = [];
        this.color    = COLORES[Math.floor(random(0, COLORES.length))];
        this.speed    = random(3, 6);
        this.size     = random(2, 4);
        this.sparkles = [];
        for (let i = 0; i < 5; i++) {
          this.sparkles.push({ x: this.x, y: this.y, size: random(1, 2), alpha: 1, speed: random(-1, 1) });
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
            this.sparkles.push({ x: this.x, y: this.y, size: random(1, 2), alpha: 1, speed: random(-1, 1) });
          }
          this.sparkles = this.sparkles.filter(s => s.alpha > 0);
          if (this.y <= this.targetY) this.explode();
        }
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.alpha > 0);
      }

      explode() {
        this.exploded = true;
        if (preloadedExplosions.length > 0) {
          const clone = preloadedExplosions[Math.floor(random(0, preloadedExplosions.length))].cloneNode();
          clone.volume = 0.6;
          clone.play().catch(() => {});
        }
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
          this.particles.push(new HeartParticle(this.x, this.y, a, this.color));
        }
        if (Math.random() < 0.4) {
          for (let a = 0; a < Math.PI * 2; a += 0.15) {
            const t  = a;
            const px = 16 * Math.pow(Math.sin(t), 3);
            const py = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            this.particles.push(new HeartParticle(
              this.x + px * 1.5,
              this.y + py * 1.5,
              a,
              COLORES[Math.floor(random(0, COLORES.length))]
            ));
          }
        }
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
          this.sparkles.forEach(spark => {
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            ctx.fillStyle   = this.color;
            ctx.globalAlpha = Math.max(0, spark.alpha);
            ctx.fill();
            ctx.globalAlpha = 1;
          });
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
        this.particles.forEach(p => p.draw());
      }
    }

    const launchFirework = (x, y) => fireworksRef.current.push(new Firework(x, y));
    containerRef.current.launchFirework = launchFirework;

    const autoLaunch = setInterval(() => launchFirework(), 2000);

    const animate = () => {
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

  const handleInteraction = (e) => {
    if (!isStarted) {
      setIsStarted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch(() => {});
      }
      return;
    }
    if (containerRef.current?.launchFirework) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
      const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
      containerRef.current.launchFirework(x, y);
    }
  };

  // Estrellas estables — no se recalculan en cada render
  const bgStars = useMemo(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id:    i,
      size:  Math.random() * 3 + 1,
      left:  `${Math.random() * 100}%`,
      top:   `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2,
    })),
  []);

  return (
    <AntiInspectGuard>
      <div
        className="wrapper-fa"
        ref={containerRef}
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
      >
        <audio ref={audioRef} loop preload="none">
          <source src={musicaURL} type="audio/mpeg" />
        </audio>

        {bgStars.map(star => (
          <div
            key={star.id}
            className="star-fa"
            style={{
              width: `${star.size}px`, height: `${star.size}px`,
              left: star.left, top: star.top,
              animationDelay: star.delay, opacity: star.opacity,
            }}
          />
        ))}

        <canvas ref={canvasRef} className="fireworks-canvas-fa" />

        {isStarted && currentMessage && (
          <div className="center-message-fa" key={currentMessage}>
            {currentMessage}
          </div>
        )}

        {floatingTexts.map(t => (
          <div
            key={t.id}
            className="floating-text-fa"
            style={{ left: t.x, top: t.y, color: t.color }}
          >
            {t.text}
          </div>
        ))}

        {isStarted && (
          <div className="bottom-name-fa"><p>Para {nombre}</p></div>
        )}

        {!isStarted && (
          <button className="play-btn-fa pulse-btn-fa">
            Toca para comenzar
          </button>
        )}
      </div>
    </AntiInspectGuard>
  );
}
