import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { templates } from '../lib/templates';
import '../styles/preview.css';

// Importamos el template recién creado
import DiaMujerTemplate from '../templates/dia-mujer/index.jsx';

export default function Preview() {
  const { id } = useParams();
  const templateActual = templates.find(t => t.id === id);

  if (!templateActual) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}>Proyecto no encontrado</div>;
  }

  // Función para renderizar el componente correcto según el ID
  const renderTemplate = () => {
    switch(id) {
      case 'dia-mujer':
        // Le pasamos un data vacío para que use los datos de prueba
        return <DiaMujerTemplate data={{}} />; 
      default:
        return <p>Aquí se mostrará la web de {templateActual.title.toLowerCase()}</p>;
    }
  };

  return (
    <main className="preview-container">
      <h2 className="preview-title">{templateActual.title}</h2>
      
      {/* El cuadro de previsualización que simula un celular */}
      <div className="preview-box" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
        {renderTemplate()}
      </div>

      <button className="btn-personalizar">
        Personalizar
      </button>

      <Link to="/" className="btn-volver">
        Volver
      </Link>
    </main>
  );
}