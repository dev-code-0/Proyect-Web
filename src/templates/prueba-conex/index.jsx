import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import Audio from './Music.mp3';
import Image1 from './images/Image1.avif';
import Image2 from './images/Image2.avif';
import Image3 from './images/Image3.avif';
import Image4 from './images/Image4.avif';
import Image5 from './images/Image5.avif';
import { AntiInspectGuard } from '../../lib/antiInspect';
import usePreloadImages from '../../hooks/usePreloadImages';

const SETTINGS = {
    particles: {
        length: 6000,
        duration: 2.5,
        velocity: 80,
        effect: -0.6,
        size: 3,
    },
    risingWords: {
        base: ["Tú", "Llegaste", "Bonito", "Eres", "Suerte", "Viernes 13", "Destino", "Todo cambió", "Miedo", "Favorito"],
        frequency: 0.10,
    },
};

const PHOTO_CAPTIONS = [
    'Mi momento favorito',
    'Contigo todo cambió',
    'Mi suerte infinita',
    'Tú eres mi destino',
    'Para siempre, viernes 13',
];

const PALETAS = {
    'rosa-cyan':      { primary: '#ff007f', primaryRgb: '255, 0, 127',  secondary: '#00f2ff', bg: '#050505' },
    'violeta-dorado': { primary: '#9b59b6', primaryRgb: '155, 89, 182', secondary: '#f39c12', bg: '#050505' },
    'rojo-blanco':    { primary: '#e74c3c', primaryRgb: '231, 76, 60',  secondary: '#ffffff', bg: '#080808' },
};

// ==========================================
// LÓGICA DE PARTÍCULAS Y FÍSICA
// ==========================================
class Point {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    clone() { return new Point(this.x, this.y); }
    length(len) {
        if (typeof len === 'undefined') return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= len; this.y *= len;
        return this;
    }
    normalize() {
        const len = this.length();
        if (len !== 0) { this.x /= len; this.y /= len; }
        return this;
    }
}

class Particle {
    constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
        this.text = null;
    }
    initialize(x, y, dx, dy, text = null) {
        this.position.x = x; this.position.y = y;
        this.velocity.x = dx; this.velocity.y = dy;
        this.acceleration.x = dx * SETTINGS.particles.effect;
        this.acceleration.y = dy * SETTINGS.particles.effect;
        this.age = 0; this.text = text;
    }
    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    }
    draw(context, image, primaryColor) {
        const ease = (t) => (--t) * t * t + 1;
        const progress = this.age / SETTINGS.particles.duration;
        context.globalAlpha = 1 - progress;

        if (this.text) {
            context.fillStyle = '#fff';
            context.font = `bold ${10 + (1 - progress) * 6}px system-ui, sans-serif`;
            context.shadowBlur = 8;
            context.shadowColor = primaryColor;
            context.fillText(this.text, this.position.x, this.position.y);
            context.shadowBlur = 0;
        } else {
            const size = image.width * ease(progress);
            context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
        }
    }
}

class ParticlePool {
    constructor(length) {
        this.particles = new Array(length);
        for (let i = 0; i < length; i++) this.particles[i] = new Particle();
        this.firstActive = 0; this.firstFree = 0;
    }
    add(x, y, dx, dy, text = null) {
        this.particles[this.firstFree].initialize(x, y, dx, dy, text);
        this.firstFree++;
        if (this.firstFree === this.particles.length) this.firstFree = 0;
        if (this.firstActive === this.firstFree) this.firstActive++;
        if (this.firstActive === this.particles.length) this.firstActive = 0;
    }
    update(dt) {
        let i; const dur = SETTINGS.particles.duration;
        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].update(dt);
        } else if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].update(dt);
            for (i = 0; i < this.firstFree; i++) this.particles[i].update(dt);
        }
        while (this.particles[this.firstActive].age >= dur && this.firstActive !== this.firstFree) {
            this.firstActive++;
            if (this.firstActive === this.particles.length) this.firstActive = 0;
        }
    }
    draw(ctx, img, primaryColor) {
        let i;
        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].draw(ctx, img, primaryColor);
        } else if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].draw(ctx, img, primaryColor);
            for (i = 0; i < this.firstFree; i++) this.particles[i].draw(ctx, img, primaryColor);
        }
    }
}

// ==========================================
// COMPONENTES DE INTERFAZ 3D
// ==========================================
const TextRing = ({ text, radius, speed, reverse, color, baseScale }) => {
    const chars = (text + ' • ').repeat(2).split('');
    const dynamicRadius = radius * baseScale;
    return (
        <div className="v13-3d-layer" style={{
            animation: `spinY ${speed}s linear infinite ${reverse ? 'reverse' : 'normal'}`,
        }}>
            {chars.map((char, i) => {
                const angle = (i / chars.length) * 360;
                return (
                    <span key={i} className="v13-char"
                        style={{
                            transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${dynamicRadius}px)`,
                            color: '#fff',
                            textShadow: `0 0 8px ${color}`,
                            fontSize: `${Math.max(9, 14 * baseScale)}px`,
                        }}>
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

const PhotoRing = ({ photos, radius, speed, onPhotoClick, baseScale }) => {
    const dynamicRadius = radius * baseScale;
    const dynamicSize = Math.max(3, 4.5 * baseScale);
    return (
        <div className="v13-3d-layer" style={{ animation: `spinY ${speed}s linear infinite` }}>
            {photos.map((src, i) => {
                const angle = (i / photos.length) * 360;
                return (
                    <div key={i}
                         onClick={(e) => { e.stopPropagation(); onPhotoClick(src, i); }}
                         className="v13-photo-item"
                         style={{
                             transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${dynamicRadius}px)`,
                             width: `${dynamicSize}rem`, height: `${dynamicSize}rem`,
                         }}>
                        <img src={src} alt="memory" className="v13-photo-img" />
                    </div>
                );
            })}
        </div>
    );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function App({ data }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const middleSectionRef = useRef(null);
    const bottomSectionRef = useRef(null);
    const audioRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });

    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [lightboxCaption, setLightboxCaption] = useState('');
    const [message, setMessage] = useState('');
    const [messageComplete, setMessageComplete] = useState(false);
    const [sceneScale, setSceneScale] = useState(1);

    const nombre = data?.nombre || '';
    const fullMessage = data?.mensaje || 'Un viernes 13 que se convirtió en mi suerte infinita... Gracias por aparecer.';
    const colors = PALETAS[data?.paleta] || PALETAS['rosa-cyan'];

    // Rising words incluye el nombre del destinatario si fue personalizado
    const risingWordsRef = useRef([
        ...SETTINGS.risingWords.base,
        ...(nombre ? [nombre] : []),
    ]);

    const fotos = (data?.fotos?.length > 0 ? data.fotos : [Image1, Image2, Image3, Image4, Image5]).slice(0, 5);
    const music = data?.music || Audio;

    usePreloadImages(fotos);

    // Typewriter del caption del lightbox — se reinicia al cambiar de foto
    useEffect(() => {
        if (!selectedPhoto) { setLightboxCaption(''); return; }
        const caption = PHOTO_CAPTIONS[selectedIndex % PHOTO_CAPTIONS.length];
        setLightboxCaption('');
        let i = 0;
        const interval = setInterval(() => {
            setLightboxCaption(caption.slice(0, i));
            i++;
            if (i > caption.length) clearInterval(interval);
        }, 55);
        return () => clearInterval(interval);
    }, [selectedPhoto, selectedIndex]);

    // Typewriter
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setMessage(fullMessage.slice(0, i));
            i++;
            if (i > fullMessage.length) {
                clearInterval(interval);
                setMessageComplete(true);
            }
        }, 60);
        return () => clearInterval(interval);
    }, [fullMessage]);

    // Audio autoplay con fallback a primera interacción
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let started = false;

        const detachUnlockListeners = () => {
            window.removeEventListener('pointerdown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
        };

        const tryAutoPlay = () => {
            if (started) return;
            audio.play()
                .then(() => { started = true; setIsPlaying(true); detachUnlockListeners(); })
                .catch(() => {});
        };

        const handleFirstInteraction = () => { tryAutoPlay(); };

        tryAutoPlay();

        if (audio.paused) {
            window.addEventListener('pointerdown', handleFirstInteraction);
            window.addEventListener('touchstart', handleFirstInteraction);
            window.addEventListener('keydown', handleFirstInteraction);
        }

        return () => {
            detachUnlockListeners();
            audio.pause();
            audio.currentTime = 0;
        };
    }, [music]);

    const handlePhotoClick = (src, index) => {
        setSelectedPhoto(src);
        setSelectedIndex(index);
    };

    const togglePlay = (e) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;
        if (!audio.paused) { audio.pause(); setIsPlaying(false); return; }
        audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };

    // Canvas: partículas + parallax vía CSS custom properties (sin re-renders)
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current || !middleSectionRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pool = new ParticlePool(SETTINGS.particles.length);
        const risingPool = new ParticlePool(40);
        let time, frameId;
        let heartScaleX = 1, heartScaleY = 1;

        const primaryColor = colors.primary;

        const pointOnHeart = (t, sX = 1.0, sY = 1.0) => new Point(
            (160 * Math.pow(Math.sin(t), 3)) * sX,
            (130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25) * sY
        );

        const createParticleImg = (color) => {
            const c = document.createElement('canvas');
            c.width = c.height = SETTINGS.particles.size * 3;
            const tCtx = c.getContext('2d');
            const grad = tCtx.createRadialGradient(c.width / 2, c.height / 2, 0, c.width / 2, c.height / 2, c.width / 2);
            grad.addColorStop(0, '#fff');
            grad.addColorStop(0.4, color);
            grad.addColorStop(1, 'transparent');
            tCtx.fillStyle = grad;
            tCtx.beginPath(); tCtx.arc(c.width / 2, c.height / 2, c.width / 3, 0, Math.PI * 2); tCtx.fill();
            return c;
        };

        const particleImg = createParticleImg(primaryColor);

        const render = () => {
            frameId = requestAnimationFrame(render);
            const now = Date.now() / 1000;
            const dt = now - (time || now);
            time = now;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';

            const middleRect = middleSectionRef.current.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();

            const centerX = (middleRect.left - containerRect.left) + middleRect.width / 2;
            const centerY = (middleRect.top - containerRect.top) + middleRect.height / 2;

            const targetX = (mousePos.current.x - canvas.width / 2) * 0.03;
            const targetY = (mousePos.current.y - canvas.height / 2) * 0.03;

            const pulse = 1 + Math.pow(Math.sin(now * 3.5), 10) * 0.12;
            const rate = SETTINGS.particles.length / SETTINGS.particles.duration;
            const amount = rate * dt;

            for (let i = 0; i < amount; i++) {
                const sX = heartScaleX * pulse;
                const sY = heartScaleY * pulse;
                const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random(), sX, sY);
                const jitter = (Math.random() - 0.5) * 5;
                const dir = pos.clone().length(SETTINGS.particles.velocity);
                pool.add(centerX + pos.x + targetX + jitter, centerY - pos.y + targetY + jitter, dir.x, -dir.y);
            }

            if (Math.random() < SETTINGS.risingWords.frequency) {
                const wordList = risingWordsRef.current;
                const word = wordList[Math.floor(Math.random() * wordList.length)];
                const startX = centerX + (Math.random() - 0.5) * (middleRect.width * 0.8);
                const startY = (middleRect.top - containerRect.top) + middleRect.height;
                risingPool.add(startX, startY, (Math.random() - 0.5) * 20, -60 - Math.random() * 40, word);
            }

            pool.update(dt);
            risingPool.update(dt);
            pool.draw(ctx, particleImg, primaryColor);
            risingPool.draw(ctx, null, primaryColor);
        };

        const onResize = () => {
            if (!containerRef.current || !middleSectionRef.current || !bottomSectionRef.current) return;

            canvas.width = containerRef.current.clientWidth;
            canvas.height = containerRef.current.clientHeight;

            const middleRect = middleSectionRef.current.getBoundingClientRect();
            const fitFactorX = (middleRect.width * 0.85) / 320;
            const fitFactorY = (middleRect.height * 0.85) / 260;
            heartScaleX = Math.min(fitFactorX, fitFactorY);
            heartScaleY = heartScaleX;

            const bottomRect = bottomSectionRef.current.getBoundingClientRect();
            const targetRingSize = Math.min(bottomRect.width * 0.9, 400);
            setSceneScale(targetRingSize / 340);
        };

        // Parallax: escribe CSS custom properties directo al DOM, sin re-render de React
        const onMouseMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            mousePos.current = { x: clientX, y: clientY };
            if (containerRef.current) {
                containerRef.current.style.setProperty('--mx', clientX / window.innerWidth - 0.5);
                containerRef.current.style.setProperty('--my', clientY / window.innerHeight - 0.5);
            }
        };

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onMouseMove, { passive: true });

        setTimeout(onResize, 50);
        render();

        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <AntiInspectGuard>
        <div
            className="v13-container"
            ref={containerRef}
            style={{
                '--color-primary':     colors.primary,
                '--color-primary-rgb': colors.primaryRgb,
                '--color-secondary':   colors.secondary,
                '--color-bg':          colors.bg,
            }}
        >
            <audio ref={audioRef} src={music} loop preload="none" />

            <div className="v13-star-layer" />
            <div className="v13-bg-glow" />

            <canvas ref={canvasRef} className="v13-canvas" />

            <div className="v13-content-wrapper">

                <header className="v13-section-top">
                    <div className="v13-header-row">
                        <div className="v13-title-group">
                            <h1 className="v13-shiny-title">Tu Mi <br/>Viernes 13</h1>
                            {nombre && <span className="v13-title-name">{nombre}</span>}
                            <div className="v13-subtitle">
                                <div className="v13-eq" style={{ opacity: isPlaying ? 1 : 0.3 }}>
                                    <div className="v13-eq-bar" style={{ animationDelay: '0.1s' }} />
                                    <div className="v13-eq-bar" style={{ animationDelay: '0.3s' }} />
                                    <div className="v13-eq-bar" style={{ animationDelay: '0.2s' }} />
                                </div>
                                <span className="v13-label">Mi Suerte Infinita</span>
                            </div>
                        </div>
                        <button onClick={togglePlay} className="v13-play-btn" aria-label="Reproducir música">
                            {isPlaying ? (
                                <svg className="v13-play-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
                            ) : (
                                <svg className="v13-play-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            )}
                        </button>
                    </div>
                    <div className="v13-message-box">
                        <p className="v13-message-text">
                            {message}
                            <span className={`v13-cursor${messageComplete ? ' v13-cursor--done' : ''}`}>_</span>
                        </p>
                    </div>
                </header>

                <main ref={middleSectionRef} className="v13-section-middle" />

                <footer ref={bottomSectionRef} className="v13-section-bottom">
                    <div className="v13-3d-scene">
                        <TextRing text="MI DESTINO BONITO ERES TÚ" radius={140} speed={30} color={colors.primary} baseScale={sceneScale} />
                        <TextRing text="CONTIGO NO EXISTE EL MIEDO" radius={105} speed={20} reverse color={colors.secondary} baseScale={sceneScale} />
                        <PhotoRing photos={fotos} radius={65} speed={15} onPhotoClick={handlePhotoClick} baseScale={sceneScale} />
                    </div>
                </footer>

            </div>

            {selectedPhoto && (
                <div className="v13-lightbox" onClick={() => setSelectedPhoto(null)}>
                    <div className="v13-close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </div>
                    <div className="v13-lightbox-inner" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedPhoto} alt="Amor" className="v13-lightbox-img" />
                        <div className="v13-lightbox-caption">
                            <p className="v13-lightbox-caption-text">
                                {lightboxCaption}
                                <span className="v13-lightbox-cursor">_</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </AntiInspectGuard>
    );
}
