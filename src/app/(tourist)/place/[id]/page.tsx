"use client";

import { useState } from "react";
import { ArrowLeft, Share2, Heart, MapPin, Star, CheckCircle, ChevronDown, Navigation } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { cn } from "@/lib/utils/cn";

const amenities = [
  { icon: "📶", label: "WiFi" }, { icon: "🚗", label: "Parkinq" },
  { icon: "🚻", label: "Tualet" }, { icon: "💧", label: "Su" },
  { icon: "🔥", label: "Barbekü" }, { icon: "🧒", label: "Uşaq üçün" },
];

const activities = [
  { emoji: "🍇", name: "Üzüm Yığımı", duration: "3 saat", price: 35 },
  { emoji: "🐴", name: "At Minmə", duration: "1 saat", price: 25 },
  { emoji: "🍯", name: "Bal Dadımı", duration: "45 dəq", price: 15 },
  { emoji: "⛺", name: "Kamp", duration: "1 gecə", price: 60 },
];

const reviews = [
  { name: "Nigar Ə.", date: "2024-10", rating: 5, text: "Fantastik təcrübə idi! Ferma sahibi çox mehriban və peşəkardır." },
  { name: "Rauf M.", date: "2024-09", rating: 4, text: "Gözəl yer, təmiz hava. Uşaqlar çox sevdi." },
];

export default function PlaceDetailPage() {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen bg-primary pb-24">
      {/* Hero */}
      <div className="relative h-72 bg-gradient-dark overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-60">🍇</div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <ArrowLeft size={18} />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
              <Share2 size={16} />
            </button>
            <button onClick={() => setLiked(!liked)}
              className={cn("w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors",
                liked ? "text-red-400" : "text-white")}>
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-3 left-4">
          <Badge variant="accent">Fermalar</Badge>
        </div>
      </div>

      {/* Info card overlapping hero */}
      <div className="bg-card rounded-t-3xl -mt-6 relative z-10 px-5 pt-6 pb-4 shadow-card border-t border-accent/10">
        <h1 className="font-serif text-2xl font-bold text-text-light mb-2">Şəki Üzüm Bağı Ferması</h1>

        <div className="flex items-center gap-3 mb-3">
          <StarRating rating={4.9} reviews={47} />
          <div className="flex items-center gap-1 ml-auto">
            <MapPin size={12} className="text-muted" />
            <span className="text-muted text-xs">12 km</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="price">₼45 / nəfər</Badge>
          <span className="text-muted text-sm">• 4 saat</span>
          <span className="text-muted text-sm">• Mövcud</span>
        </div>

        {/* Host */}
        <div className="flex items-center gap-3 py-3 border-t border-b border-primary/10 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-main flex items-center justify-center text-white font-bold">E</div>
          <div>
            <p className="text-text-light text-sm font-medium">Elçin Həsənov</p>
            <p className="text-muted text-xs">Ferma sahibi</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-accent text-xs font-semibold">
            <CheckCircle size={14} /> Doğrulanmış
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h2 className="font-serif font-semibold text-text-light mb-2">Haqqında</h2>
          <p className={cn("text-muted text-sm leading-relaxed", !expanded && "line-clamp-3")}>
            Şəkinin qədim üzüm bağlarında yerləşən bu ferma, Azərbaycanın ən autentik kənd təcrübələrindən birini təqdim edir.
            Yerli fermer Elçin Həsənov ilə birlikdə üzüm yığımını öyrənin, şərab hazırlama sirlərini kəşf edin.
            Hər ziyarətçi 3-4 saatlıq dolu proqram ilə qayıdır.
          </p>
          <button onClick={() => setExpanded(!expanded)} className="text-accent text-xs font-semibold mt-1 flex items-center gap-1">
            {expanded ? "Az göstər" : "Daha çox"} <ChevronDown size={12} className={expanded ? "rotate-180" : ""} />
          </button>
        </div>

        {/* Activities */}
        <div className="mb-4">
          <h2 className="font-serif font-semibold text-text-light mb-3">Fəaliyyətlər</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {activities.map((act, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-primary/10 rounded-xl p-3 border border-accent/10 min-w-[90px]">
                <span className="text-2xl">{act.emoji}</span>
                <span className="text-xs font-medium text-text-light text-center">{act.name}</span>
                <span className="text-xs text-muted">{act.duration}</span>
                <span className="text-xs text-accent font-bold">₼{act.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <h2 className="font-serif font-semibold text-text-light mb-3">İmkanlar</h2>
          <div className="grid grid-cols-3 gap-2">
            {amenities.map((a, i) => (
              <div key={i} className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2 border border-accent/10">
                <span className="text-base">{a.icon}</span>
                <span className="text-xs text-text-light">{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <h2 className="font-serif font-semibold text-text-light mb-3">Məkan</h2>
          <div className="h-36 bg-gradient-dark rounded-xl flex items-center justify-center text-4xl mb-3 border border-accent/10">
            🗺️
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-muted" />
              <span className="text-muted text-sm">Şəki, Azərbaycan</span>
            </div>
            <button className="flex items-center gap-1.5 text-accent text-sm font-semibold border border-accent/30 rounded-lg px-3 py-1.5">
              <Navigation size={14} /> Yol göstər
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif font-semibold text-text-light">Rəylər</h2>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-2xl text-accent">4.9</span>
              <div className="flex flex-col">
                <StarRating rating={4.9} />
                <span className="text-xs text-muted">47 rəy</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((rev, i) => (
              <div key={i} className="bg-primary/10 rounded-xl p-4 border border-accent/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center text-white text-xs font-bold">
                    {rev.name[0]}
                  </div>
                  <div>
                    <p className="text-text-light text-sm font-medium">{rev.name}</p>
                    <p className="text-muted text-xs">{rev.date}</p>
                  </div>
                  <StarRating rating={rev.rating} className="ml-auto" />
                </div>
                <p className="text-muted text-sm">{rev.text}</p>
              </div>
            ))}
          </div>

          <button className="text-accent text-sm font-semibold mt-3 hover:underline">Bütün rəylər →</button>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-accent/10 px-4 py-3 flex items-center justify-between z-30">
        <div>
          <span className="font-bold text-xl text-text-light font-serif">₼45</span>
          <span className="text-muted text-sm"> / nəfər</span>
        </div>
        <Button variant="gradient" size="lg">Bron Et</Button>
      </div>
    </div>
  );
}
