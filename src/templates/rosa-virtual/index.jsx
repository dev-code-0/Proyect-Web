import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './style.css';
import RosaRed from './images/rose-red.webp';

export default function RosaVirtual({ data }) {
  // 1. Extraemos los datos recibidos del primer componente
  const { 
    nombre = "María", 
    color = "red", 
    intencion = "para demostrarte mi amor", 
    mensaje = "Eres una persona muy especial para mí. ¡Espero que te guste este detalle!",
    RosaRed, // Si viene del primer componente, lo usaremos
  } = data || {};

  // 2. Mapas de colores exactos a tus diseños
  const colorMap = {
    red:    { hex: '#e23535', bg: '#ffdada', letter: '/src/templates/rosa-virtual/images/letter-red.webp',    rose: { src: RosaRed } },
    orange: { hex: '#ff9c24', bg: '#ffe3c1', letter: '/src/templates/rosa-virtual/images/letter-orange.webp', rose: '/src/templates/rosa-virtual/images/rose-orange.webp' },
    violet: { hex: '#6e16e3', bg: '#cfcee7', letter: '/src/templates/rosa-virtual/images/letter-violet.webp', rose: '/src/templates/rosa-virtual/images/rose-violet.webp' },
    yellow: { hex: '#fdd300', bg: '#fef4a7', letter: '/src/templates/rosa-virtual/images/letter-yellow.webp', rose: '/src/templates/rosa-virtual/images/rose-yellow.webp' },
    blue:   { hex: '#2d95ff', bg: '#d3ebff', letter: '/src/templates/rosa-virtual/images/letter-blue.webp',   rose: '/src/templates/rosa-virtual/images/rose-lightblue.webp' },
    white:  { hex: '#ff0000', bg: '#dcdcdc', letter: '/src/templates/rosa-virtual/images/letter-white.webp',  rose: '/src/templates/rosa-virtual/images/rose-white.webp' },
    pink:   { hex: '#ff58ac', bg: '#f0c9dc', letter: '/src/templates/rosa-virtual/images/letter-pink.webp',   rose: '/src/templates/rosa-virtual/images/rose-pink.webp' }
  };

  const theme = colorMap[color] || colorMap.orange; // Fallback a naranja por defecto
  const imagenRosa = RosaRed || theme.rose;

  // 3. Estados de la secuencia
  const [step, setStep] = useState(0); // 0=Cargando, 1=Rosa, 2=Carta
  
  // Estados Fase 0: Cargando
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [loadingFading, setLoadingFading] = useState(false);

  // Estados Fase 1: Rosa Animada
  const [roseClasses, setRoseClasses] = useState(''); 
  const [popout, setPopout] = useState(false); // Para ocultar al abrir carta
  const [shortMsgNombre, setShortMsgNombre] = useState('');
  const [shortMsgResto, setShortMsgResto] = useState('');
  const [showButton, setShowButton] = useState(false);
  const rosaRef = useRef(null);

  // Estados Fase 2: Carta
  const [cartaVisible, setCartaVisible] = useState(false);
  const [cartaImgVisible, setCartaImgVisible] = useState(false);
  const [longMsgText, setLongMsgText] = useState('');

  // ─── FASE 0: PANTALLA DE CARGA (Máquina de escribir) ────────────────────────
  useEffect(() => {
    if (step !== 0) return;

    const txt1 = "Para ";
    const txt2 = nombre;
    
    // Contadores independientes para cada parte del texto
    let i = 0;
    let j = 0;

    const typeWriter = () => {
      // 1. Primero escribe "Para " letra por letra
      if (i < txt1.length) {
        setText1(txt1.slice(0, i + 1));
        i++;
        // 👇 Velocidad para la palabra "Para " (ej: 80ms)
        setTimeout(typeWriter, 80); 
        
      // 2. Luego escribe el Nombre letra por letra
      } else if (j < txt2.length) {
        setText2(txt2.slice(0, j + 1));
        j++;
        // 👇 Velocidad para el nombre (ej: 80ms)
        setTimeout(typeWriter, 80); 
        
      // 3. Cuando termina, espera medio segundo y oculta la pantalla
      } else {
        setTimeout(() => {
          setLoadingFading(true); 
          setTimeout(() => setStep(1), 900); 
        }, 500);
      }
    };

    // Espera 1 segundo antes de empezar a escribir al cargar la página
    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, [step, nombre]);


  // ─── FASE 1: SECUENCIA DE LA ROSA ───────────────────────────────────────────
  useEffect(() => {
    if (step !== 1) return;

    // 1. Aparece el fondo y la rosa crece
    const t1 = setTimeout(() => setRoseClasses('mostrar'), 200);
    const t2 = setTimeout(() => setRoseClasses('mostrar imgshow'), 1500);
    
    // 2. Sube y comienza a levitar
    const t3 = setTimeout(() => {
      setRoseClasses('mostrar imgshow final');
    }, 2200); 

    // 3. Escribe el mensaje corto (letra por letra)
    const t4 = setTimeout(() => {
      const txtNombre = nombre;
      const txtResto = `, ${intencion}`; 
      let i = 0, j = 0;

      const typeShort = () => {
        if (i < txtNombre.length) {
          setShortMsgNombre(txtNombre.slice(0, i + 1));
          i++;
          setTimeout(typeShort, 60); // <-- Cambia este 60 si lo quieres más lento
        } else if (j < txtResto.length) {
          setShortMsgResto(txtResto.slice(0, j + 1));
          j++;
          setTimeout(typeShort, 60); // <-- Cambia este 60 también
        } else {
          // Muestra el botón cuando termina de escribir
          setTimeout(() => setShowButton(true), 350);
        }
      };
      typeShort();
    }, 4200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [step, nombre, intencion]);

  // Efecto separado para la levitación usando requestAnimationFrame
  useEffect(() => {
    let reqId;
    if (roseClasses.includes('final') && !popout) {
      let t = 0;
      const amplitud = 8;
      const velocidad = 2.3;
      
      const animate = () => {
        t += (Math.PI * 2) / (60 * velocidad);
        const y = Math.sin(t) * amplitud;
        if (rosaRef.current) {
          rosaRef.current.style.transform = `translate(-50%, ${y}px)`;
        }
        reqId = requestAnimationFrame(animate);
      };
      reqId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(reqId);
  }, [roseClasses, popout]);


  // ─── TRANSICIÓN: BOTÓN ABRIR MENSAJE ────────────────────────────────────────
  const handleAbrirCarta = () => {
    // 1. Explosión de confeti con canvas-confetti
    confetti({ 
      particleCount: 225, 
      spread: 70, 
      origin: { y: 0.6 }, 
      colors: [theme.hex, '#ffffff'] 
    });

    // 2. Clases de popout para desaparecer rosa y textos
    setPopout(true);

    // 3. Pasa a Fase 2 después de la animación de salida
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };


  // ─── FASE 2: SECUENCIA DE LA CARTA ──────────────────────────────────────────
  useEffect(() => {
    if (step !== 2) return;
    
    const t1 = setTimeout(() => {
      setCartaVisible(true);
      setCartaImgVisible(true);

      // Escribe el mensaje largo letra por letra
      setTimeout(() => {
        let i = 0;
        const typeLong = () => {
          if (i < mensaje.length) {
            setLongMsgText(mensaje.slice(0, i + 1));
            i++;
            // 👇 AUMENTA O DISMINUYE ESTE NÚMERO PARA LA VELOCIDAD DE LA CARTA
            setTimeout(typeLong, 40); 
          }
        };
        typeLong();
      }, 70);
    }, 50);

    return () => clearTimeout(t1);
  }, [step, mensaje]);


  // ─── RENDER ─────────────────────────────────────────────────────────────────
  const fullShortMsg = `${nombre}, ${intencion}`;

  return (
    <div id="contenedor">

      {/* ════ PANTALLA 0: CARGANDO ════ */}
      {step === 0 && (
        <div className={`loading ${loadingFading ? 'fadeout' : ''}`}>
          <div className="p-24">
            <h1 className="h1-rosify">
              <span id="text-0-1" style={{ fontSize: '2rem', fontWeight: '700' }}>{text1}</span>
              <span id="text-0-2" style={{ color: theme.hex, fontSize: '2rem', fontWeight: '700' }}>{text2}</span>
            </h1>
          </div>
        </div>
      )}

      {/* ════ PANTALLA 1: REGALO (ROSA) ════ */}
      {step === 1 && (
        <div id="gift-page" className="gift-page" style={{ display: 'grid' }}>
          
          <div className="gift-section" id="gift-rosa">
            <div id="rosa-animada" ref={rosaRef} className={`rosa-animada ${roseClasses}`} style={{ display: 'flex' }}>
              <div id="rosa-bg" className={`rosa-bg ${popout ? 'bg-popout' : ''}`} style={{ background: theme.bg }}></div>
              <img id="img-rosa" src={imagenRosa} alt="Rosa" className={`rosa-img ${popout ? 'rosa-popout' : ''}`} />
            </div>
          </div>

          <div className="gift-section" id="gift-mensaje">
            <div id="mensaje-corto" className={`mensaje-corto ${popout ? 'fadeout-gift' : ''}`}>
              <span style={{ color: theme.hex, fontWeight: 700 }}>
                {shortMsgNombre}
              </span>
              {shortMsgResto}
            </div>
          </div>

          <div className="gift-section" id="gift-boton">
            {showButton && (
              <div 
                id="boton-abrir" 
                className={`boton-abrir ${popout ? 'fadeout-gift' : ''}`} 
                style={{ display: 'flex', background: theme.hex }}
                onClick={handleAbrirCarta}
              >
                Abrir mensaje
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ PANTALLA 2: CARTA FINAL ════ */}
      {step === 2 && (
        <div 
          id="carta-page" 
          className={`carta-page ${cartaVisible ? 'carta-page-visible' : ''}`} 
          style={{ display: 'grid', background: theme.bg }}
        >
          <div className="carta-section" id="carta-img-section">
            <img 
              id="img-carta" 
              className={`carta-img ${cartaImgVisible ? 'visible' : ''}`} 
              src={theme.letter} 
              alt="Carta" 
            />
          </div>
          
          <div className="carta-section" id="carta-mensaje-section">
            <div id="carta-mensaje" className="carta-mensaje">
              <span style={{ color: theme.hex, fontWeight: 900 }}>
                {longMsgText}
              </span>
            </div>
          </div>
          
          <div className="carta-section" id="carta-boton-section"></div>
          
          <div id="carta-bg" className="carta-bg" style={{ background: theme.bg }}></div>
        </div>
      )}

    </div>
  );
}