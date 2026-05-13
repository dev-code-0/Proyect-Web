export const floresCorazonesConfig = {
  id: "flores-corazones",
  name: "Jardín de Amor",
  fields: [
    {
      name: "nombre",
      label: "Nombre del destinatario",
      type: "text",
      placeholder: "Ej. María",
    },
    {
      name: "mensaje",
      label: "Mensaje personal",
      type: "textarea",
      placeholder: "Ej. Cada día a tu lado es un regalo...",
    },
    {
      name: "musica",
      label: "Música de fondo (opcional)",
      type: "file",
      accept: "audio/*",
      required: false,
    },
  ],
};
