import React, { useState } from 'react';
import YapeModal from './YapeModal';

export default function ActionButtons() {
  const [showYape, setShowYape] = useState(false);

  // Reemplaza estos links con los tuyos
  const whatsappSugerencias = "https://wa.me/51983631052?text=Hola, tengo una sugerencia para la web... ";
  const whatsappComunidad = "https://chat.whatsapp.com/IGo1Z3EGz827anxc9QifNj";

  return (
    <div className="action-buttons-container">
      <a href={whatsappSugerencias} target="_blank" rel="noreferrer" className="btn-white">
        Enviar sugerencia
      </a>
      
      <button onClick={() => setShowYape(true)} className="btn-white">
        Apóyanos
      </button>

      <a href={whatsappComunidad} target="_blank" rel="noreferrer" className="btn-white">
        Comunidad de WhatsApp
      </a>

      {/* Renderiza el modal solo si showYape es true */}
      {showYape && <YapeModal onClose={() => setShowYape(false)} />}
    </div>
  );
}