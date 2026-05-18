export const fuegosAmorConfig = {
  id: "corazon-mensaje",
  name: "Fuegos de Amor",
  fields: [
    { name: 'nombre',  label: 'Para',                 type: 'text',  placeholder: 'Ej. Mi amor' },
    { name: 'mensaje', label: 'Mensaje personal',      type: 'text',  placeholder: 'Ej. Eres lo mejor que me ha pasado', required: false },
    { name: 'song',    label: 'Musica de fondo (opcional)', type: 'file', accept: 'audio/*', required: false },
  ]
};
