import React, { useState } from 'react';
import YapeModal from './YapeModal';
import FeedbackModal from './FeedbackModal'; // Importamos el nuevo modal

export default function ActionButtons() {
  const [showYape, setShowYape] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); // Estado para el nuevo modal

  // Link de tu comunidad de WhatsApp (el de sugerencias ya lo borramos)
  const whatsappComunidad = "https://chat.whatsapp.com/IGo1Z3EGz827anxc9QifNj";

  return (
    <div className="action-buttons-container">
      
      {/* Botón 1: Enviar Sugerencia (Abre el Modal) */}
      <button onClick={() => setShowFeedback(true)} className="btn-white-home">
        Enviar sugerencia
      </button>
      
      {/* Botón 2: Apóyanos (Abre Yape) */}
      <button onClick={() => setShowYape(true)} className="btn-white-home">
        Apóyanos
      </button>

      {/* Botón 3: Comunidad */}
      <a href={whatsappComunidad} target="_blank" rel="noreferrer" className="btn-white-home">
        Comunidad de WhatsApp
      </a>

      {/* Renderizamos los modales solo si sus estados son true */}
      {showYape && <YapeModal onClose={() => setShowYape(false)} />}
      
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      
    </div>
  );
}