"use client";

import { useState } from "react";
import { Star, Calendar, Users, ChevronRight, Bookmark, Search, X } from "lucide-react";
import { TOURS, type Tour } from "./tours";
import { cn } from "@/lib/utils/cn";

interface Props {
  selectedTour: Tour | null;
  onSelect: (tour: Tour | null) => void;
  onClose?: () => void;
}

const FILTERS = ["Tarix", "Qiymət", "Tur növü", "TurAgent"];

export default function TourListPanel({ selectedTour, onSelect, onClose }: Props) {
  const [saved,  setSaved]  = useState<string[]>([]);
  const [query,  setQuery]  = useState("");
  const [active, setActive] = useState<string | null>(null);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filtered = TOURS.filter(t =>
    query.trim() === "" ||
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.agencyName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "#FFFFFF", fontFamily: "var(--font-sans)" }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2
              className="text-[#1E1E1E] text-xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Turlar
            </h2>
            <p className="text-[#6B7280] text-xs mt-1">
              {filtered.length} tur mövcuddur
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "#F7F8F5", color: "#6B7280" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1E1E1E")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6B7280")}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="relative mt-3">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tur və ya agent axtar..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[14px] text-xs text-[#1E1E1E] placeholder-[#9CA3AF] outline-none transition-all"
            style={{
              background: "#F7F8F5",
              border: "1.5px solid transparent",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(31,107,79,0.25)")}
            onBlur={e => (e.currentTarget.style.borderColor = "transparent")}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-6 pb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map(f => {
          const isActive = active === f;
          return (
            <button
              key={f}
              onClick={() => setActive(isActive ? null : f)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                isActive
                  ? { background: "rgba(31,107,79,0.10)", color: "#1F6B4F", border: "1.5px solid rgba(31,107,79,0.20)" }
                  : { background: "#F7F8F5", color: "#6B7280", border: "1.5px solid transparent" }
              }
            >
              {f}
              <ChevronRight size={10} className={cn("transition-transform", isActive && "rotate-90")} />
            </button>
          );
        })}
      </div>

      {/* Tour cards */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4 space-y-3"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#E5E7EB transparent" }}
      >
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F8F5] flex items-center justify-center mb-3">
              <Search size={18} className="text-[#9CA3AF]" />
            </div>
            <p className="text-[#1E1E1E] text-sm font-medium">Nəticə tapılmadı</p>
            <p className="text-[#6B7280] text-xs mt-1">Axtarış sözünü dəyişin</p>
          </div>
        )}
        {filtered.map((tour) => {
          const isSelected = selectedTour?.id === tour.id;
          const isSaved = saved.includes(tour.id);
          return (
            <div
              key={tour.id}
              onClick={() => onSelect(isSelected ? null : tour)}
              className="rounded-[20px] cursor-pointer transition-all duration-200 overflow-hidden"
              style={
                isSelected
                  ? {
                      border: "1.5px solid rgba(31,107,79,0.25)",
                      background: "rgba(31,107,79,0.04)",
                      boxShadow: "0 8px 32px rgba(31,107,79,0.10)",
                    }
                  : {
                      border: "1.5px solid #F0F0EC",
                      background: "#FFFFFF",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }
              }
              onMouseEnter={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#E0E0DC";
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#F0F0EC";
                }
              }}
            >
              <div className="p-4">
                {/* Agency row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: tour.agencyColor }}
                    >
                      {tour.agencyInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#1E1E1E] text-sm">{tour.agencyName}</p>
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(214,167,95,0.12)" }}
                        >
                          <Star size={9} fill="#D6A75F" className="text-[#D6A75F]" />
                          <span className="text-[10px] font-semibold" style={{ color: "#B8843A" }}>
                            {tour.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-[#6B7280] text-xs mt-0.5">{tour.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={e => toggleSave(tour.id, e)}
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors flex-shrink-0"
                    style={{ background: isSaved ? "rgba(31,107,79,0.08)" : "#F7F8F5" }}
                  >
                    <Bookmark
                      size={14}
                      className={isSaved ? "fill-[#1F6B4F] text-[#1F6B4F]" : "text-[#9CA3AF]"}
                    />
                  </button>
                </div>

                {/* Name + desc */}
                <p className="text-[#1E1E1E] text-sm font-semibold mb-1 leading-snug">
                  {tour.name}
                </p>
                <p className="text-[#6B7280] text-xs leading-relaxed mb-3 line-clamp-2">
                  {tour.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={11} />
                    <span>{tour.dateRange}</span>
                  </div>
                  <span>·</span>
                  <span>{tour.duration}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <Users size={11} />
                    <span>{tour.minPeople}+ nəfər</span>
                  </div>
                </div>

                {/* Price + CTA */}
                <div
                  className="flex items-center justify-between pt-3"
                  style={{ borderTop: "1px solid #F0F0EC" }}
                >
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-[#1E1E1E] text-base">{tour.price}</span>
                    <span className="text-[#6B7280] text-xs font-medium">AZN</span>
                    <span className="text-[#9CA3AF] text-[10px]">/ nəfər</span>
                  </div>
                  <button
                    className="flex items-center gap-1 text-xs font-semibold transition-colors"
                    style={{ color: "#1F6B4F" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#D6A75F")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#1F6B4F")}
                  >
                    Ətraflı <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Route indicator when selected */}
              {isSelected && (
                <div
                  className="px-4 pb-4 flex items-center gap-2"
                  style={{ borderTop: "1px solid rgba(31,107,79,0.10)", paddingTop: "12px" }}
                >
                  {tour.stopIds.map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: tour.routeColor }}
                      >
                        {i + 1}
                      </div>
                      {i < tour.stopIds.length - 1 && (
                        <div
                          className="h-px w-5"
                          style={{ background: `${tour.routeColor}50` }}
                        />
                      )}
                    </div>
                  ))}
                  <span className="text-[11px] text-[#9CA3AF] ml-1">
                    {tour.stopIds.length} dayanacaq
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
