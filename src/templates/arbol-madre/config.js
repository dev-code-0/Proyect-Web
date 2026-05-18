export const arbolMadreConfig = {
  id: 'arbol-madre',
  name: 'Árbol de Momentos',
  fields: [
    {
      name: 'titulo',
      label: 'Nombre del árbol',
      type: 'text',
      placeholder: 'Ej. Nuestro Árbol',
      defaultValue: 'Árbol de Momentos',
    },
    {
      name: 'mensaje',
      label: 'Tu mensaje',
      type: 'textarea',
      placeholder: 'Escribe un mensaje especial...',
      maxLength: 300,
    },
    {
      name: 'para',
      label: '¿A quién va dedicado?',
      type: 'text',
      placeholder: 'Ej. Sofía, Mi amor, Papá...',
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
