import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ─── Theme palettes ──────────────────────────────────────────────────────────
const THEMES = {
  cosmos:    { primary: 0x4facfe, particle: 0xa8edea, ring: 0x4facfe, saturnA: '#0e2a4a', saturnB: '#1a4a7a', bg: 0x020b18 },
  romantica: { primary: 0xff6b9d, particle: 0xffb3d1, ring: 0xff6b9d, saturnA: '#3a0a20', saturnB: '#6a1a40', bg: 0x080010 },
  dorada:    { primary: 0xffd200, particle: 0xffe066, ring: 0xffd200, saturnA: '#2a1800', saturnB: '#5a3800', bg: 0x0d0800 },
  esmeralda: { primary: 0x10b981, particle: 0x6ee7b7, ring: 0x10b981, saturnA: '#001a0a', saturnB: '#013a1a', bg: 0x001a0d },
};

const PHRASES = [
  'te quiero mucho', 'contigo siempre', 'mi reyna',
  'eres especial',   'para siempre',    'te amo',
  'mi todo',         'amor eterno',     'eres única',
  'mi corazón',      'siempre juntos',  'mi cielo',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpN(a, b, t) { return a + (b - a) * t; }

/** Glowing soft-circle texture for galaxy particles */
function makeStarSpotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.25,'rgba(255,255,255,0.7)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

/** Saturn body gradient texture */
function makeSaturnTexture(colorA, colorB) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0,    colorA);
  g.addColorStop(0.35, colorB);
  g.addColorStop(0.5,  colorA);
  g.addColorStop(0.65, colorB);
  g.addColorStop(1,    colorA);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  ctx.globalAlpha = 0.1;
  for (let y = 0; y < 256; y += 18) {
    ctx.fillStyle = y % 36 === 0 ? '#ffffff' : '#000000';
    ctx.fillRect(0, y, 256, 9);
  }
  return new THREE.CanvasTexture(c);
}

/** Demo portal gradient for preview mode (local canvas — no CORS) */
function makeDemoPortalTexture(hexColor) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const hex = '#' + hexColor.toString(16).padStart(6, '0');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0,   hex + 'ff');
  g.addColorStop(0.6, hex + '99');
  g.addColorStop(1,   hex + '00');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/**
 * Spiral galaxy particle cloud — 2 arms, bright core, cooler outer rim.
 * Colors blend from theme primary (inner) to cool blue-white (outer).
 */
function generateSpiralGalaxy(count, maxR, primaryHex) {
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  const iR = ((primaryHex >> 16) & 0xff) / 255;
  const iG = ((primaryHex >>  8) & 0xff) / 255;
  const iB = ((primaryHex)       & 0xff) / 255;

  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let x, y, z, r;

    if (rand < 0.12) {
      // Dense bright core
      r = Math.random() * 4.5;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r;
      y = (Math.random() - 0.5) * 0.6;
      z = Math.sin(a) * r;
    } else if (rand < 0.76) {
      // Two spiral arms
      const arm = rand < 0.44 ? 0 : 1;
      const armBase = arm * Math.PI;
      r = 3.5 + Math.pow(Math.random(), 0.55) * (maxR - 3.5);
      const wind = r * 0.22;
      const scatter = (Math.random() - 0.5) * (r * 0.18 + 1.8);
      const a = armBase + wind + scatter * 0.055;
      x = Math.cos(a) * r + Math.sin(a) * scatter;
      y = (Math.random() - 0.5) * (0.35 + r * 0.035);
      z = Math.sin(a) * r - Math.cos(a) * scatter;
    } else {
      // Inter-arm haze
      r = Math.random() * maxR;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r;
      y = (Math.random() - 0.5) * (0.25 + r * 0.025);
      z = Math.sin(a) * r;
    }

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const t      = Math.min(Math.sqrt(x * x + z * z) / maxR, 1);
    const inCore = t < 0.09;

    if (inCore) {
      colors[i * 3]     = 1;
      colors[i * 3 + 1] = 0.92;
      colors[i * 3 + 2] = 0.85;
    } else {
      colors[i * 3]     = lerpN(Math.min(iR * 1.3, 1), 0.42, t);
      colors[i * 3 + 1] = lerpN(Math.min(iG * 1.1, 1), 0.36, t);
      colors[i * 3 + 2] = lerpN(Math.min(iB * 1.1, 1), 0.95, t);
    }
  }

  return { positions, colors };
}

/** Floating romantic phrase sprite with glow */
function makeTextSprite(text, primaryHex) {
  const W = 512, H = 80;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const hexColor = '#' + primaryHex.toString(16).padStart(6, '0');

  ctx.clearRect(0, 0, W, H);
  ctx.font = 'italic 42px "Dancing Script", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.shadowColor = hexColor;
  ctx.shadowBlur  = 22;
  ctx.fillStyle   = 'rgba(255,255,255,0.93)';
  ctx.fillText(text, W / 2, H / 2);
  ctx.shadowBlur = 8;
  ctx.fillText(text, W / 2, H / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const sprite  = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  );
  sprite.scale.set(10, 10 * (H / W), 1); // ~10 × 1.56 units
  return sprite;
}

/**
 * Web Audio API romantic ambient — A-minor pad with reverb delay.
 * Used automatically when no music file is uploaded.
 */
function startAmbient() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);
    master.gain.linearRampToValueAtTime(0.18, ac.currentTime + 6);

    // Simple reverb via two delay lines
    const delayA = ac.createDelay(2);   delayA.delayTime.value = 0.9;
    const delayB = ac.createDelay(2);   delayB.delayTime.value = 1.3;
    const fbA = ac.createGain();        fbA.gain.value = 0.35;
    const fbB = ac.createGain();        fbB.gain.value = 0.28;
    delayA.connect(fbA); fbA.connect(delayA); fbA.connect(master);
    delayB.connect(fbB); fbB.connect(delayB); fbB.connect(master);

    // A-minor chord: A2 E3 A3 C4 E4
    [
      { freq: 110,    gain: 0.22, type: 'sine'     },  // A2 bass
      { freq: 165,    gain: 0.15, type: 'sine'     },  // E3
      { freq: 220,    gain: 0.12, type: 'triangle' },  // A3
      { freq: 261.63, gain: 0.09, type: 'triangle' },  // C4
      { freq: 329.63, gain: 0.06, type: 'triangle' },  // E4
    ].forEach(({ freq, gain, type }) => {
      const osc = ac.createOscillator();
      const g   = ac.createGain();
      osc.type           = type;
      osc.frequency.value = freq;
      g.gain.value        = gain;
      osc.connect(g);
      g.connect(delayA);
      g.connect(delayB);
      g.connect(master);
      osc.start();
    });

    // Slow tremolo pad on E4
    const pad    = ac.createOscillator();
    const padG   = ac.createGain();
    const lfo    = ac.createOscillator();
    const lfoG   = ac.createGain();
    pad.frequency.value  = 329.63;
    pad.type             = 'sine';
    padG.gain.value      = 0.04;
    lfo.frequency.value  = 0.22;
    lfoG.gain.value      = 0.03;
    lfo.connect(lfoG);
    lfoG.connect(padG.gain);
    pad.connect(padG);
    padG.connect(delayA);
    padG.connect(master);
    pad.start();
    lfo.start();

    return {
      stop() {
        master.gain.linearRampToValueAtTime(0, ac.currentTime + 2.5);
        setTimeout(() => { try { ac.close(); } catch { /* ignore */ } }, 3000);
      },
    };
  } catch {
    return { stop() {} };
  }
}

// ─── Main hook ───────────────────────────────────────────────────────────────

export function useGalaxy(containerRef, data, onPortalClickRef) {
  const replayRef = useRef(false);

  const replayIntro = useCallback(() => {
    replayRef.current = true;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !data) return;

    let mounted = true;

    const tema      = THEMES[data.tema] || THEMES.romantica;
    const rawFotos  = Array.isArray(data.fotos) ? data.fotos.slice(0, 8) : [];
    const isPreview = rawFotos.length === 0;
    const DEMO_COLORS = [tema.primary, 0xffffff, (tema.primary >> 1) | 0, 0xdde4ff, tema.primary, 0xffeeff];
    const photoCount = isPreview ? 6 : rawFotos.length;

    // ── RENDERER ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(tema.bg, 1);
    container.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, container.clientWidth / container.clientHeight, 0.1, 500
    );
    camera.position.set(0, 80, 100);

    // ── ORBIT CONTROLS ────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping  = true;
    controls.dampingFactor  = 0.04;
    controls.minDistance    = 8;
    controls.maxDistance    = 90;
    controls.enabled        = false;

    // ── BACKGROUND STAR FIELD ─────────────────────────────────────────────
    {
      const N = 3500;
      const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const θ = Math.random() * Math.PI * 2;
        const φ = Math.acos(2 * Math.random() - 1);
        const r = 90 + Math.random() * 50;
        pos[i*3]   = r * Math.sin(φ) * Math.cos(θ);
        pos[i*3+1] = r * Math.sin(φ) * Math.sin(θ);
        pos[i*3+2] = r * Math.cos(φ);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const stars = new THREE.Points(geo, new THREE.PointsMaterial({
        color: tema.particle, size: 0.22, sizeAttenuation: true,
        transparent: true, opacity: 0.8, depthWrite: false,
      }));
      scene.add(stars);

      // Slow rotation reference kept via closure
      scene.userData.starsRef = stars;
    }

    // ── SPIRAL GALAXY ─────────────────────────────────────────────────────
    const GALAXY_R     = 55;
    const GALAXY_COUNT = 22000;
    const starSpot     = makeStarSpotTexture();
    const galaxyData   = generateSpiralGalaxy(GALAXY_COUNT, GALAXY_R, tema.primary);

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyData.positions, 3));
    galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(galaxyData.colors,    3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.35,
      sizeAttenuation: true,
      vertexColors: true,
      map: starSpot,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    galaxyPoints.rotation.x = -0.18; // slight tilt — shows spiral from camera angle
    scene.add(galaxyPoints);

    // ── DUST PARTICLES (InstancedMesh — 1 draw call) ──────────────────────
    const DUST_COUNT = 600;
    const dustMesh   = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.05, 4, 4),
      new THREE.MeshBasicMaterial({ color: tema.particle, transparent: true, opacity: 0.3 }),
      DUST_COUNT
    );
    const dustBase = [];
    const dummy    = new THREE.Matrix4();
    for (let i = 0; i < DUST_COUNT; i++) {
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 70
      );
      dustBase.push(v);
      dummy.setPosition(v);
      dustMesh.setMatrixAt(i, dummy);
    }
    dustMesh.instanceMatrix.needsUpdate = true;
    scene.add(dustMesh);

    // ── SATURN BODY ───────────────────────────────────────────────────────
    const saturnBody = new THREE.Mesh(
      new THREE.SphereGeometry(5.5, 40, 40),
      new THREE.MeshBasicMaterial({ map: makeSaturnTexture(tema.saturnA, tema.saturnB) })
    );
    scene.add(saturnBody);

    // Saturn glow halo
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(6.8, 32, 32),
      new THREE.MeshBasicMaterial({ color: tema.primary, transparent: true, opacity: 0.07, side: THREE.BackSide })
    ));

    // Saturn rings (3 concentric)
    const RING_TILT = Math.PI * 0.38;
    [
      { inner: 6.8,  outer: 9.2,  opacity: 0.28 },
      { inner: 9.5,  outer: 11.5, opacity: 0.17 },
      { inner: 11.8, outer: 13.5, opacity: 0.11 },
    ].forEach(({ inner, outer, opacity }) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 64),
        new THREE.MeshBasicMaterial({ color: tema.primary, transparent: true, opacity, side: THREE.DoubleSide })
      );
      ring.rotation.x = RING_TILT;
      scene.add(ring);
    });

    // ── PHOTO PORTALS ─────────────────────────────────────────────────────
    const portals          = [];
    const rings            = [];
    const orbitData        = [];

    for (let i = 0; i < photoCount; i++) {
      const baseAngle = (i / photoCount) * Math.PI * 2;
      const radius    = 18 + (i % 3) * 6;
      const height    = Math.sin(baseAngle * 1.5 + i) * 9;
      const pos       = new THREE.Vector3(
        radius * Math.cos(baseAngle), height, radius * Math.sin(baseAngle)
      );
      orbitData.push({ radius, baseAngle, height });

      // Glow ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.95, 3.75, 64),
        new THREE.MeshBasicMaterial({ color: tema.ring, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      );
      ring.position.copy(pos);
      ring.userData.phase = (i / photoCount) * Math.PI * 2;
      rings.push(ring);
      scene.add(ring);

      // Photo circle
      const circle = new THREE.Mesh(
        new THREE.CircleGeometry(2.8, 64),
        new THREE.MeshBasicMaterial({ color: tema.primary, transparent: true, opacity: 0 })
      );
      circle.position.copy(pos);
      circle.userData.index = i;
      portals.push(circle);
      scene.add(circle);

      if (isPreview) {
        circle.material.map = makeDemoPortalTexture(DEMO_COLORS[i % DEMO_COLORS.length]);
        circle.material.color.set(0xffffff);
        circle.userData.loaded = true;
      } else {
        // UV center-crop — no canvas, no CORS
        new THREE.TextureLoader().load(rawFotos[i], (tex) => {
          if (!mounted) { tex.dispose(); return; }
          tex.minFilter = tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
          const img = tex.image;
          if (img?.width && img?.height) {
            const R = img.width / img.height;
            if (R > 1.05) {
              tex.repeat.set(1 / R, 1);
              tex.offset.set((1 - 1 / R) / 2, 0);
            } else if (R < 0.95) {
              tex.repeat.set(1, R);
              tex.offset.set(0, (1 - R) / 2);
            }
          }
          circle.material.map = tex;
          circle.material.color.set(0xffffff);
          circle.userData.loaded = true;
        });
      }
    }

    // ── FLOATING PHRASES (created after fonts load) ───────────────────────
    const textSprites = [];
    document.fonts.ready.then(() => {
      if (!mounted) return;
      PHRASES.forEach((text, i) => {
        const sprite    = makeTextSprite(text, tema.primary);
        const angle     = (i / PHRASES.length) * Math.PI * 2;
        const r         = 24 + (i % 4) * 9; // 24, 33, 42, 51
        const baseY     = (Math.random() - 0.5) * 14;
        const phaseOff  = (i / PHRASES.length) * Math.PI * 2;
        sprite.position.set(r * Math.cos(angle), baseY, r * Math.sin(angle));
        sprite.userData  = { ...sprite.userData, baseAngle: angle, radius: r, baseY, phaseOff };
        sprite.material.opacity = 0;
        textSprites.push(sprite);
        scene.add(sprite);
      });
    });

    // ── CINEMATIC INTRO CURVE ─────────────────────────────────────────────
    const introCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,   80,  100),
      new THREE.Vector3(-75, 35,   60),
      new THREE.Vector3(-85,  5,  -25),
      new THREE.Vector3(-30, -18, -75),
      new THREE.Vector3(55,  -12, -60),
      new THREE.Vector3(78,   12,  20),
      new THREE.Vector3(45,   28,  55),
      new THREE.Vector3(0,    22,  58),
    ], false, 'centripetal');

    // ── AUDIO ─────────────────────────────────────────────────────────────
    let audio         = null;
    let fadeTimer     = null;
    let ambientHandle = null;

    if (data.musica) {
      audio        = new Audio(data.musica);
      audio.loop   = true;
      audio.volume = 0;
      audio.play().catch(() => {});
      let vol = 0;
      fadeTimer = setInterval(() => {
        vol = Math.min(vol + 0.016, 0.8);
        if (audio) audio.volume = vol;
        if (vol >= 0.8) clearInterval(fadeTimer);
      }, 60);
    } else {
      ambientHandle = startAmbient();
    }

    // ── STATE ─────────────────────────────────────────────────────────────
    let phase   = 'intro';
    let introT  = 0;
    let flyTween = null;

    // ── RAYCASTER ─────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();

    const handlePointer = (e) => {
      if (phase !== 'explore' || flyTween) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const cx   = e.touches ? e.touches[0].clientX : e.clientX;
      const cy   = e.touches ? e.touches[0].clientY : e.clientY;
      pointer.x  = ((cx - rect.left) / rect.width)  *  2 - 1;
      pointer.y  = -((cy - rect.top)  / rect.height) *  2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(portals);
      if (hits.length > 0) {
        const idx = hits[0].object.userData.index;
        onPortalClickRef.current?.(idx);
        flyTween = {
          from:      camera.position.clone(),
          to:        portals[idx].position.clone().add(new THREE.Vector3(0, 0.5, 6)),
          portalPos: portals[idx].position.clone(),
          t:         0,
        };
        controls.enabled = false;
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointer);

    // ── RESIZE ────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── ANIMATION LOOP ────────────────────────────────────────────────────
    const INTRO_MS    = 12000;
    const ORBIT_SPEED = 0.025;
    const PHRASE_SPEED = 0.012;
    let lastTime = performance.now();
    let raf;

    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      const dt   = Math.min(now - lastTime, 50);
      lastTime   = now;
      const time = now / 1000;

      // Replay trigger
      if (replayRef.current) {
        replayRef.current = false;
        phase   = 'intro';
        introT  = 0;
        flyTween = null;
        controls.enabled = false;
        camera.position.set(0, 80, 100);
      }

      // Saturn & galaxy slow rotation
      saturnBody.rotation.y      += 0.0008;
      galaxyPoints.rotation.y    += 0.00008; // very slow galaxy spin
      scene.userData.starsRef.rotation.y += 0.00012;

      // Dust oscillation (bounded)
      for (let i = 0; i < DUST_COUNT; i++) {
        dummy.setPosition(
          dustBase[i].x + Math.sin(time * 0.25 + i * 2.1) * 2.5,
          dustBase[i].y + Math.cos(time * 0.18 + i * 1.7) * 1.5,
          dustBase[i].z + Math.sin(time * 0.32 + i * 2.9) * 2.5
        );
        dustMesh.setMatrixAt(i, dummy);
      }
      dustMesh.instanceMatrix.needsUpdate = true;

      // Portal orbit + glow + billboard
      for (let i = 0; i < portals.length; i++) {
        const { radius, baseAngle, height } = orbitData[i];
        const a = baseAngle + time * ORBIT_SPEED;
        const p = new THREE.Vector3(radius * Math.cos(a), height + Math.sin(time * 0.4 + i * 1.1) * 0.8, radius * Math.sin(a));
        portals[i].position.copy(p);
        rings[i].position.copy(p);
        portals[i].lookAt(camera.position);
        rings[i].lookAt(camera.position);
        rings[i].material.opacity = 0.28 + 0.38 * Math.sin(time * 1.3 + rings[i].userData.phase);
        if (portals[i].userData.loaded && portals[i].material.opacity < 1)
          portals[i].material.opacity = Math.min(portals[i].material.opacity + 0.01, 1);
      }

      // Floating phrases — slow orbit + opacity pulse
      for (let i = 0; i < textSprites.length; i++) {
        const { baseAngle, radius, baseY, phaseOff } = textSprites[i].userData;
        const a = baseAngle + time * PHRASE_SPEED;
        textSprites[i].position.set(
          radius * Math.cos(a),
          baseY + Math.sin(time * 0.28 + phaseOff) * 1.8,
          radius * Math.sin(a)
        );
        textSprites[i].material.opacity = 0.45 + 0.5 * Math.sin(time * 0.38 + phaseOff);
      }

      // ── INTRO: camera sweeps around Saturn
      if (phase === 'intro') {
        introT = Math.min(introT + dt / INTRO_MS, 1);
        const t = easeInOutCubic(introT);
        camera.position.copy(introCurve.getPoint(t));
        camera.lookAt(0, 0, 0);
        if (introT >= 1) {
          phase = 'explore';
          controls.target.set(0, 0, 0);
          controls.enabled = true;
        }
      }

      // ── EXPLORE: OrbitControls + portal fly-to
      if (phase === 'explore') {
        if (flyTween) {
          flyTween.t = Math.min(flyTween.t + dt / 1400, 1);
          camera.position.lerpVectors(flyTween.from, flyTween.to, easeInOutCubic(flyTween.t));
          camera.lookAt(flyTween.portalPos);
          if (flyTween.t >= 1) {
            controls.target.copy(flyTween.portalPos);
            controls.enabled = true;
            flyTween = null;
          }
        } else {
          controls.update();
        }
      }

      renderer.render(scene, camera);
    };

    raf = requestAnimationFrame(animate);

    // ── CLEANUP ───────────────────────────────────────────────────────────
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointer);
      if (fadeTimer) clearInterval(fadeTimer);
      if (audio) { audio.pause(); audio.src = ''; }
      if (ambientHandle) ambientHandle.stop();
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        obj.geometry?.dispose();
        if (obj.material) { obj.material.map?.dispose(); obj.material.dispose(); }
      });
      starSpot.dispose();
      renderer.dispose();
    };
  }, [containerRef, data]);

  return { replayIntro };
}
