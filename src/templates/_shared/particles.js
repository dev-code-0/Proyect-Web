// InstancedMesh helpers — efficient particle rendering for starfield, petals, fireflies
import * as THREE from 'three';

export function createStarfield(count = 500, radius = 100) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * radius * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * radius * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * radius * 2;
    scales[i] = Math.random() * 0.8 + 0.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  const material = new THREE.PointsMaterial({
    size: 0.5,
    sizeAttenuation: true,
    color: 0xffffff,
    transparent: true
  });

  return new THREE.Points(geometry, material);
}

export function createInstancedGeometry(baseGeometry, count) {
  const dummy = new THREE.Object3D();
  const mesh = new THREE.InstancedMesh(baseGeometry, new THREE.MeshStandardMaterial(), count);

  return { mesh, dummy, updateInstance: (index, position, rotation, scale = 1) => {
    dummy.position.copy(position);
    dummy.rotation.order = 'YXZ';
    dummy.rotation.copy(rotation);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
    mesh.instanceMatrix.needsUpdate = true;
  }};
}

export function createPetalParticles(count = 50, speed = 0.02) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = Math.random() * 10 + 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    velocities[i * 3] = (Math.random() - 0.5) * speed;
    velocities[i * 3 + 1] = -speed * Math.random() * 0.5;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

  return { geometry, positions, velocities };
}
