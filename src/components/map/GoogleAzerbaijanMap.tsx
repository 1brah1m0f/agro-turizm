"use client";

import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  X, Navigation, Clock, MapPin, ChevronLeft, ChevronRight,
  AlertCircle, Locate, ShoppingBag, Zap, Phone,
} from "lucide-react";
import { LOCATIONS, TYPE_META, type Location, type LocationType } from "./locations";
import { type Tour } from "./tours";
import { cn } from "@/lib/utils/cn";

const BAKU = { lat: 40.4093, lng: 49.8671 };
const AZ_CENTER = { lat: 40.8, lng: 47.5 };

const CAT: Partial<Record<LocationType, { color: string; icon: string }>> = {
  farm:       { color: "#6D4C41", icon: "🌾" },
  vineyard:   { color: "#7B1FA2", icon: "🍇" },
  beekeeping: { color: "#F9A825", icon: "🐝" },
  park:       { color: "#2E7D32", icon: "🌲" },
  lakeside:   { color: "#1565C0", icon: "🏕️" },
  citrus:     { color: "#E64A19", icon: "🍋" },
  animal:     { color: "#C62828", icon: "🐄" },
  cultural:   { color: "#AD1457", icon: "🏺" },
  tea:        { color: "#388E3C", icon: "🍵" },
  lavender:   { color: "#6A1B9A", icon: "💜" },
  fish:       { color: "#01579B", icon: "🐟" },
  guesthouse: { color: "#4E342E", icon: "🏡" },
};

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "all", stylers: [{ saturation: -20 }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e6f4e1" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#c8e6c9" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#bbdefb" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ saturation: -40 }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#fff8e1" }] },
];

function makePinEl(type: LocationType, isSelected: boolean): HTMLDivElement {
  const cat  = CAT[type] ?? { color: "#2E7D32", icon: "📍" };
  const size = isSelected ? 54 : 46;
  const shadow = isSelected
    ? "0 8px 24px rgba(0,0,0,0.45), 0 0 0 4px rgba(255,255,255,0.35)"
    : "0 4px 12px rgba(0,0,0,0.3)";
  const border = isSelected
    ? "3px solid #fff"
    : "2px solid rgba(255,255,255,0.75)";

  const outer = document.createElement("div");
  outer.className = cn("mk-pin", isSelected && "mk-selected");

  // Classic rotated-square pin — same style as the original Leaflet markers
  outer.innerHTML = `
    <div style="
      width:${size}px;height:${size}px;
      background:${cat.color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:${shadow};
      border:${border};
      transition:all 0.18s ease;
      cursor:pointer;
    ">
      <span style="transform:rotate(45deg);font-size:${isSelected ? 26 : 22}px;line-height:1;">
        ${cat.icon}
      </span>
    </div>`;

  return outer;
}

function PhotoCarousel({ photos, height = "h-72" }: { photos: Location["photos"]; height?: string }) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setIdx(0); setLoaded(false); }, [photos]);
  if (!photos.length) return <div className={`w-full ${height} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl`}>🌿</div>;
  const photo = photos[Math.min(idx, photos.length - 1)];
  return (
    <div className={`relative ${height} overflow-hidden bg-gray-200`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={photo.url} src={photo.url} alt={photo.caption}
        onLoad={() => setLoaded(true)} onError={() => setLoaded(true)}
        className={cn("w-full h-full object-cover transition-opacity duration-400", loaded ? "opacity-100" : "opacity-0")} />
      {!loaded && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/50 border-t-transparent rounded-full animate-spin" /></div>}
      {photos.length > 1 && (
        <>
          <button onClick={() => { setLoaded(false); setIdx(i => (i - 1 + photos.length) % photos.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all">
            <ChevronLeft size={17} />
          </button>
          <button onClick={() => { setLoaded(false); setIdx(i => (i + 1) % photos.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all">
            <ChevronRight size={17} />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => <div key={i} className={cn("rounded-full transition-all", i === idx ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/55")} />)}
          </div>
          <span className="absolute top-3 right-3 bg-black/45 text-white text-xs font-medium px-2.5 py-1 rounded-full">{idx + 1}/{photos.length}</span>
        </>
      )}
    </div>
  );
}

function DetailPanel({ location, routeInfo, userHasLocation, onClose }: {
  location: Location;
  routeInfo: { distance: string; duration: string } | null;
  userHasLocation: boolean;
  onClose: () => void;
}) {
  const cat = CAT[location.type] ?? { color: "#2E7D32", icon: "📍" };
  const galleryPhotos = location.photos.slice(1);

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-[420px] z-[700] bg-white shadow-2xl panel-slide-in overflow-y-auto" style={{ borderLeft: "1px solid #e5e7eb" }}>
      <div className="relative">
        <PhotoCarousel photos={location.photos} height="h-72" />
        <button onClick={onClose}
          className="absolute top-3 left-3 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10">
          <ChevronLeft size={18} />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold" style={{ background: cat.color + "e0", backdropFilter: "blur(4px)" }}>
          <span>{cat.icon}</span>{TYPE_META[location.type].label}
        </div>
      </div>

      <div className="p-5">
        <h1 className="font-bold text-gray-900 text-xl leading-tight mb-1">{location.name}</h1>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin size={13} className="flex-shrink-0" />
          <span>{location.village}, {location.region}</span>
        </div>

        {routeInfo && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: cat.color + "20" }}>
              <Navigation size={14} style={{ color: cat.color }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-0.5">{userHasLocation ? "Mövcud mövqeyinizdən" : "Bakıdan"}</p>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm font-semibold text-gray-800"><MapPin size={11} className="text-purple-500" />{routeInfo.distance}</span>
                <span className="text-gray-200">·</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-gray-800"><Clock size={11} className="text-blue-500" />{routeInfo.duration}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-gray-600 text-sm leading-relaxed mb-5">{location.description}</p>

        {location.activities.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2"><Zap size={14} style={{ color: cat.color }} /><h3 className="font-semibold text-gray-800 text-sm">Fəaliyyətlər</h3></div>
            <div className="flex flex-wrap gap-1.5">{location.activities.map(a => <span key={a} className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">{a}</span>)}</div>
          </div>
        )}

        {location.products.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2"><ShoppingBag size={14} style={{ color: cat.color }} /><h3 className="font-semibold text-gray-800 text-sm">Yerli Məhsullar</h3></div>
            <div className="flex flex-wrap gap-1.5">{location.products.map(p => <span key={p} className="text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ background: cat.color }}>{p}</span>)}</div>
          </div>
        )}

        {location.price && (
          <div className="flex items-center justify-between mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-100">
            <span className="text-sm font-medium text-amber-800">Qiymət</span>
            <span className="text-base font-bold text-amber-900">{location.price}</span>
          </div>
        )}

        <div className="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600"><Clock size={14} className="text-gray-400 flex-shrink-0" />{location.visitInfo}</div>
          {location.contact && (
            <a href={"tel:" + location.contact} className="flex items-center gap-2 text-sm hover:underline" style={{ color: cat.color }}>
              <Phone size={14} className="flex-shrink-0" />{location.contact}
            </a>
          )}
        </div>

        {galleryPhotos.length > 0 && (
          <div className="mb-5">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">Qalereya</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {galleryPhotos.slice(0, 6).map((p, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-sm hover:brightness-110 transition-all" style={{ background: cat.color }}>
            <Navigation size={15} />{userHasLocation ? "Yolumu göstər" : "Yol göstər"}
          </button>
          <a href={"https://www.google.com/maps/search/?api=1&query=" + location.lat + "," + location.lng}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 border-2 border-gray-200 rounded-2xl px-5 py-3.5 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
            <MapPin size={14} /> Xəritə
          </a>
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
  const map         = useMap();
  const routesLib   = useMapsLibrary("routes");
  const geometryLib = useMapsLibrary("geometry");
  const serviceRef  = useRef<google.maps.DirectionsService | null>(null);
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const clickRef    = useRef<google.maps.MapsEventListener | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mkRef       = useRef<Record<string, any>>({});
  const userMkRef   = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const distKm = useCallback((lat: number, lng: number) => {
    if (!geometryLib || !window.google) return 0;
    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(BAKU.lat, BAKU.lng), new google.maps.LatLng(lat, lng)) / 1000);
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
    const cat = CAT[selectedLocation.type] ?? { color: "#7C3AED" };
    rendererRef.current.setOptions({ polylineOptions: { strokeColor: cat.color, strokeWeight: 5, strokeOpacity: 0.82 } });
    const origin = userLocation ?? BAKU;
    serviceRef.current.route({ origin, destination: { lat: selectedLocation.lat, lng: selectedLocation.lng }, travelMode: google.maps.TravelMode.DRIVING }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        rendererRef.current!.setDirections(result);
        const leg = result.routes[0].legs[0];
        onRouteInfo({ distance: leg.distance!.text, duration: leg.duration!.text });
        const bounds = new google.maps.LatLngBounds();
        result.routes[0].overview_path.forEach(p => bounds.extend(p));
        map!.fitBounds(bounds, { top: 60, right: 440, bottom: 80, left: 60 });
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
      mkRef.current["s-" + stop.id] = mk;
    });
  }, [map, selectedTour]);

  useEffect(() => {
    if (!map || !window.google?.maps?.marker || !userLocation) return;
    userMkRef.current?.remove();
    const el = document.createElement("div");
    el.innerHTML = `<div style="position:relative;width:22px;height:22px"><div style="position:absolute;inset:-5px;border-radius:50%;background:#3B82F6;opacity:0.22;animation:bakuPulse 2s ease-in-out infinite"></div><div style="position:absolute;inset:3px;border-radius:50%;background:#3B82F6;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.5)"></div></div>`;
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
      const isSel = selectedLocation?.id === loc.id;
      const el = makePinEl(loc.type, isSel);
      const mk = new google.maps.marker.AdvancedMarkerElement({ position: { lat: loc.lat, lng: loc.lng }, map, content: el, title: loc.name, zIndex: isSel ? 999 : 1 });
      mk.addListener("click", () => { onLocationSelect(loc); onRegionCard(null); map!.panTo({ lat: loc.lat, lng: loc.lng }); });
      mkRef.current[loc.id] = mk;
      markers.push(mk);
    });

    if (markers.length > 10) {
      clustererRef.current = new MarkerClusterer({ map, markers, renderer: {
        render: ({ count, position }) => {
          const size = count < 5 ? 44 : count < 15 ? 50 : 58;
          const el = document.createElement("div");
          Object.assign(el.style, { width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: "#2E7D32", border: "3px solid white", color: "white", fontWeight: "700", fontSize: `${size < 50 ? 13 : 15}px`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.28)", cursor: "pointer" });
          el.textContent = String(count);
          return new google.maps.marker.AdvancedMarkerElement({ position, content: el });
        },
      } });
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
    navigator.geolocation.getCurrentPosition(
      p => { setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocating(false); },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  if (!apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 gap-4 p-8 text-center">
        <AlertCircle size={40} className="text-amber-500" />
        <h3 className="font-bold text-gray-800">API açarı lazımdır</h3>
        <code className="bg-gray-100 px-2 py-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <APIProvider apiKey={apiKey} libraries={["places", "geometry", "marker", "routes"]}>
        <Map mapId={mapId} defaultCenter={AZ_CENTER} defaultZoom={8}
          styles={mapId ? undefined : MAP_STYLES} disableDefaultUI gestureHandling="greedy"
          className="w-full h-full">
          <MapLayer
            activeTypes={activeTypes} selectedTour={selectedTour}
            selectedLocation={selectedLocation} onLocationSelect={onLocationSelect}
            userLocation={userLocation} onRouteInfo={setRouteInfo} onRegionCard={setRegionCard}
          />
        </Map>
      </APIProvider>

      {/* Locate me button */}
      <button onClick={handleLocate} title="Mövqeyimi tap"
        className={cn(
          "absolute z-[600] w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition-all hover:bg-gray-50",
          selectedLocation ? "bottom-6 right-[436px]" : "bottom-6 right-4",
          locating && "animate-pulse",
        )}>
        <Locate size={17} className={cn("text-gray-600", userLocation && "text-blue-600", locating && "text-blue-400")} />
      </button>

      {/* Full right-side detail panel */}
      {selectedLocation && !selectedTour && (
        <DetailPanel
          key={selectedLocation.id}
          location={selectedLocation}
          routeInfo={routeInfo}
          userHasLocation={!!userLocation}
          onClose={() => { onLocationSelect(null); setRouteInfo(null); }}
        />
      )}

      {/* Region click card */}
      {regionCard && !selectedLocation && (
        <div className="absolute bottom-6 right-4 z-[600] bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-72"
          style={{ animation: "fadeSlideUp 0.25s ease forwards" }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-base">{regionCard.name}</h3>
              <span className="inline-block mt-1 bg-purple-50 text-purple-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                Bakıdan ~{regionCard.distKm} km
              </span>
            </div>
            <button onClick={() => setRegionCard(null)} className="text-gray-400 hover:text-gray-600 text-xl ml-2 leading-none">×</button>
          </div>
          <button className="mt-3 w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
            Bu ərazidəki turları gör →
          </button>
        </div>
      )}
    </div>
  );
}
