import React, { useEffect, useMemo, useState } from "react";
import cajitaImage from "./cajita.webp";
import "./flores-corazones.css";

const flowersSceneMarkup = `
  <div class="night"></div>
  <div class="flowers">
    <div class="flower flower--1">
      <div class="flower__leafs flower__leafs--1">
        <div class="flower__leaf flower__leaf--1"></div>
        <div class="flower__leaf flower__leaf--2"></div>
        <div class="flower__leaf flower__leaf--3"></div>
        <div class="flower__leaf flower__leaf--4"></div>
        <div class="flower__white-circle"></div>

        <div class="flower__light flower__light--1"></div>
        <div class="flower__light flower__light--2"></div>
        <div class="flower__light flower__light--3"></div>
        <div class="flower__light flower__light--4"></div>
        <div class="flower__light flower__light--5"></div>
        <div class="flower__light flower__light--6"></div>
        <div class="flower__light flower__light--7"></div>
        <div class="flower__light flower__light--8"></div>
      </div>
      <div class="flower__line">
        <div class="flower__line__leaf flower__line__leaf--1"></div>
        <div class="flower__line__leaf flower__line__leaf--2"></div>
        <div class="flower__line__leaf flower__line__leaf--3"></div>
        <div class="flower__line__leaf flower__line__leaf--4"></div>
        <div class="flower__line__leaf flower__line__leaf--5"></div>
        <div class="flower__line__leaf flower__line__leaf--6"></div>
      </div>
    </div>

    <div class="flower flower--2">
      <div class="flower__leafs flower__leafs--2">
        <div class="flower__leaf flower__leaf--1"></div>
        <div class="flower__leaf flower__leaf--2"></div>
        <div class="flower__leaf flower__leaf--3"></div>
        <div class="flower__leaf flower__leaf--4"></div>
        <div class="flower__white-circle"></div>

        <div class="flower__light flower__light--1"></div>
        <div class="flower__light flower__light--2"></div>
        <div class="flower__light flower__light--3"></div>
        <div class="flower__light flower__light--4"></div>
        <div class="flower__light flower__light--5"></div>
        <div class="flower__light flower__light--6"></div>
        <div class="flower__light flower__light--7"></div>
        <div class="flower__light flower__light--8"></div>
      </div>
      <div class="flower__line">
        <div class="flower__line__leaf flower__line__leaf--1"></div>
        <div class="flower__line__leaf flower__line__leaf--2"></div>
        <div class="flower__line__leaf flower__line__leaf--3"></div>
        <div class="flower__line__leaf flower__line__leaf--4"></div>
      </div>
    </div>

    <div class="flower flower--3">
      <div class="flower__leafs flower__leafs--3">
        <div class="flower__leaf flower__leaf--1"></div>
        <div class="flower__leaf flower__leaf--2"></div>
        <div class="flower__leaf flower__leaf--3"></div>
        <div class="flower__leaf flower__leaf--4"></div>
        <div class="flower__white-circle"></div>

        <div class="flower__light flower__light--1"></div>
        <div class="flower__light flower__light--2"></div>
        <div class="flower__light flower__light--3"></div>
        <div class="flower__light flower__light--4"></div>
        <div class="flower__light flower__light--5"></div>
        <div class="flower__light flower__light--6"></div>
        <div class="flower__light flower__light--7"></div>
        <div class="flower__light flower__light--8"></div>
      </div>
      <div class="flower__line">
        <div class="flower__line__leaf flower__line__leaf--1"></div>
        <div class="flower__line__leaf flower__line__leaf--2"></div>
        <div class="flower__line__leaf flower__line__leaf--3"></div>
        <div class="flower__line__leaf flower__line__leaf--4"></div>
      </div>
    </div>

    <div class="flower flower--4">
      <div class="flower__leafs flower__leafs--3">
        <div class="flower__leaf flower__leaf--1"></div>
        <div class="flower__leaf flower__leaf--2"></div>
        <div class="flower__leaf flower__leaf--3"></div>
        <div class="flower__leaf flower__leaf--4"></div>
        <div class="flower__white-circle"></div>

        <div class="flower__light flower__light--1"></div>
        <div class="flower__light flower__light--2"></div>
        <div class="flower__light flower__light--3"></div>
        <div class="flower__light flower__light--4"></div>
        <div class="flower__light flower__light--5"></div>
        <div class="flower__light flower__light--6"></div>
        <div class="flower__light flower__light--7"></div>
        <div class="flower__light flower__light--8"></div>
      </div>
      <div class="flower__line">
        <div class="flower__line__leaf flower__line__leaf--1"></div>
        <div class="flower__line__leaf flower__line__leaf--2"></div>
        <div class="flower__line__leaf flower__line__leaf--3"></div>
        <div class="flower__line__leaf flower__line__leaf--4"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:1.2s">
      <div class="flower__g-long">
        <div class="flower__g-long__top"></div>
        <div class="flower__g-long__bottom"></div>
      </div>
    </div>

    <div class="growing-grass">
      <div class="flower__grass flower__grass--1">
        <div class="flower__grass--top"></div>
        <div class="flower__grass--bottom"></div>
        <div class="flower__grass__leaf flower__grass__leaf--1"></div>
        <div class="flower__grass__leaf flower__grass__leaf--2"></div>
        <div class="flower__grass__leaf flower__grass__leaf--3"></div>
        <div class="flower__grass__leaf flower__grass__leaf--4"></div>
        <div class="flower__grass__leaf flower__grass__leaf--5"></div>
        <div class="flower__grass__leaf flower__grass__leaf--6"></div>
        <div class="flower__grass__leaf flower__grass__leaf--7"></div>
        <div class="flower__grass__leaf flower__grass__leaf--8"></div>
        <div class="flower__grass__overlay"></div>
      </div>
    </div>

    <div class="growing-grass">
      <div class="flower__grass flower__grass--2">
        <div class="flower__grass--top"></div>
        <div class="flower__grass--bottom"></div>
        <div class="flower__grass__leaf flower__grass__leaf--1"></div>
        <div class="flower__grass__leaf flower__grass__leaf--2"></div>
        <div class="flower__grass__leaf flower__grass__leaf--3"></div>
        <div class="flower__grass__leaf flower__grass__leaf--4"></div>
        <div class="flower__grass__leaf flower__grass__leaf--5"></div>
        <div class="flower__grass__leaf flower__grass__leaf--6"></div>
        <div class="flower__grass__leaf flower__grass__leaf--7"></div>
        <div class="flower__grass__leaf flower__grass__leaf--8"></div>
        <div class="flower__grass__overlay"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:2.4s">
      <div class="flower__g-right flower__g-right--1">
        <div class="leaf"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:2.8s">
      <div class="flower__g-right flower__g-right--2">
        <div class="leaf"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:2.8s">
      <div class="flower__g-front">
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--1">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--2">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--3">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--4">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--5">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--6">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--7">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--8">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__line"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:3.2s">
      <div class="flower__g-fr">
        <div class="leaf"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--1"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--2"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--3"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--4"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--5"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--6"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--7"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--8"></div>
      </div>
    </div>

    <div class="long-g long-g--0">
      <div class="grow-ans" style="--d:3s"><div class="leaf leaf--0"></div></div>
      <div class="grow-ans" style="--d:2.2s"><div class="leaf leaf--1"></div></div>
      <div class="grow-ans" style="--d:3.4s"><div class="leaf leaf--2"></div></div>
      <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
    </div>

    <div class="long-g long-g--1">
      <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--0"></div></div>
      <div class="grow-ans" style="--d:3.8s"><div class="leaf leaf--1"></div></div>
      <div class="grow-ans" style="--d:4s"><div class="leaf leaf--2"></div></div>
      <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--3"></div></div>
    </div>

    <div class="long-g long-g--2">
      <div class="grow-ans" style="--d:4s"><div class="leaf leaf--0"></div></div>
      <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--1"></div></div>
      <div class="grow-ans" style="--d:4.4s"><div class="leaf leaf--2"></div></div>
      <div class="grow-ans" style="--d:4.6s"><div class="leaf leaf--3"></div></div>
    </div>

    <div class="long-g long-g--3">
      <div class="grow-ans" style="--d:4s"><div class="leaf leaf--0"></div></div>
      <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--1"></div></div>
      <div class="grow-ans" style="--d:3s"><div class="leaf leaf--2"></div></div>
      <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
    </div>

    <div class="long-g long-g--4">
      <div class="grow-ans" style="--d:4s"><div class="leaf leaf--0"></div></div>
      <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--1"></div></div>
      <div class="grow-ans" style="--d:3s"><div class="leaf leaf--2"></div></div>
      <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
    </div>

    <div class="long-g long-g--5">
      <div class="grow-ans" style="--d:4s"><div class="leaf leaf--0"></div></div>
      <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--1"></div></div>
      <div class="grow-ans" style="--d:3s"><div class="leaf leaf--2"></div></div>
      <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
    </div>

    <div class="long-g long-g--6">
      <div class="grow-ans" style="--d:4.2s"><div class="leaf leaf--0"></div></div>
      <div class="grow-ans" style="--d:4.4s"><div class="leaf leaf--1"></div></div>
      <div class="grow-ans" style="--d:4.6s"><div class="leaf leaf--2"></div></div>
      <div class="grow-ans" style="--d:4.8s"><div class="leaf leaf--3"></div></div>
    </div>

    <div class="long-g long-g--7">
      <div class="grow-ans" style="--d:3s"><div class="leaf leaf--0"></div></div>
      <div class="grow-ans" style="--d:3.2s"><div class="leaf leaf--1"></div></div>
      <div class="grow-ans" style="--d:3.5s"><div class="leaf leaf--2"></div></div>
      <div class="grow-ans" style="--d:3.6s"><div class="leaf leaf--3"></div></div>
    </div>
  </div>
`;

const heartPath =
  "M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z";

export default function FloresCorazonesTemplate({ data }) {
  const nombre = data?.nombre || "María";
  const [showScene, setShowScene] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);

  const nombreChars = useMemo(() => Array.from(String(nombre).toUpperCase()), [nombre]);

  useEffect(() => {
    if (!showScene) return;

    const timer = window.setTimeout(() => {
      setAnimationsReady(true);
    }, 40);

    return () => window.clearTimeout(timer);
  }, [showScene]);

  return (
    <main className="fc-template">
      {!showScene ? (
        <section className="fc-intro">
          <img className="img" src={cajitaImage} alt="Caja de regalo" />

          

          <div className="greetings greetings--name">
            {nombreChars.map((char, index) => (
              <span key={`${char}-${index}`}>{char === " " ? "\u00A0" : char}</span>
            ))}
          </div>

          <div className="description">
            <span>&quot;Tengo algo especial para tí, espero que te guste.&quot;</span>
          </div>

          <div className="button">
            <button type="button" onClick={() => setShowScene(true)}>
              Entrar
            </button>
          </div>
        </section>
      ) : (
        <section className={`fc-scene ${animationsReady ? "" : "container"}`}>
          <div dangerouslySetInnerHTML={{ __html: flowersSceneMarkup }} />

          <div className="bubbles">
            {Array.from({ length: 20 }).map((_, index) => (
              <div className="bubble" key={index}>
                <svg className="heart" viewBox="0 0 32 32" aria-hidden="true">
                  <title>heart22</title>
                  <path d={heartPath} />
                </svg>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}