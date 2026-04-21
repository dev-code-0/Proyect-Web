import React from 'react';
import ActionButtons from '../components/ActionButtons';
import TemplateCarousel from '../components/TemplateCarousel';
import '../styles/home.css';
import { AntiInspectGuard } from '../lib/antiInspect';


export default function Home() {
  return (
    <AntiInspectGuard> 
      <div>
      <main className="home-container">
        <h1 className="main-title-home">CODES FREE</h1>
        {/* Carrusel Dinámico */}
          <TemplateCarousel />
        <ActionButtons />
      </main>
      </div>
    </AntiInspectGuard>
  );
}