import React from 'react';
import { Link } from 'react-router-dom';
import { templates } from '../lib/templates';
import '../styles/carousel.css';

export default function TemplateCarousel() {
  return (
    <div className="carousel-container">
      {templates.map((template) => (
        <Link 
          to={`/template/${template.id}`} 
          key={template.id} 
          className="carousel-card"
        >
          <img src={template.image} alt={template.title} className="carousel-img" />
          <div className="carousel-title">{template.title}</div>
        </Link>
      ))}
    </div>
  );
}