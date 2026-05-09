# Graph Report - .  (2026-05-09)

## Corpus Check
- 0 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 307 nodes · 428 edges · 18 communities (14 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Template Components|Core Template Components]]
- [[_COMMUNITY_Template Configurations|Template Configurations]]
- [[_COMMUNITY_Jardin Madre 3D Scene|Jardin Madre 3D Scene]]
- [[_COMMUNITY_Arbol Madre 3D Scene|Arbol Madre 3D Scene]]
- [[_COMMUNITY_Galaxia Momentos Scene|Galaxia Momentos Scene]]
- [[_COMMUNITY_Prueba Conex Particles|Prueba Conex Particles]]
- [[_COMMUNITY_Corazon Carrusel Particles|Corazon Carrusel Particles]]
- [[_COMMUNITY_App Shell & Navigation|App Shell & Navigation]]
- [[_COMMUNITY_Flores Amarillas Template|Flores Amarillas Template]]
- [[_COMMUNITY_Vuelo Global Flight Path|Vuelo Global Flight Path]]
- [[_COMMUNITY_Vuelo Global Core|Vuelo Global Core]]
- [[_COMMUNITY_Customize Modal Uploads|Customize Modal Uploads]]
- [[_COMMUNITY_Rosa Virtual Template|Rosa Virtual Template]]
- [[_COMMUNITY_Rosa Virtual Config|Rosa Virtual Config]]

## God Nodes (most connected - your core abstractions)
1. `AntiInspectGuard()` - 20 edges
2. `usePreloadImages()` - 8 edges
3. `Point` - 5 edges
4. `Particle` - 5 edges
5. `ParticlePool` - 5 edges
6. `Point` - 5 edges
7. `Particle` - 5 edges
8. `ParticlePool` - 5 edges
9. `supabase` - 4 edges
10. `buildDisplayFotos()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `usePreloadImages()` --calls--> `CorazonCaruselTemplate()`  [EXTRACTED]
  src/hooks/usePreloadImages.js → src/templates/corazon-carrusel/index.jsx
- `useMapAnimation()` --calls--> `MapScene()`  [EXTRACTED]
  src/templates/vuelo-global/useMapAnimation.js → VueloGlobal.jsx
- `usePreloadImages()` --calls--> `SanValentinApp()`  [EXTRACTED]
  src/hooks/usePreloadImages.js → src/templates/app-recuerdos/index.jsx
- `usePreloadImages()` --calls--> `DiaMujerTemplate()`  [EXTRACTED]
  src/hooks/usePreloadImages.js → src/templates/dia-mujer/index.jsx
- `usePreloadImages()` --calls--> `FloresAmarillasTemplate()`  [EXTRACTED]
  src/hooks/usePreloadImages.js → src/templates/flores-amarillas/index.jsx

## Communities (18 total, 4 thin omitted)

### Community 0 - "Core Template Components"
Cohesion: 0.07
Nodes (12): SanValentinApp(), DiaMujerTemplate(), usePreloadImages(), AntiInspectGuard(), useAntiInspect(), supabase, LibroPopUpTemplate(), GIF (+4 more)

### Community 1 - "Template Configurations"
Cohesion: 0.07
Nodes (19): sanValentinConfig, arbolMadreConfig, cajaMusicalConfig, qrOptions, corazonAnimadoConfig, CorazonCarruselConfig, fuegosAmorConfig, diaMujerConfig (+11 more)

### Community 2 - "Jardin Madre 3D Scene"
Cohesion: 0.06
Nodes (10): JardinView(), PHOTO_MESSAGES, PHOTO_TITLES, PLACEHOLDER_PALETTES, TEMA_BG, TEMA_GLOW, useTypewriter(), PHRASES (+2 more)

### Community 3 - "Arbol Madre 3D Scene"
Cohesion: 0.07
Nodes (12): ArbolView(), buildDisplayFotos(), hashString(), mulberry32(), PHOTO_MESSAGES, PHOTO_TITLES, shuffle(), TEMA_BG (+4 more)

### Community 4 - "Galaxia Momentos Scene"
Cohesion: 0.08
Nodes (12): GalaxyView(), PHOTO_MESSAGES, PHOTO_TITLES, PREVIEW_FOTOS, TEMA_BG, TEMA_GLOW, useTypewriter(), generateSpiralGalaxy() (+4 more)

### Community 5 - "Prueba Conex Particles"
Cohesion: 0.12
Nodes (4): Particle, ParticlePool, Point, SETTINGS

### Community 6 - "Corazon Carrusel Particles"
Cohesion: 0.12
Nodes (5): CorazonCaruselTemplate(), Particle, ParticlePool, Point, settings

### Community 8 - "Flores Amarillas Template"
Cohesion: 0.14
Nodes (8): DistancePanel(), FloresAmarillasTemplate(), normalizePhotoUrls(), PETALS, POLAROID_ROTATIONS, ROMANTIC_PHRASES, useGlobalNavigation(), useTypewriter()

### Community 10 - "Vuelo Global Core"
Cohesion: 0.22
Nodes (6): ArrivalModal(), haversineKm(), vueloGlobalConfig, useMapAnimation(), MapScene(), VueloGlobal()

### Community 11 - "Customize Modal Uploads"
Cohesion: 0.18
Nodes (4): AUDIO_SIGNATURES, IMAGE_SIGNATURES, readMagicBytes(), validateMagicNumber()

## Knowledge Gaps
- **33 isolated node(s):** `IMAGE_SIGNATURES`, `AUDIO_SIGNATURES`, `qrOptions`, `TEMA_BG`, `TEMA_GLOW` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AntiInspectGuard()` connect `Core Template Components` to `Template Configurations`, `Prueba Conex Particles`, `Corazon Carrusel Particles`, `App Shell & Navigation`, `Flores Amarillas Template`, `Rosa Virtual Template`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `IMAGE_SIGNATURES`, `AUDIO_SIGNATURES`, `qrOptions` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Template Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Template Configurations` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Jardin Madre 3D Scene` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Arbol Madre 3D Scene` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Galaxia Momentos Scene` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._