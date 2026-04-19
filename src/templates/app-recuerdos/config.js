export const sanValentinConfig = {
  id: "app-recuerdos",
  title: "App Recuerdos",
  fields: [
    {name: "targetDate", label: "Fecha del recuerdo", type: "date"},
    {name: "pista", label: "Pista para desbloquear el recuerdo", type: "text", placeholder: "Ejemplo: La fecha en que se conocieron"},
    {name: "photos", label: "Fotos del recuerdo", type: "file", accept: "image/*", multiple: true},
    {name: "songUrl", label: "La canción favorita (opcional)", type: "file", accept: "audio/*", required: false},
    {name: "apodo", label: "Apodo", type: "text", placeholder: "Ejemplo: Mi niña"},
  ],
};
