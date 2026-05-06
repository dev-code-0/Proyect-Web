# 🚀 Estrategia de Skills Integrada

## Resumen Ejecutivo

Has clonado 4 repositorios con **1000+ skills, herramientas de marketing, engineering de prompts y generación de imágenes**. Esta guía integra lo mejor de cada uno en tu SaaS de regalos virtuales.

---

## 📊 Qué contiene cada repositorio

### 1. **awesome-claude-skills** (1000+ skills)
- **Qué es:** Catálogo masivo de skills reutilizables
- **Para ti:** Skills de desarrollo, análisis de datos, automatización
- **Usar para:** Acelerar desarrollo, crear funciones complejas

**Skills más relevantes:**
- `content-research-writer` — investigación y escritura de contenido
- `competitive-ads-extractor` — analizar anuncios de competencia
- `document-skills` — procesamiento de documentos
- `brand-guidelines` — mantener marca consistente

### 2. **marketingskills** (50+ skills marketing)
- **Qué es:** Sistema interconectado de skills para marketing
- **Para ti:** CRÍTICO para promocionar tu SaaS
- **Estructura:** Todos dependen de `product-marketing-context`

**Skills principales para regalos virtuales:**
- `copywriting` — copywriting de landing pages
- `page-cro` — optimizar conversión (buy/personalize)
- `seo-audit` — auditar SEO del sitio
- `social` — contenido para redes sociales
- `email-sequence` — email marketing automatizado
- `ad-creative` — diseñar anuncios publicitarios
- `launch-strategy` — planificar lanzamiento de plantillas
- `customer-research` — investigar usuarios
- `competitor-profiling` — analizar competencia
- `marketing-ideas` — generar estrategias de marketing

### 3. **context-engineering-intro** (Prompt Engineering)
- **Qué es:** Guía sobre cómo construir mejor contexto para Claude
- **Para ti:** Mejorar prompts y automatización
- **Incluye:** PRPs (Persona-Role-Plan), validation, use-cases

**Aprender:** Cómo estructurar contexto como PRPs para mejor output

### 4. **banana-claude** (Generación de imágenes IA)
- **Qué es:** Skill para generar imágenes con Google Gemini Nano
- **Para ti:** Crear preview/thumbnails de templates
- **Usar para:** Diseño de marketing, assets visuales

---

## 🎯 Plan de Acción (Prioridad)

### FASE 1: Marketing (Semana 1)
**Objetivo:** Definir estrategia de marketing para tu SaaS

1. **Instalar marketingskills**
   ```bash
   cd marketingskills
   # Revisar AGENTS.md para entender architecture
   cat AGENTS.md
   ```

2. **Crear product-marketing-context**
   - Archivo: `./.claude/product-marketing-context.md`
   - Contenido: Descripción de tu SaaS (target, features, value prop)

3. **Usar skills en orden:**
   - `/customer-research` — entiende a tus usuarios
   - `/competitor-profiling` — analiza competencia
   - `/copywriting` — escribe copy para landing
   - `/page-cro` — optimiza conversión
   - `/social` — crea contenido redes
   - `/ad-creative` — diseña ads
   - `/email-sequence` — automatiza emails

### FASE 2: Development (Semana 2)
**Objetivo:** Acelerar codificación con awesome-claude-skills

1. **Extraer skills relevantes**
   - `content-research-writer` — documentación de features
   - `brand-guidelines` — mantener consistencia visual
   - `competitive-ads-extractor` — análisis de marketing

2. **Context Engineering**
   - Crear PRPs (Persona-Role-Plan) para cada feature
   - Mejorar prompts usando context-engineering-intro

### FASE 3: Creatividad Visual (Semana 3)
**Objetivo:** Generar assets visuales con banana-claude

1. **Instalar banana-claude**
   ```bash
   git clone https://github.com/AgriciDaniel/banana-claude.git
   cd banana-claude
   ./install.sh --with-mcp YOUR_GOOGLE_API_KEY
   ```

2. **Generar imágenes para templates**
   ```
   /banana generate "hero image for gift templates"
   /banana edit photo.png "enhance colors for web"
   /banana chat  # sesión creativa multiturno
   ```

---

## 📋 Checklist de Setup

### Paso 1: Preparar tu proyecto

```bash
# Crea directorio para contexto de marketing
mkdir -p ./.claude

# Crea el archivo de contexto del producto
cat > ./.claude/product-marketing-context.md << 'EOF'
# Contexto de Marketing - Regalos Virtuales Interactivos

## Producto
- **Nombre:** Vuelo Global (o nombre final)
- **Descripción:** Plataforma SaaS donde usuarios crean regalos virtuales interactivos personalizados
- **Cómo funciona:**
  1. Elige plantilla (Galaxia, Carrusel, Video, etc)
  2. Personaliza con fotos/música/texto
  3. Comparte link único con destinatario
  4. Destinatario abre regalo interactivo en navegador

## Target Audience
- Parejas celebrando aniversarios/cumpleaños
- Padres regalando a hijos
- Amigos queriendo hacer algo especial
- Edad: 18-45 años
- Plataforma: Mobile-first + Desktop

## Unique Value Proposition
- ✨ Regalos INTERACTIVOS (no solo video)
- 🎨 3+ plantillas premium (Galaxia 3D, Carrusel, etc)
- 🎵 Integración de música + fotos + efectos
- 🔗 Link único + compartible
- ⚡ Personalización simple en 5 minutos
- 🎁 Experiencia memorable para destinatario

## Pricing (Sugerido)
- Gratis: 1 regalo simple
- Premium: $9.99/mes → plantillas premium + sin watermark
- Lifetime: $99 → acceso perpetuo

## Competencia
- Animoto (videos)
- Canva (diseño)
- Slide.show (carruseles)
- NO HAY direct competitors en "regalos interactivos 3D"

## Channels a explorar
- TikTok/Instagram — casos de uso (sorpresa, reacción)
- Pinterest — ideas de regalos
- Email — regalo como regalo sorpresa
- Slack/WhatsApp — compartir links
- Facebook — regalo para mamá, pareja
EOF
cat ./.claude/product-marketing-context.md
```

### Paso 2: Instalar marketing skills

```bash
# Ve al repo de marketing skills
cd ../marketingskills

# Lee la documentación
cat AGENTS.md | head -50

# Copia el directorio skills a tu proyecto
cp -r skills ../.claude/marketing-skills
```

### Paso 3: Crear PRPs (Context Engineering)

```bash
# Crea fichero con PRPs para cada persona del equipo
cat > ./.claude/prps.md << 'EOF'
# PRPs (Persona-Role-Plan) para Proyecto

## PRP 1: Product Manager
**Persona:** Piensa en features, user experience, roadmap
**Role:** Define qué construir, por qué, para quién
**Plan:** Investigar usuarios → definir features → priorizar

## PRP 2: Marketing Manager
**Persona:** Piensa en cómo vender, mensajería, channels
**Role:** Crea estrategia marketing, copy, ads
**Plan:** Audience research → messaging → campaigns

## PRP 3: Developer
**Persona:** Piensa en arquitectura, performance, tech
**Role:** Implementa features, optimiza código
**Plan:** Especificación → código → tests → deploy

Use these when prompting Claude for specific roles.
EOF
```

### Paso 4: Google API Key para banana-claude

```bash
# Ve a https://aistudio.google.com/apikey
# Copia tu API key y guárdalo en .env:

cat >> .env << 'EOF'
VITE_GOOGLE_API_KEY=your_api_key_here
EOF
```

---

## 🛠️ Cómo usar cada skill

### Marketingskills - Copywriting

**Cuando usar:** Quieres escribir o mejorar copy de landing, ads, emails

```
/copywriting

Te pedirá:
1. Tipo de copy (landing, ad, email, etc)
2. Producto/contexto (lee tu product-marketing-context)
3. Audience (quién lees esto)
4. Goal (qué quieres que hagan)
5. Tone (profesional, casual, etc)

Output: Copy optimizado para conversión
```

### Marketingskills - Page CRO (Conversion Rate Optimization)

**Cuando usar:** Quieres optimizar tu landing page para más conversiones

```
/page-cro

Análisis:
- Headline y CTA atual
- Trust signals
- Forms
- Visual hierarchy

Output: Recomendaciones específicas para aumentar conversión
```

### Marketingskills - Social Media Strategy

**Cuando usar:** Quieres contenido para redes (TikTok, Instagram, etc)

```
/social

Te pedirá:
1. Platform (TikTok, Instagram, Twitter, etc)
2. Content type (hook, story, educational)
3. Persona de audiencia

Output:
- 5 ideas de posts
- Copy para cada uno
- Hashtags relevantes
- Timing suggestions
```

### banana-claude - Image Generation

**Cuando usar:** Necesitas crear imágenes para marketing, templates, etc

```
/banana generate "hero image for gift templates - 3D galaxy"
/banana edit hero.png "make colors more vibrant, premium feel"
/banana inspire  # browse 2500+ prompts database
/banana chat  # sesión creativa multiturno
```

### awesome-claude-skills - Content Research

**Cuando usar:** Necesitas investigación de mercado, análisis competitivo

```
Usar skill: content-research-writer

Busca:
- Articulos sobre "virtual gifts"
- Case studies de Canva, Animoto
- Tendencias en social gifting
```

---

## 📈 Workflow Sugerido

### Día 1: Strategy
```
1. /customer-research → entender usuarios
2. /competitor-profiling → analizar competencia
3. /marketing-ideas → generar 10 ideas de marketing
```

### Día 2: Content
```
1. /copywriting → landing page copy
2. /page-cro → optimizar landing
3. /email-sequence → crear drip campaign
```

### Día 3: Visuals
```
1. /banana generate → crear hero images
2. /banana chat → sesión creativa para ads
3. /ad-creative → diseñar anuncios
```

### Día 4: Development
```
1. Implementar features basado en findings
2. A/B test copy con /ab-test-setup
3. Track metrics con /analytics-tracking
```

---

## 🎓 Recursos para Aprender

### Context Engineering
```bash
cd context-engineering-intro
cat CLAUDE.md          # Mejores prácticas
cat README.md          # Guía completa
ls -la examples/       # Ejemplos reales
```

### Marketing Skills Architecture
```bash
cd marketingskills
cat AGENTS.md          # Cómo interactúan todos los skills
cat skills/copywriting/SKILL.md          # Ejemplo de 1 skill
cat README.md          # Visión general
```

---

## ⚡ Quick Commands

```bash
# Ver todos los skills disponibles
ls awesome-claude-skills/*/
ls marketingskills/skills/

# Buscar un skill específico
grep -r "seo" awesome-claude-skills/*/
grep -r "email" marketingskills/skills/

# Copiar skill a tu proyecto
cp -r marketingskills/skills/copywriting ./.claude/

# Leer documentación de un skill
cat awesome-claude-skills/content-research-writer/SKILL.md
```

---

## 📞 Siguientes Pasos

1. **Esta semana:**
   - [ ] Lee este archivo completamente
   - [ ] Ejecuta Paso 1-4 del setup
   - [ ] Crea tu product-marketing-context

2. **Próxima semana:**
   - [ ] Usa /customer-research y /competitor-profiling
   - [ ] Crea landing page copy con /copywriting
   - [ ] Genera imágenes con /banana

3. **Roadmap:**
   - [ ] A/B test landing page
   - [ ] Email sequence para users
   - [ ] TikTok strategy con /social
   - [ ] Paid ads con /ad-creative

---

**Última actualización:** 2026-05-06
**Por:** Claude Code
