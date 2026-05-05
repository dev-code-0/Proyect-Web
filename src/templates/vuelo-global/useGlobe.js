import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Equirectangular lat/lng → Vector3 on sphere of given radius
export function latLngToVector3(lat, lng, radius = 2.5) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Inline TopoJSON arc decoder — no external dependency needed
function decodeBorders(topo) {
  const { arcs, transform, objects } = topo;
  const { scale, translate } = transform;

  const decoded = arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });

  const arcUse = new Array(arcs.length).fill(0);
  objects.countries.geometries.forEach(geom => {
    const rings = geom.type === 'Polygon' ? geom.arcs : geom.arcs.flat(1);
    rings.forEach(ring => ring.forEach(idx => {
      arcUse[idx < 0 ? ~idx : idx]++;
    }));
  });

  return decoded.filter((_, i) => arcUse[i] > 1);
}

function buildBorderMesh(borderArcs) {
  const positions = [];
  borderArcs.forEach(arcCoords => {
    const pts = arcCoords.map(([lng, lat]) => latLngToVector3(lat, lng, 2.52));
    for (let i = 0; i < pts.length - 1; i++) {
      positions.push(pts[i], pts[i + 1]);
    }
  });
  const geo = new THREE.BufferGeometry().setFromPoints(positions);
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });
  return new THREE.LineSegments(geo, mat);
}

export function useGlobe({ containerRef, interactive = false, onFrameRef }) {
  const sceneRef     = useRef(null);
  const cameraRef    = useRef(null);
  const rendererRef  = useRef(null);
  const globeRef     = useRef(null);
  const controlsRef  = useRef(null);
  const groupRef     = useRef(null); // globeGroup for continuous rotation

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene ────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ── Camera ───────────────────────────────────────────
    const w = container.clientWidth  || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0, 7);
    cameraRef.current = camera;

    // ── Renderer ─────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000008);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Lights ───────────────────────────────────────────
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x223366, 1.2));

    // ── Globe group (holds globe + borders, rotates together) ──
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    groupRef.current = globeGroup;

    // ── Globe mesh ───────────────────────────────────────
    const loader = new THREE.TextureLoader();
    const globeGeo = new THREE.SphereGeometry(2.5, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      map:         loader.load('/images/vuelo-global/earth_daymap.jpg'),
      bumpMap:     loader.load('/images/vuelo-global/earth_bumpmap.jpg'),
      bumpScale:   0.05,
      specularMap: loader.load('/images/vuelo-global/earth_specularmap.jpg'),
      specular:    new THREE.Color('#4488ff'),
      shininess:   15,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    // Align equirectangular texture so prime meridian matches lat/lng coords
    globe.rotation.y = Math.PI;
    globeGroup.add(globe);
    globeRef.current = globe;

    // ── Atmosphere (Fresnel glow) ─────────────────────────
    const atmGeo = new THREE.SphereGeometry(2.57, 64, 64);
    const atmMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color('#3366cc') } },
      vertexShader: `
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          gl_FragColor = vec4(glowColor, clamp(intensity, 0.0, 1.0) * 0.75);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(atmGeo, atmMat));

    // ── Starfield ────────────────────────────────────────
    const starPos = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 80 + Math.random() * 20;
      starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 })));

    // ── OrbitControls (preview only) ─────────────────────
    if (interactive) {
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping  = true;
      controls.dampingFactor  = 0.05;
      controls.minDistance    = 3.5;
      controls.maxDistance    = 12;
      controls.autoRotate     = false;
      controlsRef.current = controls;
    }

    // ── Country borders (async, non-blocking) ────────────
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(topo => {
        if (!sceneRef.current) return; // unmounted
        const borderArcs = decodeBorders(topo);
        const borderMesh = buildBorderMesh(borderArcs);
        // Add as child of globe mesh → inherits globe.rotation.y = Math.PI offset
        globe.add(borderMesh);
      })
      .catch(() => { /* borders optional, fail silently */ });

    // ── Animation loop ────────────────────────────────────
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.0005;
      if (controlsRef.current) controlsRef.current.update();
      // Flight-path hook injects per-frame logic here
      if (onFrameRef && onFrameRef.current) onFrameRef.current();
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ───────────────────────────────────────────
    const handleResize = () => {
      const nw = container.clientWidth  || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (controlsRef.current) { controlsRef.current.dispose(); controlsRef.current = null; }
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      sceneRef.current    = null;
      cameraRef.current   = null;
      rendererRef.current = null;
      globeRef.current    = null;
      groupRef.current    = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { sceneRef, cameraRef, rendererRef, globeRef, groupRef, controlsRef };
}
