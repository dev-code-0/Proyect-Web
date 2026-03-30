import React from 'react';
import ActionButtons from '../components/ActionButtons';
import TemplateCarousel from '../components/TemplateCarousel';
import '../styles/home.css';

export default function Home() {
  return (
    <main className="home-container">
      <h1 className="main-title">CODES FREE</h1>
      
      {/* Carrusel Dinámico */}
        <TemplateCarousel />
      

      <ActionButtons />
    </main>
  );
}