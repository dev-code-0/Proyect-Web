import React, { useEffect, useRef, useState } from 'react';
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
import { AntiInspectGuard } from '../../lib/antiInspect';

// ==========================================
// CONFIGURACIÓN DE PARTÍCULAS
// ==========================================
const settings = {
    particles: {
        length: 12000,
        duration: 4,
        velocity: 80, 
        effect: -1.3,
        size: 8,
    },
};

class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
    length(length) {
        if (typeof length == 'undefined') return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
    }
    normalize() {
        var len = this.length();
        this.x /= len;
        this.y /= len;
        return this;
    }
}

class Particle {
    constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
    }
    initialize(x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
    }
    update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
    }
    draw(context, image) {
        function ease(t) { 
            return (--t) * t * t + 1;
        }
        var size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
    }
}

class ParticlePool {
    constructor(length) {
        this.particles = new Array(length);
        for (var i = 0; i < this.particles.length; i++) this.particles[i] = new Particle();
        this.firstActive = 0;
        this.firstFree = 0;
        this.duration = settings.particles.duration;
    }
    add(x, y, dx, dy) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);
        this.firstFree++;
        if (this.firstFree === this.particles.length) this.firstFree = 0;
        if (this.firstActive === this.firstFree) this.firstActive++;
        if (this.firstActive === this.particles.length) this.firstActive = 0;
    }
    update(deltaTime) {
        var i;
        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].update(deltaTime);
        }
        if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].update(deltaTime);
            for (i = 0; i < this.firstFree; i++) this.particles[i].update(deltaTime);
        }
        while (this.particles[this.firstActive].age >= this.duration && this.firstActive !== this.firstFree) {
            this.firstActive++;
            if (this.firstActive === this.particles.length) this.firstActive = 0;
        }
    }
    draw(context, image) {
        var i;
        if (this.firstActive < this.firstFree) {
            for (i = this.firstActive; i < this.firstFree; i++) this.particles[i].draw(context, image);
        }
        if (this.firstFree < this.firstActive) {
            for (i = this.firstActive; i < this.particles.length; i++) this.particles[i].draw(context, image);
            for (i = 0; i < this.firstFree; i++) this.particles[i].draw(context, image);
        }
    }
}


export default function CorazonCaruselTemplate({ data }) {

    const nombre = data?.nombre || "Luz";
    const fotos = data?.fotos && data.fotos.length > 0 ? data.fotos : [Image1, Image2, Image3, Image4, Image5, Image6];
    usePreloadImages(fotos);

    const COLOR_PINK = '#ff1a8c';
    const COLOR_PURPLE = '#bd00ff';

    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const appWrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const swiperContainerRef = useRef(null);
    const swiperInstanceRef = useRef(null);

    const isHeartExpandedRef = useRef(false);
    const currentBaseColorRef = useRef(COLOR_PINK);

    // ==========================================
    // SIMULADOR DE BARRA
    // ==========================================
    useEffect(() => {
        const loadingInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => setIsLoaded(true), 400);
                    return 100;
                }
                return prev + 1;
            });
        }, 30);

        return () => clearInterval(loadingInterval);
    }, []);

    useEffect(() => {
        if (!isModalOpen || swiperInstanceRef.current) return;

        const initTimer = setTimeout(() => {
            if (!swiperContainerRef.current) return;

            swiperInstanceRef.current = new Swiper(swiperContainerRef.current, {
                effect: "coverflow",
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: "auto",
                loop: true,
                coverflowEffect: {
                    rotate: 25,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: true,
                },
            });
        }, 100);

        return () => clearTimeout(initTimer);
    }, [isModalOpen]);

    useEffect(() => {
        return () => {
            if (swiperInstanceRef.current) {
                swiperInstanceRef.current.destroy(true, true);
                swiperInstanceRef.current = null;
            }
        };
    }, []);


    // ==========================================
    // MOTOR DEL CANVAS (PARTÍCULAS)
    // ==========================================
    useEffect(() => {
        if (!canvasRef.current || !appWrapperRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const particles = new ParticlePool(settings.particles.length);

        let time;
        let animationFrameId;

        let baseScale = 1.0;
        let currentScale = 1.0;
        let currentVelocity = settings.particles.velocity;

        const normalRate = 10000 / settings.particles.duration;
        const expandedRate = 12000 / settings.particles.duration;
        let currentRate = normalRate;

        let colorT = 0;
        let lastColorStr = '';
        let currentParticleImage = null;

        function lerp(start, end, t) {
            return start * (1 - t) + end * t;
        }

        function pointOnHeart(t, scale = 1.0) {
            return new Point(
                (160 * Math.pow(Math.sin(t), 3)) * scale,
                (130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25) * scale
            );
        }

        function updateParticleImage(hexColor) {
            const tempCanvas = document.createElement('canvas');
            const tempContext = tempCanvas.getContext('2d');
            tempCanvas.width = settings.particles.size;
            tempCanvas.height = settings.particles.size;

            function to(t) {
                const point = pointOnHeart(t, 1.0);
                point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
                point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
                return point;
            }

            tempContext.beginPath();
            let t = -Math.PI;
            let point = to(t);
            tempContext.moveTo(point.x, point.y);
            while (t < Math.PI) {
                t += 0.01;
                point = to(t);
                tempContext.lineTo(point.x, point.y);
            }
            tempContext.closePath();
            tempContext.fillStyle = hexColor;
            tempContext.fill();

            return tempCanvas;
        }

        currentParticleImage = updateParticleImage('#E0144C');

        function render() {
            animationFrameId = requestAnimationFrame(render);

            const newTime = new Date().getTime() / 1000;
            const deltaTime = newTime - (time || newTime);
            time = newTime;

            if (isHeartExpandedRef.current) {
                currentScale += ((baseScale * 1.2) - currentScale) * 0.05;
                currentVelocity += (150 - currentVelocity) * 0.05;
                currentRate += (expandedRate - currentRate) * 0.05;
                colorT = Math.min(1, colorT + 0.03);
            } else {
                currentScale += (baseScale - currentScale) * 0.05;
                currentVelocity += (settings.particles.velocity - currentVelocity) * 0.05;
                currentRate += (normalRate - currentRate) * 0.05;
                colorT = Math.max(0, colorT - 0.03);
            }

            const r = Math.round(lerp(224, 189, colorT));
            const g = Math.round(lerp(20, 0, colorT));
            const b = Math.round(lerp(76, 255, colorT));
            const newColor = `rgb(${r},${g},${b})`;

            if (newColor !== lastColorStr) {
                currentParticleImage = updateParticleImage(newColor);
                lastColorStr = newColor;
            }

            context.globalCompositeOperation = 'source-over';
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.globalCompositeOperation = 'lighter';

            const amount = currentRate * deltaTime;
            for (let i = 0; i < amount; i++) {
                const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random(), currentScale);
                const dir = pos.clone().length(currentVelocity);
                particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
            }

            particles.update(deltaTime);
            particles.draw(context, currentParticleImage);
        }

        function onResize() {
            if (!appWrapperRef.current) return;
            canvas.width = appWrapperRef.current.clientWidth;
            canvas.height = appWrapperRef.current.clientHeight;

            const ratio = canvas.width / 420;
            baseScale = Math.max(0.8, Math.min(2.5, ratio));

            if (!isHeartExpandedRef.current) {
                currentScale = baseScale;
            }
        }

        window.addEventListener('resize', onResize);
        onResize();
        render();

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);


    // ==========================================
    // LÓGICA DE INTERACCIÓN Y MODAL
    // ==========================================
    const createFloatingElements = (clientX, clientY) => {
        if (!appWrapperRef.current) return;
        const rect = appWrapperRef.current.getBoundingClientRect();
        const relX = clientX - rect.left;
        const relY = clientY - rect.top;

        const container = document.createElement('div');
        container.className = 'click-effect-cc';
        container.style.left = `${relX}px`;
        container.style.top = `${relY}px`;

        const text = document.createElement('div');
        text.className = 'click-text-cc';
        text.innerText = 'I love you';
        text.style.color = currentBaseColorRef.current;
        text.style.textShadow = `0 0 8px ${currentBaseColorRef.current}, 0 0 15px ${currentBaseColorRef.current}, 0 0 25px ${currentBaseColorRef.current}`;
        container.appendChild(text);

        const numHearts = 14;
        const radiusX = 75;
        const radiusY = 40;

        for (let i = 0; i < numHearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'click-heart-cc';
            heart.innerText = '❤';
            heart.style.color = currentBaseColorRef.current;
            heart.style.textShadow = `0 0 5px ${currentBaseColorRef.current}, 0 0 10px ${currentBaseColorRef.current}`;

            const angle = (i / numHearts) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
            const rX = radiusX + (Math.random() * 15 - 7.5);
            const rY = radiusY + (Math.random() * 10 - 5);
            const hx = Math.cos(angle) * rX;
            const hy = Math.sin(angle) * rY;

            heart.style.transform = `translate(${hx}px, ${hy}px) scale(${Math.random() * 0.6 + 0.7})`;
            container.appendChild(heart);
        }

        appWrapperRef.current.appendChild(container);
        setTimeout(() => {
            if (container.parentNode) container.parentNode.removeChild(container);
        }, 2000);
    };

    const handleBackgroundClick = (e) => {
        createFloatingElements(e.clientX, e.clientY);
    };

    const handleModalClick = (e) => {
        if (e.target.closest('.swiper .swiper-cc') || e.target.closest('.close-btn-cc')) return;
        createFloatingElements(e.clientX, e.clientY);
    };

    const handleOpenModal = () => {
        isHeartExpandedRef.current = true;
        currentBaseColorRef.current = COLOR_PURPLE;

        setTimeout(() => {
            setIsModalOpen(true);
        }, 1500);
    };

    const handleCloseModal = (e) => {
        e.stopPropagation();
        setIsModalOpen(false);
        isHeartExpandedRef.current = false;
        currentBaseColorRef.current = COLOR_PINK;
    };

    return (

        <AntiInspectGuard>
        <div className="app-wrapper-cc" ref={appWrapperRef}>
            {/* Radar */}
            <div className={`radar-line-cc ${isModalOpen ? 'modal-open-cc' : ''}`} />

            {/* Canvas */}
            <canvas ref={canvasRef} id="pinkboard-cc" />

            {/* Capa UI */}
            <div className="ui-layer-cc">
                <div className={`title-top-cc ${isModalOpen ? 'modal-open-cc' : ''}`}>I love you ❤</div>

                <div className="loader-container-cc" style={{ opacity: isLoaded ? 0 : 1 }}>
                    <div className="loader-fill-cc" style={{ width: `${progress}%` }} />
                </div>

                <button
                    className={`open-btn-cc ${isLoaded ? 'visible-cc' : ''} ${isModalOpen ? 'modal-open-cc' : ''}`}
                    onClick={handleOpenModal}
                >
                    Abrir
                </button>
            </div>

            {/* Capa Interactiva Invisible */}
            <div className="click-area-cc" onClick={handleBackgroundClick} />

            {/* Overlay y Modal */}
            <div className={`modal-overlay-cc ${isModalOpen ? 'active-cc' : ''}`} onClick={handleModalClick}>
                <div className="modal-wrapper-cc">
                    <div className="modal-content-cc">
                        <button className="close-btn-cc" onClick={handleCloseModal}>✕</button> 
                        <h2 className="modal-header-cc">Para {nombre}</h2>
                        <p className="modal-text-cc">
                            En cada latido de mi corazón encuentro la melodía perfecta que compone nuestra historia de amor. Eres la luz que ilumina mis días más oscuros y la razón por la cual cada amanecer tiene sentido. Tu sonrisa es mi refugio, tu abrazo mi hogar, y tu amor la fuerza que me impulsa a ser mejor cada día. 🌟
                        </p>

                        <div className="swiper swiper-cc mySwiper" ref={swiperContainerRef}>
                            <div className="swiper-wrapper">
                                {fotos.map((src, index) => (
                                    <div
                                        key={index}
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
        </AntiInspectGuard>
    );
}