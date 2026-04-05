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
    <div className="regalo-virtual-container">
      <div className="fondo-estrellas">
        {particulas.map((_, i) => (
          <div key={i} className="particula" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>

      {!abierto ? (
        <div className="pantalla-inicio">
          <h1 className="titulo-tocar"> <strong>Hola {nombre}</strong> <br /> Toca para abrir ❤️</h1>
          <button className="boton-abrir" onClick={() => setAbierto(true)}>
            <span className="icono-boton">🌻</span> Abrir
          </button>
        </div>
      ) : (
        <div className="contenido-abierto">
          <div className="seccion-flores">
            <h1 className="titulo-principal">
              Feliz día de las Flores <br /> Amarillas ❤️
            </h1>
            
            <div className="jardin-girasoles">
              {/* Ahora renderizamos 10 girasoles */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`girasol-wrapper girasol-${i + 1}`}>
                  <div className="tallo">
                    <div className="hoja hoja-izq"></div>
                    <div className="hoja hoja-der"></div>
                  </div>
                  <div className="cabeza-girasol">
                    <div className="petalos">
                      {Array.from({ length: 12 }).map((_, p) => (
                        <div 
                          key={p} 
                          className="petalo" 
                          style={{ transform: `rotate(${p * 30}deg)` }}
                        ></div>
                      ))}
                    </div>
                    <div className="centro-girasol"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {mostrarCarta && (
               <div className="indicador-scroll">
                 ↓ Desliza hacia abajo ↓
               </div>
            )}
          </div>

          {mostrarCarta && (
            <div className="seccion-carta">
              <div className="tarjeta-mensaje">
                <h2 className="titulo-carta">Para ti 🌻</h2>
                <p>Dicen que los girasoles siempre buscan la luz del sol para crecer y brillar. Desde que llegaste a mi vida, tú te has convertido en esa luz que ilumina mis días y me llena de calidez. ✨</p>
                <p>Este detalle es para recordarte lo mucho que significas para mí. Cada momento a tu lado es tan hermoso y especial como ver florecer un campo de girasoles. 🌻</p>
                <p>Gracias por tu amor, por tu compañía y por hacer que mi mundo sea un lugar mejor. Eres mi persona favorita y siempre giraré hacia ti, buscando tu sonrisa. ❤️</p>
                <p className="firma">Te quiero con todo mi corazón. 🫶🏼</p>
              </div>

              <div className="girasol-final">
                 <div className="cabeza-girasol grande">
                    <div className="petalos">
                      {Array.from({ length: 16 }).map((_, p) => (
                        <div 
                          key={p} 
                          className="petalo" 
                          style={{ transform: `rotate(${p * 22.5}deg)` }}
                        ></div>
                      ))}
                    </div>
                    <div className="centro-girasol"></div>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}