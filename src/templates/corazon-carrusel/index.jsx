import React, { useState, useEffect, useRef } from 'react';
import './style.css';

export default function Proyecto3CorazonNeonParticulas3D() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [secuenciaAbrirIniciada, setSecuenciaAbrirIniciada] = useState(false);
  const [elementosFlotantes, setElementosFlotantes] = useState([]);
  
  const canvasRef = useRef(null);
  const estadoRef = useRef({
    secuenciaIniciada: false,
    particles: []
  });

  useEffect(() => {
    estadoRef.current.secuenciaIniciada = secuenciaAbrirIniciada;
  }, [secuenciaAbrirIniciada]);

  // LÓGICA DEL CORAZÓN DENSO (3000 PARTÍCULAS)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = 300;
    canvas.height = 300;

    const numParticles = 3000; // ¡Miles de partículas como pediste!
    const particles = [];
    const fov = 200; 

    for (let i = 0; i < numParticles; i++) {
      // 1. Generar ángulo aleatorio y radio aleatorio (para rellenar el interior)
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()); // Distribución uniforme del área
      const scale = 6.5; // Escala del corazón
      
      // 2. Fórmula base del corazón
      const pX = 16 * Math.pow(Math.sin(t), 3);
      // Negativo para que no salga de cabeza
      const pY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      // 3. Multiplicar por el radio para rellenar el volumen
      const hX = pX * r * scale;
      const hY = pY * r * scale;

      // 4. Calcular grosor 3D (Z) para que sea gordito en el centro y fino en los bordes
      const maxThickness = 15 * scale;
      const hZ = (Math.random() - 0.5) * maxThickness * (1 - r);

      const baseY = 140 + hY;

      // 5. Determinar color: Si está justo en el centro (X ≈ 0), es la línea dorada
      const isGold = Math.abs(hX) < 3.5 && r > 0.1;

      particles.push({
        heartX: 150 + hX,
        heartY: baseY,
        heartZ: hZ,
        
        x: 150 + hX,
        y: baseY,
        z: hZ,

        baseFloatX: Math.random() * Math.PI * 2,
        baseFloatY: Math.random() * Math.PI * 2,
        speedX: Math.random() * 0.04 + 0.01,
        speedY: Math.random() * 0.04 + 0.01,
        angleZ: Math.random() * Math.PI * 2,
        speedZ: Math.random() * 0.02 + 0.01,

        lineY: (i / numParticles) * 200 + 50, 
        phase: 'normal', 
        alpha: 1,
        size: Math.random() * 1.5 + 0.5,
        isGold: isGold
      });
    }

    estadoRef.current.particles = particles;

    const render = () => {
      // Usar clearRect es más rápido para borrar el frame anterior
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const easeFactor = 0.08; 

      estadoRef.current.particles.forEach(p => {
        let targetX, targetY, targetZ;

        if (estadoRef.current.secuenciaIniciada) {
          if (p.phase === 'normal') {
            // Ir al centro de la pantalla
            targetX = 150; targetY = 150; targetZ = 0;
            if (Math.abs(p.x - 150) < 5 && Math.abs(p.y - 150) < 5) p.phase = 'formingLine';

          } else if (p.phase === 'formingLine') {
            // Expandirse en línea recta vertical
            targetX = 150; targetY = p.lineY; targetZ = 0;
            p.alpha -= 0.015; 
            if (p.alpha < 0) p.alpha = 0;
          }
        } else {
          // Movimiento de flotación interno
          p.baseFloatX += p.speedX; p.baseFloatY += p.speedY; p.angleZ += p.speedZ;
          targetX = p.heartX + Math.cos(p.baseFloatX) * 2;
          targetY = p.heartY + Math.sin(p.baseFloatY) * 2;
          targetZ = p.heartZ + Math.sin(p.angleZ) * 10; 
        }

        p.x += (targetX - p.x) * easeFactor;
        p.y += (targetY - p.y) * easeFactor;
        p.z += (targetZ - p.z) * easeFactor;

        // Perspectiva 3D
        const perspectiveScale = fov / (fov + p.z);
        const drawX = (p.x - 150) * perspectiveScale + 150;
        const drawY = (p.y - 150) * perspectiveScale + 150;
        const drawSize = Math.max(0.5, p.size * perspectiveScale);

        const glowFactor = Math.max(0, 1 - p.z / 150);
        const dynamicAlpha = p.alpha * perspectiveScale * glowFactor;

        if (dynamicAlpha > 0.05) {
          // OPTIMIZACIÓN: fillRect es mucho más rápido que arc() para miles de partículas
          ctx.fillStyle = p.isGold 
            ? `rgba(255, 215, 0, ${dynamicAlpha})` 
            : `rgba(255, 0, 170, ${dynamicAlpha})`;
          ctx.fillRect(drawX, drawY, drawSize, drawSize);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleClicPantalla = (e) => {
    if (modalAbierto || secuenciaAbrirIniciada) return; 

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const opciones = ["I love you ♡", "♥", "I love you", "💕"];
    const baseTexto = opciones[Math.floor(Math.random() * opciones.length)];
    const cantidad = 4;
    const nuevosElementos = [];

    for (let i = 0; i < cantidad; i++) {
      nuevosElementos.push({
        id: Date.now() + Math.random(),
        texto: baseTexto,
        x,
        y,
        variante: i
      });
    }

    setElementosFlotantes((prev) => [...prev, ...nuevosElementos]);

    setTimeout(() => {
      const idsToRemove = nuevosElementos.map(el => el.id);
      setElementosFlotantes((prev) => prev.filter(t => !idsToRemove.includes(t.id)));
    }, 1200);
  };

  const handleAbrir = (e) => {
    e.stopPropagation();
    setSecuenciaAbrirIniciada(true); 
    
    setTimeout(() => {
      setModalAbierto(true);
    }, 1500);
  };

  return (
    <div className="regalo-virtual-container theme-neon-pink">
      <div className="pantalla-fondo" onClick={handleClicPantalla}>
        
        {elementosFlotantes.map((item) => (
          <div 
            key={item.id} 
            className={`texto-flotante variante-${item.variante}`}
            style={{ left: item.x, top: item.y }}
          >
            {item.texto}
          </div>
        ))}

        <h1 className={`titulo-top ${secuenciaAbrirIniciada ? 'oculto' : ''}`}>I love you ♡</h1>

        {/* Contenedor del Canvas */}
        <div className={`corazon-canvas-container ${secuenciaAbrirIniciada ? 'pausar-latido' : ''}`}>
          <canvas ref={canvasRef} className="corazon-canvas"></canvas>
        </div>

        <button 
          className={`boton-abrir-neon ${secuenciaAbrirIniciada ? 'oculto' : ''}`} 
          onClick={handleAbrir}
        >
          Abrir
        </button>
      </div>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-titulo">Para Luz ✨</h2>
            
            <p className="modal-texto">
              En cada latido de mi corazón encuentro la melodía perfecta que compone nuestra historia de amor. 
              Eres la luz que ilumina mis días más oscuros y la razón por la cual cada amanecer tiene sentido. 
              Tu sonrisa es mi refugio, tu abrazo mi hogar, y tu amor la fuerza que me impulsa a ser mejor cada día. 🌸
            </p>

            <div className="carrusel-3d">
              <img src="/api/media/image_1.png" alt="Foto 1" className="carta-img izquierda" />
              <img src="/api/media/image_2.png" alt="Foto 2" className="carta-img centro" />
              <img src="/api/media/image_3.png" alt="Foto 3" className="carta-img derecha" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}