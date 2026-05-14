export const libroPopConfig = {
  id: "libro-pop",
  name: "Páginas de Amor",
  fields: [
    {name: 'titulo', label: 'Título del libro', type: 'text', placeholder: 'Ej. Nuestra Historia'},
    {name: 'nombre', label: 'Para:', type: 'text', placeholder: 'Ej. María, Mi amor, etc.'},
    {name: 'fotos', label: 'Sube tus fotos', type: 'file', multiple: true, accept: 'image/*'},
    {name: 'mensaje', label: 'Mensaje personal (Opcional)', type: 'textarea', placeholder: 'Ej. Este libro es para ti, porque cada momento a tu lado es único...', maxLength: 200},
  ]
}