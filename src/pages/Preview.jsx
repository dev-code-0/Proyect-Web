import React, { Suspense, lazy, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { templates } from "../lib/templates";
import { TEMPLATE_REGISTRY } from "../lib/templateRegistry";
import "../styles/preview.css";
import BackgroundAnimation from "../components/BackgroundAnimation";
import CustomizeModal from "../components/CustomizeModal";
import ShareModal from "../components/ShareModal";

const RosaCreator = lazy(() => import('../templates/rosa-virtual/RosaCreator.jsx'));

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [previewData, setPreviewData] = useState({});
  const [saveError, setSaveError] = useState("");
  const templateActual = templates.find((t) => t.id === id);

  if (!templateActual) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Proyecto no encontrado
      </div>
    );
  }

  const handleSaveConfig = async (datosPersonalizados) => {
    setSaveError("");
    const uniqueId = crypto.randomUUID();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-project`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ id: uniqueId, template_id: id, user_data: datosPersonalizados }),
        },
      );
      const result = await res.json();
      if (!res.ok) {
        setSaveError(result.error || "Hubo un error al guardar tu proyecto. Intenta de nuevo.");
        return;
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setSaveError("Hubo un error al guardar tu proyecto. Intenta de nuevo.");
      return;
    }

    const finalLink = `${window.location.origin}/view/${uniqueId}`;
    setGeneratedLink(finalLink);
    setShowCustomizeModal(false);
    setShowShareModal(true);
  };

  const entry = TEMPLATE_REGISTRY[id];
  const TemplateComponent = entry?.Component;
  const templateConfig = entry?.config || { name: "Proyecto genérico", fields: [] };

  const renderTemplate = () => {
    if (!TemplateComponent) {
      return (
        <p>
          Aquí se mostrará la web de{" "}
          <strong>{templateActual.title.toLowerCase()}</strong>
        </p>
      );
    }
    return (
      <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Cargando plantilla...</div>}>
        <TemplateComponent data={previewData} isPreview={true} />
      </Suspense>
    );
  };

  return (
    <>
      <BackgroundAnimation />
      <main className="preview-container">
        <h2 className="preview-title">{templateActual.title}</h2>

        <div className="preview-box">{renderTemplate()}</div>

        {saveError && (
          <p style={{ color: '#ff6b6b', background: 'rgba(0,0,0,0.4)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center', margin: '8px 0', fontSize: '0.9rem' }}>
            {saveError}
          </p>
        )}

        <button className="btn-personalizar" onClick={() => setShowCustomizeModal(true)}>Personalizar</button>

        <Link to="/" className="btn-volver">Volver</Link>

        {showCustomizeModal && (
          id === "rosa-virtual" ? (
            <Suspense fallback={null}>
              <RosaCreator onClose={() => setShowCustomizeModal(false)} onSave={handleSaveConfig} />
            </Suspense>
          ) : (
            <CustomizeModal
              config={templateConfig}
              onClose={() => setShowCustomizeModal(false)}
              onSave={handleSaveConfig}
            />
          )
        )}

        <ShareModal
          isOpen={showShareModal}
          onClose={() => { setShowShareModal(false); navigate("/"); }}
          shareLink={generatedLink}
        />
      </main>
    </>
  );
}
