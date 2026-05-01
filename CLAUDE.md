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
