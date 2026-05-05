import { useEffect, useState } from 'react';

function haversineKm(lat1, lng1, lat2, lng2) {
  const R    = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.asin(Math.sqrt(a)));
}

export default function ArrivalModal({ data, temaColors, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const { origen, destino, mensaje, para } = data;
  const km = origen && destino
    ? haversineKm(origen.lat, origen.lng, destino.lat, destino.lng).toLocaleString('es')
    : null;

  return (
    <div className={`vg-modal-backdrop${visible ? ' vg-modal-backdrop--in' : ''}`} onClick={onClose}>
      <div className="vg-modal" onClick={e => e.stopPropagation()}>

        {/* Heart icon */}
        <div className="vg-modal-heart" style={{ color: temaColors.primary }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        {/* Para */}
        <p className="vg-modal-para">Para: <span className="vg-modal-name">{para}</span></p>

        {/* Mensaje */}
        <blockquote className="vg-modal-mensaje">"{mensaje}"</blockquote>

        {/* Route */}
        <div className="vg-modal-route">
          <span className="vg-modal-city">{origen?.name}</span>
          <svg className="vg-modal-arrow" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{ color: temaColors.primary }}>
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
          <span className="vg-modal-city">{destino?.name}</span>
        </div>

        {/* Distance */}
        {km && (
          <p className="vg-modal-distance" style={{ color: temaColors.primary }}>
            {km} km de distancia
          </p>
        )}

        {/* Close */}
        <button className="vg-modal-close" onClick={onClose} style={{ borderColor: temaColors.primary, color: temaColors.primary }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
