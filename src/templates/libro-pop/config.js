export const libroPopConfig = {
  id: "libro-pop",
  name: "Libro Pop-up",
  fields: [
    {name: 'titulo', label: 'Título del libro', type: 'text', placeholder: 'Ej. Nuestra Historia'},
    {name: 'nombre', label: 'Para: ', type: 'text', placeholder: 'Ej. María, Mi amor, etc.'},
    {name: 'fotos', label: 'Sube tus fotos', type: 'file', multiple: true, acceept: 'image/*'},
  ] 
}