import React, { useRef, useState, useCallback } from 'react';
import { useGalaxy } from './useGalaxy';
import './galaxia.css';
import Image1 from './Images/Image1.avif'
import Image2 from './Images/Image2.avif'
import Image3 from './Images/Image3.avif'
import Image4 from './Images/Image4.avif'
import Image5 from './Images/Image5.avif'
import Image6 from './Images/Image6.avif'

export default function GalaxyScene({ data }) {
  const containerRef = useRef(null);
  const [activePortal, setActivePortal] = useState(null);

  // Stable ref so the Three.js effect never re-initializes due to callback identity
  const onPortalClickRef = useRef(null);
  onPortalClickRef.current = useCallback(
    (idx) => setActivePortal((prev) => (prev === idx ? null : idx)),
    []
  );

  const { replayIntro } = useGalaxy(containerRef, data, onPortalClickRef);

  const fotos = Array.isArray(data?.fotos) ? data.fotos : [];
  const titulo = data?.titulo || 'La Constelación de los Recuerdos';
  const mensaje = data?.mensaje || '';
  const firma = data?.firma || '';

  const handleFullscreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="gm-wrapper">
      {/* Three.js canvas mount point */}
      <div ref={containerRef} className="gm-canvas" />

      {/* Constellation title */}
      <h1 className="gm-titulo">{titulo}</h1>

      {/* Empty state hint */}
      {fotos.length === 0 && (
        <div className="gm-empty">
          <span className="gm-empty-icon">✨</span>
          <p>Personaliza tu regalo para ver tus fotos entre las estrellas</p>
        </div>
      )}

      {/* Tap hint (visible on mobile after a moment) */}
      {fotos.length > 0 && (
        <p className="gm-tap-hint">Toca una estrella para abrirla</p>
      )}

      {/* Controls */}
      <div className="gm-controls">
        <button className="gm-btn" onClick={replayIntro} title="Ver intro de nuevo">
          ↩
        </button>
        <button className="gm-btn" onClick={handleFullscreen} title="Pantalla completa">
          ⛶
        </button>
      </div>

      {/* Photo overlay — appears when a portal is clicked */}
      {activePortal !== null && (
        <div className="gm-overlay" onClick={() => setActivePortal(null)}>
          <div
            className="gm-overlay-card"
            onClick={(e) => e.stopPropagation()}
          >
            {fotos[activePortal] && (
              <img
                src={fotos[activePortal]}
                alt={`Momento ${activePortal + 1}`}
                className="gm-overlay-img"
              />
            )}
            {mensaje && <p className="gm-overlay-mensaje">"{mensaje}"</p>}
            {firma && <p className="gm-overlay-firma">— {firma}</p>}
            <button
              className="gm-overlay-close"
              onClick={() => setActivePortal(null)}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
