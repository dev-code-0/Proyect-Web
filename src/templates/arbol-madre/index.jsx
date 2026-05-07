import React from 'react';
import ArbolScene from './ArbolScene';
import defaultMusic from './music.mp3';

export default function ArbolMadre({ data }) {
  const resolved = { 
    tema: 'cerezo', 
    ...data,
    musica: data?.musica ? data.musica : defaultMusic
  };
  return <ArbolScene data={resolved} />;
}
