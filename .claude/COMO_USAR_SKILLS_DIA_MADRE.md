# 🎓 Cómo Usar Skills: Guía Paso a Paso (Día de la Madre)

## Introducción Rápida

Los **skills son funciones especializadas** que Claude ejecuta. Cada skill:
1. Lee tu contexto (`.claude/product-marketing-context.md`)
2. Hace el trabajo especializado
3. Te devuelve un output profesional

**Tiempo total:** ~2 horas para todos los skills = 1 semana de trabajo normal

---

## SKILL 1: /marketing-ideas

### ¿Para qué?
Generar estrategias creativas de crecimiento

### Cómo usarlo - PASO A PASO

**Step 1: Escribe el comando**
```
/marketing-ideas
```

**Step 2: Claude te pide contexto (elige una opción)**

Opción A - Dale INPUT DETALLADO (recomendado):
```
"Como Growth Manager, dame 5 estrategias 
para crecer VIRAL en Día de la Madre (May 10).

Contexto:
- Producto: Galaxia de Momentos (regalo 3D personalizado)
- Target: Mujeres 20-40 años, hijas regalando a mamá
- Ventaja: Es INTERACTIVO (no solo video)
- Urgencia: 5 días para producción
- Budget: Bajo (growth hacking, no paid ads cara)

¿Cuál es el mejor lever para 5K+ new users en 5 días?"
```

Opción B - Dale INPUT MÍNIMO:
```
"Estrategias de marketing para Día de la Madre"
```
→ Output genérico, no específico

### Expected Output
```
1. Email Campaign + Referral Bonus
   ROI: 1000-2000 users | Effort: Bajo | Timeline: 2 días
   
2. TikTok Blitz (Reacción a regalo)
   ROI: 2000-5000 users | Effort: Bajo | Timeline: 3 días
   
3. Influencer Testimonials
   ROI: 500-1000 users | Effort: Medio | Timeline: 4 días
   
4. Paid Facebook Ads (Budget $500)
   ROI: 500-2000 users | Effort: Bajo | Timeline: 1 día
   
5. Reddit + Subreddits (r/gifts, r/mothers)
   ROI: 200-500 users | Effort: Bajo | Timeline: 1 día
```

### Qué hacer con el output
- ✅ Elige las 2-3 estrategias con mejor ROI
- ✅ Prioriza por timeline (5 días máximo)
- ✅ Guarda en `.claude/dia-madre-estrategias.md`
- ✅ Usa como BASE para siguientes skills

**Time: 15 minutos | Valor: $500 en consulting**

---

## SKILL 2: /copywriting

### ¿Para qué?
Escribir landing page copy que CONVIERTE

### Cómo usarlo - PASO A PASO

**Step 1: Invoca el skill**
```
/copywriting
```

**Step 2: Claude te pide detalles. Dale INFO ESPECÍFICA:**

```
"Landing page copy para REGALOS - Día de la Madre.

TIPO: Landing page hero section

CONTEXT:
- Producto: 'Galaxia de Momentos'
  Descripción: Regalo interactivo 3D donde fotos flotan 
  como planetas y mamá explora la galaxia
  
- Target Audience: Mujeres 25-40 años, hijas/nueras
  que quieren sorprender a mamá en Día de la Madre
  
- Pain Point: 'No sé qué regalar que sea especial y diferente'
  
- Solution: 'Crea regalo único + interactivo en 5 minutos'

- Differentiator: 'No es video (aburrido), es experiencia 3D 
  que se explora interactivamente'
  
- Tone: Emocional (mami), sorpresa, nostalgia
- CTA: 'Crea tu Galaxia Gratis'

INCLUYE:
- Headline (una línea, impactante)
- Subheadline (beneficio principal)
- Body copy (3-4 párrafos con features)
- Social proof (si aplica)
- CTA button text"
```

### Expected Output
```
HEADLINE:
"Sorprende a Mamá con una Galaxia de Recuerdos Única"

SUBHEADLINE:
"Crea un regalo 3D interactivo en 5 minutos 
que ella explorará una y otra vez"

BODY:
"Cada mamá merece algo más que flores que se marchitan.

Con Galaxia de Momentos, conviertes tus fotos favoritas 
en un regalo interactivo que ella puede explorar, 
descubriendo cada memoria que compartieron.

✨ Elige tus fotos
🎨 Personaliza con tu mensaje
🌍 Comparte un link único
💫 Mamá queda sorprendida (y emocionada)

Toma 5 minutos. El impacto dura para siempre."

CTA: "Crea tu Galaxia Gratis"
```

### Qué hacer con el output
- ✅ Copia el copy a tu landing page
- ✅ Personaliza si necesita
- ✅ A/B test 2-3 headlines diferentes
- ✅ Guarda en `src/components/Home/dia-madre-copy.jsx`

**Time: 20 minutos | Valor: $300 en copywriting**

---

## SKILL 3: /ad-creative

### ¿Para qué?
Diseñar anuncios (imagen + copy) para Facebook/Instagram

### Cómo usarlo - PASO A PASO

**Step 1: Invoca**
```
/ad-creative
```

**Step 2: Dale BRIEF ESPECÍFICO:**

```
"Crea 3 variantes de ads para Facebook/Instagram 
- Día de la Madre (Galaxia de Momentos)

BRIEF:
- Platform: Facebook + Instagram
- Audience: Mujeres 25-40, hijas regalando a mamá
- Occasion: Día de la Madre (May 10)
- Goal: Click a landing 'Crear regalo gratis'
- Budget: $500 para probar

HOOK IDEAS:
1. Emotional: 'Esta mamá lloró al abrir su regalo...'
2. Practical: 'Regala algo que no se marchita'
3. Surprise: '¿Cómo reaccionará mamá a esto?'

ESTRUCTURA ESPERADA (para cada variante):
- Headline (20 chars max)
- Primary text (125 chars max)
- Description (27 chars max)
- CTA button suggestion"
```

### Expected Output
```
VARIANTE 1 - EMOTIONAL:
Headline: "Sorprende a Mamá"
Primary: "Una galaxia de recuerdos interactiva que la emocionará"
CTA: "Crear Ahora Gratis"

VARIANTE 2 - PRACTICAL:
Headline: "Regala lo Inesperado"
Primary: "No flores. No perfume. Una experiencia 3D única"
CTA: "Ver Cómo Funciona"

VARIANTE 3 - SURPRISE:
Headline: "¿Qué Harás el 10?"
Primary: "Sorprende a mamá con un regalo que jamás olvidará"
CTA: "Crear Regalo"
```

### Qué hacer con el output
- ✅ Ve a Facebook Ads Manager
- ✅ Crea 3 campañas con cada variante
- ✅ Budget: $100-200 por variante
- ✅ Monitorea por 24h, escala lo que funciona
- ✅ Target: "Mother's Day" interests

**Time: 15 minutos setup | Valor: $400 en ad design**

---

## SKILL 4: /banana generate (IMÁGENES)

### ¿Para qué?
Generar imágenes profesionales para marketing/ads

### Cómo usarlo - PASO A PASO

**Step 1: Invoca**
```
/banana generate
```

**Step 2: Dale PROMPT VISUAL ESPECÍFICO:**

```
"Genera imagen hero para landing de Día de la Madre:

TEMA: Madre e hija viéndose emocionadas 
frente a una pantalla mostrando Galaxia de Momentos

ESTILO: Fotografía realista, emocional, premium
COLORES: Tonos cálidos (dorado, naranja suave, fucsia)
ATMÓSFERA: Momento nostálgico, especial, technology meets emotion
ELEMENTOS: 
- Pantalla/teléfono mostrando galaxia 3D (fotos flotando)
- Expresión emocional en caras
- Luz suave (atardecer o luz natural)
- Background borroso (hogar acogedor)

ASPECTO: 16:9 (para web)
CALIDAD: Premium, high-resolution, ready for web"
```

**Step 3: Claude genera y te ofrece opciones. Elige la mejor.**

### Expected Output
```
[Imagen profesional de madre e hija emocionadas 
viendo galaxia 3D en pantalla]
```

### Más prompts para generar

**Imagen 2: Product Showcase**
```
/banana generate "Galaxy of Moments interface showcase:
- Screen showing floating photos as planets
- Purple/golden color theme
- User pointing/clicking on a photo
- Modern, tech-forward aesthetic
- 16:9 aspect ratio"
```

**Imagen 3: Social Proof**
```
/banana generate "Family celebration moment:
- Multiple generations (mom, daughter, grandma)
- Watching interactive 3D gift on screen
- Authentic emotional reaction
- Real, candid feeling (not staged)
- 16:9 aspect ratio"
```

### Qué hacer con outputs
- ✅ Descarga las imágenes
- ✅ Sube a `src/assets/dia-madre/`
- ✅ Usa en landing page
- ✅ Usa en ads (Facebook)
- ✅ Usa en emails

**Time: 15 minutos | Valor: $200 en design**

---

## SKILL 5: /email-sequence

### ¿Para qué?
Crear email campaign automática (drip)

### Cómo usarlo - PASO A PASO

**Step 1: Invoca**
```
/email-sequence
```

**Step 2: Dale CONTEXTO ESPECÍFICO:**

```
"Crea 3-email drip campaign para Día de la Madre:

SITUACIÓN:
- Producto: Galaxia de Momentos
- Occasion: Día de la Madre (May 10)
- Timeline: 5 días (May 6-10)
- Goal: Conversiones de regalo + Premium upgrades
- Tone: Emocional, cálido, urgencia light

EMAIL 1 (Day 1 - May 6):
- Subject: Anuncio de Día de la Madre
- Goal: Click 'Crear Regalo'
- Vibe: Inspiración, emoción

EMAIL 2 (Day 3 - May 8):
- Subject: Social proof (reacciones de madres)
- Goal: Reduce anxiety, show real examples
- Vibe: Testimonios reales, inspire

EMAIL 3 (Day 5 - May 10):
- Subject: Urgencia (es hoy!)
- Goal: Last-minute conversions
- Vibe: Urgency, reminder, encouragement"
```

### Expected Output
```
EMAIL 1:
SUBJECT: "5 días para sorprender a mamá ✨"
BODY:
"Hola,

En 5 días es Día de la Madre y sabemos que aún 
no tienes el regalo perfecto.

¿Y si le regalas una Galaxia de Momentos?

Es un regalo interactivo donde mamá puede explorar 
cada foto, cada recuerdo que compartieron juntas.
Toma 5 minutos. El impacto: para siempre.

[CTA BUTTON] Crear Tu Galaxia Gratis"

---

EMAIL 2:
SUBJECT: "Mira cómo reaccionaron estas mamás 😭"
BODY:
"Algunos regalos los olvidas.
Este... no.

[TESTIMONIAL VIDEO/IMAGE]
'Mi mamá lloró cuando vio nuestra galaxia. 
Jamás pensé que un regalo pudiera ser tan especial.' 
- María, 28 años"

[CTA BUTTON] Crea la Tuya Ahora"

---

EMAIL 3:
SUBJECT: "Es hoy. Tu mamá merece algo especial 💝"
BODY:
"Última chance para sorprender a mamá.

¿Flores? Las tiendas están llenas.
¿Perfume? Ya tiene.

¿Una Galaxia de Momentos?
Algo que jamás olvidará.

Créala ahora. Toma 5 minutos."

[CTA BUTTON] Crea Tu Galaxia (Hoy)"
```

### Qué hacer con output
- ✅ Copia cada email a tu email service (Gmail, Mailchimp, SendGrid, Klaviyo)
- ✅ Setup automation trigger: May 6, 8, 10
- ✅ Test email rendering (mobile/desktop)
- ✅ Click send!

**Time: 20 minutos | Valor: $250 en copywriting**

---

## FLUJO COMPLETO EN ORDEN

### OPCIÓN A: Secuencial (Recomendado)
```
Monday 9am:  /marketing-ideas          → 15 min
Monday 10am: /copywriting              → 20 min
Monday 11am: /ad-creative              → 15 min
Monday 12pm: /banana generate (3 imgs) → 30 min
Monday 2pm:  /email-sequence           → 20 min
             TOTAL: 2 horas de skills = outputs listos

Monday 2pm-6pm: Implementar en app (4 horas)
Tuesday am:     Deploy a producción
Tuesday:        Launch ads + emails
```

### OPCIÓN B: Paralelo (Si necesitas MÁS rápido)
```
Abre 5 tabs de Claude simultáneamente:
- Tab 1: /marketing-ideas
- Tab 2: /copywriting
- Tab 3: /ad-creative
- Tab 4: /banana generate
- Tab 5: /email-sequence

Ejecuta TODOS los prompts en paralelo
Espera ~2 horas
Todos los outputs listos

Luego implementa en app (4 horas)
```

---

## ❓ PREGUNTAS FRECUENTES

### P: ¿Qué pasa si el output no me gusta?
R: Refina el prompt y vuelve a ejecutar:
```
"El copy anterior fue muy romántico. 
Hazlo más divertido/casual."
```
Claude itera automáticamente.

### P: ¿El copy será diferente cada vez?
R: Sí, pequeñas variaciones. Eso es bueno → A/B test

### P: ¿Cuándo uso /banana generate vs. usar Canva?
R: 
- /banana = AI genera imagen customizada (10 min)
- Canva = Tú diseñas (1-2 horas)

Para timeline rápido, /banana es mejor.

### P: ¿Puedo usar los outputs comercialmente?
R: Sí, 100%. Son tuyos. El output es material propietario.

### P: ¿Y si necesito ajustes después?
R: Fácil:
```
"/copywriting"
"Ajusta el copy anterior: 
- Menos emojis
- Más directivo
- Enfócate en 'sorpresa'"
```

### P: ¿Cuánto cuesta ejecutar los skills?
R: GRATIS. Son parte del access a Claude Code.
Equivalente: $2000 en agencias de marketing

---

## 🎯 ÉXITO = SEGUIR ESTE ORDEN

1. **Lee** esta guía (15 min)
2. **Ejecuta** /marketing-ideas (15 min)
3. **Ejecuta** /copywriting (20 min)
4. **Ejecuta** /ad-creative (15 min)
5. **Ejecuta** /banana generate (30 min)
6. **Ejecuta** /email-sequence (20 min)
7. **Implementa** en app (4 horas)
8. **Deploy** a producción
9. **Lanza** campañas
10. **Monitorea** métricas

**Total: 10 horas = $3000 en valor de agencia**

---

## 📞 Próximo Paso

¿Listo para empezar?

**OPCIÓN 1:** Ejecuta `/marketing-ideas` ahora mismo (15 min)

**OPCIÓN 2:** Leeme otra pregunta y te ayudo a refinar los prompts

**OPCIÓN 3:** Ejecuta todos los 5 en paralelo (2 horas, todos los outputs listos)

---

**Última actualización:** 2026-05-06
**Status:** LISTO PARA EJECUTAR
