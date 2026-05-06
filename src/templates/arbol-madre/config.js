export const arbolMadreConfig = {
  id: 'arbol-madre',
  name: 'Árbol de Momentos — Mamá',
  fields: [
    {
      name: 'titulo',
      label: 'Nombre del árbol',
      type: 'text',
      placeholder: 'Ej. El Árbol de Mamá',
      defaultValue: 'Árbol de Momentos',
    },
    {
      name: 'mensaje',
      label: 'Mensaje para mamá',
      type: 'textarea',
      placeholder: 'Escribe un mensaje especial...',
      maxLength: 300,
    },
    {
      name: 'para',
      label: 'Para (nombre de mamá)',
      type: 'text',
      placeholder: 'Ej. Mamá',
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
      label: 'Tipo de árbol',
      type: 'select',
      options: [
        { value: 'cerezo', label: 'Cerezo — flores rosas' },
        { value: 'roble',  label: 'Roble — hojas verdes' },
        { value: 'otono',  label: 'Otoño — hojas naranjas' },
        { value: 'noche',  label: 'Noche — hojas azules' },
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
