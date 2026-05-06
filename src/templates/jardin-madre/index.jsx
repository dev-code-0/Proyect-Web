import React from 'react';
import JardinScene from './JardinScene';

export default function JardinMadre({ data }) {
  const resolved = { tema: 'rosas', ...data };
  return <JardinScene data={resolved} />;
}
