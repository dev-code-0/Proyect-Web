import React, { useState, useEffect } from "react";
import "./style.css";
import RamoAzul from "./ramo-azul.png"; // Asegúrate de tener esta imagen en la carpeta correcta
import HotWheelsSVG from "./card.svg"; // Asegúrate de tener esta imagen en la carpeta correcta

export default function RamoHotWheelsTemplate({data}) {
  const [abierto, setAbierto] = useState(false);
  const [mostrarCarta, setMostrarCarta] = useState(false);
  const [textosFlotantes, setTextosFlotantes] = useState([]);

  const particulas = Array.from({ length: 30 });
  // Añadimos las frases exactas de tu referencia
  const frases = [
    "Te amo",
    "Te quiero", 
    "Te adoro",
    "Siempre juntos", 
    "Mi Amor",
  ];
  const nombre = data?.nombre || 'Luis';

  useEffect(() => {
    if (abierto) {
      setTimeout(() => {
        setMostrarCarta(true);
      }, 3000);
    }
  }, [abierto]);

  // NUEVA VERSIÓN DE handleClicPantalla para multiplicar textos
  const handleClicPantalla = (e) => {
    if (!abierto) return;

    // Obtenemos la posición exacta del clic relativa al contenedor
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Elegimos UNA frase aleatoria para esta explosión
    const baseFrase = frases[Math.floor(Math.random() * frases.length)];

    const cantidadMultiplicacion = 5; // Cuántas veces se duplica el texto
    const nuevasFrases = [];

    // Creamos las copias con IDs únicos y un índice de variante
    for (let i = 0; i < cantidadMultiplicacion; i++) {
      nuevasFrases.push({
        id: Date.now() + Math.random(), // ID súper único
        texto: baseFrase, // Misma frase para todas las copias
        x,
        y,
        variante: i // Índice del 0 al 4 para usar en CSS
      });
    }

    // Añadimos TODAS las nuevas frases al estado
    setTextosFlotantes((prev) => [...prev, ...nuevasFrases]);

    // Eliminamos esta tanda de textos después de 1 segundo
    setTimeout(() => {
      // Obtenemos los IDs que acabamos de crear para borrarlos
      const idsToRemove = nuevasFrases.map(f => f.id);
      setTextosFlotantes((prev) => prev.filter(t => !idsToRemove.includes(t.id)));
    }, 1500);
  };

  return (
    <div className="regalo-virtual-container-hw ramo-hotwheels-theme-hw">
      {!abierto ? (
        <div className="pantalla-inicio-hw">
          <h1 className="titulo-tocar-hw">
            {" "}
            <strong>Hola {nombre}</strong>
            Tengo un regalo para tí <img className="svg-hw" src={HotWheelsSVG} alt="" />
          </h1>
          <button
            className="boton-abrir-hw azul-gradient-hw"
            onClick={() => setAbierto(true)}
          >
            <span className="icono-boton-hw">💙</span> Abrir
          </button>
        </div>
      ) : (
        // Contenedor principal abierto, recibe TODOS los clics
        <div className="contenido-abierto-hw" onClick={handleClicPantalla}>
          {/* Fondo de luces/partículas azules */}
          <div className="fondo-estrellas-hw">
            {particulas.map((_, i) => (
              <div
                key={i}
                className="particula-hw azul-hw"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Mapeo de las palabras interactivas ACTUALIZADO */}
          {textosFlotantes.map((item) => (
            <div 
              key={item.id} 
              // Añadimos la clase de variante dinámicamente
              className={`texto-clic-interactivo-hw variante-${item.variante}-hw`}
              style={{ left: item.x, top: item.y }}
            >
              {item.texto}
            </div>
          ))}

          <div className="seccion-ramo-hw">
            <h1 className="titulo-principal-hw">
              ¡Feliz Día del Novio <br /> 💙!
            </h1>

            <div className="ramo-wrapper-hw">
              {/* Contenedor que maneja la entrada y levitación al mismo tiempo */}
              <div className="levitacion-wrapper-hw">
                <img
                  src={RamoAzul}
                  alt="Ramo de Hot Wheels"
                  className="ramo-imagen-hw"
                />
              </div>
            </div>

            {mostrarCarta && (
              <div className="indicador-scroll-hw">↓ Desliza hacia abajo ↓</div>
            )}
          </div>

          {mostrarCarta && (
            <div className="seccion-carta-hw">
              <div className="tarjeta-mensaje-hw blue-glow-hw">
                <h2 className="titulo-carta-hw">Para ti, {nombre} 💙</h2>
                <p>
                  Dicen que los verdaderos tesoros se encuentran donde menos lo
                  esperas... Desde que llegaste a mi vida, me di cuenta de que
                  mi mayor tesoro no es de metal o de colección...
                </p>
                <p>
                  Sino el amor que compartimos, la complicidad de cada aventura
                  y el motor que me impulsa a ser mejor cada día. ✨💙
                </p>
                <p>
                  Este detalle es para recordarte lo mucho que significas para
                  mí. Así como cada Hot Wheels cuenta una historia, cada momento
                  a tu lado es una nueva aventura que atesoro.
                </p>
                <p>
                  Gracias por tu amor, por ser mi compañero de ruta y por hacer
                  que mi mundo sea un lugar mejor. Eres mi persona favorita.
                </p>
                <p className="firma-hw">Te quiero con todo mi corazón. 💙</p>
              </div>
              <div className="detalle-final-hw">
                <span className="car-emoji-hw"><img src={HotWheelsSVG} alt="" /></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
