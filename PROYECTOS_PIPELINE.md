# PIPELINE — 67 Plantillas Espectaculares

> **Antes de tocar una plantilla del pipeline, lee siempre [DEPENDENCIAS_PROYECTOS.md](./DEPENDENCIAS_PROYECTOS.md) y este archivo.**
> Cuando termines un proyecto, edita la línea `**Estado:**` del proyecto correspondiente y reemplaza `⬜ Pendiente` por `✅ Creado (YYYY-MM-DD)`. Luego pasa al siguiente proyecto pendiente del orden recomendado.

---

## 0. Cómo usar este documento

### Leyenda de estado
| Símbolo | Significado |
|---|---|
| ⬜ Pendiente | Aún no se ha empezado. |
| 🚧 En progreso (YYYY-MM-DD) | Iniciado, no terminado. |
| ✅ Creado (YYYY-MM-DD) | Funciona, registrado en `templateRegistry.jsx`, cumple Definition of Done. |
| 🔒 Bloqueado: razón | Necesita asset, librería, decisión del owner. |

### Cómo marcar un proyecto como ✅
Cada bloque tiene EXACTAMENTE una línea `**Estado:** ⬜ Pendiente`. Edítala con la fecha real:

```
**Estado:** ✅ Creado (2026-05-20)
```

### Definition of Done (checklist obligatoria por proyecto)

Un proyecto NO está ✅ hasta que:
- [ ] `src/templates/{slug}/index.jsx` exporta default + recibe `{ data, isPreview }`.
- [ ] `src/templates/{slug}/config.js` exporta el config con `id`, `name`, `fields[]`.
- [ ] Registrado en `src/lib/templateRegistry.jsx` (lazy import + entry en `TEMPLATE_REGISTRY`).
- [ ] Agregado al catálogo en `src/lib/templates.js` (para que aparezca en Home).
- [ ] Funciona en `/template/{id}` (Preview).
- [ ] Funciona en `/view/{id}` (ViewGift).
- [ ] 60 fps estable en mobile mid-range (Chrome DevTools throttle "Mid-tier mobile").
- [ ] Bloom o post-FX aplicado (usar `_shared/postFX.js`).
- [ ] Paleta dinámica vía `_shared/useTheme.js` (mínimo 3 temas).
- [ ] Audio opcional con fallback si no se sube música.
- [ ] CERO emojis (ni en código, ni en UI).
- [ ] SVGs con `fill="currentColor"` para herencia de tema.
- [ ] Cumple las "Reglas de oro" §10 de DEPENDENCIAS_PROYECTOS.md.

---

## 1. Quick-Index (los 67 proyectos)

### Parejas (concepto fuerte)
- [01. Constelación de Nosotros](#01-constelación-de-nosotros--constelacion-nosotros)
- [02. Vinilo Eterno](#02-vinilo-eterno--vinilo-eterno)
- [03. Hilo Rojo del Destino](#03-hilo-rojo-del-destino--hilo-rojo)
- [04. Globo Aerostático](#04-globo-aerostático--globo-aerostatico)

### Ex / Reconquista / Extrañar
- [05. Mensaje en Botella](#05-mensaje-en-botella--mensaje-botella)
- [06. Espejo del Tiempo](#06-espejo-del-tiempo--espejo-tiempo)
- [07. Cápsula del Tiempo](#07-cápsula-del-tiempo--capsula-tiempo)
- [08. Carta Manuscrita](#08-carta-manuscrita--carta-manuscrita)

### Amistades
- [09. Cabina de Fotos](#09-cabina-de-fotos--cabina-fotos)
- [10. Tienda de Recuerdos / Boutique Mágica](#10-tienda-de-recuerdos--boutique-magica)
- [11. Cofre del Tesoro](#11-cofre-del-tesoro--cofre-tesoro)
- [12. Cinta de Casete — Mixtape Eterno](#12-cinta-de-casete--mixtape-eterno)

### Familia
- [13. Habitación de tu Niñez](#13-habitación-de-tu-niñez--habitacion-ninez)
- [14. Mariposas — Migración del Corazón](#14-mariposas--migracion-corazon)
- [15. Origami — Grullas de Mil Recuerdos](#15-origami--grullas-mil)

### Artista favorito
- [16. Ciudad Neón (The Weeknd)](#16-ciudad-neon--ciudad-neon)
- [17. Karaoke LED Sincronizado](#17-karaoke-led--karaoke-led)
- [18. Concierto Privado](#18-concierto-privado--concierto-privado)

### Únicos / Experimentales
- [19. Planeta Personal (Principito)](#19-planeta-personal--planeta-personal)
- [20. Reloj de Arena](#20-reloj-de-arena--reloj-arena)

### Atmosféricas / Cielo
- [21. Aurora Boreal](#21-aurora-boreal--aurora-boreal)
- [22. Lluvia de Perseidas](#22-lluvia-de-perseidas--perseidas)
- [23. Eclipse Total](#23-eclipse-total--eclipse-total)
- [24. Tormenta Eléctrica](#24-tormenta-electrica--tormenta-electrica)
- [25. Bosque de Luciérnagas](#25-bosque-de-luciernagas--bosque-luciernagas)
- [26. Tornado de Pétalos de Cerezo](#26-tornado-de-petalos--tornado-petalos)
- [27. Globo de Nieve Gigante](#27-globo-de-nieve--globo-nieve)
- [28. Linternas Chinas Voladoras](#28-linternas-chinas--linternas-chinas)

### Místicas / Esotéricas
- [29. Tarot del Amor](#29-tarot-del-amor--tarot-amor)
- [30. Bola de Cristal](#30-bola-de-cristal--bola-cristal)
- [31. Pociones / Boticario](#31-pociones--boticario)
- [32. Carta Astral](#32-carta-astral--carta-astral)
- [33. Mandala Generativo](#33-mandala-generativo--mandala-generativo)
- [34. Lámpara Mágica — Genio](#34-lampara-magica--lampara-genio)

### Retro / Nostalgia
- [35. Sala de Cine Antigua](#35-sala-de-cine-antigua--cine-antiguo)
- [36. Cabina Telefónica](#36-cabina-telefonica--cabina-telefonica)
- [37. TV CRT — Zappear Canales](#37-tv-crt--tv-crt)
- [38. Diapositivas Kodak](#38-diapositivas-kodak--diapositivas-kodak)
- [39. Máquina de Escribir](#39-maquina-de-escribir--maquina-escribir)
- [40. Cassette VHS](#40-cassette-vhs--cassette-vhs)
- [41. Game Boy](#41-game-boy--game-boy)
- [42. Drive-In Autocine](#42-drive-in-autocine--drive-in)

### Cinéticos / Surreales
- [43. Carrusel de Feria](#43-carrusel-de-feria--carrusel-feria)
- [44. Rueda de la Fortuna](#44-rueda-de-la-fortuna--rueda-fortuna)
- [45. Caleidoscopio Infinito](#45-caleidoscopio--caleidoscopio)
- [46. Habitación de Espejos](#46-habitación-de-espejos--habitacion-espejos)
- [47. Vitral de Catedral](#47-vitral-de-catedral--vitral-catedral)
- [48. Máquina Steampunk Rube Goldberg](#48-maquina-steampunk--steampunk)
- [49. Reloj Cucú](#49-reloj-cucu--reloj-cucu)

### Lugares icónicos
- [50. París Bajo la Lluvia](#50-paris-bajo-la-lluvia--paris-lluvia)
- [51. Venecia — Paseo en Góndola](#51-venecia-gondola--venecia-gondola)
- [52. Santorini Atardecer](#52-santorini-atardecer--santorini)
- [53. Shibuya Tokio](#53-shibuya-tokio--shibuya)

### Emocionales profundas
- [54. Ofrenda Día de Muertos](#54-ofrenda-dia-de-muertos--dia-muertos)
- [55. Linternas al Mar (Coco)](#55-linternas-al-mar--linternas-mar)
- [56. Carta al Yo del Futuro](#56-carta-yo-futuro--carta-yo-futuro)

### Geek / Fandom
- [57. Casa Voladora (Pixar UP)](#57-casa-voladora-up--casa-up)
- [58. Tren Ghibli](#58-tren-ghibli--tren-ghibli)
- [59. Upside Down (Stranger Things)](#59-upside-down--upside-down)

### Únicos / Impactantes
- [60. Acuario Abisal](#60-acuario-abisal--acuario-abisal)
- [61. Pez Koi en Estanque](#61-pez-koi--pez-koi)
- [62. Bandada de Pájaros V](#62-bandada-pajaros-v--bandada-v)
- [63. Rompecabezas Armable](#63-rompecabezas--rompecabezas)
- [64. Escape Room Romántico](#64-escape-room--escape-room)
- [65. Pastel de Cumpleaños 3D](#65-pastel-cumpleanos--pastel-cumple)
- [66. Caja de Bombones Premium](#66-caja-de-bombones--caja-bombones)
- [67. Champagne Dorada](#67-champagne-dorada--champagne)

---

## 2. Orden recomendado de construcción (compounding)

Construye en este orden para maximizar reuso. Cada bloque deja utilities que los siguientes aprovechan.

### Bloque 0 — Infraestructura (HACER PRIMERO, antes que cualquier plantilla)
Crear `src/templates/_shared/` con los helpers de la §3. ~1 día de trabajo. Ahorra ~30% en cada plantilla siguiente.

### Bloque 1 — Foundations (proyectos que generan más utilities)
1. **#29 Tarot** → genera flip-card 3D + drag de cartas (reuso en 4 proyectos).
2. **#01 Constelación** → genera point-connector + canvas exportable (reuso en 6).
3. **#21 Aurora Boreal** → genera volumetric shader base (reuso en 6).
4. **#02 Vinilo** → genera audio-reactive + waveform (reuso en 5).
5. **#17 Karaoke LED** → genera LRC parser + dot-matrix display (reuso en 3).

### Bloque 2 — Alto impacto / viralidad
6. **#54 Ofrenda Día de Muertos** (nicho enorme sin competencia).
7. **#18 Concierto Privado** (épico bestial).
8. **#16 Ciudad Neón Weeknd** (fandoms).
9. **#36 Cabina Telefónica** (emocional reconquista).
10. **#07 Cápsula del Tiempo** (mecánica única de countdown).

### Bloque 3 — Resto, en cualquier orden que tu energía dicte
Prioriza por tu propio criterio: dificultad técnica vs. demanda comercial vs. apetito creativo.

---

## 3. Bloque 0 — Shared Helpers (✅ COMPLETADO 2026-05-18)

**Estado:** ✅ Creado (2026-05-18)

Carpeta: `src/templates/_shared/` — 13 helpers creados + npm packages instalados

### `useTheme.js`
Sistema de paletas dinámicas. Cada plantilla define sus temas, este hook resuelve `data.tema → { colors, fonts, fx }`.
```js
export function useTheme(themeName, themesMap) {
  return themesMap[themeName] ?? themesMap[Object.keys(themesMap)[0]];
}
```

### `postFX.js`
Factory para EffectComposer con Bloom + ChromaticAberration + Vignette preconfigurados con la paleta del tema.
```js
export function createBloomPipeline(renderer, scene, camera, { strength=1.5, radius=0.4, threshold=0.85 } = {}) { ... }
```
Usa `postprocessing` (no `three/addons`). Reutilizable en 90% de los proyectos.

### `useAudioReactive.js`
Wrapper sobre Web Audio API + Meyda. Expone `{ bass, mid, treble, rms, beat }` reactivos a 60fps.
```js
export function useAudioReactive(audioElement, { bands = ['bass','mid','treble','rms'] } = {}) { ... }
```

### `particles.js`
Helpers para InstancedMesh: `createStarField(count)`, `createPetalField(count)`, `createFireflies(count)`.

### `seededRandom.js`
Export formal de `mulberry32(seed)`, `hashString(str)`, `shuffle(arr, rand)`. Mover del `useArbol.js` actual.

### `cinematicCamera.js`
`easings`, `lerpVec3`, `cameraTo(camera, target, lookAt, duration, ease)`. Cámara cinemática con tweens GSAP.

### `floatingPhoto.jsx`
Componente `<FloatingPhoto src position rotation size />` que crea un PlaneGeometry con textura `THREE.TextureLoader` y opcional borde tipo polaroid.

### `textTexture.js`
`createTextTexture(text, { font, color, size, padding })` → `THREE.CanvasTexture`. Para labels flotantes, letreros, mensajes 3D.

### `gltfLoader.js`
Wrapper sobre `GLTFLoader` con DRACO + KTX2 + cache. Una sola instancia, retorna Promise.

### `AudioPlayer.jsx`
Componente universal Howl-based. Auto-fade in/out, controles ocultables, iOS unlock automático.

### `useUnlockTime.jsx` *(específico para #07 Cápsula)*
Hook que lee `unlock_at` de Supabase, retorna `{ isUnlocked, secondsLeft }`.

> **Nota:** el helper más alto-ROI es `postFX.js`. Si solo creas uno, que sea ese.

---

## 4. Tabla de estado (resumen rápido)

| # | Slug | Estado | Categoría | Dif |
|---|---|---|---|---|
| 00 | _shared | ✅ | Helpers | — |
| 01 | constelacion-nosotros | ✅ | Pareja | ★★★☆☆ |
| 02 | vinilo-eterno | ⬜ | Pareja | ★★★★☆ |
| 03 | hilo-rojo | ⬜ | Pareja | ★★★☆☆ |
| 04 | globo-aerostatico | ⬜ | Pareja | ★★★★☆ |
| 05 | mensaje-botella | ⬜ | Ex | ★★★★☆ |
| 06 | espejo-tiempo | ⬜ | Ex | ★★★☆☆ |
| 07 | capsula-tiempo | ⬜ | Ex/Espera | ★★★★☆ |
| 08 | carta-manuscrita | ⬜ | Ex/Formal | ★★☆☆☆ |
| 09 | cabina-fotos | ⬜ | Amistad | ★★☆☆☆ |
| 10 | boutique-magica | ⬜ | Amistad | ★★★★☆ |
| 11 | cofre-tesoro | ⬜ | Amistad | ★★★★☆ |
| 12 | mixtape-eterno | ⬜ | Amistad | ★★★★☆ |
| 13 | habitacion-ninez | ⬜ | Familia | ★★★★★ |
| 14 | mariposas-corazon | ⬜ | Familia | ★★★★☆ |
| 15 | grullas-mil | ⬜ | Familia | ★★★★☆ |
| 16 | ciudad-neon | ⬜ | Artista | ★★★★★ |
| 17 | karaoke-led | ⬜ | Artista | ★★★☆☆ |
| 18 | concierto-privado | ⬜ | Artista | ★★★★★ |
| 19 | planeta-personal | ⬜ | Único | ★★★★☆ |
| 20 | reloj-arena | ⬜ | Único | ★★★★☆ |
| 21 | aurora-boreal | ⬜ | Cielo | ★★★★☆ |
| 22 | perseidas | ⬜ | Cielo | ★★★☆☆ |
| 23 | eclipse-total | ⬜ | Cielo | ★★★★☆ |
| 24 | tormenta-electrica | ⬜ | Cielo | ★★★★☆ |
| 25 | bosque-luciernagas | ⬜ | Naturaleza | ★★★★☆ |
| 26 | tornado-petalos | ⬜ | Naturaleza | ★★★★☆ |
| 27 | globo-nieve | ⬜ | Surreal | ★★★★☆ |
| 28 | linternas-chinas | ⬜ | Cielo | ★★★★☆ |
| 29 | tarot-amor | ⬜ | Místico | ★★★☆☆ |
| 30 | bola-cristal | ⬜ | Místico | ★★★☆☆ |
| 31 | pociones-boticario | ⬜ | Místico | ★★★★☆ |
| 32 | carta-astral | ⬜ | Místico | ★★★☆☆ |
| 33 | mandala-generativo | ⬜ | Místico | ★★★★☆ |
| 34 | lampara-genio | ⬜ | Místico | ★★★★☆ |
| 35 | cine-antiguo | ⬜ | Retro | ★★★☆☆ |
| 36 | cabina-telefonica | ⬜ | Retro | ★★★★☆ |
| 37 | tv-crt | ⬜ | Retro | ★★★☆☆ |
| 38 | diapositivas-kodak | ⬜ | Retro | ★★☆☆☆ |
| 39 | maquina-escribir | ⬜ | Retro | ★★☆☆☆ |
| 40 | cassette-vhs | ⬜ | Retro | ★★★☆☆ |
| 41 | game-boy | ⬜ | Retro | ★★★★☆ |
| 42 | drive-in | ⬜ | Retro | ★★★☆☆ |
| 43 | carrusel-feria | ⬜ | Cinético | ★★★★☆ |
| 44 | rueda-fortuna | ⬜ | Cinético | ★★★★☆ |
| 45 | caleidoscopio | ⬜ | Surreal | ★★★☆☆ |
| 46 | habitacion-espejos | ⬜ | Surreal | ★★★★☆ |
| 47 | vitral-catedral | ⬜ | Surreal | ★★★★☆ |
| 48 | steampunk-goldberg | ⬜ | Cinético | ★★★★★ |
| 49 | reloj-cucu | ⬜ | Cinético | ★★★☆☆ |
| 50 | paris-lluvia | ⬜ | Lugar | ★★★★☆ |
| 51 | venecia-gondola | ⬜ | Lugar | ★★★★☆ |
| 52 | santorini | ⬜ | Lugar | ★★★☆☆ |
| 53 | shibuya | ⬜ | Lugar | ★★★★☆ |
| 54 | dia-muertos | ⬜ | Tributo | ★★★★☆ |
| 55 | linternas-mar | ⬜ | Tributo | ★★★★☆ |
| 56 | carta-yo-futuro | ⬜ | Auto | ★★★☆☆ |
| 57 | casa-up | ⬜ | Geek | ★★★★☆ |
| 58 | tren-ghibli | ⬜ | Geek | ★★★★☆ |
| 59 | upside-down | ⬜ | Geek | ★★★☆☆ |
| 60 | acuario-abisal | ⬜ | Único | ★★★★★ |
| 61 | pez-koi | ⬜ | Naturaleza | ★★★☆☆ |
| 62 | bandada-v | ⬜ | Naturaleza | ★★★★☆ |
| 63 | rompecabezas | ⬜ | Interactivo | ★★★☆☆ |
| 64 | escape-room | ⬜ | Interactivo | ★★★★★ |
| 65 | pastel-cumple | ⬜ | Celebración | ★★★★☆ |
| 66 | caja-bombones | ⬜ | Celebración | ★★★☆☆ |
| 67 | champagne | ⬜ | Celebración | ★★★☆☆ |

> Mantener esta tabla sincronizada con cada cambio de `**Estado:**` en la sección detallada.

---

# 5. Proyectos detallados

---

### 01. Constelación de Nosotros — `constelacion-nosotros`
**Estado:** ✅ Creado (2026-05-18) · **Categoría:** Pareja · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Nuestra historia escrita en las estrellas — oficial, registrable, descargable."
**Hook visual:** Cielo nocturno 3D. El usuario sube fotos+fechas, cada una es una estrella. Al unir los puntos (drag entre estrellas) se forma la constelación con el nombre de la pareja. Pergamino de "registro estelar" descargable como PNG.
**Tech:** Three.js + GSAP + canvas 2D para el pergamino final.
**Librerías nuevas:** ninguna (usa stack base + gsap).
**Reutiliza:** `_shared/postFX.js` (Bloom), `_shared/seededRandom.js`, `_shared/textTexture.js` (nombres de fecha en cada estrella), patrón estelar de `galaxia-momentos/useGalaxy.js`.
**Config fields:** `nombre_constelacion`, `pareja_a`, `pareja_b`, `fotos[8]` (con fecha por foto: usar tipo `file` + textarea de fechas), `tema` (cosmos/romantica/dorada), `musica`.
**Archivos:**
- `src/templates/constelacion-nosotros/index.jsx`
- `src/templates/constelacion-nosotros/config.js`
- `src/templates/constelacion-nosotros/useConstelacion.js`
- `src/templates/constelacion-nosotros/PergaminoExport.jsx`
- `src/templates/constelacion-nosotros/style.css`
**Pasos clave:**
1. Setup escena Three.js con starfield denso (60k estrellas low-cost via Points).
2. 8 estrellas "principales" más grandes con sprite glow + texture de la foto pequeña (popover on hover).
3. Línea trazadora animada que aparece progresivamente conectando estrellas en secuencia (GSAP stroke-dashoffset).
4. Tipografía cursiva flotante en el cielo: nombre de la constelación (Three.js Text + Cinzel).
5. Botón "Descargar Registro Estelar" → renderiza un canvas con pergamino + posiciones de estrellas + nombres + firma timestamp + QR del link.
6. Music sync: la línea entre estrellas se acelera/desacelera con el RMS del audio.
**Pulido espectacular:**
- Cometa cruza la pantalla cada ~15s con trail brillante.
- Cuando hover sobre estrella: pulso ondular + texto con la fecha aparece.
- Easter egg: si las fechas suman X años, aparece "Aniversario X" en oro al final.

---

### 02. Vinilo Eterno — `vinilo-eterno`
**Estado:** ⬜ Pendiente · **Categoría:** Pareja · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Nuestra canción gira para siempre."
**Hook visual:** Disco de vinilo 3D girando a 33⅓ RPM. La aguja recorre surcos y cada surco "raspa" para revelar un mensaje manuscrito. El waveform real de la canción subida se proyecta como surcos del vinilo. Portada A+B intercambiable.
**Tech:** Three.js (vinilo + tornamesa) + Tone.js (BPM detect opcional) + Meyda (FFT) + GSAP.
**Librerías nuevas:** `tone`, `meyda`, `gsap`, `@use-gesture/react` (girar manual).
**Reutiliza:** `_shared/useAudioReactive.js`, `_shared/floatingPhoto.jsx` (portada), `_shared/postFX.js`.
**Config fields:** `titulo_album`, `artista` (default = nombre de la pareja), `año`, `cancion_audio` (file), `portada_foto` (file), `mensajes_surcos[5]` (textarea por surco), `tema` (vintage70s, neón80s, jazz, classic), `firma_etiqueta`.
**Archivos:**
- `src/templates/vinilo-eterno/index.jsx`
- `src/templates/vinilo-eterno/config.js`
- `src/templates/vinilo-eterno/useVinilo.js`
- `src/templates/vinilo-eterno/Aguja.jsx`
- `src/templates/vinilo-eterno/style.css`
**Pasos clave:**
1. Disco con DiscGeometry custom (RingGeometry + texturas concentricas, etiqueta central con la portada).
2. Aguja Three.js que se mueve por curva Catmull-Rom desde borde a centro durante la canción.
3. Audio reactivo: surcos vibran sutilmente con el bass (vertex shader displacement).
4. Cuando la aguja cruza un "mensaje", aparece flotante en el aire en handwriting font (Dancing Script).
5. Controles: drag para mover la aguja manualmente (skip a tu mensaje favorito).
6. Lado A/B: doble-tap o botón "Flip" → vinilo se voltea con animación 3D.
**Pulido espectacular:**
- Polvo flotante alrededor con luz volumétrica.
- Crepitar de vinilo (sample real Freesound) loop bajo la canción.
- Etiqueta central tipo Motown/Studio One según tema.

---

### 03. Hilo Rojo del Destino — `hilo-rojo`
**Estado:** ⬜ Pendiente · **Categoría:** Pareja · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Estábamos destinados a encontrarnos."
**Hook visual:** Mapa mundial 2D estilo grabado japonés sumi-e. Hilo rojo animado que serpentea conectando todos los lugares importantes (se conocieron, primer viaje, primer "te amo"). En cada nodo: polaroid + audio nota corta. Leyenda con tinta china al final.
**Tech:** MapLibre (mapa custom style monocromo) + Three.js para el hilo 3D sobre el mapa + GSAP.
**Librerías nuevas:** ninguna (reutiliza stack de `vuelo-global`).
**Reutiliza:** `vuelo-global/CitySearch.jsx`, `vuelo-global/useMapAnimation.js`, `_shared/AudioPlayer.jsx`.
**Config fields:** `ciudades[]` con `{city, lat, lng, fecha, foto, audio_nota}` (mínimo 2, máximo 8), `tema` (sumi-e, ukiyo-e, tinta-roja, washi-papel), `mensaje_final`.
**Archivos:**
- `src/templates/hilo-rojo/index.jsx`
- `src/templates/hilo-rojo/config.js`
- `src/templates/hilo-rojo/useHilo.js`
- `src/templates/hilo-rojo/Polaroid.jsx`
- `src/templates/hilo-rojo/style.css`
**Pasos clave:**
1. MapLibre con style monocromo (carto-positron simplificado o custom JSON).
2. Línea roja animada con `line-dasharray` que se "dibuja" punto a punto al hacer scroll.
3. Markers polaroid: foto con borde blanco, ligera rotación aleatoria, sombra suave.
4. Click en polaroid: zoom y reveal del audio note + fecha + ciudad en kanji + romaji.
5. Al llegar al último punto, leyenda final manuscrita con pincel (SVG stroke animation).
6. Pétalos de sakura caen sutiles sobre el mapa.
**Pulido espectacular:**
- Sello hanko rojo final con las iniciales de la pareja.
- Compass rose ornamental en una esquina (SVG con tinta).
- Music: shakuhachi loop opcional.

---

### 04. Globo Aerostático — `globo-aerostatico`
**Estado:** ⬜ Pendiente · **Categoría:** Pareja · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Subir juntos hasta tocar el cielo."
**Hook visual:** Globo aerostático 3D que asciende lentamente sobre un paisaje procedural. A cada altitud (medida en metros) aparecen fotos flotando en las nubes. Iluminación cambia: amanecer → mediodía → atardecer → noche estrellada.
**Tech:** Three.js + Lenis (scroll cinemático) + skybox shader custom.
**Librerías nuevas:** `lenis`, `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`, `_shared/cinematicCamera.js`, `_shared/useTheme.js`.
**Config fields:** `titulo` (default "Nuestro Viaje"), `para`, `mensaje`, `fotos[8]`, `tema` (amanecer-pastel, atardecer-fuego, cielo-nocturno, primavera-suave), `musica`.
**Archivos:**
- `src/templates/globo-aerostatico/index.jsx`
- `src/templates/globo-aerostatico/config.js`
- `src/templates/globo-aerostatico/useGlobo.js`
- `src/templates/globo-aerostatico/Skybox.jsx`
- `src/templates/globo-aerostatico/style.css`
**Pasos clave:**
1. Escena 3D con globo modelado (SphereGeometry con franjas + cesta low-poly).
2. Paisaje fractal abajo (montañas procedurales + mar) — instanciado, no realista pero estilizado.
3. Scroll-driven camera con Lenis: bajar scroll = subir el globo + cámara FollowUp.
4. Nubes (Sprites con texture noise + alpha) en cada "altitud" cargan una foto cuando atraviesas.
5. Skybox shader interpola entre 4 paletas de cielo (amanecer→noche) según altitud.
6. Mensaje final al alcanzar la estratósfera: foto principal + texto en cursiva.
**Pulido espectacular:**
- Llamarada del quemador del globo al subir (sprite fuego + audio).
- Pájaros volando en formación a media altura.
- Estrella fugaz cuando alcanzas el cielo nocturno.

---

### 05. Mensaje en Botella — `mensaje-botella`
**Estado:** ⬜ Pendiente · **Categoría:** Ex/Reconquista · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Mi mensaje cruzó el océano hasta llegar a ti."
**Hook visual:** Playa 3D al atardecer con olas Gerstner reales. Una botella de cristal llega con la marea. Al hacer click se abre, sale pergamino enrollado con mensaje + fotos. Espuma + sal + viento ambiente.
**Tech:** Three.js + custom water shader (Gerstner waves) + post-FX (DOF, color grade).
**Librerías nuevas:** `postprocessing`, `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`, `_shared/useTheme.js`.
**Config fields:** `de`, `para`, `mensaje` (textarea largo, hasta 1000 chars), `fotos[4]`, `tema` (atardecer-rojo, alba-rosa, mediodia-cristal, tormenta-melancolia), `musica`.
**Archivos:**
- `src/templates/mensaje-botella/index.jsx`
- `src/templates/mensaje-botella/config.js`
- `src/templates/mensaje-botella/useOceano.js`
- `src/templates/mensaje-botella/Pergamino.jsx`
- `src/templates/mensaje-botella/style.css`
**Pasos clave:**
1. Plano de océano con Gerstner wave vertex shader (3 olas superpuestas + foam shader fragment).
2. Cielo HDR (`PolyHaven`) según tema.
3. Botella GLB con material `MeshPhysicalMaterial` (transmission, roughness, ior 1.5).
4. Animación: botella aparece lejos, flota acercándose con bobbing realista (sigue altura de las olas).
5. Click → cámara dolly-in + botella abierta + corcho saltando + pergamino emergiendo.
6. Pergamino con texto handwriting (SVG path animation tipo `stroke-dashoffset`).
**Pulido espectacular:**
- Gaviotas en silueta cruzando el atardecer.
- Reflejos del sol en el agua (specular shader).
- Audio ambient: olas + viento + gaviotas.

---

### 06. Espejo del Tiempo — `espejo-tiempo`
**Estado:** ⬜ Pendiente · **Categoría:** Ex/Nostalgia · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Lo que fuimos sigue ahí, esperando."
**Hook visual:** Marco antiguo de espejo barroco. La superficie es agua líquida (ripple shader). Al tocarla, se ondula, "atraviesas" el espejo y entras a un pasillo infinito con fotos colgantes que oscilan suavemente. Polvo dorado flotante.
**Tech:** Three.js + ripple shader fragment + parallax 3D + post-FX vignette.
**Librerías nuevas:** `postprocessing`, `@use-gesture/react`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`, `_shared/cinematicCamera.js`.
**Config fields:** `mensaje_principal`, `fotos[8]`, `tema` (oro-antiguo, plata-bruñida, cobre-victoriano, madera-oscura), `musica`.
**Archivos:**
- `src/templates/espejo-tiempo/index.jsx`
- `src/templates/espejo-tiempo/config.js`
- `src/templates/espejo-tiempo/useEspejo.js`
- `src/templates/espejo-tiempo/Pasillo.jsx`
- `src/templates/espejo-tiempo/style.css`
**Pasos clave:**
1. Marco GLB ornamental (Sketchfab CC0). Material gold/silver según tema.
2. Superficie: PlaneGeometry con ripple fragment shader (3 capas de senoidales + normal map dinámico).
3. Click → animación de "submersión": cámara atraviesa el agua con distortion shader.
4. Pasillo: 3 paredes de fotos colgadas con cadenas SVG (animación de balanceo sutil con seno).
5. Niebla volumétrica + polvo dorado (Sprites con additive blending).
6. Foto al final del pasillo = la principal + mensaje.
**Pulido espectacular:**
- Audio: agua + susurro ambiental + tic-tac de reloj muy lejano.
- Reflejos parciales del usuario antes de atravesar (vapor).
- Easter egg: si stays >30s sin click, una foto se acerca sola como invitación.

---

### 07. Cápsula del Tiempo — `capsula-tiempo`
**Estado:** ⬜ Pendiente · **Categoría:** Espera/Futuro · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Algunos regalos valen la pena esperar."
**Hook visual:** El destinatario recibe link. Ve una cápsula 3D enterrada con countdown REAL (días/horas/minutos). Cuando se cumple la fecha: tierra removiéndose, cápsula emergiendo, apertura con luz dorada, contenido revelado.
**Tech:** Three.js + Supabase nueva columna `unlock_at TIMESTAMP` + Edge Function que valida el unlock server-side.
**Librerías nuevas:** ninguna.
**Reutiliza:** `_shared/postFX.js`, `_shared/useUnlockTime.jsx` (helper específico nuevo).
**Config fields:** `de`, `para`, `fecha_apertura` (date input, mínimo +1 día, máximo +5 años), `mensaje`, `fotos[8]`, `tema` (cápsula-bronce, cápsula-cristal, cofre-madera, ovni-futurista), `musica`.
**Archivos:**
- `src/templates/capsula-tiempo/index.jsx`
- `src/templates/capsula-tiempo/config.js`
- `src/templates/capsula-tiempo/useCapsula.js`
- `src/templates/capsula-tiempo/CountdownScene.jsx`
- `src/templates/capsula-tiempo/OpeningScene.jsx`
- `src/templates/capsula-tiempo/style.css`
**Backend:**
- Migration Supabase: `ALTER TABLE proyectos_creados ADD COLUMN unlock_at TIMESTAMPTZ;`
- Edge Function `get-project` que verifica `now() >= unlock_at` antes de retornar `user_data`. Hasta entonces solo retorna el countdown + tema (sin spoilers).
**Pasos clave:**
1. Pre-unlock: escena con cápsula enterrada parcialmente, particles de tierra/polvo, countdown gigante flotante.
2. Reloj de arena flotando junto a la cápsula como decoración.
3. Post-unlock: animación 3-fase: tierra temblando → cápsula emergiendo → apertura con flash blanco → contenido (fotos + mensaje).
4. Cada foto sale en secuencia con GSAP timeline.
5. Compartir: el creador recibe email del sistema cuando se desbloquea.
**Pulido espectacular:**
- Sonido de countdown sutil (clic mecánico cada segundo en últimas 10).
- Antes de unlock: si el receptor intenta inspeccionar, mensaje "El tiempo no se acelera por curiosidad".
- Post-apertura: opción "guardar como capsula permanente" → genera PDF descargable.

---

### 08. Carta Manuscrita — `carta-manuscrita`
**Estado:** ⬜ Pendiente · **Categoría:** Formal/Reconquista · **Dificultad:** ★★☆☆☆
**Objetivo emocional:** "Para escribir como antes — con tiempo, intención y tinta."
**Hook visual:** Pergamino vintage con sello de cera estampado. El usuario rompe el sello, el pergamino se desenrolla, y la tinta aparece trazo a trazo como si una mano invisible escribiera. Pétalos de rosa caen sutil al final.
**Tech:** SVG path animation (stroke-dashoffset) + GSAP + canvas confetti (pétalos).
**Librerías nuevas:** `gsap` (si no instalado), `canvas-confetti` (ya instalada).
**Reutiliza:** `canvas-confetti` (ya), tipografías Dancing Script / Pacifico.
**Config fields:** `de`, `para`, `mensaje` (textarea hasta 1500 chars), `iniciales_sello` (max 3 chars), `tema` (carta-clásica, carta-amor, carta-formal, parchemin-antiguo), `musica`.
**Archivos:**
- `src/templates/carta-manuscrita/index.jsx`
- `src/templates/carta-manuscrita/config.js`
- `src/templates/carta-manuscrita/Pergamino.jsx`
- `src/templates/carta-manuscrita/SelloCera.jsx`
- `src/templates/carta-manuscrita/style.css`
**Pasos clave:**
1. Vista inicial: pergamino enrollado con sello de cera (SVG ornamental con iniciales).
2. Click en sello: crack animation (scale + opacity en 3 fragmentos SVG) + sonido (roce).
3. Pergamino se desenrolla: clip-path animado + sombra siguiendo el borde.
4. Texto manuscrito: dividir en palabras → cada palabra es SVG path con stroke animation, secuencial con delay.
5. Al terminar: pétalos de rosa caen con `canvas-confetti` custom shape.
6. Música opcional con fade-in mientras se escribe.
**Pulido espectacular:**
- Salpicaduras sutiles de tinta al inicio de cada párrafo.
- Sello con relieve via SVG filter (drop-shadow + bevel).
- Audio: pluma escribiendo (sample sutil bajo el texto).

---

### 09. Cabina de Fotos — `cabina-fotos`
**Estado:** ⬜ Pendiente · **Categoría:** Amistad · **Dificultad:** ★★☆☆☆
**Objetivo emocional:** "Esa foto absurda que tomamos hace años — sigue siendo la mejor."
**Hook visual:** Cabina antigua de photobooth en una esquina. Sale la tira vertical de 4 fotos imprimiéndose en tiempo real con sonido de impresora térmica. Tira impresa cae al porta-papel con ruido. Borde con beso de labial y mensaje a mano.
**Tech:** CSS 3D + GSAP + Howler (sample impresora).
**Librerías nuevas:** `howler`, `gsap`.
**Reutiliza:** `_shared/AudioPlayer.jsx`.
**Config fields:** `nombres_amigos[2-4]`, `fotos[4]` (idealmente 4 para tira clásica), `mensaje_borde`, `firma_labial` (toggle si/no), `tema` (clasico-bn, color-90s, vintage-sepia, retro-pop), `musica`.
**Archivos:**
- `src/templates/cabina-fotos/index.jsx`
- `src/templates/cabina-fotos/config.js`
- `src/templates/cabina-fotos/Cabina.jsx`
- `src/templates/cabina-fotos/Tira.jsx`
- `src/templates/cabina-fotos/style.css`
**Pasos clave:**
1. Cabina ilustrada (SVG/CSS) en background. Cortina roja entreabierta.
2. Botón "Empezar" → cuenta regresiva en pantalla LED de la cabina (3, 2, 1 + flash blanco x4).
3. Tira impresa: SVG con 4 huecos donde van fotos. Animación de "salir" desde una ranura inferior con sonido térmico.
4. Cada foto aparece progresivamente con efecto de revelado (saturación 0→100% + flash).
5. Borde inferior con mensaje cursive y huella de labial roja (SVG).
6. Final: tira se queda flotando, descargable como PNG.
**Pulido espectacular:**
- Filtro vintage (grain + chromatic shift) sobre cada foto.
- Audio: clic de cámara + zumbido cabina + ding "listo".
- Si firma_labial: animación de "estampado" del labial con pequeño tirón.

---

### 10. Tienda de Recuerdos — Boutique Mágica — `boutique-magica`
**Estado:** ⬜ Pendiente · **Categoría:** Amistad · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Cada recuerdo embotellado como un hechizo."
**Hook visual:** Tienda 3D estilo Diagon Alley / Howl's. Estanterías de madera con frascos de cristal brillantes flotando ligeramente. Cada frasco contiene un recuerdo (foto + audio note). El usuario los baja, los destapa, sale humo dorado.
**Tech:** Three.js + GLB de estantería + emissive materials + post-FX bloom intenso.
**Librerías nuevas:** `@react-three/rapier` (los frascos rebotan al destaparlos), `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`, `_shared/gltfLoader.js`, `_shared/AudioPlayer.jsx`.
**Config fields:** `nombre_tienda`, `frascos[8]` con `{etiqueta, foto, audio_nota}`, `tema` (alquimista-dorado, botica-verde, magia-azul, ámbar-rojo), `musica`.
**Archivos:**
- `src/templates/boutique-magica/index.jsx`
- `src/templates/boutique-magica/config.js`
- `src/templates/boutique-magica/useBoutique.js`
- `src/templates/boutique-magica/Frasco.jsx`
- `src/templates/boutique-magica/style.css`
**Pasos clave:**
1. Modelo tienda GLB low-poly. Iluminación cálida ambient + spotlights por estante.
2. Frascos: InstancedMesh + emissive interior con LightHelper. Cada uno con SpriteCanvasTexture de la etiqueta manuscrita.
3. Click en frasco: levita hacia la cámara, gira mostrando etiqueta.
4. Destapar (drag corcho con use-gesture): humo dorado partícula sale + foto emerge flotando 3D.
5. Audio note se reproduce automáticamente.
6. Volver a guardar: drag del frasco a su lugar en el estante.
**Pulido espectacular:**
- Polvo flotante en rayos de luz por ventana.
- Sonidos: madera crujiendo, frascos tintineando al pasar cerca.
- Pluma flotando junto a un libro de hechizos como decoración.

---

### 11. Cofre del Tesoro — `cofre-tesoro`
**Estado:** ⬜ Pendiente · **Categoría:** Amistad/Aventura · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Nuestras aventuras valen oro."
**Hook visual:** Cueva oscura o playa pirata al atardecer. Cofre antiguo en el centro. Al abrirlo, monedas de oro caen con física real, revelando postales/pergaminos. Mapa del tesoro al fondo marca la "ruta de la amistad".
**Tech:** Three.js + Rapier (monedas físicas) + GLB cofre.
**Librerías nuevas:** `@react-three/rapier`, `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/gltfLoader.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `grupo_nombre`, `miembros[]`, `aventuras[6]` con `{titulo, foto, lugar, fecha}`, `tema` (caribe-atardecer, cueva-misterio, isla-tropical, taberna-noche), `musica`.
**Archivos:**
- `src/templates/cofre-tesoro/index.jsx`
- `src/templates/cofre-tesoro/config.js`
- `src/templates/cofre-tesoro/useCofre.js`
- `src/templates/cofre-tesoro/Mapa.jsx`
- `src/templates/cofre-tesoro/style.css`
**Pasos clave:**
1. Escena: ambiente (cueva o playa) con fog volumétrica.
2. Cofre GLB cerrado con candado oxidado. Click → candado cae + cofre se abre con animación cinematográfica.
3. Spawn 80-150 monedas de oro con Rapier (CylinderGeometry oro emissive). Caen y rebotan.
4. Las monedas revelan postales 3D que emergen flotando (una por aventura).
5. Mapa del tesoro al fondo (sprite textura pergamino) con X marcadas en cada lugar.
6. Voz pirata opcional (Tone.js Sampler con audio).
**Pulido espectacular:**
- Cofre con bisagras de hierro brillantes (emissive).
- Audio: clack del candado + chorro de monedas + risa pirata sutil.
- Brillo dorado en el aire después de abrir.

---

### 12. Cinta de Casete — Mixtape Eterno — `mixtape-eterno`
**Estado:** ⬜ Pendiente · **Categoría:** Amistad/Pareja · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Las playlists que hicimos por años — comprimidas en un objeto perfecto."
**Hook visual:** Casete cassette 90s en 3D con etiqueta escrita a mano. La cinta físicamente se rebobina entre "canciones" (fotos). Al final: pantalla tipo Spotify Wrapped con stats absurdas de la amistad.
**Tech:** Three.js + curva Catmull-Rom para la cinta + GLB del cassette.
**Librerías nuevas:** `gsap`, `howler`.
**Reutiliza:** `_shared/postFX.js`, `_shared/textTexture.js` (etiqueta handwriting).
**Config fields:** `titulo_mixtape`, `lado_a_canciones[5]` con `{titulo, artista, foto}`, `lado_b_canciones[5]`, `firma`, `tema` (verano-90s, indie-pastel, dark-rock, neón-80s), `musicas[5]` (samples cortos opcionales).
**Archivos:**
- `src/templates/mixtape-eterno/index.jsx`
- `src/templates/mixtape-eterno/config.js`
- `src/templates/mixtape-eterno/useCassette.js`
- `src/templates/mixtape-eterno/Wrapped.jsx`
- `src/templates/mixtape-eterno/style.css`
**Pasos clave:**
1. Cassette GLB en plano cenital. Bobinas A y B con rotación según playback.
2. Etiqueta SVG con texto handwriting (font Dancing Script). Lados A/B switchables.
3. Cinta interna: TubeGeometry siguiendo curva Catmull-Rom entre bobinas. Animación de movimiento.
4. Click en una canción: cinta rebobina al timestamp + foto del recuerdo aparece flotando + sample audio.
5. Final: pantalla "Mixtape Wrapped" tipo Spotify con stats inventadas ("3247 risas registradas", "tu canción top: X").
6. Doble-tap: voltea casete (Lado A ↔ Lado B).
**Pulido espectacular:**
- Pegatinas de stickers (corazones, calaveras, peace) descomprimidas con `Sprite`.
- Audio: clic de play + zumbido de cinta + ka-chunk al cambiar lado.
- Botón "Eject" que expulsa el cassette con sonido mecánico.

---

### 13. Habitación de tu Niñez — `habitacion-ninez`
**Estado:** ⬜ Pendiente · **Categoría:** Familia/Hermanos · **Dificultad:** ★★★★★
**Objetivo emocional:** "Volver al cuarto donde todo empezó."
**Hook visual:** Cuarto 3D estilo Pixar lleno de objetos interactivos: peluche, posters retro, walkman, álbum familiar, juguetes en el suelo. Polvo en rayos de luz por la ventana. Cada objeto que tocas revela un recuerdo + audio.
**Tech:** Three.js + GLB props variados + raycaster BVH + post-FX (DOF, color grade nostalgia).
**Librerías nuevas:** `three-mesh-bvh`, `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/gltfLoader.js`, `_shared/AudioPlayer.jsx`, `_shared/floatingPhoto.jsx`.
**Config fields:** `nombre_dueno`, `objetos[8]` con `{tipo: peluche|poster|libro|walkman|...|, foto, audio_recuerdo, mensaje}`, `tema` (años-90s, años-2000s, años-80s, milenial), `musica`.
**Archivos:**
- `src/templates/habitacion-ninez/index.jsx`
- `src/templates/habitacion-ninez/config.js`
- `src/templates/habitacion-ninez/useHabitacion.js`
- `src/templates/habitacion-ninez/ObjetoInteractivo.jsx`
- `src/templates/habitacion-ninez/style.css`
**Pasos clave:**
1. Cuarto base (paredes, piso, ventana) construido con BoxGeometry + texturas.
2. Posters según tema (Pokemon/NSYNC/Spiderman años 90, Hannah Montana/Naruto 2000s, etc.).
3. Props GLB low-poly: peluche (oso), walkman, NES/SNES, libro, foto enmarcada, calendario, mochila, planta.
4. Iluminación cálida sunset desde ventana + god rays.
5. Cada objeto picking con BVH: hover scale 1.05 + outline. Click → cámara dolly-in + recuerdo flotante.
6. Audio recuerdo se reproduce con efecto de "cinta vieja" (Tone.js filter).
**Pulido espectacular:**
- Reloj de pared cucú/Mickey con manecillas reales.
- Polvo flotante denso en los rayos de luz.
- Easter egg: encontrar 3 objetos especiales desbloquea álbum oculto bajo la cama.

---

### 14. Mariposas — Migración del Corazón — `mariposas-corazon`
**Estado:** ⬜ Pendiente · **Categoría:** Familia/Romántico · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Mil mariposas tomando la forma de tu nombre."
**Hook visual:** Cielo dorado al atardecer. Miles de mariposas monarca volando juntas (boids). Forman dinámicamente el nombre del homenajeado en el aire. Al disolverse, cada mariposa aterriza en una foto que flota.
**Tech:** Three.js + InstancedMesh + GPU compute (TSL preferible) o CPU boids.
**Librerías nuevas:** `three-mesh-bvh`, `seedrandom`.
**Reutiliza:** `_shared/postFX.js`, `_shared/seededRandom.js`, `_shared/textTexture.js` (para target points del texto).
**Skill recomendada:** `webgpu-threejs-tsl` para boids GPU.
**Config fields:** `nombre_destinatario`, `mensaje`, `fotos[6]`, `tema` (monarca-dorado, sakura-rosa, azul-mariposa, esmeralda), `musica`.
**Archivos:**
- `src/templates/mariposas-corazon/index.jsx`
- `src/templates/mariposas-corazon/config.js`
- `src/templates/mariposas-corazon/useMariposas.js`
- `src/templates/mariposas-corazon/textToPoints.js`
- `src/templates/mariposas-corazon/style.css`
**Pasos clave:**
1. Generar puntos target del nombre: canvas 2D escribe el texto, leer pixeles negros → array de points 3D.
2. Spawn 2000-5000 mariposas como InstancedMesh con custom shader (alas oscilando).
3. Boids algorithm: separation + alignment + cohesion + attraction al target.
4. Fase 1: mariposas vuelan caóticas. Fase 2 (a los 5s): atracción al texto. Fase 3: dispersan, cada una se acerca a una foto.
5. Fotos como Sprites con texture loaded desde Supabase Storage.
6. Audio: viento + crujido de alas (loop muy suave).
**Pulido espectacular:**
- Alas con motion blur (trail efecto).
- Sol bajo en el horizonte con god rays.
- Mensaje final aparece en cursiva grande cuando todas las mariposas se posan.

---

### 15. Origami — Grullas de Mil Recuerdos — `grullas-mil`
**Estado:** ⬜ Pendiente · **Categoría:** Familia/Mamá · **Dificultad:** ★★★★☆
**Objetivo emocional:** "La tradición japonesa: mil grullas = un deseo cumplido."
**Hook visual:** Mil grullas de papel volando en bandadas. Cada una lleva una foto. Se acomodan formando una palabra clave (nombre o "te amo"). Estética zen, papel washi.
**Tech:** Three.js + InstancedMesh + GLB de grulla origami low-poly + boids.
**Librerías nuevas:** mismo que #14.
**Reutiliza:** mismas que #14 + `_shared/gltfLoader.js`.
**Config fields:** `palabra_central` (max 8 chars), `mensaje`, `fotos[8]`, `tema` (washi-pastel, sumi-negro, sakura-rosa, dorado-zen), `musica`.
**Archivos:** análogos a #14.
**Pasos clave:**
1. Similar a #14 pero con grullas GLB en lugar de mariposas.
2. Material papel washi: SubsurfaceScattering aproximado (translucency en MeshPhysicalMaterial).
3. Animación de alas con BoneAnimation o morph targets.
4. Música: shakuhachi + koto loop.
5. Final: pluma de tinta dibuja la palabra en el aire como caligrafía sumi-e.
**Pulido espectacular:**
- Pétalos de cerezo cayendo en background.
- Cada grulla tiene su sombra proyectada (planar shadow).
- Sonido sutil de papel arrugándose al volar.

---

### 16. Ciudad Neón — After Hours — `ciudad-neon`
**Estado:** ⬜ Pendiente · **Categoría:** Artista (The Weeknd, K-Pop, Cyberpunk) · **Dificultad:** ★★★★★
**Objetivo emocional:** "Estética After Hours / Dawn FM aplicada al amor."
**Hook visual:** Skyline 3D nocturno con lluvia + reflejos en charcos (planar reflection). Letreros LED gigantes con kanji animados estilo XO. La pareja "camina" por la avenida, cada letrero revela una foto. Paleta rosa neón / cian / amarillo.
**Tech:** Three.js + planar reflection + custom CRT post-FX + emissive shader masivo.
**Librerías nuevas:** `postprocessing` (CRT, chromatic), `gsap`, `lenis`.
**Reutiliza:** `_shared/postFX.js`, `_shared/cinematicCamera.js`, `_shared/textTexture.js` (letreros animados).
**Config fields:** `nombre_pareja_a`, `nombre_pareja_b`, `kanjis_letreros[6]` (texto que aparecerá en cada letrero), `fotos[6]`, `tema` (after-hours-rojo, dawn-fm-naranja, blinding-cyan, idol-rosa), `musica`.
**Archivos:**
- `src/templates/ciudad-neon/index.jsx`
- `src/templates/ciudad-neon/config.js`
- `src/templates/ciudad-neon/useCiudad.js`
- `src/templates/ciudad-neon/Letrero.jsx`
- `src/templates/ciudad-neon/Rain.jsx`
- `src/templates/ciudad-neon/style.css`
**Pasos clave:**
1. Skyline procedural: 50-100 edificios BoxGeometry con UV texturizado (ventanas emissive aleatorias).
2. Calle mojada en planar reflection (segundo renderTarget invertido).
3. Lluvia: 5000 GPU particles (líneas verticales con velocidad).
4. Letreros: PlaneGeometry con texture animada (canvas con texto kanji glitch).
5. Scroll cinemático con Lenis: cámara avanza por la avenida.
6. Post-FX: BloomEffect alto + ChromaticAberration + FilmGrain.
**Pulido espectacular:**
- Reflejos rojos de las luces traseras de un auto que cruza.
- Cassette XO (logo) escondido en una pared como easter egg.
- Audio: lluvia + tráfico distante + sintetizador 80s.

---

### 17. Karaoke LED Sincronizado — `karaoke-led`
**Estado:** ⬜ Pendiente · **Categoría:** Artista (cualquier fandom) · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Cantarle a tu persona con SU canción favorita, sincronizada al milisegundo."
**Hook visual:** Letrero dot-matrix gigante estilo Madison Square Garden. La canción favorita suena. La letra aparece palabra-por-palabra sincronizada (LRC). Cambia paleta + tipografía según el artista. Easter eggs visuales del fandom.
**Tech:** Canvas 2D para el dot-matrix + lrc-kit + Howler.
**Librerías nuevas:** `lrc-kit`, `howler`.
**Reutiliza:** `_shared/AudioPlayer.jsx`, `_shared/useTheme.js`.
**Config fields:** `nombre_destinatario`, `cancion_audio`, `lyrics_lrc` (textarea con formato `.lrc`), `artista_paleta` (select: weeknd|feid|taylor|badbunny|karol-g|kanye|kpop|generic), `fotos[3]` (opcional, aparecen como visuales VJ atrás), `mensaje_final`.
**Archivos:**
- `src/templates/karaoke-led/index.jsx`
- `src/templates/karaoke-led/config.js`
- `src/templates/karaoke-led/useLRC.js`
- `src/templates/karaoke-led/DotMatrix.jsx`
- `src/templates/karaoke-led/style.css`
**Paletas por artista:**
- `weeknd`: rojo + negro, font condensada, easter egg = cassette XO.
- `feid`: verde fluo + negro, font futurista, easter egg = ferrari rojo + mariposa.
- `taylor`: pastel + dorado, font cursiva, easter egg = gato + cardigan.
- `badbunny`: amarillo + naranja, font bubble, easter egg = sapo + corazón.
- `karol-g`: azul + rosa, font sleek, easter egg = mariposa azul.
- `kpop`: gradient holográfico, font geometric, easter egg = lightstick.
**Pasos clave:**
1. Parser LRC: cada línea `[mm:ss.xx]texto` mapeada a timestamp.
2. Canvas dot-matrix: grid 16x96 LEDs (CircleGeometry o canvas círculos). Cada letra renderizada como matriz de dots encendidos.
3. Howler reproduce audio, sync el tiempo con `currentTime` cada frame.
4. Línea actual: dots brillantes con bloom. Líneas pasadas/futuras: tenues.
5. Background: fotos como visuales VJ con efecto random (zoom, glitch, color cycle).
6. Easter eggs aparecen en momentos específicos del LRC con tag custom `[fx:cassette]`.
**Pulido espectacular:**
- Vibración sutil del letrero con el bass (audio reactive).
- Audiencia silueta abajo con encendedores parpadeantes.
- Mensaje final con tipografía + paleta del artista.

---

### 18. Concierto Privado — `concierto-privado`
**Estado:** ⬜ Pendiente · **Categoría:** Artista/Pareja · **Dificultad:** ★★★★★
**Objetivo emocional:** "Eres mi única audiencia."
**Hook visual:** Estadio 3D vacío excepto por el escenario iluminado. El usuario es la única persona en la pista. Miles de "celulares" como puntos de luz forman el nombre del destinatario visto desde el escenario. Pantallas LED gigantes proyectan sus fotos. Confetti físico final.
**Tech:** Three.js + GPU particles + Web Audio FFT visualizer + Rapier (confetti).
**Librerías nuevas:** `@react-three/rapier`, `meyda`, `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/useAudioReactive.js`, `_shared/cinematicCamera.js`.
**Config fields:** `nombre_destinatario`, `nombre_show` (default "Tour Privado"), `cancion_audio`, `fotos[6]` (visuales LED), `tema` (eras-tour, lighthouse, after-hours, ferxxo), `mensaje_final`.
**Archivos:**
- `src/templates/concierto-privado/index.jsx`
- `src/templates/concierto-privado/config.js`
- `src/templates/concierto-privado/useEscenario.js`
- `src/templates/concierto-privado/Audiencia.jsx`
- `src/templates/concierto-privado/PantallasLED.jsx`
- `src/templates/concierto-privado/style.css`
**Pasos clave:**
1. Estadio: forma de coliseo con 4 niveles de gradas (CylinderGeometry segmentado).
2. Audiencia: 10k puntos (Points) con sprites de celulares-luz. Posiciones target = pixeles del texto "PARA: NOMBRE" visto desde el escenario.
3. Escenario: PlaneGeometry con emissive textura, luces de torre con SpotLight reales.
4. Pantallas LED: 2-3 PlaneGeometries grandes con `VideoTexture` o canvas animado mostrando fotos con efectos VJ.
5. Audio reactivo: bass → flash de luces + tamaño de puntos audiencia.
6. Confetti final con Rapier: 200 papeles físicos cayendo en el climax.
**Pulido espectacular:**
- Humo + spotlights volumétricos.
- Coreografía de cámara con GSAP timeline sincronizada al audio.
- Antes del show: pantallas dicen "PRÓXIMAMENTE: {nombre}" con countdown 10s.

---

### 19. Planeta Personal — El Principito — `planeta-personal`
**Estado:** ⬜ Pendiente · **Categoría:** Pareja/Cumpleaños/Profundo · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Tienes tu propio planeta, y yo lo cuido."
**Hook visual:** Mini-planeta 3D acuarela donde el homenajeado "vive". Tiene su volcán, su farol que se enciende al rotar al lado oscuro, su rosa única bajo cúpula de cristal. Al tocar cada objeto: recuerdo + frase.
**Tech:** Three.js + custom acuarela post-FX shader (screen-space).
**Librerías nuevas:** `postprocessing`, `gsap`, `@use-gesture/react`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `nombre_dueno`, `mensaje_central`, `objetos[5]` con `{tipo: volcan|farol|rosa|banca|libro|, foto, frase}`, `tema` (acuarela-pastel, sumi-monocromo, noche-estrellada, primavera), `musica`.
**Archivos:**
- `src/templates/planeta-personal/index.jsx`
- `src/templates/planeta-personal/config.js`
- `src/templates/planeta-personal/usePlaneta.js`
- `src/templates/planeta-personal/Objeto.jsx`
- `src/templates/planeta-personal/style.css`
**Pasos clave:**
1. Planeta: SphereGeometry pequeña con texture acuarela.
2. Objetos GLB low-poly anclados a la superficie (con cálculo de orientación según latitud/longitud).
3. Drag para rotar planeta (use-gesture).
4. Rosa bajo cúpula de cristal: SphereGeometry con `transmission` material.
5. Farol: PointLight que se enciende cuando el lado oscuro mira a cámara.
6. Acuarela post-FX: noise + edge detection + paper texture overlay.
**Pulido espectacular:**
- Estrellas alrededor titilando (Points).
- Pequeño zorro orbitando opcional.
- Música: instrumental tipo "Le Petit Prince" piano + cuerdas.

---

### 20. Reloj de Arena — Tiempo Detenido — `reloj-arena`
**Estado:** ⬜ Pendiente · **Categoría:** Aniversarios largos · **Dificultad:** ★★★★☆
**Objetivo emocional:** "El tiempo contigo no se mide en horas — se mide en momentos."
**Hook visual:** Reloj de arena 3D gigante surrealista estilo Dalí. Cada grano de arena = un día juntos. El usuario voltea el reloj y la arena fluye al revés revelando fotos suspendidas en cámara lenta.
**Tech:** Three.js + GPU particles + zero-gravity sim (custom).
**Librerías nuevas:** `gsap`, `@use-gesture/react` (voltear con drag).
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `fecha_inicio_relacion`, `mensaje`, `fotos[8]`, `tema` (dorado-egipto, plata-luna, cristal-prisma, dalí-surreal), `musica`.
**Archivos:**
- `src/templates/reloj-arena/index.jsx`
- `src/templates/reloj-arena/config.js`
- `src/templates/reloj-arena/useArena.js`
- `src/templates/reloj-arena/Granos.jsx`
- `src/templates/reloj-arena/style.css`
**Pasos clave:**
1. Reloj: 2 cones unidos por TorusGeometry estrecho. Material cristal `transmission`.
2. Granos: Points GPU con 5000-20000 partículas. Cantidad = días desde `fecha_inicio_relacion`.
3. Físico: granos caen con gravedad simulada (vec3.y -= 9.8*dt) hasta atravesar el cuello, acumulándose abajo.
4. Voltear: drag rota el reloj 180°, GSAP timeline + inversión del vector gravedad.
5. Fotos: spawn en posiciones aleatorias dentro del reloj, suspendidas (gravedad 0 mientras se ven).
6. Counter flotante: "X días juntos" tipográfico arriba.
**Pulido espectacular:**
- Cuando se voltea: cámara lenta brevísima en el momento del flip.
- Brillo dorado en cada grano (additive blending).
- Final: cuando todos los granos caen, mensaje grande en cursiva.

---

### 21. Aurora Boreal — `aurora-boreal`
**Estado:** ⬜ Pendiente · **Categoría:** Cielo/Pareja distancia · **Dificultad:** ★★★★☆
**Objetivo emocional:** "El cielo te recuerda desde el norte."
**Hook visual:** Cielo noruego nocturno. Aurora boreal animada con volumetric raymarch shader. Estrellas fugaces cruzan dejando fotos suspendidas en el aire. Paisaje nevado abajo.
**Tech:** Three.js + custom fragment shader (volumetric raymarch).
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Skill recomendada:** `webgpu-threejs-tsl` o `Context7` (three.js shader docs).
**Config fields:** `mensaje`, `para`, `fotos[6]`, `tema` (verde-clasico, rosa-magenta, dorado-raro, multicolor), `musica`.
**Archivos:**
- `src/templates/aurora-boreal/index.jsx`
- `src/templates/aurora-boreal/config.js`
- `src/templates/aurora-boreal/useAurora.js`
- `src/templates/aurora-boreal/auroraShader.js`
- `src/templates/aurora-boreal/style.css`
**Pasos clave:**
1. Quad fullscreen con custom fragment shader: raymarch 3D noise (Curl + FBM) → bandas de color verticales animadas.
2. Cielo estrellado encima del shader (Points starfield).
3. Paisaje: PlaneGeometry con HeightMap (montañas nevadas).
4. Estrellas fugaces: timer cada 8-15s spawn una con trail (TubeGeometry corta + fade).
5. Cuando estrella fugaz cruza un waypoint, deja una foto Sprite flotante allí.
6. Bloom alto + slight chromatic aberration en el borde.
**Pulido espectacular:**
- Reflejo de la aurora en un lago nevado abajo.
- Audio: viento polar + crujido de nieve sutil.
- Mensaje final aparece como aurora misma (texto formado por bandas de color).

---

### 22. Lluvia de Perseidas — `perseidas`
**Estado:** ⬜ Pendiente · **Categoría:** Cielo/Romántico · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Pide un deseo por mí cada noche de agosto."
**Hook visual:** Cielo nocturno con lluvia continua de meteoros (GPU particles). Tocar uno = foto + deseo escrito. Al final, un meteoro gigante deja un mensaje permanente.
**Tech:** Three.js + GPU particles (instanced lines) + raycaster BVH.
**Librerías nuevas:** `three-mesh-bvh`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`, `_shared/seededRandom.js`.
**Config fields:** `mensaje_principal`, `deseos[8]` con `{texto, foto}`, `tema` (clasico-azul, rosa-pastel, dorado-magico, esmeralda), `musica`.
**Archivos:**
- `src/templates/perseidas/index.jsx`
- `src/templates/perseidas/config.js`
- `src/templates/perseidas/usePerseidas.js`
- `src/templates/perseidas/Meteoro.jsx`
- `src/templates/perseidas/style.css`
**Pasos clave:**
1. Cielo estrellado base (10k Points).
2. Pool de 50 meteoros activos: cada uno es una línea (LineSegment) con trail fade.
3. Trayectoria: aparecen en zona top-right, mueren bottom-left con easing.
4. Raycaster BVH para detectar click en un meteoro activo.
5. Click → meteoro se ralentiza, foto emerge desde su punta, deseo escrito flota junto.
6. Meteoro final gigante (timer 30s) atraviesa el cielo completo con mensaje final.
**Pulido espectacular:**
- Trail con color gradient (cabeza blanca, cola del color del tema).
- Audio: ambient suave + whoosh sutil por cada meteoro.
- Contador "Deseos pedidos: X/8" en UI minimal.

---

### 23. Eclipse Total — Anillo de Diamantes — `eclipse-total`
**Estado:** ⬜ Pendiente · **Categoría:** Aniversarios profundos · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Tú eres mi eclipse."
**Hook visual:** Sol y luna 3D acercándose. Cuando se eclipsan, la corona solar revela el nombre del destinatario en el "anillo de diamantes". Cielo se oscurece progresivamente, aparecen estrellas.
**Tech:** Three.js + custom corona shader (radial noise + bloom + lensflare).
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`, `_shared/textTexture.js`.
**Config fields:** `nombre_destinatario`, `fecha_aniversario`, `mensaje`, `fotos[4]` (aparecen post-eclipse), `tema` (oro-clasico, plata-fria, rojo-sangre, violeta-cosmico), `musica`.
**Archivos:**
- `src/templates/eclipse-total/index.jsx`
- `src/templates/eclipse-total/config.js`
- `src/templates/eclipse-total/useEclipse.js`
- `src/templates/eclipse-total/Corona.jsx`
- `src/templates/eclipse-total/style.css`
**Pasos clave:**
1. Sol: SphereGeometry blanca emissive + corona shader (animated radial noise).
2. Luna: SphereGeometry negra con normal map para textura craters.
3. Cielo: gradient dinámico (azul → naranja → negro) según progreso del eclipse.
4. Animación 30s: luna se acerca, oscurece. En momento de totalidad: anillo de diamantes brillante con el nombre tipografiado en oro CINZEL.
5. Estrellas aparecen durante la totalidad.
6. Post-eclipse: fotos emergen flotando alrededor del sol restaurado.
**Pulido espectacular:**
- Lens flare cinematográfico cuando empieza/termina la totalidad.
- Audio: silencio eerie durante totalidad + viento al final.
- Tipografía del nombre con efecto plasma (emissive cycling).

---

### 24. Tormenta Eléctrica — `tormenta-electrica`
**Estado:** ⬜ Pendiente · **Categoría:** Dramático/Intenso · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Lo nuestro es tormenta — intenso, eléctrico, inolvidable."
**Hook visual:** Cielo negro tormentoso. Relámpagos procedurales (L-system) iluminan brevemente fotos colgadas en el aire suspendidas en marcos. Lluvia + truenos.
**Tech:** Three.js + L-system fractal para rayos + audio sync.
**Librerías nuevas:** `postprocessing`, `tone`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `mensaje`, `fotos[6]` (en marcos suspendidos), `tema` (azul-tempestad, violeta-electrico, rojo-rabia, blanco-puro), `musica`.
**Archivos:**
- `src/templates/tormenta-electrica/index.jsx`
- `src/templates/tormenta-electrica/config.js`
- `src/templates/tormenta-electrica/useTormenta.js`
- `src/templates/tormenta-electrica/Rayo.jsx`
- `src/templates/tormenta-electrica/style.css`
**Pasos clave:**
1. Cielo: dome con noise shader (nubes oscuras en movimiento).
2. Lluvia: 8000 GPU particles tipo `Line` cortas verticales.
3. Rayos: L-system fractal recursivo (segmentos línea con ramificaciones). Cada rayo vida ~150ms con flash global EmissiveIntensity x10.
4. Marcos GLB con fotos: 6 colgados con cadenas SVG, oscilando.
5. Cuando un rayo cae cerca de un marco, ese marco se ilumina y la foto queda visible 3s.
6. Audio: trueno con delay variable según distancia del rayo + ambient lluvia.
**Pulido espectacular:**
- Charcos en el suelo que reflejan rayos (planar reflection).
- Marco que más se ilumina al final = el principal con mensaje.
- Easter egg: si esperas 2 min, el cielo se calma y sale sol.

---

### 25. Bosque de Luciérnagas — `bosque-luciernagas`
**Estado:** ⬜ Pendiente · **Categoría:** Naturaleza/Pareja · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Vivimos en el bosque secreto donde nadie nos ve."
**Hook visual:** Bosque oscuro con millones de luciérnagas. Forman dinámicamente el nombre del destinatario con boids. Estética Princesa Mononoke / Bosque de Mononoke.
**Tech:** Three.js + GPU compute boids (TSL) o CPU + InstancedMesh + BVH.
**Librerías nuevas:** `three-mesh-bvh`.
**Reutiliza:** `_shared/postFX.js`, `_shared/seededRandom.js`, text-to-points de #14.
**Skill:** `webgpu-threejs-tsl`.
**Config fields:** `nombre_destinatario`, `mensaje`, `fotos[6]`, `tema` (verde-jade, dorado-magico, azul-luna, fucsia-spirit), `musica`.
**Archivos:** análogos.
**Pasos clave:**
1. Bosque GLB low-poly (árboles instanciados ~100).
2. Niebla volumétrica densa azul-verde.
3. 5000-10000 luciérnagas como Points con emissive shader que parpadea.
4. Boids con target points del texto.
5. Click en luciérnaga → expande y revela foto.
6. Audio: grillos + búho lejano + cascada sutil.
**Pulido espectacular:**
- Reflejo en un riachuelo en el suelo del bosque.
- Una luciérnaga gigante (kodama) flotando central al final.

---

### 26. Tornado de Pétalos de Cerezo — `tornado-petalos`
**Estado:** ⬜ Pendiente · **Categoría:** Naturaleza/Romántico · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Mi mundo gira en torno a ti."
**Hook visual:** Remolino gigante de sakuras girando alrededor del usuario. Cada pétalo es una foto pequeña. Tornado colapsa al centro formando un corazón.
**Tech:** Three.js + curl noise + InstancedMesh.
**Librerías nuevas:** `three-mesh-bvh`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`, `_shared/seededRandom.js`.
**Config fields:** `mensaje`, `fotos[8]`, `tema` (sakura-rosa, dorado-otono, lavanda, blanco-puro), `musica`.
**Pasos clave:**
1. 5000 pétalos InstancedMesh. Material doble cara con texture sakura.
2. Movimiento: posición = espiral (radius * cos(θ), height, radius * sin(θ)) con θ y height variando con tiempo + noise.
3. 8 de los pétalos son mucho más grandes y llevan textura de foto.
4. Fase final: radius colapsa a 0, posiciones target = puntos de un corazón.
5. Mensaje aparece dentro del corazón.
**Pulido espectacular:**
- Viento sonoro en loop + crujido de pétalos.
- Iluminación cherry-blossom (rosa-rojizo cálido).
- Cámara orbita lentamente en sentido contrario al tornado.

---

### 27. Globo de Nieve Gigante — `globo-nieve`
**Estado:** ⬜ Pendiente · **Categoría:** Navidad/Invierno · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Atrapados en un mundo perfecto que cabe en cristal."
**Hook visual:** El usuario está DENTRO de un globo de nieve gigante. Al agitar (drag o acelerómetro móvil), la nieve se levanta. Al caer revela escena con fotos.
**Tech:** Three.js + skybox interior + DeviceMotion + Rapier para nieve.
**Librerías nuevas:** `@react-three/rapier`, `@use-gesture/react`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `mensaje`, `fotos[6]`, `tema` (navidad-clasica, invierno-pastel, glaciar-azul, dorado-fiesta), `musica`.
**Pasos clave:**
1. Esfera interior con textura cristal + refraction.
2. Escena dentro: casita de jengibre, abeto, las fotos como cuadros colgantes.
3. Nieve: 3000 particles con física de gravedad lenta.
4. Drag (use-gesture) o shake (DeviceMotion) → impulso vertical a partículas.
5. Cuando se calma, fotos quedan visibles 5s antes de fade.
6. Música: campanas + Lo-Fi Christmas.
**Pulido espectacular:**
- Refracción de luz a través del cristal (custom shader).
- Reflejos de la habitación afuera del globo.
- Mensaje grabado en la base del globo (Cinzel font dorado).

---

### 28. Linternas Chinas Voladoras — `linternas-chinas`
**Estado:** ⬜ Pendiente · **Categoría:** Cielo/Esperanza · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Espero contigo, encendido."
**Hook visual:** Miles de linternas de papel ascendiendo desde un lago. Tocar una abre y revela foto. Reflejos en el agua.
**Tech:** Three.js + planar reflection + InstancedMesh + emissive.
**Librerías nuevas:** `three-mesh-bvh`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `mensaje`, `fotos[8]`, `tema` (dorado-tangled, rojo-china, azul-luna, rosa-pastel), `musica`.
**Pasos clave:**
1. Lago: plano con water shader + planar reflection.
2. Linternas: 1500 InstancedMesh (forma de pera, emissive interior).
3. Spawn continuo desde el lago, ascienden con leve drift por viento.
4. 8 linternas especiales más grandes contienen fotos.
5. Raycaster + click → linterna se acerca, se abre como flor de papel, foto emerge.
6. Música tipo "I See the Light" instrumental.
**Pulido espectacular:**
- Pequeña barca al borde del lago donde "está" el usuario.
- Audio: chapoteo del agua + crujido de papel + flauta.

---

### 29. Tarot del Amor — `tarot-amor`
**Estado:** ⬜ Pendiente · **Categoría:** Místico/Foundation · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "El destino escrito en cartas."
**Hook visual:** 6 cartas de tarot custom con ilustraciones doradas (Los Amantes, La Estrella, El Mundo, etc.). El usuario voltea cada una, revela un recuerdo. Humo místico.
**Tech:** CSS 3D card flip + SVG ilustraciones + use-gesture.
**Librerías nuevas:** `gsap`, `@use-gesture/react`.
**Reutiliza:** Foundation para flip de cartas (reusar en proyectos futuros).
**Config fields:** `cartas[6]` con `{arcano, foto, frase_lectura}`, `tema` (oro-clasico, plata-luna, rojo-pasion, negro-misterio), `musica`.
**Archivos:**
- `src/templates/tarot-amor/index.jsx`
- `src/templates/tarot-amor/config.js`
- `src/templates/tarot-amor/Carta.jsx`
- `src/templates/tarot-amor/arcanos.svg.jsx`  // 6 SVG ilustraciones
- `src/templates/tarot-amor/style.css`
**Pasos clave:**
1. 6 SVG ilustraciones inline: Los Amantes, La Estrella, La Fuerza, El Mundo, La Emperatriz, El Sol (versionar como amor).
2. CSS 3D card flip con `transform: rotateY` + perspective.
3. Mesa con paño morado oscuro + bola de cristal opcional decorativa.
4. Click/drag con use-gesture: carta se levanta + voltea.
5. Al voltear: foto del recuerdo se reveala + frase de lectura escrita en cursive.
6. Humo dorado partícula al voltear (canvas-confetti custom shape).
**Pulido espectacular:**
- Sonido de baraja al inicio.
- Borde dorado en las cartas con SVG filter (gold leaf).
- Música cíngara/místico (violín + tambor).

---

### 30. Bola de Cristal — `bola-cristal`
**Estado:** ⬜ Pendiente · **Categoría:** Místico/Anuncio · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Vi tu futuro, y soy yo."
**Hook visual:** Mesa con paño y bola de cristal con humo interno volumétrico. Al tocarla, dentro aparece una visión: foto + frase profética.
**Tech:** Three.js + custom volumetric smoke shader + refraction.
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** Tarot card patterns, `_shared/postFX.js`.
**Config fields:** `visiones[5]` con `{foto, frase}`, `mensaje_final`, `tema` (morado-gitana, azul-mistico, oro-faraonico, verde-bruja), `musica`.
**Pasos clave:**
1. Bola: SphereGeometry con `MeshPhysicalMaterial` (transmission, ior 1.5).
2. Humo interno: VolumetricSmoke con shader (raymarch 3D noise).
3. Click → cámara dolly-in dentro de la bola.
4. Visión: PlaneGeometry con foto y CanvasTexture de la frase emerge desde el humo.
5. Cada visión dura 4s, transición fade.
6. Final: bola se rompe (animación) revelando mensaje principal.
**Pulido espectacular:**
- Reflejos de velas alrededor en la bola.
- Audio: tintineo místico + humo + voz susurrada (TTS opcional).

---

### 31. Pociones / Boticario — `pociones-boticario`
**Estado:** ⬜ Pendiente · **Categoría:** Místico/Amistad · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Cada recuerdo es un hechizo que conservo."
**Hook visual:** Estantería de frascos burbujeantes con etiquetas escritas a mano ("Poción del primer abrazo"). Al destaparlos sale humo de color revelando foto.
**Tech:** Three.js + GLB frascos + caustics + emissive.
**Librerías nuevas:** `@react-three/rapier` (corchos rebotan), `gsap`.
**Reutiliza:** Idéntico a #10 (Boutique Mágica) en muchos aspectos — considerar mergear o diferenciar fuerte.
**Diferencia con Boutique:** aquí el foco es el LABORATORIO (mesas con alambiques, libro de hechizos abierto), no la tienda.
**Config fields:** `nombre_poción[6]` con `{titulo, foto, ingredientes_lista, recuerdo}`, `tema` (alquimia-oro, gótica-violeta, hierbas-verde, ámbar-rojo), `musica`.
**Pasos clave:**
1. Laboratorio: mesa con alambiques bullentes, libro abierto con caligrafía.
2. 6 frascos en una bandeja, etiquetados.
3. Caustics en el suelo de los líquidos brillantes.
4. Drag corcho → corcho rebota con Rapier, humo de color emerge.
5. Libro de hechizos pasa páginas mostrando "ingredientes" (cada uno = un recuerdo).
**Pulido espectacular:**
- Burbujas dentro de cada frasco animadas.
- Cristales colgantes que reflejan luz.

---

### 32. Carta Astral — `carta-astral`
**Estado:** ⬜ Pendiente · **Categoría:** Místico/Cumpleaños · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "El cielo se veía así cuando llegaste al mundo."
**Hook visual:** Carta natal real generada según fecha de nacimiento. Constelaciones reales del cielo en ese momento aparecen alrededor del nombre. Planetas en sus posiciones reales.
**Tech:** `astronomy-engine` + SVG procedural + Three.js opcional para esfera celeste.
**Librerías nuevas:** `astronomy-engine`.
**Reutiliza:** `_shared/textTexture.js`, `_shared/postFX.js`.
**Config fields:** `nombre`, `fecha_nacimiento` (date input), `hora_nacimiento`, `lugar_nacimiento` (city autocomplete), `mensaje`, `tema` (cielo-dorado, cielo-azul, cielo-violeta, cielo-negro-puro), `musica`.
**Pasos clave:**
1. `astronomy-engine` calcula posiciones de Sol, Luna, planetas para esa fecha/hora/lugar.
2. SVG generativo: círculo zodiacal con 12 casas, glifos planetarios en sus posiciones.
3. Constelaciones reales del firmamento esa noche superpuestas (data de Hipparcos catalog simplificado).
4. Interpretación poética automática según signo solar + ascendente.
5. Descargable como PDF.
**Pulido espectacular:**
- Caligrafía dorada ornamental.
- Estrellas con titilado real.
- Audio: chimes celestiales.

---

### 33. Mandala Generativo — `mandala-generativo`
**Estado:** ⬜ Pendiente · **Categoría:** Místico/Meditativo · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Tu nombre es mi centro."
**Hook visual:** Mandala generándose procedural sincronizado con música subida (FFT). Simetrías revelan fotos. Estética tibetana dorada.
**Tech:** Canvas 2D o WebGL fragment shader + Meyda audio analysis.
**Librerías nuevas:** `meyda`.
**Reutiliza:** `_shared/useAudioReactive.js`, `_shared/postFX.js`.
**Config fields:** `nombre_central`, `mensaje`, `fotos[8]`, `tema` (tibetano-oro, indio-azul, sufi-rojo, zen-bn), `musica` (requerido).
**Pasos clave:**
1. Mandala = 12 segmentos radiales con simetría. Cada uno dibuja patrón procedural (curvas Bezier).
2. Patrón cambia con bass/mid/treble del audio.
3. En el centro: foto principal circular con borde ornamental.
4. 8 fotos pequeñas en posiciones equidistantes (rosa de los vientos).
5. Mientras la música avanza, el mandala "florece" añadiendo más anillos.
**Pulido espectacular:**
- Texture papel washi dorado de fondo.
- Mandala descargable como PNG de alta resolución.

---

### 34. Lámpara Mágica — Genio — `lampara-genio`
**Estado:** ⬜ Pendiente · **Categoría:** Místico/Sorpresa · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Tu deseo es mi orden."
**Hook visual:** Lámpara antigua dorada en una mesa. Al frotarla (drag), sale humo azul-dorado formando un genio que entrega tu "deseo cumplido" (mensaje + fotos).
**Tech:** Three.js + GPU smoke shader + GLB de lámpara.
**Librerías nuevas:** `@use-gesture/react`, `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/gltfLoader.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `deseo_concedido` (mensaje), `fotos[5]`, `tema` (oro-arabia, azul-zafir, rosa-aladino, esmeralda), `musica`.
**Pasos clave:**
1. Lámpara GLB dorada con caustics.
2. Drag con use-gesture: rotación + acumulador de "fricción". Al pasar threshold, animación de humo.
3. Humo: 2000 particles con upward velocity + curl noise.
4. Genio: forma humanoide hecha del mismo humo (texture aplicada a planos volumétricos o sprite atlas).
5. Genio "ofrece" las fotos una a una.
**Pulido espectacular:**
- Joyas alrededor de la mesa (rubíes, zafiros) reflejando luz.
- Audio: voz grave susurrando "tu deseo es mi orden" + viento mágico.

---

### 35. Sala de Cine Antigua — `cine-antiguo`
**Estado:** ⬜ Pendiente · **Categoría:** Retro/Aniversario · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Nuestra película favorita somos nosotros."
**Hook visual:** Sala vacía, butaca roja, proyector encendido. Película granulada con conteo regresivo "3, 2, 1" y se proyectan fotos como película antigua. Audio: ruido de proyector.
**Tech:** Three.js + film grain shader + VideoTexture o canvas con fotos secuenciadas.
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`.
**Config fields:** `titulo_pelicula` (default "Nuestra Historia"), `protagonistas`, `fotos[12]` (más fotos = película más larga), `mensaje_final`, `tema` (cine-clasico-sepia, cine-noir, cine-color-50s, cine-superocho), `musica`.
**Pasos clave:**
1. Sala 3D: butacas en filas (InstancedMesh), proyector arriba con haz de luz.
2. Pantalla blanca con texture canvas que va cambiando fotos.
3. Film grain shader + chromatic aberration leve sobre la pantalla.
4. Conteo regresivo: SVG con leader film tradicional (círculos y números).
5. Cada foto tiene transición con efecto "scratched film" (líneas blancas verticales aleatorias).
6. Polvo flotando en el haz del proyector.
**Pulido espectacular:**
- Audio: ruido constante de proyector + clic-clic-clic del rollo.
- Créditos finales con nombres de la pareja como "directors / starring".

---

### 36. Cabina Telefónica — `cabina-telefonica`
**Estado:** ⬜ Pendiente · **Categoría:** Retro/Reconquista · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Necesitaba decirte algo desde hace mucho."
**Hook visual:** Cabina roja británica 3D. El teléfono suena. Usuario descuelga, escucha voz nostálgica (audio del creador) mientras fotos antiguas flotan alrededor.
**Tech:** Three.js + GLB cabina + post-FX vignette + Howler.
**Librerías nuevas:** `howler`.
**Reutiliza:** `_shared/postFX.js`, `_shared/AudioPlayer.jsx`, `_shared/floatingPhoto.jsx`.
**Config fields:** `de`, `para`, `mensaje_audio` (audio file requerido — grabación de voz), `fotos[6]`, `tema` (londres-rojo, paris-azul, ny-amarillo, tokio-verde), `musica_fondo` (opcional, segundo audio).
**Archivos:**
- `src/templates/cabina-telefonica/index.jsx`
- `src/templates/cabina-telefonica/config.js`
- `src/templates/cabina-telefonica/Cabina.jsx`
- `src/templates/cabina-telefonica/style.css`
**Pasos clave:**
1. Cabina GLB en una calle nocturna con farolas.
2. Lluvia ligera (opcional según tema).
3. Cabina suena: vibración + emissive amarillo cíclico + Howler "ring".
4. Click → cámara dolly-in al interior. Teléfono se descuelga animado.
5. Voz del creador se reproduce con filtro "phone EQ" (Tone.js BiquadFilter highpass 300Hz + lowpass 3kHz).
6. Fotos antiguas flotan alrededor de la cabina mientras suena la voz.
**Pulido espectacular:**
- Niebla baja en la calle.
- Reflejos en el vidrio de la cabina.
- Easter egg: si user no responde en 30s, mensaje aparece de todos modos.

---

### 37. TV CRT — Zappear Canales — `tv-crt`
**Estado:** ⬜ Pendiente · **Categoría:** Retro · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Cada canal es un recuerdo."
**Hook visual:** TV antigua con efecto CRT real (scanlines + chromatic aberration + barrel distortion). Cada cambio de canal con ruido de estática revela un recuerdo.
**Tech:** Custom CRT post-FX shader (postprocessing).
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`.
**Config fields:** `canales[8]` con `{nombre_canal, foto, mensaje}`, `tema` (80s-pastel, 90s-saturado, viernes-13-rojo, lo-fi-bn), `musica`.
**Pasos clave:**
1. TV GLB (Sketchfab CC0) con CRT como video texture.
2. CRT shader: scanlines + RGB phosphor pattern + barrel distortion + slight green tint.
3. Click "next channel" → estática (random noise shader 200ms) → nuevo canal.
4. Cada canal muestra foto + título con tipo Channel 5 estilo bug en esquina.
5. Botón rojo en el control: revela mensaje final.
**Pulido espectacular:**
- Sonido estática + clic mecánico de botones.
- Stranger Things vibe en uno de los temas.

---

### 38. Diapositivas Kodak — `diapositivas-kodak`
**Estado:** ⬜ Pendiente · **Categoría:** Retro/Familia · **Dificultad:** ★★☆☆☆
**Objetivo emocional:** "Mirar las fotos como antes — con tiempo."
**Hook visual:** Proyector de diapositivas con sonido "ka-chunk". Carrusel circular real. Pantalla blanca recibe luz amarilla.
**Tech:** Three.js + GLB proyector.
**Librerías nuevas:** `howler`.
**Reutiliza:** `_shared/postFX.js`, `_shared/gltfLoader.js`, `_shared/AudioPlayer.jsx`.
**Config fields:** `titulo_album`, `diapositivas[12]` con `{foto, año, lugar}`, `tema` (kodachrome, sepia-50s, color-60s, bn-clasico), `musica`.
**Pasos clave:**
1. Proyector GLB con carrusel circular arriba (rota cada cambio).
2. Pantalla blanca: PlaneGeometry con texture que cambia con fade.
3. Cada slide tiene marco característico (cuadrado con fecha en el margen).
4. Audio: ka-chunk con Howler en cada cambio + clic del botón.
**Pulido espectacular:**
- Polvo en haz del proyector.
- Texto manuscrito al margen de cada slide ("Verano 2018, Mar del Plata").

---

### 39. Máquina de Escribir — `maquina-escribir`
**Estado:** ⬜ Pendiente · **Categoría:** Retro/Formal · **Dificultad:** ★★☆☆☆
**Objetivo emocional:** "Te escribo como en otros tiempos."
**Hook visual:** Máquina de escribir Olivetti antigua. Carta se escribe tecla a tecla con sonido real. Ding al final de línea. Papel se mueve.
**Tech:** CSS animation + Howler + typing engine.
**Librerías nuevas:** `howler`.
**Reutiliza:** `_shared/AudioPlayer.jsx`, fonts.
**Config fields:** `de`, `para`, `mensaje` (textarea largo), `tema` (olivetti-verde, royal-negra, hermes-roja, underwood-bronze), `musica` (opcional).
**Archivos:** análogos.
**Pasos clave:**
1. Máquina ilustrada SVG o GLB low-poly.
2. Papel saliendo desde atrás (SVG con clip-path animado).
3. Texto se escribe carácter por carácter con `setTimeout` o gsap stagger.
4. Cada tecla: sonido clack random (pool de 5 samples).
5. Ding al `\n`.
**Pulido espectacular:**
- Carrete de tinta rojo + negro visible.
- Imperfecciones random (carácter desalineado ocasional).

---

### 40. Cassette VHS — `cassette-vhs`
**Estado:** ⬜ Pendiente · **Categoría:** Retro · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Las cintas familiares de los domingos."
**Hook visual:** TV antigua. Cassette VHS se inserta con sonido mecánico. Reproduce video casero (fotos en sucesión con efecto VHS: tracking lines, color bleed, datestamp).
**Tech:** Custom VHS post-FX shader.
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`.
**Config fields:** `titulo_cinta` (default "Family Tape 1995"), `fecha_grabacion`, `fotos[10]`, `tema` (vhs-saturado, vhs-degradado, vhs-bn, vhs-tropical), `musica`.
**Pasos clave:**
1. Similar a #37 pero shader específico VHS: chroma shift horizontal random, tracking lines verticales, snow noise en bordes.
2. Datestamp digital naranja en esquina inferior derecha.
3. Cada foto tiene transición "rewind" si se va atrás (fast forward effect).
4. Botones de VHS: PLAY, REW, FF, STOP funcionales.
**Pulido espectacular:**
- Audio del REW/FF (chillido característico).
- Logo del canal donde se grabó (RCA, NBC, Telemundo personalizable).

---

### 41. Game Boy — Recuerdo Jugable — `game-boy`
**Estado:** ⬜ Pendiente · **Categoría:** Retro/Geek · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Si jugaras al amor, ganabas siempre."
**Hook visual:** Game Boy verde 3D. La pantalla muestra un minijuego en pixel art donde un personaje camina recogiendo fotos. Música 8-bit chiptune real.
**Tech:** Three.js + canvas 2D pixel art en la pantalla + Tone.js para chiptune.
**Librerías nuevas:** `tone`.
**Reutiliza:** `_shared/AudioPlayer.jsx`.
**Config fields:** `titulo_juego`, `protagonista_nombre`, `fotos_collectables[8]`, `tema` (gameboy-classic, gameboy-color-rojo, gameboy-pocket-bn, virtual-boy-rojo), `mensaje_final`.
**Pasos clave:**
1. Game Boy GLB en plano frontal.
2. Pantalla: canvas 2D con sprite renderer pixel art (32x32 sprites).
3. Personaje camina, controles WASD/flechas mueven, recoge "fotos" en el mapa.
4. Cada foto recogida desbloquea visualización fullscreen + mensaje.
5. Música: chiptune compuesto con Tone.js Square + Triangle + Noise.
6. Cuando recoges todas: pantalla "GAME COMPLETE" + mensaje final.
**Pulido espectacular:**
- Pantalla con leve LCD tint (verdoso si gameboy classic).
- Botones A/B funcionales con sonido.
- Easter egg: Konami code → modo gigante.

---

### 42. Drive-In Autocine — `drive-in`
**Estado:** ⬜ Pendiente · **Categoría:** Retro/Romántico · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Como en los 50s — solos en el auto, viendo la luna."
**Hook visual:** Pantalla gigante en un descampado, tu auto estacionado (vista interior). Fotos se proyectan como película 50s. Estrellas arriba.
**Tech:** Three.js + parallax + interior auto GLB.
**Librerías nuevas:** ninguna.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `titulo`, `protagonistas`, `fotos[8]`, `tema` (50s-rosa, 60s-coches-clasicos, 70s-orange, 80s-neon), `musica`.
**Pasos clave:**
1. Pantalla gigante PlaneGeometry con VideoTexture (canvas con secuencia de fotos).
2. Interior del auto: SVG/PNG del dashboard con volante en primer plano (parallax).
3. Cielo estrellado + luna llena gigante.
4. Otros autos lejanos como sombras.
5. Audio: doo-wop o rock 50s + ruido sutil parlante "speaker pole".
**Pulido espectacular:**
- Speaker pole en la ventana del auto con cable.
- Mensaje final: marquesina exterior cambia a "TE AMO".

---

### 43. Carrusel de Feria Mágico — `carrusel-feria`
**Estado:** ⬜ Pendiente · **Categoría:** Familia/Infancia · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Volver a tener 5 años, contigo."
**Hook visual:** Carrusel 3D con caballos animados subiendo y bajando. Cada caballo lleva una foto en su silla. Música de calíope.
**Tech:** Three.js + GLB carrusel + skeletal animation.
**Librerías nuevas:** `gsap`.
**Skill:** `threejs-animation`.
**Reutiliza:** `_shared/postFX.js`, `_shared/gltfLoader.js`.
**Config fields:** `nombre_homenajeado`, `fotos[6]`, `tema` (clasico-pastel, vintage-cobre, noche-magica, dorado-circo), `musica` (default calíope).
**Pasos clave:**
1. Carrusel GLB con 6 caballos.
2. Animación: rotación global del carrusel + cada caballo sube/baja en senoidal desfasada.
3. Cada caballo lleva una foto enmarcada (PlaneGeometry).
4. Iluminación: lámparas amarillas en el techo del carrusel.
5. Click en caballo: cámara dolly-in, foto se acerca con mensaje.
6. Música calíope con Tone.js o sample real.
**Pulido espectacular:**
- Reflejos dorados en los espejos centrales del carrusel.
- Bordes ornamentales (SVG filagrana).
- Feria de fondo: noria + algodón de azúcar lejos.

---

### 44. Rueda de la Fortuna — `rueda-fortuna`
**Estado:** ⬜ Pendiente · **Categoría:** Pareja/Aniversario · **Dificultad:** ★★★★☆
**Objetivo emocional:** "La primera vez que subimos a la noria."
**Hook visual:** Rueda gigante girando al atardecer. Cada cabina = un recuerdo. El usuario "sube" a la cabina y al llegar arriba: vista panorámica + mensaje.
**Tech:** Three.js + cabinas instanciadas + cinematic camera.
**Librerías nuevas:** `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/cinematicCamera.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `nombre_pareja`, `mensajes_cabinas[8]` con `{titulo, foto}`, `tema` (atardecer-london, paris-noche, ny-skyline, tokyo-rosa), `musica`.
**Pasos clave:**
1. Rueda: TorusGeometry grande + 8 BoxGeometries para cabinas.
2. Cabinas con ventanas (PlaneGeometry con foto dentro).
3. Rotación lenta. Cámara orbita junto a una cabina específica.
4. Click → cámara "entra" a esa cabina, vista interior + skyline de fondo según tema.
5. Al llegar al punto más alto: mensaje grande aparece.
**Pulido espectacular:**
- Luces parpadeando en la estructura.
- Atardecer con god rays.

---

### 45. Caleidoscopio Infinito — `caleidoscopio`
**Estado:** ⬜ Pendiente · **Categoría:** Surreal · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Mi mente cuando pienso en ti."
**Hook visual:** Pantalla refractada en hexágonos simétricos con tus fotos. Al rotar (mouse/touch) los patrones cambian. Audio reactivo.
**Tech:** Custom fragment shader.
**Librerías nuevas:** `meyda`.
**Reutiliza:** `_shared/useAudioReactive.js`, `_shared/postFX.js`.
**Config fields:** `fotos[6]`, `tema` (oro-gem, joyas-rojas, jade-verde, prisma-arcoiris), `musica`.
**Pasos clave:**
1. Fragment shader: tomar UV, doblar en simetría hexagonal (mod + reflect).
2. Texturas = fotos rotando lentamente.
3. Audio reactivo: el factor de rotación y zoom depende del bass/treble.
4. Hover/drag rota el caleidoscopio manualmente.
**Pulido espectacular:**
- Música ambient electronica.
- Borde dorado del "tubo" del caleidoscopio (radial gradient).

---

### 46. Habitación de Espejos — `habitacion-espejos`
**Estado:** ⬜ Pendiente · **Categoría:** Surreal · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Donde sea que mire, te veo."
**Hook visual:** Habitación con espejos infinitos. Foto se multiplica al infinito. Mensaje aparece flotando en el centro.
**Tech:** Three.js + CubeCamera (reflexiones recursivas) o framebuffer trick.
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`.
**Config fields:** `mensaje_central`, `fotos[6]`, `tema` (oro-luxuoso, plata-fria, neon-rosa, negro-cosmico), `musica`.
**Pasos clave:**
1. Habitación cuadrada con 4 paredes espejadas.
2. CubeCamera en el centro renderiza el environment, aplicado como reflexión a las paredes.
3. Fotos como Sprites flotando en el espacio central.
4. Para reflexión recursiva: trick con plano de espejo + segundo render pass invertido.
**Pulido espectacular:**
- Luz parpadeando lenta (disco ambient).
- Audio: ambient drone.

---

### 47. Vitral de Catedral — `vitral-catedral`
**Estado:** ⬜ Pendiente · **Categoría:** Surreal/Boda · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Lo nuestro es sagrado."
**Hook visual:** Vitrales góticos con fotos como "santos". Luz solar atraviesa creando rayos volumétricos en el suelo. Cantos gregorianos.
**Tech:** Three.js + god rays post-FX + custom stained-glass shader.
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`.
**Config fields:** `nombres_homenajeados`, `fecha_significativa`, `fotos[6]` (cada una se renderiza como vitral), `tema` (gotico-azul, romanico-dorado, barroco-rojo, moderno-blanco), `musica`.
**Pasos clave:**
1. Catedral interior: BoxGeometry + columnas + suelo de mármol.
2. Vitrales: PlaneGeometry con custom shader que convierte la foto en estilo "vitral" (alto contraste + bordes de plomo + colores saturados).
3. SpotLights detrás de cada vitral con god rays volumétricos.
4. Polvo flotante en los rayos.
5. Texto central tipo lápida cinzel con fecha + nombres.
**Pulido espectacular:**
- Audio: cantos gregorianos sutiles + eco de catedral.
- Reflejo de los colores en el suelo de mármol.

---

### 48. Máquina Steampunk Rube Goldberg — `steampunk-goldberg`
**Estado:** ⬜ Pendiente · **Categoría:** Geek/Padre · **Dificultad:** ★★★★★
**Objetivo emocional:** "Lo complicado vale la pena si entrega lo correcto."
**Hook visual:** Engranajes y poleas activándose en cadena. Una bola rueda, activa un mecanismo, otro, hasta entregar el mensaje final en un sobre estampado.
**Tech:** Three.js + Rapier (física real) + GLB de engranajes.
**Librerías nuevas:** `@react-three/rapier`, `mathjs`, `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/gltfLoader.js`.
**Config fields:** `mensaje_final`, `fotos[6]` (cada una aparece en una "estación" del recorrido), `tema` (cobre-vintage, dorado-imperial, hierro-oxidado, latón-pulido), `musica`.
**Pasos clave:**
1. 8-10 mecanismos en cadena: rueda gira → palanca cae → bola rueda → catapulta dispara → etc.
2. Cada uno con Rapier RigidBody.
3. Cámara sigue cinemáticamente la acción.
4. Cada estación revela una foto.
5. Final: sobre estampado emerge con mensaje.
**Pulido espectacular:**
- Vapor saliendo de engranajes.
- Audio: tic-tac + silbato vapor + clic mecánico.

---

### 49. Reloj Cucú Suizo — `reloj-cucu`
**Estado:** ⬜ Pendiente · **Categoría:** Familia/Abuelos · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "El tiempo en familia es el mejor."
**Hook visual:** Reloj antiguo de madera. A la hora marcada se abre puertita y sale pájaro que canta + carga foto.
**Tech:** Three.js + GLB reloj + skeletal animation.
**Librerías nuevas:** `gsap`.
**Skill:** `threejs-animation`.
**Reutiliza:** `_shared/gltfLoader.js`.
**Config fields:** `horas_recuerdos[12]` con `{hora, foto, mensaje}`, `tema` (madera-clasica, alpino-rojo, modernista-blanco, oscuro-noche), `musica`.
**Pasos clave:**
1. Reloj GLB con manecillas animadas.
2. Cada hora completa: puertita se abre, pájaro emerge cantando "cu-cú".
3. En el pico del pájaro: foto enmarcada miniatura.
4. Click en pájaro: expand a vista completa.
**Pulido espectacular:**
- Péndulo balanceándose realista.
- Música suiza folclórica suave.

---

### 50. París Bajo la Lluvia — `paris-lluvia`
**Estado:** ⬜ Pendiente · **Categoría:** Lugar/Romántico · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Llovía, y solo importabas tú."
**Hook visual:** Torre Eiffel iluminada, lluvia + paraguas amarillo. Fotos aparecen como reflejos en los charcos al pisar.
**Tech:** Three.js + planar reflection + GPU rain.
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`.
**Config fields:** `mensaje`, `fotos[6]`, `tema` (amarillo-paraguas, rojo-clasico, verde-emerald, transparente), `musica`.
**Pasos clave:**
1. Skyline París con Torre Eiffel central (emissive parpadeando como hace cada hora).
2. Plaza con adoquines, charcos modelados.
3. Reflexión planar en charcos.
4. Lluvia 5000 particles.
5. Paraguas en primer plano (parallax).
6. Click en charcos = foto emerge.
**Pulido espectacular:**
- Acordeón francés en audio.
- Café au coin con luz cálida lejos.

---

### 51. Venecia — Paseo en Góndola — `venecia-gondola`
**Estado:** ⬜ Pendiente · **Categoría:** Lugar/Aniversario · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Navegar contigo donde la ciudad flota."
**Hook visual:** Cámara POV navegando un canal al atardecer. Edificios pasan a los lados. Cantos italianos. Fotos aparecen en ventanas y carteles.
**Tech:** Three.js + water shader + scroll-driven camera.
**Librerías nuevas:** `lenis`.
**Reutiliza:** `_shared/postFX.js`, `_shared/cinematicCamera.js`.
**Config fields:** `pareja`, `fotos[8]`, `tema` (atardecer-dorado, noche-azul, mediodia-luminoso, niebla-misterio), `musica`.
**Pasos clave:**
1. Canal: plano con water shader Gerstner.
2. Edificios venecianos a ambos lados (BoxGeometry + texture).
3. Cámara avanza con scroll.
4. En las ventanas: PlaneGeometries con fotos.
5. Puentes con farolas.
**Pulido espectacular:**
- Voz de gondolero cantando "O Sole Mio".
- Mascarón de góndola visible en primer plano.

---

### 52. Santorini Atardecer — `santorini`
**Estado:** ⬜ Pendiente · **Categoría:** Lugar/Pareja · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "El destino que soñamos."
**Hook visual:** Domos blancos/azules, mar Egeo al fondo, globos aerostáticos en el horizonte. Cámara hace long-take cinematográfico.
**Tech:** Three.js + skybox + low-poly arquitectura.
**Librerías nuevas:** ninguna.
**Reutiliza:** `_shared/postFX.js`, `_shared/cinematicCamera.js`.
**Config fields:** `mensaje`, `fotos[6]`, `tema` (atardecer-naranja, alba-rosa, mediodia-azul, luna-llena), `musica`.
**Pasos clave:**
1. Casas de Santorini: pequeños cubos blancos con domos azules (Spheres recortadas).
2. Mar al fondo con water shader.
3. Globos aerostáticos lejanos.
4. Cámara hace tracking shot suave.
5. Fotos aparecen flotando junto a las casas.
**Pulido espectacular:**
- Buganvillas rosas en muros.
- Gaviotas.

---

### 53. Shibuya Tokio — `shibuya`
**Estado:** ⬜ Pendiente · **Categoría:** Lugar/Geek/Artista · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Encontrarte en la multitud."
**Hook visual:** Cruce neón con miles de personas (low-poly) caminando. En las pantallas gigantes se proyectan tus fotos como anuncios.
**Tech:** Three.js + InstancedMesh para multitud + emissive masivo.
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** Similar a #16 Ciudad Neón.
**Config fields:** `nombres`, `fotos[6]`, `tema` (shibuya-clasico, akihabara-rosa, shinjuku-rojo, harajuku-pastel), `musica`.
**Pasos clave:**
1. Edificios con pantallas LED gigantes (VideoTexture con fotos).
2. Cruce icónico con 4 esquinas y zebra.
3. Multitud: 200 personas low-poly caminando en direcciones aleatorias (boids simple).
4. Anuncios animados en kanji.
**Pulido espectacular:**
- Lluvia ligera opcional reflejando neones.
- Audio: voces japonesas distantes + city pop.

---

### 54. Ofrenda Día de Muertos — `dia-muertos`
**Estado:** ⬜ Pendiente · **Categoría:** Tributo · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Mientras te recordamos, sigues con nosotros."
**Hook visual:** Altar mexicano con velas, cempasúchil, papel picado moviéndose con viento, fotos del fallecido. Catrina aparece sutilmente.
**Tech:** Three.js + cloth simulation (para papel picado).
**Librerías nuevas:** ninguna (cloth con Verlet integration custom).
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `nombre_fallecido`, `fecha_nacimiento`, `fecha_partida`, `fotos[6]`, `palabras_recuerdo[]`, `tema` (cempasúchil-clasico, mezcal-oscuro, catrina-pastel, oaxaca-vibrante), `musica`.
**Archivos:**
- `src/templates/dia-muertos/index.jsx`
- `src/templates/dia-muertos/config.js`
- `src/templates/dia-muertos/useAltar.js`
- `src/templates/dia-muertos/PapelPicado.jsx`
- `src/templates/dia-muertos/style.css`
**Pasos clave:**
1. Altar 3D: 3 niveles (cielo, tierra, inframundo).
2. Velas con flame shader (animated emissive flicker).
3. Cempasúchil (caléndulas naranjas) modeladas low-poly.
4. Papel picado colgado con cloth sim (Verlet integration en una tira de quads).
5. Foto principal enmarcada en el centro con corona de flores.
6. Pan de muerto, calaveritas de azúcar.
7. Catrina apenas visible al fondo, sonriendo.
**Pulido espectacular:**
- Mariposas monarca (alma del fallecido) cruzan ocasionales.
- Audio: música ranchera suave + viento.
- "Calaverita literaria" generada con el nombre.

---

### 55. Linternas al Mar (Coco) — `linternas-mar`
**Estado:** ⬜ Pendiente · **Categoría:** Tributo/Despedida · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Te despido con luz."
**Hook visual:** Lago oscuro. El usuario suelta linternas de papel al agua, cada una con foto encendida. Flotan alejándose. Reflexión en el agua.
**Tech:** Three.js + water + emissive.
**Librerías nuevas:** ninguna.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `nombre_fallecido`, `mensaje`, `fotos[8]`, `tema` (azul-noche, dorado-coco, plata-luna, rojo-oriental), `musica`.
**Pasos clave:**
1. Plano de agua con water shader oscuro.
2. Drag linternas (use-gesture) desde la orilla al agua.
3. Cada linterna se aleja flotando con leve drift.
4. Cuando llegan al horizonte: fade out + estrella nueva aparece en el cielo.
5. Música tipo "Remember Me" instrumental.
**Pulido espectacular:**
- Reflejos perfectos en el agua.
- Audio: agua + viento + voz susurrando nombres.

---

### 56. Carta al Yo del Futuro — `carta-yo-futuro`
**Estado:** ⬜ Pendiente · **Categoría:** Auto-regalo · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Hoy te escribiste para que mañana te encuentres."
**Hook visual:** El destinatario se escribe a sí mismo. Carta se cierra con sello de cera y queda bloqueada por X años. Al abrir, ve fotos viejas + mensaje pasado.
**Tech:** Similar a #07 Cápsula + #08 Carta Manuscrita combined.
**Librerías nuevas:** ninguna.
**Reutiliza:** `_shared/useUnlockTime.jsx`, patrones de #07 y #08.
**Config fields:** `nombre_propio`, `fecha_apertura` (date input, mín +6 meses), `mensaje_al_futuro`, `fotos[5]`, `predicciones[3]` (qué crees que pasará), `tema` (similar a #08), `musica`.
**Pasos clave:**
1. Pre-unlock: carta sellada flotando con countdown.
2. Post-unlock: secuencia tipo #08 carta manuscrita.
3. Sección extra: "¿Acertaste tus predicciones?" con checkbox (UX retro).
**Pulido espectacular:**
- Easter egg: el creador puede agregar "te diste esta carta hace X años" automático con date diff.

---

### 57. Casa Voladora UP — `casa-up`
**Estado:** ⬜ Pendiente · **Categoría:** Familia/Geek · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Una aventura juntos."
**Hook visual:** Casa amarrada con cientos de globos de colores ascendiendo sobre nubes. Cada globo carga una foto. Música épica.
**Tech:** Three.js + cloth physics (hilos) + instanced globos.
**Librerías nuevas:** ninguna.
**Reutiliza:** Patrón de #04 Globo Aerostático.
**Config fields:** `nombre_familia`, `aventuras[8]` con `{titulo, foto}`, `tema` (clasico-pixar, vintage-pastel, dorado-magico, lluvia-arcoiris), `musica` (default Giacchino-like).
**Pasos clave:**
1. Casita de madera GLB.
2. 200 globos InstancedMesh con colores variados.
3. Hilos atados con line segments + Verlet sim.
4. 8 globos especiales más grandes con fotos.
5. Cámara orbita ascendiendo con la casa.
**Pulido espectacular:**
- Mascota tipo Russell saludando desde el porche.
- Audio: cuerda + piano emotivo.

---

### 58. Tren Ghibli — `tren-ghibli`
**Estado:** ⬜ Pendiente · **Categoría:** Geek/Pareja Ghibli · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Un viaje sin destino y con todo el sentido."
**Hook visual:** Tren rodando sobre rieles inundados al atardecer (Spirited Away). POV desde dentro del vagón. Por la ventana pasan paisajes con tus fotos como pósters.
**Tech:** Three.js + scroll-driven + acuarela post-FX.
**Librerías nuevas:** `lenis`, `postprocessing`.
**Reutiliza:** `_shared/postFX.js`.
**Config fields:** `mensaje`, `fotos[8]`, `tema` (atardecer-spirited, lluvia-totoro, noche-mononoke, primavera-mary), `musica`.
**Pasos clave:**
1. Vagón interior 3D (vista desde asiento).
2. Por la ventana: paisaje en bucle scrolling con water plano abajo.
3. Estaciones lejanas pasan con carteles que muestran fotos.
4. Acuarela post-FX (multipass screen-space).
5. Música: Joe Hisaishi style.
**Pulido espectacular:**
- Sin-cara espíritu sentado al fondo del vagón.
- Reflejos del paisaje en el agua.

---

### 59. Upside Down (Stranger Things) — `upside-down`
**Estado:** ⬜ Pendiente · **Categoría:** Geek/Amistad 90s · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "En cualquier dimensión, somos amigos."
**Hook visual:** Versión "normal" de una habitación con tus fotos. Luego se voltea y entras al Upside Down con luces parpadeando, partículas oscuras flotantes. Letras del abecedario iluminadas formando mensaje.
**Tech:** Three.js + parallax overlay + custom post-FX (chromatic glitch).
**Librerías nuevas:** `postprocessing`.
**Reutiliza:** `_shared/postFX.js`.
**Config fields:** `grupo_amigos`, `mensaje` (palabras max 30 chars — se forma con bombillas), `fotos[6]`, `tema` (sombra-clasica, demogorgon-rojo, hawkins-amarillo, neón-80s), `musica` (default ST theme).
**Pasos clave:**
1. Habitación normal en pose A.
2. Animación de flip total a pose B (Upside Down).
3. Bombillas en una pared (string lights con alphabet letras dibujadas).
4. Una a una se encienden formando el mensaje.
5. Partículas oscuras flotantes ambient.
**Pulido espectacular:**
- Audio: ST theme + zumbido eléctrico + estática.
- Glitch shader leve constante.

---

### 60. Acuario Abisal — Bioluminiscencia — `acuario-abisal`
**Estado:** ⬜ Pendiente · **Categoría:** Único/Hipnótico · **Dificultad:** ★★★★★
**Objetivo emocional:** "Lo profundo brilla cuando estás cerca."
**Hook visual:** Cámara desciende al fondo oceánico oscuro. Medusas, peces abisales, plancton bioluminiscente. Tus fotos flotan como criaturas luminosas.
**Tech:** Three.js + custom subsurface scattering shader + GPU particles.
**Librerías nuevas:** `three-mesh-bvh`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Skill:** `webgpu-threejs-tsl`.
**Config fields:** `mensaje`, `fotos[8]`, `tema` (bioluminiscente-azul, abisal-violeta, profundidad-verde, fosa-roja), `musica`.
**Pasos clave:**
1. Cámara desciende lentamente con leve sway.
2. Medusas: SphereGeometry achatada con tentáculos LineSegment + emissive interno.
3. 2000 plancton GPU particles flotando.
4. Peces abisales con linterna emissive (anglerfish).
5. Fotos = "criaturas" flotando con halo brillante.
6. Presión submarina: post-FX blur ligero + chromatic.
**Pulido espectacular:**
- Audio: presión submarina + canto de ballena lejano.
- Ballena gigante cruza al fondo al final.

---

### 61. Pez Koi en Estanque — `pez-koi`
**Estado:** ⬜ Pendiente · **Categoría:** Naturaleza/Zen · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "La paz que me das."
**Hook visual:** Vista cenital de estanque con peces koi entre nenúfares. Cada pez al tocarlo abre una foto que emerge con ondas.
**Tech:** Three.js + water shader + IK swimming.
**Librerías nuevas:** ninguna.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `mensaje`, `fotos[6]`, `tema` (clasico-rojo-blanco, dorado, calico, oscuro-luna), `musica`.
**Pasos clave:**
1. Vista top-down (cámara mirando hacia abajo).
2. Agua con normal map ripples.
3. Peces low-poly con bone animation (IK natado).
4. Nenúfares flotantes.
5. Click en pez → ripple radial + foto emerge desde el agua.
**Pulido espectacular:**
- Música: koto japonés.
- Caen pétalos de cerezo en el agua.

---

### 62. Bandada de Pájaros V — `bandada-v`
**Estado:** ⬜ Pendiente · **Categoría:** Naturaleza/Libertad · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Vuela conmigo a donde sea."
**Hook visual:** Cielo dorado al atardecer con miles de pájaros en formación V. Se reorganizan formando letras del nombre.
**Tech:** Three.js + boids GPU + InstancedMesh.
**Librerías nuevas:** `three-mesh-bvh`.
**Reutiliza:** Idéntico a #14 Mariposas pero con pájaros (silueta más estilizada).
**Config fields:** `nombre`, `mensaje`, `fotos[5]`, `tema` (atardecer-fuego, alba-rosa, noche-azul, monocromo), `musica`.
**Pulido espectacular:**
- Sombras de los pájaros proyectadas en nubes.
- Audio: viento + alas.

---

### 63. Rompecabezas Armable — `rompecabezas`
**Estado:** ⬜ Pendiente · **Categoría:** Interactivo · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Arma la foto y descubre el mensaje."
**Hook visual:** Foto principal dividida en 16-30 piezas dispersas. El usuario arrastra y arma. Al completar: confetti + mensaje.
**Tech:** Canvas 2D + drag + snap-to-grid.
**Librerías nuevas:** `@use-gesture/react`.
**Reutiliza:** `_shared/AudioPlayer.jsx`.
**Config fields:** `foto_principal`, `dificultad` (4x4 / 5x5 / 6x6 piezas), `mensaje_completar`, `tema` (piezas-madera, piezas-cartón, piezas-metal, neón), `musica`.
**Pasos clave:**
1. Canvas dividido en grid.
2. Cada pieza es un sub-canvas con shape de jigsaw (bezier curves).
3. Drag con use-gesture, snap si cerca de su posición correcta.
4. Al completar: pieza final encaja con tilt animación, mensaje aparece.
**Pulido espectacular:**
- Audio: clic al unir piezas + chime al completar.
- Sombra debajo de cada pieza arrastrada.

---

### 64. Escape Room Romántico — `escape-room`
**Estado:** ⬜ Pendiente · **Categoría:** Interactivo/Propuesta · **Dificultad:** ★★★★★
**Objetivo emocional:** "Resuelve nuestra historia para llegar a mí."
**Hook visual:** Habitación 3D con candados, cajones, pistas escondidas. Cada pista resuelta revela una foto. Candado final pide la fecha del aniversario o iniciales.
**Tech:** Three.js + state machine de puzzle.
**Librerías nuevas:** `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/gltfLoader.js`.
**Config fields:** `pistas[4]` con `{tipo: numero|texto|imagen, respuesta, hint, foto_recompensa}`, `respuesta_final` (texto, ej. fecha o "TE AMO"), `mensaje_final_grande`, `tema` (clasica-madera, gotica-piedra, moderna-tech, romantica-victoriana), `musica`.
**Archivos:**
- `src/templates/escape-room/index.jsx`
- `src/templates/escape-room/config.js`
- `src/templates/escape-room/usePuzzle.js`
- `src/templates/escape-room/Candado.jsx`
- `src/templates/escape-room/style.css`
**Pasos clave:**
1. Habitación 3D con objetos clicables: cuadro, cajón, libro, candado.
2. Cada objeto al click revela una pista (acertijo + foto pista).
3. Inputs numéricos/texto para resolver.
4. Estado en localStorage para que el progreso no se pierda.
5. Candado final con input. Si correcto: puerta se abre + escena final.
**Pulido espectacular:**
- Audio: tic-tac de reloj + clic de candados + chime al acertar.
- Pista difícil con cifrado César o emojis-to-fecha.

---

### 65. Pastel de Cumpleaños 3D — `pastel-cumple`
**Estado:** ⬜ Pendiente · **Categoría:** Celebración/Cumple · **Dificultad:** ★★★★☆
**Objetivo emocional:** "Sopla las velas y pide un deseo conmigo."
**Hook visual:** Pastel decorado con velas encendidas. Destinatario "sopla" (mic input o click). Velas se apagan + pastel se abre revelando mensaje + fotos.
**Tech:** Three.js + Web Audio API (detección de soplido por volumen) + GLB pastel.
**Librerías nuevas:** ninguna específica (Web Audio nativo).
**Reutiliza:** `_shared/postFX.js`, `_shared/useAudioReactive.js`.
**Config fields:** `cumpleaños_de`, `edad`, `mensaje`, `fotos[6]`, `tema` (rosa-clasico, chocolate-elegante, multicolor-fiesta, oro-luxe), `musica` (default "happy birthday").
**Pasos clave:**
1. Pastel GLB con N velas encendidas (donde N = edad).
2. Cada vela: flame shader animado + PointLight.
3. Mic input via `navigator.mediaDevices.getUserMedia` + AnalyserNode.
4. Cuando RMS > threshold por >200ms = "soplido detectado". Velas se apagan progresivamente.
5. Pastel se abre tipo flor: rebanadas se separan revelando interior con sorpresa.
6. Sorpresa: fotos emergen flotando + mensaje grande.
**Pulido espectacular:**
- Humo gris saliendo de velas apagadas.
- Confetti final.
- Si no hay mic: botón "soplar" como fallback.

---

### 66. Caja de Bombones Premium — `caja-bombones`
**Estado:** ⬜ Pendiente · **Categoría:** Celebración/San Valentín · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Cada bombón es un sabor de nosotros."
**Hook visual:** Caja Godiva 3D. Al abrir, 12 bombones con sabores diferentes. Cada bombón al tocarlo "se derrite" revelando recuerdo.
**Tech:** Three.js + GLB bombones + shader derretir.
**Librerías nuevas:** `@react-three/rapier` (caja se abre con tapa que cae).
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`.
**Config fields:** `bombones[12]` con `{sabor, foto, mensaje}`, `tema` (godiva-dorado, lindt-rojo, ferrero-cafe, artesanal-pastel), `musica`.
**Pasos clave:**
1. Caja GLB con tapa. Click → tapa se levanta con animación + sonido papel.
2. 12 bombones en grid (InstancedMesh con variaciones de geometría).
3. Click en bombón: hover scale + derretir shader (vertex displacement downward).
4. Foto emerge desde el bombón derretido.
**Pulido espectacular:**
- Caustics dorados desde la luz.
- Borde de la caja con foil dorado.
- Audio: papel de seda crujiendo.

---

### 67. Champagne Dorada — `champagne`
**Estado:** ⬜ Pendiente · **Categoría:** Celebración/Aniversario/Año Nuevo · **Dificultad:** ★★★☆☆
**Objetivo emocional:** "Celebremos lo nuestro como se merece."
**Hook visual:** Botella se descorcha con sonido real + chorro de burbujas doradas. Cada burbuja contiene una foto. Confetti dorado final.
**Tech:** Three.js + GPU particles + Rapier (corcho).
**Librerías nuevas:** `@react-three/rapier`, `gsap`.
**Reutiliza:** `_shared/postFX.js`, `_shared/floatingPhoto.jsx`, `canvas-confetti`.
**Config fields:** `celebracion_titulo`, `fotos[6]`, `tema` (dom-perignon-dorado, rose-rosa, blanc-de-blanc, crystal-cristal), `musica`.
**Pasos clave:**
1. Botella GLB con label custom (canvas texture con el titulo).
2. Click → corcho salta con Rapier (impulso vertical).
3. Chorro de burbujas: 1000 sphere particles emissive dorado ascendiendo.
4. Cada 100 burbujas: una grande con foto dentro flota más lentamente.
5. Confetti final con `canvas-confetti` en oro.
**Pulido espectacular:**
- Copas de cristal en mesa de fondo.
- Audio: descorche real + chorro + risas.
- Easter egg: año actual aparece grabado en la botella.

---

## 6. Notas finales

### Re-uso esperado entre proyectos
- **`_shared/postFX.js`** se usa en ~60 de los 67.
- **`_shared/floatingPhoto.jsx`** se usa en ~50.
- **`_shared/useTheme.js`** se usa en TODOS.
- **`_shared/seededRandom.js`** se usa en ~25 (escenas procedurales).
- **`_shared/AudioPlayer.jsx`** se usa en ~55 (todos los que tienen música opcional).
- **`_shared/textTexture.js`** se usa en ~30 (cualquiera con texto en escena 3D).

### Cómo continuar entre sesiones
1. Al iniciar sesión, lee `MEMORY.md` + `DEPENDENCIAS_PROYECTOS.md` + este archivo.
2. Busca el primer proyecto con `**Estado:** ⬜ Pendiente` en el orden recomendado.
3. Si ese proyecto bloquea por algún asset/lib, márcalo `🔒 Bloqueado: razón` y pasa al siguiente.
4. Al terminar, actualiza:
   - La línea `**Estado:**` del proyecto.
   - La tabla de estado §4 (cambiar ⬜ por ✅).
   - Registrar en `src/lib/templateRegistry.jsx` y `src/lib/templates.js`.
   - Confirmar Definition of Done §0.
5. Comitea con mensaje: `feat(templates): {slug} — {nombre}`.

### Política de merge entre proyectos similares
Si dos proyectos comparten >60% del código (ej. #10 Boutique y #31 Pociones), considera:
- **Opción A:** mantenerlos separados pero con `_shared/{patron-comun}.js`.
- **Opción B:** mergear como variantes del mismo template con un campo `variante` en config.

Decisión queda al criterio del owner por proyecto.
