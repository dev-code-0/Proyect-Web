# 🚀 DEPLOYMENT PLAN: Día de la Madre (5 Días)

## Timeline Crítico

```
Skills + Implementation
Testing + Refinamiento
Launch inicial (Email + Social)
Monitor + Optimize
Final push (es el día!)
```

---

## PASO 1: Ejecutar Skills (Hoy - 2 horas)

### Quick Checklist
```
[ ] /marketing-ideas                    (15 min)
[ ] /copywriting                        (20 min)
[ ] /ad-creative                        (15 min)
[ ] /banana generate (3 images)         (30 min)
[ ] /email-sequence                     (20 min)

TOTAL: ~2 horas → Todos los outputs listos
```

### Guardar Outputs
Crea carpeta: `.claude/dia-madre-outputs/`

```
.claude/dia-madre-outputs/
├── 1-marketing-ideas.md          (Estrategias priorizadas)
├── 2-copywriting.md              (Landing copy)
├── 3-ad-creative.md              (3 ad variations)
├── 4-images/
│   ├── hero-madre-hija.png
│   ├── product-showcase.png
│   └── social-proof.png
└── 5-email-sequence.md           (3 emails listos)
```

---

## PASO 2: Implementar en App (May 6-7, ~6 horas)

### 2.1 Update Home Page

**Archivo:** `src/components/Home/Home.jsx`

Agrega sección Día de la Madre (ANTES de carrusel de templates):

```jsx
{/* Día de la Madre Banner */}
<section className="dia-madre-banner">
  <div className="container">
    <div className="banner-content">
      {/* Left: Image */}
      <img src="/images/dia-madre-hero.png" alt="Galaxia Día de la Madre" />
      
      {/* Right: Copy + CTA */}
      <div className="banner-text">
        <h1>Sorprende a Mamá con una Galaxia de Recuerdos</h1>
        <p>Crea un regalo 3D interactivo en 5 minutos que ella explorará una y otra vez</p>
        
        <button 
          className="cta-primary"
          onClick={() => handleSelectTemplate('galaxia-momentos')}
        >
          Crea tu Galaxia Gratis
        </button>
      </div>
    </div>
  </div>
</section>
```

**Estilos:** `src/components/Home/Home.css` (agrega):

```css
.dia-madre-banner {
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
  padding: 60px 20px;
  margin: 40px 0;
  border-radius: 16px;
}

.banner-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.banner-content img {
  width: 100%;
  border-radius: 12px;
}

.banner-text h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: white;
}

.banner-text p {
  font-size: 1.1rem;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 768px) {
  .banner-content {
    grid-template-columns: 1fr;
  }
  .banner-text h1 {
    font-size: 1.8rem;
  }
}
```

### 2.2 Add Special Messaging in CustomizeModal

**Archivo:** `src/components/CustomizeModal/CustomizeModal.jsx`

Si user selecciona `galaxia-momentos`, muestra:

```jsx
{templateId === 'galaxia-momentos' && (
  <div className="template-hint">
    <div className="hint-badge">💝 Perfecto para Día de la Madre</div>
    <p>Sorprende a mamá con un regalo que jamás olvidará</p>
  </div>
)}
```

### 2.3 Update Preview Page

**Archivo:** `src/components/Preview/Preview.jsx`

Agrega variable contextual si es Día de la Madre:

```jsx
const isDiaMarpe = moment().isBetween('2026-05-06', '2026-05-10');

return (
  <div>
    {isDiaMadre && (
      <CalloutBanner 
        icon="💝"
        text="¡Regala esta Galaxia el Día de la Madre!"
      />
    )}
    {/* ... resto del component */}
  </div>
);
```

### 2.4 Update Share Modal

**Archivo:** `src/components/ShareModal/ShareModal.jsx`

Cuando user comparte, agrega contexto Día de la Madre:

```jsx
const shareMessage = isDiaMadre 
  ? `¡Mamá, sorpresa! Exploré esta galaxia para ti: ${shareLink}`
  : `¡Mira mi regalo interactivo! ${shareLink}`;
```

---

## PASO 3: Email Campaign Setup (May 6-7, ~2 horas)

### Opción A: Gmail + Manual (Si es pequeño)
```
1. Copia los 3 emails del skill output
2. Draft en Gmail
3. Envía manualmente los días:
   - May 6 (9am)
   - May 8 (10am)
   - May 10 (8am)
```

### Opción B: MailChimp (Recomendado)
```
1. Ve a mailchimp.com (free plan ok)
2. Crea "Campaign" → "Automation"
3. Copia cada email (subject + body)
4. Schedule:
   - May 6 9:00am → Email 1
   - May 8 10:00am → Email 2
   - May 10 08:00am → Email 3
5. Setup audience (tu lista de emails)
6. Send!
```

### Opción C: SendGrid (Si tienes)
```
Mismos pasos que MailChimp pero con SendGrid
```

**Emails a enviar:** Del skill `/email-sequence`

---

## PASO 4: Facebook Ads Setup (May 7, ~2 horas)

### Prerequisites
- Facebook Business Manager account
- $500 budget para gastar

### Setup Steps

**1. Go to Ads Manager**
```
facebook.com/ads/manager
```

**2. Create Campaign**
```
Objective: Website Traffic (clicks)
Campaign Name: "Dia-Madre-Galaxia"
Budget: $500
Duration: May 8-10
```

**3. Create Ad Set**
```
Audience: 
  - Women 25-40
  - Location: [Tu país/región]
  - Interests: "Mother's Day", "Gifts", "Photography"
  - Lookalike: Tu customer audience (si tienes)

Placements:
  - Facebook Feed
  - Instagram Feed
  - Audience Network

Budget: Split $150-200 per ad variant
Schedule: Daily 9am-9pm local time
```

**4. Create 3 Ad Variants** (from `/ad-creative` skill)

**Variante 1:**
```
Image: hero-madre-hija.png
Headline: "Sorprende a Mamá"
Primary text: "Una galaxia de recuerdos interactiva que la emocionará"
CTA: "Crear Ahora Gratis"
Link: https://yourdomain.com/?utm_source=fb&utm_campaign=dia-madre-var1
```

**Variante 2:**
```
Image: product-showcase.png
Headline: "Regala lo Inesperado"
Primary text: "No flores. No perfume. Una experiencia 3D única"
CTA: "Ver Cómo Funciona"
Link: https://yourdomain.com/?utm_source=fb&utm_campaign=dia-madre-var2
```

**Variante 3:**
```
Image: social-proof.png
Headline: "¿Qué Harás el 10?"
Primary text: "Sorprende a mamá con un regalo que jamás olvidará"
CTA: "Crear Regalo"
Link: https://yourdomain.com/?utm_source=fb&utm_campaign=dia-madre-var3
```

**5. Launch**
- Set start date: May 8
- Review + Confirm
- PUBLISH

---

## PASO 5: Social Media Posts (May 7-8)

### TikTok Strategy (best ROI for this)

**Ideally:** Post 1x per day (May 8, 9, 10)

**Post 1 - May 8 (Hook)**
```
Video: 15-30 second teaser
Content: Madre + hija viendo galaxia, expresión emocional
Sound: Trending audio + emocional
Caption: "Regalé esto a mi mamá y lloró 😭💝 
[Link en bio]"

Hashtags: #DiaDelaMadre #GiftIdeas #Mom #Surprise 
#Regalo #Tecnología #InteractiveGift
```

**Post 2 - May 9 (Tutorial)**
```
Video: 45 sec tutorial (cómo crear galaxia)
Content: Quick walkthrough, muestra facilidad
Caption: "Crea un regalo único en 5 minutos 🚀💫"
```

**Post 3 - May 10 (Last Minute)**
```
Video: Compilation de reacciones emocionales
Caption: "Es hoy. Mamá merece algo especial ✨ 
[Link en bio, hoy es el día!]"
```

### Instagram Reels (similar)
- Post 1x per day
- Same content as TikTok
- Cross-post from TikTok (Meta owns both)

### Pinterest
```
Pin Design: Hero image + text overlay
"Sorprende a Mamá - Regala una Galaxia de Momentos"
Link: https://yourdomain.com/dia-madre

Post daily May 6-10
```

---

## PASO 6: Build & Deploy Code (May 7)

### Build for Production

```bash
npm run build

# Verify build succeeded
ls dist/index.html
```

### Deploy to Production

**If using Vercel:**
```bash
vercel --prod
```

**If using other hosting:**
```bash
# Push to GitHub
git add .
git commit -m "feat: Mother's Day campaign + Galaxia banners"
git push origin main

# Deploy your usual way
# (Netlify, AWS, etc.)
```

### Verify Live
```
1. Open https://yourdomain.com
2. Check Day of Mother banner appears
3. Click "Crea tu Galaxia Gratis"
4. Test full flow (upload, customize, share)
5. Test on mobile
```

---

## PASO 7: Day-of Monitoring (May 8-10)

### Daily Checklist

**May 8 (Launch Day)**
```
[ ] 9:00am: Launch email #1 + ads + social posts
[ ] 10:00am: Monitor metrics (CTR, clicks, impressions)
[ ] 12:00pm: Check ad performance, pause underperformers
[ ] 3:00pm: Adjust ad spend to top performer
[ ] 6:00pm: Social media engagement check
[ ] 9:00pm: End-of-day report
```

**May 9 (Momentum)**
```
[ ] 8:00am: Launch email #2 + new social posts
[ ] Monitor all channels
[ ] Scale ads that are working
[ ] Respond to comments/DMs
[ ] Check conversion funnel
```

**May 10 (Final Push)**
```
[ ] 8:00am: Launch email #3 (urgency)
[ ] 9:00am: Last social media blitz
[ ] Monitor like a hawk
[ ] Respond to ALL inquiries
[ ] Scale winning ads
[ ] Celebrate 🎉
```

### Metrics Dashboard

Track these daily:
```
1. Website Traffic
   - Unique visitors
   - Traffic source (organic, email, ads, social)
   
2. Conversion Funnel
   - Home page visits
   - Galaxia template clicks
   - Customization starts
   - Saves (created gifts)
   - Premium upgrades
   
3. Ads Performance
   - CPM (cost per 1000 impressions)
   - CPC (cost per click)
   - CTR (click-through rate)
   - Conversion rate
   
4. Email Performance
   - Open rate
   - Click rate
   - Conversion rate
   
5. Social Media
   - Views
   - Likes
   - Comments
   - Shares
   - Click-throughs
```

---

## PASO 8: Post-Campaign (May 11+)

### Analysis
```
[ ] Compile all metrics
[ ] What worked best?
[ ] What flopped?
[ ] ROI analysis (revenue vs. spend)
[ ] User feedback analysis
[ ] Testimonials captured
```

### Optimization
```
[ ] Keep winning ads running
[ ] Pause losing ads
[ ] Iterate email copy based on opens
[ ] Update landing page based on learnings
[ ] Plan next campaign (aniversarios? graduaciones?)
```

### Content Reuse
```
[ ] Save best testimonials
[ ] Extract user videos
[ ] Create case study
[ ] Use for future marketing
```

---

## 📊 Success Metrics

### Conservative Targets
```
Website traffic:        500-1000 visits
Galaxia template use:   100-200 creations
Premium conversions:    20-50
Revenue generated:      $200-500
Email open rate:        20%+
Ad CTR:                 2-3%
```

### Optimistic (if viral)
```
Website traffic:        5000-10000 visits
Galaxia template use:   1000-2000 creations
Premium conversions:    200-500
Revenue generated:      $2000-5000
Share rate:             20-30% (viral!)
```

---

## ⚠️ Contingency Plan

### If traffic is low:
```
[ ] Increase ad spend
[ ] Refine ad targeting
[ ] Add retargeting ads
[ ] Launch more social posts
[ ] Email your existing list
```

### If copy isn't converting:
```
[ ] A/B test headline
[ ] Refine CTA text
[ ] Add social proof
[ ] Simplify form
[ ] Test new copy with /copywriting
```

### If ads are expensive:
```
[ ] Lower budget per ad
[ ] Focus on organic (social, email)
[ ] Expand organic reach
[ ] Use influencers (referral)
[ ] User-generated content
```

---

## 🎯 Final Checklist Before May 8

- [ ] Code deployed to production
- [ ] Home page banner live + styled
- [ ] Email campaign setup (all 3 emails)
- [ ] Facebook ads created (3 variants)
- [ ] Images optimized + uploaded
- [ ] Social media posts drafted
- [ ] Tracking/analytics configured
- [ ] Mobile experience tested
- [ ] Team notified
- [ ] Contingency plan ready

---

## 📞 Support During Campaign

If something breaks:
```
1. Revert code: git revert [latest commit]
2. Redeploy: npm run build && vercel --prod
3. Pause ads: Facebook Ads Manager → Pause campaign
4. Alert team
5. Debug + fix + redeploy
```

---

**Timeline:** May 6-10 (5 días)
**Effort:** ~15-20 horas total
**Expected ROI:** 5-10x
**Status:** 🚀 READY TO LAUNCH
