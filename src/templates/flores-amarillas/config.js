export const floresAmarillasConfig = {
  id: 'flores-amarillas',
  name: 'Flores Amarillas',
  fields:[
    {name: 'nombre', label: 'Para', type: 'text', placeholder: 'Nombre a quien va dirigido el mensaje'},
    {name: 'de', label: 'De', type: 'text', placeholder: 'Tu nombre'},
    {name: 'foto', label: 'Sube tus fotos', type: 'file', multiple: true, accept: 'image/*'},
    {name: 'caption', label: 'Escribe tu mensaje', type: 'textarea', placeholder: 'Escribe el mensaje que ira debajod e cada foto'}
  ]
}