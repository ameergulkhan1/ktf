// src/components/common/mapPin.js
import L from 'leaflet';

// A CSS/SVG pin instead of Leaflet's default PNG marker, whose image paths break under Vite.
export const pinIcon = L.divIcon({
  className: '',
  html:
    '<svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 26 16 26s16-14 16-26C32 7.2 24.8 0 16 0z" fill="#2563EB"/>' +
    '<circle cx="16" cy="16" r="6" fill="#fff"/></svg>',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});
