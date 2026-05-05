import { useRef, useState, useEffect } from 'react';
import { vueloGlobalConfig } from './config.js';
import { useGlobe } from './useGlobe.js';
import { useFlightPath } from './useFlightPath.js';
import CitySearch from './CitySearch.jsx';
import ArrivalModal from './ArrivalModal.jsx';
import './vuelo.css';

export default function VueloGlobal({ isPreview, onSave, data }) {
  const containerRef = useRef(null);
  const onFrameRef   = useRef(null);  // shared frame-hook between globe + flight

  const [formData, setFormData] = useState(() => ({
    ...vueloGlobalConfig.defaultData,
    ...(data || {}),
  }));
  const [showModal, setShowModal] = useState(false);

  const tema       = formData.tema || 'aurora';
  const temaColors = vueloGlobalConfig.temas[tema] || vueloGlobalConfig.temas.aurora;

  const { sceneRef, cameraRef, groupRef, controlsRef } = useGlobe({
    containerRef,
    interactive: isPreview,
    onFrameRef,
  });

  const { activate, cleanup } = useFlightPath({
    sceneRef,
    cameraRef,
    groupRef,
    controlsRef,
    onFrameRef,
    onArrival: () => setShowModal(true),
  });

  // ViewGift mode: auto-start flight after 2s globe intro
  useEffect(() => {
    if (isPreview || !data) return;
    const resolvedTema   = data.tema || 'aurora';
    const resolvedColors = vueloGlobalConfig.temas[resolvedTema] || vueloGlobalConfig.temas.aurora;
    const timer = setTimeout(() => {
      activate(data.origen, data.destino, resolvedColors);
    }, 2000);
    return () => { clearTimeout(timer); cleanup(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    const { origen, destino, mensaje, para, tema: t } = formData;
    if (!origen?.lat || !destino?.lat) {
      alert('Por favor selecciona una ciudad de origen y destino.');
      return;
    }
    onSave({ origen, destino, mensaje, para, tema: t });
  };

  return (
    <div className="vg-root">
      {/* Three.js canvas container */}
      <div ref={containerRef} className="vg-canvas-wrap" />

      {/* Preview-mode panel */}
      {isPreview && (
        <div className="vg-panel">
          <div className="vg-panel-header">
            <svg className="vg-plane-icon" viewBox="0 0 24 24" fill="currentColor" style={{ color: temaColors.primary }}>
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            <span className="vg-panel-title">{vueloGlobalConfig.ui.titulo}</span>
          </div>

          <div className="vg-field">
            <label className="vg-label">Origen</label>
            <CitySearch
              value={formData.origen}
              onChange={city => setFormData(p => ({ ...p, origen: city }))}
              placeholder="Ciudad de origen..."
              accentColor={temaColors.primary}
            />
          </div>

          <div className="vg-field">
            <label className="vg-label">Destino</label>
            <CitySearch
              value={formData.destino}
              onChange={city => setFormData(p => ({ ...p, destino: city }))}
              placeholder="Ciudad destino..."
              accentColor={temaColors.primary}
            />
          </div>

          <div className="vg-field">
            <label className="vg-label">Para</label>
            <input
              className="vg-text-input"
              value={formData.para}
              onChange={e => setFormData(p => ({ ...p, para: e.target.value }))}
              placeholder="Nombre del destinatario"
            />
          </div>

          <div className="vg-field" style={{ marginBottom: '24px' }}>
            <label className="vg-label">Mensaje</label>
            <textarea
              className="vg-text-input vg-textarea"
              value={formData.mensaje}
              onChange={e => setFormData(p => ({ ...p, mensaje: e.target.value }))}
              placeholder="Tu mensaje..."
              maxLength={200}
            />
            <span className="vg-char-count">{(formData.mensaje || '').length}/200</span>
          </div>

          <div className="vg-field">
            <label className="vg-label">Tema de color</label>
            <div className="vg-swatches">
              {Object.entries(vueloGlobalConfig.temas).map(([key, colors]) => (
                <button
                  key={key}
                  className={`vg-swatch${formData.tema === key ? ' vg-swatch--active' : ''}`}
                  style={{ background: colors.primary }}
                  onClick={() => setFormData(p => ({ ...p, tema: key }))}
                  title={key}
                />
              ))}
            </div>
          </div>

          <button
            className="vg-btn-save"
            style={{ '--vg-accent': temaColors.primary }}
            onClick={handleSave}
          >
            {vueloGlobalConfig.ui.botonGuardar}
          </button>
        </div>
      )}

      {/* Arrival modal (both modes) */}
      {showModal && (
        <ArrivalModal
          data={formData}
          temaColors={temaColors}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
