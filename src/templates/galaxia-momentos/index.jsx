import React from 'react';
import GalaxyScene from './GalaxyScene';

export default function GalaxyMomentos({ data }) {
  // Default to romantica so the preview always shows the full scene
  const resolved = { tema: 'romantica', ...data };
  return <GalaxyScene data={resolved} />;
}
