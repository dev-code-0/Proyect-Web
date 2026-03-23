import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Importamos todos los templates que existan
import DiaMujerTemplate from '../templates/dia-mujer/index.jsx';
import { supabase } from '../lib/supabase';


export default function ViewGift() {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState('');

 useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('proyectos_creados')
        .select('*')
        .eq('id', id)
        .single(); // Pedimos un solo registro

      if (error || !data) {
        setError('No se encontró el regalo. El enlace podría estar roto o haber expirado.');
      } else {
        setProjectData(data);
      }
    };

    fetchProject();
  }, [id]);


  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
        <h2>Oops...</h2>
        <p>{error}</p>
        <Link to="/" style={{ color: 'white', textDecoration: 'underline' }}>Ir al inicio</Link>
      </div>
    );
  }

  if (!projectData) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando sorpresa...</div>;
  }

  // 2. Renderizamos el template correcto envolviéndolo en un contenedor de pantalla completa
  switch (projectData.template_id) {
    case 'dia-mujer':
      return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <DiaMujerTemplate data={projectData.user_data} />
        </div>
      );
    default:
      return <div style={{ color: 'white' }}>Template no soportado.</div>;
  }
}