import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      output: {
        // Keep vendor libraries in stable chunks for better long-term browser caching.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (
            id.includes('react-router-dom') ||
            id.includes('/react/') ||
            id.includes('/react-dom/')
          ) {
            return 'react-vendor';
          }
          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }
          if (
            id.includes('maplibre-gl') ||
            id.includes('@turf/') ||
            id.includes('react-map-gl')
          ) {
            return 'geo-vendor';
          }
          if (id.includes('/three/')) {
            return 'threejs-vendor';
          }
          if (id.includes('/animejs/')) {
            return 'animejs-vendor';
          }
          if (id.includes('/swiper/')) {
            return 'swiper-vendor';
          }
          if (
            id.includes('/canvas-confetti/') ||
            id.includes('/qr-code-styling/')
          ) {
            return 'ui-vendor';
          }
          return 'vendor';
        },
      },
    },
  },
});