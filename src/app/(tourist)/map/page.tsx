"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Heart, CalendarCheck, Map, Route, Star, Users,
  Home, Compass, Gift, User, SlidersHorizontal, X,
  Leaf,
} from "lucide-react";
import { TYPE_META, LOCATIONS, type LocationType } from "@/components/map/locations";
import { TOURS, type Tour } from "@/components/map/tours";
import TourListPanel from "@/components/map/TourListPanel";
import { cn } from "@/lib/utils/cn";

const AzerbaijanMap = dynamic(() => import("@/components/map/AzerbaijanMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Xəritə yüklənir...</p>
      </div>
    </div>
  ),
});

// ── Sidebar tabs ────────────────────────────────────────────────────
type SideTab = "kesf" | "secilmis" | "rezervasiya" | "turlar" | "marsrutlar" | "tecrubeler" | "konullu";

const SIDE_TABS: { id: SideTab; icon: typeof Search; label: string }[] = [
  { id: "kesf",        icon: Search,       label: "Kəşf et" },
  { id: "secilmis",    icon: Heart,        label: "Seçilmişlər" },
  { id: "rezervasiya", icon: CalendarCheck, label: "Rezervasiyalar" },
  { id: "turlar",      icon: Map,          label: "Turlar" },
  { id: "marsrutlar",  icon: Route,        label: "Marşrutlar" },
  { id: "tecrubeler",  icon: Star,         label: "Təcrübələr" },
  { id: "konullu",     icon: Users,        label: "Könüllü proqramları" },
];

// ── Top-right quick nav ─────────────────────────────────────────────
const QUICK_NAV = [
  { href: "/home",    icon: Home,        label: "Ana" },
  { href: "/explore", icon: Compass,     label: "Kəşf" },
  { href: "/rewards", icon: Gift,        label: "Mükafat" },
  { href: "/profile", icon: User,        label: "Profil" },
];

const ALL_TYPES = Object.keys(TYPE_META) as LocationType[];

export default function MapPage() {
  const router   = useRouter();
  const [activeTab,    setActiveTab]    = useState<SideTab>("turlar");
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [activeTypes,  setActiveTypes]  = useState<LocationType[]>([...ALL_TYPES]);
  const [filterOpen,   setFilterOpen]   = useState(false);

  const toggleType = (t: LocationType) =>
    setActiveTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const activeCount = LOCATIONS.filter((l) => activeTypes.includes(l.type)).length;

  return (
    <div className="fixed inset-0 z-50 flex bg-white">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-[230px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">FarMorfX</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {SIDE_TABS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all text-left",
                activeTab === id
                  ? "bg-green-50 text-green-700 border-l-[3px] border-green-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 border-l-[3px] border-transparent"
              )}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MIDDLE PANEL (only when Turlar active) ── */}
      {activeTab === "turlar" && (
        <TourListPanel selectedTour={selectedTour} onSelect={setSelectedTour} />
      )}

      {/* ── MAP AREA ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* Top-right: quick nav + filter button */}
        <div className="absolute top-4 right-4 z-[600] flex items-center gap-2">
          {/* Quick nav icons */}
          <div className="flex items-center gap-1 bg-white rounded-xl shadow-md border border-gray-100 px-2 py-1.5">
            {QUICK_NAV.map(({ href, icon: Icon, label }) => (
              <button key={href} onClick={() => router.push(href)}
                title={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors">
                <Icon size={16} />
              </button>
            ))}
          </div>

          {/* Category filter button */}
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl shadow-md border text-sm font-medium transition-all",
              filterOpen
                ? "bg-green-600 text-white border-green-600"
                : "bg-white border-gray-100 text-gray-600 hover:text-green-700"
            )}>
            <SlidersHorizontal size={15} />
            <span>Filterlər</span>
            {activeTypes.length < ALL_TYPES.length && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeTypes.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel — slides in from right */}
        {filterOpen && (
          <div className="absolute top-16 right-4 z-[600] w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Kategoriyalar</h3>
              <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>

            <button
              onClick={() => setActiveTypes(activeTypes.length === ALL_TYPES.length ? [] : [...ALL_TYPES])}
              className={cn(
                "w-full text-xs font-semibold py-2 rounded-lg mb-2 border transition-all",
                activeTypes.length === ALL_TYPES.length
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              )}>
              {activeTypes.length === ALL_TYPES.length ? "Hamısını Gizlət" : "Hamısını Göstər"}
            </button>

            <div className="space-y-1">
              {ALL_TYPES.map((t) => {
                const meta = TYPE_META[t];
                const active = activeTypes.includes(t);
                return (
                  <button key={t} onClick={() => toggleType(t)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all border text-xs font-medium",
                      active ? "border-gray-100 text-gray-700" : "border-transparent text-gray-400 hover:text-gray-600"
                    )}
                    style={active ? { background: meta.color + "12", borderColor: meta.color + "35" } : {}}>
                    <span className="text-base">{meta.emoji}</span>
                    <span className="flex-1">{meta.label}</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0"
                      style={active ? { background: meta.color, borderColor: meta.color } : { borderColor: "#d1d5db" }} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Location count badge */}
        <div className="absolute bottom-6 right-4 z-[500] px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow border border-gray-100 text-gray-500">
          {activeCount} məkan
        </div>

        {/* Tour info badge when active */}
        {selectedTour && (
          <div className="absolute bottom-6 left-4 z-[500] flex items-center gap-2 bg-white shadow-lg border border-gray-100 rounded-2xl px-4 py-2.5">
            <div className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
              style={{ background: selectedTour.routeColor }}>
              ✓
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">{selectedTour.agencyName}</p>
              <p className="text-[10px] text-gray-400">{selectedTour.stopIds.length} dayanacaq · {selectedTour.price} AZN</p>
            </div>
            <button onClick={() => setSelectedTour(null)} className="ml-1 text-gray-300 hover:text-gray-500">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Leaflet map */}
        <AzerbaijanMap activeTypes={activeTypes} selectedTour={selectedTour} />
      </div>
    </div>
  );
}
