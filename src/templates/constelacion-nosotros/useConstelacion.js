import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { mulberry32, hashString } from '../_shared/seededRandom.js';

const THEMES = {
  cosmos:    { primary: 0x4facfe, accent: 0xa8edea, line: 0x9ad4ff, bg: 0x020b18, comet: 0xfff8c4 },
  romantica: { primary: 0xff6b9d, accent: 0xffb3d1, line: 0xff9ec5, bg: 0x080010, comet: 0xfff0a0 },
  dorada:    { primary: 0xffd200, accent: 0xffe066, line: 0xffd97a, bg: 0x0d0800, comet: 0xfff4cf },
  esmeralda: { primary: 0x10b981, accent: 0x6ee7b7, line: 0x9ef3c4, bg: 0x001a0d, comet: 0xeaffe0 },
};

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function makeStarSpotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.15, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.65, 'rgba(255,255,255,0.18)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function makeCometTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 32, 256, 32);
  g.addColorStop(0,    'rgba(255,255,255,0)');
  g.addColorStop(0.7,  'rgba(255,255,255,0.45)');
  g.addColorStop(0.92, 'rgba(255,255,255,0.95)');
  g.addColorStop(1,    'rgba(255,255,255,1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 64);
  return new THREE.CanvasTexture(c);
}

// Build a stable constellation layout: positions on a "Z-shape-ish" path
// inside an ellipse so it always looks like a real constellation.
function buildConstellationLayout(count, seed) {
  const rng = mulberry32(seed);
  const pts = [];
  const aspect = 1.6;
  const radiusX = 6.0 * aspect;
  const radiusY = 4.0;

  // Distribute points along a polyline path inside the ellipse,
  // then jitter slightly so it feels organic.
  const segments = count;
  for (let i = 0; i < segments; i++) {
    const t = i / Math.max(1, segments - 1);
    const angle = -Math.PI * 0.85 + t * Math.PI * 1.7 + (rng() - 0.5) * 0.35;
    const r = 0.45 + (rng() * 0.55);
    const x = Math.cos(angle) * radiusX * r;
    const y = Math.sin(angle) * radiusY * r + (rng() - 0.5) * 0.6;
    const z = (rng() - 0.5) * 1.2;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return pts;
}

export function useConstelacion(containerRef, data, onStarClickRef) {
  const animRef = useRef({});

  const replay = useCallback(() => {
    const s = animRef.current;
    if (!s) return;
    s.elapsed = 0;
    s.lineProgress = 0;
    s.starsRevealed = 0;
    s.replayStart = performance.now();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tema = data?.tema || 'cosmos';
    const theme = THEMES[tema] || THEMES.cosmos;
    const fotos = Array.isArray(data?.displayFotos) ? data.displayFotos.slice(0, 8) : [];
    const starCount = Math.max(3, Math.min(8, fotos.length));
    const seed = hashString(data?.seed || 'constelacion-' + (data?.nombre_constelacion || 'default'));

    // ─── Scene setup ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(theme.bg);
    scene.fog = new THREE.FogExp2(theme.bg, 0.012);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(0, 0.5, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ─── Background starfield ────────────────────────────────────────
    const bgStarGeo = new THREE.BufferGeometry();
    const bgStarCount = 1600;
    const bgPositions = new Float32Array(bgStarCount * 3);
    const bgSizes = new Float32Array(bgStarCount);
    const rng = mulberry32(seed + 7);
    for (let i = 0; i < bgStarCount; i++) {
      const r = 30 + rng() * 60;
      const a = rng() * Math.PI * 2;
      const b = (rng() - 0.5) * Math.PI;
      bgPositions[i * 3]     = Math.cos(a) * Math.cos(b) * r;
      bgPositions[i * 3 + 1] = Math.sin(b) * r;
      bgPositions[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r - 20;
      bgSizes[i] = 0.25 + rng() * 0.9;
    }
    bgStarGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgStarGeo.setAttribute('size', new THREE.BufferAttribute(bgSizes, 1));

    const starTexture = makeStarSpotTexture();
    const bgStarMat = new THREE.PointsMaterial({
      map: starTexture,
      size: 0.5,
      sizeAttenuation: true,
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const bgStars = new THREE.Points(bgStarGeo, bgStarMat);
    scene.add(bgStars);

    // ─── Constellation layout ────────────────────────────────────────
    const layout = buildConstellationLayout(starCount, seed);

    // ─── Main stars (one per photo) ──────────────────────────────────
    const textureLoader = new THREE.TextureLoader();
    const stars = [];
    const starGroup = new THREE.Group();
    scene.add(starGroup);

    layout.forEach((pos, idx) => {
      const group = new THREE.Group();
      group.position.copy(pos);

      // Outer glow sprite
      const glowMat = new THREE.SpriteMaterial({
        map: starTexture,
        color: theme.accent,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glowSprite = new THREE.Sprite(glowMat);
      glowSprite.scale.set(2.6, 2.6, 1);
      group.add(glowSprite);

      // Core star sprite (white)
      const coreMat = new THREE.SpriteMaterial({
        map: starTexture,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const coreSprite = new THREE.Sprite(coreMat);
      coreSprite.scale.set(0.9, 0.9, 1);
      group.add(coreSprite);

      // Photo plane (hidden until star is "revealed")
      const photoUrl = fotos[idx];
      const photoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.95, 0.95),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
      );
      photoMesh.position.z = 0.05;
      group.add(photoMesh);

      if (photoUrl) {
        textureLoader.load(photoUrl, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          photoMesh.material.map = tex;
          photoMesh.material.needsUpdate = true;
        });
      }

      // Make the group clickable: store userData
      group.userData = {
        index: idx,
        glowSprite,
        coreSprite,
        photoMesh,
        targetPos: pos.clone(),
        startPos: pos.clone(),
        revealStart: 0,
      };

      starGroup.add(group);
      stars.push(group);
    });

    // ─── Connector line ──────────────────────────────────────────────
    // We use a single Line with all vertices; we animate by setting drawRange.
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(stars.length * 3);
    stars.forEach((st, i) => {
      linePositions[i * 3]     = st.position.x;
      linePositions[i * 3 + 1] = st.position.y;
      linePositions[i * 3 + 2] = st.position.z;
    });
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: theme.line,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.geometry.setDrawRange(0, 0);
    scene.add(line);

    // ─── Comet ───────────────────────────────────────────────────────
    const cometTex = makeCometTexture();
    const cometMat = new THREE.SpriteMaterial({
      map: cometTex,
      color: theme.comet,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const comet = new THREE.Sprite(cometMat);
    comet.scale.set(7, 1.4, 1);
    comet.position.set(-30, 6, -2);
    scene.add(comet);

    // ─── Picking (raycaster) ─────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function setPointerFromEvent(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      const cx = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      pointer.x = ((cx - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((cy - rect.top) / rect.height) * 2 + 1;
    }

    function onClick(e) {
      setPointerFromEvent(e);
      raycaster.setFromCamera(pointer, camera);
      const meshes = stars.map(s => s.userData.photoMesh);
      const intersects = raycaster.intersectObjects(meshes, false);
      if (intersects.length > 0) {
        const idx = intersects[0].object.parent.userData.index;
        if (onStarClickRef?.current) onStarClickRef.current(idx);
      }
    }

    renderer.domElement.addEventListener('click', onClick);

    // ─── Animation state ─────────────────────────────────────────────
    const state = {
      elapsed: 0,
      lineProgress: 0,
      starsRevealed: 0,
      replayStart: performance.now(),
      cometActive: false,
      cometStart: 0,
      cometNext: 8 + Math.random() * 6,
    };
    animRef.current = state;

    // Reveal timeline parameters
    const REVEAL_PER_STAR = 0.55;            // seconds for star pop
    const STAR_DELAY = 0.45;                 // delay between stars
    const LINE_PER_SEGMENT = 0.6;            // seconds per segment

    // ─── Render loop ─────────────────────────────────────────────────
    let rafId;
    const clock = new THREE.Clock();

    function tick() {
      const dt = clock.getDelta();
      state.elapsed += dt;
      const t = state.elapsed;

      // Star reveal
      stars.forEach((star, idx) => {
        const localStart = idx * STAR_DELAY;
        const localT = (t - localStart) / REVEAL_PER_STAR;
        const p = Math.max(0, Math.min(1, localT));
        const eased = easeOutCubic(p);
        star.userData.glowSprite.material.opacity = eased * 0.95;
        star.userData.coreSprite.material.opacity = eased;
        star.userData.photoMesh.material.opacity = eased * 0.95;

        // Pulse glow gently after reveal
        if (p >= 1) {
          const pulse = 0.85 + Math.sin(t * 2 + idx * 0.7) * 0.15;
          star.userData.glowSprite.material.opacity = pulse;
          star.userData.glowSprite.scale.setScalar(2.6 + Math.sin(t * 2.2 + idx) * 0.18);
        }
      });

      // Line reveal — starts after first star is revealed
      const lineStart = REVEAL_PER_STAR * 0.6;
      const lineDuration = (stars.length - 1) * LINE_PER_SEGMENT;
      const lineRawT = (t - lineStart) / lineDuration;
      const lineT = Math.max(0, Math.min(1, lineRawT));
      const segmentsToDraw = Math.floor(lineT * (stars.length - 1) + 0.001);
      const partial = (lineT * (stars.length - 1)) - segmentsToDraw;

      if (lineT > 0) {
        // We draw fully completed segments, then a partial last one by adding a temp vertex
        // Simpler: just draw vertex count = segmentsToDraw + 1
        const drawCount = Math.min(stars.length, segmentsToDraw + 1);
        line.geometry.setDrawRange(0, drawCount);

        // For partial smoothing: interpolate the last visible vertex toward the next
        if (drawCount > 0 && drawCount < stars.length) {
          const a = stars[drawCount - 1].position;
          const b = stars[drawCount].position;
          const arr = line.geometry.attributes.position.array;
          arr[(drawCount) * 3]     = a.x + (b.x - a.x) * partial;
          arr[(drawCount) * 3 + 1] = a.y + (b.y - a.y) * partial;
          arr[(drawCount) * 3 + 2] = a.z + (b.z - a.z) * partial;
          line.geometry.attributes.position.needsUpdate = true;
          line.geometry.setDrawRange(0, drawCount + 1);
        } else {
          // Restore the last vertex to original target when full
          if (drawCount === stars.length) {
            const last = stars[stars.length - 1].position;
            const arr = line.geometry.attributes.position.array;
            arr[(stars.length - 1) * 3]     = last.x;
            arr[(stars.length - 1) * 3 + 1] = last.y;
            arr[(stars.length - 1) * 3 + 2] = last.z;
            line.geometry.attributes.position.needsUpdate = true;
          }
        }
      }

      // Gentle background star twinkle
      bgStars.rotation.y += dt * 0.005;
      bgStarMat.opacity = 0.7 + Math.sin(t * 0.6) * 0.12;

      // Camera subtle parallax (autonomous breathing)
      camera.position.x = Math.sin(t * 0.18) * 0.6;
      camera.position.y = 0.5 + Math.cos(t * 0.15) * 0.3;
      camera.lookAt(0, 0, 0);

      // Comet animation
      if (!state.cometActive && t > state.cometNext) {
        state.cometActive = true;
        state.cometStart = t;
        comet.position.set(-30, 4 + (Math.random() - 0.5) * 8, -2);
      }
      if (state.cometActive) {
        const ct = (t - state.cometStart) / 2.4;
        if (ct >= 1) {
          state.cometActive = false;
          state.cometNext = t + 14 + Math.random() * 10;
          comet.material.opacity = 0;
        } else {
          const cx = -30 + ct * 60;
          comet.position.x = cx;
          comet.position.y -= dt * 1.6;
          // fade in then out
          const fade = ct < 0.2 ? ct / 0.2 : ct > 0.8 ? (1 - ct) / 0.2 : 1;
          comet.material.opacity = fade * 0.9;
        }
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // ─── Resize ─────────────────────────────────────────────────────
    function onResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // ─── Cleanup ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onClick);
      try {
        container.removeChild(renderer.domElement);
      } catch (e) { /* node may already be gone */ }
      bgStarGeo.dispose();
      bgStarMat.dispose();
      starTexture.dispose();
      cometTex.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      stars.forEach(s => {
        s.userData.glowSprite.material.dispose();
        s.userData.coreSprite.material.dispose();
        s.userData.photoMesh.material.map?.dispose();
        s.userData.photoMesh.material.dispose();
        s.userData.photoMesh.geometry.dispose();
      });
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, JSON.stringify(data?.displayFotos || []), data?.tema, data?.nombre_constelacion]);

  return { replay };
}
