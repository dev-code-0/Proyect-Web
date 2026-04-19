import React, { useEffect, useRef, useState, useCallback } from "react";
import "./style.css";
import HeroImage from "./images/flores.gif";
import CorazonSVG from "./images/logo.svg";
import AudioMusic from './audioMusic.mp3';
import Ramo from "./images/ramo.svg";
import Rosas from "./images/flores_2.svg";

// ─────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────
function useTypewriter(text, active, speed = 35) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, text, speed]);
  return displayed;
}

function useGlobalNavigation({ onNext, onPrev, transitioning, isUnlocked }) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    if (transitioning || !isUnlocked) return;
    
    const scrollable = e.target.closest('.can-scroll-fla');
    if (scrollable) {
      const isAtBottom = Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight - 10;
      const isAtTop = scrollable.scrollTop <= 10;
      
      if (e.deltaY > 0 && !isAtBottom) return; 
      if (e.deltaY < 0 && !isAtTop) return;    
    }
    
    if (e.deltaY > 20) onNext();
    else if (e.deltaY < -20) onPrev();
  };

  const handleTouchStart = (e) => {
    if (!isUnlocked) return;
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchEnd = (e) => {
    if (transitioning || !isUnlocked) return;
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const deltaY = touchStart.y - touchEnd.y;
    
    if (Math.abs(deltaY) < 40) return; 

    const scrollable = e.target.closest('.can-scroll-fla');
    if (scrollable) {
      const isAtBottom = Math.ceil(scrollable.scrollTop + scrollable.clientHeight) >= scrollable.scrollHeight - 10;
      const isAtTop = scrollable.scrollTop <= 10;
      
      if (deltaY > 0 && !isAtBottom) return; 
      if (deltaY < 0 && !isAtTop) return; 
    }

    if (deltaY > 0) onNext();
    else onPrev();
  };

  return { onWheel: handleWheel, onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd };
}

// ─────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────
const DEFAULT_DISTANCE_MESSAGE = `La distancia no es un obstáculo para el amor verdadero.
Es solo el espacio que existe entre dos corazones que sienten
exactamente lo mismo al mismo tiempo. Cada día que pasa,
mi amor por ti crece más y más.`;

const DEFAULT_LOVE_LETTER = `Quería encontrar las palabras exactas para expresar lo que siente mi corazón cuando pienso en ti. Pero las palabras se quedan cortas, porque el amor es más que eso: es una sensación que vive en cada latido de mi pecho.

Aunque estemos separados por la distancia, nunca estamos separados en el corazón. Cada momento que pasa, cada pensamiento en ti, cada deseo de verte sonreír, es prueba de que nada en el mundo puede debilitar lo que compartimos.

Eres mi razón para creer en la magia del amor verdadero. Gracias por ser exactamente quien eres, por iluminar mis días y por permitirme ser parte de tu historia.

Te amo, hoy y siempre.`;

const TOTAL_SECTIONS = 4; 
const POLAROID_ROTATIONS = ["-4deg", "2deg", "5deg", "-2deg", "3deg"];
const PETALS = Array.from({ length: 15 }).map((_, i) => ({
  id: i, left: Math.random() * 100, animationDuration: 8 + Math.random() * 7,
  animationDelay: Math.random() * 5, size: 0.6 + Math.random() * 0.6,
}));

const ROMANTIC_PHRASES = [
  "Te amo", "Mi vida entera", "Eres mi sol", "Siempre tú",
  "Te adoro", "Mi persona favorita", "Me encantas", "Infinito",
  "Mi luz", "Preciosa", "Juntos siempre", "Mi refugio"
];

function normalizePhotoUrls(value) {
  const urls = Array.isArray(value) ? value : [value];
  return urls.map((url) => (typeof url === "string" ? url.trim() : "")).filter(Boolean);
}

// ─────────────────────────────────────────
// COMPONENTES
// ─────────────────────────────────────────
function UnlockScreen({ onUnlock }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const startHold = () => {
    setIsHolding(true);
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          setIsUnlocked(true);
          setTimeout(onUnlock, 800); 
          return 100;
        }
        return p + 2.5; 
      });
    }, 20);
  };

  const stopHold = () => {
    if (isUnlocked) return;
    setIsHolding(false);
    clearInterval(intervalRef.current);
    setProgress(0); 
  };

  return (
    <div className={`unlock-screen-fla ${isUnlocked ? 'hidden-fla' : ''}`}>
      <div 
        className="unlock-glow-fla"
        style={{
          width: `clamp(150px, ${150 + progress * 3}px, 300px)`, 
          height: `clamp(150px, ${150 + progress * 3}px, 300px)`,
          background: `rgba(251, 191, 36, ${0.1 + (progress / 100) * 0.4})`
        }}
      ></div>

      <div className="unlock-content-fla">
        <div className="unlock-text-wrap-fla">
          <h1 className="unlock-title-fla">Un secreto te espera...</h1>
          <p className="unlock-subtitle-fla">
            {isHolding ? 'Sigue presionando...' : 'Mantén presionado el corazón'}
          </p>
        </div>

        <div 
          className="unlock-btn-fla"
          onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}
          onTouchStart={startHold} onTouchEnd={stopHold}
        >
          <svg className="unlock-svg-fla">
            <circle cx="50%" cy="50%" r="48%" className="unlock-circle-bg-fla" />
            <circle cx="50%" cy="50%" r="48%" className="unlock-circle-progress-fla"
              strokeDasharray="300" strokeDashoffset={300 - (progress / 100) * 300}
            />
          </svg>
          <span className="unlock-heart-fla" style={{ transform: `translate(-50%, -50%) scale(${1 + (progress / 100) * 0.5})` }}> <img src={CorazonSVG} alt="Corazón" /> </span>
        </div>
      </div>
    </div>
  );
}

function MagicCursor({ containerRef }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);

  return (
    <div 
      className="magic-cursor-fla"
      style={{ left: pos.x - 96, top: pos.y - 96 }} 
    />
  );
}

function MusicPlayer({ audioUrl, isPlaying, togglePlay }) {
  return (
    <div className="music-player-wrap-fla">
      <button onClick={togglePlay} className={`music-btn-fla ${isPlaying ? "playing-fla" : ""}`}>
        <div className={`music-inner-fla ${isPlaying ? 'spin-fla' : ''}`}>
           <div className="music-dot-fla"></div>
        </div>
      </button>
    </div>
  );
}

function HeartSVG({ color, letter, rotate = 0 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 728.662698 734.909493"
      style={{ transform: `rotate(${rotate}deg)`, filter: `drop-shadow(0 0 15px ${color}80)` }}
      className="heart-svg-fla"
    >
      <g transform="translate(-143.017164,851.387642) scale(0.100000,-0.100000)" fill={color}>
        <path d="M6585 8509 c-209 -11 -329 -41 -524 -130 -92 -43 -235 -129 -321 -195 -71 -54 -181 -169 -300 -316 -144 -177 -206 -328 -260 -636 -16 -90 -31 -166 -34 -170 -12 -12 -24 14 -44 95 -35 138 -144 311 -311 493 -156 170 -294 258 -578 371 -226 90 -382 127 -628 149 -393 36 -679 -18 -990 -188 -208 -113 -377 -255 -516 -435 -244 -313 -405 -637 -519 -1044 -98 -350 -130 -557 -130 -848 1 -359 31 -520 166 -862 69 -176 199 -432 264 -519 63 -84 268 -280 395 -378 333 -257 620 -415 1024 -562 216 -79 283 -109 441 -196 312 -171 526 -326 742 -536 355 -345 543 -695 603 -1125 18 -127 53 -286 67 -304 18 -23 45 4 57 54 6 27 16 98 21 158 23 234 106 461 237 649 101 145 255 327 403 477 128 130 185 177 480 397 480 358 818 633 1095 891 66 62 176 162 244 224 203 184 506 589 669 892 167 313 311 727 357 1028 25 167 28 332 11 611 -18 293 -26 347 -68 496 -36 128 -203 485 -281 603 -188 282 -613 541 -998 606 -327 56 -581 34 -981 -84 -254 -75 -400 -145 -569 -271 -166 -124 -266 -227 -361 -371 -44 -68 -84 -123 -89 -123 -26 0 7 112 73 247 47 98 57 110 206 261 274 277 405 343 852 432 337 67 532 80 788 54 50 -6 62 -4 62 8 0 19 -313 87 -435 94 -49 2 -110 6 -135 7 -25 2 -108 0 -185 -4z m1157 -529 c128 -64 254 -145 383 -245 102 -79 185 -193 271 -371 90 -186 152 -382 125 -398 -6 -4 -23 20 -41 60 -76 167 -290 483 -405 599 -99 99 -278 253 -396 342 -49 36 -89 68 -89 70 0 13 50 -5 152 -57z m-3934 -20 c418 -84 699 -237 916 -499 73 -89 249 -339 278 -395 23 -44 68 -269 58 -286 -9 -15 -20 0 -65 90 -103 205 -257 374 -455 498 -132 83 -277 162 -340 185 -199 75 -604 108 -823 67 -99 -19 -96 -7 8 36 120 50 246 89 363 113 67 14 88 22 90 36 4 16 -6 17 -140 13 -172 -7 -266 -31 -433 -112 -127 -62 -334 -196 -385 -251 -19 -20 -78 -72 -130 -115 -113 -92 -228 -211 -274 -283 -73 -114 -184 -376 -229 -537 -18 -66 -21 -104 -21 -320 -1 -332 25 -480 135 -773 92 -246 292 -596 413 -726 55 -58 325 -287 526 -446 69 -54 163 -133 210 -175 77 -69 165 -145 426 -367 47 -40 161 -127 253 -193 256 -184 415 -342 555 -553 54 -81 86 -108 86 -71 0 28 -110 237 -166 314 -128 178 -270 298 -752 637 -86 60 -177 139 -295 254 -180 174 -321 297 -453 394 -213 158 -365 339 -573 684 -105 173 -161 321 -206 541 -51 253 -58 641 -14 868 21 109 69 273 96 327 25 50 197 257 272 328 183 172 290 226 529 267 143 25 427 27 553 5 106 -18 305 -68 383 -95 131 -45 309 -165 455 -305 134 -129 205 -235 297 -437 68 -151 64 -165 -13 -48 -148 224 -343 416 -575 563 -195 124 -445 197 -670 197 -378 0 -520 -51 -808 -291 -58 -48 -115 -100 -126 -116 -51 -69 -150 -305 -181 -430 -25 -101 -25 -589 0 -720 35 -183 115 -377 230 -551 113 -173 411 -513 436 -498 21 13 11 33 -70 127 -141 165 -317 465 -393 672 -82 222 -116 396 -116 604 0 119 4 161 26 255 44 188 163 436 254 528 66 68 189 150 268 180 159 61 400 97 552 85 230 -20 535 -133 734 -272 111 -78 248 -213 308 -302 126 -185 226 -479 263 -771 9 -69 21 -144 27 -167 21 -85 61 -79 73 10 22 171 135 429 288 657 95 141 294 316 474 417 213 120 506 166 723 113 184 -44 339 -108 434 -179 105 -78 265 -304 312 -441 63 -179 89 -501 60 -714 -28 -199 -67 -329 -150 -499 -73 -150 -230 -401 -364 -582 -98 -132 -594 -622 -867 -856 -250 -215 -493 -482 -630 -694 -94 -144 -193 -337 -229 -445 -42 -128 -83 -318 -92 -431 -10 -123 -19 -136 -34 -54 -19 106 -67 250 -116 348 -166 334 -464 640 -929 954 -141 95 -198 143 -437 370 -116 109 -326 275 -493 386 -66 44 -154 105 -195 135 -96 70 -543 522 -619 627 -110 150 -252 478 -291 670 -31 152 -46 414 -31 573 35 390 85 586 248 966 118 276 207 420 319 511 81 67 266 184 369 235 116 57 328 129 465 158 129 28 287 28 418 2z m3282 -40 c122 -25 295 -90 430 -161 205 -109 441 -287 522 -393 90 -120 289 -494 343 -646 114 -322 125 -706 31 -1095 -79 -324 -282 -796 -428 -989 -136 -181 -470 -544 -613 -664 -132 -112 -235 -203 -370 -328 -253 -234 -413 -364 -662 -541 -79 -56 -255 -189 -356 -268 -99 -79 -59 -17 100 151 54 57 185 171 408 353 83 67 211 182 285 254 74 73 221 211 325 307 448 413 503 473 739 825 254 379 337 576 418 1000 19 100 23 153 23 315 -1 217 -11 283 -87 560 -77 280 -129 365 -386 623 -207 208 -281 255 -642 410 -197 84 -227 92 -430 107 -252 19 -484 -21 -715 -123 -92 -41 -230 -116 -293 -159 -24 -17 -45 -28 -48 -26 -7 8 150 160 231 223 206 160 384 238 642 280 127 21 395 13 533 -15z m-240 -291 c170 -23 482 -162 655 -292 159 -119 415 -422 514 -608 84 -158 108 -322 97 -684 -9 -353 -32 -519 -96 -698 -153 -433 -459 -929 -715 -1157 -65 -59 -264 -256 -362 -360 -111 -118 -312 -293 -408 -355 -27 -17 -98 -72 -157 -121 -58 -49 -168 -138 -244 -199 -187 -150 -287 -260 -711 -782 -29 -35 -72 -96 -95 -136 -37 -62 -43 -68 -46 -46 -4 37 91 299 148 405 27 51 99 161 159 246 176 242 397 471 676 698 122 100 230 191 398 337 102 89 367 366 482 504 138 165 325 451 424 646 47 95 127 344 153 479 20 105 23 149 23 364 -1 272 -13 358 -76 537 -32 90 -134 303 -172 358 -125 182 -360 341 -592 401 -80 20 -133 27 -260 31 -248 8 -407 -27 -632 -141 -148 -74 -224 -126 -342 -230 -100 -89 -144 -139 -286 -333 -41 -57 -81 -103 -90 -103 -12 0 -15 13 -15 64 0 69 30 263 53 337 15 50 154 282 220 367 87 114 307 281 470 357 141 66 329 116 477 128 67 5 264 -3 350 -14z m-4770 -484 c0 -4 -6 -18 -14 -33 -44 -87 -162 -491 -190 -651 -63 -359 -57 -784 15 -1092 48 -205 150 -443 252 -584 206 -286 457 -525 758 -721 57 -37 178 -123 269 -190 136 -100 182 -141 259 -231 52 -59 140 -152 195 -205 54 -54 95 -98 89 -98 -11 0 -220 138 -409 271 -67 47 -166 113 -221 147 -55 34 -173 121 -262 192 -88 71 -172 137 -186 146 -23 15 -25 15 -31 0 -8 -21 -1 -30 177 -195 143 -134 236 -201 522 -375 42 -26 77 -51 77 -56 0 -5 -37 8 -82 29 -46 20 -131 56 -189 80 -113 45 -165 74 -352 194 -169 109 -237 159 -320 235 -40 37 -108 98 -150 136 -89 80 -265 274 -312 344 -115 173 -192 350 -270 617 -69 237 -75 278 -75 511 0 284 30 544 90 770 36 137 117 359 176 483 62 131 184 314 184 276z" />
                <path d="M7764 6696 c-4 -10 7 -74 24 -144 78 -319 98 -507 89 -834 -4 -143 -3 -178 8 -178 8 0 24 34 39 83 45 146 57 200 68 317 13 134 -2 269 -47 425 -28 99 -123 301 -155 330 -18 17 -20 17 -26 1z" />
                <path d="M3668 8349 c-87 -13 -123 -24 -126 -40 -2 -12 26 -17 155 -26 157 -12 160 -13 368 -83 255 -87 404 -148 487 -202 35 -22 116 -94 180 -160 112 -114 139 -132 146 -96 4 22 -263 291 -358 361 -92 68 -265 156 -386 197 -155 51 -327 70 -466 49z" />
                <path d="M2245 7919 c-364 -260 -545 -468 -678 -781 -71 -167 -102 -313 -122 -570 -6 -76 -5 -89 10 -94 9 -4 18 -5 20 -3 2 2 17 66 35 141 73 321 215 637 400 891 84 114 267 309 333 353 72 49 137 105 137 120 0 28 -38 12 -135 -57z" />
                <path d="M2426 3643 c-15 -15 -1 -34 72 -95 294 -246 450 -327 957 -493 91 -30 175 -67 278 -123 311 -170 481 -322 839 -750 26 -31 69 -92 95 -135 60 -98 82 -127 95 -127 15 0 4 45 -34 135 -51 123 -111 223 -196 331 -89 113 -155 176 -320 307 -180 143 -220 171 -312 213 -47 21 -195 93 -330 160 -244 121 -428 208 -518 243 -162 65 -474 230 -539 286 -46 38 -78 57 -87 48z" />
              </g>
      {letter && (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#facc15" className="heart-text-fla">
          {letter}
        </text>
      )}
    </svg>
  );
}

function PolaroidStack({ photoUrl, caption }) {
  return (
    <div className="polaroid-stack-fla">
      <div className="polaroid-card-fla">
        <div className="polaroid-img-wrap-fla">
          <div className="polaroid-gradient-fla"></div>
          <img src={photoUrl} alt="Memory" className="polaroid-img-fla" />
        </div>
        {caption && (
          <p className="polaroid-caption-fla">{caption}</p>
        )}
      </div>
      <div className="polaroid-shadow-fla"></div>
    </div>
  );
}

// ─────────────────────────────────────────
// PANELS
// ─────────────────────────────────────────

function HeroPanel({ recipientName, recipientInitial, senderInitial, giftImage, active }) {
  return (
    <section className={`panel-base-fla ${active ? 'panel-active-fla' : ''}`}>
      <div className="bg-glow-center-fla"></div>

      <div className="hero-content-fla">
        <div className="hero-titles-wrap-fla">
          <span className="hero-subtitle-fla">Una sorpresa para</span>
          <h1 className="hero-title-fla">{recipientName}</h1>
        </div>

        <div className="hero-hearts-row-fla">
          <HeartSVG color="#f59e0b" letter={recipientInitial} rotate={-15} />
          <HeartSVG color="#fbbf24" letter={senderInitial} rotate={15} />
        </div>

        <div className="hero-gift-wrap-fla">
          <div className="hero-gift-glow-fla"></div>
          <div className="hero-gift-inner-fla">
            <img src={giftImage} alt="Regalo" className="hero-gift-img-fla" />
          </div>
        </div>

        <p className="hero-instruction-fla">Desliza o usa el scroll</p>
      </div>
    </section>
  );
}

function DistancePanel({ message, active }) {
  const displayed = useTypewriter(message, active, 40);
  return (
    <section className={`panel-base-fla ${active ? 'panel-active-fla' : ''}`}>
      <div className="bg-glow-top-right-fla"></div>
      <div className="bg-glow-bottom-left-fla"></div>

      <div className="distance-content-fla">
        <div className="distance-quotes-fla">"</div>

        <blockquote className="distance-text-fla">
          {displayed}
          <span className="distance-cursor-fla"></span>
        </blockquote>
        
        <div className={`distance-divider-wrap-fla ${active ? 'divider-active-fla' : ''}`}>
          <div className="distance-line-fla"></div>
          <span className="distance-flower-fla"><img className="distance-flower-img-fla" src={Ramo} alt="Ramo de flores" /></span>
          <div className="distance-line-fla reverse-fla"></div>
        </div>
      </div>
    </section>
  );
}

function LetterPanel({ senderName, recipientName, loveLetter, photoUrls, photoCaption, active }) {
  return (
    <section className={`panel-base-fla can-scroll-fla scroll-view-fla ${active ? 'panel-active-fla' : ''}`}>
      <div className="letter-texture-fla"></div>
      <div className="bg-glow-letter-fla"></div>

      <div className="letter-content-wrap-fla">
        <article className="letter-card-fla">
          <div className="letter-card-border-fla"></div>
          
          <div className="letter-inner-fla">
            <header className="letter-header-fla">
              <p className="letter-date-fla">
                {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric', day: 'numeric' })}
              </p>
              <h2 className="letter-title-fla">Querida {recipientName},</h2>
            </header>

            <div className="letter-body-fla">
              {loveLetter}
            <img className="letter-gift-img-fla" src={Rosas} alt="Ramo de rosas" />
            </div>

            <footer className="letter-footer-fla">
              <span className="letter-sign-label-fla">Con el alma entera,</span>
              <h2 className="letter-sign-name-fla">{senderName}</h2>
            </footer>
          </div>
          <div className="letter-glow-bottom-fla"></div>
        </article>

        <div className="gallery-wrap-fla">
          <div className="gallery-header-fla">
            <div className="gallery-line-fla"></div>
            <p className="gallery-title-fla">Fragmentos de Amor</p>
            <div className="gallery-line-fla reverse-fla"></div>
          </div>
          
          <div className="gallery-grid-fla">
            {photoUrls.map((url, i) => (
              <div key={i} style={{ transform: `rotate(${POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length]})` }} className="polaroid-item-fla">
                <PolaroidStack photoUrl={url} caption={i === 0 ? photoCaption : null} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalPanel({ startDate, whatsappNumber, active }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!active) return;
    const calculateTime = () => {
      const start = startDate ? new Date(startDate) : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
      const difference = new Date() - start;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [active, startDate]);

  const whatsappUrl = whatsappNumber 
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Acabo de ver tu regalo... Te quiero mucho :)")}`
    : `whatsapp://send?text=${encodeURIComponent("Acabo de ver tu regalo... Te quiero mucho :)")}`;

  return (
    <section className={`panel-base-fla ${active ? 'panel-active-fla' : ''}`}>
      <div className="final-glow-fla"></div>

      <div className="final-content-fla">
        <div className="final-titles-wrap-fla">
          <span className="final-subtitle-fla">Y esto es solo el principio...</span>
          <h2 className="final-title-main-fla">Nuestro Tiempo</h2>
        </div>

        <div className="timer-grid-fla">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="timer-box-fla">
              <div className="timer-gradient-fla"></div>
              <span className="timer-value-fla">{value.toString().padStart(2, '0')}</span>
              <span className="timer-label-fla">
                {label === 'days' ? 'Días' : label === 'hours' ? 'Horas' : label === 'minutes' ? 'Min' : 'Seg'}
              </span>
            </div>
          ))}
        </div>

        <div className="wsp-wrap-fla">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="wsp-btn-fla">
            Respóndeme aquí
            <svg className="wsp-icon-fla" fill="currentColor" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="9" cy="9" r="1">
</circle><circle cx="15" cy="15" r="1"></circle>
<path d="M8 9a7 7 0 0 0 7 7m-9 5.2A11 11 0 1 0 2.8 18L2 22Z"></path></g>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────
// MAIN TEMPLATE
// ─────────────────────────────────────────
export default function FloresAmarillasTemplate({ data }) {
  const recipientName = data.recipientName ?? data?.nombre ?? "Maria";
  const senderName = data.senderName ?? data?.de ?? "Luis";
  const giftImage = data?.giftImageUrl ?? HeroImage;
  const audioUrl = data?.audioUrl ?? AudioMusic; 
  const rawPhotoInput = data?.photoUrls ?? data?.photos ?? data?.fotos ?? data?.photoUrl ?? data?.foto;
  const photoUrls = normalizePhotoUrls(rawPhotoInput);
  const photosToShow = photoUrls.length > 0 ? photoUrls : [
    "https://images.unsplash.com/photo-1522673607200-164883eecd4c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800"
  ];
  const startDate = data?.startDate ?? new Date(2025, 9, 1); // October 2025
  const photoCaption = data?.photoCaption ?? data?.caption ?? "Nuestro momento";
  const distanceMessage = data?.distanceMessage ?? DEFAULT_DISTANCE_MESSAGE;
  const loveLetter = data?.loveLetterMessage ?? DEFAULT_LOVE_LETTER;
  const whatsappNumber = data?.whatsappNumber ?? 983631052; 
  
  const inicial_1 = String(recipientName).trim().charAt(0).toUpperCase();
  const inicial_2 = String(senderName).trim().charAt(0).toUpperCase();

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [floatingWords, setFloatingWords] = useState([]);
  
  const audioRef = useRef(null);
  const containerRef = useRef(null); 

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Auto-play prevented"));
      setIsPlaying(true);
    }
  };

  const handleGlobalClick = (e) => {
    if (!isUnlocked || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    const randomPhrase = ROMANTIC_PHRASES[Math.floor(Math.random() * ROMANTIC_PHRASES.length)];
    const newWord = {
      id: Date.now() + Math.random(),
      x: relativeX,
      y: relativeY,
      text: randomPhrase,
      rotation: (Math.random() * 30) - 15,
      particles: Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        angle: (i * 60) + Math.random() * 30,
        distance: 20 + Math.random() * 40,
        size: 1 + Math.random() * 2,
        duration: 700 + Math.random() * 400
      }))
    };
    
    setFloatingWords(prev => [...prev, newWord]);
    setTimeout(() => {
      setFloatingWords(prev => prev.filter(w => w.id !== newWord.id));
    }, 2500); 
  };

  function goNext() {
    if (transitioning || current >= TOTAL_SECTIONS - 1 || !isUnlocked) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(c => c + 1); setTransitioning(false); }, 1200); 
  }

  function goPrev() {
    if (transitioning || current <= 0 || !isUnlocked) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(c => c - 1); setTransitioning(false); }, 1200);
  }

  const navHandlers = useGlobalNavigation({ onNext: goNext, onPrev: goPrev, transitioning, isUnlocked });

  return (
    <div 
      ref={containerRef}
      {...navHandlers} 
      onClick={handleGlobalClick}
      className="gift-container-fla"
    >
      

      {audioUrl && <audio ref={audioRef} src={audioUrl} loop preload="auto" />}

      {!isUnlocked && <UnlockScreen onUnlock={handleUnlock} />}

      {isUnlocked && (
        <>
          <MagicCursor containerRef={containerRef} />

          {floatingWords.map(w => (
            <div key={w.id} className="floating-word-wrap-fla" style={{ left: w.x, top: w.y }}>
              <div className="floating-word-text-fla animate-explode-word-3d-fla" style={{ '--rot': `${w.rotation}deg` }}>
                {w.text}
              </div>
              {w.particles.map(p => (
                 <div key={p.id} className="sparkle-dot-fla"
                   style={{
                     width: p.size, height: p.size, '--angle': `${p.angle}deg`, '--distance': `${p.distance}px`,
                     animation: `particle-shoot-fla ${p.duration}ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards`
                   }}
                 />
              ))}
            </div>
          ))}

          <MusicPlayer isPlaying={isPlaying} togglePlay={togglePlay} />
          
          <div className="progress-indicator-fla" style={{ width: `${((current + 1) / TOTAL_SECTIONS) * 100}%` }}></div>

          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
            {PETALS.map((p) => (
              <div key={p.id} className="petal-fla" style={{ left: `${p.left}%`, animationDuration: `${p.animationDuration}s, 3s`, animationDelay: `${p.animationDelay}s, ${p.animationDelay}s`, transform: `scale(${p.size})` }} />
            ))}
          </div>

          <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 10 }}>
            <HeroPanel
              recipientName={recipientName} recipientInitial={inicial_1} senderInitial={inicial_2}
              giftImage={giftImage} active={current === 0 && !transitioning}
            />
            <DistancePanel
              message={distanceMessage} active={current === 1 && !transitioning}
            />
            <LetterPanel
              senderName={senderName} recipientName={recipientName} loveLetter={loveLetter}
              photoUrls={photosToShow} photoCaption={photoCaption} active={current === 2 && !transitioning}
            />
            <FinalPanel
              startDate={startDate} whatsappNumber={whatsappNumber} active={current === 3 && !transitioning}
            />
          </div>
        </>
      )}
    </div>
  );
}