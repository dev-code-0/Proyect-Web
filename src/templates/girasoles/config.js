export const girasolesConfig = {
  id: 'girasoles',
  name: 'Girasoles para Ti',
  fields: [
    { name: 'nombre', label: 'Para', type: 'text', placeholder: 'Ej. María' },
    { name: 'mensaje', label: 'Agrega algo personal (opcional)', type: 'textarea', placeholder: 'Escribe algo especial para agregar al final...', maxLength: 400 },
    { name: 'dedicatoria', label: 'Firma', type: 'text', placeholder: 'Ej. Con todo mi amor' },
    { name: 'audioUrl', label: 'Música (opcional)', type: 'file', accept: 'audio/*', required: false },
  ],
};
