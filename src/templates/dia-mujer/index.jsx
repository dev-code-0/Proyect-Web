import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import IconoSobre from "./icoCarta.svg";
import IconoMujer from "./icoMujer.svg";
import Imagen1 from "./images/foto1.jpeg";
import Imagen2 from "./images/foto2.jpeg";
import Imagen3 from "./images/foto3.jpeg";
import ILOVEYOUSO from "./song/I-love-you-so.mp3";
import usePreloadImages from '../../hooks/usePreloadImages'; // Ajusta la ruta según dónde estés
import LogoMovie from "./movie.svg";

export default function DiaMujerTemplate({ data }) {
  // Datos dinámicos (si no hay, usamos valores por defecto para la previsualización)
  const nombre = data?.nombre || "Maria";
  const misFotos = data?.fotos && data.fotos.length > 0 ? data.fotos : [Imagen1, Imagen2, Imagen3];
  const srcMusica = data?.musica || data?.audio || data?.cancion || ILOVEYOUSO; // Aquí iría tu I-love-you-so.mp3 si lo pones en la carpeta public
        
  usePreloadImages(misFotos); //Cargar las fotos al entrar a la página

  // Estados que reemplazan a los document.getElementById
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [mostrarCarrusel, setMostrarCarrusel] = useState(false);
  const [indiceFoto, setIndiceFoto] = useState(0);

  const audioRef = useRef(null);
  const intervaloCarrusel = useRef(null);



 // 1. Lógica del Sobre
  const abrirSobre = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setSobreAbierto(true);
  };

  // 2. Lógica del Carrusel y Música
  const iniciarCarrusel = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    setMostrarCarrusel(true);
    setIndiceFoto(0);

    if (audioRef.current && srcMusica) {
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Audio bloqueado", e));
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

    // Fade out del audio
    if (audioRef.current && srcMusica) {
      let fadeAudio = setInterval(() => {
        if (audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeAudio);
          audioRef.current.pause();
        }
      }, 100);
    }

    setTimeout(() => {
      setMostrarCarrusel(false);
    }, 1000);
  };

  // Limpiar el intervalo si el componente se desmonta
  useEffect(() => {
    return () => clearInterval(intervaloCarrusel.current);
  }, []);

  return (
    <div className="template-wrapper-dia-mujer">
      {/* PANTALLA SOBRE */}
      <div
        className={`pantalla-completa ${sobreAbierto ? "sobre-abierto" : ""}`}
        id="sobre-pantalla"
        onClick={abrirSobre}
      >
        <div className="sobre-contenido pulse" >
          <span className="icono-sobre">
            {/* Importar el svg aqui */}
            <img src={IconoSobre} alt="" />
          </span>
          <p className="txt">Tienes una sorpresa...</p>
          <p className="txt toque-texto">Toca para abrir</p>
        </div>
      </div>

      {/* CARTA PRINCIPAL */}
      <main id="carta-principal" className={!sobreAbierto ? "oculto" : ""}>
        {srcMusica && <audio ref={audioRef} src={srcMusica} loop />}

        <h1 className="anim-cascada">El 8 de Marzo...</h1>
        <p className="subtitulo anim-cascada c1">Es Memoria y Gratitud.</p>

        <div
          className="ilustracion anim-respiracion c2"
          style={{ fontSize: "4rem", margin: "20px 0" }}
        >
          {/* PEGA AQUÍ TU SVG DE LA ILUSTRACIÓN */}
          <img src={IconoMujer} alt="Ilustración" />
        </div>

        <p className="texto-poema anim-cascada c2">
          Es el eco suave de mujeres
          <br />
          valientes que abrieron caminos
          <br />
          <br />
          para que hoy puedas
          <br />
          elegir el tuyo.
        </p>

        <p className="texto-poema anim-cascada c3">
          Siento orgullo de caminar a tu lado, <strong>{nombre}</strong>,<br />
          de tu fuerza serena y de esa luz
          <br />
          que transforma todo cuanto toca.
        </p>

        <p className="texto-poema cita anim-cascada c3">
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

        <div
          id="btn-play"
          className="anim-cascada pulse-suave c3"
          onClick={iniciarCarrusel}
        >
          {/* Cambia esto por tu imagen de video si la tienes en la carpeta public */}
          <div
            style={{
              padding: "10px 20px",
              borderRadius: "15px",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img className="imagen-logo" src={LogoMovie} alt="" />
          </div>
        </div>
      </main>

      {/* CARRUSEL */}
      {mostrarCarrusel && (
        <div id="carrusel-lightbox" className="pantalla-completa">
          {/* NUEVO BOTÓN DE CERRAR AQUÍ */}
          <div className="btn-cerrar-carrusel" onClick={terminarCarrusel}>
            ✖
          </div>
          <img
            id="foto-actual"
            src={misFotos[indiceFoto]}
            alt="Recuerdo"
            className="zoom-foto"
            key={indiceFoto} // Obliga a React a reiniciar la animación al cambiar la foto
          />
          {indiceFoto === misFotos.length - 1 && (
            <p id="texto-foto" className="anim-cascada">
              Gracias por ser tú
            </p>
          )}
        </div>
      )}
    </div>
  );
}
