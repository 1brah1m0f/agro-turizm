"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Star, Heart } from "lucide-react";
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
const categoryGradient: Record<string, string> = {
  Ferma: "linear-gradient(135deg,#d1fae5,#6ee7b7)",
  Kamp: "linear-gradient(135deg,#bfdbfe,#93c5fd)",
  "At Minme": "linear-gradient(135deg,#ede9fe,#c4b5fd)",
  Ariciliq: "linear-gradient(135deg,#fef3c7,#fcd34d)",
  Bag: "linear-gradient(135deg,#fce7f3,#f9a8d4)",
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
    <div className="h-full overflow-y-auto"><div className="px-6 pt-8 pb-10" style={{ background: "#F7F8F5", minHeight: "100%" }}>

      {/* Title + search */}
      <div className="mb-5">
        <h1
          className="text-[22px] font-bold text-[#1E1E1E] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Kəşf Et
        </h1>
        <div
          className="flex items-center gap-2 rounded-[14px] px-4 py-3"
          style={{
            background: "#ffffff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            border: "1px solid rgba(31,107,79,0.08)",
          }}
        >
          <Search size={15} className="text-[#9CA3AF] flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[#1E1E1E] text-sm outline-none placeholder:text-[#9CA3AF]"
            placeholder="Məkan, bölgə axtar..."
          />
          <button className="w-7 h-7 rounded-[9px] flex items-center justify-center flex-shrink-0 bg-[#F7F8F5] text-[#6B7280] hover:text-[#1F6B4F] transition-colors">
            <SlidersHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all",
              activeCategory === c ? "text-white" : "text-[#6B7280] hover:text-[#1F6B4F]",
            )}
            style={
              activeCategory === c
                ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }
                : { background: "#ffffff", border: "1px solid #E5E7EB" }
            }
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <>
          <p className="text-[#9CA3AF] text-xs mb-4 font-medium">{places.length} məkan tapıldı</p>

          <div className="grid grid-cols-2 gap-3">
            {places.map((place) => (
              <button
                key={place.id}
                onClick={() => router.push(`/place/${place.id}`)}
                className="rounded-[16px] overflow-hidden text-left transition-all duration-200 hover:-translate-y-1"
                style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="relative h-32 flex items-center justify-center text-4xl"
                  style={{ background: categoryGradient[place.category] ?? "linear-gradient(135deg,#d1fae5,#6ee7b7)" }}
                >
                  {categoryEmoji[place.category] ?? "🌿"}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLiked(prev => ({ ...prev, [place.id]: !prev[place.id] }));
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{ background: "rgba(255,255,255,0.85)" }}
                  >
                    <Heart size={13} className={liked[place.id] ? "fill-red-400 text-red-400" : "text-[#6B7280]"} />
                  </button>
                  <div
                    className="absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-md"
                    style={{ background: "rgba(31,107,79,0.75)" }}
                  >
                    {place.category}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-[#1E1E1E] text-xs mb-1 truncate">{place.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={10} className="fill-[#D6A75F] text-[#D6A75F]" />
                    <span className="text-[11px] text-[#6B7280]">{place.entrepreneur.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin size={9} className="text-[#9CA3AF]" />
                      <span className="text-[10px] text-[#9CA3AF] truncate">{place.entrepreneur.businessName}</span>
                    </div>
                    <span className="text-xs font-bold text-[#1F6B4F]">₼{place.price}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {places.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-[#6B7280]">Nəticə tapılmadı</p>
            </div>
          )}
        </>
      )}
    </div></div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  );
}
