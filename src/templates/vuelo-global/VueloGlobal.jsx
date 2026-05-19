import { useState, useMemo, useEffect } from 'react';
import Map, { Marker, Source, Layer, MapProvider } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-csp-worker.js?url';
import * as turf from '@turf/turf';
import { vueloGlobalConfig } from './config.js';
import { useMapAnimation } from './useMapAnimation.js';
import ArrivalModal from './ArrivalModal.jsx';
import './vuelo.css';

// ── Carro 3D (color del cuerpo = currentColor) ───────────────────────────────
const CarIcon = ({ color, glow, size = 48 }) => (
  <div className="vg-car3d vg-car3d--moving" style={{ color, filter: `drop-shadow(0 4px 10px ${glow}) drop-shadow(0 2px 4px rgba(0,0,0,0.4))` }}>
    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" id="car" x="0" y="0" version="1.1" viewBox="0 0 480 400" width={size} height={Math.round(size * 400 / 480)}>
      <path fill="#262626" d="M330 355l140-70-320-160-140 70z" opacity=".3"></path>
      <path fill="#2D3134" d="m69.3 196.4 50.2-14-34.6-19.9-17.5 16.9zM261.7 296.2l50.2-14-34.7-19.9-17.5 16.9z"></path>
      <path d="m69.3 196.4 50.2-14-34.6-19.9-17.5 16.9zM261.7 296.2l50.2-14-34.7-19.9-17.5 16.9z" opacity=".29"></path>
      <path fill="#2D3134" d="M298.4 276.3c-6.7-3.4-12.8-3.8-17.3-1.7l-9.5 5.1c-4.8 2.2-7.9 7.1-7.9 14.3 0 13.9 11.3 30.9 25.2 37.8 6.9 3.4 13.1 3.8 17.7 1.6 0 0 9.4-5 10.4-5.6 4.1-2.4 6.6-7.1 6.6-13.6 0-14-11.3-30.9-25.2-37.9z"></path>
      <path d="M306.9 333.3c1.8-.9 9.2-4.9 10.1-5.5 4.1-2.4 6.6-7.1 6.6-13.6 0-5.6-1.8-11.7-4.9-17.4l-9.5 5.1c3.1 5.7 4.9 11.8 4.9 17.4.1 6.8-2.7 11.7-7.2 14z" opacity=".29"></path>
      <path fill="#2D3134" d="M314.2 319.3c0 13.9-11.3 19.6-25.2 12.6-13.9-7-25.2-23.9-25.2-37.8s11.3-19.6 25.2-12.6c13.9 6.9 25.2 23.9 25.2 37.8z"></path>
      <path fill="#E5E5E5" d="M308.6 316.5c0 10.9-8.8 15.3-19.7 9.9-10.9-5.4-19.7-18.7-19.7-29.6 0-10.9 8.8-15.3 19.7-9.9 10.9 5.5 19.7 18.7 19.7 29.6z"></path>
      <g fill="#2D3134">
        <path d="M301.9 325.3c3-1.7 4.8-5 4.8-9.7v-1.1l-11-1.7 6.2 12.5zM293.1 303.6l11.5 2.5c-2.4-5.7-6.7-11.3-11.9-14.9l.4 12.4zM284.8 299.5l.4-12c-5.2-1.5-9.5-.3-11.9 3l11.5 9zM271.2 296.7v1.1c0 4.7 1.8 9.8 4.8 14.5l6.3-6.2-11.1-9.4zM288.9 314.2l-6.8 5.5c2.1 1.9 4.4 3.5 6.8 4.7 2.4 1.2 4.7 1.9 6.8 2l-6.8-12.2z"></path>
      </g>
      <path d="M314.2 319.3c0 13.9-11.3 19.6-25.2 12.6s-25.2-23.9-25.2-37.8 11.3-19.6 25.2-12.6c13.9 6.9 25.2 23.9 25.2 37.8z" opacity=".11"></path>
      <path fill="#2D3134" d="M106.2 179.6c-6.7-3.4-12.8-3.8-17.3-1.7l-9.5 5.1c-4.8 2.2-7.9 7.1-7.9 14.3 0 13.9 11.3 30.9 25.2 37.8 6.9 3.4 13.1 3.8 17.7 1.6 0 0 9.4-5 10.4-5.6 4.1-2.4 6.6-7.1 6.6-13.6.1-14-11.2-30.9-25.2-37.9z"></path>
      <path d="M114.8 236.6c1.8-.9 9.2-4.9 10.1-5.5 4.1-2.4 6.6-7.1 6.6-13.6 0-5.6-1.8-11.7-4.9-17.4l-9.5 5.1c3.1 5.7 4.9 11.8 4.9 17.4 0 6.8-2.8 11.6-7.2 14z" opacity=".29"></path>
      <path fill="#2D3134" d="M122 222.5c0 13.9-11.3 19.6-25.2 12.6-13.9-7-25.2-23.9-25.2-37.8 0-13.9 11.3-19.6 25.2-12.6 13.9 7 25.2 23.9 25.2 37.8z"></path>
      <path fill="#E5E5E5" d="M116.5 219.8c0 10.9-8.8 15.3-19.7 9.9S77.1 211 77.1 200.1c0-10.9 8.8-15.3 19.7-9.9s19.7 18.7 19.7 29.6z"></path>
      <g fill="#2D3134">
        <path d="M109.8 228.5c3-1.7 4.8-5 4.8-9.7v-1.1l-11-1.7 6.2 12.5zM100.9 206.8l11.5 2.5c-2.4-5.7-6.7-11.3-11.9-14.9l.4 12.4zM92.7 202.7l.4-12c-5.2-1.5-9.5-.3-11.9 3l11.5 9zM79.1 199.9v1.1c0 4.7 1.8 9.8 4.8 14.5l6.3-6.2-11.1-9.4zM96.8 217.5 90 223c2.1 1.9 4.4 3.5 6.8 4.7 2.4 1.2 4.7 1.9 6.8 2l-6.8-12.2z"></path>
      </g>
      <path d="M122 222.5c0 13.9-11.3 19.6-25.2 12.6s-25.2-23.9-25.2-37.8c0-13.9 11.3-19.6 25.2-12.6 13.9 7 25.2 23.9 25.2 37.8z" opacity=".11"></path>
      <path fill="currentColor" d="M441 221c-19.3-17.2-102.5-82.6-116.4-92.9-13.9-10.3-64.2-41.9-98-50.6-33.8-8.7-38-3.6-44.9-5.1-6.9-1.5-27.4-6.3-57.6 3-12.9 4-28.2 8.4-40.7 19.6-16.6 14.8-29.4 37.8-35.6 50.3l-1.3 4.2c-2.3 7.5-1.3 15.7 2.7 22.4 3.4 5.7 7.7 12.3 10.9 15.9 2.8 3.1 6.2 6.4 9.1 9.2v-.7c0-10.6 6.2-17.4 15.8-17.4 3.8 0 7.9 1.1 12.1 3.2 14.5 7.2 26.2 24.9 26.2 39.4 0 1.9-.2 3.7-.6 5.4l138.9 69.4c-.1-1.1-.2-2.2-.2-3.2 0-10.6 6.2-17.4 15.8-17.4 3.8 0 7.9 1.1 12.1 3.2 14.5 7.2 26.2 24.9 26.2 39.4 0 1.7-.2 3.2-.5 4.7l11.1 5.5s20.8 5.4 34.1 4.2c13.3-1.2 40.7-10.2 62.7-21.1 22-10.9 40.6-30.1 41-40.1.2-3.8-3.6-33.3-22.9-50.5z"></path>
      <path fill="currentColor" d="M363.8 162.5s-1.2-8.4 0-10.6c1.2-2.1 3.3-5.4 6-3 2.7 2.4 5.7 9.3 3 15.7-2.7 6.4-9-2.1-9-2.1z"></path>
      <path fill="#FFF" d="M58.8 129.7s64.4 44.5 138.4 84.3 112.9 62.4 112.9 62.4l-45.7-39.2-163.9-95.6-41.7-11.9z" opacity=".3"></path>
      <path fill="#2D3134" d="m102.1 142.6 162.2 94.7s-15.7-69-71.1-96.8-91.1 2.1-91.1 2.1zM169.7 91.4c21.6-10.2 39.2-13.3 39.2-15.4 0-2.1-55.5-4.8-89.8 12.4s-32.6 32-19.6 30.4 30.4-3 35.9-5.7 15.9-13 34.3-21.7z"></path>
      <path fill="#656565" d="M98.9 116.5c-1.3 0-4.4-.3-4.9-2.6-.8-3.4 3.8-12.9 27.1-24.5 25.5-12.7 61.4-13.7 71.8-13.7 5.3 0 9.3.2 12 .5-1.4.5-2.9 1-4.5 1.5-7.2 2.3-18.1 5.8-30.2 11.6-12.3 5.8-21.3 12.5-27.2 16.8-3.1 2.2-5.5 4-7.2 4.9-4.2 2.1-17.2 3.5-28.6 4.8-2.3.3-4.6.5-6.7.7h-1.6z"></path>
      <path fill="#2D3134" d="M244.4 169.5c-2 5.5 30.1 59.7 40.1 62.4 9.9 2.7 39.8 1.8 69.3-14.5s35-28.9 33.5-33.5c-1.5-4.5-58.2-52.2-67.5-53.1s-73 32-75.4 38.7z"></path>
      <path fill="#FFF" d="M323.1 287s4.2-5.6 15.5-6.9c11.3-1.2 25.1-.1 35.4 9.1 7.7 6.9 10.5 9.8 10.5 9.8s-21.8 7.1-32.6 5.6c-10.7-1.5-28.8-17.6-28.8-17.6z" opacity=".2"></path>
      <path fill="#E5E5E5" d="M325.2 285.1s3.9-5.2 14.3-6.3 23.2-.1 32.7 8.4c7.1 6.3 9.7 9 9.7 9s-20.1 6.6-30.1 5.2-26.6-16.3-26.6-16.3z"></path>
      <path fill="#FFF" d="M444.4 267.4s15.2-14.2 14.4-18.2c-.8-4.1-12.5-24.3-14-21.3s-4.7 7.8-3.5 11.9c1.2 4.1 3.4 24 3.1 27.6z" opacity=".2"></path>
      <path fill="#E5E5E5" d="M444.3 264.6s14.3-14.2 13.6-18.2c-.8-4.1-12.5-24.3-14-21.3s-4.7 7.8-3.5 11.9c1.2 4 4.2 23.9 3.9 27.6z"></path>
      <path fill="#2D3134" d="M353.7 324.5l-.5 4.4s44.7-5.7 72.8-23c28-17.3 34.8-30.8 34.8-30.8s-21.6 23.4-48 34.2c-27.7 11.2-59.1 15.2-59.1 15.2z"></path>
      <path fill="#656565" d="M380.9 180.2c-5.1-4.9-14.8-13.5-27.1-23.4-20-16.2-31.7-23.7-34.5-23.9h-.1c-4.1 0-20.4 6.8-38.6 16.2-20.9 10.7-32.1 18.3-33.7 20.6.2 2.8 5.7 14.7 15.9 31.1 11.3 18.1 19.5 27.1 22.2 27.9 1.5.4 3.4.7 5.6.9 13.2-2 36-7.1 58.2-20.2 18.8-11.1 27.8-21.8 32.1-29.2zM115.8 138.8l-2.1 6.3 62.4 36.4 10-40.2-.3-.4c-13.2-5.8-26.2-8.7-38.9-8.7-13.3.1-23.9 3.4-31.1 6.6zM247.3 223.1l2.5-15.3c-1.1-2.3-2.2-4.6-3.5-7-9.4-17.8-26-41.7-52.3-55.8l-6.2 43.3 59.5 34.8z"></path>
      <path d="M126.2 169.6c0 2.9-2.4 4.1-5.3 2.7-2.9-1.5-5.3-5-5.3-8s2.4-4.1 5.3-2.7c2.9 1.5 5.3 5 5.3 8z" opacity=".2"></path>
      <path fill="currentColor" d="M112.4 160.6l-2.3 2.6s16.7 10.9 18.2 8.7c1.6-2.1-15.9-11.3-15.9-11.3z"></path>
      <path d="M197.4 210.1c0 2.9-2.4 4.1-5.3 2.7-2.9-1.5-5.3-5-5.3-8 0-2.9 2.4-4.1 5.3-2.7 2.9 1.5 5.3 5 5.3 8z" opacity=".2"></path>
      <path fill="currentColor" d="M183.6 201l-2.3 2.6s16.7 10.9 18.2 8.7c1.6-2.1-15.9-11.3-15.9-11.3z"></path>
      <path d="M263.9 237.2c0 .1-1.8 7-3.3 15.4-1.4 7.6-2.2 32.8-2.4 37.3l-79.6-40.3c-.1-1.6-1.2-16.5-1.2-30.1 0-14.3 3.6-30.2 3.6-30.3l-.9-.2c0 .2-3.6 16.2-3.6 30.5 0 12.6.9 26.4 1.2 29.6l-39.6-20c-.9-1.2-10.5-14.3-19.9-34.2-9.7-20.5-7.4-46.5-7.3-46.8l-.9-.1c0 .3-2.4 26.5 7.4 47.3 9.9 20.8 20 34.3 20.1 34.4l.1.1L259 291.4v-.7c0-.3.9-29.6 2.4-37.9 1.5-8.3 3.3-15.3 3.3-15.3l-.8-.3z" opacity=".2"></path>
      <path d="M359.1 286.2c0 3.6-2.9 7.9-6.5 9.7s-6.5.3-6.5-3.2c0-3.6 2.9-7.9 6.5-9.7s6.5-.4 6.5 3.2zM369.1 288.8c0 2.5-2 5.5-4.5 6.8-2.5 1.2-4.5.2-4.5-2.3s2-5.5 4.5-6.8c2.5-1.2 4.5-.2 4.5 2.3z" opacity=".3"></path>
      <path fill="#FFF" d="M344.7 292.1c0 1.3-1.1 3-2.4 3.6-1.3.7-2.4.1-2.4-1.2s1.1-3 2.4-3.6c1.3-.7 2.4-.2 2.4 1.2z"></path>
      <path fill="#FFF" d="M356.4 288.9c0 1.8-1.5 4-3.2 4.9-1.8.9-3.2.2-3.2-1.6s1.5-4 3.2-4.9c1.7-.9 3.2-.2 3.2 1.6zM367.4 290.6c0 1.3-1.1 3-2.4 3.6-1.3.7-2.4.1-2.4-1.2s1.1-3 2.4-3.6c1.3-.7 2.4-.1 2.4 1.2z" opacity=".4"></path>
      <path fill="#FFF" d="M341.1 284c0 1.3-1.1 3-2.4 3.6-1.3.7-2.4.1-2.4-1.2s1.1-3 2.4-3.6c1.3-.7 2.4-.1 2.4 1.2zM448 231.4c0 1.3-1.1 3-2.4 3.6-1.3.7-2.4.1-2.4-1.2s1.1-3 2.4-3.6c1.3-.7 2.4-.2 2.4 1.2zM452.5 237.7c0 1.3-1.1 3-2.4 3.6-1.3.7-2.4.1-2.4-1.2s1.1-3 2.4-3.6c1.3-.7 2.4-.1 2.4 1.2z"></path>
      <path d="M453.9 241.9c0 3.1-2.5 6.8-5.6 8.3s-5.6.3-5.6-2.8 2.5-6.8 5.6-8.3c3.1-1.5 5.6-.2 5.6 2.8z" opacity=".3"></path>
      <path fill="#FFF" d="M450.6 245.2c0 1.6-1.3 3.5-2.8 4.3-1.6.8-2.8.1-2.8-1.4s1.3-3.5 2.8-4.3c1.5-.8 2.8-.2 2.8 1.4z" opacity=".4"></path>
      <path d="M449.4 250.3c0-2.5-2-3.5-4.5-2.3-.8.4-1.5.9-2.1 1.6.4 2.7.8 5.5 1.1 7.9.3-.1.7-.2 1.1-.4 2.4-1.2 4.4-4.3 4.4-6.8zM325.2 285c4.9-.4 18.7-1.1 27.4 1s23.8 7.9 29.2 10.1c-.6-.6-3.4-3.4-9.6-8.9-9.5-8.5-22.3-9.5-32.7-8.4-9.5 1-13.6 5.4-14.3 6.2z" opacity=".3"></path>
      <path fill="currentColor" d="M241.7 212.9s7.5 3.6 10.9 8.1c3.3 4.5 3.3 6.9 3.3 6.9s-20.8 4.5-31.1-2.1c-10.9-7.1 16.9-12.9 16.9-12.9z"></path>
      <path fill="#2D3134" d="M296.4 230.3l3.8-.3 35-17 1.9-3.5 21.3-9.9-.9-1.7-40.7 18.1 1.2 1.5 15.8-7-.9 1-34.2 16.4z"></path>
      <path fill="#2D3134" d="M333.4 220.9h3.3l27.9-20.7 3.4-8 10.7-13.6-.7-1-20.1 22.9.8 1.2 5.4-4.8-1.5 2.7-28.3 19.6zM375.6 286.9l11.6 10.4s16.8-3.2 31.8-10.9 24-18.1 24-18.1l-1.2-15.2s-6.8 12.3-26.4 22c-17.4 8.7-39.8 11.8-39.8 11.8z"></path>
      <path d="M422.2 308.9c21.9-11 40.6-29.6 41-39.6.1-1.7.2-4.5-2.2-12.4-.2-.7-1.1-.8-1.5-.2-7.7 11-20.8 25.3-41.2 35.1-21.2 10.2-47.2 18.9-67.2 17.9-4.7-.2-5.5 4.5-5.9 11.9-.2 4.8 3.8 8.8 8.6 8.3 17.2-1.7 44.8-9.2 68.4-21z" opacity=".29"></path>
      <path d="M328.2 295.8c-7-7.9-47-49.9-57.4-66.3-13.6-21.3-35.8-73.4-76.7-92.9-41-19.5-87.4-11.2-101.4-10.2-8.5.5-21.7-2.6-30.9-5.2-6 9.1-10.7 17.9-13.8 24.2l-1.3 4.2c-2.3 7.5-1.3 15.7 2.7 22.4 3.4 5.7 7.7 12.3 10.9 15.9 2.8 3.1 6.2 6.4 9.1 9.2v-.7c0-10.6 6.2-17.4 15.8-17.4 3.8 0 7.9 1.1 12.1 3.2 14.5 7.2 26.2 24.9 26.2 39.4 0 1.9-.2 3.7-.6 5.4l138.9 69.4c-.1-1.1-.2-2.2-.2-3.2 0-10.6 6.2-17.4 15.8-17.4 3.8 0 7.9 1.1 12.1 3.2 14.5 7.2 26.2 24.9 26.2 39.4 0 1.7-.2 3.2-.5 4.7l11.1 5.5s5.8 1.5 13.2 2.8c-1.8-14.7-5.5-29-11.3-35.6z" opacity=".11"></path>
      <path fill="#CC291F" d="M49.4 148.5s6.3-16.1 9.8-21.1c3.5-5 7.4-9.5 7.4-9.5l-1.1-3s-7.4 2.6-8.7 4.8c-1.4 2.3-8.9 25.6-8.9 25.6l1.5 3.2z"></path>
      <path d="M379 183.1c.7-1 1.3-2 1.8-2.9-5.1-4.9-14.8-13.5-27.1-23.4-20-16.2-31.7-23.7-34.5-23.9h-.1c-4.1 0-20.4 6.8-38.6 16.2-20.9 10.7-32.1 18.3-33.7 20.6.1.9.7 2.9 1.9 5.6 42.7-13.8 89.4-11.1 130.3 7.8z" opacity=".2"></path>
      <path fill="#E5E5E5" d="M408.4 303.2v14.6l26.3-13.1v-14.5z"></path>
      <path d="M444.3 264.6s14.3-14.2 13.6-18.2c-.8-4.1-12.5-24.3-14-21.3s-4.7 7.8-3.5 11.9c1.2 4 4.2 23.9 3.9 27.6z" opacity=".2"></path>
      <path fill="#2D3134" d="M245.8 173.9c-3.2-7.9-25.4-33.1-50-45.2-31-15.2-58-15.2-63.5-14.4l-.2-1.3c5.6-.8 33-.8 64.3 14.5 10.9 5.3 22.7 14 33.4 24.4 8.5 8.2 15.4 16.9 17.3 21.5l-1.3.5zM325.1 135l-.1-.1c-10-7.3-36.7-26.7-61.3-38.7-30.9-15.1-55-19.8-60.3-19.8V75c5.4 0 29.8 4.7 60.9 20 24.7 12.1 51.4 31.5 61.5 38.8l.1.1-.8 1.1z"></path>
    </svg>
  </div>
);

// ── Avión (color del cuerpo = currentColor) ──────────────────────────────────
const PlaneIcon = ({ color, glow, size = 36 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size}
    style={{ color, transform: 'rotate(-45deg)', filter: `drop-shadow(0 0 10px ${glow})` }}>
    <path fill="#8c8c8c" d="M180.353 72.358l-27.568 27.568c-7.755 7.755-20.328 7.755-28.083 0l0 0c-7.755-7.755-7.755-20.328 0-28.083l27.568-27.568c3.875-3.875 10.156-3.875 14.031 0l14.052 14.052C184.228 62.201 184.228 68.483 180.353 72.358zM257.081 89.3l-27.568 27.568c-7.755 7.755-20.328 7.755-28.083 0l0 0c-7.755-7.755-7.755-20.328 0-28.083l27.568-27.568c3.875-3.875 10.156-3.875 14.031 0l14.052 14.052C260.956 79.143 260.956 85.425 257.081 89.3zM438.945 330.95l-27.568 27.568c-7.755 7.755-7.755 20.328 0 28.083l0 0c7.755 7.755 20.328 7.755 28.083 0l27.568-27.568c3.875-3.875 3.875-10.156 0-14.031l-14.052-14.052C449.101 327.075 442.819 327.075 438.945 330.95zM422.003 254.221l-27.568 27.568c-7.755 7.755-7.755 20.328 0 28.083h0c7.755 7.755 20.328 7.755 28.083 0l27.568-27.568c3.875-3.875 3.875-10.156 0-14.031l-14.052-14.052C432.16 250.347 425.878 250.347 422.003 254.221z"/>
    <path fill="currentColor" d="M55.374 74.815l318.036 49.052L256.473 240.804 10.287 106.216c-5.885-3.217-7.028-11.185-2.286-15.927l0 0C20.41 77.88 38.002 72.114 55.374 74.815zM421.003 503.29L421.003 503.29c-4.743 4.743-12.71 3.599-15.927-2.285L270.452 254.782l116.937-116.937 49.088 318.072C439.141 473.253 433.411 490.882 421.003 503.29zM187.194 479.493l-6.138 6.138c-4.016 4.016-10.79 2.89-13.291-2.209l-46.037-93.851-93.874-46.06c-5.098-2.501-6.223-9.275-2.208-13.29l6.139-6.139c8.582-8.582 20.492-12.977 32.592-12.025l123.165 9.684 1.703-1.703.157 1.86 1.838.134-1.703 1.703 9.683 123.166C200.171 459.001 195.777 470.911 187.194 479.493z"/>
    <path fill="#f2f2f2" d="M212.403,357.491c-22.52,20.416-61.984,47.599-85.075,54.406l-11.122,3.303c-4.342,1.289-10.248-0.879-14.737-5.368l0,0c-4.489-4.489-6.657-10.395-5.368-14.737l3.303-11.122c6.807-23.091,33.991-62.555,54.406-85.075L382.827,50.959c30.22-33.492,86.717-61.91,113.072-35.554s-2.064,82.852-35.556,113.072L212.403,357.491z"/>
  </svg>
);

// Fix para Cloudflare / Producción con Vite 8
// Importar el worker con "?url" asegura que Vite lo procese y lo sirva desde el mismo dominio,
// evitando el error de CORS (SecurityError) al construir el Web Worker.
if (typeof window !== 'undefined') {
  maplibregl.setWorkerUrl(workerUrl);
}

// Componente interno que usa el contexto de react-map-gl
function MapScene({ data, started, temaColors, onArrival }) {
  const { origen, destino } = data;
  const { arrived, routeGeojson, vehiclePos, vehicleBearing, currentVehicleType } = useMapAnimation({ origen, destino, started });

  const [showModal, setShowModal] = useState(false);
  const [showHug, setShowHug] = useState(false);

  // Notificar al padre cuando llegue
  useEffect(() => {
    if (arrived && started) {
      if (onArrival) onArrival(true);
      setShowHug(true);
      const t = setTimeout(() => setShowHug(false), 3500);
      return () => clearTimeout(t);
    }
  }, [arrived, started, onArrival]);

  // Estilo de la línea
  const lineLayer = useMemo(() => ({
    id: 'route-line',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': temaColors.trail,
      'line-width': 3,
      'line-dasharray': [1, 2],
      'line-opacity': 0.8
    }
  }), [temaColors]);

  return (
    <>
      <style>{`
        @keyframes vg-hug-pop {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          25% { transform: translate(-50%, -50%) scale(1); }
          85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>

      {/* Ruta */}
      {routeGeojson && (
        <Source id="route" type="geojson" data={routeGeojson}>
          <Layer {...lineLayer} />
        </Source>
      )}

      {/* Marcador de Origen */}
      {origen && (
        <Marker longitude={origen.exactLng || origen.lng} latitude={origen.exactLat || origen.lat} anchor="bottom">
          <div className="vg-pin" style={{ color: temaColors.primary }}></div>
        </Marker>
      )}

      {/* Marcador de Destino */}
      {destino && (
        <Marker longitude={destino.exactLng || destino.lng} latitude={destino.exactLat || destino.lat} anchor="bottom">
          <div className="vg-pin" style={{ color: temaColors.primary }}></div>
        </Marker>
      )}

      {/* Vehículo Animado */}
      {vehiclePos && !arrived && (
        <Marker
          longitude={vehiclePos[0]}
          latitude={vehiclePos[1]}
          rotation={currentVehicleType === 'car' ? 0 : vehicleBearing}
          anchor="center"
        >
          <div className="vg-vehicle">
            {currentVehicleType === 'car'
              ? <CarIcon  color={temaColors.primary} glow={temaColors.glow} size={52} />
              : <PlaneIcon color={temaColors.primary} glow={temaColors.glow} size={36} />
            }
          </div>
        </Marker>
      )}

      {/* Abrazo Animado */}
      {showHug && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100, textAlign: 'center', pointerEvents: 'none', animation: 'vg-hug-pop 3.5s forwards' }}>
          <svg viewBox="0 0 32 32" width="90" height="90" fill={temaColors.primary} style={{ filter: `drop-shadow(0 0 15px ${temaColors.glow})` }}>
            <path d="M29.0005 19C29.0005 17.6041 28.643 16.2918 28.0145 15.1495C28.0983 15.0268 28.1701 14.8952 28.2282 14.7561C28.4483 14.2301 28.4566 13.6394 28.2513 13.1075C28.046 12.5755 27.643 12.1435 27.1267 11.9017C26.7527 11.7266 26.3402 11.6611 25.9361 11.7077C26.1039 11.3703 26.2384 11.0155 26.3367 10.6482L27.0704 7.92147C27.2886 7.22944 27.3657 6.50055 27.2969 5.77803C27.2274 5.04729 27.0101 4.33828 26.6583 3.69402C26.3066 3.04976 25.8276 2.48367 25.2504 2.03009C24.6733 1.5765 24.01 1.24488 23.3009 1.05533C22.5917 0.865778 21.8515 0.822252 21.125 0.927389C20.3985 1.03253 19.701 1.28414 19.0746 1.66696C18.4483 2.04978 17.9063 2.55584 17.4814 3.15443C17.3904 3.28263 17.3052 3.41449 17.226 3.54963C16.8984 3.09916 16.4883 2.71427 16.0169 2.41565C15.5008 2.08863 14.9224 1.87218 14.3184 1.77997C13.7143 1.68776 13.0977 1.7218 12.5075 1.87993C11.9173 2.03806 11.3663 2.31686 10.8892 2.6987C10.4122 3.08055 10.0195 3.55716 9.73601 4.09844C9.45249 4.63971 9.28427 5.23389 9.24198 5.84347C9.20311 6.40383 9.27143 6.966 9.4428 7.49998H7.15184C3.19421 7.49998 1.64009 12.6329 4.93304 14.8282L6.87356 16.1219L5.52005 21.43C5.35091 22.0705 5.33241 22.7415 5.466 23.3904C5.59959 24.0393 5.88164 24.6484 6.29005 25.17C6.69578 25.6931 7.2158 26.1164 7.81031 26.4076C7.99513 26.4981 8.18563 26.5751 8.38031 26.6383V30C8.38031 30.5523 8.82803 31 9.38031 31H19.9203L19.9277 31H28.0005C28.5527 31 29.0005 30.5523 29.0005 30V19ZM15.0005 26.85H17.72C18.2993 26.8501 18.8555 26.6228 19.2688 26.2169C19.6821 25.8111 19.9196 25.2592 19.93 24.68C19.9301 24.3837 19.8715 24.0903 19.7578 23.8166C19.6441 23.543 19.4775 23.2945 19.2675 23.0855C19.0575 22.8764 18.8083 22.7109 18.5342 22.5984C18.26 22.4859 17.9664 22.4287 17.67 22.43H15.0005V19.6713C15.0005 19.3369 14.8334 19.0247 14.5552 18.8392L6.04244 13.1641C4.39597 12.0664 5.17303 9.49998 7.15184 9.49998H9.99083L10.2303 10.39C10.4591 11.2414 10.9243 12.0107 11.572 12.6088C12.2197 13.207 13.0234 13.6095 13.8903 13.77C14.4876 13.8745 15.1004 13.8472 15.686 13.69C16.2067 13.5503 16.6946 13.3108 17.123 12.9855C17.1785 12.9951 17.2351 13 17.2924 13H21.0005C21.3828 13 21.7567 13.0357 22.1192 13.1041L19.6104 14.07C19.1307 14.2564 18.731 14.6043 18.4804 15.0537C18.2298 15.5032 18.1439 16.0261 18.2375 16.5321C18.3311 17.0381 18.5984 17.4956 18.9933 17.8257C19.3881 18.1557 19.8858 18.3376 20.4004 18.34C20.674 18.3397 20.9452 18.2889 21.2004 18.19L26.3187 16.2194C26.7541 17.0506 27.0005 17.9965 27.0005 19V29H15.0005V26.85ZM18.604 11C18.6424 10.9013 18.6774 10.8011 18.709 10.6996C18.971 9.85866 18.9888 8.96063 18.7603 8.11L18.3123 6.48899L18.5528 5.59545L18.5581 5.57075C18.6557 5.11797 18.8443 4.68974 19.1124 4.31203C19.3805 3.93431 19.7225 3.61499 20.1177 3.37343C20.5129 3.13188 20.953 2.97311 21.4114 2.90677C21.8699 2.84043 22.337 2.86789 22.7844 2.9875C23.2319 3.1071 23.6504 3.31636 24.0146 3.60257C24.3788 3.88878 24.681 4.24598 24.903 4.6525C25.125 5.05903 25.262 5.50641 25.3059 5.96751C25.3498 6.42861 25.2996 6.89381 25.1582 7.33491L25.1511 7.35737L24.4045 10.1318C24.2729 10.624 24.0406 11.0813 23.7245 11.4757C22.8742 11.1678 21.957 11 21.0005 11H18.604Z" />
          </svg>
          <div style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', textShadow: `0 2px 8px ${temaColors.glow}`, marginTop: '10px', fontFamily: "'Dancing Script', cursive" }}>
            ¡Te extrañé!
          </div>
        </div>
      )}

      {/* Botón de Llegada */}
      {started && arrived && !showModal && !showHug && (
        <div className="vg-abrir-container">
          <button
            className="vg-btn-abrir"
            style={{ '--vg-accent': temaColors.primary, '--vg-glow': temaColors.glow }}
            onClick={async () => {
              setShowModal(true);
              const confetti = (await import('canvas-confetti')).default;
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: [temaColors.primary, '#ffffff', temaColors.glow],
                zIndex: 10000
              });
            }}
          >
            Abrir mensaje
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ArrivalModal
          data={data}
          temaColors={temaColors}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default function VueloGlobal({ isPreview, data }) {
  const [started, setStarted] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  // Extraer valores por defecto de la configuración
  const defaultValues = useMemo(() => {
    const vals = {};
    vueloGlobalConfig.fields.forEach(f => {
      if (f.defaultValue !== undefined) vals[f.name] = f.defaultValue;
    });
    return vals;
  }, []);

  // Datos por defecto si faltan
  const finalData = {
    ...defaultValues,
    ...(data || {})
  };

  const tema = finalData.tema || 'aurora';
  const temaColors = vueloGlobalConfig.temas[tema] || vueloGlobalConfig.temas.aurora;

  const isCar = useMemo(() => {
    if (!finalData.origen || !finalData.destino) return false;
    const start = [finalData.origen.exactLng || finalData.origen.lng, finalData.origen.exactLat || finalData.origen.lat];
    const end = [finalData.destino.exactLng || finalData.destino.lng, finalData.destino.exactLat || finalData.destino.lat];
    const dist = turf.distance(start, end, { units: 'kilometers' });
    return dist < 400; // Menos de 400km es viaje en auto
  }, [finalData.origen, finalData.destino]);

  // Mapa base (Dark Matter de Carto) - Gratis sin API Key, súper rápido y ligero
  const mapStyleUrl = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

  const rootClass = `vg-root${!isPreview ? ' vg-root--fullscreen' : ''}`;



  return (
    <div className={rootClass} style={{ '--vg-accent': temaColors.primary, '--vg-glow': temaColors.glow }}>
      {!started && (
        <div className="vg-start-overlay">
          <div className="vg-start-icon" style={{ color: temaColors.primary }}>
            {isCar ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52" style={{ filter: `drop-shadow(0 0 12px ${temaColors.glow})` }}>
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52" style={{ filter: `drop-shadow(0 0 12px ${temaColors.glow})` }}>
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            )}
          </div>
          <div className="vg-start-subtitle">TIENES UN MENSAJE ESPECIAL</div>
          <h2 className="vg-start-title">
            Para <span style={{ color: temaColors.primary, textShadow: `0 0 15px ${temaColors.glow}` }}>{finalData.para}</span>
          </h2>
          <div className="vg-start-route">
            <span>{finalData.origen?.name}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16" style={{ color: temaColors.primary, margin: '0 8px', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            <span>{finalData.destino?.name}</span>
          </div>
          <button className="vg-btn-start" onClick={() => setStarted(true)}>
            Iniciar viaje
          </button>
        </div>
      )}
      <MapProvider>
        <Map
          initialViewState={{
            longitude: finalData.origen?.lng || -77.0428,
            latitude: finalData.origen?.lat || -12.0464,
            zoom: 2,
          }}
          mapStyle={mapStyleUrl}
          projection="globe" // Activamos el globo 3D
          scrollZoom={isInteractive}
          dragPan={isInteractive}
          doubleClickZoom={isInteractive}
          dragRotate={isInteractive}
          touchZoomRotate={isInteractive}
          attributionControl={false}
          interactiveLayerIds={[]}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <MapScene data={finalData} started={started} temaColors={temaColors} onArrival={() => setIsInteractive(true)} />
        </Map>
      </MapProvider>
    </div>
  );
}