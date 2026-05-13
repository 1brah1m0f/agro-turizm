"use client";

import { useState } from "react";
import { Star, Calendar, Users, ChevronRight, Bookmark, SlidersHorizontal, X } from "lucide-react";
import { TOURS, type Tour } from "./tours";
import { cn } from "@/lib/utils/cn";

interface Props {
  selectedTour: Tour | null;
  onSelect: (tour: Tour | null) => void;
  onClose?: () => void;
}

const FILTERS = ["Tarix", "Qiymət", "Tur növü", "TurAgent"];

export default function TourListPanel({ selectedTour, onSelect, onClose }: Props) {
  const [saved, setSaved] = useState<string[]>([]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="w-[370px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-gray-900 text-lg">Turlar</h2>
          {onClose && (
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <X size={17} />
            </button>
          )}
        </div>
        <p className="text-gray-500 text-xs leading-relaxed">
          Seçdiyiniz ərazidə fəaliyyət göstərən TurAgentlər və onların xidmətləri
        </p>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-5 py-3 border-b border-gray-100 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-green-500 hover:text-green-700 transition-colors bg-white">
            {f} <ChevronRight size={10} className="rotate-90" />
          </button>
        ))}
      </div>

      {/* Tour cards */}
      <div className="flex-1 overflow-y-auto">
        {TOURS.map((tour) => {
          const isSelected = selectedTour?.id === tour.id;
          return (
            <div
              key={tour.id}
              onClick={() => onSelect(isSelected ? null : tour)}
              className={cn(
                "mx-4 my-3 rounded-2xl border cursor-pointer transition-all hover:shadow-md",
                isSelected
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-100 bg-white hover:border-gray-200"
              )}>
              <div className="p-4">
                {/* Agency + bookmark */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Agency logo */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: tour.agencyColor }}>
                      {tour.agencyInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-900 text-sm">{tour.agencyName}</p>
                        <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-amber-700 text-[10px] font-semibold">{tour.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs">{tour.location}</p>
                    </div>
                  </div>
                  <button onClick={(e) => toggleSave(tour.id, e)}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
                    <Bookmark size={14} className={saved.includes(tour.id) ? "fill-green-600 text-green-600" : "text-gray-400"} />
                  </button>
                </div>

                {/* Tour name + description */}
                <p className="text-gray-800 text-sm font-medium mb-1">{tour.name}</p>
                <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{tour.description}</p>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} />
                    <span>{tour.dateRange}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>{tour.duration}</span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <Users size={11} />
                    <span>Min. {tour.minPeople} nəfər</span>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 text-base">{tour.price} AZN</span>
                    <span className="text-gray-400 text-xs"> / nəfər</span>
                  </div>
                  <button className="flex items-center gap-1 text-green-600 text-xs font-semibold hover:text-green-700 transition-colors">
                    Daha ətraflı <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Route stops indicator */}
              {isSelected && (
                <div className="px-4 pb-3 flex items-center gap-1.5">
                  {tour.stopIds.map((_, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: tour.routeColor }}>
                        {i + 1}
                      </div>
                      {i < tour.stopIds.length - 1 && (
                        <div className="w-6 h-px" style={{ background: tour.routeColor }} />
                      )}
                    </div>
                  ))}
                  <span className="text-xs text-gray-400 ml-1">{tour.stopIds.length} dayanacaq</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
