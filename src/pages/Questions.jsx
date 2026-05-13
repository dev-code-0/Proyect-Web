import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/questions.css';

const FAQ_DATA = [
  {
    category: 'Uso de Plantillas',
    items: [
      {
        q: '¿Cómo personalizo una plantilla?',
        a: 'Elige la plantilla que más te guste desde el inicio, haz clic en "Personalizar" y completa los campos: fotos, texto y música. Cuando estés listo, guarda y recibirás un enlace único para compartir.',
      },
      {
        q: '¿Cómo puedo enviar mi regalo digital?',
        a: 'Al guardar tu regalo recibirás un enlace único. Puedes compartirlo por WhatsApp, Instagram, correo o cualquier red social. La persona solo necesita abrir el link — no tiene que instalarse nada.',
      },
      {
        q: '¿Qué pasa si mi link de regalo no carga?',
        a: 'Primero intenta recargar la página. Revisa que el enlace esté completo (sin cortes). Los regalos se almacenan sin fecha de vencimiento, así que si el link es correcto debería cargar. Si sigue fallando, escríbenos desde la sección de Sugerencias.',
      },
    ],
  },
  {
    category: 'Donaciones y Privacidad',
    items: [
      {
        q: '¿Es totalmente gratis?',
        a: 'Sí, completamente. Crear y enviar regalos no tiene ningún costo. El proyecto se mantiene gracias a las donaciones voluntarias de quienes quieren apoyarlo. Si te gustó la experiencia y quieres contribuir, puedes hacerlo desde la sección "Apóyanos".',
      },
      {
        q: '¿Cómo aparece el cargo en mi estado de cuenta?',
        a: 'Si realizas una donación, el cargo aparecerá como SORPRESAVIRT en tu estado de cuenta o historial de Yape. Es el identificador oficial del proyecto — no te asustes si lo ves ahí.',
      },
      {
        q: '¿Es seguro donar con Yape?',
        a: 'Sí. Donas directamente desde tu app de Yape — nosotros no procesamos ni almacenamos ningún dato de tu cuenta. El pago va íntegramente al proyecto, sin intermediarios de nuestra parte. Es el mismo proceso que cuando le pagas a cualquier negocio con Yape.',
      },
    ],
  },
  {
    category: 'Sugerencias',
    items: [
      {
        q: '¿Puedo pedir una plantilla personalizada?',
        a: 'Por ahora no hacemos diseños a pedido individual, pero si tienes una idea puedes enviarla desde la sección de Sugerencias. Las ideas con más demanda son las que priorizamos para crear.',
      },
      {
        q: '¿Cómo reporto un error o envío feedback?',
        a: 'Desde la sección "Enviar sugerencia" puedes escribirnos sobre cualquier fallo, mejora o comentario. Leemos todos los mensajes, aunque no siempre podamos responder individualmente.',
      },
    ],
  },
];

const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button
        className="faq-question"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className="faq-chevron">
          <ChevronIcon />
        </span>
      </button>
      <div className="faq-answer-wrap" aria-hidden={!open}>
        <div className="faq-answer-inner">
          <p className="faq-answer-text">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function Questions() {
  return (
    <div className="faq-page">
      <nav className="faq-nav">
        <Link to="/" className="faq-back">
          <ArrowLeftIcon />
          <span>Volver</span>
        </Link>
        <img src="/logo-horizontal.svg" alt="Sorpresa Virtual" className="faq-logo" width="130" height="40" />
      </nav>

      <section className="faq-hero">
        <h1 className="faq-title">Preguntas frecuentes</h1>
        <p className="faq-subtitle">
          Todo lo que necesitas saber para crear y compartir tus regalos digitales.
        </p>
      </section>

      <div className="faq-content">
        {FAQ_DATA.map((section) => (
          <section key={section.category} className="faq-section">
            <h2 className="faq-category">{section.category}</h2>
            <div className="faq-list">
              {section.items.map((item) => (
                <AccordionItem
                  key={item.q}
                  question={item.q}
                  answer={item.a}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="faq-banner">
        <p className="faq-banner-text">¿Aún tienes dudas?</p>
        <Link to="/suggestions" className="faq-banner-link">
          Escríbenos una sugerencia
        </Link>
      </div>
    </div>
  );
}
