// Post-processing FX pipeline — premium visual polish for ~60/67 projects
// Uses postprocessing library (pmndrs): https://github.com/pmndrs/postprocessing

import { EffectComposer, RenderPass, EffectPass, BloomEffect, ChromaticAberrationEffect, VignetteEffect } from 'postprocessing';

export function createBloomPipeline(renderer, scene, camera, config = {}) {
  const {
    bloomIntensity = 1.5,
    bloomThreshold = 0.1,
    bloomSmoothing = 0.025,
    chromaticScale = 0.3,
    vignetteSize = 0.8,
    vignetteSmoothness = 0.5
  } = config;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomEffect = new BloomEffect({
    intensity: bloomIntensity,
    blurriness: 6,
    kernelSize: 5,
    distinction: bloomThreshold
  });

  const chromaticEffect = new ChromaticAberrationEffect({
    offset: [chromaticScale * 0.1, chromaticScale * 0.1]
  });

  const vignetteEffect = new VignetteEffect({
    offset: vignetteSize,
    darkness: vignetteSmoothness
  });

  const effectPass = new EffectPass(camera, bloomEffect, chromaticEffect, vignetteEffect);
  composer.addPass(effectPass);

  return { composer, bloomEffect, chromaticEffect, vignetteEffect };
}

export function createMinimalPipeline(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomEffect = new BloomEffect({
    intensity: 1.0,
    blurriness: 4,
    kernelSize: 3
  });

  const effectPass = new EffectPass(camera, bloomEffect);
  composer.addPass(effectPass);

  return { composer, bloomEffect };
}

export function resizeComposer(composer, width, height, pixelRatio) {
  composer.setSize(width * pixelRatio, height * pixelRatio);
  composer.setPixelRatio(pixelRatio);
}
