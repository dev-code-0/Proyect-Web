# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev       # servidor de desarrollo Vite
npm run build     # build de producción → /dist
npm run lint      # ESLint
npm run preview   # sirve el build local
```

No hay tests configurados.

## Arquitectura

Plataforma SaaS de regalos virtuales interactivos. El usuario elige una plantilla, la personaliza con fotos/música/texto, y recibe un enlace único para compartir.

### Rutas (App.jsx)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | `Home` | Carrusel de plantillas disponibles |
| `/template/:id` | `Preview` | Personalización de la plantilla seleccionada |
| `/view/:id` | `ViewGift` | Vista final del regalo para el destinatario |

### Flujo de datos principal

```
Home → /template/:id (Preview)
  └─ Click "Personalizar" abre CustomizeModal
       ├─ Comprime imágenes a WebP (max 500 KB) con browser-image-compression
       ├─ Sube archivos al bucket Supabase: archivos_usuarios
       └─ Retorna URLs públicas
  └─ onSave(formData) en Preview.jsx
       ├─ Genera ID único
       ├─ Inserta en Supabase tabla proyectos_creados: { id, template_id, user_data: JSONB }
       └─ Abre ShareModal con el link /view/{id}

/view/:id (ViewGift)
  └─ Fetch de proyectos_creados por ID → renderiza plantilla con user_data
```

### Sistema de plantillas

Cada plantilla vive en `src/templates/{nombre}/` y expone exactamente dos archivos obligatorios:

- **`index.jsx`** — componente visual, recibe `{ data }` como prop
- **`config.js`** — array de campos para el modal de personalización

`Preview.jsx` y `ViewGift.jsx` usan un `switch(id)` para seleccionar qué plantilla renderizar. Al agregar una nueva plantilla hay que actualizar ambos switches y el catálogo en `src/lib/templates.js`.

### Backend (Supabase)

- Cliente exportado como singleton desde `src/lib/supabase.js`, inicializado con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Tabla principal: `proyectos_creados` — columna `user_data` es JSONB.
- Bucket de storage: `archivos_usuarios` — imágenes y audio de los usuarios.
- Tabla secundaria: `sugerencias` — feedback de usuarios desde `FeedbackModal`.

### Estado

Sin Redux ni Context global. Cada página maneja su estado local con `useState`. Los datos del regalo se obtienen desde Supabase vía `useParams` + fetch directo en el componente.

### Notas de implementación

- `src/lib/antiInspect.jsx` bloquea las DevTools en la página principal (`Home` está envuelta en `<AntiInspectGuard>`).
- El vendor splitting en `vite.config.js` separa React, Supabase, Three.js/Swiper/QRCode en chunks independientes.
- Fuentes cargadas vía `@fontsource/dancing-script` y `@fontsource/pacifico`.

## Roadmap de Próximos Templates

Las 8 plantillas acordadas para construir, en orden de prioridad sugerido. Al crear una nueva, seguir el patrón estándar: `src/templates/{id}/index.jsx` + `src/templates/{id}/config.js`, luego actualizar `src/lib/templates.js`, `Preview.jsx` y `ViewGift.jsx`.

### Reglas de Diseño "Otro Nivel"
- **CERO EMOJIS:** No usar emojis en ninguna parte de la aplicación.
- **SVGs PREMIUM:** Los iconos deben ser SVGs profesionales buscados en [Iconscout o similares](https://iconscout.com/). 
- **COLORES DINÁMICOS:** Todos los SVGs deben usar `fill="currentColor"` para adaptarse automáticamente a la paleta del tema seleccionado en `config.js`.

### 1. Galaxia de Momentos (`galaxia-momentos`)
**Concepto:** Escena Three.js navegable en primera persona. Las fotos del usuario flotan como planetas/estrellas en un espacio 3D. El receptor puede hacer clic en cada foto para expandirla con su descripción. Fondo de nebulosa generado con ShaderMaterial.  
**Campos:** hasta 6 fotos con pie de foto, nombre de la "galaxia", mensaje central, canción de fondo.  
**Dificultad:** Alta — requiere Three.js OrbitControls, TextureLoader, ShaderMaterial.  
**Impacto visual:** ★★★★★ — el más diferenciador del catálogo actual.

### 2. Videocasete VHS del Amor (`vhs-recuerdos`)
**Concepto:** Simulación de reproductor VHS retro. Al "insertar" el casete arranca una secuencia de fotos con glitch CRT, ruido de scanlines (Canvas), efecto de rebobinado. Estética 80s/90s con colores neón y tipografía pixel.  
**Campos:** 4–6 fotos, "título" del casete, año grabado, mensaje en la etiqueta adhesiva, canción.  
**Dificultad:** Media-Alta — Canvas filters para scanlines/glitch, animación CSS para cassette.  
**Impacto visual:** ★★★★★ — muy viral por la nostalgia.

### 3. Drive-In de Recuerdos (`drive-in`)
**Concepto:** Escena Canvas nocturna de un autocine. Autos pixelados en filas, pantalla gigante que reproduce un slideshow de fotos del usuario con transiciones cinematográficas. Estrellas animadas, luces de autos parpadeantes.  
**Campos:** 4–8 fotos, nombre de la película, mensaje en marquesina, canción.  
**Dificultad:** Media-Alta — Canvas 2D para escena completa, requestAnimationFrame.  
**Impacto visual:** ★★★★★ — escena única, no existe en ningún competidor.

### 4. Álbum de Vinilo Interactivo (`vinilo-interactivo`)
**Concepto:** Tocadiscos 3D (Three.js o CSS 3D) con dos caras. Cara A = fotos/momentos, Cara B = carta de amor. El disco gira con la música, la aguja se puede levantar/bajar. Al girar el vinilo físicamente (drag) cambia de cara.  
**Campos:** portada del álbum (foto), 4 fotos cara A, carta cara B, canción, nombre del álbum.  
**Dificultad:** Alta — Three.js + drag interaction + sincronización con audio.  
**Impacto visual:** ★★★★☆

### 5. Polaroids que Caen (`polaroids`)
**Concepto:** Fotos Polaroid con física real (matter.js o física propia) que caen desde arriba y se apilan en el suelo con rotación aleatoria. Al hacer clic en una, se expande mostrando el pie de foto. Fondo de madera o corcho. Efecto de revelado fotográfico al cargar.  
**Campos:** 6–8 fotos con pie de foto, mensaje principal, canción de fondo.  
**Dificultad:** Media — CSS transforms + física simplificada con requestAnimationFrame.  
**Impacto visual:** ★★★★☆

### 6. Carta desde el Futuro (`carta-futuro`)
**Concepto:** Máquina de escribir vintage animada que teclea una carta personalizada calculando dinámicamente el tiempo de relación ("Llevamos X años, Y meses y Z días juntos…"). Al terminar, una foto aparece con efecto de revelado. Papel envejecido, sello de correos animado.  
**Campos:** fecha de inicio de la relación, nombre de la pareja, foto revelada, mensaje adicional, canción.  
**Dificultad:** Media — typewriter effect + cálculo de tiempo dinámico + CSS paper texture.  
**Impacto visual:** ★★★★☆ — muy emocional, alta conversión.

### 7. Mapa de sus Lugares (`mapa-lugares`)
**Concepto:** Mapa ilustrado estilo vintage/acuarela (SVG o Canvas) con pines interactivos en los lugares especiales de la pareja. Al hacer clic en un pin se abre una tarjeta con foto, fecha y descripción del lugar. Línea animada que conecta los puntos cronológicamente.  
**Campos:** hasta 5 lugares (nombre, descripción, foto, coordenadas aproximadas o ciudad), mensaje central, canción.  
**Dificultad:** Media — SVG interactivo + sistema de coordenadas relativas al mapa ilustrado.  
**Impacto visual:** ★★★★☆ — muy personal y memorable.

### 8. Cómic de Amor (`comic-amor`)
**Concepto:** Viñetas estilo cómic con filtros pop-art (CSS `filter: contrast() saturate()` + halftone Canvas). Las fotos del usuario se convierten en ilustraciones. Globos de diálogo con el texto personalizado. Onomatopeyas animadas (¡POW! ¡BOOM! ❤️).  
**Campos:** 4–6 fotos con diálogo de globo, título del cómic, nombres de los personajes, mensaje final, canción.  
**Dificultad:** Media — Canvas halftone filter + CSS pop-art + layout de viñetas responsivo.  
**Impacto visual:** ★★★☆☆ — original y divertido.
