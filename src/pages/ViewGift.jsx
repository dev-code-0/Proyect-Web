import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// Importamos todos los templates que existan
import DiaMujerTemplate from "../templates/dia-mujer/index.jsx";
import { supabase } from "../lib/supabase";
import RosaVirtualTemplate from "../templates/rosa-virtual/index.jsx";

import PruebaConexTemplate from "../templates/prueba-conex/index.jsx";

import FloresAmarillasTemplate from "../templates/flores-amarillas/index.jsx";
import NoviaPregunta from "../templates/pregunta/index.jsx";
import FloresCorazonesTemplate from "../templates/flores-corazones/index.jsx";
import GirasolesTemplate from "../templates/girasoles/index.jsx";
import RamoHotWheelsTemplate from "../templates/hot-wheels/index.jsx";
import CorazonCaruselTemplate from "../templates/corazon-carrusel/index.jsx";
import CorazonAnimadoTemplate from "../templates/corazon-animado/index.jsx";
import LibroPopTemplate from "../templates/libro-pop/index.jsx";
import CajaMusicalTemplate from "../templates/caja-musical/index.jsx";
import FuegosAmorTemplate from "../templates/corazon-mensaje/index.jsx";
import FloresParaTiTemplate from "../templates/flores-para-ti/index.jsx";
import SanValentinApp from "../templates/app-recuerdos/index.jsx";
import SorpresaRomantica from "../templates/sorpresa-romantica/index.jsx";
import GalaxyMomentos from "../templates/galaxia-momentos/index.jsx";
import VueloGlobalTemplate from "../templates/vuelo-global/VueloGlobal.jsx";

export default function ViewGift() {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState("");
  // const style = {style: { width: "100vw", height: "100vh", position: "relative" }};

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("proyectos_creados")
        .select("*")
        .eq("id", id)
        .single(); // Pedimos un solo registro

      if (error || !data) {
        setError(
          "No se encontró el regalo. El enlace podría estar roto o haber expirado.",
        );
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

  // 2. Renderizamos el template correcto envolviéndolo en un contenedor de pantalla completa
  switch (projectData.template_id) {
    case "dia-mujer":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <DiaMujerTemplate data={projectData.user_data} />
        </div>
      );

    case "rosa-virtual":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <RosaVirtualTemplate data={projectData.user_data} />
        </div>
      );

    case "prueba-conex":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <PruebaConexTemplate data={projectData.user_data} />
        </div>
      );

    case "flores-amarillas":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <FloresAmarillasTemplate data={projectData.user_data} />
        </div>
      );

    case "pregunta":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <NoviaPregunta data={projectData.user_data} />
        </div>
      );

    case "flores-corazones":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <FloresCorazonesTemplate data={projectData.user_data} />
        </div>
      );

    case "girasoles":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <GirasolesTemplate data={projectData.user_data} />
        </div>
      );

    case "hot-wheels":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <RamoHotWheelsTemplate data={projectData.user_data} />
        </div>
      );

    case "corazon-carrusel":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <CorazonCaruselTemplate data={projectData.user_data} />
        </div>
      );

      case "corazon-animado":
        return (
          <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <CorazonAnimadoTemplate data={projectData.user_data} />
          </div>
        );

    case "libro-pop":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <LibroPopTemplate data={projectData.user_data} />
        </div>
      );

    case "caja-musical":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <CajaMusicalTemplate data={projectData.user_data} />
        </div>
      );
    case "sorpresa-romantica":
      return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <SorpresaRomantica data={projectData.user_data} />
        </div>
      );
      case "corazon-mensaje":
        return (
          <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <FuegosAmorTemplate data={projectData.user_data} />
          </div>
        );
      case "flores-para-ti":
        return (
          <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <FloresParaTiTemplate data={projectData.user_data} />
          </div>
        );
      case "app-recuerdos":
        return (
          <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <SanValentinApp data={projectData.user_data} />
          </div>
        );
      case "galaxia-momentos":
        return (
          <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <GalaxyMomentos data={projectData.user_data} />
          </div>
        );
      case "vuelo-global":
        return (
          <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <VueloGlobalTemplate isPreview={false} data={projectData.user_data} />
          </div>
        );
    default:
      return <div style={{ color: "white" }}>Template no soportado.</div>;
  }
}
