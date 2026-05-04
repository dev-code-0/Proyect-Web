export const galaxiaMomentosConfig = {
  id: 'galaxia-momentos',
  name: 'Galaxia de Momentos',
  fields: [
    {
      name: 'titulo',
      label: 'Nombre de la constelación',
      type: 'text',
      placeholder: 'Ej. La Constelación de María',
    },
    {
      name: 'mensaje',
      label: 'Mensaje principal',
      type: 'textarea',
      placeholder: 'Ej. Cada foto es una estrella de nuestra historia...',
      maxLength: 400,
    },
    {
      name: 'firma',
      label: 'De parte de',
      type: 'text',
      placeholder: 'Ej. Con amor, Juan',
    },
    {
      name: 'fotos',
      label: 'Tus fotos (2 a 8 imágenes)',
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
        { value: 'cosmos',    label: '🔭 Cosmos — azul eléctrico' },
        { value: 'romantica', label: '🌹 Romántica — rosas y magenta' },
        { value: 'dorada',    label: '✨ Dorada — ámbar y oro' },
        { value: 'esmeralda', label: '🌿 Esmeralda — verde profundo' },
      ],
    },
    {
      name: 'musica',
      label: 'Música de fondo (Opcional)',
      type: 'file',
      accept: 'audio/*',
    },
  ],
};
