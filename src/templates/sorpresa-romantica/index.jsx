import React, { useState, useRef, useEffect } from "react";
import './style.css'
import usePreloadImages from "../../hooks/usePreloadImages";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Image1 from './Images/Image1.avif'
import Image2 from './Images/Image2.avif'
import Image3 from './Images/Image3.avif'
import Image4 from './Images/Image4.avif'
import Song from './song.mp3'

// Renderiza texto con saltos de línea de forma segura
const TextWithLineBreaks = ({ text }) => {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
};

export default function App({ data }) {
  /* ================= CONFIGURACIÓN DE PROPS (DATA) ================= */
  const nombre = data?.nombre || "Mi Amor";
  const dateUser = data?.fecha || "2025-12-25T00:00:00";
  /* ================= PROCESAMIENTO DE FOTOS ================= */
  /* ================= PROCESAMIENTO DE FOTOS ================= */
  const procesarFotos = (fotos) => {
    // 1. Definimos las fotos base (las del usuario o las de por defecto)
    const baseFotos = (!fotos || fotos.length === 0)
      ? [
          Image1,
          Image2,
          Image3,
          Image4
        ]
      : fotos;

    // 2. Multiplicamos dinámicamente hasta tener un mínimo de 10 fotos.
    // Esto asegura que el Coverflow 3D siempre tenga elementos de sobra a los lados.
    let fotosExpandidas = [...baseFotos];
    while (fotosExpandidas.length < 10) {
      fotosExpandidas = [...fotosExpandidas, ...baseFotos];
    }

    return fotosExpandidas;
  };

  const misFotos = procesarFotos(data?.fotos);

        usePreloadImages(misFotos); // Pre-cargar las fotos para que el carrusel sea fluido al abrirse

  const srcMusica =
    data?.audio ||Song;
    const texto = data?.carta || 'He diseñado este pequeño espacio pensando en la paz y la felicidad que me das todos los días. Quería crear un rincón tranquilo y hermoso, exactamente como se siente estar a tu lado.\n\nCada uno de estos pétalos representa un momento único que hemos compartido. Nuestro tiempo juntos es mi mayor tesoro, lleno de risas y un amor que crece cada segundo.\n\nPrometo cuidarte y elegirte todos los días. Eres mi inspiración constante.\n\nTe amo con el alma entera.';
  const textoCarta =
    data?.carta ||
    `Hola,  ${nombre}.\n\n ${texto}`;

  const mensajesFlotantes = [
    { title: "Te quiero", sub: "Más que ayer, menos que mañana." },
    { title: "Mi Destino", sub: "Cada día te elijo a ti." },
    { title: "Magia Pura", sub: "Juntos es mi lugar feliz." },
    { title: "Mi Sonrisa", sub: "Gracias por existir." },
  ];

  /* ================= ESTADOS ================= */
  const [isStarted, setIsStarted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });
  const [msgIndex, setMsgIndex] = useState(0);
  const [isMsgActive, setIsMsgActive] = useState(true);
  const [typewriterText, setTypewriterText] = useState("");

  /* ================= REFERENCIAS ================= */
  const audioRef = useRef(null);
  const treeTrunkRef = useRef(null);
  const treeCanopyRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const petalDropIntervalRef = useRef(null);
  const swiperInstanceRef = useRef(null);

  /* ================= EFECTOS (LÓGICA) ================= */

  // 1. Inyectar fuentes de Google al montar
  useEffect(() => {
    const linkFonts = document.createElement("link");
    linkFonts.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Alex+Brush&display=swap";
    linkFonts.rel = "stylesheet";
    document.head.appendChild(linkFonts);

    return () => {
      document.head.removeChild(linkFonts);
    };
  }, []);

  // 2. Contador de tiempo
  useEffect(() => {
    if (!isStarted) return;
    const updateTimer = () => {
      const diff = new Date() - new Date(dateUser);
      setTimer({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, "0"),
        mins: Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, "0"),
        secs: Math.floor((diff / 1000) % 60).toString().padStart(2, "0"),
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isStarted, dateUser]);

  // 3. Textos cinemáticos dinámicos
  useEffect(() => {
    if (!isStarted) return;
    const cycleText = () => {
      setIsMsgActive(false);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % mensajesFlotantes.length);
        setIsMsgActive(true);
      }, 1200);
    };
    const interval = setInterval(cycleText, 6000);
    return () => clearInterval(interval);
  }, [isStarted, mensajesFlotantes.length]);

  // 4. Lógica del Árbol de Cerezo (Vanilla DOM)
  useEffect(() => {
    if (!isStarted || !treeTrunkRef.current || !treeCanopyRef.current) return;

    treeTrunkRef.current.classList.add("grown-sr");

    const createCanopy = setTimeout(() => {
      const numPetals = 450;
      // Colores Hexadecimales puros
      const petalColors = ["#ffb3c6", "#ffc2d1", "#ff8fab", "#fb6f92", "#ffe5ec", "#ffffff"];
      const clusters = [
        { cx: 160, cy: 90, rx: 110, ry: 75 },
        { cx: 90, cy: 150, rx: 80, ry: 60 },
        { cx: 230, cy: 150, rx: 80, ry: 60 },
        { cx: 160, cy: 180, rx: 100, ry: 60 },
      ];

      for (let i = 0; i < numPetals; i++) {
        const cluster = clusters[Math.floor(Math.random() * clusters.length)];
        const t = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());

        const finalX = cluster.cx + cluster.rx * r * Math.cos(t);
        const finalY = cluster.cy + cluster.ry * r * Math.sin(t);
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];
        const scale = Math.random() * 0.7 + 0.5;
        const rot = Math.random() * 360;

        const petal = document.createElement("div");
        petal.className = "sakura-petal-sr";
        petal.style.backgroundColor = color;
        const baseSize = Math.random() * 5 + 9;
        petal.style.width = `${baseSize}px`;
        petal.style.height = `${baseSize}px`;

        treeCanopyRef.current.appendChild(petal);

        setTimeout(() => {
          petal.style.transform = `translate(${finalX}px, ${finalY}px) scale(${scale}) rotate(${rot}deg)`;
          petal.classList.add("fly-sr");
        }, Math.random() * 2000);
      }

      petalDropIntervalRef.current = setInterval(() => {
        if (!treeCanopyRef.current) return;
        const petals = treeCanopyRef.current.querySelectorAll(".sakura-petal-sr.fly-sr:not(.falling-petal-sr)");
        if (petals.length === 0) return;

        const originalPetal = petals[Math.floor(Math.random() * petals.length)];
        const fallingClone = originalPetal.cloneNode(true);
        fallingClone.className = "falling-petal-sr";
        fallingClone.style.backgroundColor = originalPetal.style.backgroundColor;

        const rect = originalPetal.getBoundingClientRect();
        const canopyRect = treeCanopyRef.current.getBoundingClientRect();
        const startX = rect.left - canopyRect.left + rect.width / 2;
        const startY = rect.top - canopyRect.top + rect.height / 2;

        fallingClone.style.setProperty("--startX", `${startX}px`);
        fallingClone.style.setProperty("--startY", `${startY}px`);
        fallingClone.style.setProperty("--startRot", `${Math.random() * 360}deg`);
        fallingClone.style.setProperty("--scale", `${Math.random() * 0.5 + 0.4}`);

        const drift = Math.random() * 100 + 30;
        fallingClone.style.setProperty("--drift", `${Math.random() > 0.5 ? drift : -drift}px`);
        fallingClone.style.setProperty("--fall-duration", `${Math.random() * 3 + 4}s`);
        fallingClone.style.transform = "none";

        treeCanopyRef.current.appendChild(fallingClone);
        setTimeout(() => fallingClone.remove(), 7000);
      }, 400);

    }, 1000);

    return () => {
      clearTimeout(createCanopy);
      clearInterval(petalDropIntervalRef.current);
    };
  }, [isStarted]);

  // 5. Inicializar Swiper y la Máquina de escribir
  useEffect(() => {
    if (isModalOpen) {
      setTypewriterText("");
      let i = 0;
      clearInterval(typingIntervalRef.current);

      typingIntervalRef.current = setInterval(() => {
        if (i < textoCarta.length) {
          const char = textoCarta.charAt(i);
          setTypewriterText((prev) => prev + char);
          i++;
        } else {
          clearInterval(typingIntervalRef.current);
        }
      }, 35);

      const initTimer = setTimeout(() => {
        swiperInstanceRef.current = new Swiper(".swiper-sr", {
          effect: "coverflow",
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: "auto",
          spaceBetween: 15,
          loop: true,
          observer: true,
          observeParents: true,
          autoplay: { delay: 2000, disableOnInteraction: false,},
          coverflowEffect: {
            rotate: 35,
            stretch: 0,
            depth: 150,
            modifier: 1,
            slideShadows: true,
          },
          pagination: { el: ".swiper-pagination-sr", dynamicBullets: true },
        });
      }, 100);

      return () => clearTimeout(initTimer);

    } else {
      clearInterval(typingIntervalRef.current);
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    }
  }, [isModalOpen, textoCarta]);

  /* ================= MANEJADORES ================= */
  const handleStart = () => {
    setIsStarted(true);
    if (!isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(() => console.log("Autoplay bloqueado"));
      setIsMusicPlaying(true);
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };



  return (
    <div className="app-container-sr">


      {/* Luces Ambientales */}
      <div className="ambient-light-sr light-1-sr"></div>
      <div className="ambient-light-sr light-2-sr"></div>
      <div className="ambient-light-sr light-3-sr"></div>

      <audio ref={audioRef} src={srcMusica} loop />

      {/* Botón de Música */}
      <button onClick={toggleMusic} className={`music-btn-sr glass-premium-sr ${isMusicPlaying ? "music-on-sr" : "music-off-sr"}`}>
        <svg className="music-icon-sr" viewBox="0 0 20 20">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.236l8-1.6V11.114A4.369 4.369 0 0015 11c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
        </svg>
      </button>

      {/* PANTALLA INICIAL*/}
      <div className={`screen-sr screen-initial-sr ${isStarted ? "is-hidden-sr" : "is-visible-sr"}`}>
        <div className="glass-premium-sr initial-card-sr">
          <h1 className="font-serif-sr initial-title-sr">Para {nombre}</h1>
          <p className="initial-subtitle-sr">Toca para comenzar</p>
          <button onClick={handleStart} className="start-btn-sr start-btn-layout-sr">
            <svg className="start-icon-sr" viewBox="0 0 32 29.6">
              <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
            </svg>
          </button>
        </div>
      </div>

      {/*ESCENA PRINCIPAL  */}
      <div className={`screen-sr screen-main-sr ${isStarted ? "is-visible-sr" : "is-hidden-sr"}`}>

        {/* Textos Cinematográficos */}
        <div className="text-container-sr">
          <div className={`cinematic-fade-sr ${isMsgActive ? "active-sr" : ""}`}>
            <span className="font-script-sr text-gradient-sr msg-title-sr">
              {mensajesFlotantes[msgIndex].title}
            </span>
            <span className="font-serif-sr msg-sub-sr">
              {mensajesFlotantes[msgIndex].sub}
            </span>
          </div>
        </div>

        {/* El Árbol */}
        <div className="tree-container-sr">
          <div ref={treeCanopyRef} className="tree-canopy-sr"></div>
          <svg ref={treeTrunkRef} id="tree-trunk-sr" viewBox="0 0 200 250" className="tree-svg-sr">
            <defs>
              <linearGradient id="trunkGrad-sr" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#4a2c15", stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: "#704214", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#3e2723", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="url(#trunkGrad-sr)"
              d="M85,250 C85,200 95,160 70,110 C60,90 40,80 20,70 C40,80 60,100 75,120 C80,90 75,60 60,30 C75,50 85,75 90,105 C100,70 110,40 130,20 C120,50 110,80 105,110 C125,95 150,80 170,70 C150,85 125,110 115,130 C125,170 115,210 115,250 Z"
            />
          </svg>
        </div>

        {/* Dock Inferior */}
        <div className={`glass-premium-sr bottom-dock-sr ${isStarted ? "is-active-sr" : ""}`}>
          <p className="font-serif-sr dock-title-sr">Nuestro Tiempo Mágico</p>
          <div className="timer-row-sr">
            <div className="time-block-sr">
              <span className="time-value-sr text-gradient-sr font-serif-sr">{timer.days}</span>
              <span className="time-label-sr">Días</span>
            </div>
            <span className="timer-sep-sr">:</span>
            <div className="time-block-sr">
              <span className="time-value-sr text-gradient-sr font-serif-sr">{timer.hours}</span>
              <span className="time-label-sr">Hrs</span>
            </div>
            <span className="timer-sep-sr">:</span>
            <div className="time-block-sr">
              <span className="time-value-sr text-gradient-sr font-serif-sr">{timer.mins}</span>
              <span className="time-label-sr">Min</span>
            </div>
            <span className="timer-sep-sr">:</span>
            <div className="time-block-sr">
              <span className="time-value-sr text-gradient-sr font-serif-sr">{timer.secs}</span>
              <span className="time-label-sr">Seg</span>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-premium-sr carta-btn-sr">
            <svg className="carta-btn-icon-sr" fill="currentColor" viewBox="0 0 32 29.6">
              <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" />
            </svg>
            <span className="carta-btn-text-sr">Ver Sorpresa</span>
          </button>
        </div>
      </div>

      {/* ================= MODAL DE LA CARTA Y CARRUSEL ================= */}
      <div className={`modal-overlay-sr ${isModalOpen ? "modal-open-sr" : "modal-closed-sr"}`}>
        <div className="glass-premium-sr modal-content-sr">
          <button onClick={() => setIsModalOpen(false)} className="modal-close-btn-sr">
            <svg className="close-icon-sr" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div className="modal-scroll-area-sr">
            {/* Sección Superior: Swiper 3D */}
            <div className="modal-top-section-sr">
              <div className="modal-bg-gradient-sr"></div>
              <div className="modal-bg-glow-sr"></div>

              {isModalOpen && (
                <div className="swiper swiper-sr">
                  <div className="swiper-wrapper">
                    {misFotos.map((foto, index) => (
                      <div key={index} className="swiper-slide custom-slide-sr">
                        <div className="custom-slide-img-container-sr">
                          <img src={foto} loading="eager" className="custom-slide-img-sr" alt={`Recuerdo ${index + 1}`} />
                        </div>
                        {/* Se puede dejar en blanco o poner un texto por cada foto */}
                      </div>
                    ))}
                  </div>
                  <div className="swiper-pagination swiper-pagination-sr"></div>
                </div>
              )}
            </div>

            {/* Sección Inferior: Texto Tipo Máquina de Escribir */}
            <div className="modal-bottom-section-sr">
              <h2 className="font-script-sr text-gradient-sr modal-title-sr">Mi lugar seguro...</h2>
              <div className="modal-text-sr"> 
                <TextWithLineBreaks text={typewriterText} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}