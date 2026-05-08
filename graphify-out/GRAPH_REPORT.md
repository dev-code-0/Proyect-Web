# Graph Report - .  (2026-05-07)

## Corpus Check
- Large corpus: 203 files · ~514,804 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 306 nodes · 426 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Template Configurations|Template Configurations]]
- [[_COMMUNITY_Core Layout & Utilities|Core Layout & Utilities]]
- [[_COMMUNITY_Jardin Madre|Jardin Madre]]
- [[_COMMUNITY_Arbol Madre|Arbol Madre]]
- [[_COMMUNITY_Galaxia Momentos|Galaxia Momentos]]
- [[_COMMUNITY_Particle System|Particle System]]
- [[_COMMUNITY_Carrusel Particles|Carrusel Particles]]
- [[_COMMUNITY_Main UI Components|Main UI Components]]
- [[_COMMUNITY_Flores Amarillas|Flores Amarillas]]
- [[_COMMUNITY_Vuelo Global Logic|Vuelo Global Logic]]
- [[_COMMUNITY_Customization Modal|Customization Modal]]
- [[_COMMUNITY_Rosa Virtual|Rosa Virtual]]
- [[_COMMUNITY_Arrival Modal|Arrival Modal]]
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
- `CorazonCaruselTemplate()` --calls--> `usePreloadImages()`  [EXTRACTED]
  src/templates/corazon-carrusel/index.jsx → src/hooks/usePreloadImages.js
- `SanValentinApp()` --calls--> `usePreloadImages()`  [EXTRACTED]
  src/templates/app-recuerdos/index.jsx → src/hooks/usePreloadImages.js
- `DiaMujerTemplate()` --calls--> `usePreloadImages()`  [EXTRACTED]
  src/templates/dia-mujer/index.jsx → src/hooks/usePreloadImages.js
- `FloresAmarillasTemplate()` --calls--> `usePreloadImages()`  [EXTRACTED]
  src/templates/flores-amarillas/index.jsx → src/hooks/usePreloadImages.js
- `LibroPopUpTemplate()` --calls--> `usePreloadImages()`  [EXTRACTED]
  src/templates/libro-pop/index.jsx → src/hooks/usePreloadImages.js

## Communities (18 total, 5 thin omitted)

### Community 0 - "Template Configurations"
Cohesion: 0.06
Nodes (22): sanValentinConfig, arbolMadreConfig, cajaMusicalConfig, qrOptions, corazonAnimadoConfig, CorazonCarruselConfig, fuegosAmorConfig, diaMujerConfig (+14 more)

### Community 1 - "Core Layout & Utilities"
Cohesion: 0.07
Nodes (12): SanValentinApp(), DiaMujerTemplate(), usePreloadImages(), AntiInspectGuard(), useAntiInspect(), supabase, LibroPopUpTemplate(), GIF (+4 more)

### Community 2 - "Jardin Madre"
Cohesion: 0.06
Nodes (10): JardinView(), PHOTO_MESSAGES, PHOTO_TITLES, PLACEHOLDER_PALETTES, TEMA_BG, TEMA_GLOW, useTypewriter(), PHRASES (+2 more)

### Community 3 - "Arbol Madre"
Cohesion: 0.07
Nodes (12): ArbolView(), buildDisplayFotos(), hashString(), mulberry32(), PHOTO_MESSAGES, PHOTO_TITLES, shuffle(), TEMA_BG (+4 more)

### Community 4 - "Galaxia Momentos"
Cohesion: 0.08
Nodes (12): GalaxyView(), PHOTO_MESSAGES, PHOTO_TITLES, PREVIEW_FOTOS, TEMA_BG, TEMA_GLOW, useTypewriter(), generateSpiralGalaxy() (+4 more)

### Community 5 - "Particle System"
Cohesion: 0.12
Nodes (4): Particle, ParticlePool, Point, SETTINGS

### Community 6 - "Carrusel Particles"
Cohesion: 0.12
Nodes (5): CorazonCaruselTemplate(), Particle, ParticlePool, Point, settings

### Community 8 - "Flores Amarillas"
Cohesion: 0.14
Nodes (8): DistancePanel(), FloresAmarillasTemplate(), normalizePhotoUrls(), PETALS, POLAROID_ROTATIONS, ROMANTIC_PHRASES, useGlobalNavigation(), useTypewriter()

### Community 10 - "Customization Modal"
Cohesion: 0.18
Nodes (4): AUDIO_SIGNATURES, IMAGE_SIGNATURES, readMagicBytes(), validateMagicNumber()

## Knowledge Gaps
- **33 isolated node(s):** `IMAGE_SIGNATURES`, `AUDIO_SIGNATURES`, `qrOptions`, `TEMA_BG`, `TEMA_GLOW` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AntiInspectGuard()` connect `Core Layout & Utilities` to `Template Configurations`, `Particle System`, `Carrusel Particles`, `Main UI Components`, `Flores Amarillas`, `Rosa Virtual`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `IMAGE_SIGNATURES`, `AUDIO_SIGNATURES`, `qrOptions` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Template Configurations` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Core Layout & Utilities` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Jardin Madre` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Arbol Madre` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Galaxia Momentos` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._