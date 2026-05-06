import React from 'react';
import ArbolScene from './ArbolScene';

export default function ArbolMadre({ data }) {
  const resolved = { tema: 'cerezo', ...data };
  return <ArbolScene data={resolved} />;
}
