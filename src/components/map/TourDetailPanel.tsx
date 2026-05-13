"use client";

import { ArrowLeft, Star, Calendar, Users, MapPin, Clock, CheckCircle } from "lucide-react";
import { type Tour } from "./tours";
import { LOCATIONS } from "./locations";

interface Props {
  tour: Tour;
  onBack: () => void;
  onSelect: () => void;
}

export default function TourDetailPanel({ tour, onBack, onSelect }: Props) {
  const stops = tour.stopIds.map(id => LOCATIONS.find(l => l.id === id)).filter(Boolean) as typeof LOCATIONS;

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onBack}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0">
          <ArrowLeft size={17} className="text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-900 text-sm truncate">{tour.name}</h2>
          <p className="text-gray-400 text-xs">{tour.agencyName}</p>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full flex-shrink-0">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="text-amber-700 text-[11px] font-bold">{tour.rating}</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Agency card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ background: tour.routeColor }}>
            {tour.agencyInitials}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{tour.agencyName}</p>
            <p className="text-gray-500 text-xs mt-0.5">{tour.location}</p>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">{tour.description}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
            <Calendar size={15} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400">Tarix</p>
              <p className="text-xs font-semibold text-gray-800">{tour.dateRange}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
            <Clock size={15} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400">Müddət</p>
              <p className="text-xs font-semibold text-gray-800">{tour.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3">
            <Users size={15} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400">Minimum</p>
              <p className="text-xs font-semibold text-gray-800">{tour.minPeople} nəfər</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl p-3 border-2" style={{ borderColor: tour.routeColor + "30", background: tour.routeColor + "08" }}>
            <div>
              <p className="text-[10px] text-gray-400">Qiymət</p>
              <p className="text-sm font-bold" style={{ color: tour.routeColor }}>{tour.price} AZN <span className="text-[10px] font-normal text-gray-400">/ nəfər</span></p>
            </div>
          </div>
        </div>

        {/* Route stops */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-3">Marşrut dayanacaqları</h3>
          <div className="space-y-3">
            {stops.map((stop, i) => {
              const photo = stop.photos[0]?.url ?? "";
              const isLast = i === stops.length - 1;
              return (
                <div key={stop.id} className="flex gap-3">
                  {/* Timeline */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: tour.routeColor }}>
                      {i + 1}
                    </div>
                    {!isLast && <div className="w-px flex-1 mt-1" style={{ background: tour.routeColor + "40", minHeight: 16 }} />}
                  </div>
                  {/* Card */}
                  <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex mb-1">
                    <div className="flex-1 p-3 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{stop.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={10} className="text-gray-400" />
                        <span className="text-[11px] text-gray-400">{stop.village}, {stop.region}</span>
                      </div>
                      {stop.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {stop.activities.slice(0, 2).map(a => (
                            <span key={a} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {photo && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={photo} alt={stop.name} className="w-20 h-auto object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What's included */}
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-2">Nə daxildir</h3>
          <div className="space-y-1.5">
            {["Nəqliyyat", "Bələdçi", "Gecələmə (müvafiq turlarda)", "Sığorta"].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle size={13} className="text-green-600 flex-shrink-0" />
                <span className="text-xs text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-gray-900 text-xl">{tour.price} AZN</span>
            <span className="text-gray-400 text-xs"> / nəfər</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-amber-700 text-[11px] font-bold">{tour.rating}</span>
          </div>
        </div>
        <button onClick={onSelect}
          className="w-full py-3 rounded-2xl text-white font-semibold text-sm hover:brightness-110 transition-all"
          style={{ background: tour.routeColor }}>
          Bu turu seç
        </button>
      </div>
    </div>
  );
}
