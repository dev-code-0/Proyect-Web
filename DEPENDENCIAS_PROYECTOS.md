# DEPENDENCIAS — Pipeline de 67 Plantillas Espectaculares

> Documento de referencia obligatoria antes de empezar cualquier plantilla nueva del pipeline.
> Lee siempre este archivo + [PROYECTOS_PIPELINE.md](./PROYECTOS_PIPELINE.md) al inicio de una sesión que toque el pipeline.

---

## 1. Stack actual (ya instalado, NO reinstalar)

### Render / 3D / Geo
| Librería | Versión | Uso |
|---|---|---|
| `three` | 0.183 | Base de TODAS las escenas 3D. Shaders, geometrías, addons (OrbitControls, EffectComposer, RenderPass, UnrealBloomPass). |
| `maplibre-gl` + `react-map-gl` | 5.x / 8.x | Mapas 2D — patrón `vuelo-global`. |
| `@turf/turf` | 7.x | Geometría geoespacial: bearing, midpoint, line interpolation. |

### Animación / Efectos visuales
| Librería | Uso |
|---|---|
| `animejs` v4 | Timelines simples, SVG morph, opacity/transform en HUD. |
| `canvas-confetti` | Confetti físico (ya usado en celebraciones). |
| `swiper` v12 | Carruseles UI. |

### Audio / Imagen / Datos
| Librería | Uso |
|---|---|
| `browser-image-compression` | Compresión WebP <500 KB antes de upload. |
| `qr-code-styling` | QRs personalizados en ShareModal. |

### Tipografía premium
| Fuente | Uso recomendado |
|---|---|
| `@fontsource/cinzel` | Serif elegante — Catedrales, Tarot, Aniversarios formales. |
| `@fontsource/dancing-script` | Cursiva manuscrita — Cartas, Polaroids, Aniversarios. |
| `@fontsource/pacifico` | Cursiva amigable — Cumpleaños, Familiar. |
| `@fontsource/outfit` | Sans moderna — UI, dashboards, neón. |

### Backend / Infra
| Librería | Uso |
|---|---|
| `@supabase/supabase-js` | DB + Storage + Edge Functions. |
| `@sentry/react` | Error tracking. |
| `react`, `react-dom`, `react-router-dom` v7 | Base. |
| `vite` v8 | Bundler. |

---

## 2. INSTALAR — Críticas (sin estas, ~30 proyectos quedan bloqueados)

```bash
npm i @react-three/rapier postprocessing gsap tone howler @use-gesture/react three-mesh-bvh seedrandom
```

| Librería | Para qué proyectos | Por qué |
|---|---|---|
| **`@react-three/rapier`** | #6 Polaroids cayendo, #11 Cofre+monedas, #28 Steampunk, #43 Rompecabezas, #45 Pastel, #66 Bombones | Física WASM (rápida). Alternativa: `cannon-es` (vanilla three). Elige uno por proyecto, no mezclar. |
| **`postprocessing`** (pmndrs) | Aurora, Eclipse, Acuario, TV CRT, Cassette VHS, Vitrales, Bloom premium en todo | 30+ efectos profesionales: Bloom (mejor que UnrealBloom), GodRays, ChromaticAberration, Glitch, SSAO, Outline, DepthOfField, FilmPass, Pixelation. |
| **`gsap`** | Casi todos: cámara cinemática, drag premium, timelines complejos | Estándar industrial. Incluye `MotionPath`, `Draggable`, `Flip`. |
| **`tone`** | Karaoke, Game Boy, Caja Musical, Pastel soplable, Vinilo, Concierto | Síntesis: oscillators, FM, sampler, transport, chiptunes. |
| **`howler`** | Cualquier plantilla con música subida por usuario, fades, multi-track, spatial 3D | Más robusto que `<audio>` puro. Maneja iOS audio unlock. |
| **`@use-gesture/react`** | Tarot (flip cartas), Rompecabezas (drag), Globo de Nieve (shake), Vinilo (girar) | Drag/pinch/swipe móvil-first. Detecta velocity, direction. |
| **`three-mesh-bvh`** | Bosque Luciérnagas, Mariposas, Linternas Chinas, Koi, Acuario, Acelera raycaster en escenas con miles de objetos | Acelera raycasting 100x+. |
| **`seedrandom`** | Cualquier escena procedural determinista (galaxia, árbol, jardín, etc.) | Reemplazo formal del `mulberry32` manual actual en `arbol-madre`. |

---

## 3. INSTALAR — Muy recomendadas (mejoran calidad ~50%)

```bash
npm i framer-motion lottie-react lenis
```

| Librería | Uso |
|---|---|
| **`framer-motion`** | Modales, transiciones de página, layout animations, shared element. Más ergonómico que animejs para UI React. |
| **`lottie-react`** | Animaciones vectoriales premium descargadas de LottieFiles: fuegos, glitter, fluidos, sparkles. Para Tarot, Pociones, Cabina Telefónica. |
| **`lenis`** | Smooth scroll cinemático. Para Globo Aerostático, Tren Ghibli, scroll-driven storytelling. |

---

## 4. INSTALAR — Específicas por proyecto (instalar SOLO cuando se necesite)

```bash
npm i lrc-kit              # #17 Karaoke LED — parse de archivos .lrc
npm i astronomy-engine     # #12 Carta Astral — posición real de planetas
npm i meyda                # #13 Mandala, #18 Concierto, #2 Vinilo — FFT/MFCC tiempo real
npm i wavesurfer.js        # Cualquier waveform visual
npm i face-api.js          # Auto-crop inteligente en fotos (opt-in)
npm i @ffmpeg/ffmpeg @ffmpeg/util  # Exportar regalo como MP4 (pesado ~25 MB)
npm i react-pdf            # "Imprime tu regalo" como PDF
npm i mathjs               # Trayectorias Rube Goldberg
```

---

## 5. Assets externos (no son npm)

| Recurso | Para qué | Dónde |
|---|---|---|
| **Modelos GLB low-poly** | Carrusel, Cabina, Game Boy, TV, Pastel, Cofre, Tren | [Poly Pizza](https://poly.pizza/) (CC0), [Quaternius](https://quaternius.com/) (CC0), [Sketchfab](https://sketchfab.com/) (filtrar por CC0/CC-BY). |
| **Animaciones esqueléticas FBX** | Genio, Bailarina, mascotas | [Mixamo](https://www.mixamo.com/) — free, descargar como GLB. |
| **Texturas HDRi (cielo)** | Acuario, Aurora, Eclipse, Atardeceres | [PolyHaven](https://polyhaven.com/hdris) (CC0). |
| **Sonidos profesionales** | Ka-chunk de diapositivas, máquina escribir, vinilo | [Freesound](https://freesound.org/) (filtrar CC0), [Pixabay](https://pixabay.com/sound-effects/). |
| **Animaciones Lottie** | Sparkles, fuegos, glitter, humo | [LottieFiles](https://lottiefiles.com/). |

> **Guardar todo en `public/assets/{tipo}/{slug-proyecto}/`** — versionar solo si pesa <500 KB; lo grande va a CDN o Supabase Storage.

---

## 6. Opcional — si decides migrar a react-three-fiber

```bash
npm i @react-three/fiber @react-three/drei
```

**Pros:** `useGLTF`, `Environment`, `OrbitControls`, `Text3D`, `Float`, `PresentationControls` listos.
**Contras:** rewrite de 7 plantillas existentes. **Recomendación: NO migrar, mantener vanilla `three`** salvo que arranques una plantilla completamente nueva muy compleja.

---

## 7. Skills de Claude — cuándo invocar cada una

| Skill | Cuándo (en este pipeline) |
|---|---|
| **`threejs-animation`** | Antes de codear: animaciones de keyframes, GLTF, morph targets, mixers. |
| **`webgpu-threejs-tsl`** | Boids masivos (Mariposas, Luciérnagas, Bandada V) — GPU compute con TSL. |
| **`emil-design-eng`** | Después de codear: pulido de micro-interacciones, easing, timing perfecto. |
| **`impeccable`** | Auditoría final de cada plantilla antes de marcar ✅. |
| **`ui-ux-pro-max`** | Definir paleta + type-pairing al diseñar `config.js` (theme options). |
| **`brainstorming`** | Si el concepto necesita refinarse antes de planear. |
| **`claude-mem:make-plan`** | Plan de fases por proyecto. |
| **`claude-mem:do`** | Ejecutar el plan con subagentes. |
| **`agent-browser`** | QA visual final — abrir dev server y probar en navegador real. |
| **`graphify`** | Si quieres ver el grafo de dependencias entre `_shared/` y plantillas. |

### MCP recomendado
- **`Context7`** — docs frescos de three.js, postprocessing, gsap. **Usar siempre** antes de implementar shaders/features no triviales.

---

## 8. Comando único para arrancar TODO

```bash
npm i @react-three/rapier postprocessing gsap tone howler @use-gesture/react three-mesh-bvh seedrandom framer-motion lottie-react lenis
```

Eso desbloquea **~60 de los 67 proyectos** sin tocar nada más. Los específicos (`lrc-kit`, `astronomy-engine`, `meyda`, etc.) se instalan SOLO cuando arrancas ese proyecto en particular.

---

## 9. Convenciones de import (mantener consistencia)

```js
// Three.js (vanilla)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Post-FX premium
import { EffectComposer, RenderPass, EffectPass, BloomEffect, ChromaticAberrationEffect } from 'postprocessing';

// Física
import { Physics, RigidBody } from '@react-three/rapier';  // solo en proyectos con física

// Animación
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Audio
import * as Tone from 'tone';
import { Howl } from 'howler';

// Gestos
import { useDrag, usePinch } from '@use-gesture/react';

// Shared helpers del proyecto
import { useTheme } from '../_shared/useTheme.js';
import { createBloomPipeline } from '../_shared/postFX.js';
import { createAudioReactive } from '../_shared/useAudioReactive.js';
import { mulberry32, hashString } from '../_shared/seededRandom.js';
```

---

## 10. Reglas de oro (no negociables)

1. **NO emojis en UI final** (regla del CLAUDE.md raíz). SVGs `currentColor` siempre.
2. **Todas las plantillas con tema** — paleta dinámica via `_shared/useTheme.js`, no hardcodear colores.
3. **Audio opcional** — `Howl` con `onloaderror` fallback, no romper si el user no sube música.
4. **Lazy load** — toda plantilla en `templateRegistry.jsx` con `React.lazy()`.
5. **Mobile-first** — probar con DevTools mobile antes de marcar ✅. Drag/touch obligatorio en proyectos interactivos.
6. **Bloom siempre** — usar `_shared/postFX.js` (preset). Hace que TODO se vea premium.
7. **Performance budget**: 60fps en mobile mid-range. Si baja, reducir `particleCount` o usar `InstancedMesh`.
8. **Determinismo** — siempre derivar randomness de `crypto.randomUUID()` del proyecto via `seedrandom` o `mulberry32`. Misma URL = misma escena.
