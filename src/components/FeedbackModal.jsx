import React, { useState, useRef } from 'react';
import '../styles/modal.css';

const MAX_LENGTH = 500;
const COOLDOWN_MS = 30_000;
const SUPABASE_PROJECT_ID = 'smxvjtnlnblxksdcbdhd';
const EDGE_FUNCTION_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/submit-feedback`;

export default function FeedbackModal({ onClose }) {
  const [mensaje, setMensaje]   = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito]       = useState(false);
  const [notif, setNotif]       = useState('');
  const lastSentRef = useRef(0);

  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(''), 4000);
  };

  const enviarSugerencia = async () => {
    const texto = mensaje.trim();

    if (!texto) {
      notify('Por favor escribe algo antes de enviar.');
      return;
    }

    if (texto.length > MAX_LENGTH) {
      notify(`El mensaje no puede superar ${MAX_LENGTH} caracteres.`);
      return;
    }

    const ahora = Date.now();
    if (ahora - lastSentRef.current < COOLDOWN_MS) {
      const segundos = Math.ceil((COOLDOWN_MS - (ahora - lastSentRef.current)) / 1000);
      notify(`Espera ${segundos}s antes de enviar otra sugerencia.`);
      return;
    }

    setEnviando(true);
    lastSentRef.current = ahora;

    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto }),
      });

      const data = await res.json();

      if (res.status === 429) {
        notify('Demasiadas solicitudes. Espera un momento.');
      } else if (!res.ok) {
        notify('Hubo un error al enviar. Intenta de nuevo.');
        if (import.meta.env.DEV) console.error(data);
      } else {
        setExito(true);
        setTimeout(onClose, 2000);
      }
    } catch (error) {
      notify('Error de conexión. Intenta de nuevo.');
      if (import.meta.env.DEV) console.error(error);
    }

    setEnviando(false);
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-box">
        {exito ? (
          <div className="feedback-success">
            <h2>¡Enviado!</h2>
            <p>Gracias por tu sugerencia.</p>
          </div>
        ) : (
          <>
            <h2>Enviar Sugerencia</h2>
            <p className="feedback-sub">
              Escribe tu idea, queja o recomendación para mejorar la plataforma.
            </p>

            {notif && <p className="modal-notification">{notif}</p>}

            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="Escribe aquí..."
              className="feedback-textarea"
              maxLength={MAX_LENGTH}
            />
            <span className="feedback-counter">{mensaje.length}/{MAX_LENGTH}</span>

            <div className="feedback-buttons">
              <button onClick={onClose} disabled={enviando} className="btn-gray">
                Cancelar
              </button>
              <button onClick={enviarSugerencia} disabled={enviando} className="btn-blue">
                {enviando ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
