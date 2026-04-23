import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './creator.css';
import { ROSAS } from './rosaAssets';
import { AntiInspectGuard } from '../../lib/antiInspect';

// ─── Datos ────────────────────────────────────────────────────────────────────

const INTENCIONES = [   
  { sub: 'Mostrar',    main: 'Amor',          msg: ', te han regalado esta rosa para que sepas lo especial que eres para esa persona' },
  { sub: 'Desear',     main: 'Suerte',        msg: ', te han regalado esta rosa para desearte mucha suerte en los próximos días' },
  { sub: 'Subir sus',  main: 'Ánimos',        msg: ', te han regalado esta rosa para darte muchos ánimos y abrazos' },
  { sub: 'Apoyar',     main: 'Enfermo',       msg: ', te han regalado esta rosa para que te encuentres mejor y te recuperes pronto.' },
  { sub: 'Feliz',      main: 'San Valentín',  msg: ', te han regalado esta rosa para mostrar su amor y desearte un buen San Valentín.' },
  { sub: 'Feliz',      main: 'Cumple',        msg: ', te han regalado esta rosa para desearte un Feliz Cumpleaños y darte abrazos.' },
  { sub: 'Dia de la',  main: 'Madre',         msg: ', te han regalado esta rosa para desearte un buen día de la Madre.' },
  { sub: 'Dia del',    main: 'Padre',         msg: ', te han regalado esta rosa para desearte un buen día del Padre.' },
  { sub: 'Cumple',     main: 'Mes',           msg: ', te han regalado esta rosa para celebrar este día del mes tan especial.' },
  { sub: 'Pedir',      main: 'Perdón',        msg: ', te han regalado esta rosa porque siente mucho lo que ha pasado.' },
  { sub: 'Para',       main: 'Felicitar',     msg: ', te han regalado esta rosa para felicitarte por lo que ha ocurrido!' },
  { sub: 'Dar las',    main: 'Gracias',       msg: ', te han regalado esta rosa para agradecerte todo lo que has hecho.' },
  { sub: 'Feliz Sant', main: 'Jordi',         msg: ', te han regalado esta rosa para desearte un Feliz Sant Jordi!' },
  { sub: 'Apoyar',     main: 'Cancer',        msg: ', te han regalado esta rosa para demostrar apoyo en la lucha contra el cáncer' },
  { sub: 'Agradecer',  main: 'Amistad',       msg: ', te han regalado esta rosa para agradecer vuestra amistad' },
  { sub: 'Sín',        main: 'Razón',         msg: ', te han regalado esta rosa sin razón, porque eres importante' },
];

// ─── SVG Icono Rosa (reutilizable) ────────────────────────────────────────────

function RosaIcon({ color = 'currentColor', size = 44, style = {} }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"
      style={{ color, width: size, height: size, opacity: 0.9, ...style }}>
      <path fill="#2ba52e" d="M82.09 96.56c4.06.57 10.51 3.54 12.74 6.9c.27.42.83 1.04.84 1.5c.02.76-.67 1.28-1.18 1.74c-7.35 6.64-20.37 8.48-27.26 1.91c-.96-.92-.14-2.17.27-3.25c1.67-4.31 5.83-7.81 10.37-8.7c1.42-.28 2.84-.29 4.22-.1m-34.56 3.37c-4.08-.39-11.05 1-14 3.75c-.36.34-1.05.82-1.17 1.27c-.2.73.35 1.4.75 1.97c5.61 8.16 17.84 12.99 26.07 8.19c1.15-.67.65-2.08.49-3.23c-.62-4.58-3.86-8.96-8.06-10.87c-1.32-.6-2.69-.95-4.08-1.08"/>
      <path fill="#2ba52e" d="M65.93 121.18c-.14.49-.31.98-.5 1.45c-.35.87-.69 1.75-1.06 2.62c-.31.72-.63 1.6-1.44 1.91c-1.02.39-2.31.21-3.32-.08c-4.24-1.24-3.12-5.32-2.06-8.29c2.14-6.06 2.95-19.19 3.39-25.53c.46-6.55-.26-13.43-.26-19.99c0-.13.01-2.79-.09-2.79h8.36v3.07c0 4.75.01 9.5-.09 14.24c-.21 8.77-.4 24.87-2.93 33.39"/>
      <path fill="#ffff" d="M47.31 44.34c-1.13-1.01-17.87-13.21-17.87-13.21l-.25-7.42s-4.1-7.75.62-13.52c4.1-5.01 9.57-3.59 9.57-3.59s2.74-3.45 7.52-3.69c6.11-.31 9.09 4.83 9.09 4.83l27.55 4.53l15.47 10.06s2.29-.74 4.19.6c1.98 1.39 1.33 4.31 1.11 5.62c-.21 1.25-20.65 17.56-20.65 17.56l2.14 31.96l-7.14 7.97s-1 .98-3.05 1.24c-1.19.15-2.72-.33-2.72-.33l-4.45-12.78z"/>
      <path style={{fill:'currentColor'}} d="m83.15 6.86l-3.72.28l-2.61 2.19l.93 4.21s.12 3.15-2.36 4.66s-7.35 3.99-7.35 3.99l-3.36 5.56s-2.16-.71-5.68-2.52c-3.29-1.7-7.5-5.58-7.5-5.58l-7.53-.51s-1.44-.13-2.65 1.15c-1.74 1.86-1.12 5.8 2.29 9.41c3.28 3.47 10.38 7.7 11.96 8.87s3.99 2.67 5.36 3.44c1.32.74 2.9 1.8 3.59 1.67c.69-.14 1.71-2.49 4.94-4.76s6.39-4.19 11.55-5.98s10.11-3.85 11.62-4.81s-.55-7.49-2.41-11.48s-6.94-10.2-7.07-9.79"/>
      <path style={{fill:'currentColor'}} d="M65.07 23.98c-1.27 1.68-1.03 3.64-1.03 3.64s2.77 1.66 5.5 2.61c4.95 1.72 16.09 1.24 21.45-1.17s7.98-4.49 8.8-7.01c.96-2.96 1.76-8.94-4-13.55c-6.6-5.29-16.56-2.4-16.56-1.02s3.99.28 3.99 5.29s-4.4 8.04-8.87 8.66s-7.36 0-9.28 2.55"/>
      <path style={{fill:'currentColor'}} d="M42.24 19.65s-.51-2.02 1.17-3.64c2.54-2.48 5.78-3.78 7.63-5.78s4.48-5.79 10.93-6.67c9.56-1.31 15.74 2.27 17.12 6.67s-1.24 5.91-3.92 5.98s-4.17-1.19-9.08-.34c-8.32 1.44-11.21 5.91-11.96 6.33c-.76.41-3.23-1.03-6.6-1.93c-2.43-.65-4.19-.49-5.29-.62"/>
      <path style={{fill:'currentColor'}} d="M69.62 48.38s1.7-5.65 7.25-9.23c5.56-3.58 9.61-3.67 16.68-6.88s9.51-5.32 10.64-6.06c1.16-.76 2.21-1.45 3.02-.12c.52.86-.38 4.38-2.77 7.8c-2.44 3.49-4.84 5.41-6.66 11.42c-2.41 7.93 2.22 15.14-2.72 27.88c-1.6 4.12-5.35 7.89-8.84 10.34s-8.52 3-8.52 3s1.79-1.25 2.77-5.85c.48-2.26 1.2-6.27.65-10.54c-1.57-12.21-11.5-21.76-11.5-21.76"/>
      <path style={{fill:'currentColor'}} d="M31.74 46.68c.12 2.68-1.14 12.43.49 20.26c1.28 6.16 7.62 17.05 19.49 20.25c10.92 2.95 22.61-.09 22.61-.09s4.41-7.45 2.18-18.31c-2.43-11.84-14.26-20.64-27.9-27.38c-16.39-8.1-19.36-17.86-19.36-17.86s-5.39-1.41-6.74 3.44c-2.07 7.44 9.05 15.64 9.23 19.69"/>
    </svg>
  );
}

// ─── Sub-componente Botón Volver ─────────────────────────────────────────────
function BackButton({ onClick, color, text = "Volver al paso anterior" }) {
  return (
    <div
      className="rc-back-btn"
      style={{ color: color, marginTop: 10 }}
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" style={{ width: 12, height: 20, marginRight: 6 }}>
        <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
      </svg>
      {text}
    </div>
  );
}

// ─── Componente Principal ──────────────────────────────────────────────────────

export default function RosaCreator({ onSave }) {
  const [step, setStep]                         = useState(1);
  const [animDir, setAnimDir]                   = useState('next');   // 'next' | 'prev'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showVideoModal, setShowVideoModal]     = useState(false);
  const [videoUrl, setVideoUrl]                 = useState('');
  const [videoSaved, setVideoSaved]             = useState('');
  const [charCount, setCharCount]               = useState(0);
  const [intentionSelected, setIntentionSelected] = useState(null); // ahora guarda ID en vez de índice
  const [_rosaIndex, setRosaIndex]              = useState(0);            // slide activo
  const [isBouquet, setIsBouquet]               = useState(false);
  const nameInputRef                            = useRef(null);
  const swiperRef                               = useRef(null);
  
  // Refs para corregir el bug de animación
  const timerRef = useRef(null);
  const userInteracted = useRef(false);

  const [formData, setFormData] = useState({
    color:    ROSAS[0].color,
    colorHex: ROSAS[0].hex,
    bgLight:  ROSAS[0].bgLight,
    roseImg:  ROSAS[0].img,
    ramoImg:  ROSAS[0].ramo,
    nombre:   '',
    intencion: '',
    intencionMsg: '',
    mensaje:  '',
    isBouquet: false,
    videoLink: '',
  });

  // Sincronizar color con el slide del Swiper
  const onSlideChange = (swiper) => {
    const idx  = swiper.realIndex;
    const rosa = ROSAS[idx];
    setRosaIndex(idx);
    setFormData(fd => ({
      ...fd,
      color:    rosa.color,
      colorHex: rosa.hex,
      bgLight:  rosa.bgLight,
      roseImg:  rosa.img,
      ramoImg:  rosa.ramo,
    }));
  };

  const [nameFocused, setNameFocused] = useState(false);

  // Animación de entrada del carrusel corregida (no fuga memoria y respeta interacción)
  useEffect(() => {
    const sequence = [0, 1, 2, 3, 0];
    let i = 0;
    let mounted = true;

    const run = () => {
      if (!mounted || !swiperRef.current || userInteracted.current) return;
      i++;
      if (i >= sequence.length) return;
      swiperRef.current.slideTo(sequence[i]);
      timerRef.current = setTimeout(run, 700);
    };
    
    timerRef.current = setTimeout(run, 1000);
    
    return () => {
      mounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Navegar entre pasos con animación
  const goTo = (nextStep, dir = 'next') => {
    setAnimDir(dir);
    setStep(nextStep);
  };

  // Confirmar rosa y pasar al paso 2
  const confirmarRosa = () => {
    userInteracted.current = true;
    setShowConfirmModal(false);
    goTo(2);
  };

  // Paso 2 → 3: guardar nombre y mostrar intenciones
  const handleSaveName = () => {
    if (!formData.nombre.trim()) {
      alert('Por favor, ingresa un nombre o apodo antes de continuar.');
      return;
    }
    goTo(3);
  };

  // Paso 3 → 4: guardar intención
  const handleSaveIntention = () => {
    if (intentionSelected === null) {
      alert('Por favor, selecciona una intención antes de continuar.');
      return;
    }
    goTo(4);
  };

  // Paso 4 → 5 (ramo)
  const handleSaveLetter = () => {
    goTo(5);
  };

  // Paso 5 → 6 (resumen)
  const handleSaveBouquet = (isBouq) => {
    setIsBouquet(isBouq);
    setFormData(fd => ({ ...fd, isBouquet: isBouq }));
    goTo(6);
  };

  // Finalizar y enviar
  const handleFinalizar = () => {
    onSave?.({ ...formData, videoLink: videoSaved });
  };

  // Video helpers
  const esEnlaceDeVideo = (url) => {
    const patrones = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/,
      /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/,
      /^(https?:\/\/)?(vm\.)?tiktok\.com\/.+$/,
      /^(https?:\/\/)?(www\.)?dailymotion\.com\/.+$/,
      /^(https?:\/\/)?(www\.)?facebook\.com\/.+\/videos\/.+$/,
      /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel)\/.+$/,
    ];
    return patrones.some(p => p.test(url));
  };

  const guardarLink = () => {
    if (videoUrl && esEnlaceDeVideo(videoUrl)) {
      setVideoSaved(videoUrl);
      setFormData(fd => ({ ...fd, videoLink: videoUrl }));
      setShowVideoModal(false);
    } else {
      alert('Por favor, ingresa un enlace de video válido.');
    }
  };

  // ─── Clases de animación ──────────────────────────────────────────────────────
  const animClass = animDir === 'next' ? 'page-enter-next' : 'page-enter-prev';
  
  // Buscar la intención seleccionada de forma robusta para el Preview Header
  const selectedIntentionObj = INTENCIONES.find(int => `${int.sub}-${int.main}` === intentionSelected);

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <AntiInspectGuard>
    <div className="rc-overlay">
      <div className="rc-container">

        {/* ════════════════════════════════════════════════
            PASO 1 — Seleccionar color de rosa (Swiper)
        ════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className={`rc-page ${animClass}`}>

            {/* Header */}
            <div className="rc-p1-header">
              <div style={{ display: 'inline-flex' }}>
                <RosaIcon color={formData.colorHex} size={44} style={{ background: 'radial-gradient(white, transparent)', borderRadius: 8, padding: 1 }} />
              </div>
              <h2 className="rc-p1-title">
                Regalo Virtual para<br />
                <span style={{ color: formData.colorHex }}>amigos</span> y{' '}
                <span style={{ color: formData.colorHex }}>parejas</span>
              </h2>
              <p className="rc-p1-subtitle">
                Elige una <span style={{ color: formData.colorHex }}>rosa</span> o detalle gratis
              </p>
            </div>

            {/* Swiper */}
            <div className="rc-swiper-wrapper" style={{ transformOrigin: 'center center' }}>
              {/* Caja de fondo de color */}
              <div className="rc-highlight-box" style={{ backgroundColor: formData.bgLight }} />

              <Swiper
                modules={[Pagination]}
                className="rc-swiper"
                loop={false}
                centeredSlides={true}
                slidesPerView="auto"
                spaceBetween={10}
                grabCursor={true}
                initialSlide={_rosaIndex}
                speed={600}
                onTouchStart={() => { userInteracted.current = true; }} // Cancela la animación si el usuario toca
                pagination={{
                  clickable: true,
                  renderBullet: (index, className) =>
                    `<span class="${className}" style="background-color:${ROSAS[index]?.hex}"></span>`,
                }}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={onSlideChange}
                breakpoints={{
                  320: { slidesPerView: 'auto', spaceBetween: 10 },
                  480: { slidesPerView: 'auto', spaceBetween: 20 },
                }}
              >
                {ROSAS.map((rosa, idx) => (
                  <SwiperSlide key={idx} className="rc-swiper-slide">
                    <img
                      src={rosa.img}
                      alt={rosa.alt}
                      className="rc-rose-img"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Botón personalizar */}
            <div className="rc-p1-btn-wrap">
              <button
                className="rc-btn"
                style={{ backgroundColor: formData.colorHex }}
                onClick={() => setShowConfirmModal(true)}
              >
                Personalizar
              </button>
            </div>

            {/* Modal de confirmación */}
            {showConfirmModal && (
              <div className="rc-modal-backdrop">
                <div className="rc-modal-content animated">
                  
                  <h2>Confirmar selección</h2>
                  <p>
                    Has seleccionado una rosa de color:{' '}
                    <RosaIcon color={formData.colorHex} size={30} style={{ verticalAlign: 'middle' }} />
                  </p>
                  <button
                    className="rc-btn"
                    style={{ backgroundColor: formData.colorHex, width: '100%' }}
                    onClick={confirmarRosa}
                  >
                    Confirmar
                  </button>

                  <button
                    className="rc-modal-close"
                    onClick={() => setShowConfirmModal(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                      <g fill="none">
                        <path fill="currentColor" d="M12 3a1 1 0 0 1 .117 1.993L12 5H7a1 1 0 0 0-.993.883L6 6v12a1 1 0 0 0 .883.993L7 19h4.5a1 1 0 0 1 .117 1.993L11.5 21H7a3 3 0 0 1-2.995-2.824L4 18V6a3 3 0 0 1 2.824-2.995L7 3zm5.707 5.464l2.828 2.829a1 1 0 0 1 0 1.414l-2.828 2.829a1 1 0 1 1-1.414-1.415L17.414 13H12a1 1 0 1 1 0-2h5.414l-1.121-1.121a1 1 0 0 1 1.414-1.415" />
                      </g>
                    </svg>
                  </button>

                </div>
              </div>
            )}
          </div>
        )}


        {/* ════════════════════════════════════════════════
            PASOS 2‑3 — Header compartido: vista previa
        ════════════════════════════════════════════════ */}
        {step >= 2 && step <= 3 && (
          <div
            className="rc-preview-bar"
            style={{ backgroundColor: formData.bgLight }}
          >
            <img
              src={formData.roseImg}
              alt="rosa"
              className={`rc-preview-rose ${nameFocused ? 'rc-preview-rose--shifted' : ''}`}
            />
            <div className={`rc-preview-text ${nameFocused ? 'rc-preview-text--visible' : ''}`}>
              <span style={{ color: formData.colorHex }}>{formData.nombre || ''}</span>
              {selectedIntentionObj
                ? <span>{selectedIntentionObj.msg}</span>
                : <span>, <br />elige una intención (siguiente)</span>
              }
            </div>
            <div
              className={`rc-preview-label ${nameFocused ? 'rc-preview-label--visible' : ''}`}
              style={{ backgroundColor: formData.colorHex }}
            >
              Vista previa
            </div>
          </div>
        )}


        {/* ════════════════════════════════════════════════
            PASO 2 — Nombre / Apodo
        ════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className={`rc-page rc-page--inner ${animClass}`}>

            <div className="rc-section-name">
              <div className="rc-p24 rc-pb0">
                <h2 className="rc-section-title">
                  Escribe <span style={{ color: formData.colorHex }}>su</span> nombre<br />o apodo
                </h2>
              </div>

              <div>
                <div className="label-float">Nombre:</div>
                <input
                  ref={nameInputRef}
                  id="name_gift"
                  className="input-rosify"
                  maxLength={16}
                  value={formData.nombre}
                  style={{ borderColor: formData.colorHex, caretColor: formData.colorHex }}
                  onChange={(e) => setFormData(fd => ({ ...fd, nombre: e.target.value }))}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => { if (!formData.nombre) setNameFocused(false); }}
                />
              </div>

              <BackButton onClick={() => goTo(1, 'prev')} color={formData.colorHex} text="Cambiar Color Rosa" />
            </div>

            <div className="rc-p24">
              <div
                className="button-bottom press-effect"
                style={{ backgroundColor: formData.colorHex }}
                onClick={handleSaveName}
              >
                Continuar
              </div>
            </div>
          </div>
        )}

       
        {/* ════════════════════════════════════════════════
            PASO 3 — Intención
        ════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className={`rc-page rc-page--inner ${animClass}`}>

            <div className="rc-p24 rc-pb0">
              <h2 className="rc-section-title elige-intencion">
                Elige qué intención<br />lleva la rosa
              </h2>
            </div>

            <div className="rc-intentions-scroll">
  {[
    [0, 2, 11],   // Fila 1: Amor, Ánimos, Gracias
    [12, 10, 9],  // Fila 2
    [3, 1, 5],    // Fila 3
    [6, 7, 8],    // Fila 4
    [13, 14, 15], // Fila 5
  ].map((row, rowIdx) => (
    <div className="intention-container" key={`row-${rowIdx}`}>
      {row.map((i) => {
        const intencion = INTENCIONES[i];
        const intentionId = `${intencion.sub}-${intencion.main}`;
        return (
          <IntentionCard
            key={intentionId}
            intencion={intencion}
            color={formData.colorHex}
            selected={intentionSelected === intentionId}
            onSelect={() => {
              setIntentionSelected(intentionId);
              setFormData(fd => ({
                ...fd,
                intencion: intencion.msg.replace(', ', ''),
                intencionCorta: intencion.main
              }));
            }}
          />
        );
      })}
    </div>
  ))}
</div>

            <div className="rc-p24" style={{ paddingTop: 0 }}>
              <div
                className="button-bottom press-effect"
                style={{ backgroundColor: formData.colorHex }}
                onClick={handleSaveIntention}
              >
                Continuar
              </div>
              <BackButton onClick={() => goTo(2, 'prev')} color={formData.colorHex} />
            </div>
          </div>
        )}


        {/* ════════════════════════════════════════════════
            PASO 4 — Video + Mensaje adicional
        ════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className={`rc-page rc-page--inner ${animClass}`}>

            {/* Modal de video */}
            {showVideoModal && (
              <div className="rc-video-modal" style={{ borderColor: formData.colorHex }}>
                <div style={{ padding: 15, color: formData.colorHex }}>Introduce la URL del video.</div>
                <input
                  type="url"
                  className="input-rosify"
                  style={{ height: 40, border: `2px solid ${formData.colorHex}`, borderRadius: 12, width: '90%', boxSizing: 'border-box' }}
                  placeholder="https://www.video.com/video"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                  {[
                    { label: 'Guardar',  action: guardarLink },
                    { label: 'Borrar',   action: () => { setVideoUrl(''); setVideoSaved(''); } },
                    { label: 'Salir',    action: () => setShowVideoModal(false) },
                  ].map(({ label, action }) => (
                    <div
                      key={label}
                      className="button-bottom grow-click"
                      style={{ backgroundColor: formData.colorHex, color: '#fff', fontSize: 15, height: 54, lineHeight: '54px', textAlign: 'center', cursor: 'pointer', borderRadius: 10, margin: '5px 20px' }}
                      onClick={action}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Zona superior: video opcional */}
            <div
              className="image-container"
              style={{ display:'none'}}
            >
              <div style={{ textAlign: 'center', marginBottom: 6, fontWeight: 600, color: '#555', fontSize: 14 }}>
                {videoSaved ? `✅ Video guardado` : '¿Deseas agregar un video? (Opcional)'}
              </div>
              <div
                className="button-bottom grow-click"
                style={{ backgroundColor: formData.colorHex, color: '#fff', borderRadius: 11, fontSize: 15, display: 'flex', padding: '8px 16px', alignItems: 'center', gap: 8, cursor: 'pointer', height: 'auto', lineHeight: 'normal' }}
                onClick={() => setShowVideoModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
                    <path d="M39 6H9a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3"/>
                    <path d="M20.5 28v-6.062l5.25 3.03L31 28l-5.25 3.031l-5.25 3.031zM6 15h36m-9-9l-6 9m-6-9l-6 9"/>
                  </g>
                </svg>
                {videoSaved ? 'Cambiar video' : 'Añadir link de Video'}
              </div>
            </div>

            {/* Mensaje adicional */}
            <div id="section-letter" style={{ display: 'block' }}>
              <div className="rc-p24 rc-pb0" style={{ paddingTop: 0, marginTop: 15 }}>
                <h2 className="rc-section-title">Mensaje adicional</h2>
              </div>
              <div style={{ height: 180 }}>
                <div className="flex justify-between">
                  <label className="label-float" style={{ display: 'block', marginBottom: 8 }}>Tu mensaje:</label>
                </div>
                <textarea
                  id="message"
                  className="input-rosify"
                  maxLength={300}
                  style={{
                    height: 120, fontSize: 16, padding: 14,
                    width: 'calc(90%)',
                    border: `3px solid ${formData.colorHex}`,
                    caretColor: formData.colorHex,
                    transition: 'border-color 0.3s',
                    resize: 'none',
                  }}
                  placeholder="Escribe tu mensaje aquí..."
                  value={formData.mensaje}
                  onChange={(e) => {
                    setCharCount(e.target.value.length);
                    setFormData(fd => ({ ...fd, mensaje: e.target.value }));
                  }}
                />
                <div id="char-counter" style={{ textAlign: 'right', fontSize: 14, color: '#666', paddingRight: 20, margin: 5 }}>
                  {charCount} / 300
                </div>
              </div>
            </div>

            <div className="rc-p24" style={{ paddingTop: 0 }}>
              <div
                id="btn-letter"
                className="button-bottom grow-click"
                style={{ backgroundColor: formData.colorHex }}
                onClick={handleSaveLetter}
              >
                Continuar
              </div>
              <BackButton onClick={() => goTo(3, 'prev')} color={formData.colorHex} />
            </div>
          </div>
        )}


        {/* ════════════════════════════════════════════════
            PASO 5 — ¿Ramo o rosa?
        ════════════════════════════════════════════════ */}
        {step === 5 && (
          <div className={`rc-page rc-page--bouquet ${animClass}`}>

            {/* Círculo con imagen del ramo */}
            <div
              style={{
                position: 'relative', width: 200, height: 200, borderRadius: '50%',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                margin: '40px auto',
                backgroundColor: formData.bgLight,
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={formData.ramoImg}
                style={{ width: 120, height: 'auto', zIndex: 1 }}
                alt="ramo"
              />
            </div>

            <div style={{ textAlign: 'center', fontFamily: "'Cascadia Code', monospace" }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, margin: '50px 0' }}>
                ¿Deseas convertir la rosa en un ramo?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                <button
                  style={{
                    width: 120, padding: '10px 0', fontSize: 18, fontWeight: 'bold',
                    border: `2px solid ${formData.colorHex}`, borderRadius: 16, cursor: 'pointer',
                    backgroundColor: formData.colorHex, color: 'white',
                  }}
                  onClick={() => handleSaveBouquet(true)}
                >
                  Sí
                </button>
                <button
                  style={{
                    width: 120, padding: '10px 0', fontSize: 18, fontWeight: 'bold',
                    border: `2px solid ${formData.colorHex}`, borderRadius: 16, cursor: 'pointer',
                    backgroundColor: formData.colorHex, color: 'white',
                  }}
                  onClick={() => handleSaveBouquet(false)}
                >
                  No
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
                <BackButton onClick={() => goTo(4, 'prev')} color={formData.colorHex} />
              </div>
            </div>
          </div>
        )}


        {/* ════════════════════════════════════════════════
            PASO 6 — Resumen final
        ════════════════════════════════════════════════ */}
        {step === 6 && (
          <div className={`rc-page ${animClass}`} style={{ maxWidth: 420, paddingBottom: 40, marginTop: 20, margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 24, marginBottom: 15, marginTop: 0, color: formData.colorHex }}>
              Resumen de tu Selección
            </h2>

            <div className="summary-container" style={{ display: 'grid', gap: 10, padding: 10 }}>
              {[
                { label: 'Nombre',             value: formData.nombre },
                { label: 'Intención',          value: formData.intencionCorta || formData.intencion },
                { label: 'Mensaje Adicional',  value: formData.mensaje },
                // { label: 'Enlace de Video',    value: videoSaved || 'No especificado' },
              ].map(({ label, value }) => (
                <div key={label} className="summary-card" style={{ display: 'flex', flexDirection: 'column', margin: '0 15px', padding: 10, border: '2px solid #eee', boxShadow: '0px 0px 12px 2px #bebebe', borderRadius: 12, textAlign: 'left' }}>
                  <h2 style={{ margin: '0 0 5px', fontSize: 17, fontWeight: 600, color: formData.colorHex }}>{label}</h2>
                  <p style={{ margin: 0, fontWeight: 400, color: '#000' }}>{value}</p>
                </div>
              ))}

              {/* Tarjeta imagen rosa/ramo */}
              <div className="summary-card" style={{ display: 'flex', flexDirection: 'column', margin: '0 15px', padding: 10, border: '2px solid #eee', boxShadow: '0px 0px 12px 2px #bebebe', borderRadius: 12, textAlign: 'left' }}>
                <h2 style={{ margin: '0 0 5px', fontSize: 17, fontWeight: 600, color: formData.colorHex }}>Color de Rosa</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={isBouquet ? formData.ramoImg : formData.roseImg} style={{ width: 120, height: 'auto' }} alt="rosa seleccionada" />
                </div>
              </div>
            </div>

            <button
              style={{
                margin: '20px auto 10px auto', display: 'block', padding: '15px 30px',
                fontSize: 18, fontWeight: 'bold', border: 'none', borderRadius: 30,
                cursor: 'pointer', backgroundColor: formData.colorHex, color: 'white',
                transition: 'transform 0.3s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onClick={handleFinalizar}
            >
              Finalizar y Generar Link
            </button>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
               <BackButton onClick={() => goTo(5, 'prev')} color={formData.colorHex} />
            </div>
          </div>
        )}

      </div>
    </div>
    </AntiInspectGuard>
  );
}

// ─── Sub-componente: tarjeta de intención ─────────────────────────────────────

function IntentionCard({ intencion, color, selected, onSelect }) {
  const { sub, main } = intencion;
  return (
    <div
      className={`select-intention ${selected ? 'selected-intention' : ''}`}
      style={selected ? { borderColor: color } : {}}
      onClick={onSelect}
    >
      <div style={{ height: 44, alignSelf: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 500, textAlign: 'left', color: '#808080', paddingTop: 4, lineHeight: '13px' }}>{sub}</div>
        <div style={{ fontSize: 17, fontWeight: 500, textAlign: 'left', color: '#000' }}>{main}</div>
      </div>
    </div>
  );
}