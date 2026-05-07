import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import * as turf from '@turf/turf';

export function useMapAnimation({ origen, destino, isPreview }) {
  const { current: map } = useMap();
  const [arrived, setArrived] = useState(false);
  const [routeGeojson, setRouteGeojson] = useState(null);
  const [vehiclePos, setVehiclePos] = useState(null);
  const [vehicleBearing, setVehicleBearing] = useState(0);
  const [isCar, setIsCar] = useState(false);
  
  const animRef = useRef(null);

  useEffect(() => {
    if (!map || !origen || !destino) return;

    // Reset state
    setArrived(false);
    cancelAnimationFrame(animRef.current);

    const p1 = [origen.lng, origen.lat];
    const p2 = [destino.lng, destino.lat];

    let mounted = true;

    const initAnimation = async () => {
      // Definir segmentos del viaje
      const segments = [];
      
      // 1. Origen exacto -> Origen ciudad (Auto)
      if (origen.exactLat && (origen.exactLat !== origen.lat || origen.exactLng !== origen.lng)) {
        segments.push({ type: 'car', pA: [origen.exactLng, origen.exactLat], pB: p1 });
      }

      // 2. Origen ciudad -> Destino ciudad (Auto o Avión según distancia)
      const distMain = turf.distance(p1, p2, { units: 'kilometers' });
      segments.push({ type: distMain < 100 ? 'car' : 'plane', pA: p1, pB: p2 });

      // 3. Destino ciudad -> Destino exacto (Auto)
      if (destino.exactLat && (destino.exactLat !== destino.lat || destino.exactLng !== destino.lng)) {
        segments.push({ type: 'car', pA: p2, pB: [destino.exactLng, destino.exactLat] });
      }
      // Obtener rutas para todos los segmentos
      const allFeatures = [];
      for (let seg of segments) {
        if (seg.type === 'car') {
          try {
            const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${seg.pA[0]},${seg.pA[1]};${seg.pB[0]},${seg.pB[1]}?geometries=geojson`);
            const data = await res.json();
            if (data.routes && data.routes[0]) {
              seg.route = turf.feature(data.routes[0].geometry);
            } else {
              seg.route = turf.lineString([seg.pA, seg.pB]);
            }
          } catch (e) {
            seg.route = turf.lineString([seg.pA, seg.pB]);
          }
        } else {
          seg.route = turf.greatCircle(seg.pA, seg.pB, { npoints: 100 });
        }
        seg.distance = turf.length(seg.route);
        seg.duration = Math.max(5000, Math.min(seg.distance * 5, 15000));
        allFeatures.push(seg.route);
      }
      
      if (!mounted) return;

      const fullGeojson = turf.featureCollection(allFeatures);
      setRouteGeojson(fullGeojson);
      setVehiclePos(segments[0].pA);
      setIsCar(segments[0].type === 'car');

      if (isPreview) {
        const bbox = turf.bbox(fullGeojson);
        map.fitBounds(bbox, { padding: 100, duration: 1000 });
        return;
      }

      // Animación secuencial
      let currentSegIndex = 0;
      let startTime = null;

      const startSegment = (index) => {
        if (!mounted) return;
        const seg = segments[index];
        setIsCar(seg.type === 'car');
        startTime = null;

        const basePlaneZoom = seg.distance > 4000 ? 3.5 : (seg.distance > 1000 ? 4.5 : 5.5);

        // Volar al inicio del segmento
        map.flyTo({
          center: seg.pA,
          zoom: seg.type === 'car' ? 12 : basePlaneZoom,
          pitch: seg.type === 'car' ? 45 : 0,
          duration: 1500,
          essential: true
        });

        const animate = (timestamp) => {
          if (!mounted) return;
          if (!startTime) startTime = timestamp;
          const progress = (timestamp - startTime) / seg.duration;

          if (progress >= 1) {
            // Fin de este segmento
            if (index + 1 < segments.length) {
              // Siguiente segmento
              currentSegIndex++;
              setTimeout(() => startSegment(currentSegIndex), 500);
            } else {
              // Viaje completo
              setVehiclePos(seg.pB);
              setArrived(true);
              map.flyTo({
                center: seg.pB,
                zoom: seg.type === 'car' ? 14 : basePlaneZoom + 0.5,
                pitch: 0,
                duration: 2000,
              });
            }
            return;
          }

          const currentDistance = seg.distance * progress;
          const point = turf.along(seg.route, currentDistance);
          const nextPoint = turf.along(seg.route, Math.min(currentDistance + 10, seg.distance));
          
          const coords = point.geometry.coordinates;
          setVehiclePos(coords);
          setVehicleBearing(turf.bearing(point, nextPoint));

          map.jumpTo({
            center: coords,
            zoom: seg.type === 'car' ? 12 : basePlaneZoom + Math.sin(progress * Math.PI) * 1.5,
            pitch: seg.type === 'car' ? 45 : 0,
            bearing: 0
          });

          animRef.current = requestAnimationFrame(animate);
        };

        const timeout = setTimeout(() => {
          if (!mounted) return;
          animRef.current = requestAnimationFrame(animate);
        }, 1800);
        animRef.current = timeout;
      };

      startSegment(0);
    };

    initAnimation();

    return () => {
      mounted = false;
      if (typeof animRef.current === 'number') clearTimeout(animRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, [map, origen, destino, isPreview]);

  return { arrived, routeGeojson, vehiclePos, vehicleBearing, isCar };
}
