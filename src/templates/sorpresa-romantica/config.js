export const sorpresaRomanticaConfig={
    id:'sorpresa-romantica',
    name: 'Sorpresa Romántica',
    fields:[
        {name: 'nombre', label: 'Para', type:'text', placeholder: 'Ej. Su nombre de cariño', require: true},
        {name: 'fecha', label: 'Fecha especial', type:'date'},
        {name : 'fotos', label: 'Suba una imagen', type:'file', accept:'image/*', multiple: true},
        {name: 'carta', label: 'Textos personalizados (Opcional)', type:'text', placeholder: 'Ej. He diseñado este pequeño espacio pensando en ti...', require: false},
        {name: 'audio', label: 'Suba una canción (Opcional)', type:'file', accept:'audio/*', require: false},
    ]
}