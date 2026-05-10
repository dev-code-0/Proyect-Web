import React, { Suspense, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { TEMPLATE_REGISTRY } from "../lib/templateRegistry";

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
      <div style={{ textAlign: "center", padding: "50px", color: "white" }}>
        <h2>...</h2>
        <p>{error}</p>
        <Link to="/" style={{ color: "white", textDecoration: "underline" }}>
          Ir al inicio
        </Link>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Cargando sorpresa...
      </div>
    );
  }

  const entry = TEMPLATE_REGISTRY[projectData.template_id];
  if (!entry?.Component) {
    return <div style={{ color: "white" }}>Template no soportado.</div>;
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
