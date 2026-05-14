import React, { useEffect, useRef, useState, useCallback } from 'react';
import './style.css';
import usePreloadImages from "../../hooks/usePreloadImages";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Image1 from './Images/Image1.avif';
import Image2 from './Images/Image2.avif';
import Image3 from './Images/Image3.avif';
import Image4 from './Images/Image4.avif';
import Image5 from './Images/Image5.avif';
import Image6 from './Images/Image6.avif';
import Song from './song.mp3';

// ─── Constantes globales ───────────────────────────────────────────────────────

const COLOR_PINK   = '#ff1a8c';
const COLOR_PURPLE = '#bd00ff';
const HEART_PATH   = 'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z';

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth <= 768;

const PARTICLE_CFG = {
    length:       IS_MOBILE ? 5000  : 12000,
    duration: 4,
    velocity: 80,
    effect:   -1.3,
    size:     8,
    // Valores originales: 10000/duration y 12000/duration = 2500 y 3000
    rateNormal:   IS_MOBILE ? 1250  : 2500,
    rateExpanded: IS_MOBILE ? 1500  : 3000,
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconPlay() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
            <polygon points="6,3 20,12 6,21" />
        </svg>
    );
}

function IconPause() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
            <rect x="5" y="4" width="4" height="16" rx="1" />
            <rect x="15" y="4" width="4" height="16" rx="1" />
        </svg>
    );
}

function HeartIcon({ size = 18, className = '' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width={size}
            height={size}
            className={className}
            aria-hidden="true"
        >
            <path d={HEART_PATH} />
        </svg>
    );
}

// ─── Motor de partículas ───────────────────────────────────────────────────────

class Point {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    clone() { return new Point(this.x, this.y); }
    length(length) {
        if (typeof length === 'undefined') return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
    }
    normalize() {
        const len = this.length();
        this.x /= len;
        this.y /= len;
        return this;
    }
}

class Particle {
    constructor() {
        this.position     = new Point();
        this.velocity     = new Point();
        this.acceleration = new Point();
        this.age          = 0;
    }
    initialize(x, y, dx, dy) {
        this.position.x     = x;
        this.position.y     = y;
        this.velocity.x     = dx;
        this.velocity.y     = dy;
        this.acceleration.x = dx * PARTICLE_CFG.effect;
        this.acceleration.y = dy * PARTICLE_CFG.effect;
        this.age            = 0;
    }
    update(dt) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.age        += dt;
    }
    draw(ctx, image) {
        const ease = t => (--t) * t * t + 1;
        const size = image.width * ease(this.age / PARTICLE_CFG.duration);
        ctx.globalAlpha = 1 - this.age / PARTICLE_CFG.duration;
        ctx.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    }
}

class ParticlePool {
    constructor(length) {
        this.particles   = Array.from({ length }, () => new Particle());
        this.firstActive = 0;
        this.firstFree   = 0;
        this.duration    = PARTICLE_CFG.duration;
    }
    add(x, y, dx, dy) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);
        this.firstFree++;
        if (this.firstFree === this.particles.length) this.firstFree = 0;
        if (this.firstActive === this.firstFree) this.firstActive++;
        if (this.firstActive === this.particles.length) this.firstActive = 0;
    }
    update(dt) {
        const len = this.particles.length;
        if (this.firstActive < this.firstFree)
            for (let i = this.firstActive; i < this.firstFree; i++) this.particles[i].update(dt);
        if (this.firstFree < this.firstActive) {
            for (let i = this.firstActive; i < len; i++) this.particles[i].update(dt);
            for (let i = 0; i < this.firstFree; i++) this.particles[i].update(dt);
        }
        while (
            this.particles[this.firstActive].age >= this.duration &&
            this.firstActive !== this.firstFree
        ) {
            this.firstActive++;
            if (this.firstActive === len) this.firstActive = 0;
        }
    }
    draw(ctx, image) {
        const len = this.particles.length;
        if (this.firstActive < this.firstFree)
            for (let i = this.firstActive; i < this.firstFree; i++) this.particles[i].draw(ctx, image);
        if (this.firstFree < this.firstActive) {
            for (let i = this.firstActive; i < len; i++) this.particles[i].draw(ctx, image);
            for (let i = 0; i < this.firstFree; i++) this.particles[i].draw(ctx, image);
        }
    }
}

// ─── Texto fijo (siempre visible) ─────────────────────────────────────────────

const MENSAJE_DEFAULT = 'Todo lo que somos está en estas fotos. Los momentos que elegimos recordar no son los perfectos — son los reales, los nuestros, los que nadie más vivió igual que tú y yo. Gracias por dejarme quererte así.';

// ─── Componente principal ──────────────────────────────────────────────────────

export default function LatidosDeAmorTemplate({ data, isPreview }) {
    const nombre      = data?.nombre  || 'Luz';
    const mensajeUser = data?.mensaje?.trim() || '';
    const dedicatoria = data?.dedicatoria?.trim() || '';
    const fotos       = data?.fotos?.length > 0 ? data.fotos : [Image1, Image2, Image3, Image4, Image5, Image6];
    // Swiper loop necesita mín. 8 slides reales para que los clones no se agoten.
    // Si hay pocas fotos, duplicamos el array hasta cubrir ese mínimo.
    const MIN_SWIPER_SLIDES = 8;
    const swiperSlides = fotos.length >= MIN_SWIPER_SLIDES
        ? fotos
        : Array.from({ length: Math.ceil(MIN_SWIPER_SLIDES / fotos.length) }, () => fotos).flat();
    const music       = data?.music || Song;

    usePreloadImages(fotos);

    const [progress,      setProgress]      = useState(0);
    const [isLoaded,      setIsLoaded]      = useState(false);
    const [isModalOpen,   setIsModalOpen]   = useState(false);
    const [isAudioPlaying,setIsAudioPlaying]= useState(false);

    const appWrapperRef       = useRef(null);
    const canvasRef           = useRef(null);
    const starfieldRef        = useRef(null);
    const swiperContainerRef  = useRef(null);
    const swiperInstanceRef   = useRef(null);
    const audioRef            = useRef(null);
    const modalNameRef        = useRef(null);
    const isHeartExpandedRef  = useRef(false);
    const currentBaseColorRef = useRef(COLOR_PINK);

    // ── Barra de carga simulada ────────────────────────────────────────────────
    useEffect(() => {
        const id = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(id);
                    setTimeout(() => setIsLoaded(true), 400);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);
        return () => clearInterval(id);
    }, []);

    // ── Swiper lifecycle ───────────────────────────────────────────────────────
    useEffect(() => {
        if (!isModalOpen || swiperInstanceRef.current) return;
        const t = setTimeout(() => {
            if (!swiperContainerRef.current) return;
            swiperInstanceRef.current = new Swiper(swiperContainerRef.current, {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                loop: true,
                coverflowEffect: { rotate: 25, stretch: 0, depth: 200, modifier: 1, slideShadows: true },
            });
        }, 100);
        return () => clearTimeout(t);
    }, [isModalOpen]);

    useEffect(() => {
        return () => {
            if (swiperInstanceRef.current) {
                swiperInstanceRef.current.destroy(true, true);
                swiperInstanceRef.current = null;
            }
        };
    }, []);

    // ── Animación de nombre con Anime.js (letra a letra) ──────────────────────
    useEffect(() => {
        if (!isModalOpen || !modalNameRef.current) return;

        modalNameRef.current.innerHTML = nombre
            .split('')
            .map(ch => `<span class="name-char-cc" style="display:inline-block;opacity:0;transform:translateY(18px)">${ch === ' ' ? '&nbsp;' : ch}</span>`)
            .join('');

        import('animejs').then(mod => {
            const anime = mod.default ?? mod;
            anime({
                targets: modalNameRef.current?.querySelectorAll('.name-char-cc'),
                opacity:    [0, 1],
                translateY: [18, 0],
                delay:  anime.stagger(55, { start: 150 }),
                duration: 700,
                easing: 'easeOutElastic(1, .6)',
            });
        });
    }, [isModalOpen, nombre]);

    // ── Audio ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || isPreview) return;

        audio.loop      = true;
        audio.volume    = 0.65;
        audio.playsInline = true;

        let retryCount = 0;
        let retryTimer = null;
        const MAX_RETRIES = 20;

        const syncPlay  = () => setIsAudioPlaying(true);
        const syncPause = () => setIsAudioPlaying(false);

        const tryPlay = async () => {
            if (!audio.paused) { setIsAudioPlaying(true); return true; }
            try {
                await audio.play();
                setIsAudioPlaying(true);
                return true;
            } catch {
                try {
                    audio.muted = true;
                    await audio.play();
                    audio.muted = false;
                    setIsAudioPlaying(true);
                    return true;
                } catch {
                    audio.muted = false;
                    setIsAudioPlaying(false);
                    return false;
                }
            }
        };

        const stopRetry = () => { if (retryTimer) { clearInterval(retryTimer); retryTimer = null; } };
        const startRetry = () => {
            if (retryTimer) return;
            retryTimer = setInterval(() => {
                retryCount++;
                tryPlay().then(ok => { if (ok || retryCount >= MAX_RETRIES) stopRetry(); });
            }, 300);
        };

        const onReady = () => { tryPlay().then(ok => { if (!ok) startRetry(); }); };
        const onVisibility = () => { if (document.visibilityState === 'visible' && audio.paused) onReady(); };

        audio.addEventListener('play', syncPlay);
        audio.addEventListener('pause', syncPause);
        audio.addEventListener('loadeddata', onReady);
        audio.addEventListener('canplaythrough', onReady);
        window.addEventListener('load', onReady);
        document.addEventListener('visibilitychange', onVisibility);
        onReady();

        return () => {
            stopRetry();
            audio.removeEventListener('play', syncPlay);
            audio.removeEventListener('pause', syncPause);
            audio.removeEventListener('loadeddata', onReady);
            audio.removeEventListener('canplaythrough', onReady);
            window.removeEventListener('load', onReady);
            document.removeEventListener('visibilitychange', onVisibility);
            audio.pause();
            audio.currentTime = 0;
        };
    }, [music, isPreview]);

    // ── Fondo de estrellas flotantes ───────────────────────────────────────────
    useEffect(() => {
        const canvas  = starfieldRef.current;
        const wrapper = appWrapperRef.current;
        if (!canvas || !wrapper) return;

        const ctx   = canvas.getContext('2d');
        const COUNT = IS_MOBILE ? 60 : 130;

        // Paleta: mayoría blancas, algunas rosadas/moradas
        const PALETTES = [
            '255,255,255', '255,255,255', '255,255,255',
            '255,214,232', '255,214,232',
            '255,26,140',
            '189,0,255',
        ];

        let stars  = [];
        let animId;

        function makeStars(w, h) {
            stars = Array.from({ length: COUNT }, () => {
                const size = 0.4 + Math.random() * 1.6;
                return {
                    x:         Math.random() * w,
                    y:         Math.random() * h,        // posición inicial dispersa
                    vy:        -(0.12 + Math.random() * 0.28), // hacia arriba
                    vx:        (Math.random() - 0.5) * 0.06,   // leve deriva lateral
                    size,
                    opacity:   Math.random(),
                    maxOp:     0.35 + Math.random() * 0.55,
                    fadeSpeed: 0.004 + Math.random() * 0.007,
                    fadeDir:   Math.random() > 0.5 ? 1 : -1,
                    color:     PALETTES[Math.floor(Math.random() * PALETTES.length)],
                };
            });
        }

        function tick() {
            animId = requestAnimationFrame(tick);
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            for (const s of stars) {
                s.y += s.vy;
                s.x += s.vx;

                // Reinicia al salir por arriba o laterales
                if (s.y < -s.size * 2) {
                    s.y  = h + s.size;
                    s.x  = Math.random() * w;
                }
                if (s.x < -4) s.x = w + 4;
                if (s.x > w + 4) s.x = -4;

                // Parpadeo suave
                s.opacity += s.fadeSpeed * s.fadeDir;
                if (s.opacity >= s.maxOp)  { s.opacity = s.maxOp;  s.fadeDir = -1; }
                if (s.opacity <= 0)         { s.opacity = 0;         s.fadeDir =  1; }

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.color},${s.opacity.toFixed(3)})`;
                ctx.fill();
            }
        }

        function onResize() {
            canvas.width  = wrapper.clientWidth;
            canvas.height = wrapper.clientHeight;
            makeStars(canvas.width, canvas.height);
        }

        window.addEventListener('resize', onResize);
        onResize();
        tick();

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animId);
        };
    }, []);

    // ── Motor canvas (partículas) ──────────────────────────────────────────────
    useEffect(() => {
        const canvas  = canvasRef.current;
        const wrapper = appWrapperRef.current;
        if (!canvas || !wrapper) return;

        const ctx       = canvas.getContext('2d');
        const particles = new ParticlePool(PARTICLE_CFG.length);

        let animId;
        let time;
        let baseScale    = 1.0;
        let curScale     = 1.0;
        let curVelocity  = PARTICLE_CFG.velocity;
        let curRate      = PARTICLE_CFG.rateNormal;
        let colorT       = 0;

        // Color throttle: solo rehacer imagen si delta RGB acumulado > 15
        let lastR = 224, lastG = 20, lastB = 76;
        let curImage = makeParticleImage(224, 20, 76);

        function lerp(a, b, t) { return a * (1 - t) + b * t; }

        function pointOnHeart(t, scale = 1.0) {
            return new Point(
                (160 * Math.pow(Math.sin(t), 3)) * scale,
                (130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25) * scale,
            );
        }

        function makeParticleImage(r, g, b) {
            const s   = PARTICLE_CFG.size;
            const tmp = document.createElement('canvas');
            tmp.width = tmp.height = s;
            const tc  = tmp.getContext('2d');

            const toPoint = t => {
                const p = pointOnHeart(t, 1.0);
                p.x = s / 2 + p.x * s / 350;
                p.y = s / 2 - p.y * s / 350;
                return p;
            };

            tc.beginPath();
            let tp = toPoint(-Math.PI);
            tc.moveTo(tp.x, tp.y);
            for (let a = -Math.PI; a < Math.PI; a += 0.01) {
                tp = toPoint(a);
                tc.lineTo(tp.x, tp.y);
            }
            tc.closePath();
            tc.fillStyle = `rgb(${r},${g},${b})`;
            tc.fill();
            return tmp;
        }

        function render() {
            animId = requestAnimationFrame(render);

            const now = Date.now() / 1000;
            const dt  = now - (time || now);
            time = now;

            if (isHeartExpandedRef.current) {
                curScale    += (baseScale * 1.2 - curScale)    * 0.05;
                curVelocity += (150 - curVelocity)              * 0.05;
                curRate     += (PARTICLE_CFG.rateExpanded - curRate) * 0.05;
                colorT       = Math.min(1, colorT + 0.03);
            } else {
                curScale    += (baseScale - curScale)           * 0.05;
                curVelocity += (PARTICLE_CFG.velocity - curVelocity) * 0.05;
                curRate     += (PARTICLE_CFG.rateNormal - curRate)   * 0.05;
                colorT       = Math.max(0, colorT - 0.03);
            }

            const r = Math.round(lerp(224, 189, colorT));
            const g = Math.round(lerp(20,    0, colorT));
            const b = Math.round(lerp(76,  255, colorT));

            if (Math.abs(r - lastR) + Math.abs(g - lastG) + Math.abs(b - lastB) > 15) {
                curImage = makeParticleImage(r, g, b);
                lastR = r; lastG = g; lastB = b;
            }

            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';

            const amount = curRate * dt;
            for (let i = 0; i < amount; i++) {
                const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random(), curScale);
                const dir = pos.clone().length(curVelocity);
                particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
            }

            particles.update(dt);
            particles.draw(ctx, curImage);
        }

        function onResize() {
            if (!wrapper) return;
            canvas.width  = wrapper.clientWidth;
            canvas.height = wrapper.clientHeight;
            const ratio = canvas.width / 420;
            baseScale = Math.max(0.8, Math.min(2.5, ratio));
            if (!isHeartExpandedRef.current) curScale = baseScale;
        }

        window.addEventListener('resize', onResize);
        onResize();
        render();

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animId);
        };
    }, []);

    // ── Handlers ───────────────────────────────────────────────────────────────

    const spawnClickEffect = useCallback((clientX, clientY) => {
        const wrapper = appWrapperRef.current;
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;
        const color = currentBaseColorRef.current;

        const container = document.createElement('div');
        container.className = 'click-effect-cc';
        container.style.left = `${relX}px`;
        container.style.top  = `${relY}px`;

        const text = document.createElement('div');
        text.className = 'click-text-cc';
        text.innerText = 'I love you';
        text.style.color      = color;
        text.style.textShadow = `0 0 8px ${color}, 0 0 18px ${color}`;
        container.appendChild(text);

        const numHearts = 14;
        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'click-heart-cc';
            heart.style.color = color;
            heart.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="${HEART_PATH}"/></svg>`;

            const angle = (i / numHearts) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
            const rX    = 75 + Math.random() * 15 - 7.5;
            const rY    = 40 + Math.random() * 10 - 5;
            heart.style.transform = `translate(${Math.cos(angle) * rX}px, ${Math.sin(angle) * rY}px) scale(${Math.random() * 0.6 + 0.7})`;
            container.appendChild(heart);
        }

        wrapper.appendChild(container);
        setTimeout(() => container.parentNode?.removeChild(container), 2000);
    }, []);

    const handleBackgroundClick = useCallback(e => {
        spawnClickEffect(e.clientX, e.clientY);
    }, [spawnClickEffect]);

    const handleModalClick = useCallback(e => {
        if (e.target.closest('.swiper-cc') || e.target.closest('.close-btn-cc')) return;
        spawnClickEffect(e.clientX, e.clientY);
    }, [spawnClickEffect]);

    const handleOpenModal = useCallback(() => {
        isHeartExpandedRef.current  = true;
        currentBaseColorRef.current = COLOR_PURPLE;

        if (!isPreview) {
            import('canvas-confetti').then(mod => {
                const confetti = mod.default ?? mod;
                confetti({
                    particleCount: 80,
                    spread:  100,
                    origin:  { x: 0.5, y: 0.65 },
                    colors:  ['#ff1a8c', '#bd00ff', '#ffd6e8', '#e6ccff', '#ffffff'],
                    gravity: 0.85,
                    scalar:  1.1,
                });
            });
        }

        setTimeout(() => setIsModalOpen(true), 1500);
    }, [isPreview]);

    const handleCloseModal = useCallback(e => {
        e.stopPropagation();
        setIsModalOpen(false);
        isHeartExpandedRef.current  = false;
        currentBaseColorRef.current = COLOR_PINK;
    }, []);

    const handleToggleMusic = useCallback(async e => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            try { await audio.play(); setIsAudioPlaying(true); }
            catch { setIsAudioPlaying(false); }
        } else {
            audio.pause();
            setIsAudioPlaying(false);
        }
    }, []);

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
        <div className="app-wrapper-cc" ref={appWrapperRef}>
            <audio ref={audioRef} src={music} preload="none" />

            {/* Glows ambientales */}
            <div className="ambient-cc ambient-pink-cc"   aria-hidden="true" />
            <div className="ambient-cc ambient-purple-cc" aria-hidden="true" />

            {/* Botón música */}
            <button
                className={`music-btn-cc${isAudioPlaying ? ' playing-cc' : ''}`}
                onClick={handleToggleMusic}
                aria-label={isAudioPlaying ? 'Pausar música' : 'Reproducir música'}
                type="button"
            >
                {isAudioPlaying ? <IconPause /> : <IconPlay />}
            </button>

            {/* Estrellas flotantes (fondo) */}
            <canvas ref={starfieldRef} className="starfield-cc" aria-hidden="true" />

            {/* Radar */}
            <div className={`radar-line-cc${isModalOpen ? ' modal-open-cc' : ''}`} />

            {/* Canvas partículas corazón */}
            <canvas ref={canvasRef} id="pinkboard-cc" />

            {/* Capa UI */}
            <div className="ui-layer-cc">
                <div className={`title-top-cc${isModalOpen ? ' modal-open-cc' : ''}`}>
                    I love you
                    <HeartIcon size={22} className="title-heart-cc" />
                </div>

                <div className={`title-recipient-cc${isLoaded ? ' visible-cc' : ''}${isModalOpen ? ' hidden-cc' : ''}`}>
                    Para {nombre}
                </div>

                <div className="loader-container-cc" style={{ opacity: isLoaded ? 0 : 1 }}>
                    <div className="loader-fill-cc" style={{ width: `${progress}%` }} />
                </div>

                <button
                    className={`open-btn-cc${isLoaded ? ' visible-cc' : ''}${isModalOpen ? ' modal-open-cc' : ''}`}
                    onClick={handleOpenModal}
                >
                    Ver tu regalo
                </button>
            </div>

            {/* Área de clicks (fondo) */}
            <div className="click-area-cc" onClick={handleBackgroundClick} />

            {/* Overlay + Modal */}
            <div className={`modal-overlay-cc${isModalOpen ? ' active-cc' : ''}`} onClick={handleModalClick}>
                <div className="modal-wrapper-cc">
                    <div className="modal-content-cc">

                        <button className="close-btn-cc" onClick={handleCloseModal} aria-label="Cerrar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="16" height="16">
                                <line x1="18" y1="6"  x2="6"  y2="18" />
                                <line x1="6"  y1="6"  x2="18" y2="18" />
                            </svg>
                        </button>

                        {/* Sección nombre */}
                        <div className="modal-name-section-cc">
                            <p className="modal-name-label-cc">Para ti,</p>
                            <h2 className="modal-name-cc" ref={modalNameRef}>{nombre}</h2>
                            <div className="modal-divider-cc">
                                <span className="divider-line-cc" />
                                <HeartIcon size={13} className="divider-heart-cc" />
                                <span className="divider-line-cc" />
                            </div>
                        </div>

                        {/* Mensaje fijo + adición del usuario */}
                        <p className="modal-text-cc">{MENSAJE_DEFAULT}</p>
                        {mensajeUser && (
                            <p className="modal-text-user-cc">{mensajeUser}</p>
                        )}

                        {/* Dedicatoria / firma */}
                        {dedicatoria && (
                            <p className="modal-dedicatoria-cc">— {dedicatoria}</p>
                        )}

                        {/* Carrusel de fotos */}
                        <div className="swiper swiper-cc mySwiper" ref={swiperContainerRef}>
                            <div className="swiper-wrapper">
                                {swiperSlides.map((src, i) => (
                                    <div
                                        key={`${src}-${i}`}
                                        className="swiper-slide swiper-slide-cc"
                                        style={{ backgroundImage: `url(${src})` }}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
