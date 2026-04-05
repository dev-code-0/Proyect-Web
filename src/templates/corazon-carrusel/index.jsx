import React, { useEffect, useRef, useState } from 'react';
import './style.css';

const HeartParticlesWeb = ({ recipientName = "Luz" }) => {
    const canvasRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [showCard, setShowCard] = useState(false);

    // Imágenes de ejemplo para el carrusel
    const photos = [
        "https://via.placeholder.com/150x200/ff4d8d/fff?text=Foto+1",
        "https://via.placeholder.com/150x200/ff4d8d/fff?text=Foto+2",
        "https://via.placeholder.com/150x200/ff4d8d/fff?text=Foto+3"
    ];

    useEffect(() => {
        // Lógica de la barra de carga
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setShowCard(true), 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 50); // Velocidad de carga

        // Lógica de Partículas (Canvas)
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 300;

        const particles = [];
        const particleCount = 600;

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.t = Math.random() * Math.PI * 2;
                // Ecuación paramétrica del corazón
                this.x = 16 * Math.pow(Math.sin(this.t), 3);
                this.y = -(13 * Math.cos(this.t) - 5 * Math.cos(2 * this.t) - 2 * Math.cos(3 * this.t) - Math.cos(4 * this.t));
                
                this.originalX = this.x * 6 + canvas.width / 2;
                this.originalY = this.y * 6 + canvas.height / 2;
                
                this.currX = canvas.width / 2;
                this.currY = canvas.height / 2;
                
                this.size = Math.random() * 2 + 1;
                this.speed = Math.random() * 0.05 + 0.02;
            }
            draw() {
                ctx.fillStyle = "#ff4d8d";
                ctx.beginPath();
                ctx.arc(this.currX, this.currY, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Animación de expansión suave
                this.currX += (this.originalX - this.currX) * this.speed;
                this.currY += (this.originalY - this.currY) * this.speed;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.draw());
            requestAnimationFrame(animate);
        };
        animate();

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="preview-box">
            {!showCard ? (
                <div className="heart-container">
                    <h1 className="title">I love you ♡</h1>
                    <canvas ref={canvasRef}></canvas>
                    <div className="loader-container">
                        <div className="loader-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            ) : (
                <div className="card-view">
                    <h1 className="title">I love you</h1>
                    <h2>Para {recipientName} ✨</h2>
                    <p className="message">"En cada latido de mi corazón encuentro la melodía perfecta que compone nuestra historia..."</p>
                    <div className="carousel">{photos.map((url, i) => (<img key={i} src={url} alt="Recuerdo" />))}</div>
                </div>
            )}
        </div>
    );
};

export default HeartParticlesWeb;