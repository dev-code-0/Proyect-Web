// GLTFLoader with DRACO + KTX2 + caching — efficient 3D model loading
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
const modelCache = new Map();

dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/draco_wasm_wrapper_geom.js');
gltfLoader.setDRACOLoader(dracoLoader);

export function loadGLTF(url, onProgress = null) {
  if (modelCache.has(url)) {
    return Promise.resolve(modelCache.get(url));
  }

  return new Promise((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        modelCache.set(url, gltf);
        resolve(gltf);
      },
      onProgress,
      reject
    );
  });
}

export function clearModelCache() {
  modelCache.forEach((gltf) => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
  });
  modelCache.clear();
}

export function getCachedModel(url) {
  return modelCache.get(url);
}

export async function loadAndCloneGLTF(url) {
  const gltf = await loadGLTF(url);
  return gltf.scene.clone();
}

export function disposeMesh(mesh) {
  if (mesh.geometry) mesh.geometry.dispose();
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(mat => mat.dispose());
    } else {
      mesh.material.dispose();
    }
  }
}
