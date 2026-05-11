// Genera todos los assets de favicon/iconos para Sorpresa Virtual
// Uso: node scripts/generate-icons.mjs

import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// SVG del ícono con fondo circular oscuro (favicon/app icon)
// Rutas del monograma SV corazón incrustadas directamente
function buildIconSvg(size) {
  // Isotipo con bg circular, centrado en 200x200
  // Mark original: viewBox 0 0 200 220, paths centradas en x=100
  // Scalamos el mark para que quepa en el círculo con padding
  // Circle r=100 (radio completo), mark scale=0.78, centrado en (100,100)
  // Mark height 220 * 0.78 = 171.6, center at 108*0.78=84.2
  // translate(100-100*0.78, 100-84.2) = translate(22, 15.8)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="lg" x1="42" y1="14" x2="158" y2="172" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#f0abfc"/>
      <stop offset="42%"  stop-color="#d946ef"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="lgHL" x1="60" y1="14" x2="100" y2="90" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.36"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="100" fill="#14002c"/>
  <g transform="translate(22, 15.8) scale(0.78)">
    <path d="M 90 28 C 108 16,148 16,158 48 C 166 76,145 96,100 108 L 100 204"
          stroke="url(#lg)" stroke-width="26" stroke-linecap="round" fill="none"/>
    <path d="M 110 28 C 92 16,52 16,42 48 C 34 76,55 96,100 108 C 135 116,155 141,145 168 C 137 188,115 200,100 204"
          stroke="url(#lg)" stroke-width="26" stroke-linecap="round" fill="none"/>
    <path d="M 110 28 C 92 16,52 16,42 48 C 34 76,55 96,100 108"
          stroke="url(#lgHL)" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M 90 28 C 108 16,148 16,158 48 C 166 76,145 96,100 108"
          stroke="url(#lgHL)" stroke-width="10" stroke-linecap="round" fill="none"/>
  </g>
</svg>`
}

function renderPng(svg, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, sansSerifFamily: 'Arial' },
  })
  return Buffer.from(resvg.render().asPng())
}

// ICO builder sin dependencias externas
function makeIco(png16, png32) {
  const dataStart = 6 + 2 * 16
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(2, 4)

  const e16 = Buffer.alloc(16)
  e16[0] = 16; e16[1] = 16; e16[2] = 0; e16[3] = 0
  e16.writeUInt16LE(1, 4); e16.writeUInt16LE(32, 6)
  e16.writeUInt32LE(png16.length, 8)
  e16.writeUInt32LE(dataStart, 12)

  const e32 = Buffer.alloc(16)
  e32[0] = 32; e32[1] = 32; e32[2] = 0; e32[3] = 0
  e32.writeUInt16LE(1, 4); e32.writeUInt16LE(32, 6)
  e32.writeUInt32LE(png32.length, 8)
  e32.writeUInt32LE(dataStart + png16.length, 12)

  return Buffer.concat([header, e16, e32, png16, png32])
}

const sizes = [
  ['favicon-16x16.png', 16],
  ['favicon-32x32.png', 32],
  ['apple-touch-icon.png', 180],
  ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
]

console.log('Generando iconos...')

const pngMap = {}
for (const [filename, size] of sizes) {
  const buf = renderPng(buildIconSvg(size), size)
  writeFileSync(join(publicDir, filename), buf)
  pngMap[size] = buf
  console.log(`  OK ${filename}`)
}

writeFileSync(join(publicDir, 'favicon.ico'), makeIco(pngMap[16], pngMap[32]))
console.log('  OK favicon.ico')

const ogSvg = readFileSync(join(publicDir, 'og-image.svg'), 'utf-8')
writeFileSync(join(publicDir, 'og-image.png'), renderPng(ogSvg, 1200))
console.log('  OK og-image.png (1200x630)')

console.log('\nListo.')
