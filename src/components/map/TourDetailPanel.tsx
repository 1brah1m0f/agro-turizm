"use client";

import { ArrowLeft, Star, Calendar, Users, MapPin, Clock, CheckCircle, Bookmark } from "lucide-react";
import { type Tour } from "./tours";
import { LOCATIONS } from "./locations";

interface Props {
  tour: Tour;
  onBack: () => void;
  onSelect: () => void;
}

export default function TourDetailPanel({ tour, onBack, onSelect }: Props) {
  const stops = tour.stopIds
    .map(id => LOCATIONS.find(l => l.id === id))
    .filter(Boolean) as typeof LOCATIONS;

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "#FFFFFF", fontFamily: "var(--font-sans)" }}
    >
      {/* Sticky header */}
      <div
        className="flex items-center gap-3 px-5 py-4 sticky top-0 z-10"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid #F0F0EC",
        }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{ background: "#F7F8F5", color: "#6B7280" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1F6B4F";
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#F7F8F5";
            (e.currentTarget as HTMLButtonElement).style.color = "#6B7280";
          }}
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex-1 min-w-0">
          <h2
            className="font-bold text-[#1E1E1E] text-sm truncate leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {tour.name}
          </h2>
          <p className="text-[#6B7280] text-xs mt-0.5">{tour.agencyName}</p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(214,167,95,0.12)" }}
          >
            <Star size={11} fill="#D6A75F" className="text-[#D6A75F]" />
            <span className="text-[11px] font-bold" style={{ color: "#B8843A" }}>{tour.rating}</span>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ background: "#F7F8F5" }}
          >
            <Bookmark size={14} className="text-[#9CA3AF]" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* Agency hero card */}
        <div
          className="flex items-center gap-4 p-4 rounded-[20px] overflow-hidden relative"
          style={{ background: "rgba(31,107,79,0.05)", border: "1px solid rgba(31,107,79,0.10)" }}
        >
          <div
            className="w-14 h-14 rounded-[16px] flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{
              background: tour.agencyColor,
              boxShadow: `0 6px 20px ${tour.agencyColor}40`,
            }}
          >
            {tour.agencyInitials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#1E1E1E] text-sm">{tour.agencyName}</p>
            <p className="text-[#6B7280] text-xs mt-0.5">{tour.location}</p>
            <p className="text-[#6B7280] text-xs mt-1.5 leading-relaxed line-clamp-2">
              {tour.description}
            </p>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: Calendar, label: "Tarix",    value: tour.dateRange },
            { icon: Clock,    label: "Müddət",   value: tour.duration  },
            { icon: Users,    label: "Minimum",  value: `${tour.minPeople} nəfər` },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-[16px] p-3"
              style={{ background: "#F7F8F5" }}
            >
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(31,107,79,0.10)" }}
              >
                <Icon size={14} className="text-[#1F6B4F]" />
              </div>
              <div>
                <p className="text-[10px] text-[#9CA3AF] font-medium">{label}</p>
                <p className="text-xs font-semibold text-[#1E1E1E] mt-0.5">{value}</p>
              </div>
            </div>
          ))}

          {/* Price card — gold accent */}
          <div
            className="flex items-center gap-3 rounded-[16px] p-3"
            style={{
              background: "rgba(214,167,95,0.08)",
              border: "1px solid rgba(214,167,95,0.20)",
            }}
          >
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(214,167,95,0.15)" }}
            >
              <span className="text-sm font-bold" style={{ color: "#B8843A" }}>₼</span>
            </div>
            <div>
              <p className="text-[10px] text-[#9CA3AF] font-medium">Qiymət</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: "#B8843A" }}>
                {tour.price} AZN
                <span className="text-[10px] font-normal text-[#9CA3AF]"> / nəfər</span>
              </p>
            </div>
          </div>
        </div>

        {/* Route stops */}
        <div>
          <h3
            className="font-bold text-[#1E1E1E] text-sm mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Marşrut dayanacaqları
          </h3>
          <div className="space-y-2">
            {stops.map((stop, i) => {
              const photo = stop.photos[0]?.url ?? "";
              const isLast = i === stops.length - 1;
              return (
                <div key={stop.id} className="flex gap-3">
                  {/* Timeline */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        background: tour.routeColor,
                        boxShadow: `0 3px 10px ${tour.routeColor}40`,
                      }}
                    >
                      {i + 1}
                    </div>
                    {!isLast && (
                      <div
                        className="w-px flex-1 mt-1"
                        style={{ background: `${tour.routeColor}30`, minHeight: 16 }}
                      />
                    )}
                  </div>

                  {/* Stop card */}
                  <div
                    className="flex-1 rounded-[16px] overflow-hidden flex mb-2"
                    style={{ background: "#F7F8F5", border: "1px solid #EEECEA" }}
                  >
                    <div className="flex-1 p-3 min-w-0">
                      <p className="font-semibold text-[#1E1E1E] text-sm leading-tight">
                        {stop.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <MapPin size={10} className="text-[#9CA3AF]" />
                        <span className="text-[11px] text-[#9CA3AF]">
                          {stop.village}, {stop.region}
                        </span>
                      </div>
                      {stop.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {stop.activities.slice(0, 2).map(a => (
                            <span
                              key={a}
                              className="text-[10px] px-2 py-0.5 rounded-full"
                              style={{
                                background: "#FFFFFF",
                                border: "1px solid #E5E5E0",
                                color: "#6B7280",
                              }}
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={stop.name}
                        className="w-[72px] object-cover flex-shrink-0"
                        style={{ borderRadius: "0 16px 16px 0" }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inclusions */}
        <div>
          <h3
            className="font-bold text-[#1E1E1E] text-sm mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Nə daxildir
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {["Nəqliyyat", "Bələdçi", "Gecələmə", "Sığorta"].map(item => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-[12px] px-3 py-2.5"
                style={{ background: "#F7F8F5" }}
              >
                <CheckCircle size={13} className="text-[#1F6B4F] flex-shrink-0" />
                <span className="text-xs text-[#1E1E1E] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        className="sticky bottom-0 p-5 mt-auto"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid #F0F0EC",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <span
              className="font-bold text-[#1E1E1E] text-2xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {tour.price}
            </span>
            <span className="text-[#6B7280] text-sm"> AZN</span>
            <span className="text-[#9CA3AF] text-xs"> / nəfər</span>
          </div>
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(214,167,95,0.12)" }}
          >
            <Star size={12} fill="#D6A75F" className="text-[#D6A75F]" />
            <span className="text-sm font-bold" style={{ color: "#B8843A" }}>{tour.rating}</span>
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full py-3.5 rounded-[18px] text-white font-semibold text-sm transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #D6A75F 0%, #C4903F 100%)",
            boxShadow: "0 6px 24px rgba(214,167,95,0.40)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(214,167,95,0.50)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(214,167,95,0.40)";
          }}
        >
          Bu turu seç
        </button>
      </div>
    </div>
  );
}
