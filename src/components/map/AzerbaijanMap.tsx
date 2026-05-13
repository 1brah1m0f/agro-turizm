"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  MapPin, X, Clock, Phone, ShoppingBag, Zap, ChevronRight,
  ChevronLeft, ChevronRight as ChevRight, ImageOff,
} from "lucide-react";
import { LOCATIONS, TYPE_META, type Location, type LocationType } from "./locations";
import { cn } from "@/lib/utils/cn";

const TILE_URL    = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';

// ── Marker icon factory ────────────────────────────────────────────
function createMarkerHtml(emoji: string, color: string, selected: boolean) {
  const size   = selected ? 54 : 46;
  const shadow = selected
    ? "0 8px 24px rgba(0,0,0,0.45), 0 0 0 4px rgba(255,255,255,0.35)"
    : "0 4px 12px rgba(0,0,0,0.3)";
  const border = selected ? "3px solid #fff" : "2px solid rgba(255,255,255,0.75)";
  return `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:${shadow};border:${border};
      transition:all 0.18s ease;cursor:pointer;">
    <span style="transform:rotate(45deg);font-size:${selected ? 26 : 22}px;line-height:1;">${emoji}</span>
  </div>`;
}

function makeIcon(loc: { emoji: string; color: string }, selected: boolean) {
  return L.divIcon({
    html: createMarkerHtml(loc.emoji, loc.color, selected),
    className: "",
    iconSize:   selected ? [54, 54] : [46, 46],
    iconAnchor: selected ? [27, 54] : [23, 46],
  });
}

// ── Photo Gallery ──────────────────────────────────────────────────
function PhotoGallery({ photos }: { photos: Location["photos"] }) {
  const [idx, setIdx]     = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const prev = () => { setLoaded(false); setErrored(false); setIdx((i) => (i - 1 + photos.length) % photos.length); };
  const next = useCallback(() => { setLoaded(false); setErrored(false); setIdx((i) => (i + 1) % photos.length); }, [photos.length]);

  // auto-advance every 5 s when not hovered
  useEffect(() => {
    const t = setTimeout(next, 5000);
    return () => clearTimeout(t);
  }, [idx, next]);

  if (!photos.length) return null;
  const photo = photos[idx];

  return (
    <div className="mb-4">
      {/* Main image */}
      <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
        {!errored ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={photo.url}
              src={photo.url}
              alt={photo.caption}
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                loaded ? "opacity-100" : "opacity-0"
              )}
            />
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageOff size={28} />
            <span className="text-xs">Şəkil yüklənmədi</span>
          </div>
        )}

        {/* Prev/Next */}
        {photos.length > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10">
              <ChevronLeft size={16} />
            </button>
            <button onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10">
              <ChevRight size={16} />
            </button>
          </>
        )}

        {/* Counter */}
        <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
          {idx + 1} / {photos.length}
        </span>
      </div>

      {/* Caption */}
      <p className="text-gray-500 text-xs mt-1.5 px-0.5 line-clamp-1">{photo.caption}</p>

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {photos.map((_, i) => (
            <button key={i} onClick={() => { setLoaded(false); setErrored(false); setIdx(i); }}
              className={cn(
                "rounded-full transition-all",
                i === idx ? "w-4 h-1.5 bg-green-600" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
              )} />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {photos.length > 2 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button key={i} onClick={() => { setLoaded(false); setErrored(false); setIdx(i); }}
              className={cn(
                "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
                i === idx ? "border-green-600 scale-105" : "border-transparent opacity-60 hover:opacity-90"
              )}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
interface Props { activeTypes: LocationType[] }

export default function AzerbaijanMap({ activeTypes }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef  = useRef<Map<string, L.Marker>>(new Map());
  const [selected, setSelected] = useState<Location | null>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);

  // ── Init ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [40.4, 47.5],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, subdomains: "abc", maxZoom: 19 }).addTo(map);

    LOCATIONS.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], { icon: makeIcon(loc, false) })
        .addTo(map)
        .on("click", () => {
          setSelected(loc);
          map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 11), { duration: 0.75 });
          markersRef.current.forEach((m, id) => {
            const l = LOCATIONS.find((x) => x.id === id);
            if (l) m.setIcon(makeIcon(l, id === loc.id));
          });
        })
        .on("mouseover", () => setHovered(loc.id))
        .on("mouseout",  () => setHovered(null));
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

  const closePanel = () => {
    setSelected(null);
    markersRef.current.forEach((m, id) => {
      const l = LOCATIONS.find((x) => x.id === id);
      if (l) m.setIcon(makeIcon(l, false));
    });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {/* Hover tooltip */}
      {hovered && !selected && (() => {
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

      {/* Side panel */}
      {selected && (
        <div className="absolute top-0 right-0 h-full w-full md:w-[400px] z-[500] overflow-y-auto bg-white shadow-2xl border-l border-gray-200">
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: selected.color + "18", border: `2px solid ${selected.color}35` }}>
                  {selected.emoji}
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl text-gray-900 leading-tight">{selected.name}</h2>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="text-gray-500 text-xs">{selected.village}, {selected.region}</span>
                  </div>
                  <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                    style={{ background: selected.color + "18", color: selected.color }}>
                    {TYPE_META[selected.type].label}
                  </span>
                </div>
              </div>
              <button onClick={closePanel}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors flex-shrink-0">
                <X size={16} />
              </button>
            </div>

            {/* Photo gallery */}
            <PhotoGallery photos={selected.photos} />

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{selected.description}</p>

            {/* Activities */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-green-600" />
                <h3 className="font-semibold text-gray-800 text-sm">Fəaliyyətlər</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.activities.map((a) => (
                  <span key={a} className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">{a}</span>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag size={14} className="text-green-600" />
                <h3 className="font-semibold text-gray-800 text-sm">Yerli Məhsullar</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.products.map((p) => (
                  <span key={p} className="text-xs px-2.5 py-1.5 rounded-lg text-white font-medium"
                    style={{ background: selected.color }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Visit info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
              <div className="flex items-start gap-2 mb-2">
                <Clock size={14} className="text-green-600 mt-0.5" />
                <div>
                  <p className="text-gray-800 text-xs font-semibold">Ziyarət Saatları</p>
                  <p className="text-gray-500 text-xs">{selected.visitInfo}</p>
                </div>
              </div>
              {selected.contact && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-green-600" />
                  <a href={`tel:${selected.contact}`} className="text-green-700 text-xs font-medium hover:underline">
                    {selected.contact}
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 text-sm font-semibold transition-colors">
                Bron Et <ChevRight size={15} />
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selected.lat},${selected.lng}`}
                target="_blank" rel="noopener noreferrer"
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
