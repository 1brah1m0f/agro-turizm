"use client";

import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState, useCallback } from "react";
import { LOCATIONS, TYPE_META, type Location, type LocationType } from "./locations";
import { type Tour } from "./tours";

// ── Constants ────────────────────────────────────────────────────
const BAKU_LATLNG = { lat: 40.4093, lng: 49.8671 };
const AZ_CENTER   = { lat: 40.8, lng: 47.5 };

const CATEGORY_COLOR: Partial<Record<LocationType, string>> = {
  farm:       "#8B5E3C",
  vineyard:   "#7B4F9E",
  beekeeping: "#F59E0B",
  park:       "#2D7A3A",
  lakeside:   "#2563EB",
  citrus:     "#EA580C",
  animal:     "#E74C3C",
  cultural:   "#C0392B",
  tea:        "#27AE60",
  lavender:   "#8E44AD",
  fish:       "#1A6EA8",
  guesthouse: "#A0522D",
};

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "all",                  stylers:                         [{ saturation: -18 }] },
  { featureType: "landscape.natural",    elementType: "geometry",         stylers: [{ color: "#dff0d8" }] },
  { featureType: "poi.park",             elementType: "geometry.fill",    stylers: [{ color: "#c2dfa8" }] },
  { featureType: "poi.attraction",       elementType: "geometry",         stylers: [{ color: "#d4e8b5" }] },
  { featureType: "water",                elementType: "geometry",         stylers: [{ color: "#b8d9f0" }] },
  { featureType: "road",                 elementType: "geometry",         stylers: [{ saturation: -40 }] },
  { featureType: "road.highway",         elementType: "geometry.fill",    stylers: [{ color: "#f5e8c0" }] },
  { featureType: "landscape.man_made",   elementType: "geometry",         stylers: [{ color: "#f0ede6" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#555" }] },
];

// ── SVG pin factory ──────────────────────────────────────────────
function makePinUrl(emoji: string, color: string, selected: boolean) {
  const s = selected ? 50 : 40;
  const h = selected ? 60 : 48;
  const svg = `<svg width="${s}" height="${h}" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
    <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity="0.3"/></filter>
    <path d="M20 0C9 0 0 9 0 20c0 12 20 28 20 28S40 32 40 20C40 9 31 0 20 0z" fill="${color}" filter="url(#sh)"/>
    <circle cx="20" cy="20" r="12" fill="white"/>
    <text x="20" y="24.5" text-anchor="middle" font-size="13" font-family="Arial,sans-serif">${emoji}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

// ── Region card (floats over map bottom-right) ───────────────────
interface RegionCard { name: string; distKm: number; lat: number; lng: number }

// ── Inner map layer (has google.maps context) ────────────────────
interface LayerProps {
  activeTypes: LocationType[];
  selectedTour: Tour | null;
  selectedLocation: Location | null;
  onLocationSelect: (loc: Location | null) => void;
  onRegionCard: (card: RegionCard | null) => void;
}

function MapLayer({ activeTypes, selectedTour, selectedLocation, onLocationSelect, onRegionCard }: LayerProps) {
  const map          = useMap();
  const geometryLib  = useMapsLibrary("geometry");
  const markersRef   = useRef<google.maps.Marker[]>([]);
  const routeRef     = useRef<google.maps.Polyline | null>(null);
  const stopMksRef   = useRef<google.maps.Marker[]>([]);
  const bakuRouteRef = useRef<google.maps.Polyline | null>(null);
  const bakuMkRef    = useRef<google.maps.Marker | null>(null);
  const infoWinRef   = useRef<google.maps.InfoWindow | null>(null);
  const geocoderRef  = useRef<google.maps.Geocoder | null>(null);
  const clickListRef = useRef<google.maps.MapsEventListener | null>(null);

  // Distance helper
  const distKm = useCallback((lat: number, lng: number) => {
    if (!geometryLib || !window.google) return 0;
    return Math.round(
      google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(BAKU_LATLNG.lat, BAKU_LATLNG.lng),
        new google.maps.LatLng(lat, lng),
      ) / 1000,
    );
  }, [geometryLib]);

  // ── Location markers ─────────────────────────────────────────
  useEffect(() => {
    if (!map || !window.google) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    if (selectedTour) return; // hide all regular markers when tour route shown

    LOCATIONS.filter(l => activeTypes.includes(l.type)).forEach(loc => {
      const color    = CATEGORY_COLOR[loc.type] ?? "#2D7A3A";
      const selected = selectedLocation?.id === loc.id;
      const marker   = new google.maps.Marker({
        position:  { lat: loc.lat, lng: loc.lng },
        map,
        icon: {
          url:        makePinUrl(TYPE_META[loc.type].emoji, color, selected),
          scaledSize: new google.maps.Size(selected ? 50 : 40, selected ? 60 : 48),
          anchor:     new google.maps.Point(selected ? 25 : 20, selected ? 60 : 48),
        },
        zIndex: selected ? 999 : 1,
      });

      marker.addListener("click", () => {
        map.panTo({ lat: loc.lat, lng: loc.lng });
        onLocationSelect(loc);
        onRegionCard(null);

        if (!infoWinRef.current) infoWinRef.current = new google.maps.InfoWindow();
        const km = distKm(loc.lat, loc.lng);
        infoWinRef.current.setContent(`
          <div style="font-family:Inter,sans-serif;max-width:240px;padding:4px 2px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
              <span style="font-size:22px">${TYPE_META[loc.type].emoji}</span>
              <div>
                <strong style="font-size:14px;color:#111;display:block">${loc.name}</strong>
                <div style="display:flex;gap:5px;margin-top:3px">
                  <span style="background:${color}20;color:${color};padding:1px 8px;border-radius:20px;font-size:10px;font-weight:600">${TYPE_META[loc.type].label}</span>
                  <span style="background:#F3F4F6;color:#374151;padding:1px 8px;border-radius:20px;font-size:10px;font-weight:600">Bakıdan ~${km} km</span>
                </div>
              </div>
            </div>
            <p style="font-size:12px;color:#555;margin:0;line-height:1.5">${loc.description.substring(0, 90)}…</p>
          </div>`);
        infoWinRef.current.open({ map, anchor: marker });
      });

      markersRef.current.push(marker);
    });

    return () => { markersRef.current.forEach(m => m.setMap(null)); };
  }, [map, activeTypes, selectedTour, selectedLocation, distKm, onLocationSelect, onRegionCard]);

  // ── Tour route ───────────────────────────────────────────────
  useEffect(() => {
    if (!map || !window.google) return;
    routeRef.current?.setMap(null);
    stopMksRef.current.forEach(m => m.setMap(null));
    stopMksRef.current = [];

    if (!selectedTour) return;

    const stops = selectedTour.stopIds
      .map(id => LOCATIONS.find(l => l.id === id))
      .filter(Boolean) as typeof LOCATIONS;
    if (stops.length < 2) return;

    const path = stops.map(s => ({ lat: s.lat, lng: s.lng }));

    routeRef.current = new google.maps.Polyline({
      path,
      strokeColor:   selectedTour.routeColor,
      strokeWeight:  3.5,
      strokeOpacity: 0.9,
      icons: [{
        icon:   { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: selectedTour.routeColor },
        offset: "100%",
        repeat: "80px",
      }],
      map,
    });

    stops.forEach((stop, i) => {
      const mk = new google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map,
        zIndex: 100,
        icon: {
          path:          google.maps.SymbolPath.CIRCLE,
          scale:         16,
          fillColor:     selectedTour.routeColor,
          fillOpacity:   1,
          strokeColor:   "white",
          strokeWeight:  2.5,
        },
        label: { text: String(i + 1), color: "white", fontWeight: "bold", fontSize: "12px" },
      });

      // Hover mini info
      const iw = new google.maps.InfoWindow();
      mk.addListener("mouseover", () => {
        const photo = stop.photos[0]?.url ?? "";
        iw.setContent(`
          <div style="font-family:Inter,sans-serif;display:flex;align-items:center;gap:8px;padding:2px;max-width:200px">
            ${photo ? `<img src="${photo}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;flex-shrink:0" onerror="this.style.display='none'" />` : ""}
            <div>
              <strong style="font-size:12px;color:#111;display:block">${stop.name}</strong>
              <span style="font-size:10px;color:#666">${stop.village}</span>
            </div>
          </div>`);
        iw.open({ map, anchor: mk });
      });
      mk.addListener("mouseout", () => iw.close());
      stopMksRef.current.push(mk);
    });

    const bounds = new google.maps.LatLngBounds();
    path.forEach(p => bounds.extend(p));
    map.fitBounds(bounds, { top: 80, right: 60, bottom: 220, left: 60 });
  }, [map, selectedTour]);

  // ── Baku → location route ────────────────────────────────────
  useEffect(() => {
    if (!map || !window.google) return;
    bakuRouteRef.current?.setMap(null);
    bakuMkRef.current?.setMap(null);

    if (!selectedLocation || selectedTour) return;

    const waypoints = getBakuWaypoints(selectedLocation.lat, selectedLocation.lng);

    bakuRouteRef.current = new google.maps.Polyline({
      path:          waypoints,
      strokeColor:   "#7C3AED",
      strokeWeight:  4,
      strokeOpacity: 0.85,
      map,
    });

    // Animate draw via strokeOpacity trick
    let opacity = 0;
    const interval = setInterval(() => {
      opacity = Math.min(opacity + 0.07, 0.85);
      bakuRouteRef.current?.setOptions({ strokeOpacity: opacity });
      if (opacity >= 0.85) clearInterval(interval);
    }, 40);

    bakuMkRef.current = new google.maps.Marker({
      position: BAKU_LATLNG,
      map,
      icon: {
        path:         google.maps.SymbolPath.CIRCLE,
        scale:        10,
        fillColor:    "#F97316",
        fillOpacity:  1,
        strokeColor:  "white",
        strokeWeight: 2.5,
      },
      label: { text: "Bakı", color: "#F97316", fontWeight: "bold", fontSize: "11px" },
    });

    const bounds = new google.maps.LatLngBounds();
    waypoints.forEach(p => bounds.extend(p));
    map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });

    return () => clearInterval(interval);
  }, [map, selectedLocation, selectedTour]);

  // ── Map click → geocode region ───────────────────────────────
  useEffect(() => {
    if (!map || !window.google) return;
    if (!geocoderRef.current) geocoderRef.current = new google.maps.Geocoder();
    clickListRef.current?.remove();
    clickListRef.current = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      infoWinRef.current?.close();
      geocoderRef.current!.geocode({ location: { lat, lng }, language: "az" }, (results, status) => {
        if (status !== "OK" || !results?.length) return;
        const found = results.find(r => r.types.some(t => ["administrative_area_level_2", "locality", "sublocality"].includes(t))) ?? results[0];
        const comp  = found.address_components.find(c => c.types.some(t => ["administrative_area_level_2", "locality"].includes(t)));
        const name  = comp?.long_name ?? found.formatted_address.split(",")[0];
        onRegionCard({ name, distKm: distKm(lat, lng), lat, lng });
      });
    });
    return () => clickListRef.current?.remove();
  }, [map, distKm, onRegionCard]);

  return null;
}

// ── Baku route waypoints ─────────────────────────────────────────
function getBakuWaypoints(dLat: number, dLng: number): { lat: number; lng: number }[] {
  const baku = BAKU_LATLNG;
  if (dLat < 39.8) return [baku, { lat: 40.2, lng: 49.55 }, { lat: 39.97, lng: 49.1 }, { lat: 39.7, lng: 49.0 }, { lat: dLat, lng: dLng }];
  if (dLng < 46.5) return [baku, { lat: 40.44, lng: 49.35 }, { lat: 40.56, lng: 48.4 }, { lat: 40.65, lng: 47.5 }, { lat: dLat, lng: dLng }];
  if (dLat > 41.3) return [baku, { lat: 40.6, lng: 49.65 }, { lat: 41.0, lng: 49.1 }, { lat: dLat, lng: dLng }];
  if (dLng < 47.4) return [baku, { lat: 40.44, lng: 49.35 }, { lat: 40.56, lng: 48.4 }, { lat: 40.68, lng: 47.8 }, { lat: 40.85, lng: 47.3 }, { lat: dLat, lng: dLng }];
  if (dLng < 48.2) return [baku, { lat: 40.44, lng: 49.35 }, { lat: 40.56, lng: 48.4 }, { lat: 40.65, lng: 48.0 }, { lat: dLat, lng: dLng }];
  return [baku, { lat: 40.44, lng: 49.35 }, { lat: 40.52, lng: 49.0 }, { lat: 40.55, lng: 48.55 }, { lat: dLat, lng: dLng }];
}

// ── Public component ─────────────────────────────────────────────
interface Props {
  activeTypes: LocationType[];
  selectedTour: Tour | null;
  selectedLocation: Location | null;
  onLocationSelect: (loc: Location | null) => void;
}

export default function GoogleAzerbaijanMap({ activeTypes, selectedTour, selectedLocation, onLocationSelect }: Props) {
  const apiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim();
  const mapId  = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "").trim() || undefined;
  const [regionCard, setRegionCard] = useState<RegionCard | null>(null);

  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-4 p-8 text-center">
        <div className="text-4xl">🗺️</div>
        <h3 className="font-bold text-gray-800">Google Maps API açarı lazımdır</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          <code className="bg-gray-100 px-2 py-1 rounded text-xs block mt-2">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
          dəyərini <code className="bg-gray-100 px-1 rounded text-xs">.env.local</code> faylına əlavə edin.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <APIProvider apiKey={apiKey} libraries={["places", "geometry", "marker"]}>
        <Map
          mapId={mapId || undefined}
          defaultCenter={AZ_CENTER}
          defaultZoom={8}
          styles={mapId ? undefined : MAP_STYLES}
          disableDefaultUI
          gestureHandling="greedy"
          className="w-full h-full">
          <MapLayer
            activeTypes={activeTypes}
            selectedTour={selectedTour}
            selectedLocation={selectedLocation}
            onLocationSelect={onLocationSelect}
            onRegionCard={setRegionCard}
          />
        </Map>
      </APIProvider>

      {/* Zoom controls */}
      <div className="absolute bottom-24 right-4 z-[500] flex flex-col gap-1">
        {["+", "−"].map(s => (
          <button key={s} className="w-9 h-9 bg-white rounded-xl shadow border border-gray-200 text-gray-700 font-bold text-base hover:bg-gray-50 transition-colors">
            {s}
          </button>
        ))}
      </div>

      {/* Region click card */}
      {regionCard && (
        <div className="absolute bottom-6 right-14 z-[600] bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-72 animate-[fadeSlideUp_0.25s_ease_forwards]">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base">{regionCard.name}</h3>
              <span className="inline-block mt-1 bg-purple-50 text-purple-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                Bakıdan ~{regionCard.distKm} km
              </span>
            </div>
            <button onClick={() => setRegionCard(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-2">×</button>
          </div>
          <button className="mt-3 w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
            Bu ərazidəki turları gör →
          </button>
        </div>
      )}
    </div>
  );
}
