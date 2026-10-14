// src/utils/maps.js
// Plain helpers (no Leaflet import), safe to use from any page without pulling in the map bundle.

export const hasCoordinates = (lat, lng) =>
  lat !== null && lat !== undefined && lat !== '' && lng !== null && lng !== undefined && lng !== '' &&
  Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));

// Opens Google Maps turn-by-turn directions to the point.
export const directionsUrl = (lat, lng) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
