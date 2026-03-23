export const diaMujerConfig = {
  id: 'dia-mujer',
  name: 'Día de la Mujer',
  fields: [
    { name: 'nombre', label: 'Nombre de la chica', type: 'text', placeholder: 'Ej. María' },
    { name: 'fotos', label: 'Sube 3 fotos', type: 'file', multiple: true, accept: 'image/*' },
    { name: 'musica', label: 'Sube una canción (Opcional)', type: 'file', accept: 'audio/*' }
  ]
};