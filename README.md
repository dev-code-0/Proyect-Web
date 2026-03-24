# Plataforma de Regalos Virtuales (SaaS)

Plataforma escalable construida con React, Vite y Supabase para generar regalos interactivos y dinámicos con enlaces únicos y códigos QR.

## Tecnologías e Instalaciones

- **React + Vite:** Para el frontend rápido y modular (`npm create vite@latest`).
- **React Router DOM:** Para manejar las rutas (`/`, `/template/:id`, `/view/:id`).
- **Supabase JS:** Actúa como Backend, Base de Datos (PostgreSQL) y Storage (`npm install @supabase/supabase-js`).
- **Browser Image Compression:** Comprime imágenes a WebP antes de subirlas para optimizar almacenamiento y velocidad (`npm install browser-image-compression`).
- **QRCode React:** Generador visual de códigos QR (`npm install qrcode.react`).

## Arquitectura de Carpetas y Conexiones

El proyecto está diseñado para separar la interfaz general de los proyectos individuales.

- `/src/components/`: Contiene piezas globales de la UI (Modales, Botones, Carrusel).
- `/src/pages/`: Las tres vistas principales de la web (Home, Preview, ViewGift).
- `/src/templates/`: Aquí vive cada proyecto individual.
- `/src/lib/`: Configuraciones de servicios externos (`supabase.js` y el catálogo `templates.js`).

## Flujo de Datos y Modal Dinámico

El corazón del sistema es el componente `CustomizeModal.jsx`. 
Es un modal "camaleón". No tiene inputs fijos. Funciona así:

1. El usuario entra a la vista de un template (Preview).
2. El Preview importa el archivo `config.js` exclusivo de ese template.
3. El `config.js` dicta qué campos se necesitan (ej. texto para nombre, archivo múltiple para fotos).
4. El modal lee el `config.js` y dibuja los inputs correspondientes dinámicamente.

## Exportación a Base de Datos (Supabase)

Cuando el usuario da clic en "Continuar":
1. **Multimedia:** Si hay imágenes, `browser-image-compression` las intercepta, las convierte a `.webp` (max 500kb) y las sube al bucket `archivos_usuarios` de Supabase.
2. **URLs:** Supabase devuelve los links públicos de esos archivos.
3. **JSONB:** Todos los datos (textos y links de archivos) se empaquetan en un objeto JSON.
4. **Guardado:** Se genera un ID único (ej. `x7k9p`) y se inserta una fila en la tabla `proyectos_creados` con el ID, el nombre del template y el JSON de datos.
5. **Generación:** Se crea el link `dominio.com/view/ID` y su QR.

## Guía: Cómo agregar un nuevo proyecto a futuro

Para escalar la plataforma y agregar un diseño nuevo, sigue estrictamente estos 4 pasos:

**Paso 1: Crear la estructura del template**
Crea una carpeta nueva en `/src/templates/nombre-proyecto/` con tres archivos:
- `index.jsx`: El componente visual. Debe recibir los datos a través de la prop `{ data }`.
- `style.css`: Estilos encapsulados para no afectar el resto de la web.
- `config.js`: Define el array de campos requeridos para el modal.

**Paso 2: Registrar en el catálogo**
Abre `/src/lib/templates.js` y agrega el nuevo proyecto al array exportado para que aparezca en el carrusel principal de la página Home.

**Paso 3: Conectar a la previsualización**
Abre `/src/pages/Preview.jsx`.
- Importa el componente visual (`index.jsx`) y su `config.js`.
- Agrégalo al `switch(id)` dentro de la función `renderTemplate()` pasándole `previewData`.
- Agrégalo a la función `getConfig()` para que el modal sepa qué pedir.

**Paso 4: Conectar a la vista final**
Abre `/src/pages/ViewGift.jsx`.
- Importa el componente visual.
- Agrégalo al `switch` final pasándole `projectData.user_data`.