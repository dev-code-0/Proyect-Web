import React from 'react'

export default function PruebaConexTemplate({data}) {
    const nombre= data?.nombre || 'María'
    const foto = data?.foto || './letter-blue.webp'

  return (
    <main className='prueba-wrap'>
        <h1>Hola{nombre}</h1>
        <img src={foto} alt="foto del usuario" />
    </main>
  )
}
