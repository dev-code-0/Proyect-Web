export const cajaMusicalConfig = {
  id: "caja-musical",
  name: "Caja Musical",
  fields:[
    {name: 'nombre', label: 'Para', type:'text', placeholder: 'Ej. Mi Princesa'},
    {name: 'titulo', label: 'Título', type:'text', placeholder: 'Ej. Magia para ti'},
    {name: 'mensaje', label: 'Mensaje', type:'textarea', placeholder: 'Ej. En esta cajita de cristal guardo nuestros recuerdos más hermosos...'},
    {name: 'fotos', label: 'Fotos', type:'file', accept:'image/*', multiple: true},

  ]
}