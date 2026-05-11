import React from 'react';
import TemplateCarousel from '../components/TemplateCarousel';
import BackgroundAnimation from '../components/BackgroundAnimation';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import HowItWorks from '../components/HowItWorks';
import '../styles/home.css';

export default function Home() {
  return (
    <div className="home-layout">
      <BackgroundAnimation />

      {/* Header: logo | badge + tagline + sub | socials */}
      <SiteHeader />

      <main className="home-content">
        {/* Carousel de plantillas */}
        <TemplateCarousel />

        {/* Cómo funciona — debajo del carousel */}
        <HowItWorks />
      </main>

      {/* Footer discreto */}
      <SiteFooter />
    </div>
  );
}
