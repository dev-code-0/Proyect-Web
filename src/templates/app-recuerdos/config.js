export const sanValentinConfig = {
  id: "app-recuerdos",
  title: "Cofre de Recuerdos",
  fields: [
    { name: "targetDate", label: "Fecha especial (código del candado)", type: "date" },
    { name: "pista", label: "Pista para desbloquear", type: "text", placeholder: "Ej: El día que nos conocimos" },
    { name: "apodo", label: "Apodo o nombre", type: "text", placeholder: "Ej: Mi niña" },
    { name: "photos", label: "Fotos del carrusel", type: "file", accept: "image/*", multiple: true },
    { name: "songUrl", label: "Canción (opcional)", type: "file", accept: "audio/*", required: false },
    { name: "reasons", label: "Razones (una por línea)", type: "textarea", placeholder: "Tu sonrisa hermosa\nTus abrazos cálidos\nCómo me haces reír" },
    { name: "letterTitle", label: "Título de la carta", type: "text", placeholder: "Ej: Mi Destino Elegido" },
    { name: "letterText", label: "Texto de la carta", type: "textarea", placeholder: "Escribe aquí tu mensaje..." },
  ],
};
