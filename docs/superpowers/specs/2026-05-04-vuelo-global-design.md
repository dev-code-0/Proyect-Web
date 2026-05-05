# Vuelo Global — Design Spec
**Date:** 2026-05-04  
**Template ID:** `vuelo-global`  
**Platform:** SaaS Regalos Virtuales (code-free)

---

## Overview

A cinematic 3D globe template where the sender configures two cities and a romantic message. The recipient opens the gift link and watches a fully automated flight animation — a plane arcs from origin to destination along a Bézier curve over a photorealistic Earth with political borders. No interaction required from the recipient.

**Narrative:** "Cruzaría el mundo entero para llegar a ti."

---

## Architecture

### Approach: Self-Contained Template

The template owns its entire UI including the city search panel. It does not use `CustomizeModal`. `Preview.jsx` passes an `onSave` callback; the template calls it when the sender clicks "Guardar y Compartir". `ViewGift.jsx` passes pre-configured `data` and the template auto-starts the cinematic experience.

```
isPreview=true   → globe + glassmorphism panel (city search, fields, save button)
isPreview=false  → globe + auto-start flight → ArrivalModal
```

### File Structure

```
src/templates/vuelo-global/
├── index.jsx            Entry point — routes preview vs view mode
├── config.js            Default cities, texts, color themes
├── VueloGlobal.jsx      Main orchestrator component
├── useGlobe.js          Three.js hook: scene, camera, renderer, globe, stars, borders
├── useFlightPath.js     Hook: Bézier curve, airplane geometry, animation loop, trail
├── CitySearch.jsx       Autocomplete input (Nominatim, debounced 400ms)
├── ArrivalModal.jsx     Cinematic arrival modal
└── vuelo.css            All styles prefixed .vg-

public/images/vuelo-global/
├── preview.webp         Carousel thumbnail
├── earth_daymap.jpg     4096×2048 color texture
├── earth_bumpmap.jpg    2048×1024 bump map
├── earth_specularmap.jpg 2048×1024 specular map
└── world-110m.json      Simplified GeoJSON political borders (~110KB)
```

### Existing Files Modified

| File | Change |
|---|---|
| `src/lib/templates.js` | +1 entry: `{ id, title, image }` |
| `src/pages/Preview.jsx` | +1 import, +1 case in `renderTemplate()` |
| `src/pages/ViewGift.jsx` | +1 import, +1 case in switch |

`getConfig()` in `Preview.jsx` requires no change — this template manages its own UI.

---

## Config Schema (`config.js`)

```js
export const vueloGlobalConfig = {
  id: 'vuelo-global',
  name: 'Vuelo Global',
  defaultData: {
    origen:  { name: 'Lima, Perú',     lat: -12.0464, lng: -77.0428 },
    destino: { name: 'Chiclayo, Perú', lat:  -6.7714, lng: -79.8409 },
    mensaje: 'Cruzaría el mundo entero para llegar a ti.',
    para:    'Mi amor',
    tema:    'aurora',
  },
  temas: {
    aurora:    { primary: '#e879f9', trail: '#a855f7', glow: '#7c3aed' },
    oceano:    { primary: '#38bdf8', trail: '#0ea5e9', glow: '#0369a1' },
    sunset:    { primary: '#fb923c', trail: '#f97316', glow: '#ea580c' },
    esmeralda: { primary: '#34d399', trail: '#10b981', glow: '#059669' },
  },
  ui: {
    titulo:       'Vuelo Global',
    botonGuardar: 'Guardar y Compartir',
    modalTitulo:  'Has llegado',
  },
}
```

---

## Data Flow

### Preview Mode (Sender)
1. `Preview.jsx` renders `<VueloGlobal isPreview={true} onSave={handleSave} defaultData={...} />`
2. Sender sees rotating globe + glassmorphism panel
3. `CitySearch` debounces input 400ms → GET Nominatim API → dropdown (max 5 results)
4. Selecting a city stores `{ name, lat, lng }`
5. Sender fills: para, mensaje, selects tema
6. Click "Guardar y Compartir" → `onSave({ origen, destino, mensaje, para, tema })`
7. `Preview.jsx` handles Supabase insert + ShareModal (existing flow)

### ViewGift Mode (Recipient)
1. Supabase fetch → `data = { origen, destino, mensaje, para, tema }`
2. `<VueloGlobal isPreview={false} data={data} />`
3. Globe rotates 2s (stars, atmosphere visible)
4. Camera pans smoothly to origin city
5. Plane appears at origin, flight animation starts (~8s)
6. Camera pulls back to distance 6.0, follows arc midpoint
7. Plane arrives at destination → particle burst
8. Camera zooms to destination (distance 3.5)
9. `ArrivalModal` fades in with mensaje, para, city names, distance in km

---

## Three.js Globe (`useGlobe.js`)

### Globe Geometry
```
SphereGeometry(2.5, 64, 64)
MeshPhongMaterial:
  map:          earth_daymap.jpg       (color)
  bumpMap:      earth_bumpmap.jpg      (relief)
  bumpScale:    0.05
  specularMap:  earth_specularmap.jpg  (water shine)
  specular:     #4488ff
```

### Political Borders
- Source: `public/images/vuelo-global/world-110m.json` — pre-converted GeoJSON (countries + borders), sourced from `https://geojson-maps.ash.ms` or equivalent. File is static, no npm dependency needed.
- Load via dynamic `import()` (non-blocking, after globe is visible)
- Convert GeoJSON LineString/MultiLineString coordinates → `Vector3` points on sphere surface (radius 2.52)
- Single `THREE.LineSegments` with `LineBasicMaterial({ color: 0xffffff, opacity: 0.35, transparent: true })`
- Drawn on top of globe, no z-fighting (radius offset +0.02)

### Atmosphere
- `SphereGeometry(2.56)` with custom `ShaderMaterial`
- Fresnel effect: transparent at center, blue glow at edges
- Simulates thin atmospheric haze

### Starfield
- `BufferGeometry` with 6,000 random points in sphere radius 80
- `PointsMaterial({ size: 0.15, color: 0xffffff })`

### Coordinate Conversion
```js
function latLngToVector3(lat, lng, radius = 2.5) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  )
}
```

---

## Flight Animation (`useFlightPath.js`)

### Bézier Curve
```js
const P0 = latLngToVector3(origen.lat, origen.lng)
const P2 = latLngToVector3(destino.lat, destino.lng)
const mid = P0.clone().add(P2).multiplyScalar(0.5)
const elevation = P0.distanceTo(P2) * 0.4   // scales with distance
const P1 = mid.normalize().multiplyScalar(2.5 + elevation)

const curve = new QuadraticBezierCurve3(P0, P1, P2)
// 200 points for smooth interpolation
```

### Airplane Geometry
```
Group():
  Body:  BoxGeometry(0.08, 0.018, 0.018) — MeshStandardMaterial white + emissive[tema.primary]
  WingL: BoxGeometry(0.005, 0.001, 0.06) — positioned left
  WingR: BoxGeometry(0.005, 0.001, 0.06) — positioned right
  Tail:  BoxGeometry(0.005, 0.02, 0.008) — positioned rear-top
```

### Dynamic Orientation
```js
const forwardAxis = new Vector3(1, 0, 0)  // plane's local +X axis = nose direction

// Per frame:
t += delta * 0.12            // ~8s total flight
const pos     = curve.getPoint(t)
const tangent = curve.getTangent(t).normalize()
airplane.position.copy(pos)
airplane.quaternion.setFromUnitVectors(forwardAxis, tangent)
```

### Trail
- `THREE.Line` with `BufferGeometry` — last 40 visited positions
- `LineBasicMaterial({ color: tema.trail, opacity: 0.7 })` fading toward tail
- Updated every frame: push current pos, shift oldest

### Cinematic Camera Timeline
```
t=0.0s   Orbital position, globe rotating slowly
t=2.0s   Tween → lookAt(origin), distance 4.5  (500ms ease-in-out)
t=3.5s   Plane spawns, tween → distance 6.0
t=3.5s+  Camera tracks arc midpoint, slow pan
t=arrival Tween → lookAt(destino), distance 3.5 → ArrivalModal
```

---

## UI Design (`vuelo.css` + components)

### Glassmorphism Panel (Preview only)
```css
.vg-panel {
  position: fixed;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 340px;
  background: rgba(10, 10, 30, 0.65);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.6);
}
```

### CitySearch Component
- Input with SVG pin icon (`fill="currentColor"`, color matches tema)
- Debounce: 400ms
- Nominatim endpoint: `https://nominatim.openstreetmap.org/search?format=json&limit=5&q={query}`
- Required header: `User-Agent: VueloGlobal/1.0 (ballonabjose@gmail.com)` — Nominatim usage policy
- Dropdown: city name (bold) + country (muted, small)
- States: idle / loading (border pulse) / error (red border, "Sin resultados")

### Theme Selector
- 4 circular swatches (28px), filled with `tema.primary`
- Active state: 2px white border + scale(1.15)
- On change: globe emissive + trail + glow update in real time

### ArrivalModal
```
Backdrop: rgba(0,0,0,0.85) + blur(8px)
Animation: fade-in + scale(0.8→1.0) 300ms ease-out
Content:
  - SVG heart, 48px, color tema.primary, heartbeat animation
  - "Para: [para]" — Dancing Script 2rem
  - "[mensaje]" — serif italic 1.1rem
  - "[origen.name]  →  [destino.name]" — monospace small muted
  - Calculated distance in km
```

### Responsive
- **Mobile (<768px):** Panel becomes bottom sheet (60vh, fixed bottom, rounded top corners)
- **Tablet+:** Fixed left panel

---

## Bundle & Performance

- Three.js already in `ui-vendor` chunk — no additional cost
- `world-110m.json` loaded via dynamic `import()` — non-blocking
- Earth textures served from `/public/images/vuelo-global/` — browser-cached
- Nominatim calls only happen in Preview mode (sender side)
- No runtime API calls in ViewGift mode — all data pre-stored in Supabase

---

## CSS Class Prefix

All classes use `.vg-` prefix:  
`.vg-panel`, `.vg-canvas`, `.vg-input`, `.vg-dropdown`, `.vg-item`,  
`.vg-swatch`, `.vg-btn-save`, `.vg-modal`, `.vg-modal-backdrop`,  
`.vg-trail`, `.vg-city-name`, `.vg-country`, `.vg-heart`
