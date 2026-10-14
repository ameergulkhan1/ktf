// src/components/common/LocationPicker.jsx
//
// OpenStreetMap location picker for a vendor's restaurant: search an address, use the
// device location, or click / drag the pin. Loaded lazily so Leaflet only ships to the
// pages that show a map.
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { pinIcon } from './mapPin';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

const NOMINATIM = 'https://nominatim.openstreetmap.org';
const PAKISTAN_CENTER = [30.3753, 69.3451];
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const toNumber = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

// Address parts from a Nominatim result, mapped onto the restaurant form's fields.
const addressFromNominatim = (result) => {
  const a = result?.address || {};
  return {
    address: [a.house_number, a.road, a.neighbourhood || a.suburb].filter(Boolean).join(', ') || result?.display_name || '',
    city: a.city || a.town || a.village || a.county || '',
    state: a.state || '',
    postal_code: a.postcode || '',
    country: a.country || '',
    display_name: result?.display_name || '',
  };
};

const LocationPicker = ({ latitude, longitude, onChange, onAddressFound }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const onAddressRef = useRef(onAddressFound);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [message, setMessage] = useState('');

  onChangeRef.current = onChange;
  onAddressRef.current = onAddressFound;

  const lat = toNumber(latitude);
  const lng = toNumber(longitude);

  // Reverse-geocode a picked point so the vendor can copy the address into the form.
  const reverseGeocode = async (pickLat, pickLng) => {
    try {
      const res = await fetch(`${NOMINATIM}/reverse?format=jsonv2&addressdetails=1&lat=${pickLat}&lon=${pickLng}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && !data.error) onAddressRef.current?.(addressFromNominatim(data));
    } catch {
      // Address lookup is a convenience; the coordinates are what get saved.
    }
  };

  const placeMarker = (pickLat, pickLng, { pan = true, lookup = true } = {}) => {
    const map = mapRef.current;
    if (!map) return;
    const point = [pickLat, pickLng];
    if (!markerRef.current) {
      markerRef.current = L.marker(point, { icon: pinIcon, draggable: true }).addTo(map);
      markerRef.current.on('dragend', () => {
        const p = markerRef.current.getLatLng();
        onChangeRef.current?.({ latitude: round(p.lat), longitude: round(p.lng) });
        reverseGeocode(p.lat, p.lng);
      });
    } else {
      markerRef.current.setLatLng(point);
    }
    if (pan) map.setView(point, Math.max(map.getZoom(), 16));
    onChangeRef.current?.({ latitude: round(pickLat), longitude: round(pickLng) });
    if (lookup) reverseGeocode(pickLat, pickLng);
  };

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;
    const hasPoint = lat !== null && lng !== null;
    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
      hasPoint ? [lat, lng] : PAKISTAN_CENTER,
      hasPoint ? 16 : 5
    );
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
    map.on('click', (e) => placeMarker(e.latlng.lat, e.latlng.lng, { pan: false }));
    mapRef.current = map;
    if (hasPoint) {
      markerRef.current = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
      markerRef.current.on('dragend', () => {
        const p = markerRef.current.getLatLng();
        onChangeRef.current?.({ latitude: round(p.lat), longitude: round(p.lng) });
        reverseGeocode(p.lat, p.lng);
      });
    }
    // The form can mount inside a container that is still sizing itself.
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => {
      clearTimeout(t);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the pin in sync when the saved location loads after the map was created.
  useEffect(() => {
    if (!mapRef.current || lat === null || lng === null) return;
    const current = markerRef.current?.getLatLng();
    if (current && Math.abs(current.lat - lat) < 1e-6 && Math.abs(current.lng - lng) < 1e-6) return;
    placeMarker(lat, lng, { lookup: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  // Search runs on submit only (no type-ahead), per Nominatim's usage policy.
  const search = async (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (q.length < 3) {
      setMessage('Type at least 3 characters to search.');
      return;
    }
    setSearching(true);
    setMessage('');
    setResults([]);
    try {
      const res = await fetch(
        `${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=pk&q=${encodeURIComponent(q)}`,
        { headers: { Accept: 'application/json' } }
      );
      const data = res.ok ? await res.json() : [];
      if (!data.length) setMessage('No matches. Try a nearby landmark or area, then drag the pin.');
      setResults(data);
    } catch {
      setMessage('Address search is unavailable right now. You can still click the map to set the location.');
    } finally {
      setSearching(false);
    }
  };

  const pickResult = (result) => {
    setResults([]);
    setQuery(result.display_name);
    placeMarker(Number(result.lat), Number(result.lon), { lookup: false });
    onAddressRef.current?.(addressFromNominatim(result));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Your browser cannot share its location.');
      return;
    }
    setLocating(true);
    setMessage('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        placeMarker(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocating(false);
        setMessage('Location permission was denied. Search for the address or click the map instead.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Not a nested <form>: this sits inside the restaurant form. */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') search(e);
            }}
            placeholder="Search your restaurant's address or area"
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={search}
            disabled={searching}
            className="flex-1 sm:flex-none rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {searching ? 'Searching…' : 'Search'}
          </button>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <MapPinIcon className="h-4 w-4" />
            {locating ? 'Locating…' : 'Use my location'}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white text-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                type="button"
                onClick={() => pickResult(r)}
                className="w-full px-3 py-2 text-left text-gray-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {message && <p className="text-sm text-amber-600 dark:text-amber-400">{message}</p>}

      {/* isolate: Leaflet's panes use z-index 400+, which would float over the navbar. */}
      <div ref={containerRef} className="isolate h-72 sm:h-80 w-full rounded-lg border border-gray-300 dark:border-gray-600" />

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {lat !== null && lng !== null
          ? `Pinned at ${lat.toFixed(6)}, ${lng.toFixed(6)}. Drag the pin to fine-tune it.`
          : 'Click the map, search an address, or use your location to drop a pin.'}
      </p>
    </div>
  );
};

const round = (n) => Math.round(n * 1e6) / 1e6;

export default LocationPicker;
