export const galaxiaMomentosConfig = {
  id: 'galaxia-momentos',
  name: 'Galaxia de Momentos',
  fields: [
    {
      name: 'titulo',
      label: 'Nombre de tu galaxia',
      type: 'text',
      placeholder: 'Ej. Nuestra Galaxia',
      defaultValue: 'Galaxia de Momentos',
    },
    {
      name: 'mensaje',
      label: 'Mensaje principal',
      type: 'textarea',
      placeholder: 'Ej. Cada foto es una estrella de nuestra historia...',
      maxLength: 300,
    },
    {
      name: 'para',
      label: 'Para (nombre del destinatario)',
      type: 'text',
      placeholder: 'Ej. Ana',
    },
    {
      name: 'fotos',
      label: 'Tus fotos (1 a 8 imágenes)',
      type: 'file',
      multiple: true,
      accept: 'image/*',
      maxFiles: 8,
    },
    {
      name: 'tema',
      label: 'Color de galaxia',
      type: 'select',
      options: [
        { value: 'romantica', label: 'Romántica — rosas y magenta' },
        { value: 'cosmos',    label: 'Cosmos — azul eléctrico' },
        { value: 'dorada',    label: 'Dorada — ámbar y oro' },
        { value: 'esmeralda', label: 'Esmeralda — verde profundo' },
      ],
    },
    {
      name: 'musica',
      label: 'Música de fondo (Opcional)',
      type: 'file',
      accept: 'audio/*',
      required: false,
    },
  ],
};
