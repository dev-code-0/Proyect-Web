# Spec: Videocasete VHS del Amor (`vhs-recuerdos`)

**Fecha:** 2026-05-03  
**Template ID:** `vhs-recuerdos`  
**Plataforma:** SaaS de regalos virtuales (code-free)  
**Prioridad en roadmap:** #2

---

## Resumen

Experiencia retro que simula un reproductor VHS físico. Al abrir el regalo, el cassette se inserta automáticamente, la pantalla enciende con estática, y arranca un slideshow de fotos con efectos de scanlines, grain y glitch CRT. El usuario puede pausar, rebobinar, y al final aparecen créditos estilo película 80s con el mensaje personal.

---

## Archivos

### Crear
```
src/templates/vhs-recuerdos/
├── index.jsx       — wrapper { data } → VHSPlayer
├── config.js       — campos del CustomizeModal
├── VHSPlayer.jsx   — componente principal con reproductor, pantalla y cassette
├── useVHS.js       — hook: estados, fases de animación, Canvas effects, audio
└── vhs.css         — estilos del reproductor, CRT, cassette, temas de color
```

### Actualizar
```
src/lib/templates.js   — añadir entrada { id, title, image }
src/pages/Preview.jsx  — import + case "vhs-recuerdos" en renderTemplate() y getConfig()
src/pages/ViewGift.jsx — import + case "vhs-recuerdos" en el switch de renderizado
public/images/vhs-recuerdos/preview.svg — thumbnail para el catálogo Home
```

---

## Campos de personalización (`config.js`)

| Campo   | Tipo              | Descripción                                      |
|---------|-------------------|--------------------------------------------------|
| titulo  | text              | Título impreso en la etiqueta del cassette        |
| año     | text              | Año grabado — aparece en la etiqueta del cassette |
| mensaje | textarea          | Mensaje que aparece en los créditos finales       |
| firma   | text              | Cierre de los créditos ("Con amor, Juan")         |
| fotos   | file (múltiple)   | 4–6 fotos — núcleo del slideshow                 |
| tema    | select            | Neon / Romance / Gold / Jade                     |
| musica  | file (opcional)   | Audio de fondo durante el slideshow               |

---

## Secuencia de animación (`phase` en useVHS)

El hook maneja un estado `phase` con 5 valores:

### `idle` — Estado inicial
- Cassette visible, centrado sobre el slot del reproductor
- Pantalla apagada (negro)
- Controles deshabilitados

### `inserting` (0 → 1.2s)
- CSS `transform: translateY(Xpx)` anima el cassette hacia el slot
- Micro-vibración al encajar: `keyframes` con pequeños translateX
- La etiqueta del cassette muestra `titulo` + `año`
- Al completar: transición automática a `static`

### `static` (1.2 → 2.5s)
- Canvas lleno de ruido blanco/gris puro (pixels aleatorios)
- `requestAnimationFrame` a 60fps generando noise
- Al completar: transición a `tracking`

### `tracking` (2.5 → 3.5s)
- Franjas horizontales de la primera foto se desplazan lateralmente ±30–60px de forma aleatoria
- Se "alinean" progresivamente hasta quedar estables
- Al completar: transición a `playing`

### `playing` (3.5s → fin del slideshow)
- Fotos avanzan automáticamente cada 5 segundos
- Canvas superpuesto con scanlines + grain activos en cada frame
- Transición entre fotos: glitch de 0.5s (franjas desplazadas horizontalmente)
- Primera foto muestra overlay con título del cassette
- Al terminar todas las fotos: transición a `credits`

### `credits`
- Pantalla negra con tipografía pixel
- El mensaje aparece línea por línea estilo typewriter (30ms/char)
- Al terminar: aparece la firma centrada
- Botón Stop regresa a `idle`

### `rewinding` (desde `playing` o `credits`)
- Fotos retroceden a 4x velocidad con glitch intensificado
- Al llegar a foto 0: vuelve a `playing` desde el inicio

---

## Efectos Canvas (`useVHS.js`)

Todos los efectos se implementan sobre un `<canvas>` superpuesto a la pantalla del reproductor con `position: absolute; inset: 0; pointer-events: none`.

```
scanlines()  — líneas horizontales negras semitransparentes cada 4px, rgba(0,0,0,0.25)
grain()      — pixels blancos rgba(255,255,255,0.03) en posiciones aleatorias cada frame
glitch()     — N franjas horizontales de la imagen desplazadas ±20–60px por 500ms
noise()      — canvas lleno de getImageData con valores random (fase static)
tracking()   — distorsión ondulante que se atenúa progresivamente (fase tracking)
```

El loop de Canvas corre en `requestAnimationFrame` solo cuando `phase === 'playing'` o `phase === 'static'` o `phase === 'tracking'`. Se cancela en otros estados para no quemar CPU.

---

## Controles del reproductor

SVGs inline sin emojis, color via `currentColor` para adaptarse al tema activo:

| Botón   | SVG                                | Acción                                      |
|---------|------------------------------------|---------------------------------------------|
| Play    | Triángulo apuntando derecha        | Inicia/reanuda slideshow (desde `idle` → `inserting`) |
| Pause   | Dos barras verticales              | Congela slideshow en foto actual            |
| Rewind  | Doble flecha izquierda (path SVG)  | Activa fase `rewinding`                     |
| Stop    | Cuadrado                           | Vuelve a `idle`, cassette reaparece         |

El botón Play/Pause es el mismo elemento: cambia su SVG según el estado actual.

---

## Temas de color

Implementados como variables CSS en `vhs.css`. El componente añade `data-tema={tema}` al contenedor raíz.

| Tema    | Variable `--accent` | Variable `--glow`    |
|---------|---------------------|----------------------|
| neon    | `#00ffff`           | `rgba(0,255,255,.3)` |
| romance | `#ff2d78`           | `rgba(255,45,120,.3)`|
| gold    | `#ffb800`           | `rgba(255,184,0,.3)` |
| jade    | `#39ff14`           | `rgba(57,255,20,.3)` |

`--accent` controla: LEDs del reproductor, borde glow de pantalla, display contador, hover de botones.

---

## Compatibilidad local / producción

Puntos críticos para que el template funcione igual en ambos entornos:

1. **Imágenes**: Siempre se reciben como URLs públicas de Supabase (strings). No se usan `File` objects en el componente final — la compresión y subida ocurre en `CustomizeModal`. El componente solo consume `data.fotos` como array de strings URL.

2. **Audio**: El audio usa `new Audio(url)` con `audioRef.current`. La política de autoplay del browser requiere que el audio arranque desde un evento de usuario. Se inicia el audio en el handler del primer click de Play, no automáticamente. En producción (HTTPS) esto es obligatorio.

3. **Canvas**: Solo usa APIs web estándar (`CanvasRenderingContext2D`, `requestAnimationFrame`). No depende de Node.js ni variables de entorno. Funciona igual en Vite dev y en el build estático de `/dist`.

4. **Rutas de imágenes**: `preview.svg` referenciado en `templates.js` usa ruta relativa `"./images/vhs-recuerdos/preview.svg"` — Vite la resuelve correctamente tanto en dev como en build.

5. **CSS**: Sin `url()` hardcodeadas a localhost. Todas las fuentes cargadas via `@fontsource` o Google Fonts CDN.

---

## Notas de implementación

- Usar `useRef` para el canvas, el audio y el intervalo del slideshow — nunca `useState` para estos, para evitar re-renders innecesarios durante el loop de 60fps.
- El `requestAnimationFrame` loop debe limpiar su ID en el `return` del `useEffect` para evitar memory leaks.
- El intervalo del slideshow (5s por foto) también se limpia al desmontar.
- `VHSPlayer.jsx` es un componente controlado: recibe `data` y renderiza. Toda la lógica vive en `useVHS.js`.
- La etiqueta del cassette y los créditos usan tipografía monospace o pixel — `font-family: 'Courier New', monospace` sin dependencia de fuentes externas.
