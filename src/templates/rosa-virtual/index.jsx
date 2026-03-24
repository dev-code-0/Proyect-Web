import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './style.css';

export default function RosaVirtual({ data }) {
  // 1. Extraemos los datos (o usamos unos de prueba si está vacío)
  const { 
    nombre = "María", 
    color = "red", 
    intencion = "para demostrarte mi amor", 
    mensaje = "Eres una persona muy especial para mí. ¡Espero que te guste este detalle!" 
  } = data || {};

  // 2. Controlamos en qué "pantalla" estamos (0=Cargando, 1=Rosa, 2=Carta)
  const [step, setStep] = useState(0);

  // Mapas de colores exactos a tus diseños
  const colorMap = {
    red: { hex: '#e23535', bg: '#ffdada', letter: '/src/templates/rosa-virtual/images/letter-red.png', rose: '/src/templates/rosa-virtual/images/rose-red.png' },
    orange: { hex: '#ff9c24', bg: '#ffe3c1', letter: '/src/templates/rosa-virtual/images/letter-orange.png', rose: '/src/templates/rosa-virtual/images/rose-orange.png' },
    violet: { hex: '#6e16e3', bg: '#cfcee7', letter: '/src/templates/rosa-virtual/images/letter-violet.png', rose: '/src/templates/rosa-virtual/images/rose-violet.png' },
    yellow: { hex: '#fdd300', bg: '#fef4a7', letter: '/src/templates/rosa-virtual/images/letter-yellow.png', rose: '/src/templates/rosa-virtual/images/rose-yellow.png' },
    blue: { hex: '#2d95ff', bg: '#d3ebff', letter: '/src/templates/rosa-virtual/images/letter-blue.png', rose: '/src/templates/rosa-virtual/images/rose-lightblue.png' },
    white: { hex: '#ff0000', bg: '#dcdcdc', letter: '/src/templates/rosa-virtual/images/letter-white.png', rose: '/src/templates/rosa-virtual/images/rose-white.png' },
    pink: { hex: '#ff58ac', bg: '#f0c9dc', letter: '/src/templates/rosa-virtual/images/letter-pink.png', rose: '/src/templates/rosa-virtual/images/rose-pink.png' }
  };

  const theme = colorMap[color] || colorMap.red;

  // 3. Efecto para pasar de la pantalla de carga a la Rosa después de 3 segundos
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // 4. Función para abrir la carta y lanzar confeti
  const handleAbrirCarta = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [theme.hex, '#ffffff'] });
    setStep(2);
  };

  return (
    <div className="template-rosa-virtual" style={{ backgroundColor: step === 2 ? theme.bg : '#fafafa' }}>
      
      {/* PANTALLA 0: CARGANDO */}
      {step === 0 && (
        <div className="loading-screen fade-in">
          <h1>Para <span style={{ color: theme.hex }}>{nombre}</span></h1>
        </div>
      )}

      {/* PANTALLA 1: LA ROSA FLOTANTE */}
      {step === 1 && (
        <div className="gift-page fade-in">
          <div className="rosa-animada levitacion">
            <div className="rosa-bg" style={{ backgroundColor: theme.bg }}></div>
            <img src={theme.rose} alt="Rosa" className="rosa-img" />
          </div>
          
          <div className="mensaje-corto anim-cascada">
            <span style={{ color: theme.hex }}>{nombre}</span>, {intencion}
          </div>
          
          <button className="boton-abrir anim-cascada" style={{ backgroundColor: theme.hex }} onClick={handleAbrirCarta}>
            Abrir mensaje
          </button>
        </div>
      )}

      {/* PANTALLA 2: LA CARTA FINAL */}
      {step === 2 && (
        <div className="carta-page fade-in">
          <img src={theme.letter} alt="Carta" className="carta-img scale-in" />
          <div className="carta-mensaje scale-in">
            <span style={{ color: theme.hex }}>{mensaje}</span>
          </div>
        </div>
      )}

    </div>
  );
}