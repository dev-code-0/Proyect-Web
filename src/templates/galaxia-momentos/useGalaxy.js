import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ─── Theme palettes ──────────────────────────────────────────────────────────
const THEMES = {
  cosmos:    { primary: 0x4facfe, particle: 0xa8edea, ring: 0x4facfe, saturnA: '#0e2a4a', saturnB: '#1a4a7a', bg: 0x020b18, nebula2: 0x0033ff },
  romantica: { primary: 0xff6b9d, particle: 0xffb3d1, ring: 0xff6b9d, saturnA: '#3a0a20', saturnB: '#6a1a40', bg: 0x080010, nebula2: 0x9900cc },
  dorada:    { primary: 0xffd200, particle: 0xffe066, ring: 0xffd200, saturnA: '#2a1800', saturnB: '#5a3800', bg: 0x0d0800, nebula2: 0xff6600 },
  esmeralda: { primary: 0x10b981, particle: 0x6ee7b7, ring: 0x10b981, saturnA: '#001a0a', saturnB: '#013a1a', bg: 0x001a0d, nebula2: 0x0088ff },
};

const PHRASES = [
  'te quiero mucho', 'contigo siempre', 'mi reyna',
  'eres especial',   'para siempre',    'te amo',
  'mi todo',         'amor eterno',     'eres única',
  'mi corazón',      'siempre juntos',  'mi cielo',
  'eres mi mundo',   'te adoro',        'mi alegría',
  'mi vida eres tú', 'te necesito',     'eres perfecta',
  'solo tú',         'mi razón de ser', 'lo mejor de mí',
  'brillas por mí',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerpN(a, b, t) { return a + (b - a) * t; }

function makeStarSpotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,   'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.3)');
  g.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function makeSaturnTexture(colorA, colorB) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0,    colorA); g.addColorStop(0.35, colorB);
  g.addColorStop(0.5,  colorA); g.addColorStop(0.65, colorB);
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

function generateSpiralGalaxy(count, maxR, primaryHex) {
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const iR = ((primaryHex >> 16) & 0xff) / 255;
  const iG = ((primaryHex >>  8) & 0xff) / 255;
  const iB = ((primaryHex)       & 0xff) / 255;

  for (let i = 0; i < count; i++) {
    const rand = Math.random();
    let x, y, z, r;
    if (rand < 0.14) {
      r = Math.random() * 5;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r; y = (Math.random() - 0.5) * 0.8; z = Math.sin(a) * r;
    } else if (rand < 0.78) {
      const arm = rand < 0.46 ? 0 : 1;
      r = 4 + Math.pow(Math.random(), 0.5) * (maxR - 4);
      const wind = r * 0.24, scatter = (Math.random() - 0.5) * (r * 0.16 + 2);
      const a = arm * Math.PI + wind + scatter * 0.06;
      x = Math.cos(a) * r + Math.sin(a) * scatter;
      y = (Math.random() - 0.5) * (0.4 + r * 0.04);
      z = Math.sin(a) * r - Math.cos(a) * scatter;
    } else {
      r = Math.random() * maxR;
      const a = Math.random() * Math.PI * 2;
      x = Math.cos(a) * r; y = (Math.random() - 0.5) * (0.3 + r * 0.03); z = Math.sin(a) * r;
    }
    positions[i*3] = x; positions[i*3+1] = y; positions[i*3+2] = z;
    const t = Math.min(Math.sqrt(x*x+z*z) / maxR, 1);
    if (t < 0.1) {
      colors[i*3] = 1; colors[i*3+1] = 0.93; colors[i*3+2] = 0.88;
    } else if (t < 0.35) {
      colors[i*3] = Math.min(iR*1.4,1); colors[i*3+1] = Math.min(iG*1.2,1); colors[i*3+2] = Math.min(iB*1.2,1);
    } else {
      const u = (t-0.35)/0.65;
      colors[i*3] = lerpN(Math.min(iR*1.1,1),0.38,u); colors[i*3+1] = lerpN(Math.min(iG,1),0.33,u); colors[i*3+2] = lerpN(Math.min(iB,1),0.98,u);
    }
  }
  return { positions, colors };
}

function generateNebulaClouds(count, primaryHex, nebula2Hex) {
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  const pR=((primaryHex>>16)&0xff)/255, pG=((primaryHex>>8)&0xff)/255, pB=(primaryHex&0xff)/255;
  const n2R=((nebula2Hex>>16)&0xff)/255, n2G=((nebula2Hex>>8)&0xff)/255, n2B=(nebula2Hex&0xff)/255;
  const CLUMPS=[{r:20,a:0.7,w:14,h:6},{r:32,a:3.6,w:12,h:5},{r:26,a:2.1,w:10,h:4},{r:16,a:5.0,w:8,h:4}];
  const perClump = Math.floor(count / CLUMPS.length);
  for (let c=0; c<CLUMPS.length; c++) {
    const {r,a,w,h}=CLUMPS[c], start=c*perClump, end=c===CLUMPS.length-1?count:(c+1)*perClump;
    for (let i=start; i<end; i++) {
      const da=(Math.random()-0.5)*0.9, dr=(Math.random()-0.5)*w;
      positions[i*3]=Math.cos(a+da)*(r+dr); positions[i*3+1]=(Math.random()-0.5)*h; positions[i*3+2]=Math.sin(a+da)*(r+dr);
      const mix=Math.random();
      colors[i*3]=pR*(1-mix)+n2R*mix; colors[i*3+1]=pG*(1-mix)+n2G*mix; colors[i*3+2]=pB*(1-mix)+n2B*mix;
    }
  }
  return { positions, colors };
}

function makeTextSprite(text, primaryHex) {
  const W=640, H=100;
  const canvas=document.createElement('canvas'); canvas.width=W; canvas.height=H;
  const ctx=canvas.getContext('2d');
  const hexColor='#'+primaryHex.toString(16).padStart(6,'0');
  ctx.clearRect(0,0,W,H);
  ctx.font='italic 58px "Dancing Script", Georgia, serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor=hexColor; ctx.shadowBlur=32;
  ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText(text,W/2,H/2);
  ctx.shadowBlur=14; ctx.fillStyle='rgba(255,255,255,0.97)'; ctx.fillText(text,W/2,H/2);
  const texture=new THREE.CanvasTexture(canvas);
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
  sprite.scale.set(18, 18*(H/W), 1);
  return sprite;
}

// ─── Main hook ───────────────────────────────────────────────────────────────

export function useGalaxy(containerRef, data, onPortalClickRef) {
  const replayRef = useRef(false);
  const replayIntro = useCallback(() => { replayRef.current = true; }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !data) return;
    let mounted = true;

    const tema         = THEMES[data.tema] || THEMES.romantica;
    const displayFotos = Array.isArray(data.displayFotos) ? data.displayFotos : [];
    const PORTAL_SLOTS = Math.max(displayFotos.length, 1);

    // ── RENDERER ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 1.5 });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(tema.bg, 1);
    container.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 0.1, 1200);
    camera.position.set(0, 22, 58);
    camera.lookAt(0, 0, 0);

    // ── ORBIT CONTROLS — target always Saturn (0,0,0) ─────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.04;
    controls.minDistance = 8; controls.maxDistance = 500;
    controls.target.set(0, 0, 0);
    controls.enabled = false;

    const starSpot = makeStarSpotTexture();

    // ── WORMHOLE PARTICLE TUNNEL ──────────────────────────────────────────
    const WORM_N = 2500;
    const wormBuf1 = new Float32Array(WORM_N * 3);
    const wormBuf2 = new Float32Array(WORM_N * 3);

    for (let i = 0; i < WORM_N; i++) {
      const z = -120 + Math.random() * 780;       // z from -120 to 660
      const r1 = 5 + Math.pow(Math.random(), 0.5) * 40;
      const r2 = 2 + Math.random() * 18;
      const a = Math.random() * Math.PI * 2;
      wormBuf1[i*3]   = Math.cos(a)*r1; wormBuf1[i*3+1] = Math.sin(a)*r1; wormBuf1[i*3+2] = z;
      wormBuf2[i*3]   = Math.cos(a)*r2; wormBuf2[i*3+1] = Math.sin(a)*r2; wormBuf2[i*3+2] = z;
    }
    const wormGeo1 = new THREE.BufferGeometry();
    const wormGeo2 = new THREE.BufferGeometry();
    wormGeo1.setAttribute('position', new THREE.BufferAttribute(wormBuf1, 3));
    wormGeo2.setAttribute('position', new THREE.BufferAttribute(wormBuf2, 3));

    const wormPoints1 = new THREE.Points(wormGeo1, new THREE.PointsMaterial({
      color: tema.primary, size: 0.55, sizeAttenuation: true,
      map: starSpot, transparent: true, opacity: 0.9,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    const wormPoints2 = new THREE.Points(wormGeo2, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.25, sizeAttenuation: true,
      map: starSpot, transparent: true, opacity: 0.8,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    scene.add(wormPoints1);
    scene.add(wormPoints2);
    wormPoints1.visible = false;
    wormPoints2.visible = false;

    // ── BACKGROUND STAR FIELD ─────────────────────────────────────────────
    {
      const N=5000, pos=new Float32Array(N*3);
      for (let i=0;i<N;i++) {
        const θ=Math.random()*Math.PI*2, φ=Math.acos(2*Math.random()-1), r=90+Math.random()*60;
        pos[i*3]=r*Math.sin(φ)*Math.cos(θ); pos[i*3+1]=r*Math.sin(φ)*Math.sin(θ); pos[i*3+2]=r*Math.cos(φ);
      }
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
      const stars=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffffff,size:0.18,sizeAttenuation:true,transparent:true,opacity:0.75,depthWrite:false}));
      scene.add(stars); scene.userData.starsRef=stars;
    }

    // ── SPIRAL GALAXY ─────────────────────────────────────────────────────
    const GALAXY_R=58, GALAXY_COUNT=40000;
    const galaxyData=generateSpiralGalaxy(GALAXY_COUNT,GALAXY_R,tema.primary);
    const galaxyGeo=new THREE.BufferGeometry();
    galaxyGeo.setAttribute('position',new THREE.BufferAttribute(galaxyData.positions,3));
    galaxyGeo.setAttribute('color',   new THREE.BufferAttribute(galaxyData.colors,3));
    const galaxyPoints=new THREE.Points(galaxyGeo,new THREE.PointsMaterial({
      size:0.30,sizeAttenuation:true,vertexColors:true,map:starSpot,transparent:true,opacity:0.9,
      depthWrite:false,blending:THREE.AdditiveBlending,
    }));
    galaxyPoints.rotation.x=-0.18; scene.add(galaxyPoints);

    // ── NEBULA CLOUDS ─────────────────────────────────────────────────────
    const nebulaData=generateNebulaClouds(5000,tema.primary,tema.nebula2);
    const nebulaGeo=new THREE.BufferGeometry();
    nebulaGeo.setAttribute('position',new THREE.BufferAttribute(nebulaData.positions,3));
    nebulaGeo.setAttribute('color',   new THREE.BufferAttribute(nebulaData.colors,3));
    const nebulaMesh=new THREE.Points(nebulaGeo,new THREE.PointsMaterial({
      size:3.0,sizeAttenuation:true,vertexColors:true,map:starSpot,transparent:true,opacity:0.10,
      depthWrite:false,blending:THREE.AdditiveBlending,
    }));
    nebulaMesh.rotation.x=-0.18; scene.add(nebulaMesh);

    // ── BRIGHT SPARKLE STARS ─────────────────────────────────────────────
    {
      const N=350, pos=new Float32Array(N*3);
      for (let i=0;i<N;i++) {
        const θ=Math.random()*Math.PI*2,r=6+Math.random()*65,y=(Math.random()-0.5)*28;
        pos[i*3]=Math.cos(θ)*r; pos[i*3+1]=y; pos[i*3+2]=Math.sin(θ)*r;
      }
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
      scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0xffffff,size:0.65,sizeAttenuation:true,map:starSpot,transparent:true,opacity:0.95,depthWrite:false,blending:THREE.AdditiveBlending})));
    }

    // ── DUST PARTICLES ────────────────────────────────────────────────────
    const DUST_COUNT=600;
    const dustMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(0.05,4,4),new THREE.MeshBasicMaterial({color:tema.particle,transparent:true,opacity:0.25}),DUST_COUNT);
    const dustBase=[]; const dummy=new THREE.Matrix4();
    for (let i=0;i<DUST_COUNT;i++) {
      const v=new THREE.Vector3((Math.random()-0.5)*70,(Math.random()-0.5)*35,(Math.random()-0.5)*70);
      dustBase.push(v); dummy.setPosition(v); dustMesh.setMatrixAt(i,dummy);
    }
    dustMesh.instanceMatrix.needsUpdate=true; scene.add(dustMesh);

    // ── SATURN ────────────────────────────────────────────────────────────
    const saturnBody=new THREE.Mesh(new THREE.SphereGeometry(5.5,40,40),new THREE.MeshBasicMaterial({map:makeSaturnTexture(tema.saturnA,tema.saturnB)}));
    scene.add(saturnBody);
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(7.2,32,32),new THREE.MeshBasicMaterial({color:tema.primary,transparent:true,opacity:0.08,side:THREE.BackSide})));
    const RING_TILT=Math.PI*0.38;
    [{inner:6.8,outer:9.2,opacity:0.30},{inner:9.5,outer:11.5,opacity:0.19},{inner:11.8,outer:13.5,opacity:0.12}].forEach(({inner,outer,opacity})=>{
      const ring=new THREE.Mesh(new THREE.RingGeometry(inner,outer,64),new THREE.MeshBasicMaterial({color:tema.primary,transparent:true,opacity,side:THREE.DoubleSide}));
      ring.rotation.x=RING_TILT; scene.add(ring);
    });

    // ── PHOTO PORTALS — always 8, filled from displayFotos ───────────────
    const portals=[]; const portalRings=[]; const orbitData=[];
    const loader=new THREE.TextureLoader(); loader.crossOrigin='anonymous';

    for (let i=0; i<PORTAL_SLOTS; i++) {
      const baseAngle=(i/PORTAL_SLOTS)*Math.PI*2;
      const radius=18+(i%3)*6;
      const height=Math.sin(baseAngle*1.5+i)*9;
      const pos=new THREE.Vector3(radius*Math.cos(baseAngle),height,radius*Math.sin(baseAngle));
      orbitData.push({radius,baseAngle,height});

      const ring=new THREE.Mesh(new THREE.RingGeometry(2.95,3.75,64),new THREE.MeshBasicMaterial({color:tema.ring,transparent:true,opacity:0.5,side:THREE.DoubleSide}));
      ring.position.copy(pos); ring.userData.phase=(i/PORTAL_SLOTS)*Math.PI*2;
      portalRings.push(ring); scene.add(ring);

      const circle=new THREE.Mesh(new THREE.CircleGeometry(2.8,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0}));
      circle.position.copy(pos); circle.userData.index=i;
      portals.push(circle); scene.add(circle);

      loader.load(displayFotos[i % displayFotos.length], (tex) => {
        if (!mounted) { tex.dispose(); return; }
        tex.minFilter=tex.magFilter=THREE.LinearFilter;
        tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);
        const img=tex.image;
        if (img?.width && img?.height) {
          const R=img.width/img.height;
          if (R>1.05) { tex.repeat.set(1/R,1); tex.offset.set((1-1/R)/2,0); }
          else if (R<0.95) { tex.repeat.set(1,R); tex.offset.set(0,(1-R)/2); }
        }
        circle.material.map=tex; circle.material.needsUpdate=true; circle.userData.loaded=true;
      });
    }

    // ── FLOATING PHRASES ─────────────────────────────────────────────────
    const textSprites=[];
    document.fonts.ready.then(()=>{
      if (!mounted) return;
      PHRASES.forEach((text,i)=>{
        const sprite=makeTextSprite(text,tema.primary);
        const angle=(i/PHRASES.length)*Math.PI*2;
        const r=22+(i%5)*8;
        const baseY=(Math.random()-0.5)*18;
        const phaseOff=(i/PHRASES.length)*Math.PI*2;
        sprite.position.set(r*Math.cos(angle),baseY,r*Math.sin(angle));
        sprite.userData={baseAngle:angle,radius:r,baseY,phaseOff};
        sprite.material.opacity=0;
        textSprites.push(sprite); scene.add(sprite);
      });
    });

    // ── CINEMATIC INTRO CURVE (after wormhole) ────────────────────────────
    const introCurve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(0,80,100), new THREE.Vector3(-75,35,60),
      new THREE.Vector3(-85,5,-25), new THREE.Vector3(-30,-18,-75),
      new THREE.Vector3(55,-12,-60), new THREE.Vector3(78,12,20),
      new THREE.Vector3(45,28,55),  new THREE.Vector3(0,22,58),
    ],false,'centripetal');

    // ── STATE ─────────────────────────────────────────────────────────────
    let phase='explore', wormT=0, introT=0;
    let introPlayed = false; // portals hidden until the first cinematic completes

    // ── RAYCASTER (click + hover) ─────────────────────────────────────────
    const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2();
    let hoveredIdx = -1;

    const updatePointer=(e)=>{
      const rect=renderer.domElement.getBoundingClientRect();
      const cx=e.touches?e.touches[0].clientX:e.clientX;
      const cy=e.touches?e.touches[0].clientY:e.clientY;
      pointer.x=((cx-rect.left)/rect.width)*2-1;
      pointer.y=-((cy-rect.top)/rect.height)*2+1;
    };

    const handlePointerDown=(e)=>{
      if (phase!=='explore') return;
      updatePointer(e);
      raycaster.setFromCamera(pointer,camera);
      const hits=raycaster.intersectObjects(portals);
      if (hits.length>0) onPortalClickRef.current?.(hits[0].object.userData.index);
    };

    const handlePointerMove=(e)=>{
      if (phase!=='explore') { hoveredIdx=-1; return; }
      updatePointer(e);
      raycaster.setFromCamera(pointer,camera);
      const hits=raycaster.intersectObjects(portals);
      const newHover = hits.length>0 ? hits[0].object.userData.index : -1;
      if (newHover !== hoveredIdx) {
        hoveredIdx = newHover;
        renderer.domElement.style.cursor = newHover >= 0 ? 'pointer' : 'default';
      }
    };

    renderer.domElement.addEventListener('pointerdown',handlePointerDown);
    renderer.domElement.addEventListener('pointermove',handlePointerMove);

    // ── RESIZE ────────────────────────────────────────────────────────────
    const handleResize=()=>{
      if (!container) return;
      camera.aspect=container.clientWidth/container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth,container.clientHeight);
    };
    window.addEventListener('resize',handleResize);

    // ── ANIMATION LOOP ────────────────────────────────────────────────────
    const WORM_MS=3500, INTRO_MS=12000, ORBIT_SPEED=0.025, PHRASE_SPEED=0.010;
    let lastTime=performance.now(), raf;
    const _p = new THREE.Vector3();

    const animate=(now)=>{
      raf=requestAnimationFrame(animate);
      const dt=Math.min(now-lastTime,50); lastTime=now; const time=now/1000;

      if (replayRef.current) {
        replayRef.current=false; phase='wormhole'; wormT=0; introT=0;
        controls.enabled=false; camera.position.set(0,0,600);
        wormPoints1.visible=true; wormPoints2.visible=true;
        wormPoints1.material.opacity=0.9; wormPoints2.material.opacity=0.8;
        introPlayed=true; // portals start fading in from the first frame of the animation
      }

      // ── WORMHOLE PHASE ─────────────────────────────────────────────────
      if (phase==='wormhole') {
        wormT=Math.min(wormT+dt/WORM_MS,1);
        const t=easeInOutCubic(wormT);
        camera.position.set(0, lerpN(0,80,t), lerpN(600,100,t));
        camera.lookAt(0,0,0);

        const speed=10+wormT*25; // accelerate through tunnel
        for (let i=0;i<WORM_N;i++) {
          wormBuf1[i*3+2]+=speed; wormBuf2[i*3+2]+=speed*0.75;
          if (wormBuf1[i*3+2]>700) wormBuf1[i*3+2]-=820;
          if (wormBuf2[i*3+2]>700) wormBuf2[i*3+2]-=820;
        }
        wormGeo1.attributes.position.needsUpdate=true;
        wormGeo2.attributes.position.needsUpdate=true;

        // Fade out in last 30% of wormhole
        const fadeOut=Math.max(0,1-(wormT-0.7)/0.3);
        wormPoints1.material.opacity=0.9*fadeOut;
        wormPoints2.material.opacity=0.8*fadeOut;

        if (wormT>=1) {
          phase='intro'; introT=0;
          wormPoints1.visible=false; wormPoints2.visible=false;
          camera.position.copy(introCurve.getPoint(0));
        }
      }

      saturnBody.rotation.y+=0.0008;
      galaxyPoints.rotation.y+=0.00007;
      nebulaMesh.rotation.y+=0.00007;
      if (scene.userData.starsRef) scene.userData.starsRef.rotation.y+=0.00010;

      for (let i=0;i<DUST_COUNT;i++) {
        dummy.setPosition(
          dustBase[i].x+Math.sin(time*0.25+i*2.1)*2.5,
          dustBase[i].y+Math.cos(time*0.18+i*1.7)*1.5,
          dustBase[i].z+Math.sin(time*0.32+i*2.9)*2.5
        ); dustMesh.setMatrixAt(i,dummy);
      }
      dustMesh.instanceMatrix.needsUpdate=true;

      for (let i=0;i<portals.length;i++) {
        const {radius,baseAngle,height}=orbitData[i];
        const a=baseAngle+time*ORBIT_SPEED;
        _p.set(radius*Math.cos(a),height+Math.sin(time*0.4+i*1.1)*0.8,radius*Math.sin(a));
        portals[i].position.copy(_p); portalRings[i].position.copy(_p);
        portals[i].lookAt(camera.position); portalRings[i].lookAt(camera.position);

        const isHover = i === hoveredIdx;

        if (introPlayed) {
          const portalAlpha = portals[i].material.opacity; // 0→1 as photo fades in
          const ringPulse = 0.28 + 0.38 * Math.sin(time*1.3 + portalRings[i].userData.phase);
          const ringTarget = isHover ? Math.min(ringPulse + 0.45, 1) : ringPulse;
          portalRings[i].material.opacity = ringTarget * portalAlpha;
        } else {
          portalRings[i].material.opacity = 0;
        }

        // Smooth scale toward 1.0 (idle) or 1.15 (hover) — independent per portal
        const targetScale = isHover ? 1.15 : 1.0;
        const cur = portals[i].scale.x;
        const next = cur + (targetScale - cur) * 0.18;
        portals[i].scale.setScalar(next);
        portalRings[i].scale.setScalar(next);

        if (introPlayed && portals[i].userData.loaded && portals[i].material.opacity<1)
          portals[i].material.opacity=Math.min(portals[i].material.opacity+0.005,1);
      }

      for (let i=0;i<textSprites.length;i++) {
        const {baseAngle,radius,baseY,phaseOff}=textSprites[i].userData;
        const a=baseAngle+time*PHRASE_SPEED;
        textSprites[i].position.set(radius*Math.cos(a),baseY+Math.sin(time*0.28+phaseOff)*2.2,radius*Math.sin(a));
        textSprites[i].material.opacity=0.65+0.35*Math.abs(Math.sin(time*0.35+phaseOff));
      }

      // ── INTRO CURVE ────────────────────────────────────────────────────
      if (phase==='intro') {
        introT=Math.min(introT+dt/INTRO_MS,1);
        camera.position.copy(introCurve.getPoint(easeInOutCubic(introT)));
        camera.lookAt(0,0,0);
        if (introT>=1) { phase='explore'; controls.target.set(0,0,0); controls.enabled=true; }
      }

      // ── EXPLORE ────────────────────────────────────────────────────────
      if (phase==='explore') controls.update();

      renderer.render(scene,camera);
    };
    raf=requestAnimationFrame(animate);

    // ── CLEANUP ───────────────────────────────────────────────────────────
    return ()=>{
      mounted=false; cancelAnimationFrame(raf);
      window.removeEventListener('resize',handleResize);
      renderer.domElement.removeEventListener('pointerdown',handlePointerDown);
      renderer.domElement.removeEventListener('pointermove',handlePointerMove);
      controls.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      scene.traverse((obj)=>{
        obj.geometry?.dispose();
        if (obj.material) { obj.material.map?.dispose(); obj.material.dispose(); }
      });
      starSpot.dispose(); renderer.dispose();
    };
  }, [containerRef, data]);

  return { replayIntro };
}
