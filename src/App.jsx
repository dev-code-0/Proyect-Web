import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import './styles/global.css';

const Home     = lazy(() => import('./pages/Home'));
const Preview  = lazy(() => import('./pages/Preview'));
const ViewGift = lazy(() => import('./pages/ViewGift'));

const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'white' }}>
    Cargando...
  </div>
);

const CrashFallback = () => (
  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'white' }}>
    <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Algo salió mal. Por favor recarga la página.</p>
    <button
      onClick={() => window.location.reload()}
      style={{ padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', background: 'white', color: '#333', border: 'none', fontWeight: 600 }}
    >
      Recargar
    </button>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Sentry.ErrorBoundary fallback={<CrashFallback />}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/template/:id" element={<Preview />} />
            <Route path="/view/:id" element={<ViewGift />} />
          </Routes>
        </Suspense>
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
