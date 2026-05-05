import { useState, useRef, useCallback } from 'react';

export default function CitySearch({ value, onChange, placeholder, accentColor }) {
  const [query,   setQuery]   = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
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
    <div className="vg-city-wrap">
      <div className={`vg-input-row${loading ? ' vg-input-row--loading' : ''}`}>
        <svg className="vg-pin-icon" viewBox="0 0 24 24" fill="currentColor" style={{ color: accentColor }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <input
          className="vg-text-input"
          value={query}
          onChange={handleInput}
          placeholder={placeholder}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={handleBlur}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {open && results.length > 0 && (
        <ul className="vg-dropdown">
          {results.map((r, i) => (
            <li key={i} className="vg-item" onMouseDown={() => handleSelect(r)}>
              <span className="vg-city-name">{r.name}</span>
              <span className="vg-country">{r.country}</span>
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && !loading && query.length >= 3 && (
        <div className="vg-no-results">Sin resultados</div>
      )}
    </div>
  );
}
