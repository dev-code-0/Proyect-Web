import { useRef, useState, useEffect } from 'react';
import { vueloGlobalConfig } from './config.js';
import { useGlobe } from './useGlobe.js';
import { useFlightPath } from './useFlightPath.js';
import CitySearch from './CitySearch.jsx';
import ArrivalModal from './ArrivalModal.jsx';
import './vuelo.css';

export default function VueloGlobal({ isPreview, onSave, data, showPanel, onPanelClose }) {
  const containerRef = useRef(null);
  const onFrameRef   = useRef(null);

  const [formData, setFormData] = useState(() => ({
    ...vueloGlobalConfig.defaultData,
    ...(data || {}),
  }));
  const [showModal,    setShowModal]    = useState(false);
  const [showAbrirBtn, setShowAbrirBtn] = useState(false);

  const tema       = formData.tema || 'aurora';
  const temaColors = vueloGlobalConfig.temas[tema] || vueloGlobalConfig.temas.aurora;

  const { sceneRef, cameraRef, groupRef, controlsRef, autoRotateRef } = useGlobe({
    containerRef,
    onFrameRef,
  });

  const { activate, cleanup } = useFlightPath({
    sceneRef,
    cameraRef,
    groupRef,
    controlsRef,
    autoRotateRef,
    onFrameRef,
    onArrival: () => setShowAbrirBtn(true),  // show "Abrir" button, not auto-modal
  });

  // ViewGift mode: auto-start after 2s globe intro
  useEffect(() => {
    if (isPreview || !data) return;
    const resolvedTema   = data.tema || 'aurora';
    const resolvedColors = vueloGlobalConfig.temas[resolvedTema] || vueloGlobalConfig.temas.aurora;
    const timer = setTimeout(() => activate(data.origen, data.destino, resolvedColors), 800);
    return () => { clearTimeout(timer); cleanup(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (!formData.origen?.lat || !formData.destino?.lat) {
      alert('Por favor selecciona una ciudad de origen y destino del listado.');
      return;
    }
    onSave({ ...formData });
    onPanelClose?.();
  };

  // ── Preview mode: globe fills the preview-box ────────────────────
  // ── View mode: fullscreen experience ─────────────────────────────
  const rootClass = `vg-root${!isPreview ? ' vg-root--fullscreen' : ''}`;

  return (
    <div className={rootClass}>
      {/* Three.js canvas */}
      <div ref={containerRef} className="vg-canvas-wrap" />

      {/* Panel — only in preview mode, shown when Personalizar is clicked */}
      {isPreview && showPanel && (
        <div className="vg-overlay" onClick={onPanelClose}>
          <div className="vg-panel" onClick={e => e.stopPropagation()}>

            <div className="vg-panel-header">
              <svg className="vg-plane-icon" viewBox="0 0 24 24" fill="currentColor" style={{ color: temaColors.primary }}>
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <span className="vg-panel-title">{vueloGlobalConfig.ui.titulo}</span>
              <button className="vg-panel-close" onClick={onPanelClose}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
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

            <div className="vg-field" style={{ marginBottom: '22px' }}>
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
        </div>
      )}

      {/* "Abrir" button — appears after flight arrives */}
      {!isPreview && showAbrirBtn && !showModal && (
        <button
          className="vg-btn-abrir"
          style={{ '--vg-accent': temaColors.primary, '--vg-glow': temaColors.glow }}
          onClick={() => setShowModal(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          Abrir mensaje
        </button>
      )}

      {/* Arrival modal */}
      {showModal && (
        <ArrivalModal
          data={isPreview ? formData : (data || formData)}
          temaColors={temaColors}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
