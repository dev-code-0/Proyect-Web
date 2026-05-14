export const corazonAnimadoConfig = {
    id: 'corazon-animado',
    name: 'Corazón de Luz',
    fields: [
        { name: 'nombre', label: 'Para', type: 'text', placeholder: 'Ej. María' },
        { name: 'mensaje', label: 'Mensaje personal', type: 'textarea', placeholder: 'Escribe tu mensaje aquí...', maxLength: 500, required: false },
        { name: 'firma', label: 'Firma (tu nombre)', type: 'text', placeholder: 'Ej. Con amor, Juan', required: false },
        { name: 'music', label: 'Música (opcional)', type: 'file', accept: 'audio/*', required: false },
    ],
};