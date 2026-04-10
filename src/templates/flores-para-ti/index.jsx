import React, { useState, useEffect, useRef } from 'react';
import Musica from './sound.mp3';
import './style.css'

export default function FloresParaTiTemplate({ data }) {
    const titulo = data?.titulo || "Flores Para Ti";
    const musica = Musica;

    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");

    const containerRef = useRef(null); // Ref principal para calcular el tamaño real de la web
    const particleContainerRef = useRef(null);
    const fallingContainerRef = useRef(null);
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);

    // Initial load animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Animation Loop
    useEffect(() => {
        let animationFrameId;
        let lastParticleTime = 0;
        let lastFlowerTime = 0;
        const particleInterval = 100;
        const flowerInterval = 250;

        const createParticle = (x, y) => {
            if (!particleContainerRef.current) return;
            const particle = document.createElement('div');
            particle.className = 'particle-fpt';
            const size = Math.random() * 6 + 2;
            particle.style.cssText = `width: ${size}px; height: ${size}px; left: ${x}px; top: ${y}px; animation-delay: ${Math.random() * 6}s;`;
            particleContainerRef.current.appendChild(particle);
            setTimeout(() => {
                if (particleContainerRef.current?.contains(particle)) particle.remove();
            }, (6 + parseFloat(particle.style.animationDelay)) * 1000);
        };

        const createFallingFlower = () => {
            if (!fallingContainerRef.current) return;
            const flowerWrapper = document.createElement('div');
            flowerWrapper.className = 'falling-flower-wrapper-fpt';
            const flower = document.createElement('div');
            flower.className = 'falling-flower-fpt';
            
            const animDuration = Math.random() * 8 + 7;
            const size = Math.random() * 30 + 10;

            // Usamos % en lugar de vw para que respete el contenedor
            flowerWrapper.style.left = Math.random() * 95 + '%'; 
            flowerWrapper.style.animationDuration = animDuration + 's';
            
            flower.style.animationDuration = (Math.random() * 2 + 3) + 's';
            flower.style.width = size + 'px';
            flower.style.height = size + 'px';
            flower.style.filter = `blur(${Math.random() * 2}px)`;
            flower.style.opacity = Math.random() * 0.5 + 0.5;

            flowerWrapper.appendChild(flower);
            fallingContainerRef.current.appendChild(flowerWrapper);

            setTimeout(() => {
                if (fallingContainerRef.current?.contains(flowerWrapper)) flowerWrapper.remove();
            }, animDuration * 1000 + 500);
        };

        const animationLoop = (timestamp) => {
            // Obtenemos el ancho y alto real del div contenedor (sea el preview o full screen)
            const width = containerRef.current?.clientWidth || 320;
            const height = containerRef.current?.clientHeight || 550;

            if (timestamp - lastParticleTime > particleInterval) {
                createParticle(Math.random() * width, Math.random() * height);
                createParticle((width / 2) + (Math.random() - 0.5) * (width * 0.8), (height / 3) + (Math.random() - 0.5) * (height * 0.5));
                lastParticleTime = timestamp;
            }

            if (timestamp - lastFlowerTime > flowerInterval) {
                createFallingFlower();
                lastFlowerTime = timestamp;
            }
            animationFrameId = requestAnimationFrame(animationLoop);
        };

        animationFrameId = requestAnimationFrame(animationLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Music Player Logic
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current && audioRef.current.duration) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            setCurrentTime(formatTime(audioRef.current.currentTime));
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current && audioRef.current.duration) {
            setDuration(formatTime(audioRef.current.duration));
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play().catch(e => console.error('Playback failed:', e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressClick = (e) => {
        if (!audioRef.current || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const newTime = ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
    };

    return (
        <div className={`body-fpt ${!isLoaded ? 'not-loaded-fpt' : ''}`} ref={containerRef}>
            <div id="falling-flower-container-fpt" ref={fallingContainerRef}></div>
            <div id="particle-container-fpt" ref={particleContainerRef}></div>
            <h1 className="love-title-fpt">{titulo}</h1>

            <div className="music-player-fpt" id="musicPlayer-fpt">
                <button className="play-pause-btn-fpt" id="playPauseBtn-fpt" onClick={togglePlayPause}>
                    {isPlaying ? (
                        <svg id="pauseIcon-fpt" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
                    ) : (
                        <svg id="playIcon-fpt" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"></path></svg>
                    )}
                </button>
                <div className="progress-container-fpt">
                    <div className="song-info-fpt">Nuestra Canción ❤️</div>
                    <div className="progress-bar-fpt" id="progressBar-fpt" ref={progressBarRef} onClick={handleProgressClick}>
                        <div className="progress-fill-fpt" id="progressFill-fpt" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="time-display-fpt">
                        <span id="currentTime-fpt">{currentTime}</span>
                        <span id="totalTime-fpt">{duration}</span>
                    </div>
                </div>
            </div>

            <div className="flowers-fpt">
                <div className="flower-fpt flower--1-fpt">
                    <div className="flower__leafs-fpt flower__leafs--1-fpt">
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(0deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(30deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(60deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(90deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(120deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(150deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(180deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(210deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(240deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(270deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(300deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(330deg)" }}></div>
                        <div className="flower__white-circle-fpt"></div>
                        <div className="flower__light-fpt flower__light--1-fpt"></div><div className="flower__light-fpt flower__light--2-fpt"></div><div className="flower__light-fpt flower__light--3-fpt"></div><div className="flower__light-fpt flower__light--4-fpt"></div><div className="flower__light-fpt flower__light--5-fpt"></div><div className="flower__light-fpt flower__light--6-fpt"></div><div className="flower__light-fpt flower__light--7-fpt"></div><div className="flower__light-fpt flower__light--8-fpt"></div>
                    </div>
                    <div className="flower__line-fpt"><div className="flower__line__leaf-fpt flower__line__leaf--1-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--2-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--3-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--4-fpt"></div></div>
                </div>

                <div className="flower-fpt flower--2-fpt">
                    <div className="flower__leafs-fpt flower__leafs--2-fpt">
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(0deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(30deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(60deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(90deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(120deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(150deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(180deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(210deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(240deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(270deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(300deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(330deg)" }}></div>
                        <div className="flower__white-circle-fpt"></div>
                        <div className="flower__light-fpt flower__light--1-fpt"></div><div className="flower__light-fpt flower__light--2-fpt"></div><div className="flower__light-fpt flower__light--3-fpt"></div><div className="flower__light-fpt flower__light--4-fpt"></div><div className="flower__light-fpt flower__light--5-fpt"></div><div className="flower__light-fpt flower__light--6-fpt"></div><div className="flower__light-fpt flower__light--7-fpt"></div><div className="flower__light-fpt flower__light--8-fpt"></div>
                    </div>
                    <div className="flower__line-fpt"><div className="flower__line__leaf-fpt flower__line__leaf--1-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--2-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--3-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--4-fpt"></div></div>
                </div>

                <div className="flower-fpt flower--3-fpt">
                    <div className="flower__leafs-fpt flower__leafs--3-fpt">
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(0deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(30deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(60deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(90deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(120deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(150deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(180deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(210deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(240deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(270deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(300deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(330deg)" }}></div>
                        <div className="flower__white-circle-fpt"></div>
                        <div className="flower__light-fpt flower__light--1-fpt"></div><div className="flower__light-fpt flower__light--2-fpt"></div><div className="flower__light-fpt flower__light--3-fpt"></div><div className="flower__light-fpt flower__light--4-fpt"></div><div className="flower__light-fpt flower__light--5-fpt"></div><div className="flower__light-fpt flower__light--6-fpt"></div><div className="flower__light-fpt flower__light--7-fpt"></div><div className="flower__light-fpt flower__light--8-fpt"></div>
                    </div>
                    <div className="flower__line-fpt"><div className="flower__line__leaf-fpt flower__line__leaf--1-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--2-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--3-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--4-fpt"></div></div>
                </div>

                <div className="flower-fpt flower--4-fpt">
                    <div className="flower__leafs-fpt flower__leafs--4-fpt">
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(0deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(30deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(60deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(90deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(120deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(150deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(180deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(210deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(240deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(270deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(300deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(330deg)" }}></div>
                        <div className="flower__white-circle-fpt"></div>
                        <div className="flower__light-fpt flower__light--1-fpt"></div><div className="flower__light-fpt flower__light--2-fpt"></div><div className="flower__light-fpt flower__light--3-fpt"></div><div className="flower__light-fpt flower__light--4-fpt"></div><div className="flower__light-fpt flower__light--5-fpt"></div><div className="flower__light-fpt flower__light--6-fpt"></div><div className="flower__light-fpt flower__light--7-fpt"></div><div className="flower__light-fpt flower__light--8-fpt"></div>
                    </div>
                    <div className="flower__line-fpt"><div className="flower__line__leaf-fpt flower__line__leaf--1-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--2-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--3-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--4-fpt"></div></div>
                </div>

                <div className="flower-fpt flower--5-fpt">
                    <div className="flower__leafs-fpt flower__leafs--5-fpt">
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(0deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(30deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(60deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(90deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(120deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(150deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(180deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(210deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(240deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(270deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(300deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(330deg)" }}></div>
                        <div className="flower__white-circle-fpt"></div>
                        <div className="flower__light-fpt flower__light--1-fpt"></div><div className="flower__light-fpt flower__light--2-fpt"></div><div className="flower__light-fpt flower__light--3-fpt"></div><div className="flower__light-fpt flower__light--4-fpt"></div><div className="flower__light-fpt flower__light--5-fpt"></div><div className="flower__light-fpt flower__light--6-fpt"></div><div className="flower__light-fpt flower__light--7-fpt"></div><div className="flower__light-fpt flower__light--8-fpt"></div>
                    </div>
                    <div className="flower__line-fpt"><div className="flower__line__leaf-fpt flower__line__leaf--1-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--2-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--3-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--4-fpt"></div></div>
                </div>

                <div className="flower-fpt flower--6-fpt">
                    <div className="flower__leafs-fpt">
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(0deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(30deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(60deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(90deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(120deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(150deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(180deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(210deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(240deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(270deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(300deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(330deg)" }}></div>
                        <div className="flower__white-circle-fpt"></div>
                        <div className="flower__light-fpt flower__light--1-fpt"></div><div className="flower__light-fpt flower__light--2-fpt"></div><div className="flower__light-fpt flower__light--3-fpt"></div><div className="flower__light-fpt flower__light--4-fpt"></div>
                    </div>
                    <div className="flower__line-fpt"><div className="flower__line__leaf-fpt flower__line__leaf--1-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--2-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--3-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--4-fpt"></div></div>
                </div>

                <div className="flower-fpt flower--7-fpt">
                    <div className="flower__leafs-fpt">
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(0deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(30deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(60deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(90deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(120deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(150deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(180deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(210deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(240deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(270deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(300deg)" }}></div>
                        <div className="flower__leaf-fpt" style={{ transform: "translate(-50%, -10%) rotate(330deg)" }}></div>
                        <div className="flower__white-circle-fpt"></div>
                        <div className="flower__light-fpt flower__light--1-fpt"></div><div className="flower__light-fpt flower__light--2-fpt"></div><div className="flower__light-fpt flower__light--3-fpt"></div><div className="flower__light-fpt flower__light--4-fpt"></div>
                    </div>
                    <div className="flower__line-fpt"><div className="flower__line__leaf-fpt flower__line__leaf--1-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--2-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--3-fpt"></div><div className="flower__line__leaf-fpt flower__line__leaf--4-fpt"></div></div>
                </div>

                <div className="grow-ans-fpt" style={{ "--d": "1.2s" }}><div className="flower__g-long-fpt"><div className="flower__g-long__top-fpt"></div><div className="flower__g-long__bottom-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--1-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--4-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--5-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--6-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--7-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--8-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--2-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--4-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--5-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--6-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--7-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--8-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--3-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--4-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--5-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--6-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--4-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--4-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--5-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--4-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--5-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--6-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--4-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--5-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--6-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--7-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--4-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--8-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--4-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--5-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--9-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
                <div className="growing-grass-fpt"><div className="flower__grass-fpt flower__grass--10-fpt"><div className="flower__grass--top-fpt"></div><div className="flower__grass--bottom-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--1-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--2-fpt"></div><div className="flower__grass__leaf-fpt flower__grass__leaf--3-fpt"></div><div className="flower__grass__overlay-fpt"></div></div></div>
            </div>

            <audio id="audioPlayer-fpt" ref={audioRef} loop onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata}>
                <source src={musica} type="audio/mpeg" />
            </audio>

         
        </div>
    );
}