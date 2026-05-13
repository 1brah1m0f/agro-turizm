"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Star, Flame, Coins, ChevronRight } from "lucide-react";
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

const quickFilters = ["Hamısı", "Ən Ucuz", "Ən Baha"];
const categories = [
  { emoji: "🌾", label: "Ferma" },
  { emoji: "🎣", label: "Balıqçılıq" },
  { emoji: "⛺", label: "Kamp" },
  { emoji: "🍎", label: "Meyvə Yığımı" },
  { emoji: "🐴", label: "At Minmə" },
  { emoji: "🍯", label: "Arıçılıq" },
];
const categoryEmoji: Record<string, string> = {
  Ferma: "🌾", Balıqçılıq: "🎣", Kamp: "⛺", Bag: "🍎", "At Minme": "🐴", Ariciliq: "🍯",
};

export default function TouristHomePage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Hamısı");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [coinBalance, setCoinBalance] = useState<number>(0);

  useEffect(() => {
    const url = new URL("/api/places", window.location.origin);
    if (activeCategory) url.searchParams.set("category", activeCategory);
    setLoading(true);
    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => setPlaces(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  useEffect(() => {
    fetch("/api/coins")
      .then((r) => r.json())
      .then((data) => setCoinBalance(data?.coinBalance ?? 0))
      .catch(() => null);
  }, []);

  const sorted = [...places].sort((a, b) => {
    if (activeFilter === "Ən Ucuz") return a.price - b.price;
    if (activeFilter === "Ən Baha") return b.price - a.price;
    return 0;
  });

  return (
    <div className="h-full overflow-y-auto"><div className="px-6 pt-8 pb-10" style={{ background: "#F7F8F5", minHeight: "100%" }}>

      {/* Coin balance bar — below nav pill */}
      <div
        className="flex items-center gap-3 rounded-[16px] px-4 py-3 mb-6"
        style={{
          background: "#ffffff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          border: "1px solid rgba(31,107,79,0.08)",
        }}
      >
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
        >
          <Coins size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium">Koin Balansı</p>
          <p className="text-[#1E1E1E] font-bold text-lg leading-tight">{coinBalance.toLocaleString()}</p>
        </div>
        <button
          onClick={() => router.push("/coins")}
          className="text-[11px] font-semibold text-[#1F6B4F] flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          Ətraflı <ChevronRight size={12} />
        </button>
      </div>

      {/* Hero / Search */}
      <div className="mb-6">
        <h1
          className="text-[22px] font-bold text-[#1E1E1E] mb-1 leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Haraya gedək bu gün?
        </h1>
        <p className="text-[#6B7280] text-sm mb-4">Azərbaycanın ən gözəl aqro-turizm məkanları</p>

        <div
          className="relative flex items-center gap-2 rounded-[14px] px-4 py-3"
          style={{
            background: "#ffffff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            border: "1px solid rgba(31,107,79,0.08)",
          }}
        >
          <MapPin size={15} className="text-[#6B7280] flex-shrink-0" />
          <input
            className="flex-1 bg-transparent text-[#1E1E1E] text-sm outline-none placeholder:text-[#9CA3AF]"
            placeholder="Məkan, fəaliyyət axtar..."
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/explore?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
            }}
          />
          <button
            className="w-7 h-7 rounded-[9px] flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
          >
            <Search size={13} className="text-white" />
          </button>
        </div>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5" style={{ scrollbarWidth: "none" }}>
        {quickFilters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all",
              activeFilter === f
                ? "text-white"
                : "text-[#6B7280] border hover:border-[#1F6B4F]/40 hover:text-[#1F6B4F]",
            )}
            style={
              activeFilter === f
                ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }
                : { background: "#ffffff", border: "1px solid #E5E7EB" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Category chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: "none" }}>
        {categories.map(cat => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
            className={cn(
              "flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-[14px] border transition-all",
              activeCategory === cat.label
                ? "border-[#1F6B4F] text-[#1F6B4F]"
                : "border-[#E5E7EB] text-[#6B7280] hover:border-[#1F6B4F]/40",
            )}
            style={{
              background: activeCategory === cat.label ? "rgba(31,107,79,0.06)" : "#ffffff",
            }}
          >
            <span className="text-xl">{cat.emoji}</span>
            <span className="text-[11px] font-medium whitespace-nowrap">{cat.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <>
          {/* Recommended */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-[16px] font-bold text-[#1E1E1E]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Tövsiyə olunan məkanlar
              </h2>
              <button
                onClick={() => router.push("/explore")}
                className="text-[#1F6B4F] text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                Hamısı <ChevronRight size={13} />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {sorted.slice(0, 4).map((place) => (
                <button
                  key={place.id}
                  onClick={() => router.push(`/place/${place.id}`)}
                  className="flex-shrink-0 w-52 rounded-[16px] overflow-hidden text-left transition-all duration-200 hover:-translate-y-1"
                  style={{
                    background: "#ffffff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className="h-28 flex items-center justify-center text-4xl relative"
                    style={{ background: "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)" }}
                  >
                    {categoryEmoji[place.category] ?? "🌿"}
                    <div
                      className="absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: "rgba(31,107,79,0.75)" }}
                    >
                      {place.category}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-[#1E1E1E] text-sm mb-1 truncate">{place.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={11} className="text-[#D6A75F] fill-[#D6A75F]" />
                      <span className="text-xs text-[#6B7280]">{place.entrepreneur.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <MapPin size={10} className="text-[#9CA3AF]" />
                        <span className="text-[11px] text-[#9CA3AF] truncate">{place.entrepreneur.businessName}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1F6B4F]">₼{place.price}/nəfər</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular grid */}
          <div>
            <h2
              className="text-[16px] font-bold text-[#1E1E1E] mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Populyar Aqro Məkanlar
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {sorted.map((place) => (
                <button
                  key={place.id}
                  onClick={() => router.push(`/place/${place.id}`)}
                  className="rounded-[16px] overflow-hidden text-left transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                >
                  <div
                    className="h-20 flex items-center justify-center text-3xl"
                    style={{ background: "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)" }}
                  >
                    {categoryEmoji[place.category] ?? "🌿"}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-[#1E1E1E] text-xs mb-1 truncate">{place.name}</h3>
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-[#9CA3AF]" />
                      <span className="text-[11px] text-[#9CA3AF] truncate">{place.entrepreneur.location}</span>
                      <span className="text-xs font-bold text-[#1F6B4F] ml-auto">₼{place.price}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && sorted.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-[#6B7280] text-sm">Məkan tapılmadı</p>
        </div>
      )}

      {/* Daily task card */}
      <div
        className="mt-8 rounded-[16px] p-5"
        style={{
          background: "#ffffff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid rgba(31,107,79,0.08)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[#1F6B4F]" />
            <span className="font-semibold text-[#1E1E1E] text-sm">Günlük Tapşırıq</span>
          </div>
          <span
            className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
          >
            +50 KOİN
          </span>
        </div>
        <p className="text-[#6B7280] text-sm mb-3">Meyvə yığım aktivliyini tamamla</p>
        <div className="h-1.5 rounded-full bg-[#F0F0EC] mb-4 overflow-hidden">
          <div
            className="h-full w-[65%] rounded-full"
            style={{ background: "linear-gradient(90deg, #1F6B4F, #2E8B57)" }}
          />
        </div>
        <button
          className="w-full py-2.5 rounded-[12px] text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
        >
          İndi Et
        </button>
      </div>
    </div></div>
  );
}
