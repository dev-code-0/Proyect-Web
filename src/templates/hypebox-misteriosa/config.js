export const hypeboxMisteriosaConfig = {
  id: "hypebox-misteriosa",
  name: "Hypebox Misteriosa",
    fields: [ 
        { name: "nombre",       label: "Tu nombre",                     type: "text", placeholder: "Ej. Luis" },
        { name: "remitente",    label: "Nombre a quien va dirigido",    type: "text", placeholder: "Ej. Maria" },
        { name: "mensaje_corto",label: "Mensaje corto para la portada", type: "text", placeholder: "Ej. ¡Este regalo es para ti!" },
        { name: "fotos",        label: "Sube 3 fotos (Opcional)",       type: "file", multiple: true, accept: "image/*" },
        { name: "audio",        label: "Sube una canción (Opcional)",   type: "file", accept: "audio/*" }
    ]
}