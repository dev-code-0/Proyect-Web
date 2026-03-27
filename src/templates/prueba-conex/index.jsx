import React from 'react'
import './style.css'
import image from './letter-blue.webp'

export default function PruebaConexTemplate({data}) {
    const nombre= data?.nombre || 'María'
    const foto = data?.foto || image

  return (
    <main className='prueba-wrap'>
        <h1>Hola {nombre}</h1>
        <img src={foto} alt="foto del usuario" />
    </main>
  )
}
