import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import '../styles/suggestions.css';

const MAX_LENGTH = 500;
const COOLDOWN_MS = 30_000;
const EDGE_FUNCTION_URL = 'https://smxvjtnlnblxksdcbdhd.supabase.co/functions/v1/submit-feedback';

const CATEGORIES = [
  {
    id: 'nueva',
    label: 'Quiero ver',
    desc: 'Una plantilla que aún no existe',
    placeholder: 'Imagina la plantilla perfecta. ¿Para qué ocasión? ¿Qué sensación daría al recibirla?',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    id: 'encanto',
    label: 'Me encantó',
    desc: 'Algo que funcionó de maravilla',
    placeholder: '¿Qué fue lo que más te gustó? Cuéntanos para no cambiarlo nunca.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'fallo',
    label: 'Algo falló',
    desc: 'Un error o algo inesperado',
    placeholder: 'Describe lo que pasó, en qué paso estabas y qué esperabas que ocurriera.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'libre',
    label: 'Lo que sea',
    desc: 'Cualquier cosa que quieras decir',
    placeholder: 'Sin filtros. Un pensamiento, una idea, lo que tengas en mente.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 2L11 13"/>
    <path d="M22 2L15 22 11 13 2 9l20-7z"/>
  </svg>
);

function EnvelopeCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 180, H = 124;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.z = 4.2;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    const purplePoint = new THREE.PointLight(0xd946ef, 2.4, 18);
    purplePoint.position.set(1.5, 1.5, 3);
    const fillPoint = new THREE.PointLight(0x9333ea, 0.9, 12);
    fillPoint.position.set(-2, -1, 2);
    scene.add(ambient, purplePoint, fillPoint);

    const group = new THREE.Group();
    scene.add(group);

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1030,
      emissive: 0xd946ef,
      emissiveIntensity: 0.07,
      roughness: 0.55,
      metalness: 0.15,
    });
    const flapMat = new THREE.MeshStandardMaterial({
      color: 0x1c1238,
      emissive: 0xd946ef,
      emissiveIntensity: 0.10,
      side: THREE.DoubleSide,
      roughness: 0.5,
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.65 });
    const foldMat = new THREE.LineBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.35 });
    const innerMat = new THREE.LineBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.18 });

    // Body
    const bodyGeo = new THREE.BoxGeometry(2, 1.28, 0.07);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    const bodyEdges = new THREE.EdgesGeometry(bodyGeo);
    bodyMesh.add(new THREE.LineSegments(bodyEdges, edgeMat));
    group.add(bodyMesh);

    // Front flap (V pointing down from top edge)
    const flapShape = new THREE.Shape();
    flapShape.moveTo(-1, 0);
    flapShape.lineTo(0, -0.52);
    flapShape.lineTo(1, 0);
    flapShape.closePath();
    const flapGeo = new THREE.ShapeGeometry(flapShape);
    const flapMesh = new THREE.Mesh(flapGeo, flapMat);
    flapMesh.position.set(0, 0.64, 0.038);
    group.add(flapMesh);

    // Flap V-line (front)
    const mkLine = (pts, mat) => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      return new THREE.Line(geo, mat);
    };

    group.add(mkLine([[-1, 0.64, 0.039], [0, 0.12, 0.039], [1, 0.64, 0.039]], edgeMat));

    // Bottom fold V-line
    group.add(mkLine([[-1, -0.64, 0.039], [0, -0.14, 0.039], [1, -0.64, 0.039]], foldMat));

    // Left fold diagonal
    group.add(mkLine([[-1, -0.64, 0.039], [-0.38, 0, 0.039], [-1, 0.64, 0.039]], foldMat));

    // Right fold diagonal
    group.add(mkLine([[1, -0.64, 0.039], [0.38, 0, 0.039], [1, 0.64, 0.039]], foldMat));

    // Letter lines inside body (horizontal, subtle)
    [-0.14, 0.04, 0.22].forEach((y) => {
      group.add(mkLine([[-0.52, y, 0.039], [0.52, y, 0.039]], innerMat));
    });

    // Mouse tracking on window (subtle — not just canvas)
    const onMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let smoothX = 0, smoothY = 0;
    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      smoothX += (mouseRef.current.x - smoothX) * 0.035;
      smoothY += (mouseRef.current.y - smoothY) * 0.035;

      group.rotation.y = smoothX * 0.28 + Math.sin(t * 0.42) * 0.045;
      group.rotation.x = smoothY * 0.18 + Math.sin(t * 0.31) * 0.028;
      group.position.y = Math.sin(t * 0.65) * 0.055;

      bodyMat.emissiveIntensity = 0.07 + Math.sin(t * 1.1) * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      bodyGeo.dispose();
      flapGeo.dispose();
      bodyMat.dispose();
      flapMat.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="sug-envelope-canvas" width={180} height={124} />;
}

export default function Suggestions() {
  const [categoria, setCategoria] = useState(CATEGORIES[0]);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [notif, setNotif] = useState('');
  const lastSentRef = useRef(0);

  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(''), 4500);
  };

  const handleCategory = (cat) => {
    setCategoria(cat);
    setMensaje('');
  };

  const enviar = async () => {
    const texto = mensaje.trim();
    if (!texto) { notify('Escribe algo antes de enviar.'); return; }
    if (texto.length > MAX_LENGTH) { notify(`El mensaje no puede superar ${MAX_LENGTH} caracteres.`); return; }

    const ahora = Date.now();
    if (ahora - lastSentRef.current < COOLDOWN_MS) {
      const seg = Math.ceil((COOLDOWN_MS - (ahora - lastSentRef.current)) / 1000);
      notify(`Espera ${seg}s antes de enviar otro mensaje.`);
      return;
    }

    setEnviando(true);
    lastSentRef.current = ahora;

    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: `[${categoria.label}] ${texto}` }),
      });
      const data = await res.json();

      if (res.status === 429) {
        notify('Demasiadas solicitudes. Espera un momento.');
      } else if (!res.ok) {
        notify('Hubo un error al enviar. Intenta de nuevo.');
        if (import.meta.env.DEV) console.error(data);
      } else {
        setExito(true);
      }
    } catch (err) {
      notify('Error de conexión. Intenta de nuevo.');
      if (import.meta.env.DEV) console.error(err);
    }

    setEnviando(false);
  };

  return (
    <div className="sug-page">
      <nav className="sug-nav">
        <Link to="/" className="sug-back">
          <ArrowLeftIcon />
          <span>Volver</span>
        </Link>
        <img src="/logo-horizontal.svg" alt="Sorpresa Virtual" className="sug-logo" width="130" height="40" />
      </nav>

      <div className="sug-envelope-wrap" aria-hidden="true">
        <EnvelopeCanvas />
        <div className="sug-envelope-glow" />
      </div>

      {exito ? (
        <div className="sug-success" role="status">
          <div className="sug-success-icon">
            <SendIcon />
          </div>
          <p className="sug-success-title">Enviado</p>
          <p className="sug-success-sub">Tu mensaje ya está con nosotros. Gracias por tomarte el tiempo.</p>
          <Link to="/" className="sug-success-btn">Volver al inicio</Link>
        </div>
      ) : (
        <>
          <section className="sug-hero">
            <h1 className="sug-title">Tu voz da forma a esto</h1>
            <p className="sug-subtitle">
              Cada mensaje que nos envías es parte del proceso. No hay respuesta incorrecta.
            </p>
          </section>

          <div className="sug-categories" role="group" aria-label="Tipo de mensaje">
            {CATEGORIES.map((cat) => {
              const active = categoria.id === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`sug-cat-btn${active ? ' sug-cat-active' : ''}`}
                  onClick={() => handleCategory(cat)}
                  aria-pressed={active}
                >
                  <span className="sug-cat-icon">{cat.icon}</span>
                  <span className="sug-cat-label">{cat.label}</span>
                  <span className="sug-cat-desc">{cat.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="sug-form">
            {notif && <p className="sug-notif" role="alert">{notif}</p>}

            <textarea
              className="sug-textarea"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value.slice(0, MAX_LENGTH))}
              placeholder={categoria.placeholder}
              maxLength={MAX_LENGTH}
              rows={5}
            />
            <span className="sug-counter">{mensaje.length} / {MAX_LENGTH}</span>

            <button className="sug-submit" onClick={enviar} disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
