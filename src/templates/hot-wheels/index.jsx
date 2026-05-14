import React, { useState, useEffect, useMemo, useRef } from "react";
import "./style.css";
import RamoAzul from "./ramo-azul.png";
import HotWheelsSVG from "./card.svg";

const HeartSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ChevronDownSVG = () => (
  <svg className="icon-chevron-hw" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

const GiftSVG = () => (
  <svg className="icon-gift-hw" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 6h-2.18c.11-.33.18-.68.18-1.04C18 3.33 16.67 2 15.04 2c-.95 0-1.96.4-2.59 1.19L12 4.17l-.45-.98C10.96 2.4 9.95 2 9 2 7.33 2 6 3.33 6 5c0 .37.07.71.18 1.04H4c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 16H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v7z" />
  </svg>
);

// Stable pseudo-random helper (no Math.random on render)
const seedRand = (seed) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

export default function HotWheelsTemplate({ data, isPreview }) {
  const [abierto, setAbierto] = useState(false);
  const [mostrarCarta, setMostrarCarta] = useState(false);
  const [textosFlotantes, setTextosFlotantes] = useState([]);

  const nombre = data?.nombre || "Carlos";
  const mensaje = data?.mensaje || null;
  const remitente = data?.remitente || null;

  const animatedCarta = useRef(false);
  const confettiFired = useRef(false);

  const frases = useMemo(() => [
    "Te amo",
    "Te quiero",
    "Mi amor",
    "Siempre contigo",
    "Eres mi motor",
    "A toda velocidad",
    "Te adoro",
    "Mi favorito",
  ], []);

  // Posiciones de partículas estables (sin Math.random en render)
  const particulas = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${((seedRand(i * 7) * 90) + 3).toFixed(1)}%`,
      delay: `${(seedRand(i * 13) * 5).toFixed(2)}s`,
      duration: `${(3 + seedRand(i * 17) * 4).toFixed(2)}s`,
      size: i % 3 === 0 ? "grande" : i % 3 === 1 ? "mediana" : "chica",
    })),
  []);

  // Confetti al abrir
  useEffect(() => {
    if (!abierto || confettiFired.current) return;
    confettiFired.current = true;

    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      const opts = { colors: ["#00bfff", "#0056a3", "#ffffff", "#87ceeb"], gravity: 1.0 };
      confetti({ ...opts, particleCount: 90, spread: 80, origin: { y: 0.5 } });
      setTimeout(() => {
        confetti({ ...opts, particleCount: 45, spread: 55, angle: 60,  origin: { x: 0.1, y: 0.6 } });
        confetti({ ...opts, particleCount: 45, spread: 55, angle: 120, origin: { x: 0.9, y: 0.6 } });
      }, 280);
    });
  }, [abierto]);

  // Timer para mostrar la carta
  useEffect(() => {
    if (!abierto) return;
    const delay = isPreview ? 0 : 3200;
    const t = setTimeout(() => setMostrarCarta(true), delay);
    return () => clearTimeout(t);
  }, [abierto, isPreview]);

  // Animación escalonada de los párrafos de la carta
  useEffect(() => {
    if (!mostrarCarta || animatedCarta.current) return;
    animatedCarta.current = true;
    let cancelled = false;

    import("animejs").then(({ animate, stagger }) => {
      if (cancelled) return;
      animate(".carta-header-hw", {
        opacity: [0, 1], translateY: [25, 0],
        duration: 700, ease: "outExpo",
      });
      animate(".carta-parrafo-hw", {
        opacity: [0, 1], translateY: [35, 0],
        duration: 650, ease: "outExpo",
        delay: stagger(160, { start: 200 }),
      });
    });

    return () => { cancelled = true; };
  }, [mostrarCarta]);

  const handleClicPantalla = (e) => {
    if (!abierto) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const baseFrase = frases[Math.floor(Math.random() * frases.length)];
    const lote = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + Math.random(),
      texto: baseFrase,
      x, y, variante: i,
    }));
    setTextosFlotantes((prev) => [...prev, ...lote]);
    const ids = lote.map((f) => f.id);
    setTimeout(() => {
      setTextosFlotantes((prev) => prev.filter((t) => !ids.includes(t.id)));
    }, 1600);
  };

  return (
    <>
      <div className="regalo-virtual-container-hw">

        {!abierto ? (
          /* ── Pantalla de inicio ── */
          <div className="pantalla-inicio-hw">
            <img className="logo-inicio-hw" src={HotWheelsSVG} alt="Hot Wheels" />
            <h1 className="titulo-tocar-hw">Tengo una sorpresa para ti</h1>
            <button className="boton-abrir-hw" onClick={() => setAbierto(true)}>
              <GiftSVG />
              Abrir regalo
            </button>
          </div>
        ) : (
          /* ── Contenido abierto ── */
          <div className="contenido-abierto-hw" onClick={handleClicPantalla}>

            {/* Partículas flotantes */}
            <div className="fondo-estrellas-hw" aria-hidden="true">
              {particulas.map((p) => (
                <div
                  key={p.id}
                  className={`particula-hw particula-${p.size}-hw`}
                  style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
                />
              ))}
            </div>

            {/* Textos explosivos al hacer clic */}
            {textosFlotantes.map((item) => (
              <div
                key={item.id}
                className={`texto-clic-interactivo-hw variante-${item.variante}-hw`}
                style={{ left: item.x, top: item.y }}
              >
                {item.texto}
              </div>
            ))}

            {/* ── Sección del ramo ── */}
            <div className="seccion-ramo-hw">
              <h1 className="titulo-principal-hw">
                Para ti, {nombre}
                <HeartSVG className="titulo-heart-hw" />
              </h1>

              <div className="ramo-wrapper-hw">
                {/* Líneas de velocidad detrás del ramo */}
                <div className="lineas-velocidad-hw" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="linea-hw" style={{ animationDelay: `${i * 0.5}s` }} />
                  ))}
                </div>

                <div className="levitacion-wrapper-hw">
                  <img src={RamoAzul} alt="Ramo de Hot Wheels" className="ramo-imagen-hw" />
                </div>
              </div>

              {mostrarCarta && (
                <div className="indicador-scroll-hw">
                  <ChevronDownSVG />
                  <span>Desliza hacia abajo</span>
                  <ChevronDownSVG />
                </div>
              )}
            </div>

            {/* ── Sección de la carta ── */}
            {mostrarCarta && (
              <div className="seccion-carta-hw">
                <div className="tarjeta-mensaje-hw">

                  <div className="carta-header-hw">
                    <img src={HotWheelsSVG} alt="" className="carta-logo-hw" />
                    <h2 className="titulo-carta-hw">Para ti, {nombre}</h2>
                  </div>

                  <p className="carta-parrafo-hw">
                    Este ramo llegó hasta aquí con mucho cariño — como símbolo de
                    algo especial que no se puede guardar en una caja ni medir en palabras.
                  </p>
                  <p className="carta-parrafo-hw">
                    Hay personas que hacen la vida más bonita con solo estar presentes.
                    Tú eres una de esas personas, y mereces ser recordado con algo único,
                    pensado solo para ti.
                  </p>
                  <p className="carta-parrafo-hw">
                    Como cada Hot Wheels, este momento tiene su propia historia.
                    Y esta historia dice que alguien pensó en ti hoy, con todo el corazón.
                  </p>

                  {mensaje && (
                    <>
                      <div className="divisor-carta-hw" />
                      <p className="nota-personal-label-hw carta-parrafo-hw">Una nota especial para ti:</p>
                      <p className="carta-parrafo-hw carta-mensaje-personalizado-hw">{mensaje}</p>
                    </>
                  )}

                  <p className="carta-parrafo-hw firma-hw">
                    Con mucho cariño{remitente ? `, ${remitente}` : ""}.
                    <HeartSVG className="firma-heart-hw" />
                  </p>
                </div>

                <div className="detalle-final-hw">
                  <img src={HotWheelsSVG} alt="" className="logo-final-hw" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
