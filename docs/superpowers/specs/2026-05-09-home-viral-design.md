# Home Viral-First (Neon Showcase) - Design Spec

Fecha: 2026-05-09
Estado: Aprobado por usuario ("go")

## Objetivo
- Hacer la Home mas profesional y viral sin tocar los templates existentes.
- Priorizar viralidad TikTok y conversion rapida a "Crear regalo".
- Mantener estilo neon con fondo premium suave para mejorar legibilidad.

## Alcance
- Solo Home y secciones globales (header/footer y bloques nuevos).
- No se modifica el contenido ni estilos internos de templates.

## Direccion visual
- Neon Showcase (continuar vibe actual) con brillo controlado.
- Fondo premium suave: nebulosa sutil + polvo estelar, menos saturado.
- Tipografia: mantener tono neon, con cuerpos mas legibles.

## Estructura final de Home (orden)
1. Header con navegacion corta
2. Hero romantico + CTA principal
3. Plantillas virales (Top 5 de la semana)
4. Reto semanal (TikTok)
5. Carrusel completo de plantillas
6. Como funciona (3 pasos)
7. Apoyanos (Yape en Peru, Ko-fi/PayPal fuera)
8. Comunidad WhatsApp
9. FAQ breve
10. Footer

## Copy base (tono romantico, directo)
- Titulo hero: "Convierte tus recuerdos en un regalo que enamora."
- Subcopy: "Personaliza en minutos, comparte un link y sorprende hoy."
- CTA principal: "Crear regalo"
- CTA secundario: "Ver plantillas"
- Reto semanal: "Reto #AmorEterno — crea el tuyo y subelo a TikTok"

## Seccion Apoyanos (deteccion por pais)
- Detectar locale por navegador (navigator.language / Intl).
- Peru: boton Yape + texto "Apoya el proyecto desde Peru".
- Otros paises: boton Ko-fi o PayPal + texto "Apoya desde cualquier pais".
- Fallback: selector manual si no se puede detectar locale.

## Componentes / Bloques nuevos
- Bloque "Plantillas virales" (top 5)
- Bloque "Reto semanal"
- Bloque "Apoyanos" con deteccion de pais
- Bloque "FAQ breve" (4 preguntas)
- Ajustes de header y footer

## Reglas de compatibilidad
- No alterar estructura de templates ni sus estilos internos.
- Los nuevos bloques se inyectan solo en Home.

## Accesibilidad y UX
- Botones con contraste suficiente sobre fondo oscuro.
- Estados de hover/active claros en CTAs.
- Tipografia con tamanos minimos legibles en mobile.

## Exitos esperados
- Mejor tiempo de decision del usuario (CTA visible en hero).
- Mayor viralidad por seccion de reto semanal.
- Apariencia mas profesional sin perder identidad neon.

## Fuera de alcance
- Cambios en Preview/ViewGift.
- Refactor de templates existentes.
- Backend o cambios de datos en Supabase.
