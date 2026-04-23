export const CorazonCarruselConfig = {
    id: "corazon-carrusel",
    title: "Corazón Carrusel",
    fields: [
        { name: "nombre", label: "Nombre", type: "text", placeholder: "Ej. Luz" },
        { name: "fotos", label: "Suba sus imagenes", type: "file",accept:'image/*', multiple: true },
        { name: "music", label: "Suba su musica (opcional)", type: "file", accept:'audio/*', required: false },
    ]
};