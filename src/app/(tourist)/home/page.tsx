"use client";

import { Search, MapPin, Star, Flame, Coins, ChevronRight } from "lucide-react";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";

const quickFilters = ["Yaxınımda", "Ən Ucuz", "Ən Yüksək Reytinq", "Macəra", "Ailə Üçün"];
const categories = [
  { emoji: "🌾", label: "Fermalar" },
  { emoji: "🎣", label: "Balıqçılıq" },
  { emoji: "⛺", label: "Kamp" },
  { emoji: "🍎", label: "Meyvə Yığımı" },
  { emoji: "🐴", label: "At Minmə" },
  { emoji: "🏡", label: "Kənd Evləri" },
  { emoji: "🍯", label: "Arıçılıq" },
];

const places = [
  { name: "Quba Meyvə Bağı", rating: 4.8, reviews: 32, distance: "12 km", price: 35, category: "Meyvə Yığımı", emoji: "🍎" },
  { name: "Şəki Üzüm Ferması", rating: 4.9, reviews: 47, distance: "3 km", price: 45, category: "Fermalar", emoji: "🍇" },
  { name: "Qax Dağ Ferması", rating: 4.7, reviews: 21, distance: "28 km", price: 55, category: "Fermalar", emoji: "⛰️" },
  { name: "Gəncə Kamp Sahəsi", rating: 4.6, reviews: 15, distance: "8 km", price: 25, category: "Kamp", emoji: "⛺" },
];

export default function TouristHomePage() {
  const [activeFilter, setActiveFilter] = useState("Yaxınımda");
  const [activeCategory, setActiveCategory] = useState("Fermalar");

  return (
    <div className="min-h-screen bg-primary">
      {/* Top navbar */}
      <div className="bg-primary-dark px-4 pt-4 pb-3 flex items-center justify-between sticky top-0 z-10 border-b border-accent/10">
        <span className="font-serif font-bold text-text-dark">FarMorfX</span>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <button className="hover:text-accent transition-colors">Xəritə</button>
          <button className="hover:text-accent transition-colors">Fəaliyyətlər</button>
          <button className="hover:text-accent transition-colors">Koin Mağazası</button>
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5">
            <Coins size={14} className="text-accent" />
            <span className="text-accent text-xs font-bold">248</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center text-white text-xs font-bold">A</div>
        </div>
      </div>

      <div className="px-4 pb-24 space-y-6">
        {/* Search hero */}
        <div className="pt-6">
          <h1 className="font-serif text-2xl font-bold text-text-dark mb-4">Haraya gedək bu gün?</h1>
          <div className="relative mb-4">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="w-full bg-card rounded-full py-3 pl-10 pr-12 text-text-light text-sm border border-accent/10 outline-none focus:border-accent placeholder-muted"
              placeholder="Məkan, fəaliyyət axtar..."
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center">
              <Search size={14} className="text-white" />
            </button>
          </div>

          {/* Quick filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {quickFilters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={cn("flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all",
                  activeFilter === f ? "bg-accent text-white" : "bg-primary-dark text-muted border border-muted/20 hover:border-accent/40")}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Category scroll */}
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat.label} onClick={() => setActiveCategory(cat.label)}
              className={cn("flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all",
                activeCategory === cat.label ? "border-accent bg-accent/10 text-accent" : "border-primary-light text-muted hover:border-accent/30")}>
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-xs whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Recommended places */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg font-bold text-text-dark border-b-2 border-accent pb-1 inline-block">
              Sizin üçün Tövsiyələr
            </h2>
            <button className="text-accent text-xs flex items-center gap-1">Hamısı <ChevronRight size={14} /></button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {places.slice(0, 3).map((place, i) => (
              <div key={i} className="flex-shrink-0 w-56 bg-card rounded-xl shadow-card overflow-hidden border border-accent/10">
                <div className="h-32 bg-gradient-dark flex items-center justify-center text-4xl relative">
                  {place.emoji}
                  <div className="absolute top-2 left-2">
                    <Badge variant="accent" className="text-[10px]">{place.category}</Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-text-light text-sm mb-1 truncate">{place.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={11} className="fill-accent text-accent" />
                    <span className="text-xs text-text-light font-medium">{place.rating}</span>
                    <span className="text-xs text-muted">({place.reviews} rəy)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin size={11} className="text-muted" />
                      <span className="text-xs text-muted">{place.distance}</span>
                    </div>
                    <span className="text-xs font-bold text-accent">₼{place.price}/nəfər</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular places 2-col grid */}
        <div>
          <h2 className="font-serif text-lg font-bold text-text-dark mb-3">Populyar Aqro Məkanlar</h2>
          <div className="grid grid-cols-2 gap-3">
            {places.map((place, i) => (
              <div key={i} className="bg-card rounded-xl shadow-card overflow-hidden border border-accent/10">
                <div className="h-24 bg-gradient-dark flex items-center justify-center text-3xl">{place.emoji}</div>
                <div className="p-3">
                  <h3 className="font-semibold text-text-light text-xs mb-1 truncate">{place.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="fill-accent text-accent" />
                    <span className="text-xs text-text-light">{place.rating}</span>
                    <span className="text-xs text-muted ml-auto">₼{place.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily task widget */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-accent" />
              <span className="font-semibold text-text-light text-sm">Günlük Tapşırıq</span>
            </div>
            <Badge variant="accent" className="text-[10px]">+50 KOİN</Badge>
          </div>
          <p className="text-muted text-sm mb-3">Meyvə yığım aktivliyini tamamla</p>
          <div className="h-1.5 rounded-full bg-primary-light mb-3 overflow-hidden">
            <div className="h-full w-[65%] rounded-full bg-gradient-main" />
          </div>
          <button className="w-full bg-gradient-main text-white rounded-xl py-2.5 text-sm font-semibold">
            İndi Et
          </button>
        </div>
      </div>
    </div>
  );
}
