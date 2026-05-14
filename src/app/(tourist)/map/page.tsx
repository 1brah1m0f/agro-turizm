"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search, Heart, CalendarCheck, Map, Route, Star, Users,
  SlidersHorizontal, X,
} from "lucide-react";
import { TYPE_META, LOCATIONS, type LocationType } from "@/components/map/locations";
import { TOURS, type Tour } from "@/components/map/tours";
import { type Location } from "@/components/map/locations";
import TourListPanel from "@/components/map/TourListPanel";
import TourDetailPanel from "@/components/map/TourDetailPanel";
import ChatWidget from "@/components/chat/ChatWidget";
import { cn } from "@/lib/utils/cn";

const GoogleAzerbaijanMap = dynamic(
  () => import("@/components/map/GoogleAzerbaijanMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#F7F8F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#1F6B4F]/15" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#1F6B4F] animate-spin" />
            <div className="absolute inset-3 rounded-full bg-[#1F6B4F]/8 flex items-center justify-center overflow-hidden">
              <img src="/logo.jpg" alt="AgroFlow" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[#1E1E1E] text-sm font-medium" style={{ fontFamily: "var(--font-sans)" }}>Xəritə yüklənir</p>
            <p className="text-[#6B7280] text-xs mt-0.5">Bir an...</p>
          </div>
        </div>
      </div>
    ),
  },
);

type SideTab  = "kesf" | "secilmis" | "rezervasiya" | "turlar" | "marsrutlar" | "tecrubeler" | "konullu";
type PanelState = "list" | "detail" | "closed";

const SIDE_TABS: { id: SideTab; icon: typeof Search; label: string }[] = [
  { id: "kesf",        icon: Search,       label: "Kəşf et" },
  { id: "secilmis",   icon: Heart,        label: "Seçilmişlər" },
  { id: "rezervasiya", icon: CalendarCheck, label: "Rezervasiyalar" },
  { id: "turlar",      icon: Map,          label: "Turlar" },
  { id: "marsrutlar",  icon: Route,        label: "Marşrutlar" },
  { id: "tecrubeler",  icon: Star,         label: "Təcrübələr" },
  { id: "konullu",     icon: Users,        label: "Könüllü" },
];

const MAP_TABS: { id: SideTab; icon: typeof Map; label: string }[] = [
  { id: "turlar",     icon: Map,   label: "Turlar" },
  { id: "tecrubeler", icon: Star,  label: "Təcrübələr" },
  { id: "konullu",    icon: Users, label: "Könüllü" },

];

const ALL_TYPES = Object.keys(TYPE_META) as LocationType[];

const categoryToType = (category?: string): LocationType => {
  const value = (category ?? "").toLowerCase();
  if (value.includes("balıq")) return "fish";
  if (value.includes("kamp")) return "lakeside";
  if (value.includes("at")) return "animal";
  if (value.includes("arı")) return "beekeeping";
  if (value.includes("üzüm") || value.includes("sərab") || value.includes("sarab")) return "vineyard";
  return "farm";
};

const splitAddress = (address?: string, fallback?: string) => {
  const parts = (address ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  const village = parts[0] || fallback || "Azerbaijan";
  const region = parts[1] || fallback || "Azerbaijan";
  return { village, region };
};

export default function MapPage() {
  const [activeTab,        setActiveTab]        = useState<SideTab>("turlar");
  const [panelState,       setPanelState]       = useState<PanelState>("list");
  const [selectedTour,     setSelectedTour]     = useState<Tour | null>(null);
  const [activeTypes,      setActiveTypes]      = useState<LocationType[]>([...ALL_TYPES]);
  const [filterOpen,       setFilterOpen]       = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [dbLocations,      setDbLocations]      = useState<Location[]>([]);

  useEffect(() => {
    fetch("/api/places")
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const mapped: Location[] = data
          .filter((p) => typeof p?.lat === "number" && typeof p?.lng === "number")
          .map((p) => {
            const type = categoryToType(p.category);
            const meta = TYPE_META[type];
            const { village, region } = splitAddress(p.address, p.entrepreneur?.location);
            return {
              id: `db-${p.id}`,
              name: p.name ?? "Məkan",
              type,
              region,
              village,
              lat: p.lat,
              lng: p.lng,
              description: p.description ?? "",
              activities: [],
              products: [],
              visitInfo: "Əvvəlcədən rezervasiya",
              price: p.price ? `₼${p.price}` : undefined,
              contact: undefined,
              emoji: meta.emoji,
              color: meta.color,
              photos: Array.isArray(p.photos)
                ? p.photos.map((url: string) => ({ url, caption: p.name ?? "" }))
                : [],
            } as Location;
          });
        setDbLocations(mapped);
      })
      .catch(() => setDbLocations([]));
  }, []);

  const allLocations = useMemo(() => [...LOCATIONS, ...dbLocations], [dbLocations]);

  const toggleType = (t: LocationType) =>
    setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const openTourDetail = useCallback((tour: Tour) => {
    setSelectedTour(tour);
    setPanelState("detail");
    setSelectedLocation(null);
  }, []);

  const backToList = useCallback(() => {
    setSelectedTour(null);
    setPanelState("list");
  }, []);

  const handleLocationSelect = useCallback((loc: Location | null) => {
    setSelectedLocation(loc);
    if (loc) setSelectedTour(null);
  }, []);

  const showPanel  = activeTab === "turlar";
  const activeCount = allLocations.filter(l => activeTypes.includes(l.type)).length;
  const filterCount = ALL_TYPES.length - activeTypes.length;

  return (
    <div className="h-full flex" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── SLIDING PANEL CONTAINER ── */}
      {showPanel && (
        <div
          className="w-[380px] flex-shrink-0 relative overflow-hidden h-full"
          style={{ boxShadow: "4px 0 32px rgba(0,0,0,0.05)" }}
        >
          {/* List panel */}
          <div className={cn(
            "absolute inset-0 transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform",
            panelState === "list" ? "translate-x-0" : "-translate-x-full",
          )}>
            <TourListPanel
              selectedTour={selectedTour}
              onSelect={(tour) => {
                if (tour) openTourDetail(tour);
                else setSelectedTour(null);
              }}
              onClose={() => setActiveTab("kesf")}
            />
          </div>

          {/* Detail panel */}
          <div className={cn(
            "absolute inset-0 transition-transform duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform",
            panelState === "detail" ? "translate-x-0" : "translate-x-full",
          )}>
            {selectedTour && (
              <TourDetailPanel
                tour={selectedTour}
                onBack={backToList}
                onSelect={() => {}}
              />
            )}
          </div>
        </div>
      )}

      {/* ── MAP AREA ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Top-right: quick nav + filter */}
        <div className="absolute top-4 right-4 z-[600] flex items-center gap-2.5">
          {/* Map tab pill */}
          <div
            className="flex items-center gap-1 px-2 py-1.5 rounded-[16px]"
            style={{
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.8)",
            }}
          >
            {MAP_TABS.map(({ id, icon: Icon, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all",
                    active ? "text-white" : "text-[#6B7280] hover:text-[#1F6B4F] hover:bg-[#1F6B4F]/[0.06]",
                  )}
                  style={active ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" } : {}}
                >
                  <Icon size={13} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setFilterOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-sm font-medium transition-all duration-150"
            style={
              filterOpen
                ? {
                    background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 20px rgba(31,107,79,0.30)",
                    border: "1px solid transparent",
                  }
                : {
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    color: "#1E1E1E",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(255,255,255,0.8)",
                  }
            }
          >
            <SlidersHorizontal size={15} />
            <span>Filterlər</span>
            {filterCount > 0 && (
              <span
                className="w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                style={{ background: "#D6A75F" }}
              >
                {filterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div
            className="absolute top-[60px] right-4 z-[600] w-72 rounded-[24px] p-5"
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#1E1E1E] text-sm" style={{ fontFamily: "var(--font-serif)" }}>
                  Kategoriyalar
                </h3>
                <p className="text-[#6B7280] text-[11px] mt-0.5">{activeTypes.length} aktiv</p>
              </div>
              <button
                onClick={() => setFilterOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F7F8F5] flex items-center justify-center text-[#6B7280] hover:text-[#1E1E1E] transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <button
              onClick={() => setActiveTypes(activeTypes.length === ALL_TYPES.length ? [] : [...ALL_TYPES])}
              className="w-full text-xs font-semibold py-2.5 rounded-[12px] mb-3 transition-all"
              style={
                activeTypes.length === ALL_TYPES.length
                  ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)", color: "#fff" }
                  : { background: "#F7F8F5", color: "#6B7280", border: "1px solid #E8E8E4" }
              }
            >
              {activeTypes.length === ALL_TYPES.length ? "Hamısını Gizlət" : "Hamısını Göstər"}
            </button>

            <div className="space-y-1">
              {ALL_TYPES.map(t => {
                const meta = TYPE_META[t];
                const active = activeTypes.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-left transition-all text-xs font-medium"
                    style={
                      active
                        ? { background: meta.color + "10", border: `1px solid ${meta.color}25` }
                        : { background: "transparent", border: "1px solid transparent", color: "#9CA3AF" }
                    }
                  >
                    <span className="text-base leading-none">{meta.emoji}</span>
                    <span className="flex-1" style={{ color: active ? "#1E1E1E" : "#9CA3AF" }}>{meta.label}</span>
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 transition-all"
                      style={
                        active
                          ? { background: meta.color, boxShadow: `0 2px 6px ${meta.color}40` }
                          : { border: "2px solid #D1D5DB" }
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Location count badge */}
        <div
          className="absolute bottom-6 right-4 z-[500] flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.9)",
            color: "#6B7280",
          }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#1F6B4F" }} />
          <span className="font-bold text-[#1E1E1E]">{activeCount}</span>
          <span>məkan</span>
        </div>

        {/* Google Maps */}
        <GoogleAzerbaijanMap
          locations={allLocations}
          activeTypes={activeTypes}
          selectedTour={selectedTour}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      <ChatWidget />
    </div>
  );
}
