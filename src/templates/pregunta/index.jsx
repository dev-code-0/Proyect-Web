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

// Cada gif dura 2500ms antes de pasar al siguiente
const SAD_SEQUENCE = [
  { key: "initial", dur: 2000 },
  { key: "sad1",    dur: 2000 },
  { key: "sad2",    dur: 2000 },
  { key: "sad3",    dur: 2000 },
];

// Cada gif dura 1000ms antes de pasar al siguiente
const HAPPY_SEQUENCE = [
  { key: "happy1", dur: 1000 },
  { key: "happy2", dur: 1000 },
  { key: "happy3", dur: 1000 },
  { key: "happy4", dur: 1000 },
];

export default function NoviaPregunta({ data }) {
  const pregunta = data?.nombre || "¿Quieres ser mi novia?";

  const [currentGif, setCurrentGif] = useState("initial");
  const [answered, setAnswered]     = useState(false);
  const [yesScale, setYesScale]     = useState(1);
  const [noPos, setNoPos]           = useState({ x: null, y: null });
  const [noMoving, setNoMoving]     = useState(false);

  const timerRef     = useRef(null);
  const yesGrowRef   = useRef(null);
  const mouseInNoRef = useRef(false);
  const answeredRef  = useRef(false); // ref para acceder al valor actualizado dentro del loop

  // Loop infinito de SAD mientras no haya respondido
  useEffect(() => {
    if (answered) return;

    let idx = 0;

    function tick() {
      if (answeredRef.current) return; // si ya respondió, cortar
      setCurrentGif(SAD_SEQUENCE[idx].key);
      const dur = SAD_SEQUENCE[idx].dur;
      idx = (idx + 1) % SAD_SEQUENCE.length; // vuelve a 0 al llegar al final
      timerRef.current = setTimeout(tick, dur);
    }

    tick();

    return () => clearTimeout(timerRef.current);
  }, [answered]);

  // Loop infinito de HAPPY una vez que respondió
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

  function handleYes() {
    clearTimeout(timerRef.current);
    clearTimeout(yesGrowRef.current);
    answeredRef.current = true;
    setAnswered(true);
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
    const x = Math.random() * (document.documentElement.clientWidth  - 160);
    const y = Math.random() * (document.documentElement.clientHeight -  80);
    setNoPos({ x, y });
    setTimeout(() => setNoMoving(false), 520);
  }

  const noStyle = noPos.x !== null ? { position: "fixed", left: noPos.x, top: noPos.y, transition: "all 0.5s" } : {};

  return (
    <main className={`novia-wrap-pr${answered ? " novia-wrap--yes-pr" : ""}`}>
      <div className="novia-card-pr">
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
              <button className="novia-btn-pr novia-btn--si-pr" style={{ transform: `scale(${yesScale})` }} onClick={handleYes}> Sí 💚</button>
              <button className="novia-btn-pr novia-btn--no-pr" style={noStyle} onMouseEnter={handleNoEnter} onMouseLeave={handleNoLeave} onMouseMove={handleNoMove}>No</button>
            </div>
          </>
        ) : (
          <div className="novia-message-pr">
            ¡Oh Sí! Sabía que ibas a decir que sí<br />
            Te quiero ver ya... xd 🥰
          </div>
        )}
      </div>
    </main>
  );
}