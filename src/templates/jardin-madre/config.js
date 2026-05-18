export const jardinMadreConfig = {
  id: 'jardin-madre',
  name: 'Jardín de Recuerdos',
  fields: [
    {
      name: 'titulo',
      label: 'Nombre del jardín',
      type: 'text',
      placeholder: 'Ej. El Jardín de Ana',
      defaultValue: 'Jardín de Recuerdos',
    },
    {
      name: 'mensaje',
      label: 'Mensaje especial',
      type: 'textarea',
      placeholder: 'Escribe un mensaje especial...',
      maxLength: 300,
    },
    {
      name: 'de',
      label: 'De (tu nombre)',
      type: 'text',
      placeholder: 'Ej. Tu nombre',
    },
    {
      name: 'para',
      label: 'Para (nombre de la persona)',
      type: 'text',
      placeholder: 'Ej. Ana, mi amor, la familia...',
    },
    {
      name: 'fotos',
      label: 'Fotos (1 a 8 imágenes)',
      type: 'file',
      multiple: true,
      accept: 'image/*',
      maxFiles: 8,
    },
    {
      name: 'tema',
      label: 'Color del jardín',
      type: 'select',
      options: [
        { value: 'rosas',     label: 'Rosas — rosa y magenta' },
        { value: 'girasoles', label: 'Girasoles — dorado y ámbar' },
        { value: 'lavanda',   label: 'Lavanda — violeta y lila' },
        { value: 'primavera', label: 'Primavera — verde esmeralda' },
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
