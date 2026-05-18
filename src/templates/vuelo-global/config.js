export const vueloGlobalConfig = {
  id: 'vuelo-global',
  name: 'Encuentro Mágico',
  fields: [
    {
      name: 'origen',
      label: 'Ciudad de Origen',
      type: 'city', // El usuario deberá implementar este tipo en su constructor usando CitySearch.jsx
      placeholder: 'Ej. Lima, Perú',
      defaultValue: { name: 'Lima, Perú', lat: -12.0464, lng: -77.0428 },
    },
    {
      name: 'destino',
      label: 'Ciudad de Destino',
      type: 'city',
      placeholder: 'Ej. Chiclayo, Perú',
      defaultValue: { name: 'Chiclayo, Perú', lat: -6.7714, lng: -79.8409 },
    },
    {
      name: 'para',
      label: 'Para (destinatario)',
      type: 'text',
      placeholder: 'Ej. Mi amor',
      defaultValue: 'Mi amor',
    },
    {
      name: 'mensaje',
      label: 'Mensaje especial',
      type: 'textarea',
      placeholder: 'Escribe un mensaje inolvidable...',
      defaultValue: 'Cruzaría el mundo entero para llegar a ti.',
      maxLength: 200,
    },
    {
      name: 'tema',
      label: 'Tema de color',
      type: 'select',
      options: [
        { value: 'aurora',    label: 'Aurora (Morado/Rosado)' },
        { value: 'oceano',    label: 'Océano (Azul/Celeste)' },
        { value: 'sunset',    label: 'Sunset (Naranja/Rojo)' },
        { value: 'esmeralda', label: 'Esmeralda (Verdes)' },
      ],
      defaultValue: 'aurora',
    },
    {
      name: 'musica',
      label: 'Música de fondo (Opcional)',
      type: 'file',
      accept: 'audio/*',
      required: false,
    },
  ],
  temas: {
    aurora:    { primary: '#e879f9', trail: '#a855f7', glow: '#7c3aed', mapBase: 'carto-dark' },
    oceano:    { primary: '#38bdf8', trail: '#0ea5e9', glow: '#0369a1', mapBase: 'carto-dark' },
    sunset:    { primary: '#fb923c', trail: '#f97316', glow: '#ea580c', mapBase: 'carto-dark' },
    esmeralda: { primary: '#34d399', trail: '#10b981', glow: '#059669', mapBase: 'carto-dark' },
  },
};