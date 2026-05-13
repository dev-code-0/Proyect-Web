import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import Mocha from "./images/mocha.gif";
import Mocha2 from "./images/mocha2.gif";
import Mocha3 from "./images/mocha3.gif";
import Mocha4 from "./images/mocha4.gif";
import Mocha5Final from "./images/mocha5final.gif";
import Mocha6Final from "./images/mocha6final.gif";
import Mocha7Final from "./images/mocha7final.gif";
import Mocha9Final from "./images/mocha9final.gif";

const GIF = {
  initial: Mocha,
  sad1:    Mocha2,
  sad2:    Mocha3,
  sad3:    Mocha4,
  happy1:  Mocha5Final,
  happy2:  Mocha6Final,
  happy3:  Mocha7Final,
  happy4:  Mocha9Final,
};

const SAD_SEQUENCE = [
  { key: "initial", dur: 2000 },
  { key: "sad1",    dur: 2000 },
  { key: "sad2",    dur: 2000 },
  { key: "sad3",    dur: 2000 },
];

const HAPPY_SEQUENCE = [
  { key: "happy1", dur: 1000 },
  { key: "happy2", dur: 1000 },
  { key: "happy3", dur: 1000 },
  { key: "happy4", dur: 1000 },
];

export default function NoviaPregunta({ data }) {
  // Compat con registros viejos que guardaban el campo como "nombre"
  const pregunta  = data?.pregunta  || data?.nombre || "¿Quieres ser mi novia?";
  const mensajeSi = data?.mensaje_si || "¡Sabía que dirías que sí!";

  const [currentGif, setCurrentGif] = useState("initial");
  const [answered, setAnswered]     = useState(false);
  const [yesScale, setYesScale]     = useState(1);
  const [noShift, setNoShift]       = useState({ x: 0, y: 0 });
  const [noMoving, setNoMoving]     = useState(false);
  const containerRef = useRef(null);
  const timerRef     = useRef(null);
  const yesGrowRef   = useRef(null);
  const mouseInNoRef = useRef(false);
  const answeredRef  = useRef(false);

  // Precarga todos los GIFs para evitar flash entre transiciones
  useEffect(() => {
    Object.values(GIF).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Loop SAD mientras no responde
  useEffect(() => {
    if (answered) return;
    let idx = 0;
    function tick() {
      if (answeredRef.current) return;
      setCurrentGif(SAD_SEQUENCE[idx].key);
      const dur = SAD_SEQUENCE[idx].dur;
      idx = (idx + 1) % SAD_SEQUENCE.length;
      timerRef.current = setTimeout(tick, dur);
    }
    tick();
    return () => clearTimeout(timerRef.current);
  }, [answered]);

  // Loop HAPPY al responder
  useEffect(() => {
    if (!answered) return;
    let idx = 0;
    function tick() {
      setCurrentGif(HAPPY_SEQUENCE[idx].key);
      const dur = HAPPY_SEQUENCE[idx].dur;
      idx = (idx + 1) % HAPPY_SEQUENCE.length;
      timerRef.current = setTimeout(tick, dur);
    }
    tick();
    return () => clearTimeout(timerRef.current);
  }, [answered]);

  async function handleYes() {
    clearTimeout(timerRef.current);
    clearTimeout(yesGrowRef.current);
    answeredRef.current = true;
    setAnswered(true);
    try {
      const { default: confetti } = await import("canvas-confetti");
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ff6b9d", "#ffc2d4", "#ff85a1", "#ff3d7f", "#fff0f6"],
      });
    } catch (_) {}
  }

  function handleNoEnter() {
    mouseInNoRef.current = true;
    growYes(1.1);
  }

  function handleNoLeave() {
    mouseInNoRef.current = false;
    clearTimeout(yesGrowRef.current);
  }

  function growYes(factor) {
    if (!mouseInNoRef.current || factor > 2.5) return;
    setYesScale(factor);
    yesGrowRef.current = setTimeout(() => growYes(+(factor + 0.12).toFixed(2)), 500);
  }

  function handleNoMove() {
    if (noMoving) return;
    setNoMoving(true);
    const w = containerRef.current?.clientWidth ?? 320;
    const xMax = Math.max(60, w / 2 - 80);
    const x = (Math.random() * 2 - 1) * xMax;
    const y = (Math.random() * 2 - 1) * 60;
    setNoShift({ x, y });
    setTimeout(() => setNoMoving(false), 520);
  }

  function handleNoTouch() {
    handleNoMove();
  }

  const noStyle = {
    transform: `translate(${noShift.x}px, ${noShift.y}px)`,
    transition: "transform 0.5s cubic-bezier(.34,1.56,.64,1)",
  };

  return (
    <>
      <main className={`novia-wrap-pr${answered ? " novia-wrap--yes-pr" : ""}`}>
        <div ref={containerRef} className="novia-card-pr">
          <div className="novia-gif-wrap-pr">
            <img
              key={currentGif}
              src={GIF[currentGif]}
              alt="osito"
              className="novia-gif-pr"
            />
          </div>

          {!answered ? (
            <>
              <h1 className="novia-question-pr">{pregunta}</h1>
              <div className="novia-btns-pr">
                <button
                  className="novia-btn-pr novia-btn--si-pr"
                  style={{ transform: `scale(${yesScale})` }}
                  onClick={handleYes}
                >
                  Si
                </button>
                <button
                  className="novia-btn-pr novia-btn--no-pr"
                  style={noStyle}
                  onMouseEnter={handleNoEnter}
                  onMouseLeave={handleNoLeave}
                  onMouseMove={handleNoMove}
                  onTouchStart={handleNoTouch}
                >
                  No
                </button>
              </div>
            </>
          ) : (
            <div className="novia-message-pr">{mensajeSi}</div>
          )}
        </div>
      </main>
    </>
  );
}
