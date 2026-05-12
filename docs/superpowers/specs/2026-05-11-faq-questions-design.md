# FAQ — Preguntas Frecuentes (`/questions`)

## Scope

Nueva ruta `/questions` con acordeón de preguntas frecuentes, link en footer, y banner inferior hacia `/suggestions`.

---

## Ruta y registro

- Nueva ruta: `/questions` en `App.jsx` con `React.lazy`
- Nueva página: `src/pages/Questions.jsx`
- Nuevo CSS: `src/styles/questions.css`
- Footer: añadir link "Preguntas frecuentes" en `SiteFooter.jsx` (entre "Enviar sugerencia" y "Apóyanos")

---

## Estructura de la página

```
<nav>          — logo + flecha "Volver" (mismo patrón Suggestions/Donations)
<section hero> — título "Preguntas frecuentes" + subtítulo
<section> × 3  — una por categoría, con h2 + acordeones
<div banner>   — "¿Aún tienes dudas? Escríbenos una sugerencia" → /suggestions
```

---

## Contenido — 8 preguntas

### Uso de Plantillas (3)

**¿Cómo personalizo una plantilla?**
Elige la plantilla que más te guste desde el inicio, haz clic en "Personalizar" y completa los campos: fotos, texto y música. Cuando estés listo, guarda y recibirás un enlace único para compartir.

**¿Cómo puedo enviar mi regalo digital?**
Al guardar tu regalo recibirás un enlace único. Puedes compartirlo por WhatsApp, Instagram, correo o cualquier red social. Solo necesitas que la persona abra el link — no tiene que instalarse nada.

**¿Qué pasa si mi link de regalo no carga?**
Primero intenta recargar la página. Si el problema persiste, revisa que el enlace esté completo (sin cortes). Los regalos se almacenan en nuestros servidores sin fecha de vencimiento, así que si el link es correcto, debería cargar. Si sigue fallando, escríbenos desde la sección de Sugerencias.

### Donaciones y Privacidad (3)

**¿Es totalmente gratis?**
Sí, completamente. Crear y enviar regalos no tiene ningún costo. El proyecto se mantiene gracias a las donaciones voluntarias de quienes quieren apoyarlo. Si te gustó la experiencia y quieres contribuir, puedes hacerlo desde la sección "Apóyanos".

**¿Cómo aparece el cargo en mi estado de cuenta?**
Si realizas una donación, el cargo aparecerá como **SORPRESAVIRT** en tu estado de cuenta o historial de Yape. Es el identificador oficial del proyecto.

**¿Las fotos que subo se guardan?**
Las fotos que subes forman parte de tu regalo y se almacenan en nuestros servidores para que el destinatario pueda verlas al abrir el enlace. No las usamos con ningún otro fin ni las compartimos con terceros.

### Sugerencias (2)

**¿Puedo pedir una plantilla personalizada?**
Por ahora no hacemos diseños a pedido individual, pero si tienes una idea de plantilla puedes enviarla desde la sección de Sugerencias. Las ideas con más demanda son las que priorizamos para crear.

**¿Cómo reporto un error o envío feedback?**
Desde la sección "Enviar sugerencia" puedes escribirnos sobre cualquier fallo, mejora o comentario. Leemos todos los mensajes, aunque no siempre podamos responder individualmente.

---

## Diseño del acordeón

- **Múltiples ítems abiertos** simultáneamente (estado independiente por ítem)
- **Animación de apertura**: `grid-template-rows: 0fr → 1fr` con `transition: 320ms ease`
- **Icono chevron**: SVG que rota 180° con `transition: transform 280ms ease`
- **Borde del ítem en reposo**: `1px solid oklch(40% 0.12 310 / 0.3)`
- **Borde hover / abierto**: `1px solid oklch(60% 0.18 310 / 0.6)` + `box-shadow` magenta sutil
- **Background ítem abierto**: `oklch(22% 0.06 310 / 0.5)` — diferencia sutil respecto al surface

---

## Banner inferior

Card con borde sutil magenta, centrado, texto: `¿Aún tienes dudas?` + link `Escríbenos una sugerencia` → `/suggestions`.

---

## Tokens de diseño usados

| Token | Valor |
|-------|-------|
| `--bg` | `#0f0c1d` |
| `--surface` | `#17142a` |
| `--accent` | `#d946ef` |
| `--accent-dim` | `rgba(217,70,239,0.3)` |
| `--font-title` | Pacifico |
| `--font-text` | Chalkboard SE |

---

## Fuera de scope

- Búsqueda de preguntas
- Expansión de categorías desde admin
- Tracking de qué preguntas se abren más
