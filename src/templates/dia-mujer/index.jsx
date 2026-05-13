import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import IconoSobre from "./icoCarta.svg";
import IconoMujer from "./icoMujer.svg";
import Imagen1 from "./images/foto1.jpeg";
import Imagen2 from "./images/foto2.jpeg";
import Imagen3 from "./images/foto3.jpeg";
import ILOVEYOUSO from "./song/I-love-you-so.mp3";
import usePreloadImages from "../../hooks/usePreloadImages";

export default function DiaMujerTemplate({ data, isPreview }) {
  const nombre = data?.nombre || "María";
  const mensaje = data?.mensaje || null;
  const misFotos =
    data?.fotos?.length > 0 ? data.fotos : [Imagen1, Imagen2, Imagen3];
  const srcMusica = data?.musica || data?.audio || data?.cancion || ILOVEYOUSO;

  usePreloadImages(misFotos);

  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false);
  const [indiceFoto, setIndiceFoto] = useState(0);

  const audioRef = useRef(null);
  const intervaloCarrusel = useRef(null);

  const abrirSobre = async () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setSobreAbierto(true);
    if (!isPreview) {
      try {
        const { default: confetti } = await import("canvas-confetti");
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ["#c084fc", "#f0abfc", "#e879f9", "#d8b4fe", "#fce7f3", "#f9a8d4"],
          shapes: ["circle"],
          scalar: 0.9,
          gravity: 0.6,
          drift: 0.3,
        });
      } catch {}
    }
  };

  const iniciarCarrusel = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setMostrarCarrusel(true);
    setIndiceFoto(0);

    if (audioRef.current && srcMusica) {
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    intervaloCarrusel.current = setInterval(() => {
      setIndiceFoto((prev) => {
        if (prev + 1 >= misFotos.length) {
          terminarCarrusel();
          return prev;
        }
        return prev + 1;
      });
    }, 4000);
  };

  const terminarCarrusel = () => {
    clearInterval(intervaloCarrusel.current);

    if (audioRef.current) {
      const fadeAudio = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeAudio);
          if (audioRef.current) audioRef.current.pause();
        }
      }, 100);
    }

    setTimeout(() => setMostrarCarrusel(false), 1000);
  };

  useEffect(() => {
    return () => clearInterval(intervaloCarrusel.current);
  }, []);

  return (
    <div className="template-wrapper-dm">
      {/* PANTALLA SOBRE */}
      <div
        className={`pantalla-completa-dm${sobreAbierto ? " sobre-abierto-dm" : ""}`}
        onClick={abrirSobre}
      >
        <div className="sobre-contenido-dm pulse-dm">
          <span className="icono-sobre-dm">
            <img src={IconoSobre} alt="" />
          </span>
          <p className="txt-dm">Alguien quiere celebrarte</p>
          <p className="txt-dm toque-texto-dm">Toca para abrir</p>
        </div>
      </div>

      {/* CARTA PRINCIPAL — se monta solo cuando el sobre se abre */}
      {sobreAbierto && (
        <main id="carta-principal-dm">
          {srcMusica && (
            <audio ref={audioRef} src={srcMusica} loop preload="none" />
          )}

          <h1 className="anim-cascada-dm">Para ti...</h1>
          <p className="subtitulo-dm anim-cascada-dm c1-dm">
            Porque no hace falta el 8 de marzo para celebrarte.
          </p>

          <div className="ilustracion-marco-dm anim-respiracion-dm c2-dm">
            <img src={IconoMujer} alt="Ilustración" />
          </div>

          <p className="texto-poema-dm anim-cascada-dm c2-dm">
            No hay que esperar una fecha
            <br />
            para recordar lo que vales.
            <br />
            <br />
            Cada día que caminas
            <br />
            dejas huella donde pasas.
          </p>

          {mensaje ? (
            <p className="texto-poema-dm mensaje-personal-dm anim-cascada-dm c3-dm">
              {mensaje}
            </p>
          ) : (
            <p className="texto-poema-dm anim-cascada-dm c3-dm">
              Siento orgullo de caminar a tu lado,{" "}
              <strong>{nombre}</strong>,<br />
              de tu fuerza serena y de esa luz
              <br />
              que transforma todo cuanto toca.
            </p>
          )}

          <p className="texto-poema-dm cita-dm anim-cascada-dm c3-dm">
            Porque..
            <br />
            "No se nace mujer,
            <br />
            se llega a serlo".
            <br />
            <br />
            Y tú lo eres en la forma
            <br />
            más hermosa.
          </p>

          <button
            className="btn-carrusel-dm"
            onClick={iniciarCarrusel}
            aria-label="Ver fotos"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 1.5L12.5 7L3 12.5V1.5Z" fill="currentColor" />
            </svg>
            Ver fotos
          </button>
        </main>
      )}

      {/* CARRUSEL */}
      {mostrarCarrusel && (
        <div id="carrusel-lightbox-dm" className="pantalla-completa-dm">
          <button
            className="btn-cerrar-carrusel-dm"
            onClick={terminarCarrusel}
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <span className="carrusel-contador-dm">
            {indiceFoto + 1} / {misFotos.length}
          </span>

          <img
            src={misFotos[indiceFoto]}
            alt="Recuerdo"
            className="zoom-foto-dm"
            key={indiceFoto}
          />

          {indiceFoto === misFotos.length - 1 && (
            <p className="texto-final-carrusel-dm anim-cascada-dm">
              Gracias por ser tú, <strong>{nombre}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
