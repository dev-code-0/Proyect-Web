import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { AntiInspectGuard } from './lib/antiInspect';
import './styles/global.css';

const Home     = lazy(() => import('./pages/Home'));
const Preview  = lazy(() => import('./pages/Preview'));
const ViewGift = lazy(() => import('./pages/ViewGift'));
const NotFound = lazy(() => import('./components/NotFound'));

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--bg)',
    color: 'var(--accent)', fontSize: '0.9rem',
    fontFamily: 'var(--font-text)', letterSpacing: '0.5px',
  }}>
    Cargando...
  </div>
);

const CrashFallback = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    padding: '48px 24px', background: 'var(--bg)', gap: '16px',
    fontFamily: 'var(--font-text)',
  }}>
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none"
      stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
    <p style={{
      fontSize: '1.4rem', color: 'var(--accent)',
      fontFamily: 'var(--font-title)', margin: 0,
    }}>
      Algo salió mal
    </p>
    <p style={{
      fontSize: '0.86rem', color: 'oklch(55% 0.04 310)',
      maxWidth: '300px', lineHeight: 1.6, margin: 0,
    }}>
      Ocurrió un error inesperado. Por favor recarga la página.
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        marginTop: '8px', padding: '12px 30px', borderRadius: '14px',
        cursor: 'pointer', background: 'var(--accent)', color: '#fff',
        border: 'none', fontWeight: 700, fontSize: '0.9rem',
        fontFamily: 'var(--font-button)',
      }}
    >
      Recargar página
    </button>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Sentry.ErrorBoundary fallback={<CrashFallback />}>
        <AntiInspectGuard enabled={!import.meta.env.DEV}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/template/:id" element={<Preview />} />
              <Route path="/view/:id" element={<ViewGift />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AntiInspectGuard>
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
