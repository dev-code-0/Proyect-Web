import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useMap } from 'react-map-gl/maplibre';
import * as turf from '@turf/turf';

export function useMapAnimation({ origen, destino, started }) {
  const { current: map } = useMap();
  const [arrived, setArrived] = useState(false);
  const [routeGeojson, setRouteGeojson] = useState(null);
  const [vehiclePos, setVehiclePos] = useState(null);
  const [vehicleBearing, setVehicleBearing] = useState(0);
  const [currentVehicleType, setCurrentVehicleType] = useState('plane'); // 'car' | 'plane'
  
  const animRef = useRef(null);

  useEffect(() => {
    if (!map || !origen || !destino) return;

    setArrived(false);
    if (typeof animRef.current === 'number') clearTimeout(animRef.current);
    cancelAnimationFrame(animRef.current);

    const exactStart = [origen.exactLng || origen.lng, origen.exactLat || origen.lat];
    const exactEnd = [destino.exactLng || destino.lng, destino.exactLat || destino.lat];
    const cityStart = [origen.lng, origen.lat];
    const cityEnd = [destino.lng, destino.lat];

    const totalDistance = turf.distance(exactStart, exactEnd, { units: 'kilometers' });
    const isShortTrip = totalDistance < 400; // Umbral de 400km

    let mounted = true;

    // Helper to fetch route from OSRM with 3s timeout Fallback
    const getCarRoute = async (pA, pB) => {
      // Si la distancia es cortísima, devolvemos una línea recta para ahorrar API
      if (turf.distance(pA, pB, { units: 'kilometers' }) < 0.5) {
        return { route: turf.lineString([pA, pB]), distance: 0.5 };
      }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${pA[0]},${pA[1]};${pB[0]},${pB[1]}?overview=full&geometries=geojson`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          const route = turf.feature(data.routes[0].geometry);
          return { route, distance: data.routes[0].distance / 1000 };
        }
      } catch (e) {
        // Fallback silently
      }
      // Fallback: simple line if OSRM is down
      return { route: turf.lineString([pA, pB]), distance: turf.distance(pA, pB, { units: 'kilometers' }) };
    };

    const initAnimation = async () => {
      const segments = [];

      if (isShortTrip) {
        // Only car
        const carData = await getCarRoute(exactStart, exactEnd);
        segments.push({ type: 'car', ...carData, duration: Math.max(6000, Math.min(carData.distance * 950, 25000)) });
      } else {
        // Multi-modal
        // 1. Car: Exact Start -> City Start
        if (turf.distance(exactStart, cityStart) > 2) {
          const carData1 = await getCarRoute(exactStart, cityStart);
          segments.push({ type: 'car', ...carData1, duration: Math.max(4000, Math.min(carData1.distance * 950, 10000)) });
        }

        // 2. Plane: City Start -> City End
        const planeRoute = turf.greatCircle(cityStart, cityEnd, { npoints: 150 });
        const planeDist = turf.distance(cityStart, cityEnd);
        segments.push({ type: 'plane', route: planeRoute, distance: planeDist, duration: Math.max(4000, Math.min(planeDist * 1.5, 10000)) });

        // 3. Car: City End -> Exact End
        if (turf.distance(cityEnd, exactEnd) > 2) {
          const carData2 = await getCarRoute(cityEnd, exactEnd);
          segments.push({ type: 'car', ...carData2, duration: Math.max(4000, Math.min(carData2.distance * 950, 10000)) });
        }
      }

      if (!mounted) return;

      const fullRouteFeatures = segments.map(s => s.route);
      setRouteGeojson(turf.featureCollection(fullRouteFeatures));
      
      setVehiclePos(segments[0].route.geometry.coordinates[0]);
      setCurrentVehicleType(segments[0].type);

      if (!started) {
        // Just fit bounds to show the journey context
        const bbox = turf.bbox(turf.featureCollection(fullRouteFeatures));
        map.fitBounds(bbox, { padding: 60, duration: 1000 });
        return;
      }

      let currentSegIndex = 0;

      const playSegment = (idx) => {
        if (!mounted) return;
        const seg = segments[idx];
        setCurrentVehicleType(seg.type);

        const startCoord = seg.route.geometry.coordinates[0];
        const endCoord = seg.route.geometry.coordinates[seg.route.geometry.coordinates.length - 1];
        
        // Dynamic camera parameters
        const zoomLevel = seg.type === 'car' ? 11.5 : (seg.distance > 2000 ? 4 : 5);
        const pitchLevel = seg.type === 'car' ? 55 : 30;

        map.flyTo({
          center: startCoord,
          zoom: zoomLevel,
          pitch: pitchLevel,
          bearing: 0,
          duration: 1500,
          essential: true
        });

        let startTime = null;
        // Variables para la cámara "Dron" (Chase Camera)
        let cameraLng = startCoord[0];
        let cameraLat = startCoord[1];

        const animate = (timestamp) => {
          if (!mounted) return;
          if (!startTime) startTime = timestamp;
          const progress = (timestamp - startTime) / seg.duration;

          if (progress >= 1) {
            // Segment ended
            if (idx + 1 < segments.length) {
              currentSegIndex++;
              setTimeout(() => playSegment(currentSegIndex), 300);
            } else {
              // Journey ended
              setVehiclePos(endCoord);
              setArrived(true);
              // Alejar la cámara para ver toda la ruta recorrida
              const routeBbox = turf.bbox(turf.featureCollection(segments.map(s => s.route)));
              map.fitBounds(routeBbox, {
                padding: 100,
                pitch: 15,
                bearing: 0,
                duration: 3500,
              });
            }
            return;
          }

          const currentDistance = seg.distance * progress;
          const point = turf.along(seg.route, currentDistance, { units: 'kilometers' });
          // Buscar un poco más adelante (0.15km) para que el carro gire suavemente en curvas
          const nextPoint = turf.along(seg.route, Math.min(currentDistance + (seg.type === 'car' ? 0.15 : 30), seg.distance), { units: 'kilometers' });
          
          const coords = point.geometry.coordinates;
          const bearing = turf.bearing(point, nextPoint);
          
          // Usar flushSync para eliminar el retraso (lag) de 1 frame de React
          flushSync(() => {
            setVehiclePos(coords);
            setVehicleBearing(bearing);
          });

          // Lerp (Interpolación Lineal) para la cámara. 
          // Hace que la cámara siga al carro suavemente, absorbiendo curvas bruscas y tirones.
          const lerpFactor = seg.type === 'car' ? 0.05 : 0.2;
          cameraLng = cameraLng + (coords[0] - cameraLng) * lerpFactor;
          cameraLat = cameraLat + (coords[1] - cameraLat) * lerpFactor;

          const dynamicZoom = seg.type === 'car' 
            ? zoomLevel 
            : zoomLevel + Math.sin(progress * Math.PI) * 1.2;
            
          const dynamicPitch = seg.type === 'car'
            ? pitchLevel
            : pitchLevel + Math.sin(progress * Math.PI) * 15;

          map.jumpTo({
            center: [cameraLng, cameraLat],
            zoom: dynamicZoom,
            pitch: dynamicPitch,
            bearing: 0
          });

          animRef.current = requestAnimationFrame(animate);
        };

        const timeout = setTimeout(() => {
          if (!mounted) return;
          animRef.current = requestAnimationFrame(animate);
        }, 1600);
        
        animRef.current = timeout;
      };

      playSegment(0);
    };

    initAnimation();

    return () => {
      mounted = false;
      if (typeof animRef.current === 'number') clearTimeout(animRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, [map, origen, destino, started]);

  return { arrived, routeGeojson, vehiclePos, vehicleBearing, currentVehicleType };
}