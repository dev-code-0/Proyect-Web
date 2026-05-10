import React, { useState, useEffect, useRef, use } from 'react';
import './styles.css'
import LogoDisk from './descarga.png'
import Music from './music.mp3';
import Image1 from './images/Image1.avif';
import Image2 from './images/Image2.avif';
import Image3 from './images/Image3.avif';
import Image4 from './images/Image4.avif';
import { AntiInspectGuard } from '../../lib/antiInspect';
import usePreloadImages from '../../hooks/usePreloadImages';

// ==========================================
// COMPONENTE: FONDO ETÉREO Y POLVO DE ESTRELLAS
// ==========================================
const DeepSpaceBackground = () => {
    const orbs = Array.from({ length: 8 });
    const stars = Array.from({ length: 40 });

    return (

        <div className="ar-ethereal-bg">
            <div className="ar-gradient-mesh"></div>
            
            {/* Orbes de luz grandes */}
            {orbs.map((_, i) => {
                const size = Math.random() * 200 + 100;
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const duration = Math.random() * 30 + 20;
                const delay = Math.random() * -20;
                return (
                    <div key={`orb-${i}`} className="ar-orb"
                         style={{ 
                             width: `${size}px`, height: `${size}px`, 
                             left: `${left}%`, top: `${top}%`,
                             animationDuration: `${duration}s`, animationDelay: `${delay}s`
                         }}
                    />
                );
            })}

            {/* Estrellas parpadeantes */}
            {stars.map((_, i) => {
                const size = Math.random() * 3 + 1;
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const duration = Math.random() * 4 + 2;
                const delay = Math.random() * 5;
                return (
                    <div key={`star-${i}`} className="ar-star"
                         style={{
                             width: `${size}px`, height: `${size}px`,
                             left: `${left}%`, top: `${top}%`,
                             animationDuration: `${duration}s`, animationDelay: `${delay}s`
                         }}
                    />
                );
            })}
        </div>
    );
};

// ==========================================
// COMPONENTE: CARRUSEL 3D CILÍNDRICO (NUEVO)
// ==========================================
const CylinderCarousel = ({ photos }) => {
    const spinnerRef = useRef(null);
    const requestRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentRotation = useRef(0);

    // Duplicamos fotos si hay muy pocas para formar un cilindro perfecto
    const displayPhotos = photos.length < 6 
        ? [...photos, ...photos, ...photos].slice(0, Math.max(8, photos.length)) 
        : photos;
        
    const numPhotos = displayPhotos.length;
    const theta = 360 / numPhotos;
    // Calculamos el radio exacto para que las fotos no se superpongan (ancho base 140px)
    const radius = Math.round((140 / 2) / Math.tan(Math.PI / numPhotos)) + 35; 

    useEffect(() => {
        // Animación infinita fluida a 60fps usando requestAnimationFrame
        const animate = () => {
            if (!isDragging.current) {
                currentRotation.current -= 0.15; // Velocidad del giro automático
            }
            if (spinnerRef.current) {
                spinnerRef.current.style.transform = `rotateY(${currentRotation.current}deg)`;
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    // Lógica para arrastrar (Touch / Mouse)
    const handlePointerDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX || (e.touches && e.touches[0].clientX);
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current) return;
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const delta = x - startX.current;
        currentRotation.current += delta * 0.5; // Sensibilidad del arrastre
        if (spinnerRef.current) {
            spinnerRef.current.style.transform = `rotateY(${currentRotation.current}deg)`;
        }
        startX.current = x;
    };

    const handlePointerUp = () => {
        isDragging.current = false;
    };

    return (
        <div className="ar-cylinder-scene"
             onMouseDown={handlePointerDown} onMouseMove={handlePointerMove}
             onMouseUp={handlePointerUp} onMouseLeave={handlePointerUp}
             onTouchStart={handlePointerDown} onTouchMove={handlePointerMove}
             onTouchEnd={handlePointerUp}>
            
            <div className="ar-cylinder-spinner" ref={spinnerRef}>
                {displayPhotos.map((src, i) => (
                    <div key={i} className="ar-cylinder-item"
                         style={{ transform: `rotateY(${i * theta}deg) translateZ(${radius}px)` }}>
                        <img src={src} alt={`Memoria ${i}`} draggable="false" />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// SUBCOMPONENTE: BLOQUE DE TIEMPO
// ==========================================
const TimeBlock = ({ value, label }) => (
    <div className="ar-time-block">
        <div className="ar-time-ring">
            <div className="ar-time-ring-inner">
                <span className="ar-time-val">{value.toString().padStart(2, '0')}</span>
            </div>
        </div>
        <span className="ar-time-lbl">{label}</span>
    </div>
);

// ==========================================
// COMPONENTE: CONTADOR DE TIEMPO ELEGANTE
// ==========================================
const TimeCounter = ({ startDate }) => {
    const [time, setTime] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate);
            const now = new Date();
            
            let years = now.getFullYear() - start.getFullYear();
            let months = now.getMonth() - start.getMonth();
            let days = now.getDate() - start.getDate();
            
            if (days < 0) {
                months--;
                const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += lastMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            const diff = now - start;
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTime({ years, months, days, hours, minutes, seconds });
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [startDate]);

    return (
        <div className="ar-time-container">
            <TimeBlock value={time.years} label="Años" />
            <TimeBlock value={time.months} label="Meses" />
            <TimeBlock value={time.days} label="Días" />
            <TimeBlock value={time.hours} label="Horas" />
            <TimeBlock value={time.minutes} label="Mins" />
            <TimeBlock value={time.seconds} label="Segs" />
        </div>
    );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function SanValentinApp({ data }) {
    const photos = data?.photos && data.photos.length > 0
    ? data.photos
    : data?.fotos && data.fotos.length > 0
        ? data.fotos
        : [Image1, Image2, Image3, Image4];
    
        usePreloadImages(photos);

const logoTime = typeof data?.logoTime === 'string' && data.logoTime.trim()
    ? data.logoTime
    : photos[0];

const targetDateValue = typeof data?.targetDate === 'string' && data.targetDate
    ? data.targetDate
    : '2023-06-26';

const targetDateMatch = targetDateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
const fallbackLockCode = targetDateMatch
    ? {
        day: Number(targetDateMatch[3]),
        month: Number(targetDateMatch[2]),
        year: Number(targetDateMatch[1]) % 100
    }
    : { day: 26, month: 5, year: 23 };

const config = {
    nombre: data?.apodo || 'Mi niña',
    targetDate: targetDateValue,
    lockCode: data?.lockCode || fallbackLockCode,
    pista: data?.pista || 'La fecha por defecto es 26/06/23, pero puedes cambiarla a tu fecha especial :)',
    photos,
    mainPhoto: data?.mainPhoto || LogoDisk,
    logoTime,
    letterTitle: data?.letterTitle || 'Mi Destino Elegido',
    letterText: data?.letterText || 'Mi amor, desde el momento en que nuestras miradas se cruzaron, supe que el universo tenía un plan. Cada recuerdo a tu lado es una estrella que ilumina mis noches más oscuras. Gracias por enseñarme lo que significa amar sin límites, por ser mi refugio y mi mayor aventura. Prometo elegirte todos los días de mi vida. Eres y siempre serás, el amor de mi vida.',
    songUrl: data?.songUrl || Music,
    reasons: data?.reasons || ['Tu sonrisa hermosa', 'Tus abrazos cálidos', 'Cómo me haces reír', 'Tu forma de ver el mundo', 'Lo seguro que me siento', 'Tu voz suave']
};

    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlocking, setUnlocking] = useState(false);
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const [code, setCode] = useState({ day: 26, month: 5, year: 23 });
    
    const audioRef = useRef(null);
    const pendingSeekRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songProgress, setSongProgress] = useState(0);
    const [songDuration, setSongDuration] = useState(0);
    const [clickHearts, setClickHearts] = useState([]);

    // Lógica del Candado
    useEffect(() => {
        if (code.day === config.lockCode.day && 
            code.month === config.lockCode.month && 
            code.year === config.lockCode.year) {
            setUnlocking(true);
            setTimeout(() => setIsUnlocked(true), 2400); 
        }
    }, [code, config.lockCode]);

    const changeValue = (type, amount, max) => {
        setCode(prev => {
            let newVal = prev[type] + amount;
            if (newVal > max) newVal = 1;
            if (newVal < 1) newVal = max;
            if (type === 'year') {
                if (newVal > 99) newVal = 0;
                if (newVal < 0) newVal = 99;
            }
            return { ...prev, [type]: newVal };
        });
    };

    const togglePlay = (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) audio.play();
        else audio.pause();
    };

    const requestSeek = (nextTime) => {
        const audio = audioRef.current;
        if (!audio) return;

        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        const safeTime = duration > 0
            ? Math.min(Math.max(nextTime, 0), Math.max(duration - 0.05, 0))
            : Math.max(nextTime, 0);

        if (audio.readyState < 1 || !Number.isFinite(audio.duration)) {
            pendingSeekRef.current = safeTime;
            audio.load();
            return;
        }

        audio.currentTime = safeTime;
        setSongProgress(safeTime);
    };

    const updateSongProgress = () => {
        const audio = audioRef.current;
        if (!audio) return;

        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        const progress = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

        setSongDuration(duration);
        setSongProgress(progress);
    };

    const handleSongSeek = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        const nextTime = Number(e.target.value);
        requestSeek(nextTime);
    };

    const seekBySeconds = (seconds, e) => {
        e.preventDefault();
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
        const maxTime = duration > 0 ? Math.max(duration - 0.05, 0) : Math.max(current + Math.abs(seconds), 0);
        const nextTime = Math.min(Math.max(current + seconds, 0), maxTime);

        requestSeek(nextTime);
    };

    const restartSong = (e) => {
        e.preventDefault();
        e.stopPropagation();
        requestSeek(0);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const applyPendingSeek = () => {
            if (pendingSeekRef.current === null) return;
            const nextTime = pendingSeekRef.current;
            pendingSeekRef.current = null;
            audio.currentTime = nextTime;
            setSongProgress(nextTime);
        };

        audio.addEventListener('loadedmetadata', applyPendingSeek);
        audio.addEventListener('canplay', applyPendingSeek);

        return () => {
            audio.removeEventListener('loadedmetadata', applyPendingSeek);
            audio.removeEventListener('canplay', applyPendingSeek);
        };
    }, []);

    const handleScreenClick = (e) => {
        if (!isUnlocked) return;
        const id = Date.now();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setClickHearts(prev => [...prev, { id, x, y }]);
        setTimeout(() => setClickHearts(prev => prev.filter(heart => heart.id !== id)), 1200);
    };

    const formatNum = (num) => num.toString().padStart(2, '0');
    const songProgressPercent = songDuration > 0 ? (songProgress / songDuration) * 100 : 0;

    const formatSongTime = (seconds) => {
        if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
        const totalSeconds = Math.floor(seconds);
        const minutes = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Spinner Rediseñado (Estilo Relieve Neumórfico)
    const SleekSpinner = ({ value, type, max, label }) => (
        <div className="ar-sleek-spinner">
            <button onClick={() => changeValue(type, 1, max)} className="ar-s-btn" aria-label="Aumentar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <div className="ar-s-val-box">
                <span className="ar-s-val">{formatNum(value)}</span>
                <span className="ar-s-lbl">{label}</span>
            </div>
            <button onClick={() => changeValue(type, -1, max)} className="ar-s-btn" aria-label="Disminuir">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
        </div>
    );

    
    return (
        <AntiInspectGuard>
        <div className="ar-app-container" onClick={handleScreenClick}>
            <DeepSpaceBackground />
            
            <audio
                ref={audioRef}
                src={config.songUrl}
                loop
                preload="auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={updateSongProgress}
                onTimeUpdate={updateSongProgress}
            />

            {clickHearts.map(heart => (
                <svg key={heart.id} className="ar-click-heart" style={{ left: heart.x, top: heart.y }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            ))}

            {!isUnlocked ? (
                // ================= PANTALLA CANDADO =================
                <div className={`ar-screen-lock ${unlocking ? 'ar-unlocking-sequence' : ''}`}>
                    
                    <h1 className="ar-lock-title">
                        El inicio<br/>de todo
                    </h1>

                    <div className="ar-lock-box" onClick={(e) => e.stopPropagation()}>
                        <svg className="ar-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="11" r="3" />
                            <path d="M12 14v2" strokeLinecap="round" />
                        </svg>

                        <div className="ar-spinners-group">
                            <SleekSpinner value={code.day} type="day" max={31} label="Día" />
                            <SleekSpinner value={code.month} type="month" max={12} label="Mes" />
                            <SleekSpinner value={code.year} type="year" max={99} label="Año" />
                        </div>
                    <p className="ar-hint">Una pista: {config.pista}</p>
                    </div>

                </div>
            ) : (
                // ================= PANTALLA PRINCIPAL =================
                <div className="ar-screen-main ar-hide-scrollbar">
                    
                    <div className="ar-hero-section">
                        <span className="ar-hero-subtitle">Desde aquel día</span>
                        <h1 className="ar-hero-title">Nuestra<br/><i>Historia</i></h1>
                    </div>

                    {/* GALERÍA 3D CILÍNDRICA PURA (NUEVA) */}
                    <div className="ar-gallery-container" onClick={(e) => e.stopPropagation()}>
                        <h2 className="ar-section-header">Recuerdos Inolvidables</h2>
                        <CylinderCarousel photos={config.photos} />
                    </div>

                    {/* TARJETA: MÚSICA */}
                    <div className="ar-glass-card" onClick={(e) => e.stopPropagation()} style={{animationDelay: '0.2s'}}>
                        <h2 className="ar-section-header">Nuestra Canción</h2>
                        <div className={`ar-vinyl-player ${isPlaying ? 'ar-playing' : ''}`}>
                            <div className="ar-vinyl-aura">
                                <div className={`ar-vinyl ${isPlaying ? 'ar-spinning' : ''}`}>
                                    <img src={config.mainPhoto} alt="Cover" />
                                </div>
                            </div>
                            <button type="button" className="ar-play-btn" onClick={togglePlay}>
                                {isPlaying ? (
                                    <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" style={{marginLeft: '4px'}}><path d="M8 5v14l11-7z"/></svg>
                                )}
                            </button>
                            <div className="ar-song-progress-wrap">
                                <input
                                    type="range"
                                    className="ar-song-progress"
                                    min="0"
                                    max={songDuration || 0}
                                    step="0.1"
                                    value={songDuration ? songProgress : 0}
                                    onChange={handleSongSeek}
                                    aria-label="Progreso de la canción"
                                    style={{ '--ar-progress': `${songProgressPercent}%` }}
                                />
                                <div className="ar-song-time">
                                    <span>{formatSongTime(songProgress)}</span>
                                    <span>{formatSongTime(songDuration)}</span>
                                </div>
                            </div>
                            <div className="ar-song-controls">
                                <button type="button" className="ar-song-ctrl-btn" onClick={(e) => seekBySeconds(-10, e)} aria-label="Retroceder 10 segundos">-10s</button>
                                <button type="button" className="ar-song-ctrl-btn ar-song-ctrl-main" onClick={restartSong} aria-label="Reiniciar canción">Reiniciar</button>
                                <button type="button" className="ar-song-ctrl-btn" onClick={(e) => seekBySeconds(10, e)} aria-label="Adelantar 10 segundos">+10s</button>
                            </div>
                        </div>
                    </div>

                    {/* TARJETA: TIEMPO */}
                    <div className="ar-glass-card" onClick={(e) => e.stopPropagation()} style={{animationDelay: '0.4s'}}>
                        <h2 className="ar-section-header">El Tiempo a tu Lado</h2>
                        <div className="ar-center-photo">
                            <img src={config.logoTime} alt="Nosotros" />
                        </div>
                        <TimeCounter startDate={config.targetDate} />
                    </div>

                    {/* TARJETA: RAZONES */}
                    <div className="ar-glass-card" style={{animationDelay: '0.6s', marginBottom: '1rem'}}>
                        <h2 className="ar-section-header">Lo que amo de ti <br /> {config.nombre}</h2>
                        <div className="ar-reasons-grid">
                            {config.reasons.map((reason, idx) => (
                                <div key={idx} className="ar-reason-pill">{reason}</div>
                            ))}
                        </div>
                    </div>

                    {/* BOTÓN CARTA */}
                    <div className="ar-action-section" onClick={(e) => e.stopPropagation()}>
                        <button className="ar-glow-btn" onClick={() => setIsLetterOpen(true)}>
                            <span className="ar-glow-btn-text">Descubrir Mi Corazón</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ================= MODAL CARTA ================= */}
            {isLetterOpen && (
                <div className="ar-modal-overlay" onClick={() => setIsLetterOpen(false)}>
                    <div className="ar-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="ar-modal-close" onClick={() => setIsLetterOpen(false)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        <h3 className="ar-modal-title">{config.letterTitle}</h3>
                        <div className="ar-modal-body ar-hide-scrollbar">{config.letterText}</div>
                        <div className="ar-modal-signature">~ Te amo ~</div>
                    </div>
                </div>
            )}
        </div>
        </AntiInspectGuard>
    );
}