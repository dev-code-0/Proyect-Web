export const floresParaTiConfig = {
  id: "flores-para-ti",
  title: "Flores Para Ti",
  fields: [
    { name: "titulo", label: "Título del regalo", type: "text", placeholder: "Ej. Feliz Día" },
    { name: "para", label: "Para (nombre)", type: "text", placeholder: "Ej. María" },
    { name: "mensaje", label: "Mensaje", type: "textarea", placeholder: "Escribe algo especial...", maxLength: 300 },
    { name: "audioUrl", label: "Música (opcional)", type: "file", accept: "audio/*", required: false },
    { name: "nombreCancion", label: "Nombre de la canción", type: "text", placeholder: "Ej. Flores Amarillas", enabledIf: "audioUrl" },
  ]
}