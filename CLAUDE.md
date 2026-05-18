# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Pipeline de plantillas espectaculares (LEER PRIMERO)

Hay **67 plantillas premium planeadas** documentadas en dos archivos. **Antes de crear cualquier plantilla nueva del pipeline, lee ambos** en este orden:

1. **[DEPENDENCIAS_PROYECTOS.md](./DEPENDENCIAS_PROYECTOS.md)** — qué librerías ya están instaladas, qué falta instalar, comando único de setup, skills de Claude a usar, reglas de oro (no negociables), convenciones de import.
2. **[PROYECTOS_PIPELINE.md](./PROYECTOS_PIPELINE.md)** — los 67 proyectos detallados con: estado, categoría, dificultad, objetivo emocional, hook visual, tech stack, librerías por proyecto, archivos a crear, pasos clave, pulido espectacular, y **Definition of Done** obligatoria.

### Flujo cuando el usuario pida "crea el siguiente proyecto del pipeline"

1. Abre `PROYECTOS_PIPELINE.md` y busca el **primer proyecto** cuyo `**Estado:**` siga siendo `⬜ Pendiente` siguiendo el **orden recomendado** de la §2 del pipeline (Bloque 0 → Bloque 1 → Bloque 2 → Bloque 3).
2. Si el Bloque 0 (carpeta `src/templates/_shared/` con helpers) NO existe aún, créalo ANTES de empezar cualquier plantilla. Sin esto, todo el pipeline pierde su ventaja de reuso.
3. Implementa el proyecto siguiendo la sección detallada §5 del pipeline. Reutiliza lo listado en "Reutiliza:". Instala SOLO las librerías de "Librerías nuevas:" si no están ya.
4. Cumple **TODA** la "Definition of Done" §0 del pipeline antes de marcar el proyecto como completo.
5. Al terminar, **edita la línea `**Estado:**` del proyecto** y reemplaza `⬜ Pendiente` por `✅ Creado (YYYY-MM-DD)` con la fecha real. **Actualiza también la tabla §4** del pipeline (cambiar ⬜ por ✅ en la fila correspondiente).
6. Registra la plantilla en `src/lib/templateRegistry.jsx` y `src/lib/templates.js` como cualquier plantilla normal.
7. NO marques como ✅ si: la plantilla no abre en `/template/{id}` o `/view/{id}`, baja de 60fps en mobile, le faltan temas, hay emojis en UI, o falla cualquier ítem de la Definition of Done.

### Si te bloqueas en un proyecto del pipeline
Marca su línea como `**Estado:** 🔒 Bloqueado: {razón concreta}` (ej. "falta modelo GLB de carrusel" o "API de astronomy-engine no soporta hora local"), y pasa al siguiente del orden recomendado. NO dejes proyectos en `🚧 En progreso` entre sesiones sin razón.

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

Las tres rutas usan `React.lazy` + `Suspense` — cada página es un chunk JS independiente.
`Sentry.ErrorBoundary` en `App.jsx` captura crashes y muestra fallback "Recargar" en lugar de pantalla blanca.

### Flujo de datos principal

```
Home → /template/:id (Preview)
  └─ Click "Personalizar" abre CustomizeModal
       ├─ Valida magic bytes del archivo (client-side, UX)
       ├─ Comprime imágenes a WebP (max 500 KB) con browser-image-compression
       ├─ POST → Edge Function upload-file (rate limit 60/hora/IP + validación server-side)
       └─ Edge Function sube a bucket Supabase: archivos_usuarios → retorna URL pública
  └─ onSave(formData) en Preview.jsx
       ├─ Genera ID único con crypto.randomUUID()
       ├─ POST → Edge Function create-project (rate limit 10/hora/IP)
       ├─ Edge Function inserta en tabla proyectos_creados: { id, template_id, user_data: JSONB }
       └─ Abre ShareModal con el link /view/{id}

/view/:id (ViewGift)
  └─ Fetch directo de proyectos_creados por ID → renderiza plantilla con user_data
```

### Sistema de plantillas

Cada plantilla vive en `src/templates/{nombre}/` y expone exactamente dos archivos obligatorios:

- **`index.jsx`** — componente visual, recibe `{ data, isPreview }` como props
- **`config.js`** — array de campos para el modal de personalización

**El sistema NO usa switch(id) en Preview/ViewGift.** Todas las plantillas están registradas en:

- **`src/lib/templateRegistry.jsx`** — fuente única de verdad. Exporta `TEMPLATE_REGISTRY`: objeto que mapea `template_id → { Component, config }`. Los componentes son `React.lazy()` — cada template es su propio chunk JS (code splitting automático).

`Preview.jsx` y `ViewGift.jsx` leen el registry por `id`/`template_id` y renderizan el componente con `<Suspense>`.

### Cómo agregar una nueva plantilla

1. Crear `src/templates/{id}/index.jsx` y `src/templates/{id}/config.js`
2. Agregar al catálogo en `src/lib/templates.js` (para que aparezca en Home)
3. Agregar al registry en `src/lib/templateRegistry.jsx`:
   ```js
   const NuevaPlantilla = React.lazy(() => import('../templates/{id}/index.jsx'));
   // en TEMPLATE_REGISTRY:
   '{id}': { Component: NuevaPlantilla, config: nuevaPlantillaConfig },
   ```
4. **No tocar** `Preview.jsx` ni `ViewGift.jsx` — el registry lo maneja todo.

Excepción: `rosa-virtual` usa `RosaCreator` (modal propio) en lugar de `CustomizeModal`. Si el nuevo template necesita modal custom, ver ese caso en `Preview.jsx`.

### Backend (Supabase)

- Cliente singleton: `src/lib/supabase.js` — usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- **Tabla principal:** `proyectos_creados` — columna `user_data` es JSONB. Solo se escribe vía Edge Function `create-project`.
- **Bucket storage:** `archivos_usuarios` — imágenes y audio. Solo acepta uploads desde la Edge Function `upload-file` (política INSERT eliminada para anon role).
- **Tabla secundaria:** `sugerencias` — feedback de usuarios desde `FeedbackModal`.
- **Tabla de rate limiting:** `rate_limit_logs` — registra IP + endpoint + timestamp. Limpiar periódicamente con: `DELETE FROM rate_limit_logs WHERE created_at < NOW() - INTERVAL '2 hours';`

### Edge Functions (Supabase Deno)

Ubicadas en `supabase/functions/`. Desplegadas en Supabase Dashboard → Edge Functions.

| Función | Límite | Qué hace |
|---------|--------|----------|
| `submit-feedback` | 5/hora/IP | Guarda sugerencias de usuarios |
| `create-project` | 10/hora/IP | Inserta en `proyectos_creados` con service role |
| `upload-file` | 60/hora/IP | Valida magic bytes + tamaño + sube a Storage |

Todas usan `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (disponibles automáticamente en el runtime de Supabase).

### Límites de uploads por usuario

- Máximo **10 fotos por campo** de tipo file (definido por `MAX_FILES_PER_UPLOAD = 10` en `CustomizeModal.jsx`)
- Tamaño máximo: 8 MB por imagen, 15 MB por audio
- Imágenes siempre convertidas a WebP (max 500 KB) antes de enviarse a la Edge Function

### Estado

Sin Redux ni Context global. Cada página maneja su estado local con `useState`. Los datos del regalo se obtienen desde Supabase vía `useParams` + fetch directo en el componente.

### Observabilidad

- `@sentry/react` instalado. Se activa solo si `VITE_SENTRY_DSN` está definido en `.env`.
- `Sentry.ErrorBoundary` en `App.jsx` siempre activo (captura crashes independientemente de la cuenta Sentry).

### Notas de implementación

- `src/lib/antiInspect.jsx` bloquea las DevTools. Está importado pero comentado en Preview.jsx — solo activo en Home si se re-envuelve.
- El vendor splitting en `vite.config.js` separa React, Supabase, Three.js/Swiper/QRCode en chunks independientes.
- Fuentes cargadas vía `@fontsource/dancing-script` y `@fontsource/pacifico`.
- `viernes-13` y `prueba-conex` apuntan al mismo componente en el registry (compatibilidad con registros legacy en BD).

## Reglas de Diseño "Otro Nivel"

- **CERO EMOJIS:** No usar emojis en ninguna parte de la aplicación.
- **SVGs PREMIUM:** Los iconos deben ser SVGs profesionales buscados en [Iconscout o similares](https://iconscout.com/).
- **COLORES DINÁMICOS:** Todos los SVGs deben usar `fill="currentColor"` para adaptarse automáticamente a la paleta del tema seleccionado en `config.js`.

## Plantillas actuales

| ID | Nombre |
|----|--------|
| `viernes-13` | Viernes 13 |
| `dia-mujer` | Día de la mujer |
| `rosa-virtual` | Rosa virtual (modal propio: RosaCreator) |
| `flores-amarillas` | Flores amarillas |
| `pregunta` | Pregunta |
| `flores-corazones` | Flores y Corazones |
| `girasoles` | Girasoles |
| `hot-wheels` | Ramo Hot Wheels |
| `corazon-carrusel` | Corazón Carrusel |
| `corazon-animado` | Corazón Animado |
| `libro-pop` | Libro Pop-up |
| `caja-musical` | Caja Musical |
| `corazon-mensaje` | Corazón Mensaje |
| `flores-para-ti` | Flores Para Ti |
| `app-recuerdos` | App Recuerdos |
| `sorpresa-romantica` | Sorpresa Romántica |
| `galaxia-momentos` | Galaxia de Momentos (Three.js) |
| `vuelo-global` | Vuelo Global (Three.js + MapLibre) |
| `arbol-madre` | Árbol de Momentos — Mamá (Three.js) |
| `jardin-madre` | Jardín de Recuerdos — Mamá (Three.js) |
