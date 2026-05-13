"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, Star, X, Plus, Minus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const filterPills1 = ["Yaxınımda", "Ən Ucuz", "Ən Yüksək Reytinq"];
const filterPills2 = ["Macəra", "Ailə Üçün", "Kamp", "Balıqçılıq"];

const mockPins = [
  { id: "1", label: "Üzümçülük Dərsləri", category: "Fermalar", emoji: "🍇", x: "25%", y: "40%", price: 45, rating: 4.9 },
  { id: "2", label: "Meyvə Bağı", category: "Meyvə", emoji: "🍎", x: "55%", y: "30%", price: 30, rating: 4.7 },
  { id: "3", label: "Dağ Ferması", category: "Fermalar", emoji: "⛰️", x: "70%", y: "55%", price: 55, rating: 4.8 },
  { id: "4", label: "Kamp Sahəsi", category: "Kamp", emoji: "⛺", x: "40%", y: "65%", price: 25, rating: 4.6 },
];

export default function MapPage() {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const selectedPlace = mockPins.find(p => p.id === selectedPin);

  const toggleFilter = (f: string) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  return (
    <div className="relative h-screen overflow-hidden bg-primary">
      {/* Mock map bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light opacity-90">
        {/* Grid lines to simulate map */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(85,200,65,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(85,200,65,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        {/* "Roads" */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-accent/10" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-accent/10" />
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-accent/10" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-accent/10" />
      </div>

      {/* Map pins */}
      {mockPins.map(pin => (
        <button
          key={pin.id}
          onClick={() => setSelectedPin(selectedPin === pin.id ? null : pin.id)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: pin.x, top: pin.y }}
        >
          <div className={cn(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg transition-all shadow-card",
            selectedPin === pin.id
              ? "bg-accent border-accent scale-125"
              : "bg-card border-accent/40 hover:scale-110"
          )}>
            {pin.emoji}
          </div>
        </button>
      ))}

      {/* User location dot */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-card">
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-40" />
        </div>
      </div>

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-card-hover border border-accent/10">
          <button onClick={() => router.back()}><ArrowLeft size={18} className="text-muted hover:text-accent" /></button>
          <span className="font-serif font-semibold text-text-light">Xəritə</span>
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-card-hover border border-accent/10 hover:border-accent/40 transition-colors"
        >
          <SlidersHorizontal size={18} className="text-text-light" />
        </button>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-40 right-4 z-20 flex flex-col gap-2">
        {[Plus, Minus].map((Icon, i) => (
          <button key={i} className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-card border border-accent/10 hover:border-accent/40 transition-colors">
            <Icon size={16} className="text-text-light" />
          </button>
        ))}
      </div>

      {/* Selected place preview */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 z-20 bg-card rounded-2xl p-4 shadow-card-hover border border-accent/10">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-dark flex items-center justify-center text-3xl flex-shrink-0">
              {selectedPlace.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-text-light truncate">{selectedPlace.label}</h3>
                <button onClick={() => setSelectedPin(null)} className="text-muted hover:text-accent flex-shrink-0">
                  <X size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="accent" className="text-[10px]">{selectedPlace.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star size={11} className="fill-accent text-accent" />
                  <span className="text-xs text-text-light">{selectedPlace.rating}</span>
                </div>
                <span className="text-xs font-bold text-accent ml-auto">₼{selectedPlace.price}/nəfər</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => router.push(`/place/${selectedPlace.id}`)} className="flex-1 border border-accent/30 rounded-xl py-2 text-accent text-sm font-semibold hover:bg-accent/10 transition-colors">
              Ətraflı bax
            </button>
            <Button variant="gradient" className="flex-1 text-sm py-2" onClick={() => router.push(`/booking/${selectedPlace.id}`)}>Bron et</Button>
          </div>
        </div>
      )}

      {/* Filter bottom sheet */}
      {filterOpen && (
        <>
          <div className="absolute inset-0 bg-black/40 z-30" onClick={() => setFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-card rounded-t-3xl p-6 shadow-card-hover">
            <div className="w-12 h-1 rounded-full bg-muted/30 mx-auto mb-5" />
            <h3 className="font-semibold text-text-light mb-4">Filtərləmə</h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {filterPills1.map(f => (
                <button key={f} onClick={() => toggleFilter(f)}
                  className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeFilters.includes(f) ? "bg-accent text-white" : "border border-muted/30 text-muted hover:border-accent/40")}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {filterPills2.map(f => (
                <button key={f} onClick={() => toggleFilter(f)}
                  className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeFilters.includes(f) ? "bg-accent text-white" : "border border-muted/30 text-muted hover:border-accent/40")}>
                  {f}
                </button>
              ))}
            </div>
            <Button variant="gradient" className="w-full" onClick={() => setFilterOpen(false)}>
              Filtərləri tətbiq et
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
