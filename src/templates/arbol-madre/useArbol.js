import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ─── Theme palettes ──────────────────────────────────────────────────────────
const THEMES = {
  cerezo: { bg: 0x0a0005, trunk: 0x8b4513, leaf: 0xff6b9d, particle: 0xffb3d1, ambient: 0x3a0a20 },
  roble:  { bg: 0x030a00, trunk: 0x5c4a1e, leaf: 0x4ade80, particle: 0x86efac, ambient: 0x052010 },
  otono:  { bg: 0x0a0500, trunk: 0x8b4513, leaf: 0xf97316, particle: 0xfed7aa, ambient: 0x3a1200 },
  noche:  { bg: 0x000510, trunk: 0x374151, leaf: 0x818cf8, particle: 0xc7d2fe, ambient: 0x0a0a30 },
};

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpN(a, b, t) { return a + (b - a) * t; }

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Generate procedural tree branches ───────────────────────────────────────
// Returns array of { start, end, radius } branch descriptors and tip positions
function generateTree() {
  const branches = [];
  const tipPositions = []; // { position: Vector3 }

  function branch(start, dir, len, radius, depth) {
    if (depth === 0 || len < 0.3) return;

    const end = start.clone().addScaledVector(dir, len);
    branches.push({ start: start.clone(), end: end.clone(), radius });

    if (depth === 1) {
      tipPositions.push({ position: end.clone() });
      return;
    }

    const numChildren = depth > 2 ? 3 : 2;
    for (let i = 0; i < numChildren; i++) {
      const angle = (i / numChildren) * Math.PI * 2 + Math.random() * 0.5;
      const tilt  = 0.38 + Math.random() * 0.28;
      const newDir = new THREE.Vector3(
        dir.x + Math.sin(angle) * tilt,
        dir.y - 0.08 + Math.random() * 0.15,
        dir.z + Math.cos(angle) * tilt,
      ).normalize();
      branch(end, newDir, len * (0.64 + Math.random() * 0.1), radius * 0.62, depth - 1);
    }
  }

  // Trunk
  const trunkStart = new THREE.Vector3(0, 0, 0);
  const trunkDir   = new THREE.Vector3(0, 1, 0);
  branch(trunkStart, trunkDir, 4.5, 0.38, 4);

  return { branches, tipPositions };
}

// ─── Build branch mesh from descriptors ──────────────────────────────────────
function buildBranchMesh(branches, color) {
  const group = new THREE.Group();
  const mat   = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.0 });

  branches.forEach(({ start, end, radius }) => {
    const dir    = end.clone().sub(start);
    const len    = dir.length();
    const geo    = new THREE.CylinderGeometry(radius * 0.5, radius, len, 7, 1);
    const mesh   = new THREE.Mesh(geo, mat);
    const mid    = start.clone().lerp(end, 0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    group.add(mesh);
  });

  return group;
}

// ─── Particle texture (soft circle) ──────────────────────────────────────────
function makeParticleTexture() {
  const c   = document.createElement('canvas');
  c.width   = c.height = 64;
  const ctx = c.getContext('2d');
  const g   = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.7)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

// ─── Canvas placeholder photo ─────────────────────────────────────────────────
function makePlaceholderTexture(index, leafColor) {
  const size = 256;
  const c    = document.createElement('canvas');
  c.width    = c.height = size;
  const ctx  = c.getContext('2d');

  const hsl  = new THREE.Color(leafColor);
  const hex  = '#' + hsl.getHexString();

  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0,   hex + 'cc');
  g.addColorStop(1,   '#00000088');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(128, 128, 128, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font      = 'bold 64px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(index + 1), 128, 128);

  return new THREE.CanvasTexture(c);
}

// ─── Main hook ────────────────────────────────────────────────────────────────
export function useArbol(containerRef, data, onLeafClickRef) {
  const replayRef   = useRef(false);
  const replayIntro = useCallback(() => { replayRef.current = true; }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !data) return;
    let mounted = true;

    const tema    = THEMES[data.tema] || THEMES.cerezo;
    const fotos   = Array.isArray(data.displayFotos) ? data.displayFotos : [];

    // ── RENDERER ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(tema.bg, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    // Warm atmospheric fog
    scene.fog = new THREE.FogExp2(tema.bg, 0.022);

    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 300);
    camera.position.set(0, 1.5, 1); // start very close to ground

    // ── LIGHTS ────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(tema.ambient, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.2);
    sunLight.position.set(12, 20, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far  = 80;
    sunLight.shadow.camera.left = sunLight.shadow.camera.bottom = -30;
    sunLight.shadow.camera.right = sunLight.shadow.camera.top   = 30;
    scene.add(sunLight);

    const fillLight = new THREE.PointLight(tema.leaf, 1.2, 30);
    fillLight.position.set(-6, 8, 4);
    scene.add(fillLight);

    // ── GROUND PLANE ──────────────────────────────────────────────────────
    const groundGeo  = new THREE.CircleGeometry(28, 48);
    const groundMat  = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tema.trunk).multiplyScalar(0.35),
      roughness: 1.0, metalness: 0.0,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grass ring particles
    {
      const N   = 800;
      const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * 22;
        pos[i*3]   = Math.cos(a) * r;
        pos[i*3+1] = Math.random() * 0.4;
        pos[i*3+2] = Math.sin(a) * r;
      }
      const geo  = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color: tema.leaf, size: 0.08, sizeAttenuation: true,
        transparent: true, opacity: 0.4, depthWrite: false,
      })));
    }

    // ── TREE ─────────────────────────────────────────────────────────────
    const { branches, tipPositions } = generateTree();
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    // Branch mesh (starts at scale 0, grows to 1)
    const branchMesh = buildBranchMesh(branches, tema.trunk);
    branchMesh.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    treeGroup.add(branchMesh);

    // ── LEAF CIRCLES (photos) ─────────────────────────────────────────────
    const leafMeshes  = [];
    const leafUserData = []; // { position, baseY, phase }
    const loader       = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    const LEAF_R = 0.72;
    const leafGeoBase = new THREE.CircleGeometry(LEAF_R, 32);

    const actualLeafSlots = fotos.length > 0
      ? tipPositions.length
      : Math.min(8, tipPositions.length);
    const seed  = hashString(`${fotos.join('|')}|${data.tema || 'cerezo'}`);
    const rand  = mulberry32(seed);
    const order = shuffle([...Array(tipPositions.length).keys()], rand);

    for (let i = 0; i < Math.min(tipPositions.length, actualLeafSlots); i++) {
      const { position } = tipPositions[order[i]];

      // Placeholder while texture loads
      const placeholderTex = makePlaceholderTexture(i % 8, tema.leaf);
      const mat  = new THREE.MeshBasicMaterial({
        map: placeholderTex, transparent: true, opacity: 0.0,
        side: THREE.DoubleSide, depthWrite: false,
      });
      const mesh = new THREE.Mesh(leafGeoBase, mat);
      mesh.position.copy(position);
      mesh.userData.index     = i;
      mesh.userData.basePos   = position.clone();
      mesh.userData.phase     = (i / tipPositions.length) * Math.PI * 2;
      mesh.userData.loaded    = true; // placeholder is loaded
      treeGroup.add(mesh);
      leafMeshes.push(mesh);

      // Load real photo if available
      const fotoSrc = fotos[i % fotos.length];
      if (fotoSrc) {
        loader.load(fotoSrc, (tex) => {
          if (!mounted) { tex.dispose(); return; }
          tex.minFilter = tex.magFilter = THREE.LinearFilter;
          const img = tex.image;
          if (img?.width && img?.height) {
            const R = img.width / img.height;
            if (R > 1.05)      { tex.repeat.set(1/R, 1); tex.offset.set((1-1/R)/2, 0); }
            else if (R < 0.95) { tex.repeat.set(1, R);   tex.offset.set(0, (1-R)/2); }
          }
          mesh.material.map = tex;
          mesh.material.needsUpdate = true;
        });
      }
    }

    // ── FLOATING PARTICLES ────────────────────────────────────────────────
    const PART_COUNT  = 320;
    const partTex     = makeParticleTexture();
    const partPos     = new Float32Array(PART_COUNT * 3);
    const partVel     = new Float32Array(PART_COUNT * 3); // x drift, y rise, z drift
    for (let i = 0; i < PART_COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 7;
      partPos[i*3]   = Math.cos(a) * r;
      partPos[i*3+1] = Math.random() * 12;
      partPos[i*3+2] = Math.sin(a) * r;
      partVel[i*3]   = (Math.random() - 0.5) * 0.008;
      partVel[i*3+1] = 0.012 + Math.random() * 0.018;
      partVel[i*3+2] = (Math.random() - 0.5) * 0.008;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMesh = new THREE.Points(partGeo, new THREE.PointsMaterial({
      color: tema.particle, size: 0.18, sizeAttenuation: true,
      map: partTex, transparent: true, opacity: 0.75,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    scene.add(partMesh);

    // ── ORBIT CONTROLS ────────────────────────────────────────────────────
    const controls         = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance   = 4;
    controls.maxDistance   = 36;
    controls.maxPolarAngle = Math.PI * 0.82;
    controls.target.set(0, 4, 0);
    controls.enabled       = false;

    // ── CAMERA INTRO CURVE ────────────────────────────────────────────────
    // Starts ground-level near trunk, sweeps up and back to see full tree
    const introCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,   1.5,  1   ),
      new THREE.Vector3(3,   2,    3   ),
      new THREE.Vector3(8,   5,    10  ),
      new THREE.Vector3(12,  9,    14  ),
      new THREE.Vector3(10,  12,   16  ),
      new THREE.Vector3(0,   14,   18  ),
    ], false, 'centripetal');

    // ── AUDIO ─────────────────────────────────────────────────────────────
    let audio = null, fadeTimer = null;
    if (data.musica) {
      audio = new Audio(data.musica);
      audio.loop   = true;
      audio.volume = 0;
      audio.play().catch(() => {});
      let vol = 0;
      fadeTimer = setInterval(() => {
        vol = Math.min(vol + 0.014, 0.72);
        if (audio) audio.volume = vol;
        if (vol >= 0.72) clearInterval(fadeTimer);
      }, 60);
    }

    // ── RAYCASTER ─────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();
    let hoveredIdx  = -1;

    const updatePointer = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const cx   = e.touches ? e.touches[0].clientX : e.clientX;
      const cy   = e.touches ? e.touches[0].clientY : e.clientY;
      pointer.x  = ((cx - rect.left) / rect.width)  * 2 - 1;
      pointer.y  = -((cy - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e) => {
      if (phase !== 'explore') return;
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(leafMeshes);
      if (hits.length > 0) onLeafClickRef.current?.(hits[0].object.userData.index);
    };

    const handlePointerMove = (e) => {
      if (phase !== 'explore') { hoveredIdx = -1; return; }
      updatePointer(e);
      raycaster.setFromCamera(pointer, camera);
      const hits    = raycaster.intersectObjects(leafMeshes);
      const newHov  = hits.length > 0 ? hits[0].object.userData.index : -1;
      if (newHov !== hoveredIdx) {
        hoveredIdx = newHov;
        renderer.domElement.style.cursor = newHov >= 0 ? 'pointer' : 'default';
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // ── RESIZE ────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── STATE ─────────────────────────────────────────────────────────────
    let phase  = 'grow';   // grow → intro → explore
    let growT  = 0;
    let introT = 0;
    const GROW_MS  = 4000;
    const INTRO_MS = 6000;
    let lastTime   = performance.now();
    let raf;

    const resetIntro = () => {
      phase  = 'grow';
      growT  = 0;
      introT = 0;
      treeGroup.scale.setScalar(0.001);
      camera.position.set(0, 1.5, 1);
      controls.enabled = false;
    };
    resetIntro();

    // ── ANIMATION LOOP ────────────────────────────────────────────────────
    const animate = (now) => {
      raf = requestAnimationFrame(animate);
      const dt   = Math.min(now - lastTime, 50);
      lastTime   = now;
      const time = now / 1000;

      if (replayRef.current) {
        replayRef.current = false;
        resetIntro();
      }

      // ── GROW PHASE ────────────────────────────────────────────────────
      if (phase === 'grow') {
        growT = Math.min(growT + dt / GROW_MS, 1);
        const s = easeInOutCubic(growT);
        treeGroup.scale.setScalar(Math.max(s, 0.001));
        camera.position.set(
          lerpN(0, 6, s),
          lerpN(1.5, 5, s),
          lerpN(1, 8, s),
        );
        camera.lookAt(0, 3 * s, 0);

        // Fade-in leaves as tree grows
        leafMeshes.forEach(m => {
          m.material.opacity = Math.min(m.material.opacity + 0.008, s * 0.9 + 0.1);
        });

        if (growT >= 1) { phase = 'intro'; introT = 0; }
      }

      // ── INTRO PHASE ───────────────────────────────────────────────────
      if (phase === 'intro') {
        introT = Math.min(introT + dt / INTRO_MS, 1);
        const pt = introCurve.getPoint(easeInOutCubic(introT));
        camera.position.copy(pt);
        camera.lookAt(0, 5, 0);
        if (introT >= 1) {
          phase = 'explore';
          controls.target.set(0, 5, 0);
          controls.enabled = true;
        }
      }

      // ── EXPLORE PHASE ─────────────────────────────────────────────────
      if (phase === 'explore') controls.update();

      // ── PARTICLES ─────────────────────────────────────────────────────
      for (let i = 0; i < PART_COUNT; i++) {
        partPos[i*3]   += partVel[i*3];
        partPos[i*3+1] += partVel[i*3+1];
        partPos[i*3+2] += partVel[i*3+2];
        // Reset when particle drifts too high or too far
        if (partPos[i*3+1] > 14 || Math.abs(partPos[i*3]) > 9 || Math.abs(partPos[i*3+2]) > 9) {
          const a = Math.random() * Math.PI * 2;
          const r = 1 + Math.random() * 5;
          partPos[i*3]   = Math.cos(a) * r;
          partPos[i*3+1] = 0.5 + Math.random() * 2;
          partPos[i*3+2] = Math.sin(a) * r;
        }
      }
      partGeo.attributes.position.needsUpdate = true;

      // ── LEAF FLOAT & HOVER ────────────────────────────────────────────
      leafMeshes.forEach((mesh, i) => {
        const bp   = mesh.userData.basePos;
        const ph   = mesh.userData.phase;
        mesh.position.set(
          bp.x + Math.sin(time * 0.5 + ph) * 0.12,
          bp.y + Math.sin(time * 0.4 + ph + 1) * 0.08,
          bp.z + Math.cos(time * 0.45 + ph) * 0.10,
        );
        mesh.lookAt(camera.position);

        const isHover     = i === hoveredIdx;
        const targetScale = isHover ? 1.22 : 1.0;
        const cur         = mesh.scale.x;
        mesh.scale.setScalar(cur + (targetScale - cur) * 0.15);
      });

      // Slow tree sway
      treeGroup.rotation.z = Math.sin(time * 0.18) * 0.012;

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    // ── CLEANUP ───────────────────────────────────────────────────────────
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      if (fadeTimer) clearInterval(fadeTimer);
      if (audio) { audio.pause(); audio.src = ''; }
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        obj.geometry?.dispose();
        if (obj.material) { obj.material.map?.dispose(); obj.material.dispose(); }
      });
      partTex.dispose();
      renderer.dispose();
    };
  }, [containerRef, data]);

  return { replayIntro };
}
