import React from 'react';
import '../styles/how-it-works.css';

const steps = [
  {
    num: '01',
    label: 'Elige',
    desc: 'Selecciona la plantilla perfecta para la ocasión',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    num: '02',
    label: 'Personaliza',
    desc: 'Agrega fotos, música y tu mensaje especial',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>
      </svg>
    ),
  },
  {
    num: '03',
    label: 'Comparte',
    desc: 'Envía el enlace y sorprende a quien más quieres',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works" aria-label="Cómo funciona">
      <div className="steps-row">
        {steps.map((step, i) => (
          <React.Fragment key={step.num}>
            <div className="step">
              <div className="step-icon">{step.icon}</div>
              <div className="step-text">
                <span className="step-num">{step.num}</span>
                <strong className="step-label">{step.label}</strong>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="step-connector" aria-hidden="true">
                <svg width="24" height="2" viewBox="0 0 24 2" fill="none">
                  <line x1="0" y1="1" x2="24" y2="1" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4"/>
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
