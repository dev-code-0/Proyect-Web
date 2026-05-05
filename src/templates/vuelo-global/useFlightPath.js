import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { latLngToVector3 } from './useGlobe.js';

const FORWARD_AXIS = new THREE.Vector3(1, 0, 0); // plane's local nose direction
const FLIGHT_SPEED = 0.10; // t units per second → ~10s total flight
const TRAIL_LENGTH = 50;

function buildAirplane(primaryColor) {
  const group = new THREE.Group();
  const mat   = new THREE.MeshStandardMaterial({
    color:    0xeeeeee,
    emissive: new THREE.Color(primaryColor),
    emissiveIntensity: 0.4,
    metalness: 0.6,
    roughness: 0.3,
  });

  const body  = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.018, 0.018), mat);
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.001, 0.07),  mat);
  const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.001, 0.07),  mat);
  const tail  = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.022, 0.008), mat);

  wingL.position.set(0,      0,  0.036);
  wingR.position.set(0,      0, -0.036);
  tail.position.set(-0.035,  0.011, 0);

  group.add(body, wingL, wingR, tail);
  return group;
}

function buildTrailLine(primaryColor) {
  const positions = new Float32Array(TRAIL_LENGTH * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setDrawRange(0, 0);
  const mat  = new THREE.LineBasicMaterial({ color: primaryColor, opacity: 0.55, transparent: true });
  return new THREE.Line(geo, mat);
}

export function useFlightPath({ sceneRef, cameraRef, groupRef, controlsRef, onFrameRef, onArrival }) {
  const stateRef   = useRef(null); // all mutable flight state
  const activeRef  = useRef(false);

  const activate = useCallback((origen, destino, temaColors) => {
    const scene  = sceneRef.current;
    const camera = cameraRef.current;
    if (!scene || !camera || activeRef.current) return;
    activeRef.current = true;

    const P0 = latLngToVector3(origen.lat,  origen.lng,  2.5);
    const P2 = latLngToVector3(destino.lat, destino.lng, 2.5);
    const mid = P0.clone().add(P2).multiplyScalar(0.5);
    const elevation = P0.distanceTo(P2) * 0.45;
    const P1 = mid.clone().normalize().multiplyScalar(2.5 + Math.max(elevation, 0.6));

    const curve = new THREE.QuadraticBezierCurve3(P0, P1, P2);
    const airplane = buildAirplane(temaColors.primary);
    const trail    = buildTrailLine(temaColors.trail);
    scene.add(airplane);
    scene.add(trail);

    const trailPoints = [];
    let t = 0;
    let lastTime = performance.now();

    // Camera phases: idle → pan-origin → pull-back → track → pan-dest
    let camPhase = 'idle';
    let camTimer = 0;
    let camStart = null;
    let camEnd   = null;

    const origWorldPos = P0.clone().applyQuaternion(
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, groupRef.current ? groupRef.current.rotation.y : 0, 0))
    );

    const lerpCam = (from, to, alpha) => {
      camera.position.lerpVectors(from, to, Math.min(alpha, 1));
      camera.lookAt(0, 0, 0);
    };

    stateRef.current = {
      update() {
        const now   = performance.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        // ── Camera state machine ──────────────────────────
        camTimer += delta;

        if (camPhase === 'idle' && camTimer >= 2.0) {
          camPhase = 'pan-origin';
          camTimer = 0;
          camStart = camera.position.clone();
          // Aim camera toward origin side of globe, keep distance ~5
          const dir = P0.clone().normalize();
          camEnd = dir.multiplyScalar(5.5);
          // Disable controls during tween (spec constraint)
          if (controlsRef.current) controlsRef.current.enabled = false;
        }

        if (camPhase === 'pan-origin') {
          lerpCam(camStart, camEnd, camTimer / 0.8);
          if (camTimer >= 0.8) {
            camPhase = 'spawn';
            camTimer = 0;
            // Place plane at origin
            const spawnPos = curve.getPoint(0);
            airplane.position.copy(spawnPos);
          }
        }

        if (camPhase === 'spawn' && camTimer >= 0.3) {
          camPhase = 'pull-back';
          camTimer = 0;
          camStart = camera.position.clone();
          const midDir = P1.clone().normalize();
          camEnd = midDir.multiplyScalar(7.5);
        }

        if (camPhase === 'pull-back') {
          lerpCam(camStart, camEnd, camTimer / 0.6);
          if (camTimer >= 0.6) { camPhase = 'track'; camTimer = 0; }
        }

        if (camPhase === 'track' || camPhase === 'pull-back') {
          // Gradually track the arc midpoint
          const midPt = curve.getPoint(0.5 + t * 0.3);
          const trackDir = midPt.clone().normalize();
          const targetPos = trackDir.multiplyScalar(7.0);
          camera.position.lerp(targetPos, delta * 0.4);
          camera.lookAt(0, 0, 0);
        }

        // ── Flight animation ──────────────────────────────
        if (camPhase !== 'idle' && camPhase !== 'pan-origin' && camPhase !== 'spawn') {
          t += delta * FLIGHT_SPEED;
          if (t >= 1) { t = 1; }

          const pos     = curve.getPoint(t);
          const tangent = curve.getTangent(t).normalize();
          airplane.position.copy(pos);
          airplane.quaternion.setFromUnitVectors(FORWARD_AXIS, tangent);

          // ── Trail (fixed opacity, spec constraint) ──────
          trailPoints.push(pos.clone());
          if (trailPoints.length > TRAIL_LENGTH) trailPoints.shift();
          const attr = trail.geometry.attributes.position;
          trailPoints.forEach((p, i) => attr.setXYZ(i, p.x, p.y, p.z));
          trail.geometry.setDrawRange(0, trailPoints.length);
          attr.needsUpdate = true;

          // ── Arrival ──────────────────────────────────────
          if (t >= 1 && camPhase !== 'pan-dest') {
            camPhase = 'pan-dest';
            camTimer = 0;
            camStart = camera.position.clone();
            const destDir = P2.clone().normalize();
            camEnd = destDir.multiplyScalar(4.5);
          }
        }

        if (camPhase === 'pan-dest') {
          lerpCam(camStart, camEnd, camTimer / 0.7);
          if (camTimer >= 0.7) {
            // Re-enable controls if in interactive mode
            if (controlsRef.current) controlsRef.current.enabled = true;
            // Remove from frame loop
            onFrameRef.current = null;
            activeRef.current = false;
            onArrival && onArrival();
          }
        }
      },

      cleanup() {
        scene.remove(airplane);
        scene.remove(trail);
        trail.geometry.dispose();
        trail.material.dispose();
        activeRef.current = false;
        stateRef.current  = null;
      },
    };

    // Inject into globe's animation loop
    onFrameRef.current = () => stateRef.current && stateRef.current.update();
  }, [sceneRef, cameraRef, groupRef, controlsRef, onFrameRef, onArrival]);

  const cleanup = useCallback(() => {
    if (stateRef.current) {
      stateRef.current.cleanup();
      onFrameRef.current = null;
    }
  }, [onFrameRef]);

  return { activate, cleanup };
}
