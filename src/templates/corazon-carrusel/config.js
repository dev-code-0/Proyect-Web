export const CorazonCarruselConfig = {
    id: "corazon-carrusel",
    title: "Latidos de Amor",
    fields: [
        { name: "nombre",      label: "Nombre de tu persona especial",         type: "text",     placeholder: "Ej. Luz" },
        { name: "mensaje",     label: "Agrega tu mensaje al final (opcional)",  type: "textarea", placeholder: "Escribe algo tuyo aquí...", required: false, maxLength: 300 },
        { name: "dedicatoria", label: "Firma o dedicatoria al final (opcional)",type: "text",     placeholder: "Ej. Con todo mi amor, siempre — Juan", required: false },
        { name: "fotos",       label: "Sube sus fotos juntos",                  type: "file",     accept: "image/*", multiple: true },
        { name: "music",       label: "Sube tu música (opcional)",              type: "file",     accept: "audio/*", required: false },
    ],
};
