export const cajaMusicalConfig = {
  id: "caja-musical",
  name: "Caja Musical",
  fields:[
    {name: 'titulo', label: 'Título', type:'text', placeholder: 'Ej. Magia para ti'},
    {name: 'nombre', label: 'Para', type:'text', placeholder: 'Ej. Mi Princesa'},
    {name: 'fotos', label: 'Fotos', type:'file', accept:'image/*', multiple: true},
    {name: 'song', label: 'Música (opcional)', type:'file', accept:'audio/*', required: false},

  ]
}