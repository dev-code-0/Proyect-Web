export const rosaVirtualConfig = {
  id: 'rosa-virtual',
  name: 'Rosa Virtual',
  fields: [
    { name: 'nombre', label: 'Nombre o Apodo', type: 'text', placeholder: 'Ej. Ana' },
    { name: 'color', label: 'Color de la Rosa', type: 'select', options: [
      { value: 'red', label: 'Roja' },
      { value: 'orange', label: 'Naranja' },
      { value: 'violet', label: 'Violeta' },
      { value: 'yellow', label: 'Amarilla' },
      { value: 'blue', label: 'Celeste' },
      { value: 'white', label: 'Blanca' },
      { value: 'pink', label: 'Rosada' }
    ]},
    { name: 'intencion', label: 'Intención', type: 'select', options: [
      { value: 'para demostrarte mi amor', label: 'Mostrar Amor' },
      { value: 'para subirte los ánimos', label: 'Subir Ánimos' },
      { value: 'para darte las gracias', label: 'Dar las Gracias' },
      { value: 'para desearte feliz cumpleaños', label: 'Feliz Cumpleaños' }
    ]},
    { name: 'mensaje', label: 'Mensaje Adicional', type: 'text', placeholder: 'Escribe algo bonito...' }
  ]
};