import React, { useState, useEffect } from "react";
import "./style.css";
import RamoAzul from "./ramo-azul.png"; // Asegúrate de tener esta imagen en la carpeta correcta

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
    <div className="regalo-virtual-container ramo-hotwheels-theme">
      {!abierto ? (
        <div className="pantalla-inicio">
          <h1 className="titulo-tocar">
            {" "}
            <strong>Hola {nombre}</strong>
            <br /> Tengo un regalo para tí 🚙❤️
          </h1>
          <button
            className="boton-abrir azul-gradient"
            onClick={() => setAbierto(true)}
          >
            <span className="icono-boton">💙</span> Abrir
          </button>
        </div>
      ) : (
        // Contenedor principal abierto, recibe TODOS los clics
        <div className="contenido-abierto" onClick={handleClicPantalla}>
          {/* Fondo de luces/partículas azules */}
          <div className="fondo-estrellas">
            {particulas.map((_, i) => (
              <div
                key={i}
                className="particula azul"
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
              className={`texto-clic-interactivo variante-${item.variante}`}
              style={{ left: item.x, top: item.y }}
            >
              {item.texto}
            </div>
          ))}

          <div className="seccion-ramo">
            <h1 className="titulo-principal">
              ¡Feliz Día del Novio <br /> 💙!
            </h1>

            <div className="ramo-wrapper">
              {/* Contenedor que maneja la entrada y levitación al mismo tiempo */}
              <div className="levitacion-wrapper">
                <img
                  src={RamoAzul}
                  alt="Ramo de Hot Wheels"
                  className="ramo-imagen"
                />
              </div>
            </div>

            {mostrarCarta && (
              <div className="indicador-scroll">↓ Desliza hacia abajo ↓</div>
            )}
          </div>

          {mostrarCarta && (
            <div className="seccion-carta">
              <div className="tarjeta-mensaje blue-glow">
                <h2 className="titulo-carta">Para ti, {nombre} 💙</h2>
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
                <p className="firma">Te quiero con todo mi corazón. 🫶🏼💙🚙</p>
              </div>
              <div className="detalle-final">
                <span className="car-emoji">🚙💨</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
