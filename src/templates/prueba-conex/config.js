export const pruebaConexConfig = {
    id: 'viernes-13',
    name: 'Viernes 13',
    fields: [
        { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej. María' },
        { name: 'mensaje', label: 'Mensaje (Opcional)', type: 'textarea', placeholder: 'Un viernes 13 que se convirtió en mi suerte infinita...', maxLength: 300, required: false },
        { name: 'fotos', label: 'Fotos (máximo 5)', type: 'file', accept: 'image/*', multiple: true, maxFiles: 5 },
        { name: 'music', label: 'Canción (Opcional)', type: 'file', accept: 'audio/*', required: false },
        { name: 'paleta', label: 'Paleta de color', type: 'select', options: [
            { value: 'rosa-cyan',      label: 'Rosa y Cyan (original)' },
            { value: 'violeta-dorado', label: 'Violeta y Dorado' },
            { value: 'rojo-blanco',    label: 'Rojo y Blanco' },
        ]},
    ],
};
