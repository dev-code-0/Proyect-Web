export const hotWheelsConfig = {
  id: 'hot-wheels',
  name: 'Sorpresa Hot Wheels',
  fields: [
    { name: 'nombre', label: 'Para', type: 'text', placeholder: 'Ej. Carlos' },
    { name: 'mensaje', label: 'Mensaje personal', type: 'textarea', placeholder: 'Escribe tu mensaje aquí...', maxLength: 500, required: false },
    { name: 'remitente', label: 'Tu nombre (firma)', type: 'text', placeholder: 'Ej. María', required: false },
  ],
};
