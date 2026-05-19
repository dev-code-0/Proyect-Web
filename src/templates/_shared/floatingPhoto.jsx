// PlaneGeometry with photo + polaroid-style border — ~50/67 projects
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export function createFloatingPhotoMesh(photoUrl, width = 2, height = 2.5, borderWidth = 0.15) {
  const group = new THREE.Group();

  // Polaroid-style border (white frame)
  const borderGeometry = new THREE.PlaneGeometry(
    width + borderWidth * 2,
    height + borderWidth * 2.2
  );
  const borderMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0.1
  });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  group.add(border);

  // Photo plane
  const photoGeometry = new THREE.PlaneGeometry(width, height);
  const textureLoader = new THREE.TextureLoader();
  const photoTexture = textureLoader.load(photoUrl);
  photoTexture.encoding = THREE.sRGBColorSpace;

  const photoMaterial = new THREE.MeshStandardMaterial({
    map: photoTexture,
    roughness: 0.2,
    metalness: 0
  });
  const photo = new THREE.Mesh(photoGeometry, photoMaterial);
  photo.position.z = 0.001;
  group.add(photo);

  return group;
}

export function useFloatingPhotoAnimation(meshRef, duration = 6) {
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const startY = mesh.position.y;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      mesh.position.y = startY + Math.sin(elapsed / duration * Math.PI * 2) * 0.3;
      mesh.rotation.z = Math.sin(elapsed / (duration * 1.5)) * 0.15;

      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [meshRef, duration]);
}

export const FloatingPhotoComponent = ({ photoUrl, data, isPreview }) => {
  const meshRef = useRef(null);
  useFloatingPhotoAnimation(meshRef);

  return (
    <group ref={meshRef}>
      {/* Photo will be created by parent Three.js scene */}
    </group>
  );
};
