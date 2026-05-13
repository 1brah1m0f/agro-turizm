"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MapPin, SlidersHorizontal, X } from "lucide-react";
import { TYPE_META, LOCATIONS, type LocationType } from "@/components/map/locations";
import { cn } from "@/lib/utils/cn";

const AzerbaijanMap = dynamic(() => import("@/components/map/AzerbaijanMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Xəritə yüklənir...</p>
      </div>
    </div>
  ),
});

const ALL_TYPES = Object.keys(TYPE_META) as LocationType[];

export default function MapPage() {
  const [activeTypes, setActiveTypes] = useState<LocationType[]>([...ALL_TYPES]);
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleType = (t: LocationType) =>
    setActiveTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const allActive = activeTypes.length === ALL_TYPES.length;
  const activeCount = LOCATIONS.filter((l) => activeTypes.includes(l.type)).length;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">

      {/* Top control bar */}
      <div className="absolute top-4 left-4 right-4 z-[600] flex items-center gap-2">
        {/* Logo chip */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border shadow-lg bg-white border-gray-200">
          <MapPin size={16} className="text-green-600" />
          <span className="font-serif font-bold text-sm text-gray-800">AzərXəritə</span>
        </div>

        <div className="flex-1" />

        {/* Filter toggle */}
        <button
          onClick={() => setFilterOpen((o) => !o)}
          className={cn(
            "flex items-center gap-2 px-3 py-2.5 rounded-xl border shadow-lg text-sm font-medium transition-all",
            filterOpen
              ? "bg-green-600 text-white border-green-600"
              : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
          )}>
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filterlər</span>
          {!allActive && (
            <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
              {activeTypes.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div className="absolute top-20 left-4 z-[600] rounded-2xl border border-gray-200 shadow-xl bg-white p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">Kateqoriya Filteri</h3>
            <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>

          <button
            onClick={() => setActiveTypes(allActive ? [] : [...ALL_TYPES])}
            className={cn(
              "w-full text-xs font-semibold py-2 rounded-lg mb-3 border transition-all",
              allActive ? "bg-green-600 text-white border-green-600" : "border-gray-300 text-gray-500 hover:border-gray-400"
            )}>
            {allActive ? "Hamısını Gizlət" : "Hamısını Göstər"}
          </button>

          <div className="space-y-1">
            {ALL_TYPES.map((t) => {
              const meta = TYPE_META[t];
              const active = activeTypes.includes(t);
              return (
                <button key={t} onClick={() => toggleType(t)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border",
                    active ? "border-gray-200" : "border-transparent text-gray-400 hover:text-gray-700"
                  )}
                  style={active ? { background: meta.color + "15", borderColor: meta.color + "40" } : {}}>
                  <span className="text-base">{meta.emoji}</span>
                  <span className="text-xs font-medium flex-1 text-gray-700">{meta.label}</span>
                  <div
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={active ? { background: meta.color, borderColor: meta.color } : { borderColor: "#d1d5db" }}>
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend (bottom-left, desktop) */}
      <div className="absolute bottom-6 left-4 z-[500] rounded-xl border border-gray-200 bg-white/95 p-3 shadow-lg hidden md:block">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-semibold">Əfsanə</p>
        <div className="space-y-1.5">
          {ALL_TYPES.filter((t) => activeTypes.includes(t)).map((t) => {
            const meta = TYPE_META[t];
            return (
              <div key={t} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: meta.color + "25" }}>
                  {meta.emoji}
                </div>
                <span className="text-xs text-gray-600">{meta.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category pills (mobile) */}
      <div className="absolute top-20 left-0 right-0 z-[500] px-4 md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ALL_TYPES.map((t) => {
            const meta = TYPE_META[t];
            const active = activeTypes.includes(t);
            return (
              <button key={t} onClick={() => toggleType(t)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border shadow transition-all",
                  active ? "text-white border-transparent" : "bg-white border-gray-200 text-gray-500"
                )}
                style={active ? { background: meta.color } : {}}>
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-full">
        <AzerbaijanMap activeTypes={activeTypes} />
      </div>

      {/* Count badge */}
      <div className="absolute bottom-6 right-4 z-[500] px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 bg-white shadow text-gray-500">
        {activeCount} məkan
      </div>
    </div>
  );
}
