// src/components/common/LocationMap.jsx
// Read-only map of one location (the "Get Directions" link lives in utils/maps.js).
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { pinIcon } from './mapPin';

const LocationMap = ({ latitude, longitude, label, className = 'h-64' }) => {
  const containerRef = useRef(null);
  const lat = Number(latitude);
  const lng = Number(longitude);

  useEffect(() => {
    if (!containerRef.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([lat, lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
    if (label) marker.bindTooltip(label, { direction: 'top', offset: [0, -40] });
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => {
      clearTimeout(t);
      map.remove();
    };
  }, [lat, lng, label]);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return <div ref={containerRef} className={`isolate w-full rounded-xl border border-gray-200 dark:border-gray-700 ${className}`} />;
};

export default LocationMap;
