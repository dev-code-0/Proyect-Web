import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import Music from './musica.mp3'; // Asegúrate de tener un archivo de música en esta ruta o cambia el src en el audio

export default function App({ data }) {
  const [abierto, setAbierto] = useState(false);
  const [mostrarCarta, setMostrarCarta] = useState(false);
  const particulas = Array.from({ length: 40 }); 
  const nombre = data?.nombre || "María";
  
  // Referencia para controlar el audio
  const audioRef = useRef(null);

  useEffect(() => {
    if (abierto) {
      setTimeout(() => {  
        setMostrarCarta(true);
      }, 4500); // Retraso para que crezcan las flores
    }
  }, [abierto]); 

  // NUEVO: Función que se ejecuta al presionar el botón
  const manejarApertura = () => {
    // Reproducir la música
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Volumen al 50%
      audioRef.current.play().catch(e => console.log("El navegador bloqueó el audio automático", e));
    }
    // Abrir el regalo
    setAbierto(true);
  };

  return (
    <div className="regalo-virtual-container-gi">
      
      <audio 
        ref={audioRef} 
        src={Music} 
      />


      {/* Partículas / Estrellas en el fondo */}
      <div className="fondo-estrellas-gi">
        {particulas.map((_, i) => (
          <div key={i} className="particula-gi" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {!abierto ? (
        <div className="pantalla-inicio-gi">
          <h1 className="titulo-tocar-gi"> <strong>Hola {nombre}</strong> <br /> Toca para abrir</h1>
          {/* NUEVO: Llamamos a la función manejarApertura en el onClick */}
          <button className="boton-abrir-gi" onClick={manejarApertura}>
            <span className="icono-boton-gi">🌻</span> Abrir
          </button>
        </div>
      ) : (
        <div className="contenido-abierto-gi">
          
          <div className="seccion-flores-gi">
            <h1 className="titulo-principal-gi">
              Para tí <br /> con mucho cariño
            </h1>
            
            <div className="resplandor-fondo-gi"></div>

            <div className="jardin-girasoles-gi">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`girasol-wrapper-gi girasol-${i + 1}-gi`}>
                  
                  <div 
                    className="girasol-balanceo-gi"
                    style={{ 
                      animationDuration: `${3.5 + (i * 0.4)}s`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    <div className="tallo-gi">
                      <div className="hoja-gi hoja-izq-gi"></div>
                      <div className="hoja-gi hoja-der-gi"></div>
                    </div>
                    <div className="cabeza-girasol-gi">
                      <div 
                        className="petalos-gi"
                        style={{ animation: `giro-lento-petalos-gi ${25 + (i * 3)}s linear infinite` }}
                      >
                        {Array.from({ length: 12 }).map((_, p) => (
                          <div 
                            key={p} 
                            className="petalo-gi" 
                            style={{ transform: `rotate(${p * 30}deg)` }}
                          ></div>
                        ))}
                      </div>
                      <div className="centro-girasol-gi"></div>
                      
                      <div 
                        className="rocio-gi"
                        style={{ 
                          animationDuration: `${1.5 + (i % 3)}s`, 
                          animationDelay: `${i * 0.5}s` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {mostrarCarta && (
               <div className="indicador-scroll-gi">
                 ↓ Desliza hacia abajo ↓
               </div>
            )}
          </div>

          {mostrarCarta && (
            <div className="seccion-carta-gi">
              <div className="tarjeta-mensaje-gi">
                <h2 className="titulo-carta-gi">Para ti 🌻</h2>
                <p>Dicen que los girasoles siempre buscan la luz del sol para crecer y brillar. Desde que llegaste a mi vida, tú te has convertido en esa luz que ilumina mis días y me llena de calidez.</p>
                <p>Este detalle es para recordarte lo mucho que significas para mí. Cada momento a tu lado es tan hermoso y especial como ver florecer un campo de girasoles. 🌻</p>
                <p>Gracias por tu amor, por tu compañía y por hacer que mi mundo sea un lugar mejor. Eres mi persona favorita y siempre giraré hacia ti, buscando tu sonrisa. ❤️</p>
                <p className="firma-gi">Te quiero con todo mi corazón.</p>
              </div>

              <div className="girasol-final-gi">
                 <div className="cabeza-girasol-gi grande-gi">
                    <div className="petalos-gi">
                      {Array.from({ length: 16 }).map((_, p) => (
                        <div 
                          key={p} 
                          className="petalo-gi" 
                          style={{ transform: `rotate(${p * 22.5}deg)` }}
                        ></div>
                      ))}
                    </div>
                    <div className="centro-girasol-gi"></div>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}