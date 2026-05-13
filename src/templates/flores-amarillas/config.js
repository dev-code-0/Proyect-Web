export const floresAmarillasConfig = {
  id: 'flores-amarillas',
  name: 'Carta de Amor',
  fields:[
    {name: 'de', label: 'De', type: 'text', placeholder: 'Tu nombre'},
    {name: 'nombre', label: 'Para', type: 'text', placeholder: 'Nombre a quien va dirigido el mensaje'},
    {name: 'foto', label: 'Sube tus fotos', type: 'file', multiple: true, accept: 'image/*', maxFiles: 10},
    {name: 'caption', label: 'Mensaje debajo de las fotos', type: 'textarea', placeholder: 'Un texto que aparecerá debajo de cada foto'},
    {name: 'distanceMessage', label: 'Frase principal', type: 'textarea', placeholder: 'La distancia no es un obstáculo para el amor verdadero...'},
    {name: 'loveLetterMessage', label: 'Carta de amor', type: 'textarea', placeholder: 'Quería encontrar las palabras exactas para expresar lo que siente mi corazón...'},
    {name: 'startDate', label: 'Fecha de inicio', type: 'date'},
    {name: 'whatsappNumber', label: 'Número de WhatsApp', type: 'tel', placeholder: 'Número de teléfono', inputMode: 'numeric', pattern: '[0-9]*', onlyDigits: true},
    {name: 'audioUrl', label: 'Sube tu musica (opcional)', type: 'file', accept: 'audio/*', required: false},
  ]
}