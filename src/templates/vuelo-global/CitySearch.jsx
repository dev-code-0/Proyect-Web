import { useState, useRef, useCallback } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import * as turf from '@turf/turf';

export default function CitySearch({ value, onChange, placeholder, accentColor }) {
  const [query,   setQuery]   = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [draftPin, setDraftPin] = useState(null);
  const debounceRef = useRef(null);

  const search = useCallback(async (q) => {
    if (q.length < 3) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}&featuretype=city`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': 'es,en',
          'User-Agent': 'VueloGlobal/1.0 (ballonabjose@gmail.com)',
        },
      });
      const data = await res.json();
      const mapped = data.map(r => {
        const parts   = r.display_name.split(',').map(s => s.trim());
        const city    = parts.slice(0, 2).join(', ');
        const country = parts[parts.length - 1];
        return { name: city, country, lat: parseFloat(r.lat), lng: parseFloat(r.lon) };
      });
      setResults(mapped);
      setOpen(mapped.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 400);
  };

  const handleSelect = (item) => {
    const label = `${item.name}, ${item.country}`;
    setQuery(label);
    onChange({ name: label, lat: item.lat, lng: item.lng });
    setResults([]);
    setOpen(false);
  };

  const handleBlur = () => setTimeout(() => setOpen(false), 180);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0 12px' }}>
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: accentColor, width: '18px', height: '18px', flexShrink: 0 }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <input
          style={{ width: '100%', background: 'transparent', border: 'none', padding: '10px 0', color: 'white', outline: 'none' }}
          value={query}
          onChange={handleInput}
          placeholder={placeholder}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={handleBlur}
          autoComplete="off"
          spellCheck={false}
        />
        {value?.lat && (
          <button 
            type="button"
            onClick={() => {
              setDraftPin(value.exactLat ? { lat: value.exactLat, lng: value.exactLng } : { lat: value.lat, lng: value.lng });
              setShowMap(true);
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Seleccionar punto exacto en el mapa"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill={value.exactLat ? accentColor : 'rgba(255,255,255,0.5)'}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1b2e', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '4px', margin: '4px 0 0 0', listStyle: 'none', zIndex: 1000, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          {results.map((r, i) => (
            <li key={i} onMouseDown={() => handleSelect(r)} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', borderBottom: '1px solid rgba(255,255,255,0.05)' }} onMouseOver={(e) => e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.background='transparent'}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{r.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{r.country}</div>
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && !loading && query.length >= 3 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1b2e', padding: '10px', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', borderRadius: '8px', margin: '4px 0 0 0', border: '1px solid rgba(255,255,255,0.1)' }}>Sin resultados</div>
      )}

      {showMap && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#000', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '15px 20px', background: '#111', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>📍 Fija la ubicación exacta</span>
            <button onClick={() => setShowMap(false)} style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Map
              initialViewState={{
                longitude: draftPin?.lng || value?.lng || -77.0428,
                latitude: draftPin?.lat || value?.lat || -12.0464,
                zoom: 14
              }}
              mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
              onClick={(e) => setDraftPin(e.lngLat)}
              dragRotate={false}
            >
              {draftPin && <Marker longitude={draftPin.lng} latitude={draftPin.lat} color={accentColor} />}
            </Map>
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 16px', borderRadius: 20, fontSize: '0.85rem', pointerEvents: 'none' }}>
              Toca el mapa para fijar el pin
            </div>
          </div>
          <div style={{ padding: 15, background: '#111', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                onChange({ ...value, exactLat: draftPin.lat, exactLng: draftPin.lng });
                setShowMap(false);
              }} 
              style={{ background: accentColor, padding: '12px 30px', borderRadius: 25, border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: `0 4px 15px ${accentColor}88` }}
            >
              Guardar punto exacto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}