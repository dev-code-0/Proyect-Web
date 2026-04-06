import React, { useEffect, useRef, useState } from 'react';

export default function CorazonMagico() {
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
                ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
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

            <style>{`
                .magical-container {
                    /* ======================================================== */
                    /* CRUCIAL PARA RESPONSIVIDAD: Define el contenedor de UI */
                    /* ======================================================== */
                    container-type: size;
                    position: relative;
                    width: 100%;
                    height: 100%; /* Cambiado a 100% para respetar .preview-box */
                    overflow: hidden;
                    background-color: #05000a;
                    font-family: 'Montserrat', sans-serif;
                    perspective: 1500px;
                }

                #heart-canvas {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    transition: filter 1s ease, opacity 1s ease, transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);
                }

                #heart-canvas.blurred {
                    filter: blur(12px) saturate(2);
                    opacity: 0.3;
                    transform: scale(1.15); /* Expansión dramática al abrir */
                }

                /* =======================
                   BOTÓN DE MÚSICA 
                   ======================= */
                .music-btn {
                    position: absolute;
                    top: clamp(10px, 3cqh, 25px);
                    right: clamp(10px, 3cqw, 25px);
                    width: clamp(35px, 10cqw, 50px);
                    height: clamp(35px, 10cqw, 50px);
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    font-size: clamp(1rem, 3cqw, 1.5rem);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 90;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 15px rgba(255, 26, 140, 0.3);
                }

                .music-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                    box-shadow: 0 0 25px rgba(189, 0, 255, 0.6);
                }

                .music-btn.playing {
                    animation: spinRecord 4s linear infinite;
                    border-color: #ff1a8c;
                    box-shadow: 0 0 20px #ff1a8c, inset 0 0 10px #ff1a8c;
                }

                @keyframes spinRecord {
                    100% { transform: rotate(360deg); }
                }

                /* =======================
                   TEXTO CENTRAL 
                   ======================= */
                .center-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: 'Dancing Script', cursive;
                    font-size: clamp(2.5rem, 12cqw, 6rem); /* Escalado dinámico con cqw */
                    color: #fff;
                    text-shadow: 0 0 20px #ff1a8c, 0 0 40px #bd00ff, 0 0 60px #ff1a8c;
                    pointer-events: none;
                    animation: heartBeatText 1.5s infinite alternate, textEntry 3s ease-out forwards;
                    transition: opacity 0.5s ease;
                    z-index: 10;
                    white-space: nowrap;
                }

                @keyframes textEntry {
                    0% { opacity: 0; letter-spacing: -15px; filter: blur(20px); transform: translate(-50%, -50%) scale(0.5); }
                    100% { opacity: 1; letter-spacing: 2px; filter: blur(0px); transform: translate(-50%, -50%) scale(1); }
                }

                @keyframes heartBeatText {
                    0% { transform: translate(-50%, -50%) scale(0.98); text-shadow: 0 0 15px #ff1a8c; }
                    100% { transform: translate(-50%, -50%) scale(1.04); text-shadow: 0 0 35px #ff1a8c, 0 0 60px #bd00ff; }
                }

                /* =======================
                   LUCIÉRNAGAS (Siempre de fondo)
                   ======================= */
                .firefly {
                    position: absolute;
                    width: clamp(2px, 1cqw, 4px);
                    height: clamp(2px, 1cqw, 4px);
                    background: #ffeb99; /* Dorado brillante */
                    border-radius: 50%;
                    box-shadow: 0 0 10px 2px #ffb3d9, 0 0 20px 5px #ff1a8c;
                    pointer-events: none;
                    z-index: 5;
                    opacity: 0;
                    animation: floatUp linear infinite;
                }

                @keyframes floatUp {
                    0% { transform: translateY(100cqh) scale(0); opacity: 0; }
                    20% { opacity: 1; transform: translateY(80cqh) scale(1); }
                    80% { opacity: 1; transform: translateY(20cqh) scale(1); }
                    100% { transform: translateY(-20cqh) scale(0); opacity: 0; }
                }

                /* =======================
                   BOTÓN LEER CARTA 
                   ======================= */
                .action-btn {
                    position: absolute;
                    bottom: clamp(20px, 8cqh, 15%);
                    left: 50%;
                    transform: translateX(-50%) translateY(40px);
                    padding: clamp(10px, 3cqh, 16px) clamp(25px, 8cqw, 50px);
                    border-radius: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    color: #fff;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                    font-size: clamp(0.9rem, 4cqw, 1.3rem);
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    cursor: pointer;
                    box-shadow: 0 0 25px rgba(255, 26, 140, 0.5), inset 0 0 15px rgba(189, 0, 255, 0.3);
                    opacity: 0;
                    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 15;
                    overflow: hidden;
                }

                .action-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
                    transform: skewX(-25deg);
                    animation: buttonShine 3.5s infinite;
                }

                @keyframes buttonShine {
                    0% { left: -100%; }
                    20% { left: 200%; }
                    100% { left: 200%; }
                }

                .action-btn.visible {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }

                .action-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 0 40px rgba(189, 0, 255, 0.8), inset 0 0 25px rgba(255, 26, 140, 0.6);
                    border-color: #fff;
                    transform: translateX(-50%) translateY(-6px) scale(1.05);
                }

                /* =======================
                   MODAL GLASSMORPHISM 3D
                   ======================= */
                .letter-modal {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: clamp(10px, 3cqw, 20px);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.8s ease;
                    z-index: 50;
                }

                .letter-modal.active {
                    opacity: 1;
                    pointer-events: auto;
                }

                .card-3d-wrapper {
                    transition: transform 0.15s ease-out;
                    transform-style: preserve-3d;
                    width: 100%;
                    max-width: clamp(280px, 85cqw, 500px);
                }

                .glass-card {
                    width: 100%;
                    background: linear-gradient(135deg, rgba(30, 0, 40, 0.65), rgba(15, 0, 20, 0.85));
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.25);
                    border-top: 1px solid rgba(255, 255, 255, 0.5);
                    border-left: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    padding: clamp(25px, 6cqh, 50px) clamp(20px, 6cqw, 40px);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 0 40px rgba(255, 26, 140, 0.2);
                    text-align: center;
                    transform: scale(0.8) translateY(60px);
                    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s;
                    opacity: 0;
                    position: relative;
                }
                
                .glass-card::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 26px;
                    background: linear-gradient(45deg, #ff1a8c, #bd00ff, #ff1a8c);
                    z-index: -1;
                    opacity: 0.3;
                    filter: blur(20px);
                    animation: auraPulse 3s infinite alternate;
                }

                @keyframes auraPulse {
                    0% { opacity: 0.2; }
                    100% { opacity: 0.6; }
                }

                .letter-modal.active .glass-card {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }

                .card-title {
                    font-family: 'Dancing Script', cursive;
                    font-size: clamp(2.5rem, 10cqw, 3.5rem);
                    color: #ffb3d9;
                    margin: 0 0 clamp(15px, 3cqh, 25px) 0;
                    text-shadow: 0 0 20px rgba(255, 26, 140, 0.9), 0 0 40px rgba(189, 0, 255, 0.8);
                    transform: translateZ(40px); 
                }

                .card-body {
                    font-size: clamp(0.85rem, 4cqw, 1.15rem);
                    line-height: clamp(1.5, 3.5cqh, 1.9);
                    color: #f8f8f8;
                    margin-bottom: clamp(25px, 5cqh, 45px);
                    font-weight: 300;
                    letter-spacing: 0.5px;
                    white-space: pre-wrap; 
                    text-align: left;
                    min-height: clamp(120px, 30cqh, 150px); 
                    transform: translateZ(25px);
                }

                .close-card-btn {
                    padding: clamp(10px, 2.5cqh, 12px) clamp(25px, 8cqw, 40px);
                    background: linear-gradient(45deg, #E0144C, #bd00ff);
                    border: 1px solid rgba(255,255,255,0.4);
                    border-radius: 30px;
                    color: white;
                    font-family: 'Montserrat', sans-serif;
                    font-weight: 700;
                    font-size: clamp(0.9rem, 3.5cqw, 1.1rem);
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(224, 20, 76, 0.6);
                    transition: all 0.3s;
                    transform: translateZ(35px);
                }

                .close-card-btn:hover {
                    box-shadow: 0 15px 45px rgba(189, 0, 255, 0.9);
                    transform: translateZ(35px) translateY(-4px) scale(1.08);
                }

                /* LLUVIA DE CORAZONES */
                .hearts-container {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                    z-index: 40;
                }

                .falling-heart {
                    position: absolute;
                    top: -50px;
                    color: #ff1a8c;
                    text-shadow: 0 0 15px #bd00ff;
                    animation: fall linear infinite;
                }

                @keyframes fall {
                    0% { transform: translateY(-50px) rotate(0deg) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(100cqh) rotate(360deg) translateX(80px); opacity: 0; }
                }
            `}</style>

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
                Para Ti
            </div>

            {/* Botón de apertura Glassmorphism */}
            <button 
                className={`action-btn ${(showButton && !isLetterOpen) ? 'visible' : ''}`}
                onClick={() => setIsLetterOpen(true)}
            >
                Abrir Sorpresa ✨
            </button>

            {/* Modal Glassmorphism con Parallax */}
            <div className={`letter-modal ${isLetterOpen ? 'active' : ''}`} onClick={() => setIsLetterOpen(false)}>
                <div 
                    className="card-3d-wrapper" 
                    style={{ transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)` }}
                >
                    <div className="glass-card" onClick={(e) => e.stopPropagation()}>
                        <h2 className="card-title">Mi Amor</h2>
                        
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