export const floresAmarillasConfig = {
  id: 'flores-amarillas',
  name: 'Flores Amarillas',
  fields:[
    {name: 'de', label: 'De', type: 'text', placeholder: 'Tu nombre'},
    {name: 'nombre', label: 'Para', type: 'text', placeholder: 'Nombre a quien va dirigido el mensaje'},
    {name: 'foto', label: 'Sube tus fotos', type: 'file', multiple: true, accept: 'image/*', maxFiles: 10},
    {name: 'caption', label: 'Escribe tu mensaje', type: 'textarea', placeholder: 'Escribe el mensaje que ira debajod e cada foto'},
    {name: 'startDate', label: 'Fecha de inicio', type: 'date'},
    {name: 'whatsappNumber', label: 'Número de WhatsApp', type: 'tel', placeholder: 'Número de teléfono', inputMode: 'numeric', pattern: '[0-9]*', onlyDigits: true},
    {name: 'audioUrl', label: 'Sube tu musica (opcional)', type: 'file', accept: 'audio/*', required: false},
  ]
}