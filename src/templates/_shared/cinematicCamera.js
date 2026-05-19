// GSAP-powered cinematic camera animations — smoother than vanilla easing
import { gsap } from 'gsap';
import * as THREE from 'three';

export function lerpVec3(v1, v2, t) {
  return new THREE.Vector3(
    v1.x + (v2.x - v1.x) * t,
    v1.y + (v2.y - v1.y) * t,
    v1.z + (v2.z - v1.z) * t
  );
}

export function animateCameraTo(camera, targetPos, targetLook, duration = 2, ease = 'power2.inOut', onComplete = null) {
  const startPos = camera.position.clone();
  const startLook = new THREE.Vector3(0, 0, 0);

  gsap.to(camera.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration,
    ease,
    onUpdate() {
      camera.lookAt(targetLook);
    },
    onComplete
  });
}

export function orbitCamera(camera, center, radius, speed = 0.001, duration = null) {
  let angle = 0;
  const startAngle = Math.atan2(camera.position.z - center.z, camera.position.x - center.x);

  const animate = () => {
    angle += speed;
    camera.position.x = center.x + Math.cos(startAngle + angle) * radius;
    camera.position.z = center.z + Math.sin(startAngle + angle) * radius;
    camera.lookAt(center);
  };

  if (duration) {
    gsap.to({ angle: 0 }, {
      angle: Math.PI * 2,
      duration,
      ease: 'none',
      onUpdate: () => animate()
    });
  }

  return animate;
}

export function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutElastic(t) {
  const c5 = (2 * Math.PI) / 4.5;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1;
}
