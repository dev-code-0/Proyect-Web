# 📊 Análisis: Plantilla Galaxia de Momentos

## Qué Existe Ahora

### Archivo: `src/templates/galaxia-momentos/index.jsx`
```jsx
export default function GalaxyMomentos({ data }) {
  const resolved = { tema: 'romantica', ...data };
  return <GalaxyScene data={resolved} />;
}
```

### Configuración: `config.js`
**Campos disponibles:**
- `titulo` — Nombre de constelación (texto)
- `mensaje` — Mensaje principal (textarea, max 300 chars)
- `para` — Nombre de ella (texto)
- `fotos` — 1-8 imágenes
- `tema` — Color theme (4 opciones):
  - Romántica (rosas/magenta)
  - Cosmos (azul eléctrico)
  - Dorada (ámbar/oro)
  - Esmeralda (verde profundo)
- `musica` — Música de fondo (opcional)

### Características Técnicas
- Three.js scene navigable
- OrbitControls (navegación en primera persona)
- Fotos flotan como planetas/estrellas
- Click en foto = expandir con descripción
- ShaderMaterial para nebulosa
- Performance optimizado para web

---

## 🎁 OPORTUNIDAD: Día de la Madre

### Por Qué Esta Plantilla es PERFECTA:
1. ✅ **Tema emocional** = Perfecta para Día de la Madre
2. ✅ **Fotos + mensajes** = Memorias de madre e hijo/a
3. ✅ **Interactiva** = Sorpresa al explorar
4. ✅ **Ya existe** = Lanzar en 3-5 días (no 3 semanas)

### Ángulos de Marketing para Día de la Madre:
```
1. "Regala una Galaxia de Recuerdos a tu Mamá"
   └─ Enfoque: Emocional, nostalgia, fotos compartidas
   
2. "Crea una constelación con los momentos que compartieron"
   └─ Enfoque: Momentos especiales, amor intergeneracional
   
3. "Una sorpresa interactiva 3D que sorprenderá a tu mamá"
   └─ Enfoque: Tecnología + emoción, diferencia vs. flores
   
4. "5 minutos para crear un regalo que ella recordará siempre"
   └─ Enfoque: Facilidad, regalo memorable
```

---

## 📈 Plan de Producción (5 días)

### Day 1: Marketing Strategy (HOY)
- [ ] Usar `/marketing-ideas` para estrategia Día de la Madre
- [ ] Usar `/customer-research` para entender motivación
- [ ] Usar `/copywriting` para landing copy
- [ ] Usar `/ad-creative` para ads sociales

### Day 2: Visuals & Content
- [ ] Usar `/banana generate` para imágenes hero
- [ ] Crear testimonials (videos de madres emocionadas)
- [ ] Diseñar email campaign

### Day 3: Implementation
- [ ] Update landing page
- [ ] Setup email campaign
- [ ] Schedule social posts

### Day 4: Testing & Optimization
- [ ] A/B test ads
- [ ] Optimize landing
- [ ] Test mobile experience

### Day 5: LAUNCH 🚀
- [ ] Go live en emails
- [ ] Launch Facebook/Instagram ads
- [ ] Post en redes sociales
- [ ] Monitorear métricas

---

## 🎯 Prompts Específicos a Usar

### PROMPT 1: /marketing-ideas
```
"Como Growth Manager, dame 5 estrategias viral 
para Día de la Madre (10 mayo) con mi plantilla Galaxia de Momentos.

Contexto:
- Producto: Crea regalos 3D personalizados con fotos
- Plantilla: Galaxia de Momentos (fotos flotan como planetas)
- Target: Hijas/o regalando a mamá
- Diferenciador: Es INTERACTIVO (no solo video/foto)
- Urgencia: 5 días para Día de la Madre
- Budget: Bajo (growth hacking)

¿Cuál es el mejor lever para crecer viral en 5 días?"
```

**Esperado:** 5 estrategias priorizadas con ROI

### PROMPT 2: /copywriting
```
"Landing copy para Día de la Madre - Plantilla Galaxia.

Target audience: Hijas 20-40 años regalando a mamá
Pain point: 'No sé qué regalar que sea especial'
Solution: Galaxia de Momentos (interactiva, personalizada)
Tone: Emocional, nostálgico, sorpresa
CTA: 'Crea tu Galaxia gratis'

Incluye:
- Headline impactante
- Subheadline
- Body con beneficios
- Social proof
- CTA button copy"
```

**Esperado:** Copy listo para landing

### PROMPT 3: /ad-creative
```
"Crea 3 variantes de ads para Facebook/Instagram - Día de la Madre.

Context:
- Producto: Galaxia de Momentos (regalo 3D interactivo)
- Ocasión: Día de la Madre (mayo 10)
- Audience: Mujeres 20-40, con mamá
- Goal: Click a landing (crear regalo)
- Hook: 'Esta madre lloró al abrir su regalo...'

Variables a probar:
1. Emotional (nostalgia + amor)
2. Practical (fácil + rápido)
3. Surprise (sorpresa + tecnología)"
```

**Esperado:** 3 ads listos para Facebook Ads Manager

### PROMPT 4: /banana generate
```
"Imágenes para marketing Día de la Madre - Galaxia de Momentos.

Necesito:
1. Hero image
   - Madre e hija viendo galaxia 3D
   - Emocional, touching moment
   - Premium, tecnológico look
   
2. Product showcase
   - Interfaz de Galaxia
   - Fotos flotando como planetas
   - Tema dorada/romántica
   
3. Social proof
   - Familia completa emocionada
   - Opening gift moment
   - Real, authentic feeling"
```

**Esperado:** 3 imágenes high quality

### PROMPT 5: /email-sequence
```
"Email sequence para Día de la Madre (3 emails, 5 días).

Day 1 (May 6): Announcement
- Subject: '5 días para sorprender a mamá'
- Goal: Click 'Crear regalo'

Day 3 (May 8): Social proof
- Subject: 'Mira cómo estas madres reaccionaron...'
- Goal: Inspire, reduce anxiety

Day 5 (May 10): Urgency
- Subject: 'Hoy es el día - Entrega tu Galaxia'
- Goal: Last-minute conversions"
```

**Esperado:** 3 emails listos para enviar

---

## 🚀 Cómo Ejecutar Esto

### Opción A: Sequential (Recomendado - 6 horas total)
```
1. /marketing-ideas          (15 min) → obtén 5 estrategias
2. /copywriting               (20 min) → obtén landing copy
3. /ad-creative               (15 min) → obtén 3 ads
4. /banana generate           (15 min) → obtén imágenes
5. /email-sequence            (15 min) → obtén emails
6. Implementar todo en app    (4 horas)
```

### Opción B: Paralelo (Si quieres más rápido)
```
Ejecuta simultáneamente:
- /marketing-ideas
- /copywriting
- /ad-creative
- /banana generate
- /email-sequence

Luego combina outputs e implementa.
```

---

## 📋 Qué Sigue Después de Skills

### Fase 1: Get Outputs (1 hora)
```
[ ] Ejecuta los 5 skills arriba
[ ] Guarda outputs en .claude/dia-madre-outputs/
```

### Fase 2: Implement (3-4 horas)
```
[ ] Update Home.jsx con copy
[ ] Create landing banner 'Día de la Madre'
[ ] Setup email campaign
[ ] Create social media posts
```

### Fase 3: Deploy (30 min)
```
[ ] npm run build
[ ] Push a production
[ ] Send emails
[ ] Launch Facebook Ads
```

### Fase 4: Monitor (Ongoing)
```
[ ] Track CTR, conversions
[ ] Monitor email opens
[ ] Adjust ads by performance
[ ] Daily check: Are people using it?
```

---

## 🎯 Expected Results (Day 5)

### Conservative Estimate:
- 500-1000 new users
- 50-100 premium conversions
- $500-1000 en revenue

### Optimistic (si es viral):
- 5000-10000 new users
- 500-1000 premium conversions
- $5000-10000 en revenue

### Key Success Factor:
**Share rate > Conversión**
Si mamá ama el regalo, lo comparte → viral loop

---

## 📊 Métricas a Trackear

```
1. CTR en landing               (Target: 5%+)
2. Conversion a crear regalo    (Target: 20%+)
3. Share rate                   (Target: 30%+ compartan)
4. Premium conversion           (Target: 10% de creators)
5. Email open rate              (Target: 20%+)
6. Email click rate             (Target: 5%+)
```

---

**Status:** READY TO EXECUTE
**Timeline:** 5 días hasta Día de la Madre (May 10)
**Complexity:** MEDIUM (todo existe, solo marketing)
**ROI:** HIGH (aprox $5k en 5 días si todo sale bien)
