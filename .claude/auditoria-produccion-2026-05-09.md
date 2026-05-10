# Auditoria preproduccion (2026-05-09)

Contexto
- RLS en Supabase ya activas.
- Edge Function de feedback con rate limit por IP (5/hora).
- Objetivo: evaluar si pueden tumbar la pagina, performance en gama baja, legibilidad, seguridad real.

Stack detectado
- Frontend: React + Vite.
- Backend: Supabase (DB + Storage + Edge Functions).
- Dependencias pesadas: three, maplibre-gl, @turf/turf, swiper.

Veredicto general
- NO lo soltaria hoy a produccion.
- Riesgo principal: abuso de uploads + bundle monolitico que impacta carga en moviles y redes lentas.

Riesgos criticos (incidentes / disponibilidad)
1) Subida directa a Storage desde cliente (sin autenticacion ni rate limit server-side).
   - Aunque el formulario valida magic bytes y tamanos, es solo frontend.
   - Un atacante puede usar la anon key y subir masivamente archivos, disparando costos y saturando storage.
   - Evidencia: [src/components/CustomizeModal.jsx](src/components/CustomizeModal.jsx#L100-L189)

2) Bundle monolitico de templates.
   - Todos los templates se importan estaticamente en Preview y ViewGift.
   - Esto fuerza a descargar librerias 3D y mapas aunque se use un template simple.
   - Impacto: TTI alto en moviles, rebote alto y posible bloqueo por memoria.
   - Evidencia: [src/pages/Preview.jsx](src/pages/Preview.jsx#L10-L72), [src/pages/ViewGift.jsx](src/pages/ViewGift.jsx#L4-L27)

3) Rutas sin lazy-loading.
   - App carga todo desde el primer render; no hay React.lazy/Suspense en rutas.
   - Impacto: ralentiza home y preview innecesariamente.

Riesgos medios (calidad, UX, seguridad real)
1) Sanitizacion de texto destructiva.
   - sanitizeText elimina comillas y apostrofes y degrada el mensaje del usuario.
   - React ya escapa texto por defecto si no se usa dangerouslySetInnerHTML.
   - Evidencia: [src/components/CustomizeModal.jsx](src/components/CustomizeModal.jsx#L191-L205)

2) AntiInspectGuard es antipatron.
   - Bloquea DevTools pero no detiene abuso real.
   - Puede causar falsos positivos en resoluciones raras o zoom.
   - Evidencia: [src/lib/antiInspect.jsx](src/lib/antiInspect.jsx)

3) Manejo de errores UX pobre.
   - Uso de alert() rompe la experiencia y no deja trazas persistentes.
   - Evidencia: [src/components/CustomizeModal.jsx](src/components/CustomizeModal.jsx#L111-L154)

4) CSP permite style-src 'unsafe-inline'.
   - Reduce proteccion ante inyecciones de estilos si se inyecta HTML.
   - Evidencia: [public/_headers](public/_headers#L1-L3)

5) Observabilidad casi nula.
   - Fallos de compresion o render 3D pueden dejar pantallas en blanco sin tracking.

Supabase (lo que SI esta bajo control)
- RLS activas en sugerencias y rate_limit_logs.
- Edge Function con rate limit (5/hora) para feedback.
- Politicas actuales: bloquear lectura de sugerencias; insert desde functions.
- Nota: aun con RLS, storage public sigue siendo vector de abuso por volumen.

Detalle de Edge Function (feedback)
- Rate limit server-side implementado por IP.
- Usa service role key en function, inserta en sugerencias y rate_limit_logs.
- Debe asegurar CORS y verificar payload minimo (ya existe).
- Falta autenticar origen real del request (cualquier origen puede llamar).

Deteccion de posibles formas de "tumbar" la pagina
- Spam de uploads: saturar storage/egress o costos.
- Bundle pesado: dispositivos low-end con poca RAM pueden crashear o quedarse en blanco.
- Dependencias externas (mapas, OSRM, Nominatim): si fallan, la UX se degrada sin fallback.

Checklist de produccion (accionable)
- Performance: aplicar code splitting con React.lazy en rutas y templates.
- Storage: mover uploads a Edge Function y validar size/tipo server-side.
- Storage: si se mantiene publico, limitar buckets y rate limit por IP.
- UX: reemplazar alert() por toasts no bloqueantes.
- Texto: remover sanitizacion destructiva; validar longitud y caracteres peligrosos solo si se usa HTML.
- Seguridad: revisar CSP para reducir unsafe-inline si es viable.
- Observabilidad: agregar Sentry o logging centralizado.
- Resiliencia: agregar UI de error y estados de carga consistentes.

Mi opinion honesta (resumen)
- El producto visual es fuerte, pero la base tecnica aun no aguanta carga real ni abuso.
- El mayor riesgo no es hacking sofisticado: es abuso barato (uploads masivos) y performance en moviles.
- Si resuelves code splitting y control server-side en uploads, el proyecto queda cerca de listo.

Notas sobre politicas SQL aportadas
- Storage bucket es publico con select/insert abiertos.
- proyectos_creados: policies actuales deben revisarse para evitar insert directo si se requiere solo via function.
- sugerencias: lectura bloqueada, insert desde functions OK.
- rate_limit_logs: insert abierto (OK si solo function lo usa, pero ideal restringir).
