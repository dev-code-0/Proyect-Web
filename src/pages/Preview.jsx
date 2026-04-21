import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { templates } from "../lib/templates";
import "../styles/preview.css";
import { AntiInspectGuard } from '../lib/antiInspect';

import DiaMujerTemplate from "../templates/dia-mujer/index.jsx";
import { diaMujerConfig } from "../templates/dia-mujer/config.js";

import CustomizeModal from "../components/CustomizeModal";
import ShareModal from "../components/ShareModal"; // Importamos el nuevo modal
import { supabase } from "../lib/supabase";

import RosaVirtualTemplate from "../templates/rosa-virtual/index.jsx";
import RosaCreator from "../templates/rosa-virtual/RosaCreator.jsx";

import PruebaConexTemplate from "../templates/prueba-conex/index.jsx"
import { pruebaConexConfig } from "../templates/prueba-conex/config.js"

import FloresAmarillasTemplate from "../templates/flores-amarillas/index.jsx";
import { floresAmarillasConfig } from "../templates/flores-amarillas/config.js";

import NoviaPregunta from "../templates/pregunta/index.jsx";
import { preguntaConfig } from "../templates/pregunta/config.js";

import FloresCorazonesTemplate from "../templates/flores-corazones/index.jsx";
import { floresCorazonesConfig } from "../templates/flores-corazones/config.js";

import GirasolesTemplate from "../templates/girasoles/index.jsx";
import { girasolesConfig } from "../templates/girasoles/config.js";

import RamoHotWheelsTemplate from "../templates/hot-wheels/index.jsx";
import { hotWheelsConfig } from "../templates/hot-wheels/config.js";

import CorazonCarruselTemplate from "../templates/corazon-carrusel/index.jsx";
import { CorazonCarruselConfig } from "../templates/corazon-carrusel/config.js";

import CorazonAnimadoTemplate from "../templates/corazon-animado/index.jsx";
import { corazonAnimadoConfig } from "../templates/corazon-animado/config.js";

import LibroPopUpTemplate from "../templates/libro-pop/index.jsx";
import { libroPopConfig } from "../templates/libro-pop/config.js";

import CajaMusicalTemplate from "../templates/caja-musical/index.jsx";
import { cajaMusicalConfig } from "../templates/caja-musical/config.js";

import FuegosAmorTemplate from "../templates/corazon-mensaje/index.jsx";
import { fuegosAmorConfig } from "../templates/corazon-mensaje/config.js";

import FloresParaTiTemplate from "../templates/flores-para-ti/index.jsx";
import { floresParaTiConfig } from "../templates/flores-para-ti/config.js";

import SanValentinApp from "../templates/app-recuerdos/index.jsx";
import { sanValentinConfig } from "../templates/app-recuerdos/config.js";



export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [previewData, setPreviewData] = useState({});
  const templateActual = templates.find((t) => t.id === id);

  if (!templateActual) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Proyecto no encontrado
      </div>
    );
  }

  const handleSaveConfig = async (datosPersonalizados) => {
    const uniqueId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    // Guardamos en la base de datos real
    const { data, error } = await supabase
      .from("proyectos_creados")
      .insert([
        { id: uniqueId, template_id: id, user_data: datosPersonalizados },
      ]);

    if (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar tu proyecto.");
      return;
    }

    const finalLink = `${window.location.origin}/view/${uniqueId}`;
    setGeneratedLink(finalLink);
    setShowCustomizeModal(false);
    setShowShareModal(true);
  };

  const renderTemplate = () => {
    switch (id) {
      case "dia-mujer":
        return <DiaMujerTemplate data={previewData} />;
        
      case "rosa-virtual":
        return <RosaVirtualTemplate data={previewData} />;

      case "viernes-13":
        return <PruebaConexTemplate data={previewData} />;

      case "flores-amarillas":
        return <FloresAmarillasTemplate data={previewData} />;
        
      case "pregunta":
        return <NoviaPregunta data={previewData} />;

      case "flores-corazones":
        return <FloresCorazonesTemplate data={previewData} />;

      case "girasoles":
        return <GirasolesTemplate data={previewData} />;

      case "hot-wheels":
        return <RamoHotWheelsTemplate data={previewData} />;

      case "corazon-carrusel":
        return <CorazonCarruselTemplate data={previewData} />;

      case "corazon-animado":
        return <CorazonAnimadoTemplate data={previewData} />;

      case "libro-pop":
        return <LibroPopUpTemplate data={previewData} />
        ;
      case "caja-musical":
        return <CajaMusicalTemplate data={previewData} />;

      case "corazon-mensaje":
        return <FuegosAmorTemplate data={previewData} />;
      case "flores-para-ti":
        return <FloresParaTiTemplate data={previewData} />;
      case "app-recuerdos":
        return <SanValentinApp data={previewData} />;
      default:
        return ( 
          <p>
            Aquí se mostrará la web de{" "}
            <strong>{templateActual.title.toLowerCase()}</strong>
          </p>
        );
    }
  };

  const getConfig = () => {
    if (id === "dia-mujer") return diaMujerConfig;
    if (id === "viernes-13") return pruebaConexConfig;
    if (id === "flores-amarillas") return floresAmarillasConfig;
    if (id === "pregunta") return preguntaConfig;
    if (id === "flores-corazones") return floresCorazonesConfig;
    if (id === "girasoles") return girasolesConfig;
    if (id === "hot-wheels") return hotWheelsConfig;
    if (id === "corazon-carrusel") return CorazonCarruselConfig;
    if (id === "corazon-animado") return corazonAnimadoConfig;
    if (id === "libro-pop") return libroPopConfig;
    if (id === "caja-musical") return cajaMusicalConfig;
    if (id === "corazon-mensaje") return fuegosAmorConfig;
    if (id === "flores-para-ti") return floresParaTiConfig;
    if (id === "app-recuerdos") return sanValentinConfig;

    return { name: "Proyecto genérico", fields: [] };
  };

  // Función para cuando cierra el modal de compartir
  const handleCloseShare = () => { setShowShareModal(false); navigate("/"); // Lo mandamos al inicio
  };

  return (
    <AntiInspectGuard>
    <main className="preview-container">
      <h2 className="preview-title">{templateActual.title}</h2>

      <div className="preview-box">{renderTemplate()}</div>

      <button className="btn-personalizar" onClick={() => setShowCustomizeModal(true)} >Personalizar</button>

      <Link to="/" className="btn-volver">Volver</Link>

      {/* Modal para rellenar datos */}
      {showCustomizeModal &&
        (id === "rosa-virtual" ? (
          <RosaCreator onClose={() => setShowCustomizeModal(false)} onSave={handleSaveConfig}/>
        ) : (
          <CustomizeModal config={getConfig()} onClose={() => setShowCustomizeModal(false)} onSave={handleSaveConfig}/>
        ))}

      {/* Modal final con el QR y el Link */}
      <ShareModal isOpen={showShareModal} onClose={handleCloseShare} shareLink={generatedLink}/>
    </main>
        </AntiInspectGuard>
  );
}
