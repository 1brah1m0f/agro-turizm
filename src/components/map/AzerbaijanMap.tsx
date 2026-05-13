"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  MapPin, X, Clock, Phone, ShoppingBag, Zap, ChevronRight,
  ChevronLeft, ChevronRight as ChevRight, ImageOff,
  Star, Calendar, Users, Navigation2,
} from "lucide-react";
import { LOCATIONS, TYPE_META, type Location, type LocationType } from "./locations";
import { type Tour } from "./tours";
import { cn } from "@/lib/utils/cn";

const TILE_URL    = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';
const BAKU: L.LatLngExpression = [40.409, 49.867];

// ── Baku-to-destination route waypoints ───────────────────────────
function getBakuRoute(destLat: number, destLng: number): L.LatLngExpression[] {
  const start: L.LatLngExpression = BAKU;
  if (destLat < 39.8) {
    // South – Lankaran/Neftcala
    return [start, [40.2, 49.55], [39.97, 49.1], [39.7, 49.0], [39.5, 48.9], [destLat, destLng]];
  } else if (destLng < 46.5) {
    // Far west – Gazakh, Goygol
    return [start, [40.44, 49.35], [40.56, 48.4], [40.65, 47.5], [40.7, 46.8], [destLat, destLng]];
  } else if (destLat > 41.3) {
    // Far north – Quba, Khachmaz
    return [start, [40.6, 49.65], [41.0, 49.1], [41.3, 49.0], [destLat, destLng]];
  } else if (destLng < 47.4) {
    // Northwest – Sheki, Zaqatala, Balakan
    return [start, [40.44, 49.35], [40.56, 48.4], [40.68, 47.8], [40.85, 47.3], [destLat, destLng]];
  } else if (destLng < 48.2) {
    // West-central – Gabala, Oguz
    return [start, [40.44, 49.35], [40.56, 48.4], [40.65, 48.0], [destLat, destLng]];
  } else {
    // Central – Shamakhi, Ismayilli, etc.
    return [start, [40.44, 49.35], [40.52, 49.0], [40.55, 48.55], [destLat, destLng]];
  }
}

// ── Photo gallery ─────────────────────────────────────────────────
function PhotoGallery({ photos }: { photos: Location["photos"] }) {
  const [idx, setIdx]     = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const prev = () => { setLoaded(false); setErrored(false); setIdx((i) => (i - 1 + photos.length) % photos.length); };
  const next = useCallback(() => { setLoaded(false); setErrored(false); setIdx((i) => (i + 1) % photos.length); }, [photos.length]);
  useEffect(() => { setIdx(0); setLoaded(false); setErrored(false); }, [photos]);
  useEffect(() => { const t = setTimeout(next, 5000); return () => clearTimeout(t); }, [idx, next]);
  if (!photos.length) return null;
  const photo = photos[Math.min(idx, photos.length - 1)];
  if (!photo) return null;
  return (
    <div className="mb-4">
      <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
        {!errored ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={photo.url} src={photo.url} alt={photo.caption}
              onLoad={() => setLoaded(true)} onError={() => setErrored(true)}
              className={cn("absolute inset-0 w-full h-full object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")} />
            {!loaded && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageOff size={28} /><span className="text-xs">Şəkil yüklənmədi</span>
          </div>
        )}
        {photos.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"><ChevronLeft size={16} /></button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"><ChevRight size={16} /></button>
          </>
        )}
        <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full z-10">{idx + 1} / {photos.length}</span>
      </div>
      <p className="text-gray-500 text-xs mt-1.5 px-0.5 line-clamp-1">{photo.caption}</p>
      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {photos.map((_, i) => (
            <button key={i} onClick={() => { setLoaded(false); setErrored(false); setIdx(i); }}
              className={cn("rounded-full transition-all", i === idx ? "w-4 h-1.5 bg-green-600" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400")} />
          ))}
        </div>
      )}
      {photos.length > 2 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button key={i} onClick={() => { setLoaded(false); setErrored(false); setIdx(i); }}
              className={cn("flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all", i === idx ? "border-green-600 scale-105" : "border-transparent opacity-60 hover:opacity-90")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Marker icons ──────────────────────────────────────────────────
function createMarkerHtml(emoji: string, color: string, selected: boolean) {
  const size = selected ? 54 : 46;
  const shadow = selected ? "0 8px 24px rgba(0,0,0,0.45), 0 0 0 4px rgba(255,255,255,0.35)" : "0 4px 12px rgba(0,0,0,0.3)";
  const border = selected ? "3px solid #fff" : "2px solid rgba(255,255,255,0.75)";
  return `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:${shadow};border:${border};transition:all 0.18s ease;cursor:pointer;"><span style="transform:rotate(45deg);font-size:${selected ? 26 : 22}px;line-height:1;">${emoji}</span></div>`;
}
function makeIcon(loc: { emoji: string; color: string }, selected: boolean) {
  return L.divIcon({ html: createMarkerHtml(loc.emoji, loc.color, selected), className: "", iconSize: selected ? [54, 54] : [46, 46], iconAnchor: selected ? [27, 54] : [23, 46] });
}

// ── Main component ─────────────────────────────────────────────────
interface Props {
  activeTypes: LocationType[];
  selectedTour?: Tour | null;
}

export default function AzerbaijanMap({ activeTypes, selectedTour }: Props) {
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstance    = useRef<L.Map | null>(null);
  const markersRef     = useRef<Map<string, L.Marker>>(new Map());
  const tourLayersRef  = useRef<L.Layer[]>([]);
  const bakuLayersRef  = useRef<L.Layer[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);

  // ── Init map ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, { center: [40.4, 47.5], zoom: 7, zoomControl: false, attributionControl: true });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, subdomains: "abc", maxZoom: 19 }).addTo(map);
    LOCATIONS.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], { icon: makeIcon(loc, false) })
        .addTo(map)
        .on("click", () => {
          setSelected(loc);
          map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 11), { duration: 0.75 });
          markersRef.current.forEach((m, id) => { const l = LOCATIONS.find((x) => x.id === id); if (l) m.setIcon(makeIcon(l, id === loc.id)); });
        })
        .on("mouseover", () => setHovered(loc.id))
        .on("mouseout", () => setHovered(null));
      markersRef.current.set(loc.id, marker);
    });
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; markersRef.current.clear(); };
  }, []);

  // ── Category filter ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapInstance.current) return;
    markersRef.current.forEach((marker, id) => {
      const loc = LOCATIONS.find((l) => l.id === id);
      if (!loc) return;
      if (activeTypes.includes(loc.type)) {
        if (!mapInstance.current!.hasLayer(marker)) marker.addTo(mapInstance.current!);
      } else {
        if (mapInstance.current!.hasLayer(marker)) marker.remove();
        if (selected?.id === id) setSelected(null);
      }
    });
  }, [activeTypes, selected]);

  // ── Tour route with photo stop cards ─────────────────────────────
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Clear previous tour layers
    tourLayersRef.current.forEach((l) => l.remove());
    tourLayersRef.current = [];

    if (!selectedTour) return;
    setSelected(null);

    const stops = selectedTour.stopIds.map((id) => LOCATIONS.find((l) => l.id === id)).filter(Boolean) as typeof LOCATIONS;
    if (stops.length < 1) return;
    const coords: L.LatLngExpression[] = stops.map((s) => [s.lat, s.lng]);

    // Dashed route line
    const routeLine = L.polyline(coords, {
      color: selectedTour.routeColor,
      weight: 3.5,
      opacity: 0.9,
      dashArray: "10 6",
    }).addTo(map);
    tourLayersRef.current.push(routeLine);

    // Animate route draw
    setTimeout(() => {
      const el = routeLine.getElement() as SVGPathElement | null;
      if (el) {
        const firstPath = el.tagName === "path" ? el : el.querySelector("path");
        if (firstPath) {
          const len = firstPath.getTotalLength ? firstPath.getTotalLength() : 0;
          if (len > 0) {
            firstPath.style.strokeDasharray = `${len}`;
            firstPath.style.strokeDashoffset = `${len}`;
            firstPath.style.animation = "drawRoute 1.8s ease forwards";
          }
        }
      }
    }, 100);

    // Photo cards for each stop
    stops.forEach((stop, i) => {
      const photoUrl = stop.photos[0]?.url ?? "";
      const isRight  = i % 2 === 0;

      // Dot marker at exact location
      const dotIcon = L.divIcon({
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${selectedTour.routeColor};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
        className: "",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const dot = L.marker([stop.lat, stop.lng], { icon: dotIcon }).addTo(map);
      tourLayersRef.current.push(dot);

      // Floating card as popup
      const cardHtml = `
        <div style="display:flex;align-items:stretch;width:230px;cursor:default;">
          <div style="flex:1;padding:10px 10px 10px 12px;min-width:0;">
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px;">
              <div style="width:22px;height:22px;border-radius:50%;background:${selectedTour.routeColor};color:white;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i + 1}</div>
              <strong style="font-size:13px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${stop.name}</strong>
            </div>
            <p style="font-size:11px;color:#666;margin:0;line-height:1.45;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">${stop.description.substring(0, 90)}${stop.description.length > 90 ? "…" : ""}</p>
          </div>
          ${photoUrl ? `<img src="${photoUrl}" alt="" style="width:78px;flex-shrink:0;object-fit:cover;border-left:1px solid #f0f0f0;" onerror="this.style.display='none'" />` : ""}
        </div>`;

      const popup = L.popup({
        closeButton: false,
        className: "tour-card-popup",
        offset: isRight ? [130, 0] : [-130, 0],
        autoPan: false,
        maxWidth: 240,
      }).setContent(cardHtml);

      dot.bindPopup(popup).openPopup();
    });

    // Fit map to route
    if (stops.length > 1) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [80, 280] });
    }
  }, [selectedTour]);

  // ── Baku → location route ─────────────────────────────────────────
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    // Clear previous baku route
    bakuLayersRef.current.forEach((l) => l.remove());
    bakuLayersRef.current = [];

    if (!selected || selectedTour) return;

    const waypoints = getBakuRoute(selected.lat, selected.lng);

    // Purple route line
    const routeLine = L.polyline(waypoints, {
      color: "#7C3AED",
      weight: 4.5,
      opacity: 0.85,
    }).addTo(map);
    bakuLayersRef.current.push(routeLine);

    // Animate draw
    setTimeout(() => {
      const el = routeLine.getElement() as SVGPathElement | null;
      if (el) {
        const firstPath = el.tagName === "path" ? el : el.querySelector("path");
        if (firstPath) {
          const len = firstPath.getTotalLength ? firstPath.getTotalLength() : 800;
          firstPath.style.strokeDasharray = `${len}`;
          firstPath.style.strokeDashoffset = `${len}`;
          firstPath.style.animation = "drawRoute 1.6s cubic-bezier(0.4,0,0.2,1) forwards";
        }
      }
    }, 80);

    // Baku marker with pulse
    const bakuIcon = L.divIcon({
      html: `
        <div style="position:relative;width:24px;height:24px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:#F97316;opacity:0.35;animation:bakuPulse 1.8s ease-in-out infinite;"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;background:#F97316;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
          <div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:#F97316;color:white;padding:2px 7px;border-radius:5px;font-size:10px;font-weight:700;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.2);">Bakı</div>
        </div>`,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    const bakuMarker = L.marker(BAKU, { icon: bakuIcon }).addTo(map);
    bakuLayersRef.current.push(bakuMarker);

    // Distance estimate badge popup at midpoint
    const mid = waypoints[Math.floor(waypoints.length / 2)] as [number, number];
    const destCoord = waypoints[waypoints.length - 1] as [number, number];
    const distKm = Math.round(
      L.latLng(BAKU as [number, number]).distanceTo(L.latLng(destCoord)) / 1000
    );
    const distPopup = L.popup({
      closeButton: false,
      className: "baku-popup",
      autoPan: false,
    })
      .setLatLng(mid)
      .setContent(`<div style="background:#7C3AED;color:white;padding:5px 12px;border-radius:8px;font-size:12px;font-weight:600;white-space:nowrap;">Bakıdan ~${distKm} km</div>`)
      .addTo(map);
    bakuLayersRef.current.push(distPopup);

    // Fit to route
    const bounds = L.latLngBounds(waypoints);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [selected, selectedTour]);

  const closePanel = () => {
    setSelected(null);
    markersRef.current.forEach((m, id) => { const l = LOCATIONS.find((x) => x.id === id); if (l) m.setIcon(makeIcon(l, false)); });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Hover tooltip */}
      {hovered && !selected && !selectedTour && (() => {
        const loc = LOCATIONS.find((l) => l.id === hovered);
        if (!loc) return null;
        return (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[500] pointer-events-none">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-lg flex items-center gap-2">
              <span className="text-xl">{loc.emoji}</span>
              <div>
                <p className="text-gray-800 text-sm font-semibold">{loc.name}</p>
                <p className="text-gray-500 text-xs">{loc.region} · {TYPE_META[loc.type].label}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── TOUR BOTTOM PANEL ── */}
      {selectedTour && (() => {
        const stops = selectedTour.stopIds.map((id) => LOCATIONS.find((l) => l.id === id)).filter(Boolean) as typeof LOCATIONS;
        const routeLabel = stops.map((s) => s.region).join(" · ");
        return (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[600] w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: selectedTour.routeColor }}>
                    {selectedTour.agencyInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-sm">{selectedTour.agencyName}</span>
                      <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-full">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-amber-700 text-[10px] font-bold">{selectedTour.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{routeLabel}</p>
                  </div>
                </div>
                <button onClick={() => { /* handled outside */ }} className="text-gray-300 hover:text-gray-500 flex-shrink-0">
                  <ChevRight size={16} className="rotate-90" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1"><Calendar size={12} /><span>{selectedTour.dateRange}</span></div>
                <span className="text-gray-300">·</span>
                <span>{selectedTour.duration}</span>
                <span className="text-gray-300">·</span>
                <div className="flex items-center gap-1"><Users size={12} /><span>Maks. {selectedTour.minPeople} nəfər</span></div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900 text-lg">{selectedTour.price} AZN</span>
                  <span className="text-gray-400 text-xs"> / nəfər</span>
                </div>
                <button className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-110 transition-all"
                  style={{ background: selectedTour.routeColor }}>
                  Bu turu seç
                </button>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
              <button className="text-xs text-gray-500 hover:text-green-700 font-medium flex items-center gap-1">
                <MapPin size={12} /> Bu ərazidəki məkanları göstər
                <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold flex items-center justify-center ml-1">{stops.length}</span>
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── LOCATION SIDE PANEL ── */}
      {selected && !selectedTour && (
        <div className="absolute top-0 right-0 h-full w-full md:w-[400px] z-[500] overflow-y-auto bg-white shadow-2xl border-l border-gray-200">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: selected.color + "18", border: `2px solid ${selected.color}35` }}>
                  {selected.emoji}
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl text-gray-900 leading-tight">{selected.name}</h2>
                  <div className="flex items-center gap-1 mt-0.5"><MapPin size={12} className="text-gray-400" /><span className="text-gray-500 text-xs">{selected.village}, {selected.region}</span></div>
                  <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                    style={{ background: selected.color + "18", color: selected.color }}>{TYPE_META[selected.type].label}</span>
                </div>
              </div>
              <button onClick={closePanel} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors flex-shrink-0"><X size={16} /></button>
            </div>

            {/* Route from Baku badge */}
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2.5 mb-4">
              <Navigation2 size={14} className="text-purple-600 flex-shrink-0" />
              <span className="text-purple-700 text-xs font-medium">Bakıdan marşrut xəritədə göstərilir</span>
            </div>

            <PhotoGallery photos={selected.photos} />
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{selected.description}</p>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2"><Zap size={14} className="text-green-600" /><h3 className="font-semibold text-gray-800 text-sm">Fəaliyyətlər</h3></div>
              <div className="flex flex-wrap gap-1.5">{selected.activities.map((a) => (<span key={a} className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">{a}</span>))}</div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2"><ShoppingBag size={14} className="text-green-600" /><h3 className="font-semibold text-gray-800 text-sm">Yerli Məhsullar</h3></div>
              <div className="flex flex-wrap gap-1.5">{selected.products.map((p) => (<span key={p} className="text-xs px-2.5 py-1.5 rounded-lg text-white font-medium" style={{ background: selected.color }}>{p}</span>))}</div>
            </div>

            {selected.price && (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-3">
                <span className="text-amber-800 text-sm font-semibold">Qiymət</span>
                <span className="text-amber-700 text-base font-bold">{selected.price}</span>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
              <div className="flex items-start gap-2 mb-2">
                <Clock size={14} className="text-green-600 mt-0.5" />
                <div><p className="text-gray-800 text-xs font-semibold">Ziyarət Saatları</p><p className="text-gray-500 text-xs">{selected.visitInfo}</p></div>
              </div>
              {selected.contact && (
                <div className="flex items-center gap-2"><Phone size={14} className="text-green-600" /><a href={`tel:${selected.contact}`} className="text-green-700 text-xs font-medium hover:underline">{selected.contact}</a></div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors">Bron Et <ChevRight size={15} /></button>
              <a href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                <MapPin size={14} /> Xəritə
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
