import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ─── Theme palettes ──────────────────────────────────────────────────────────
const THEMES = {
  rosas:     { primary: 0xff6b9d, particle: 0xffb3d1, stem: 0xbe185d, bg: 0x0a0005, saturnA: '#2a0a16', saturnB: '#5a1a34' },
  girasoles: { primary: 0xffd200, particle: 0xffe066, stem: 0x854d0e, bg: 0x0a0800, saturnA: '#2a1800', saturnB: '#5a3800' },
  lavanda:   { primary: 0xc084fc, particle: 0xe0b8ff, stem: 0x6d28d9, bg: 0x05000a, saturnA: '#1a0b2e', saturnB: '#3a1b6a' },
  primavera: { primary: 0x34d399, particle: 0x6ee7b7, stem: 0x15803d, bg: 0x000a05, saturnA: '#072014', saturnB: '#0c3d26' },
};

const PHRASES = [
  'te quiero mucho',
  'mi todo',
  'amor eterno',
  'siempre contigo',
  'mi alegria',
  'para siempre',
  'eres especial',
  'mi luz',
  'mi refugio',
  'te adoro',
  'mi mundo',
  'gracias por tanto',
  'mi corazon',
  'eres unica',
  'contigo siempre',
  'mi vida',
  'mi tesoro',
  'solo tu',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    // AudioContext might be blocked, that's fine
  }
}

function makePetalTexture(hexColor) {
  const W = 64, H = 128;
  const c = document.createElement('canvas');
  c.width = W; c.height = H; 
  const ctx = c.getContext('2d');
  const r = (hexColor >> 16) & 0xff;
  const g = (hexColor >> 8) & 0xff;
  const b = hexColor & 0xff;

  // Gradient: opaque at base (bottom), transparent at tip (top)
  const grad = ctx.createLinearGradient(0, H, 0, 0);
  grad.addColorStop(0,   `rgba(${r},${g},${b},0.95)`);
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.88)`);
  grad.addColorStop(0.7, `rgba(${r},${g},${b},0.55)`);
  grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(W / 2, H / 2, W / 2 - 3, H / 2 - 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Subtle inner highlight (vein)
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.ellipse(W / 2, H * 0.38, W / 8, H * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(c);
}

function makeFallingPetalTexture() {
  const c = document.createElement('canvas');
  c.width = 32; c.height = 48;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 48, 0, 0);
  grad.addColorStop(0,   'rgba(255,255,255,0.9)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(16, 24, 13, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(c);
}

function makeCircleAlphaMask() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.88, 'rgba(255,255,255,1)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(64, 64, 64, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(c);
}

function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.6)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function makeStarSpotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.35)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function makeSoftParticleTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0,    'rgba(255,255,255,0.9)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.6)');
  g.addColorStop(0.5,  'rgba(255,255,255,0.2)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function makeSaturnTexture(colorA, colorB) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, colorA);
  g.addColorStop(0.25, colorB);
  g.addColorStop(0.5, colorA);
  g.addColorStop(0.75, colorB);
  g.addColorStop(1, colorA);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);

  ctx.globalAlpha = 0.15;
  for (let y = 0; y < 256; y += 8) {
    ctx.fillStyle = y % 16 === 0 ? '#ffffff' : '#000000';
    ctx.fillRect(0, y, 256, 4);
  }

  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const a = Math.random() * 0.4;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(x, y, 1, 1);
  }

  ctx.globalAlpha = 1;
  return new THREE.CanvasTexture(c);
}

function makeNebulaTex(r, g, b) {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(S/2, S/2, 0, S/2, S/2, S/2);
  grad.addColorStop(0,    `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.18, `rgba(${r},${g},${b},0.75)`);
  grad.addColorStop(0.45, `rgba(${r},${g},${b},0.28)`);
  grad.addColorStop(0.75, `rgba(${r},${g},${b},0.07)`);
  grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(c);
}

function makeTextSprite(text, primaryHex) {
  const W = 640, H = 120;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const hex = `#${primaryHex.toString(16).padStart(6, '0')}`;
  ctx.clearRect(0, 0, W, H);
  ctx.font = 'italic 58px "Dancing Script", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = hex;
  ctx.shadowBlur = 26;
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText(text, W / 2, H / 2);
  ctx.shadowBlur = 12;
  ctx.fillStyle = 'rgba(255,255,255,0.98)';
  ctx.fillText(text, W / 2, H / 2);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  }));
  sprite.scale.set(12, 12 * (H / W), 1);
  return sprite;
}

// ─── Main hook ───────────────────────────────────────────────────────────────

export function useJardin(containerRef, data, onFlowerClickRef) {
  const replayRef = useRef(false);
  const replayIntro = useCallback(() => { replayRef.current = true; }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !data) return;
    let mounted = true;

    const tema = THEMES[data.tema] || THEMES.rosas;
    const displayFotos = Array.isArray(data.displayFotos) ? data.displayFotos : [];
    const FLOWER_COUNT = Math.max(displayFotos.length, 1);
    const isMobile = container.clientWidth < 640;
    const STAR_FAR_COUNT = isMobile ? 1400 : 2800;
    const STAR_NEAR_COUNT = isMobile ? 420 : 820;
    const SHOOTER_MAX_ACTIVE = isMobile ? 2 : 3;
    const SHOOTER_INTERVAL_MIN = isMobile ? 5500 : 4200;
    const SHOOTER_INTERVAL_MAX = isMobile ? 9500 : 8500;

    // ── RENDERER ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(tema.bg, 1);
    container.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 80, 0.1);
    camera.lookAt(0, 2, 0);

    // ── POST PROCESSING (BLOOM) ───────────────────────────────────────────────
    const renderTarget = new THREE.WebGLRenderTarget(
      container.clientWidth, container.clientHeight,
      { type: THREE.HalfFloatType, format: THREE.RGBAFormat }
    );
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(container.clientWidth, container.clientHeight), 0.5, 0.35, 1.0);
    // threshold = 1.0 asegura que solo los objetos con HDR (color > 1) brillen.
    const composer = new EffectComposer(renderer, renderTarget);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // ── CONTROLS ─────────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = Infinity;
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controls.target.set(0, 2, 0);
    controls.enabled = false;

    // ── GROUND DISC ───────────────────────────────────────────────────────────
    const mirrorGeo = new THREE.CircleGeometry(60, 64);
    const groundMirror = new THREE.Mesh(
      mirrorGeo,
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(tema.primary).multiplyScalar(0.06),
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    groundMirror.rotation.x = -Math.PI / 2;
    scene.add(groundMirror);

    const glowTex = makeGlowTexture();
    {
      const geo = new THREE.PlaneGeometry(120, 120);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(tema.primary).multiplyScalar(1.8),
        map: glowTex,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const groundGlow = new THREE.Mesh(geo, mat);
      groundGlow.rotation.x = -Math.PI / 2;
      groundGlow.position.y = 0.02;
      scene.add(groundGlow);
    }

    // ── AMBIENT GROUND PARTICLES (fireflies) ──────────────────────────────────
    const N_FIREFLIES = 280;
    const fireflyPos = new Float32Array(N_FIREFLIES * 3);
    const fireflyBase = new Float32Array(N_FIREFLIES * 3);
    for (let i = 0; i < N_FIREFLIES; i++) {
      const r = 3 + Math.random() * 45;
      const a = Math.random() * Math.PI * 2;
      const h = Math.random() * 2.5;
      fireflyPos[i * 3]     = Math.cos(a) * r;
      fireflyPos[i * 3 + 1] = h;
      fireflyPos[i * 3 + 2] = Math.sin(a) * r;
      fireflyBase[i * 3]     = Math.cos(a) * r;
      fireflyBase[i * 3 + 1] = h;
      fireflyBase[i * 3 + 2] = Math.sin(a) * r;
    }
    const fireflyGeo = new THREE.BufferGeometry();
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos, 3));
    const firefliesPoints = new THREE.Points(fireflyGeo, new THREE.PointsMaterial({
      color: new THREE.Color(tema.primary).multiplyScalar(2.5),
      size: 0.35,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    scene.add(firefliesPoints);

    const starSpot = makeStarSpotTexture();
    const softParticle = makeSoftParticleTexture();

    // ── BACKGROUND STAR FIELDS (far + near) ────────────────────────────────
    const nearStarPhases = new Float32Array(STAR_NEAR_COUNT);
    const nearStarBase   = new Float32Array(STAR_NEAR_COUNT);
    const nearStarColors = new Float32Array(STAR_NEAR_COUNT * 3);
    const nearStarTintR  = new Float32Array(STAR_NEAR_COUNT);
    const nearStarTintG  = new Float32Array(STAR_NEAR_COUNT);
    const nearStarTintB  = new Float32Array(STAR_NEAR_COUNT);
    let nearStarsGeo = null;
    {
      const farPos = new Float32Array(STAR_FAR_COUNT * 3);
      for (let i = 0; i < STAR_FAR_COUNT; i++) {
        const th  = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r   = 80 + Math.random() * 70;
        farPos[i * 3]     = r * Math.sin(phi) * Math.cos(th);
        farPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(th);
        farPos[i * 3 + 2] = r * Math.cos(phi);
      }
      const farGeo = new THREE.BufferGeometry();
      farGeo.setAttribute('position', new THREE.BufferAttribute(farPos, 3));
      scene.add(new THREE.Points(farGeo, new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.18,
        sizeAttenuation: true,
        map: starSpot,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      })));

      const nearPos = new Float32Array(STAR_NEAR_COUNT * 3);
      for (let i = 0; i < STAR_NEAR_COUNT; i++) {
        const th  = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r   = 45 + Math.random() * 60;
        nearPos[i * 3]     = r * Math.sin(phi) * Math.cos(th);
        nearPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(th);
        nearPos[i * 3 + 2] = r * Math.cos(phi);

        nearStarPhases[i] = Math.random() * Math.PI * 2;
        nearStarBase[i]   = 0.55 + Math.random() * 0.45;
        // 4 tint palettes: warm amber | cool blue | warm white | soft purple
        const roll = Math.random();
        nearStarTintR[i] = roll < 0.30 ? 1.00 : roll < 0.50 ? 0.72 : roll < 0.72 ? 1.00 : 0.88;
        nearStarTintG[i] = roll < 0.30 ? 0.84 : roll < 0.50 ? 0.82 : roll < 0.72 ? 0.93 : 0.74;
        nearStarTintB[i] = roll < 0.30 ? 0.68 : roll < 0.50 ? 1.00 : roll < 0.72 ? 0.75 : 1.00;
        const v = nearStarBase[i];
        nearStarColors[i * 3]     = nearStarTintR[i] * v;
        nearStarColors[i * 3 + 1] = nearStarTintG[i] * v;
        nearStarColors[i * 3 + 2] = nearStarTintB[i] * v;
      }
      nearStarsGeo = new THREE.BufferGeometry();
      nearStarsGeo.setAttribute('position', new THREE.BufferAttribute(nearPos, 3));
      nearStarsGeo.setAttribute('color', new THREE.BufferAttribute(nearStarColors, 3));
      scene.add(new THREE.Points(nearStarsGeo, new THREE.PointsMaterial({
        size: 0.28,
        sizeAttenuation: true,
        map: starSpot,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })));
    }

    // ── GALAXY CORE ──────────────────────────────────────────────────────────
    {
      const pc = new THREE.Color(tema.primary);
      const cR = Math.round(pc.r * 255), cG = Math.round(pc.g * 255), cB = Math.round(pc.b * 255);
      const coreTex   = makeNebulaTex(cR, cG, cB);
      const whiteTex  = makeNebulaTex(245, 235, 215);

      const outerCore = new THREE.Sprite(new THREE.SpriteMaterial({
        map: coreTex, transparent: true, opacity: 0.30,
        depthWrite: false, blending: THREE.AdditiveBlending,
      }));
      outerCore.scale.set(95, 95, 1);
      outerCore.position.set(22, 14, -145);
      scene.add(outerCore);

      const innerCore = new THREE.Sprite(new THREE.SpriteMaterial({
        map: whiteTex, transparent: true, opacity: 0.60,
        depthWrite: false, blending: THREE.AdditiveBlending,
      }));
      innerCore.scale.set(24, 24, 1);
      innerCore.position.set(22, 14, -145);
      scene.add(innerCore);
    }

    // ── NEBULAE (5 large background clouds) ──────────────────────────────────
    {
      const pc = new THREE.Color(tema.primary);
      const cR = Math.round(pc.r * 255), cG = Math.round(pc.g * 255), cB = Math.round(pc.b * 255);
      [
        { pos: [-125,  18, -55],  sz: 115, rgb: [90, 130, 255],  op: 0.07 },
        { pos: [ 115, -12,  85],  sz: 100, rgb: [195, 75, 255],  op: 0.06 },
        { pos: [ -55,  65, 125],  sz:  85, rgb: [255, 175, 55],  op: 0.05 },
        { pos: [  85,  38,-105],  sz: 105, rgb: [cR, cG, cB],    op: 0.10 },
        { pos: [ -28, -28,-135],  sz:  75, rgb: [70, 200, 255],  op: 0.06 },
      ].forEach(({ pos, sz, rgb, op }) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({
          map: makeNebulaTex(rgb[0], rgb[1], rgb[2]),
          transparent: true, opacity: op,
          depthWrite: false, blending: THREE.AdditiveBlending,
        }));
        s.scale.set(sz, sz, 1);
        s.position.set(pos[0], pos[1], pos[2]);
        scene.add(s);
      });
    }

    // ── MILKY WAY BAND ────────────────────────────────────────────────────────
    {
      const MW_COUNT  = isMobile ? 2200 : 4500;
      const MW_R      = 138;
      const MW_BAND_W = 24;
      const MW_BAND_H = 7;
      const TILT_X    = 0.38;
      const TILT_Z    = 0.18;
      const cosX = Math.cos(TILT_X), sinX = Math.sin(TILT_X);
      const cosZ = Math.cos(TILT_Z), sinZ = Math.sin(TILT_Z);

      const mwPos    = new Float32Array(MW_COUNT * 3);
      const mwColors = new Float32Array(MW_COUNT * 3);

      for (let i = 0; i < MW_COUNT; i++) {
        const t  = Math.random() * Math.PI * 2;
        const sR = (Math.random() - 0.5) * MW_BAND_W;
        const sH = (Math.random() - 0.5) * MW_BAND_H * (1 - Math.abs(sR / MW_BAND_W) * 0.5);
        let x = Math.cos(t) * (MW_R + sR);
        let y = sH;
        let z = Math.sin(t) * (MW_R + sR);
        // rotate around X
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        // rotate around Z
        mwPos[i * 3]     = x * cosZ - y2 * sinZ;
        mwPos[i * 3 + 1] = x * sinZ + y2 * cosZ;
        mwPos[i * 3 + 2] = z2;
        // warm near "galactic center" (angle ~0 and π)
        const warm = Math.abs(Math.cos(t));
        const br   = 0.3 + Math.random() * 0.7;
        mwColors[i * 3]     = br * (0.84 + warm * 0.16);
        mwColors[i * 3 + 1] = br * (0.87 + warm * 0.13);
        mwColors[i * 3 + 2] = br * (0.96 + warm * 0.04);
      }

      const mwGeo = new THREE.BufferGeometry();
      mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
      mwGeo.setAttribute('color',    new THREE.BufferAttribute(mwColors, 3));
      scene.add(new THREE.Points(mwGeo, new THREE.PointsMaterial({
        size: isMobile ? 0.20 : 0.16,
        sizeAttenuation: true,
        map: softParticle,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })));
    }

    // ── GIANT STARS ───────────────────────────────────────────────────────────
    const giantStars = [];
    {
      for (let i = 0; i < 12; i++) {
        const th  = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r   = 55 + Math.random() * 48;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
          map: starSpot,
          color: new THREE.Color(2.8, 2.8, 2.8),
          transparent: true,
          opacity: 0.55 + Math.random() * 0.45,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }));
        const bs = 1.4 + Math.random() * 2.4;
        sprite.scale.set(bs, bs, 1);
        sprite.position.set(
          r * Math.sin(phi) * Math.cos(th),
          r * Math.sin(phi) * Math.sin(th),
          r * Math.cos(phi)
        );
        sprite.userData.bs    = bs;
        sprite.userData.phase = Math.random() * Math.PI * 2;
        sprite.userData.speed = 0.4 + Math.random() * 0.9;
        sprite.userData.base  = 0.5 + Math.random() * 0.5;
        scene.add(sprite);
        giantStars.push(sprite);
      }
    }

    // ── SATURN CENTERPIECE ───────────────────────────────────────────────
    const saturnTex = makeSaturnTexture(tema.saturnA, tema.saturnB);
    const saturnBody = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 88, 48),
      new THREE.MeshBasicMaterial({ map: saturnTex })
    );
    saturnBody.position.set(0, 4.4, 0);
    scene.add(saturnBody);

    const saturnHalo = new THREE.Mesh(
      new THREE.SphereGeometry(3.4, 32, 32),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(tema.primary).multiplyScalar(1.5),
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        depthWrite: false,
      })
    );
    saturnHalo.position.copy(saturnBody.position);
    scene.add(saturnHalo);

    const saturnRings = [];
    const RING_TILT = Math.PI * 0.28;
    [
      { inner: 3.0, outer: 4.2, opacity: 0.32 },
      { inner: 4.4, outer: 5.4, opacity: 0.20 },
      { inner: 5.6, outer: 6.4, opacity: 0.12 },
    ].forEach(({ inner, outer, opacity }) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 64),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(tema.primary).multiplyScalar(1.8),
          transparent: true,
          opacity,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      ring.position.copy(saturnBody.position);
      ring.rotation.x = RING_TILT;
      saturnRings.push(ring);
      scene.add(ring);
    });

    // ── TEXTURES ──────────────────────────────────────────────────────────────
    const petalTex   = makePetalTexture(tema.primary);
    const circleMask = makeCircleAlphaMask();

    // ── FLOWER GEOMETRY ───────────────────────────────────────────────────────
    const isGirasoles = data.tema === 'girasoles';
    const isPrimavera = data.tema === 'primavera';
    const PETAL_COUNT  = isGirasoles ? 14 : (isPrimavera ? 8 : 6);
    const PHOTO_RADIUS = 1.25;
    const PETAL_W      = isGirasoles ? 0.5 : 1.05;
    const PETAL_H      = isGirasoles ? 1.4 : 1.85;
    const PETAL_OFFSET = PHOTO_RADIUS + PETAL_H * 0.42;

    const petalGeo = new THREE.PlaneGeometry(PETAL_W, PETAL_H);
    const photoGeo = new THREE.CircleGeometry(PHOTO_RADIUS, 64);

    // ── FLOWERS ───────────────────────────────────────────────────────────────
    const flowers = [];
    const loader  = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    // Spiral scatter pattern for flower positions
    for (let i = 0; i < FLOWER_COUNT; i++) {
      const angle  = (i / FLOWER_COUNT) * Math.PI * 2 + (i % 2) * 0.6;
      const spread = 9 + (i % 4) * 5.0;
      const jitter = (Math.random() - 0.5) * 3.5;
      const x = Math.cos(angle) * spread + Math.sin(angle * 2) * jitter;
      const z = Math.sin(angle) * spread + Math.cos(angle * 2) * jitter;

      const group     = new THREE.Group();
      group.position.set(x, 0, z);

      // Stem
      const stemH   = 1.8 + Math.random() * 0.5;
      const stemGeo = new THREE.CylinderGeometry(0.03, 0.055, stemH, 6);
      const stemMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        transparent: true,
        opacity: 0.72,
      });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = stemH / 2;
      group.add(stem);

      // Flower head (billboarded separately in animate loop)
      const flowerHead = new THREE.Group();
      flowerHead.position.y = stemH + 0.05;

      // Petals
      const petalIntensity = isGirasoles ? 1.25 : 1.8;
      const petalMatBase = new THREE.MeshBasicMaterial({
        color: new THREE.Color(petalIntensity, petalIntensity, petalIntensity),
        map: petalTex,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false,
        // Eliminamos el AdditiveBlending para que al superponerse (ej. 14 pétalos de girasol) no se sume la luz hasta quemar la imagen
      });

      for (let p = 0; p < PETAL_COUNT; p++) {
        const pa    = (p / PETAL_COUNT) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeo, petalMatBase.clone());
        petal.position.set(Math.cos(pa) * PETAL_OFFSET, Math.sin(pa) * PETAL_OFFSET, 0);
        petal.rotation.z = pa + Math.PI / 2;
        petal.userData.pa = pa;
        flowerHead.add(petal);
      }

      // Glow ring behind photo
      const glowIntensity = isGirasoles ? 1.15 : 1.5;
      const glowGeo = new THREE.CircleGeometry(PHOTO_RADIUS * 1.55, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(tema.primary).multiplyScalar(glowIntensity),
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const glowDisc = new THREE.Mesh(glowGeo, glowMat);
      glowDisc.position.z = -0.01;
      flowerHead.add(glowDisc);

      // Photo circle (center)
      const photoMat = new THREE.MeshBasicMaterial({
        map: circleMask,
        transparent: true,
        opacity: 0,
      });
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.userData.index = i;
      flowerHead.add(photoMesh);

      // Load user photo
      if (displayFotos[i] !== undefined) {
        loader.load(displayFotos[i], (tex) => {
          if (!mounted) { tex.dispose(); return; }
          tex.minFilter = tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
          const img = tex.image;
          if (img?.width && img?.height) {
            const R = img.width / img.height;
            if (R > 1.05) { tex.repeat.set(1 / R, 1); tex.offset.set((1 - 1 / R) / 2, 0); }
            else if (R < 0.95) { tex.repeat.set(1, R); tex.offset.set(0, (1 - R) / 2); }
          }
          photoMesh.material.map = tex;
          photoMesh.material.needsUpdate = true;
          photoMesh.userData.loaded = true;
        });
      }

      group.add(flowerHead);
      scene.add(group);
      flowers.push({ group, flowerHead, photoMesh, stemH });
    }

    // ── FALLING PETAL PARTICLES ───────────────────────────────────────────────
    const FALL_COUNT = 380;
    const fallBuf    = new Float32Array(FALL_COUNT * 3);
    const fallSpeeds = new Float32Array(FALL_COUNT);
    const fallDrift  = new Float32Array(FALL_COUNT);
    const fallPhases = new Float32Array(FALL_COUNT);

    for (let i = 0; i < FALL_COUNT; i++) {
      const r = 4 + Math.random() * 42;
      const a = Math.random() * Math.PI * 2;
      fallBuf[i * 3]     = Math.cos(a) * r;
      fallBuf[i * 3 + 1] = Math.random() * 28;
      fallBuf[i * 3 + 2] = Math.sin(a) * r;
      fallSpeeds[i] = 0.008 + Math.random() * 0.022;
      fallDrift[i]  = (Math.random() - 0.5) * 0.004;
      fallPhases[i] = Math.random() * Math.PI * 2;
    }

    const fallGeo = new THREE.BufferGeometry();
    fallGeo.setAttribute('position', new THREE.BufferAttribute(fallBuf, 3));
    const fallTex = makeFallingPetalTexture();
    const fallPoints = new THREE.Points(fallGeo, new THREE.PointsMaterial({
      color: new THREE.Color(tema.particle).multiplyScalar(2.5),
      size: 0.32,
      sizeAttenuation: true,
      map: fallTex,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    scene.add(fallPoints);

    // ── SHOOTING STARS + PHRASES ─────────────────────────────────────────
    const SHOOTER_LIFE_MIN = 1.1;
    const SHOOTER_LIFE_MAX = 1.9;
    const SHOOTER_SPEED_MIN = isMobile ? 8 : 12;
    const SHOOTER_SPEED_MAX = isMobile ? 14 : 18;
    const SHOOTER_TAIL_MIN = 4.5;
    const SHOOTER_TAIL_MAX = 7.5;
    const rand = (min, max) => min + Math.random() * (max - min);
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    let phrasePool = shuffle(PHRASES.slice());
    let phraseIndex = 0;
    const nextPhrase = () => {
      if (phraseIndex >= phrasePool.length) {
        phrasePool = shuffle(PHRASES.slice());
        phraseIndex = 0;
      }
      return phrasePool[phraseIndex++];
    };

    const shootingStars = [];
    const shooterTemp = new THREE.Vector3();
    const shooterTemp2 = new THREE.Vector3();
    const shooterTextOffset = new THREE.Vector3(0, 0.6, 0);

    for (let i = 0; i < SHOOTER_MAX_ACTIVE; i++) {
      const head = new THREE.Sprite(new THREE.SpriteMaterial({
        map: starSpot,
        color: new THREE.Color(2.5, 2.5, 2.5),
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }));
      head.scale.set(0.8, 0.8, 1);
      head.visible = false;
      scene.add(head);

      const tailPos = new Float32Array(6);
      const tailGeo = new THREE.BufferGeometry();
      tailGeo.setAttribute('position', new THREE.BufferAttribute(tailPos, 3));
      const tail = new THREE.Line(tailGeo, new THREE.LineBasicMaterial({
        color: new THREE.Color(tema.primary).multiplyScalar(2.5),
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }));
      tail.visible = false;
      scene.add(tail);

      shootingStars.push({
        active: false,
        head,
        tail,
        tailPos,
        text: null,
        position: new THREE.Vector3(),
        direction: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        age: 0,
        life: 0,
        tailLen: 0,
      });
    }

    let nextShooterAt = performance.now() + rand(SHOOTER_INTERVAL_MIN, SHOOTER_INTERVAL_MAX);

    const spawnShooter = (star) => {
      star.active = true;
      star.age = 0;
      star.life = rand(SHOOTER_LIFE_MIN, SHOOTER_LIFE_MAX);
      star.tailLen = rand(SHOOTER_TAIL_MIN, SHOOTER_TAIL_MAX);

      const radius = rand(15, 35);
      const angle = Math.random() * Math.PI * 2;
      const height = rand(12, 22);
      star.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);

      const dirAngle = angle + Math.PI * (0.55 + Math.random() * 0.6);
      star.direction.set(
        Math.cos(dirAngle),
        -0.55 - Math.random() * 0.35,
        Math.sin(dirAngle)
      ).normalize();
      const speed = rand(SHOOTER_SPEED_MIN, SHOOTER_SPEED_MAX);
      star.velocity.copy(star.direction).multiplyScalar(speed);

      star.head.position.copy(star.position);
      star.head.material.opacity = 0.9;
      star.head.visible = true;
      star.tail.visible = true;

      if (star.text) {
        star.text.material.map?.dispose();
        star.text.material.dispose();
        scene.remove(star.text);
      }
      const phrase = nextPhrase();
      const sprite = makeTextSprite(phrase, tema.primary);
      sprite.material.color = new THREE.Color(2.5, 2.5, 2.5);
      sprite.material.opacity = 0;
      star.text = sprite;
      scene.add(sprite);
    };

    const introCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,   80, 0.1),
      new THREE.Vector3(28,  45, 22),
      new THREE.Vector3(-18, 22, -16),
      new THREE.Vector3(12,  12, 18),
      new THREE.Vector3(-6,   7, 14),
      new THREE.Vector3(0,   40, isMobile ? 68 : 64),
    ], false, 'centripetal');

    // ── AUDIO ─────────────────────────────────────────────────────────────────
    let audio = null, fadeTimer = null;
    if (data.musica) {
      audio = new Audio(data.musica);
      audio.preload = 'none';
      audio.loop   = true;
      audio.volume = 0;
      audio.play().catch(() => {});
      let vol = 0;
      fadeTimer = setInterval(() => {
        vol = Math.min(vol + 0.016, 0.78);
        if (audio) audio.volume = vol;
        if (vol >= 0.78) clearInterval(fadeTimer);
      }, 60);
    }

    // ── STATE ─────────────────────────────────────────────────────────────────
    let phase = 'intro', introT = 0;

    // ── RAYCASTER ────────────────────────────────────────────────────────────
    const raycaster    = new THREE.Raycaster();
    const pointer      = new THREE.Vector2();
    let   hoveredIdx   = -1;
    const photoMeshes  = flowers.map(f => f.photoMesh);
    let pointerDownPos = { x: 0, y: 0 };

    const updatePointer = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const cx = e.changedTouches ? e.changedTouches[0].clientX : (e.touches ? e.touches[0].clientX : e.clientX);
      const cy = e.changedTouches ? e.changedTouches[0].clientY : (e.touches ? e.touches[0].clientY : e.clientY);
      pointer.x =  ((cx - rect.left) / rect.width)  * 2 - 1;
      pointer.y = -((cy - rect.top)  / rect.height) * 2 + 1;
      return { cx, cy };
    };

    const handlePointerDown = (e) => {
      if (phase !== 'explore') return;
      const { cx, cy } = updatePointer(e);
      pointerDownPos = { x: cx, y: cy };
    };

    const handlePointerUp = (e) => {
      if (phase !== 'explore') return;
      const { cx, cy } = updatePointer(e);
      const dist = Math.hypot(cx - pointerDownPos.x, cy - pointerDownPos.y);
      // Solo consideramos "click" si el dedo no se movió más de 10px (evita clics accidentales al hacer zoom/drag)
      if (dist < 10) {
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(photoMeshes);
        if (hits.length > 0) {
          playChime();
          onFlowerClickRef.current?.(hits[0].object.userData.index);
        }
      }
    };

    const handlePointerMove = (e) => {
      if (phase !== 'explore') { hoveredIdx = -1; return; }
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(photoMeshes);
      const newHover = hits.length > 0 ? hits[0].object.userData.index : -1;
      if (newHover !== hoveredIdx) {
        hoveredIdx = newHover;
        renderer.domElement.style.cursor = newHover >= 0 ? 'pointer' : 'default';
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // ── RESIZE ────────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── ANIMATION LOOP ────────────────────────────────────────────────────────
    const INTRO_MS = 9000;
    let lastTime = performance.now(), raf;

    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      const dt   = Math.min(now - lastTime, 50);
      lastTime   = now;
      const time = now / 1000;
      const dtSec = dt / 1000;

      // Replay trigger
      if (replayRef.current) {
        replayRef.current = false;
        phase  = 'intro';
        introT = 0;
        controls.enabled = false;
        camera.position.set(0, 80, 0.1);
        camera.lookAt(0, 2, 0);
      }

      // ── GIANT STAR PULSE ──────────────────────────────────────────────────
      for (let i = 0; i < giantStars.length; i++) {
        const gs    = giantStars[i];
        const pulse = 0.78 + 0.22 * Math.sin(time * gs.userData.speed + gs.userData.phase);
        gs.material.opacity = gs.userData.base * pulse;
        const s = gs.userData.bs * (0.94 + 0.06 * pulse);
        gs.scale.set(s, s, 1);
      }

      // ── SATURN MOTION ──────────────────────────────────────────────────
      saturnBody.rotation.y += dtSec * 0.18;
      const ringWobble = Math.sin(time * 0.35) * 0.05;
      for (let i = 0; i < saturnRings.length; i++) {
        saturnRings[i].rotation.x = RING_TILT + ringWobble * (1 + i * 0.15);
        saturnRings[i].rotation.z = ringWobble * 0.45;
      }

      // ── STAR TWINKLE ──────────────────────────────────────────────────
      if (nearStarsGeo) {
        for (let i = 0; i < STAR_NEAR_COUNT; i++) {
          const t  = 0.6 + 0.4 * Math.sin(time * 1.2 + nearStarPhases[i]);
          const v  = nearStarBase[i] * t;
          const ii = i * 3;
          nearStarColors[ii]     = nearStarTintR[i] * v;
          nearStarColors[ii + 1] = nearStarTintG[i] * v;
          nearStarColors[ii + 2] = nearStarTintB[i] * v;
        }
        nearStarsGeo.attributes.color.needsUpdate = true;
      }

      // ── INTRO ──────────────────────────────────────────────────────────────
      if (phase === 'intro') {
        introT = Math.min(introT + dt / INTRO_MS, 1);
        const pt = introCurve.getPoint(easeInOutCubic(introT));
        camera.position.copy(pt);
        camera.lookAt(0, 2, 0);
        if (introT >= 1) {
          phase = 'explore';
          controls.target.set(0, 2, 0);
          controls.enabled = true;
        }
      }

      if (phase === 'explore') controls.update();

      // ── FIREFLIES INTERACTION ──────────────────────────────────────────────
      // They sway slightly and move away if raycaster hits ground
      raycaster.setFromCamera(pointer, camera);
      const groundHit = raycaster.intersectObject(groundMirror)[0]?.point;
      
      for (let i = 0; i < N_FIREFLIES; i++) {
        let fx = fireflyBase[i * 3];
        let fy = fireflyBase[i * 3 + 1];
        let fz = fireflyBase[i * 3 + 2];
        
        // Base hover
        fy += Math.sin(time * 2 + i) * 0.8;
        fx += Math.cos(time * 1.5 + i) * 0.5;
        fz += Math.sin(time * 1.2 + i) * 0.5;

        // Interactive repel
        if (groundHit) {
          const dx = fx - groundHit.x;
          const dz = fz - groundHit.z;
          const dist = Math.sqrt(dx*dx + dz*dz);
          if (dist < 5) {
            const repel = (5 - dist) * 0.5;
            fx += (dx / dist) * repel;
            fz += (dz / dist) * repel;
          }
        }
        
        fireflyPos[i * 3] = fx;
        fireflyPos[i * 3 + 1] = fy;
        fireflyPos[i * 3 + 2] = fz;
      }
      firefliesPoints.geometry.attributes.position.needsUpdate = true;

      // ── FLOWERS ────────────────────────────────────────────────────────────
      for (let i = 0; i < flowers.length; i++) {
        const { flowerHead, photoMesh } = flowers[i];

        // Billboard: face the camera (XZ + Y)
        flowerHead.lookAt(camera.position);

        // Petal flutter animation
        for (let p = 0; p < PETAL_COUNT; p++) {
          const child = flowerHead.children[p];
          if (!child || !child.userData.pa) continue;
          const flutter = Math.sin(time * 1.6 + p * 1.05 + i * 0.9) * 0.06;
          // After lookAt the local Z faces camera; scale petal slightly
          child.scale.y = 1 + flutter * 0.15;
          child.position.set(
            Math.cos(child.userData.pa) * (PETAL_OFFSET + flutter * 0.12),
            Math.sin(child.userData.pa) * (PETAL_OFFSET + flutter * 0.12),
            0
          );
        }

        // Gentle bob and Wind sway
        const wind = Math.sin(time * 0.8 + i) * 0.08;
        flowers[i].group.rotation.z = wind;
        flowers[i].group.rotation.x = wind * 0.5;
        flowerHead.position.y = flowers[i].stemH + 0.05 + Math.sin(time * 0.55 + i * 1.4) * 0.06;

        // Hover scale
        const isHover    = i === hoveredIdx;
        const targetScale = isHover ? 1.14 : 1.0;
        const cur  = flowerHead.scale.x;
        const next = cur + (targetScale - cur) * 0.12;
        flowerHead.scale.setScalar(next);

        // Fade in photo after load
        if (photoMesh.userData.loaded && photoMesh.material.opacity < 1) {
          photoMesh.material.opacity = Math.min(photoMesh.material.opacity + 0.015, 1);
        }
      }

      // ── FALLING PETALS ─────────────────────────────────────────────────────
      for (let i = 0; i < FALL_COUNT; i++) {
        fallBuf[i * 3 + 1] -= fallSpeeds[i];
        fallBuf[i * 3]     += Math.sin(time * 0.35 + fallPhases[i]) * 0.004 + fallDrift[i];
        if (fallBuf[i * 3 + 1] < -1) {
          fallBuf[i * 3 + 1] = 24 + Math.random() * 10;
          const r = 4 + Math.random() * 42;
          const a = Math.random() * Math.PI * 2;
          fallBuf[i * 3]     = Math.cos(a) * r;
          fallBuf[i * 3 + 2] = Math.sin(a) * r;
          fallDrift[i]  = (Math.random() - 0.5) * 0.004;
          fallPhases[i] = Math.random() * Math.PI * 2;
        }
      }
      fallGeo.attributes.position.needsUpdate = true;

      // ── SHOOTING STARS ────────────────────────────────────────────────
      if (now >= nextShooterAt) {
        const star = shootingStars.find(s => !s.active);
        if (star) spawnShooter(star);
        nextShooterAt = now + rand(SHOOTER_INTERVAL_MIN, SHOOTER_INTERVAL_MAX);
      }

      for (let i = 0; i < shootingStars.length; i++) {
        const star = shootingStars[i];
        if (!star.active) continue;
        star.age += dtSec;
        star.position.addScaledVector(star.velocity, dtSec);

        const lifeT = star.age / star.life;
        const fade = lifeT < 0.7 ? 1 : Math.max(1 - (lifeT - 0.7) / 0.3, 0);

        star.head.position.copy(star.position);
        star.head.material.opacity = 0.9 * fade;

        shooterTemp.copy(star.direction).multiplyScalar(-star.tailLen).add(star.position);
        const p = star.tailPos;
        p[0] = star.position.x; p[1] = star.position.y; p[2] = star.position.z;
        p[3] = shooterTemp.x;   p[4] = shooterTemp.y;   p[5] = shooterTemp.z;
        star.tail.geometry.attributes.position.needsUpdate = true;
        star.tail.material.opacity = 0.55 * fade;

        if (star.text) {
          shooterTemp2.copy(star.position)
            .addScaledVector(star.direction, -star.tailLen * 0.35)
            .add(shooterTextOffset);
          star.text.position.copy(shooterTemp2);
          star.text.material.opacity = 0.7 * fade;
        }

        if (lifeT >= 1 || star.position.y < 2) {
          star.active = false;
          star.head.visible = false;
          star.tail.visible = false;
          if (star.text) star.text.visible = false;
        }
      }

      composer.render();
    };

    raf = requestAnimationFrame(animate);

    // ── EXPORT METHODS ────────────────────────────────────────────────────────
    containerRef.current.renderFrame = () => {
      composer.render();
    };

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      if (fadeTimer) clearInterval(fadeTimer);
      if (audio)    { audio.pause(); audio.src = ''; }
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      petalTex.dispose();
      circleMask.dispose();
      fallTex.dispose();
      glowTex.dispose();
      scene.traverse((obj) => {
        obj.geometry?.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => { m.map?.dispose(); m.dispose(); });
          else { obj.material.map?.dispose(); obj.material.dispose(); }
        }
      });
      composer.dispose();
      renderer.dispose();
    };
  }, [containerRef, data, onFlowerClickRef]);

  return { replayIntro };
}
