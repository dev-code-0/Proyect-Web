import { useState, useMemo, useEffect } from 'react';
import Map, { Marker, Source, Layer, MapProvider } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { vueloGlobalConfig } from './config.js';
import { useMapAnimation } from './useMapAnimation.js';
import ArrivalModal from './ArrivalModal.jsx';
import './vuelo.css';

// Fix para Cloudflare / Producción con Vite 8 (Rolldown)
// Evita que el worker falle al ser minificado o resuelto como 404
if (typeof window !== 'undefined') {
  maplibregl.setWorkerUrl('https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl-csp-worker.js');
}

// Componente interno que usa el contexto de react-map-gl
function MapScene({ data, isPreview, temaColors, onArrival }) {
  const { origen, destino } = data;
  const { arrived, routeGeojson, vehiclePos, vehicleBearing, isCar } = useMapAnimation({ origen, destino, isPreview });

  const [showModal, setShowModal] = useState(false);
  const [showHug, setShowHug] = useState(false);

  // Notificar al padre cuando llegue
  useEffect(() => {
    if (arrived && !isPreview) {
      if (onArrival) onArrival(true);
      setShowHug(true);
      const t = setTimeout(() => setShowHug(false), 3500);
      return () => clearTimeout(t);
    }
  }, [arrived, isPreview, onArrival]);

  // Estilo de la línea
  const lineLayer = useMemo(() => ({
    id: 'route-line',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': temaColors.trail,
      'line-width': isCar ? 4 : 3,
      'line-dasharray': isCar ? [2, 2] : [1],
      'line-opacity': 0.8
    }
  }), [temaColors, isCar]);

  return (
    <>
      <style>{`
        @keyframes vg-hug-pop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          25% { transform: translate(-50%, -50%) scale(1); }
          85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>

      {/* Ruta */}
      {routeGeojson && (
        <Source id="route" type="geojson" data={routeGeojson}>
          <Layer {...lineLayer} />
        </Source>
      )}

      {/* Marcador de Origen */}
      {origen && (
        <Marker longitude={origen.lng} latitude={origen.lat} anchor="bottom">
          <div className="vg-pin" style={{ borderColor: temaColors.primary }}>O</div>
        </Marker>
      )}

      {/* Marcador de Destino */}
      {destino && (
        <Marker longitude={destino.lng} latitude={destino.lat} anchor="bottom">
          <div className="vg-pin" style={{ borderColor: temaColors.primary }}>D</div>
        </Marker>
      )}

      {/* Vehículo Animado */}
      {vehiclePos && !arrived && (
        <Marker 
          longitude={vehiclePos[0]} 
          latitude={vehiclePos[1]} 
          rotation={vehicleBearing}
          anchor="center"
        >
          {isCar ? (
            <div className="vg-vehicle vg-car" style={{ background: temaColors.primary }}>🚘</div>
          ) : (
            <div className="vg-vehicle vg-plane" style={{ color: temaColors.primary }}>
               <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" style={{ transform: 'rotate(-45deg)' }}>
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>
          )}
        </Marker>
      )}

      {/* Abrazo Animado */}
      {showHug && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100, textAlign: 'center', pointerEvents: 'none', animation: 'vg-hug-pop 3.5s forwards' }}>
          <svg viewBox="0 0 32 32" width="90" height="90" fill={temaColors.primary} style={{ filter: `drop-shadow(0 0 15px ${temaColors.glow})` }}>
            <path d="M29.0005 19C29.0005 17.6041 28.643 16.2918 28.0145 15.1495C28.0983 15.0268 28.1701 14.8952 28.2282 14.7561C28.4483 14.2301 28.4566 13.6394 28.2513 13.1075C28.046 12.5755 27.643 12.1435 27.1267 11.9017C26.7527 11.7266 26.3402 11.6611 25.9361 11.7077C26.1039 11.3703 26.2384 11.0155 26.3367 10.6482L27.0704 7.92147C27.2886 7.22944 27.3657 6.50055 27.2969 5.77803C27.2274 5.04729 27.0101 4.33828 26.6583 3.69402C26.3066 3.04976 25.8276 2.48367 25.2504 2.03009C24.6733 1.5765 24.01 1.24488 23.3009 1.05533C22.5917 0.865778 21.8515 0.822252 21.125 0.927389C20.3985 1.03253 19.701 1.28414 19.0746 1.66696C18.4483 2.04978 17.9063 2.55584 17.4814 3.15443C17.3904 3.28263 17.3052 3.41449 17.226 3.54963C16.8984 3.09916 16.4883 2.71427 16.0169 2.41565C15.5008 2.08863 14.9224 1.87218 14.3184 1.77997C13.7143 1.68776 13.0977 1.7218 12.5075 1.87993C11.9173 2.03806 11.3663 2.31686 10.8892 2.6987C10.4122 3.08055 10.0195 3.55716 9.73601 4.09844C9.45249 4.63971 9.28427 5.23389 9.24198 5.84347C9.20311 6.40383 9.27143 6.966 9.4428 7.49998H7.15184C3.19421 7.49998 1.64009 12.6329 4.93304 14.8282L6.87356 16.1219L5.52005 21.43C5.35091 22.0705 5.33241 22.7415 5.466 23.3904C5.59959 24.0393 5.88164 24.6484 6.29005 25.17C6.69578 25.6931 7.2158 26.1164 7.81031 26.4076C7.99513 26.4981 8.18563 26.5751 8.38031 26.6383V30C8.38031 30.5523 8.82803 31 9.38031 31H19.9203L19.9277 31H28.0005C28.5527 31 29.0005 30.5523 29.0005 30V19ZM15.0005 26.85H17.72C18.2993 26.8501 18.8555 26.6228 19.2688 26.2169C19.6821 25.8111 19.9196 25.2592 19.93 24.68C19.9301 24.3837 19.8715 24.0903 19.7578 23.8166C19.6441 23.543 19.4775 23.2945 19.2675 23.0855C19.0575 22.8764 18.8083 22.7109 18.5342 22.5984C18.26 22.4859 17.9664 22.4287 17.67 22.43H15.0005V19.6713C15.0005 19.3369 14.8334 19.0247 14.5552 18.8392L6.04244 13.1641C4.39597 12.0664 5.17303 9.49998 7.15184 9.49998H9.99083L10.2303 10.39C10.4591 11.2414 10.9243 12.0107 11.572 12.6088C12.2197 13.207 13.0234 13.6095 13.8903 13.77C14.4876 13.8745 15.1004 13.8472 15.686 13.69C16.2067 13.5503 16.6946 13.3108 17.123 12.9855C17.1785 12.9951 17.2351 13 17.2924 13H21.0005C21.3828 13 21.7567 13.0357 22.1192 13.1041L19.6104 14.07C19.1307 14.2564 18.731 14.6043 18.4804 15.0537C18.2298 15.5032 18.1439 16.0261 18.2375 16.5321C18.3311 17.0381 18.5984 17.4956 18.9933 17.8257C19.3881 18.1557 19.8858 18.3376 20.4004 18.34C20.674 18.3397 20.9452 18.2889 21.2004 18.19L26.3187 16.2194C26.7541 17.0506 27.0005 17.9965 27.0005 19V29H15.0005V26.85ZM18.604 11C18.6424 10.9013 18.6774 10.8011 18.709 10.6996C18.971 9.85866 18.9888 8.96063 18.7603 8.11L18.3123 6.48899L18.5528 5.59545L18.5581 5.57075C18.6557 5.11797 18.8443 4.68974 19.1124 4.31203C19.3805 3.93431 19.7225 3.61499 20.1177 3.37343C20.5129 3.13188 20.953 2.97311 21.4114 2.90677C21.8699 2.84043 22.337 2.86789 22.7844 2.9875C23.2319 3.1071 23.6504 3.31636 24.0146 3.60257C24.3788 3.88878 24.681 4.24598 24.903 4.6525C25.125 5.05903 25.262 5.50641 25.3059 5.96751C25.3498 6.42861 25.2996 6.89381 25.1582 7.33491L25.1511 7.35737L24.4045 10.1318C24.2729 10.624 24.0406 11.0813 23.7245 11.4757C22.8742 11.1678 21.957 11 21.0005 11H18.604Z" />
          </svg>
          <div style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', textShadow: `0 2px 8px ${temaColors.glow}`, marginTop: '10px', fontFamily: "'Dancing Script', cursive" }}>
            ¡Te extrañé!
          </div>
        </div>
      )}

      {/* Botón de Llegada */}
      {!isPreview && arrived && !showModal && !showHug && (
        <div className="vg-abrir-container">
          <button
            className="vg-btn-abrir"
            style={{ '--vg-accent': temaColors.primary, '--vg-glow': temaColors.glow }}
            onClick={() => setShowModal(true)}
          >
            Abrir mensaje
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ArrivalModal
          data={data}
          temaColors={temaColors}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default function VueloGlobal({ isPreview, data }) {
  const [isInteractive, setIsInteractive] = useState(isPreview);

  // Extraer valores por defecto de la configuración
  const defaultValues = useMemo(() => {
    const vals = {};
    vueloGlobalConfig.fields.forEach(f => {
      if (f.defaultValue !== undefined) vals[f.name] = f.defaultValue;
    });
    return vals;
  }, []);

  // Datos por defecto si faltan
  const finalData = {
    ...defaultValues,
    ...(data || {})
  };

  const tema = finalData.tema || 'aurora';
  const temaColors = vueloGlobalConfig.temas[tema] || vueloGlobalConfig.temas.aurora;

  // Mapa base (Dark Matter de Carto) - Gratis sin API Key
  const mapStyleUrl = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

  const rootClass = `vg-root${!isPreview ? ' vg-root--fullscreen' : ''}`;

  const onMapLoad = (e) => {
    const map = e.target;
    // Crear un patrón de estrellas en un canvas para usarlo nativamente en MapLibre
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#03020a';
    ctx.fillRect(0, 0, 300, 300);
    
    // Dibujar pequeñas estrellas
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 300;
      const y = Math.random() * 300;
      const radius = Math.random() * 1.2;
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const dataUrl = canvas.toDataURL();
    map.loadImage(dataUrl, (error, image) => {
      if (error) return;
      map.addImage('stars-pattern', image);
      if (map.getLayer('background')) {
        map.setPaintProperty('background', 'background-color', 'transparent'); // Quitamos color sólido
        map.setPaintProperty('background', 'background-pattern', 'stars-pattern');
      }
    });
  };

  return (
    <div className={rootClass}>
      <MapProvider>
        <Map
          initialViewState={{
            longitude: finalData.origen?.lng || -77.0428,
            latitude: finalData.origen?.lat || -12.0464,
            zoom: 2,
          }}
          mapStyle={mapStyleUrl}
          projection="globe" // Activamos el globo 3D
          scrollZoom={isInteractive}
          dragPan={isInteractive}
          doubleClickZoom={isInteractive}
          dragRotate={isInteractive}
          touchZoomRotate={isInteractive}
          attributionControl={false}
          interactiveLayerIds={[]}
          onLoad={onMapLoad}
          style={{ width: '100%', height: '100%', background: '#000510' }}
        >
          <MapScene data={finalData} isPreview={isPreview} temaColors={temaColors} onArrival={() => setIsInteractive(true)} />
        </Map>
      </MapProvider>
    </div>
  );
}
