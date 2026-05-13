"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Star, Heart } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

interface Place {
  id: string;
  name: string;
  category: string;
  address: string;
  price: number;
  entrepreneur: { businessName: string; location: string };
}

const categories = ["Hamısı", "Ferma", "Kamp", "At Minme", "Ariciliq", "Bag"];
const categoryEmoji: Record<string, string> = {
  Ferma: "🌾", Kamp: "⛺", "At Minme": "🐴", Ariciliq: "🍯", Bag: "🍎",
};

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [activeCategory, setActiveCategory] = useState("Hamısı");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = useCallback(() => {
    const url = new URL("/api/places", window.location.origin);
    if (activeCategory !== "Hamısı") url.searchParams.set("category", activeCategory);
    if (search.trim()) url.searchParams.set("search", search.trim());
    setLoading(true);
    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => setPlaces(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  useEffect(() => {
    const t = setTimeout(fetchPlaces, 300);
    return () => clearTimeout(t);
  }, [fetchPlaces]);

  return (
    <div className="min-h-screen bg-primary pb-24">
      <div className="bg-primary-dark px-4 pt-5 pb-4 sticky top-0 z-10 border-b border-accent/10">
        <h1 className="font-serif text-xl font-bold text-text-dark mb-3">Kəşf Et</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-primary-light rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-dark border border-accent/10 outline-none focus:border-accent placeholder-muted"
              placeholder="Məkan, bölgə axtar..."
            />
          </div>
          <button className="w-10 h-10 bg-card rounded-xl flex items-center justify-center border border-accent/10 hover:border-accent/40 transition-colors">
            <SlidersHorizontal size={16} className="text-text-light" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={cn("flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all",
                activeCategory === c ? "bg-accent text-white" : "bg-primary-dark text-muted border border-muted/20 hover:border-accent/40")}>
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <>
            <p className="text-muted text-xs">{places.length} məkan tapıldı</p>

            <div className="grid grid-cols-2 gap-3">
              {places.map((place) => (
                <button key={place.id} onClick={() => router.push(`/place/${place.id}`)}
                  className="bg-card rounded-xl shadow-card overflow-hidden border border-accent/10 text-left">
                  <div className="relative h-32 bg-gradient-dark flex items-center justify-center text-4xl">
                    {categoryEmoji[place.category] ?? "🌿"}
                    <button
                      onClick={(e) => { e.stopPropagation(); setLiked(prev => ({ ...prev, [place.id]: !prev[place.id] })); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                      <Heart size={13} className={liked[place.id] ? "fill-red-400 text-red-400" : "text-white"} />
                    </button>
                    <div className="absolute top-2 left-2">
                      <Badge variant="accent" className="text-[9px] px-2 py-0.5">{place.category}</Badge>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-text-light text-xs mb-1 truncate">{place.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={10} className="fill-accent text-accent" />
                      <span className="text-xs text-muted">{place.entrepreneur.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <MapPin size={9} className="text-muted" />
                        <span className="text-[10px] text-muted truncate">{place.entrepreneur.businessName}</span>
                      </div>
                      <span className="text-xs font-bold text-accent">₼{place.price}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {places.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-muted">Nəticə tapılmadı</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  );
}
