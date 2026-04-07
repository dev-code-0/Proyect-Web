import React, { useEffect, useRef, useState } from 'react';
import './style.css'; 

export default function CorazonMagicotemplate({data}) {
    const nombre = data?.nombre || "María";
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    
    // Estados
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [typedText, setTypedText] = useState("");

    // Texto de la carta para el efecto de máquina de escribir
    const fullLetterText = "Así como estas luces infinitas trazan la forma de un corazón sin detenerse jamás, así de constante es lo que siento por ti.\n\nQuería darte un detalle diferente, algo escrito con código y luz, para recordarte que eres la magia que ilumina mi universo.";

    // Retrasar la aparición del botón
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 3500); 
        return () => clearTimeout(timer);
    }, []);

    // Efecto Máquina de Escribir
    useEffect(() => {
        if (isLetterOpen) {
            setTypedText("");
            let i = 0;
            const typingInterval = setInterval(() => {
                setTypedText(fullLetterText.slice(0, i));
                i++;
                if (i > fullLetterText.length) {
                    clearInterval(typingInterval);
                }
            }, 35); // Velocidad de escritura
            return () => clearInterval(typingInterval);
        } else {
            setTypedText(""); // Resetear al cerrar
        }
    }, [isLetterOpen]);

    // Efecto 3D Parallax para la carta (Responsivo al contenedor)
    const handleMouseMove = (e) => {
        if (!isLetterOpen || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { clientWidth, clientHeight } = containerRef.current;
        
        const xAxis = (clientWidth / 2 - x) / 30; // Suavizado el giro
        const yAxis = (clientHeight / 2 - y) / 30;
        setCardTilt({ x: yAxis, y: -xAxis });
    };

    const handleMouseLeave = () => setCardTilt({ x: 0, y: 0 });

    // Reproductor de Música
    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // ==========================================
    // MOTOR DEL CANVAS (CORAZÓN + POLVO + ONDAS + ESTRELLAS)
    // ==========================================
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        window.requestAnimationFrame = window.__requestAnimationFrame || window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || (function () {
            return function (callback, element) {
                let lastTime = element.__lastTime || 0;
                let currTime = Date.now();
                let timeToCall = Math.max(1, 33 - (currTime - lastTime));
                window.setTimeout(callback, timeToCall);
                element.__lastTime = currTime + timeToCall;
            };
        })();

        const isDevice = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()));
        
        let animationFrameId;
        const mobile = isDevice;
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = container.clientWidth;
        let height = canvas.height = container.clientHeight;
        const rand = Math.random;

        // ===================================
        // OBJETOS DEL CANVAS
        // ===================================

        // 1. ESTRELLAS DE FONDO
        const stars = Array.from({ length: mobile ? 60 : 150 }).map(() => ({
            x: rand() * width,
            y: rand() * height,
            r: rand() * 1.5,
            vx: -rand() * 0.2 - 0.1, // Mover suavemente a la izquierda
            vy: -rand() * 0.2 - 0.1  // Mover suavemente hacia arriba
        }));

        // 2. ONDAS EXPANSIVAS (Shockwaves)
        const ripples = [];
        const handleCanvasClick = (e) => {
            // Evitar generar ondas si hace clic en un botón o la carta
            if (e.target.closest('.action-btn') || e.target.closest('.glass-card') || e.target.closest('.music-btn')) return;
            const rect = container.getBoundingClientRect();
            ripples.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                r: 0,
                alpha: 1,
                hue: ~~(rand() * 60 + 300) // Magenta/Púrpura
            });
        };
        container.addEventListener('click', handleCanvasClick);

        // 3. ESTELAS DEL RATÓN (Polvo de hadas adaptado al contenedor)
        const mouseTrail = [];
        const handleCanvasMouseMove = (e) => {
            if(isLetterOpen) return; // Pausar estelas si la carta está abierta
            const rect = container.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            for(let i=0; i<3; i++){
                mouseTrail.push({
                    x: x + (rand() * 20 - 10),
                    y: y + (rand() * 20 - 10),
                    vx: (rand() - 0.5) * 2,
                    vy: (rand() - 0.5) * 2 + 1, 
                    life: 1,
                    hue: ~~(rand() * 60 + 300) 
                });
            }
        };
        container.addEventListener('mousemove', handleCanvasMouseMove);
        container.addEventListener('touchmove', handleCanvasMouseMove);

        // 4. CORAZÓN MATEMÁTICO
        class Point {
            constructor(x = 0, y = 0) { this.x = x; this.y = y; }
            clone() { return new Point(this.x, this.y); }
            length(length) {
                if (typeof length == 'undefined') return Math.sqrt(this.x * this.x + this.y * this.y);
                this.normalize(); this.x *= length; this.y *= length; return this;
            }
            normalize() {
                var len = this.length(); this.x /= len; this.y /= len; return this;
            }
        }

        const heartPosition = function (rad) {
            return [
                Math.pow(Math.sin(rad), 3), 
                -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
            ];
        };
        const scaleAndTranslate = function (pos, sx, sy, dx, dy) { return [dx + pos[0] * sx, dy + pos[1] * sy]; };

        // Manejo de redimensionamiento responsivo basado en el contenedor
        const handleResize = function () {
            if (!container) return;
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
            ctx.fillStyle = "rgba(10, 0, 15, 1)";
            ctx.fillRect(0, 0, width, height);
        };
        
        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(container);

        const traceCount = mobile ? 25 : 50; 
        const pointsOrigin = [];
        const dr = mobile ? 0.3 : 0.1;
        
        // Generamos los puntos sin coeficiente fijo, se escalarán dinámicamente en 'pulse'
        for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
        for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
        for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
        
        const heartPointsCount = pointsOrigin.length;
        const targetPoints = [];
        
        const pulse = function (kx, ky) {
            // Escala dinámica del corazón basada en el ancho del contenedor
            const responsiveScale = width < 500 ? 0.45 : Math.min(1, width / 800);
            
            for (let i = 0; i < pointsOrigin.length; i++) {
                targetPoints[i] = [];
                targetPoints[i][0] = kx * pointsOrigin[i][0] * responsiveScale + width / 2;
                targetPoints[i][1] = ky * pointsOrigin[i][1] * responsiveScale + height / 2;
            }
        };

        const e = [];
        for (let i = 0; i < heartPointsCount; i++) {
            e[i] = {
                vx: 0, vy: 0, R: 2,
                speed: rand() + 5,
                q: ~~(rand() * heartPointsCount),
                D: 2 * (i % 2) - 1,
                force: 0.2 * rand() + 0.7,
                f: `hsla(${~~(rand() * 40 + 320)}, ${~~(40 * rand() + 60)}%, ${~~(60 * rand() + 20)}%, 0.6)`,
                trace: []
            };
            for (let k = 0; k < traceCount; k++) e[i].trace[k] = {x: rand() * width, y: rand() * height};
        }

        const config = { traceK: 0.4, timeDelta: 0.015 };
        let time = 0;
        
        // ===================================
        // LOOP PRINCIPAL (RENDERIZADO)
        // ===================================
        const loop = function () {
            const n = -Math.cos(time);
            pulse((1 + n) * .5, (1 + n) * .5);
            time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;
            
            // Capa base
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = "rgba(10, 0, 15, 0.15)"; 
            ctx.fillRect(0, 0, width, height);

            // Dibujar Estrellas (Fondo)
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            stars.forEach(s => {
                s.x += s.vx; s.y += s.vy;
                if(s.x < 0) s.x = width; 
                if(s.y < 0) s.y = height;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            });
            
            ctx.globalCompositeOperation = 'lighter';
            
            // Dibujar Ondas Expansivas
            for(let i = ripples.length - 1; i >= 0; i--) {
                let r = ripples[i];
                r.r += 6; // Velocidad de expansión
                r.alpha -= 0.02; // Desvanecimiento
                if(r.alpha <= 0) {
                    ripples.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                
                // SEÑALADO: Trazado de corazón usando la misma fórmula matemática en lugar de un círculo
                for (let j = 0; j <= Math.PI * 2; j += 0.1) {
                    let p = heartPosition(j);
                    // Escalar X e Y proporcionalmente usando el radio 'r.r'
                    let px = r.x + p[0] * r.r;
                    let py = r.y + (p[1] / 15) * r.r; 
                    if (j === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                
                ctx.strokeStyle = `hsla(${r.hue}, 100%, 60%, ${r.alpha})`;
                ctx.lineWidth = 3 + (r.alpha * 5); // El borde se hace fino al desaparecer
                ctx.stroke();
            }

            // Dibujar Polvo de Hadas
            for(let i = mouseTrail.length - 1; i >= 0; i--) {
                let p = mouseTrail[i];
                p.x += p.vx; p.y += p.vy;
                p.life -= 0.02; 
                
                if(p.life <= 0) {
                    mouseTrail.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.life * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life})`;
                ctx.fill();
            }

            // Dibujar Corazón
            for (let i = e.length; i--;) {
                let u = e[i];
                let q = targetPoints[u.q];
                let dx = u.trace[0].x - q[0];
                let dy = u.trace[0].y - q[1];
                let length = Math.sqrt(dx * dx + dy * dy);
                
                if (10 > length) {
                    if (0.95 < rand()) u.q = ~~(rand() * heartPointsCount);
                    else {
                        if (0.99 < rand()) u.D *= -1;
                        u.q += u.D;
                        u.q %= heartPointsCount;
                        if (0 > u.q) u.q += heartPointsCount;
                    }
                }
                
                u.vx += -dx / length * u.speed;
                u.vy += -dy / length * u.speed;
                u.trace[0].x += u.vx;
                u.trace[0].y += u.vy;
                u.vx *= u.force;
                u.vy *= u.force;
                
                for (let k = 0; k < u.trace.length - 1;) {
                    let T = u.trace[k];
                    let N = u.trace[++k];
                    N.x -= config.traceK * (N.x - T.x);
                    N.y -= config.traceK * (N.y - T.y);
                }
                
                ctx.fillStyle = u.f;
                for (let k = 0; k < u.trace.length; k++) {
                    ctx.fillRect(u.trace[k].x, u.trace[k].y, 1.5, 1.5);
                }
            }
            
            animationFrameId = window.requestAnimationFrame(loop);
        };
        
        loop();
        
        return () => {
            resizeObserver.disconnect();
            container.removeEventListener('mousemove', handleCanvasMouseMove);
            container.removeEventListener('touchmove', handleCanvasMouseMove);
            container.removeEventListener('click', handleCanvasClick);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Generadores CSS puros (Luciérnagas y Corazones)
    const fallingHearts = Array.from({ length: 25 }).map((_, i) => (
        <div key={`fh-${i}`} className="falling-heart" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 4}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 15 + 10}px`,
            opacity: Math.random() * 0.5 + 0.3
        }}>❤</div>
    ));

    const fireflies = Array.from({ length: 20 }).map((_, i) => (
        <div key={`ff-${i}`} className="firefly" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 15 + 10}s`,
            animationDelay: `${Math.random() * 10}s`
        }}></div>
    ));

    return (
        <div 
            ref={containerRef}
            className="magical-container" 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
        >
            
            {/* Reproductor de música (Pista relajante de dominio público para probar) */}
            <audio ref={audioRef} loop id="bg-music">
                <source src="https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1bc8.mp3?filename=romantic-piano-10192.mp3" type="audio/mp3" />
            </audio>

            

            {/* Luciérnagas constantes en el fondo */}
            {fireflies}

            {/* Reproductor / Botón Musical */}
            <button className={`music-btn ${isPlaying ? 'playing' : ''}`} onClick={toggleMusic}>
                🎵
            </button>

            {/* Canvas del Corazón Matemático e Interactivo */}
            <canvas 
                ref={canvasRef} 
                id="heart-canvas" 
                className={isLetterOpen ? 'blurred' : ''}
            />

            {/* Lluvia de corazones (Solo cuando abres la carta) */}
            {isLetterOpen && (
                <div className="hearts-container">
                    {fallingHearts}
                </div>
            )}

            {/* Texto central palpitante */}
            <div className="center-text" style={{ opacity: isLetterOpen ? 0 : 1 }}>
                Para Tí, {nombre}
            </div>

            {/* Botón de apertura Glassmorphism */}
            <button 
                className={`action-btn ${(showButton && !isLetterOpen) ? 'visible' : ''}`}
                onClick={() => setIsLetterOpen(true)}
            >
                Abrir Sorpresa
            </button>

            {/* Modal Glassmorphism con Parallax */}
            <div className={`letter-modal ${isLetterOpen ? 'active' : ''}`} onClick={() => setIsLetterOpen(false)}>
                <div 
                    className="card-3d-wrapper" 
                    style={{ transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)` }}
                >
                    <div className="glass-card" onClick={(e) => e.stopPropagation()}>
                        <h2 className="card-title">{nombre}</h2>
                        
                        {/* Texto con efecto Typewriter */}
                        <p className="card-body">
                            {typedText}
                            <span style={{ borderRight: '2px solid #fff', animation: 'blink 1s infinite' }}></span>
                        </p>

                        <button className="close-card-btn" onClick={() => setIsLetterOpen(false)}>
                            Cerrar Carta
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes blink {
                    50% { border-color: transparent; }
                }
            `}</style>

        </div>
    );
}