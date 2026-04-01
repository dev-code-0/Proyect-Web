import React, { useState } from 'react';
import './style.css';

export default function CorazonCarruselTemplate(data) {
  const nombre = data?.nombre || "Luz"; // Nombre personalizado o por defecto
  const [modalAbierto, setModalAbierto] = useState(false);
  const [elementosFlotantes, setElementosFlotantes] = useState([]);

  // Maneja los clics para crear la "explosión" de amor
  const handleClicPantalla = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const opciones = ["I love you ♡", "♥", "I love you", "💕"];
    const baseTexto = opciones[Math.floor(Math.random() * opciones.length)];
    const cantidad = 4; // Elementos por clic
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

  return (
    <div className="regalo-virtual-container theme-neon-pink">
      {/* Contenedor principal interactivo */}
      <div className="pantalla-fondo" onClick={handleClicPantalla}>
        
        {/* Textos flotantes interactivos */}
        {elementosFlotantes.map((item) => (
          <div 
            key={item.id} 
            className={`texto-flotante variante-${item.variante}`}
            style={{ left: item.x, top: item.y }}
          >
            {item.texto}
          </div>
        ))}

        <h1 className="titulo-top">I love you ♡</h1>

        {/* Corazón Neón latiendo */}
        <div className="corazon-container">
          <svg className="corazon-svg" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        {/* Botón Abrir que reemplaza la barra de carga */}
        <button 
          className="boton-abrir-neon" 
          onClick={(e) => {
            e.stopPropagation(); // Evita que el clic genere textos al abrir
            setModalAbierto(true);
          }}
        >
          Abrir
        </button>
      </div>

      {/* MODAL / CARTA */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="boton-cerrar" onClick={() => setModalAbierto(false)}>✖</button>
            
            <h2 className="modal-titulo">Para {nombre} ✨</h2>
            
            <p className="modal-texto">
              En cada latido de mi corazón encuentro la melodía perfecta que compone nuestra historia de amor. 
              Eres la luz que ilumina mis días más oscuros y la razón por la cual cada amanecer tiene sentido. 
              Tu sonrisa es mi refugio, tu abrazo mi hogar, y tu amor la fuerza que me impulsa a ser mejor cada día. 🌸
            </p>

            {/* Carrusel 3D */}
            <div className="carrusel-3d">
              {/* Usa tus propias imágenes aquí */}
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