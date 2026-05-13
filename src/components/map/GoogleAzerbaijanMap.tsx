"use client";

import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useEffect, useRef, useState, useCallback } from "react";
import { X, Navigation, Clock, MapPin, ChevronLeft, ChevronRight, AlertCircle, Locate } from "lucide-react";
import { LOCATIONS, TYPE_META, type Location, type LocationType } from "./locations";
import { type Tour } from "./tours";
import { cn } from "@/lib/utils/cn";

const BAKU = { lat: 40.4093, lng: 49.8671 };
const AZ_CENTER = { lat: 40.8, lng: 47.5 };
const CATEGORY_COLOR: Partial<Record<LocationType, string>> = {
  farm: "#8B5E3C", vineyard: "#7B4F9E", beekeeping: "#F59E0B",
  park: "#2D7A3A", lakeside: "#2563EB", citrus: "#EA580C",
  animal: "#E74C3C", cultural: "#C0392B", tea: "#27AE60",
  lavender: "#8E44AD", fish: "#1A6EA8", guesthouse: "#A0522D",
};
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "all", stylers: [{ saturation: -18 }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dff0d8" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#c2dfa8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d9f0" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ saturation: -40 }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#f5e8c0" }] },
];

function PhotoCarousel({ photos }: { photos: Location["photos"] }) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setIdx(0); setLoaded(false); }, [photos]);
  if (!photos.length) return <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-5xl rounded-t-2xl">🌿</div>;
  const photo = photos[Math.min(idx, photos.length - 1)];
  return (
    <div className="relative h-44 bg-gray-200 rounded-t-2xl overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={photo.url} src={photo.url} alt={photo.caption} onLoad={() => setLoaded(true)} onError={() => setLoaded(true)}
        className={cn("w-full h-full object-cover transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")} />
      {!loaded && <div className="absolute inset-0 flex items-center justify-center"><div className="w-7 h-7 border-2 border-white/60 border-t-transparent rounded-full animate-spin" /></div>}
      {photos.length > 1 && <>
        <button onClick={() => { setLoaded(false); setIdx(i => (i - 1 + photos.length) % photos.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60"><ChevronLeft size={13} /></button>
        <button onClick={() => { setLoaded(false); setIdx(i => (i + 1) % photos.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60"><ChevronRight size={13} /></button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">{photos.map((_, i) => <div key={i} className={cn("rounded-full transition-all", i === idx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60")} />)}</div>
      </>}
    </div>
  );
}

function LocationPanel({ location, routeInfo, userHasLocation, onClose }: { location: Location; routeInfo: { distance: string; duration: string } | null; userHasLocation: boolean; onClose: () => void; }) {
  const color = CATEGORY_COLOR[location.type] ?? "#2D7A3A";
  return (
    <div key={location.id} className="absolute bottom-4 right-4 z-[600] w-[315px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{ animation: "panelSlideUp 0.32s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
      <div className="relative">
        <PhotoCarousel photos={location.photos} />
        <button onClick={onClose} className="absolute top-2 right-2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60"><X size={15} /></button>
        <span className="absolute top-2 left-2 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide text-white" style={{ background: color }}>{TYPE_META[location.type].label}</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{location.name}</h3>
        {routeInfo && (
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold"><MapPin size={9} />{routeInfo.distance}</span>
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold"><Clock size={9} />{routeInfo.duration}</span>
          </div>
        )}
        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{location.description}</p>
        {location.activities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">{location.activities.slice(0, 3).map(a => <span key={a} className="text-[10px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-lg">{a}</span>)}{location.activities.length > 3 && <span className="text-[10px] text-gray-400 self-center">+{location.activities.length - 3}</span>}</div>
        )}
        {location.price && <div className="flex items-center justify-between mb-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2"><span className="text-xs text-amber-700 font-medium">Qiymət</span><span className="text-sm font-bold text-amber-800">{location.price}</span></div>}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-semibold hover:brightness-110 transition-all" style={{ background: color }}><Navigation size={12} />{userHasLocation ? "Yolumu göstər" : "Yol göstər"}</button>
          <button className="border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors">Bron Et</button>
        </div>
      </div>
    </div>
  );
}

function MapLayer({ activeTypes, selectedTour, selectedLocation, onLocationSelect, userLocation, onRouteInfo, onRegionCard }: {
  activeTypes: LocationType[]; selectedTour: Tour | null; selectedLocation: Location | null;
  onLocationSelect: (l: Location | null) => void; userLocation: { lat: number; lng: number } | null;
  onRouteInfo: (r: { distance: string; duration: string } | null) => void;
  onRegionCard: (c: { name: string; distKm: number } | null) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const geometryLib = useMapsLibrary("geometry");
  const serviceRef = useRef<google.maps.DirectionsService | null>(null);
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const clickRef = useRef<google.maps.MapsEventListener | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mkRef = useRef<Record<string, any>>({});
  const userMkRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const distKm = useCallback((lat: number, lng: number) => {
    if (!geometryLib || !window.google) return 0;
    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(BAKU.lat, BAKU.lng), new google.maps.LatLng(lat, lng)) / 1000);
  }, [geometryLib]);

  useEffect(() => {
    if (!routesLib || !map) return;
    serviceRef.current = new google.maps.DirectionsService();
    const r = new google.maps.DirectionsRenderer({ suppressMarkers: true, preserveViewport: true });
    r.setMap(map);
    rendererRef.current = r;
    return () => { r.setMap(null); rendererRef.current = null; };
  }, [routesLib, map]);

  useEffect(() => {
    if (!serviceRef.current || !rendererRef.current) return;
    if (!selectedLocation || selectedTour) { rendererRef.current.set("directions", null); onRouteInfo(null); return; }
    rendererRef.current.setOptions({ polylineOptions: { strokeColor: "#7C3AED", strokeWeight: 5, strokeOpacity: 0.85 } });
    const origin = userLocation ?? BAKU;
    serviceRef.current.route({ origin, destination: { lat: selectedLocation.lat, lng: selectedLocation.lng }, travelMode: google.maps.TravelMode.DRIVING }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        rendererRef.current!.setDirections(result);
        const leg = result.routes[0].legs[0];
        onRouteInfo({ distance: leg.distance!.text, duration: leg.duration!.text });
        const bounds = new google.maps.LatLngBounds();
        result.routes[0].overview_path.forEach(p => bounds.extend(p));
        map!.fitBounds(bounds, { top: 60, right: 340, bottom: 100, left: 60 });
      }
    });
  }, [selectedLocation, selectedTour, userLocation, onRouteInfo, map]);

  useEffect(() => {
    if (!serviceRef.current || !rendererRef.current || !map) return;
    if (!selectedTour) { rendererRef.current.set("directions", null); return; }
    const stops = selectedTour.stopIds.map(id => LOCATIONS.find(l => l.id === id)).filter(Boolean) as typeof LOCATIONS;
    if (stops.length < 2) return;
    rendererRef.current.setOptions({ polylineOptions: { strokeColor: selectedTour.routeColor, strokeWeight: 4.5, strokeOpacity: 0.9, icons: [{ icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: selectedTour.routeColor }, offset: "100%", repeat: "80px" }] } });
    serviceRef.current.route({ origin: { lat: stops[0].lat, lng: stops[0].lng }, destination: { lat: stops[stops.length - 1].lat, lng: stops[stops.length - 1].lng }, waypoints: stops.slice(1, -1).map(s => ({ location: { lat: s.lat, lng: s.lng }, stopover: true })), travelMode: google.maps.TravelMode.DRIVING }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        rendererRef.current!.setDirections(result);
        const bounds = new google.maps.LatLngBounds();
        result.routes[0].overview_path.forEach(p => bounds.extend(p));
        map.fitBounds(bounds, { top: 80, right: 60, bottom: 220, left: 60 });
      }
    });
  }, [selectedTour, map]);

  useEffect(() => {
    if (!map || !window.google?.maps?.marker) return;
    Object.entries(mkRef.current).forEach(([id, m]) => { if (id.startsWith("s-")) { m.map = null; delete mkRef.current[id]; } });
    if (!selectedTour) return;
    const stops = selectedTour.stopIds.map(id => LOCATIONS.find(l => l.id === id)).filter(Boolean) as typeof LOCATIONS;
    stops.forEach((stop, i) => {
      const el = document.createElement("div");
      Object.assign(el.style, { width: "30px", height: "30px", borderRadius: "50%", background: selectedTour.routeColor, border: "3px solid white", color: "white", fontWeight: "700", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 10px rgba(0,0,0,0.35)", cursor: "pointer" });
      el.textContent = String(i + 1);
      const mk = new google.maps.marker.AdvancedMarkerElement({ position: { lat: stop.lat, lng: stop.lng }, map, content: el, zIndex: 100 });
      mkRef.current[`s-${stop.id}`] = mk;
    });
  }, [map, selectedTour]);

  useEffect(() => {
    if (!map || !window.google?.maps?.marker || !userLocation) return;
    userMkRef.current?.remove();
    const el = document.createElement("div");
    el.innerHTML = `<div style="position:relative;width:20px;height:20px"><div style="position:absolute;inset:-4px;border-radius:50%;background:#3B82F6;opacity:0.25;animation:bakuPulse 2s ease-in-out infinite"></div><div style="position:absolute;inset:2px;border-radius:50%;background:#3B82F6;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.5)"></div></div>`;
    userMkRef.current = new google.maps.marker.AdvancedMarkerElement({ position: userLocation, map, content: el, zIndex: 999 });
  }, [map, userLocation]);

  useEffect(() => {
    if (!map || !window.google) return;
    if (!geocoderRef.current) geocoderRef.current = new google.maps.Geocoder();
    clickRef.current?.remove();
    clickRef.current = map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat(), lng = e.latLng.lng();
      geocoderRef.current!.geocode({ location: { lat, lng }, language: "az" }, (results, status) => {
        if (status !== "OK" || !results?.length) return;
        const r = results.find(x => x.types.some(t => ["administrative_area_level_2", "locality"].includes(t))) ?? results[0];
        const c = r.address_components.find(x => x.types.some(t => ["administrative_area_level_2", "locality"].includes(t)));
        onRegionCard({ name: c?.long_name ?? r.formatted_address.split(",")[0], distKm: distKm(lat, lng) });
      });
    });
    return () => clickRef.current?.remove();
  }, [map, distKm, onRegionCard]);

  useEffect(() => {
    if (!map || !window.google?.maps?.marker) return;
    Object.entries(mkRef.current).forEach(([id, m]) => { if (!id.startsWith("s-")) { m.map = null; } });
    Object.keys(mkRef.current).forEach(id => { if (!id.startsWith("s-")) delete mkRef.current[id]; });
    clustererRef.current?.clearMarkers();
    if (selectedTour) return;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    LOCATIONS.filter(l => activeTypes.includes(l.type)).forEach(loc => {
      const color = CATEGORY_COLOR[loc.type] ?? "#2D7A3A";
      const isSel = selectedLocation?.id === loc.id;
      const w = isSel ? 50 : 42, h = isSel ? 61 : 51;
      const svg = `<svg viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="ds"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.28"/></filter></defs><path d="M22 0C9.85 0 0 9.85 0 22C0 35.75 22 54 22 54S44 35.75 44 22C44 9.85 34.15 0 22 0Z" fill="${color}" filter="url(#ds)"/>${isSel ? `<circle cx="22" cy="22" r="21" fill="none" stroke="white" stroke-width="2.5" opacity="0.55"/>` : ""}<circle cx="22" cy="22" r="13" fill="white"/><text x="22" y="27" text-anchor="middle" font-size="14" font-family="system-ui,sans-serif">${TYPE_META[loc.type].emoji}</text></svg>`;
      const el = document.createElement("div");
      el.className = cn("farm-marker", isSel && "selected");
      el.innerHTML = svg;
      el.addEventListener("mouseenter", () => { if (!isSel) el.style.transform = "translateY(-5px) scale(1.1)"; });
      el.addEventListener("mouseleave", () => { if (!isSel) el.style.transform = ""; });
      const mk = new google.maps.marker.AdvancedMarkerElement({ position: { lat: loc.lat, lng: loc.lng }, map, content: el, title: loc.name, zIndex: isSel ? 999 : 1 });
      mk.addListener("click", () => { onLocationSelect(loc); onRegionCard(null); map!.panTo({ lat: loc.lat, lng: loc.lng }); });
      mkRef.current[loc.id] = mk;
      markers.push(mk);
    });
    if (markers.length > 8) {
      clustererRef.current = new MarkerClusterer({ map, markers, renderer: { render: ({ count, position }) => { const size = count < 5 ? 38 : count < 10 ? 44 : 52; const el = document.createElement("div"); el.className = "cluster-badge"; Object.assign(el.style, { width: `${size}px`, height: `${size}px`, fontSize: `${size < 44 ? "12px" : "14px"}` }); el.textContent = String(count); return new google.maps.marker.AdvancedMarkerElement({ position, content: el }); } } });
    }
    return () => clustererRef.current?.clearMarkers();
  }, [map, activeTypes, selectedTour, selectedLocation, onLocationSelect, onRegionCard]);

  return null;
}

interface Props { activeTypes: LocationType[]; selectedTour: Tour | null; selectedLocation: Location | null; onLocationSelect: (loc: Location | null) => void; }

export default function GoogleAzerbaijanMap({ activeTypes, selectedTour, selectedLocation, onLocationSelect }: Props) {
  const apiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim();
  const mapId  = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "").trim() || undefined;
  const [routeInfo,    setRouteInfo]    = useState<{ distance: string; duration: string } | null>(null);
  const [regionCard,   setRegionCard]   = useState<{ name: string; distKm: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating,     setLocating]     = useState(false);
  useEffect(() => { if (!selectedLocation) setRouteInfo(null); }, [selectedLocation]);
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(p => { setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocating(false); }, () => setLocating(false), { enableHighAccuracy: true, timeout: 8000 });
  }, []);

  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-4 p-8 text-center"><AlertCircle size={40} className="text-amber-500" /><h3 className="font-bold text-gray-800">API açarı lazımdır</h3><code className="bg-gray-100 px-2 py-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code></div>;
  }

  return (
    <div className="relative w-full h-full">
      <APIProvider apiKey={apiKey} libraries={["places", "geometry", "marker", "routes"]}>
        <Map mapId={mapId} defaultCenter={AZ_CENTER} defaultZoom={8} styles={mapId ? undefined : MAP_STYLES} disableDefaultUI gestureHandling="greedy" className="w-full h-full">
          <MapLayer activeTypes={activeTypes} selectedTour={selectedTour} selectedLocation={selectedLocation} onLocationSelect={onLocationSelect} userLocation={userLocation} onRouteInfo={setRouteInfo} onRegionCard={setRegionCard} />
        </Map>
      </APIProvider>
      <button onClick={handleLocate} title="Mövqeyimi tap" className={cn("absolute bottom-24 right-4 z-[600] w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:bg-gray-50", locating && "animate-pulse")}>
        <Locate size={17} className={cn("text-gray-600", userLocation && "text-blue-600", locating && "text-blue-400")} />
      </button>
      {routeInfo && selectedLocation && !selectedTour && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[600] flex items-center gap-3 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-3" style={{ animation: "routeInfoSlide 0.3s ease forwards" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600 flex-shrink-0" />
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-purple-600" /><strong className="text-gray-900">{routeInfo.distance}</strong></span>
            <div className="w-px h-4 bg-gray-200" />
            <span className="flex items-center gap-1.5"><Clock size={13} className="text-blue-600" /><strong className="text-gray-900">{routeInfo.duration}</strong></span>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-gray-400 text-xs">{userLocation ? "Mövcud mövqeyinizdən" : "Bakıdan"}</span>
          </div>
        </div>
      )}
      {selectedLocation && !selectedTour && <LocationPanel key={selectedLocation.id} location={selectedLocation} routeInfo={routeInfo} userHasLocation={!!userLocation} onClose={() => { onLocationSelect(null); setRouteInfo(null); }} />}
      {regionCard && !selectedLocation && (
        <div className="absolute bottom-4 right-4 z-[600] bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-72" style={{ animation: "fadeSlideUp 0.25s ease forwards" }}>
          <div className="flex items-start justify-between mb-2">
            <div><h3 className="font-bold text-gray-900 text-base">{regionCard.name}</h3><span className="inline-block mt-1 bg-purple-50 text-purple-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">Bakıdan ~{regionCard.distKm} km</span></div>
            <button onClick={() => setRegionCard(null)} className="text-gray-400 hover:text-gray-600 text-xl ml-2 leading-none">×</button>
          </div>
          <button className="mt-3 w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">Bu ərazidəki turları gör →</button>
        </div>
      )}
    </div>
  );
}
