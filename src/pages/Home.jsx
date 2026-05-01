import React from 'react';
import ActionButtons from '../components/ActionButtons';
import TemplateCarousel from '../components/TemplateCarousel';
import BackgroundAnimation from '../components/BackgroundAnimation';
import '../styles/home.css';
import { AntiInspectGuard } from '../lib/antiInspect';


export default function Home() {
  return (
    <AntiInspectGuard>
      <BackgroundAnimation />
      <main className="home-container">
        <div>
          <h1 className="main-title-home">CODES FREE</h1>
          <p className="subtitle-home">Crea regalos virtuales únicos y memorables</p>
        </div>
        <TemplateCarousel />
        <ActionButtons />
      </main>
    </AntiInspectGuard>
  );
}