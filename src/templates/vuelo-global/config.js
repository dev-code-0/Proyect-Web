export const vueloGlobalConfig = {
  id: 'vuelo-global',
  name: 'Vuelo Global',
  defaultData: {
    origen:  { name: 'Lima, Perú',     lat: -12.0464, lng: -77.0428 },
    destino: { name: 'Chiclayo, Perú', lat:  -6.7714, lng: -79.8409 },
    mensaje: 'Cruzaría el mundo entero para llegar a ti.',
    para:    'Mi amor',
    tema:    'aurora',
  },
  temas: {
    aurora:    { primary: '#e879f9', trail: '#a855f7', glow: '#7c3aed' },
    oceano:    { primary: '#38bdf8', trail: '#0ea5e9', glow: '#0369a1' },
    sunset:    { primary: '#fb923c', trail: '#f97316', glow: '#ea580c' },
    esmeralda: { primary: '#34d399', trail: '#10b981', glow: '#059669' },
  },
  ui: {
    titulo:       'Vuelo Global',
    botonGuardar: 'Guardar y Compartir',
    modalTitulo:  'Has llegado',
  },
};
