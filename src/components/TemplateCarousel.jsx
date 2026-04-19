import React from 'react';
import { Link } from 'react-router-dom';
import { templates } from '../lib/templates';
import '../styles/carousel.css';

export default function TemplateCarousel() {
  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.currentTarget.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  return (
    <div className="carousel-shell">
      <div className="carousel-viewport">
        <div className="carousel-container" onWheel={handleWheel}>
          <div className="carousel-track">
            {templates.map((template) => (
              <Link
                to={`/template/${template.id}`}
                key={template.id}
                className="carousel-card"
              >
                <img src={template.image} alt={template.title} className="carousel-img" />
                <p className="carousel-text">{template.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}