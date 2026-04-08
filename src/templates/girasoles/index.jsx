import React, { useState, useEffect } from 'react';
import './style.css';

export default function GirasolesTemplate({data}) {
  const [abierto, setAbierto] = useState(false);
  const [mostrarCarta, setMostrarCarta] = useState(false);
  const particulas = Array.from({ length: 40 }); // Un poco más de partículas para la densidad
  const nombre = data?.nombre || "Mary";

  useEffect(() => {
    if (abierto) {
      setTimeout(() => { 
        setMostrarCarta(true);
      }, 4500); // Retraso mayor para 10 girasoles (4.5s)
    }
  }, [abierto]); 

  return (
    <div className="regalo-virtual-container-gi">
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
          <h1 className="titulo-tocar-gi"> <strong>Hola {nombre}</strong> <br /> Toca para abrir ❤️</h1>
          <button className="boton-abrir-gi" onClick={() => setAbierto(true)}>
            <span className="icono-boton-gi">🌻</span> Abrir
          </button>
        </div>
      ) : (
        <div className="contenido-abierto-gi">
          <div className="seccion-flores-gi">
            <h1 className="titulo-principal-gi">
              Feliz día de las Flores <br /> Amarillas ❤️
            </h1>
            
            <div className="jardin-girasoles-gi">
              {/* Ahora renderizamos 10 girasoles */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`girasol-wrapper-gi girasol-${i + 1}-gi`}>
                  <div className="tallo-gi">
                    <div className="hoja-gi hoja-izq-gi"></div>
                    <div className="hoja-gi hoja-der-gi"></div>
                  </div>
                  <div className="cabeza-girasol-gi">
                    <div className="petalos-gi">
                      {Array.from({ length: 12 }).map((_, p) => (
                        <div 
                          key={p} 
                          className="petalo-gi" 
                          style={{ transform: `rotate(${p * 30}deg)` }}
                        ></div>
                      ))}
                    </div>
                    <div className="centro-girasol-gi"></div>
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
                <p>Dicen que los girasoles siempre buscan la luz del sol para crecer y brillar. Desde que llegaste a mi vida, tú te has convertido en esa luz que ilumina mis días y me llena de calidez. ✨</p>
                <p>Este detalle es para recordarte lo mucho que significas para mí. Cada momento a tu lado es tan hermoso y especial como ver florecer un campo de girasoles. 🌻</p>
                <p>Gracias por tu amor, por tu compañía y por hacer que mi mundo sea un lugar mejor. Eres mi persona favorita y siempre giraré hacia ti, buscando tu sonrisa. ❤️</p>
                <p className="firma-gi">Te quiero con todo mi corazón. 🫶🏼</p>
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