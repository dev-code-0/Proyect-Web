import React, { useEffect, useMemo, useRef, useState } from "react";
import cajitaImage from "./cajita.webp";
import "./flores-corazones.css"; 
import Song from "./musica.mp3";

const flowersSceneMarkup = `
  <div class="night-fc"></div>
  <div class="flowers-fc">
    <div class="flower-fc flower--1-fc">
      <div class="flower__leafs-fc flower__leafs--1-fc">
        <div class="flower__leaf-fc flower__leaf--1-fc"></div>
        <div class="flower__leaf-fc flower__leaf--2-fc"></div>
        <div class="flower__leaf-fc flower__leaf--3-fc"></div>
        <div class="flower__leaf-fc flower__leaf--4-fc"></div>
        <div class="flower__white-circle-fc"></div>

        <div class="flower__light-fc flower__light--1-fc"></div>
        <div class="flower__light-fc flower__light--2-fc"></div>
        <div class="flower__light-fc flower__light--3-fc"></div>
        <div class="flower__light-fc flower__light--4-fc"></div>
        <div class="flower__light-fc flower__light--5-fc"></div>
        <div class="flower__light-fc flower__light--6-fc"></div>
        <div class="flower__light-fc flower__light--7-fc"></div>
        <div class="flower__light-fc flower__light--8-fc"></div>
      </div>
      <div class="flower__line-fc">
        <div class="flower__line__leaf-fc flower__line__leaf--1-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--2-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--3-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--4-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--5-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--6-fc"></div>
      </div>
    </div>

    <div class="flower-fc flower--2-fc">
      <div class="flower__leafs-fc flower__leafs--2-fc">
        <div class="flower__leaf-fc flower__leaf--1-fc"></div>
        <div class="flower__leaf-fc flower__leaf--2-fc"></div>
        <div class="flower__leaf-fc flower__leaf--3-fc"></div>
        <div class="flower__leaf-fc flower__leaf--4-fc"></div>
        <div class="flower__white-circle-fc"></div>

        <div class="flower__light-fc flower__light--1-fc"></div>
        <div class="flower__light-fc flower__light--2-fc"></div>
        <div class="flower__light-fc flower__light--3-fc"></div>
        <div class="flower__light-fc flower__light--4-fc"></div>
        <div class="flower__light-fc flower__light--5-fc"></div>
        <div class="flower__light-fc flower__light--6-fc"></div>
        <div class="flower__light-fc flower__light--7-fc"></div>
        <div class="flower__light-fc flower__light--8-fc"></div>
      </div>
      <div class="flower__line-fc">
        <div class="flower__line__leaf-fc flower__line__leaf--1-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--2-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--3-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--4-fc"></div>
      </div>
    </div>

    <div class="flower-fc flower--3-fc">
      <div class="flower__leafs-fc flower__leafs--3-fc">
        <div class="flower__leaf-fc flower__leaf--1-fc"></div>
        <div class="flower__leaf-fc flower__leaf--2-fc"></div>
        <div class="flower__leaf-fc flower__leaf--3-fc"></div>
        <div class="flower__leaf-fc flower__leaf--4-fc"></div>
        <div class="flower__white-circle-fc"></div>

        <div class="flower__light-fc flower__light--1-fc"></div>
        <div class="flower__light-fc flower__light--2-fc"></div>
        <div class="flower__light-fc flower__light--3-fc"></div>
        <div class="flower__light-fc flower__light--4-fc"></div>
        <div class="flower__light-fc flower__light--5-fc"></div>
        <div class="flower__light-fc flower__light--6-fc"></div>
        <div class="flower__light-fc flower__light--7-fc"></div>
        <div class="flower__light-fc flower__light--8-fc"></div>
      </div>
      <div class="flower__line-fc">
        <div class="flower__line__leaf-fc flower__line__leaf--1-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--2-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--3-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--4-fc"></div>
      </div>
    </div>

    <div class="flower-fc flower--4-fc">
      <div class="flower__leafs-fc flower__leafs--3-fc">
        <div class="flower__leaf-fc flower__leaf--1-fc"></div>
        <div class="flower__leaf-fc flower__leaf--2-fc"></div>
        <div class="flower__leaf-fc flower__leaf--3-fc"></div>
        <div class="flower__leaf-fc flower__leaf--4-fc"></div>
        <div class="flower__white-circle-fc"></div>

        <div class="flower__light-fc flower__light--1-fc"></div>
        <div class="flower__light-fc flower__light--2-fc"></div>
        <div class="flower__light-fc flower__light--3-fc"></div>
        <div class="flower__light-fc flower__light--4-fc"></div>
        <div class="flower__light-fc flower__light--5-fc"></div>
        <div class="flower__light-fc flower__light--6-fc"></div>
        <div class="flower__light-fc flower__light--7-fc"></div>
        <div class="flower__light-fc flower__light--8-fc"></div>
      </div>
      <div class="flower__line-fc">
        <div class="flower__line__leaf-fc flower__line__leaf--1-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--2-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--3-fc"></div>
        <div class="flower__line__leaf-fc flower__line__leaf--4-fc"></div>
      </div>
    </div>

    <div class="grow-ans-fc" style="--d:1.2s">
      <div class="flower__g-long-fc">
        <div class="flower__g-long__top-fc"></div>
        <div class="flower__g-long__bottom-fc"></div>
      </div>
    </div>

    <div class="growing-grass-fc">
      <div class="flower__grass-fc flower__grass--1-fc">
        <div class="flower__grass--top-fc"></div>
        <div class="flower__grass--bottom-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--1-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--2-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--3-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--4-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--5-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--6-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--7-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--8-fc"></div>
        <div class="flower__grass__overlay-fc"></div>
      </div>
    </div>

    <div class="growing-grass-fc">
      <div class="flower__grass-fc flower__grass--2-fc">
        <div class="flower__grass--top-fc"></div>
        <div class="flower__grass--bottom-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--1-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--2-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--3-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--4-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--5-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--6-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--7-fc"></div>
        <div class="flower__grass__leaf-fc flower__grass__leaf--8-fc"></div>
        <div class="flower__grass__overlay-fc"></div>
      </div>
    </div>

    <div class="grow-ans-fc" style="--d:2.4s">
      <div class="flower__g-right-fc flower__g-right--1-fc">
        <div class="leaf-fc"></div>
      </div>
    </div>

    <div class="grow-ans-fc" style="--d:2.8s">
      <div class="flower__g-right-fc flower__g-right--2-fc">
        <div class="leaf-fc"></div>
      </div>
    </div>

    <div class="grow-ans-fc" style="--d:2.8s">
      <div class="flower__g-front-fc">
        <div class="flower__g-front__leaf-wrapper-fc flower__g-front__leaf-wrapper--1-fc">
          <div class="flower__g-front__leaf-fc"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper-fc flower__g-front__leaf-wrapper--2-fc">
          <div class="flower__g-front__leaf-fc"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper-fc flower__g-front__leaf-wrapper--3-fc">
          <div class="flower__g-front__leaf-fc"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper-fc flower__g-front__leaf-wrapper--4-fc">
          <div class="flower__g-front__leaf-fc"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper-fc flower__g-front__leaf-wrapper--5-fc">
          <div class="flower__g-front__leaf-fc"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper-fc flower__g-front__leaf-wrapper--6-fc">
          <div class="flower__g-front__leaf-fc"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper-fc flower__g-front__leaf-wrapper--7-fc">
          <div class="flower__g-front__leaf-fc"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper-fc flower__g-front__leaf-wrapper--8-fc">
          <div class="flower__g-front__leaf-fc"></div>
        </div>
        <div class="flower__g-front__line-fc"></div>
      </div>
    </div>

    <div class="grow-ans-fc" style="--d:3.2s">
      <div class="flower__g-fr-fc">
        <div class="leaf-fc"></div>
        <div class="flower__g-fr__leaf-fc flower__g-fr__leaf--1-fc"></div>
        <div class="flower__g-fr__leaf-fc flower__g-fr__leaf--2-fc"></div>
        <div class="flower__g-fr__leaf-fc flower__g-fr__leaf--3-fc"></div>
        <div class="flower__g-fr__leaf-fc flower__g-fr__leaf--4-fc"></div>
        <div class="flower__g-fr__leaf-fc flower__g-fr__leaf--5-fc"></div>
        <div class="flower__g-fr__leaf-fc flower__g-fr__leaf--6-fc"></div>
        <div class="flower__g-fr__leaf-fc flower__g-fr__leaf--7-fc"></div>
        <div class="flower__g-fr__leaf-fc flower__g-fr__leaf--8-fc"></div>
      </div>
    </div>

    <div class="long-g-fc long-g--0-fc">
      <div class="grow-ans-fc" style="--d:3s"><div class="leaf-fc leaf--0-fc"></div></div>
      <div class="grow-ans-fc" style="--d:2.2s"><div class="leaf-fc leaf--1-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.4s"><div class="leaf-fc leaf--2-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.6s"><div class="leaf-fc leaf--3-fc"></div></div>
    </div>

    <div class="long-g-fc long-g--1-fc">
      <div class="grow-ans-fc" style="--d:3.6s"><div class="leaf-fc leaf--0-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.8s"><div class="leaf-fc leaf--1-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4s"><div class="leaf-fc leaf--2-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.2s"><div class="leaf-fc leaf--3-fc"></div></div>
    </div>

    <div class="long-g-fc long-g--2-fc">
      <div class="grow-ans-fc" style="--d:4s"><div class="leaf-fc leaf--0-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.2s"><div class="leaf-fc leaf--1-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.4s"><div class="leaf-fc leaf--2-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.6s"><div class="leaf-fc leaf--3-fc"></div></div>
    </div>

    <div class="long-g-fc long-g--3-fc">
      <div class="grow-ans-fc" style="--d:4s"><div class="leaf-fc leaf--0-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.2s"><div class="leaf-fc leaf--1-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3s"><div class="leaf-fc leaf--2-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.6s"><div class="leaf-fc leaf--3-fc"></div></div>
    </div>

    <div class="long-g-fc long-g--4-fc">
      <div class="grow-ans-fc" style="--d:4s"><div class="leaf-fc leaf--0-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.2s"><div class="leaf-fc leaf--1-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3s"><div class="leaf-fc leaf--2-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.6s"><div class="leaf-fc leaf--3-fc"></div></div>
    </div>

    <div class="long-g-fc long-g--5-fc">
      <div class="grow-ans-fc" style="--d:4s"><div class="leaf-fc leaf--0-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.2s"><div class="leaf-fc leaf--1-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3s"><div class="leaf-fc leaf--2-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.6s"><div class="leaf-fc leaf--3-fc"></div></div>
    </div>

    <div class="long-g-fc long-g--6-fc">
      <div class="grow-ans-fc" style="--d:4.2s"><div class="leaf-fc leaf--0-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.4s"><div class="leaf-fc leaf--1-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.6s"><div class="leaf-fc leaf--2-fc"></div></div>
      <div class="grow-ans-fc" style="--d:4.8s"><div class="leaf-fc leaf--3-fc"></div></div>
    </div>

    <div class="long-g-fc long-g--7-fc">
      <div class="grow-ans-fc" style="--d:3s"><div class="leaf-fc leaf--0-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.2s"><div class="leaf-fc leaf--1-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.5s"><div class="leaf-fc leaf--2-fc"></div></div>
      <div class="grow-ans-fc" style="--d:3.6s"><div class="leaf-fc leaf--3-fc"></div></div>
    </div>
  </div>
`;

const heartPath =
  "M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z";

export default function FloresCorazonesTemplate({ data }) {
  const nombre = data?.nombre || "María";
  const mensaje = data?.mensaje || "";
  const audioSrc = data?.musica || Song;
  const [showScene, setShowScene] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const nombreChars = useMemo(() => Array.from(String(nombre).toUpperCase()), [nombre]);

  useEffect(() => {
    if (!showScene) return;

    const timer = window.setTimeout(() => {
      setAnimationsReady(true);
    }, 40);

    return () => window.clearTimeout(timer);
  }, [showScene]);

  const handleEnter = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
    setShowScene(true);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <>
    <main className="fc-template-fc">
      <audio ref={audioRef} src={audioSrc} loop preload="none" />
      {!showScene ? (
        <section className="fc-intro-fc">
          <img className="img-fc" src={cajitaImage} alt="Caja de regalo" />

          

          <div className="greetings-fc greetings--name-fc">
            {nombreChars.map((char, index) => (
              <span key={`${char}-${index}`}>{char === " " ? "\u00A0" : char}</span>
            ))}
          </div>

          <div className="description-fc">
            <span>&quot;Tengo algo especial para tí, espero que te guste.&quot;</span>
          </div>

          <div className="button-fc">
            <button type="button" onClick={handleEnter}>
              Entrar
            </button>
          </div>
        </section>
      ) : (
        <section className={`fc-scene-fc ${animationsReady ? "" : "container-fc"}`}>
          <div dangerouslySetInnerHTML={{ __html: flowersSceneMarkup }} />

          <div className="fc-overlay-fc">
            <div className="fc-overlay-name-fc">
              {nombreChars.map((char, index) => (
                <span key={`${char}-${index}`}>{char === " " ? " " : char}</span>
              ))}
            </div>
            {mensaje && <p className="fc-overlay-msg-fc">{mensaje}</p>}
          </div>

          <div className="bubbles-fc">
            {Array.from({ length: 20 }).map((_, index) => (
              <div className="bubble-fc" key={index}>
                <svg className="heart-fc" viewBox="0 0 32 32" aria-hidden="true">
                  <title>heart22</title>
                  <path d={heartPath} />
                </svg>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`fc-audio-btn-fc${isPlaying ? " fc-audio-btn--on-fc" : ""}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 3.5L20 12 6 20.5V3.5z" />
              </svg>
            )}
          </button>
        </section> 
      )}
    </main>
    </>
  );
}