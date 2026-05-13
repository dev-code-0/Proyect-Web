export const diaMujerConfig = {
  id: 'dia-mujer',
  name: 'Día de la Mujer',
  fields: [
    { name: 'nombre', label: 'Nombre de ella', type: 'text', placeholder: 'Ej. María' },
    {
      name: 'mensaje',
      label: 'Tu mensaje personal (Opcional)',
      type: 'textarea',
      placeholder: 'Ej. Gracias por ser mi fuerza cada día...',
      maxLength: 300,
      required: false,
    },
    { name: 'fotos', label: 'Sube tus fotos', type: 'file', multiple: true, accept: 'image/*' },
    { name: 'musica', label: 'Sube una canción (Opcional)', type: 'file', accept: 'audio/*', required: false },
  ],
};
