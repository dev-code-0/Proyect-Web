import { useEffect } from 'react';

// Esta función recibe un arreglo de links de imágenes y las pre-carga
export default function usePreloadImages(imageUrls) {
  useEffect(() => {
    if (imageUrls && imageUrls.length > 0) {
      imageUrls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });
    }
  }, [imageUrls]);
}