import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { TEMPLATE_REGISTRY } from "../lib/templateRegistry";
import NotFound from "../components/NotFound";

export default function ViewGift() {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("proyectos_creados")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("No se encontró el regalo. El enlace podría estar roto o haber expirado.");
      } else {
        setProjectData(data);
      }
    };
    fetchProject();
  }, [id]);

  if (error) {
    return (
      <NotFound
        title="Regalo no encontrado"
        subtitle="Este enlace no existe o ha expirado. Vuelve al inicio para crear tu propio regalo virtual."
      />
    );
  }

  if (!projectData) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', color: 'var(--accent)', fontSize: '1rem',
        fontFamily: 'var(--font-text)',
      }}>
        Cargando sorpresa...
      </div>
    );
  }

  const entry = TEMPLATE_REGISTRY[projectData.template_id];
  if (!entry?.Component) {
    return (
      <NotFound
        title="Plantilla no disponible"
        subtitle="Esta plantilla ya no está disponible. Vuelve al inicio para ver las plantillas actuales."
      />
    );
  }

  const { Component } = entry;
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando sorpresa...</div>}>
        <Component data={projectData.user_data} isPreview={false} />
      </Suspense>
    </div>
  );
}
