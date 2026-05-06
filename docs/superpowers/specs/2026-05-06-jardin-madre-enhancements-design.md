# Jardin Madre - Saturno y estrellas (design)

Date: 2026-05-06
Status: Draft (pending user review)

## Summary
Add a central Saturn object, richer fixed starfields, and shooting stars with floating text phrases to the Jardin Madre scene. Keep performance stable on mobile and do not change UI layout or form fields.

## Goals
- Add a central visual anchor (Saturn) that feels more detailed than galaxia-momentos.
- Increase ambient depth with two layers of fixed stars and subtle twinkle.
- Add random shooting stars with romantic phrases that float in the sky.
- Preserve current flower interaction and billboarded photos.
- Keep GPU cost moderate, with mobile-friendly fallbacks.

## Non-goals
- No changes to UI layout, overlays, or CSS unless required for readability.
- No new form fields or database changes.
- No changes to the photo behavior or flower click flow.

## Visual experience
- Saturn: center of the garden, slightly elevated, visible through the intro and explore phases.
- Rings: three rings with different widths and opacities, gentle wobble, primary theme color.
- Halo: soft glow using a back-side sphere with low opacity.
- Fixed stars: two layers (far and near). Far layer is dense and static. Near layer twinkles subtly.
- Shooting stars: 2-3 max active, diagonal paths across the sky, each with a floating phrase sprite that fades out with the trail.

## Behavior and interaction
- Saturn is non-interactive and does not block raycasting to flowers.
- Fixed stars render with depthWrite disabled so they never occlude flowers.
- Shooting star text is a sprite that always faces the camera and follows the shooting star head.

## Data and configuration
- Phrase list: static array of romantic phrases, similar tone to galaxia-momentos.
- Phrase selection: shuffled pool, no repeats until pool is exhausted.
- Tunable constants (names can be adjusted during implementation):
  - STARFIELD_FAR_COUNT
  - STARFIELD_NEAR_COUNT
  - SHOOTER_MAX_ACTIVE
  - SHOOTER_INTERVAL_MIN / SHOOTER_INTERVAL_MAX
  - SHOOTER_LIFE_MIN / SHOOTER_LIFE_MAX

## Technical approach
- File focus: src/templates/jardin-madre/useJardin.js
- Saturn implementation:
  - Procedural texture via canvas (banded gradient + subtle noise).
  - Sphere mesh for body, back-side sphere for halo.
  - Three ring meshes with different inner/outer radii and opacities.
  - Animate rotation and subtle ring wobble in the render loop.
- Fixed stars:
  - Far layer: Points with static positions and low opacity.
  - Near layer: Points with per-star phase; twinkle by modulating opacity or size in a light-weight update.
- Shooting stars:
  - Pool of small sprites or points as heads plus a short line/trail.
  - Each star stores start position, direction, speed, life, and phrase sprite.
  - Spawn interval randomized within min/max window.
  - On expire, respawn with new phrase and random path.

## Performance and mobile fallbacks
- Reduce star counts and shooting star frequency when viewport width is small.
- Cap renderer pixel ratio at 2 (already used) and avoid heavy shaders.
- Keep per-frame updates minimal: only update twinkling near stars and active shooting stars.

## Risks and mitigations
- Visual clutter: limit max active shooting stars and keep text size modest.
- Overdraw: use low opacity and depthWrite false to prevent harsh stacking.
- Performance: use lower counts on mobile and reuse geometry where possible.

## Validation
- Manual check on desktop and mobile:
  - Saturn visible and centered, rings animate subtly.
  - Flowers and photos still clickable and facing camera.
  - Fixed stars are visible across screen and twinkle softly.
  - Shooting stars appear randomly with readable floating phrases.
