import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { latLngToVector3 } from './useGlobe.js';

const FORWARD_AXIS  = new THREE.Vector3(1, 0, 0);
const FLIGHT_SPEED  = 0.085;  // ~12s total flight
const TRAIL_LENGTH  = 50;

function buildAirplane(primaryColor) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color:             0xfafafa,
    emissive:          new THREE.Color(primaryColor),
    emissiveIntensity: 0.55,
    metalness: 0.7,
    roughness: 0.2,
  });
  const body  = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.018, 0.018), mat);
  const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.001, 0.07),  mat);
  const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.001, 0.07),  mat);
  const tail  = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.022, 0.008), mat);
  wingL.position.set(0, 0,  0.036);
  wingR.position.set(0, 0, -0.036);
  tail.position.set(-0.035, 0.011, 0);
  group.add(body, wingL, wingR, tail);
  return group;
}

function buildTrail(primaryColor) {
  const positions = new Float32Array(TRAIL_LENGTH * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setDrawRange(0, 0);
  const mat = new THREE.LineBasicMaterial({ color: primaryColor, opacity: 0.6, transparent: true });
  return new THREE.Line(geo, mat);
}

// Easing helpers
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeOut(t)   { return 1 - (1 - t) ** 3; }

// Convert a curve point (group-local) → world space using current group matrix
function curveWorldPoint(curve, group, t) {
  const local = curve.getPoint(t);
  return local.clone().applyMatrix4(group.matrixWorld);
}

export function useFlightPath({ sceneRef, cameraRef, groupRef, controlsRef, autoRotateRef, onFrameRef, onArrival }) {
  const activeRef = useRef(false);

  const activate = useCallback((origen, destino, temaColors) => {
    const scene    = sceneRef.current;
    const camera   = cameraRef.current;
    const group    = groupRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !group || activeRef.current) return;
    activeRef.current = true;

    // ── Bézier curve (group-local space) ─────────────────
    const P0 = latLngToVector3(origen.lat,  origen.lng,  2.5);
    const P2 = latLngToVector3(destino.lat, destino.lng, 2.5);
    const mid = P0.clone().add(P2).multiplyScalar(0.5);
    const elevation = Math.max(P0.distanceTo(P2) * 0.45, 0.6);
    const P1 = mid.clone().normalize().multiplyScalar(2.5 + elevation);
    const curve = new THREE.QuadraticBezierCurve3(P0, P1, P2);

    // ── Visuals ───────────────────────────────────────────
    const airplane = buildAirplane(temaColors.primary);
    const trail    = buildTrail(temaColors.trail);
    scene.add(airplane);
    scene.add(trail);
    airplane.visible = false;

    // ── TARGET group rotation so origin faces camera (+Z) ──
    // The globe mesh has rotation.y = π for texture alignment, so the
    // combined transform is R_y(θ_group + π).  For P0 to maximize z_world:
    //   z_world = P0.x·sin(θ+π) - P0.z·cos(θ+π)
    //           = -P0.x·sin(θ) + P0.z·cos(θ)   (using sin/cos(θ+π) identities)
    // This is maximised at: θ = atan2(P0.x, -P0.z)
    const targetGroupRotY  = Math.atan2(P0.x, -P0.z);
    const startGroupRotY   = group.rotation.y;

    // Shortest angular path
    let diff = ((targetGroupRotY - startGroupRotY) % (Math.PI * 2));
    if (diff > Math.PI)  diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;
    const finalTargetRotY = startGroupRotY + diff;

    // Orient duration proportional to distance (min 0.6s, max 2.5s)
    const ORIENT_DUR = Math.max(Math.abs(diff) / Math.PI * 2.2, 0.6);
    const ZOOM_DUR   = 1.2;
    const HOLD_DUR   = 0.8;

    // Stop auto-rotation and orbit while animating
    autoRotateRef.current = false;
    if (controls) controls.enabled = false;

    // Camera start snapshot
    const camStartPos = camera.position.clone();

    // Midpoint between the two cities (in group-local), for zoom target
    const geoMid = P0.clone().add(P2).multiplyScalar(0.5).normalize();

    // ── State machine ─────────────────────────────────────
    let phase     = 'orient';
    let phaseTime = 0;
    let t         = 0;
    const trailPoints = [];
    let lastNow = performance.now();

    onFrameRef.current = () => {
      const now   = performance.now();
      const delta = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      phaseTime += delta;

      // ┌─────────────────────────────────────────────────┐
      // │  PHASE 1 — orient globe to face origin city     │
      // └─────────────────────────────────────────────────┘
      if (phase === 'orient') {
        const alpha = Math.min(phaseTime / ORIENT_DUR, 1);
        group.rotation.y = startGroupRotY + diff * easeInOut(alpha);

        // Camera gently moves to "wide view" position
        const widePos = new THREE.Vector3(0, 0.8, 7.0);
        camera.position.lerp(widePos, delta * 1.8);
        camera.lookAt(0, 0, 0);

        if (alpha >= 1) { phase = 'zoom'; phaseTime = 0; }
        return;
      }

      // ┌─────────────────────────────────────────────────┐
      // │  PHASE 2 — zoom in to show both cities          │
      // └─────────────────────────────────────────────────┘
      if (phase === 'zoom') {
        const alpha = Math.min(phaseTime / ZOOM_DUR, 1);
        // Aim camera at the geographic midpoint between the two cities
        const worldMid = geoMid.clone().applyMatrix4(group.matrixWorld);
        const zoomDir  = worldMid.clone().normalize();
        const zoomPos  = zoomDir.multiplyScalar(4.2);
        zoomPos.y += 0.2; // slight upward tilt for aesthetics

        camera.position.lerp(zoomPos, easeOut(alpha) * delta * 5);
        camera.lookAt(0, 0, 0);

        if (alpha >= 1) { phase = 'hold'; phaseTime = 0; }
        return;
      }

      // ┌─────────────────────────────────────────────────┐
      // │  PHASE 3 — brief hold showing the route         │
      // └─────────────────────────────────────────────────┘
      if (phase === 'hold') {
        camera.lookAt(0, 0, 0);

        if (phaseTime >= HOLD_DUR) {
          // Spawn airplane at origin
          airplane.visible = true;
          const spawnPos = curveWorldPoint(curve, group, 0);
          airplane.position.copy(spawnPos);
          phase = 'fly';
          phaseTime = 0;
        }
        return;
      }

      // ┌─────────────────────────────────────────────────┐
      // │  PHASE 4 — flight animation                     │
      // └─────────────────────────────────────────────────┘
      if (phase === 'fly') {
        t += delta * FLIGHT_SPEED;
        if (t > 1) t = 1;

        // World-space position and tangent
        const pos  = curveWorldPoint(curve, group, t);
        const pos2 = curveWorldPoint(curve, group, Math.min(t + 0.001, 1));
        const tangent = pos2.clone().sub(pos).normalize();

        airplane.position.copy(pos);
        airplane.quaternion.setFromUnitVectors(FORWARD_AXIS, tangent);

        // Trail (fixed opacity — spec constraint: no per-vertex fading)
        trailPoints.push(pos.clone());
        if (trailPoints.length > TRAIL_LENGTH) trailPoints.shift();
        const attr = trail.geometry.attributes.position;
        trailPoints.forEach((p, i) => attr.setXYZ(i, p.x, p.y, p.z));
        trail.geometry.setDrawRange(0, trailPoints.length);
        attr.needsUpdate = true;

        // Camera gently tracks the arc midpoint as flight progresses
        const trackMid = curveWorldPoint(curve, group, Math.min(t * 0.5 + 0.25, 0.75));
        const trackDir = trackMid.clone().normalize().multiplyScalar(5.8);
        trackDir.y += 0.4;
        camera.position.lerp(trackDir, delta * 0.35);
        camera.lookAt(0, 0, 0);

        if (t >= 1) { phase = 'arrive'; phaseTime = 0; }
        return;
      }

      // ┌─────────────────────────────────────────────────┐
      // │  PHASE 5 — arrive at destination                │
      // └─────────────────────────────────────────────────┘
      if (phase === 'arrive') {
        const destWorld  = curveWorldPoint(curve, group, 1);
        const destDir    = destWorld.clone().normalize();
        const zoomTarget = destDir.multiplyScalar(4.0);
        camera.position.lerp(zoomTarget, delta * 1.8);
        camera.lookAt(0, 0, 0);

        if (phaseTime >= 1.2) {
          if (controls) controls.enabled = true;  // re-enable explore
          onFrameRef.current = null;
          activeRef.current  = false;
          onArrival && onArrival();
        }
      }
    };
  }, [sceneRef, cameraRef, groupRef, controlsRef, autoRotateRef, onFrameRef, onArrival]);

  const cleanup = useCallback(() => {
    onFrameRef.current = null;
    activeRef.current  = false;
  }, [onFrameRef]);

  return { activate, cleanup };
}
