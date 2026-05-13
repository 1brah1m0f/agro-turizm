"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

type Status = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";

interface Booking {
  id: string;
  placeId: string;
  placeName: string;
  address: string;
  date: string;
  status: Status;
  qrCode: string;
}

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  CONFIRMED: { label: "Təsdiqləndi", icon: CheckCircle, color: "#1F6B4F", bg: "rgba(31,107,79,0.1)" },
  PENDING:   { label: "Gözlənilir", icon: AlertCircle, color: "#D6A75F", bg: "rgba(214,167,95,0.12)" },
  CANCELLED: { label: "Ləğv edildi", icon: XCircle,    color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  COMPLETED: { label: "Tamamlandı", icon: CheckCircle, color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
};

const tabs = ["Hamısı", "Aktiv", "Gözlənilir", "Tamamlanmış"];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("Hamısı");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id: string) => {
    setCancelling(id);
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    if (res.ok) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "CANCELLED" } : b));
    }
    setCancelling(null);
  };

  const filtered = bookings.filter(b => {
    if (activeTab === "Aktiv") return b.status === "CONFIRMED";
    if (activeTab === "Gözlənilir") return b.status === "PENDING";
    if (activeTab === "Tamamlanmış") return b.status === "COMPLETED" || b.status === "CANCELLED";
    return true;
  });

  return (
    <div className="h-full overflow-y-auto"><div className="px-6 pt-8 pb-10" style={{ background: "#F7F8F5", minHeight: "100%" }}>

      <h1
        className="text-[22px] font-bold text-[#1E1E1E] mb-5"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Bronlarım
      </h1>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-[14px] w-fit"
        style={{ background: "rgba(31,107,79,0.06)" }}
      >
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "px-4 py-2 rounded-[10px] text-xs font-semibold transition-all",
              activeTab === t ? "text-white" : "text-[#6B7280] hover:text-[#1F6B4F]",
            )}
            style={activeTab === t ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" } : {}}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => {
            const cfg = statusConfig[b.status];
            const Icon = cfg.icon;
            const dateStr = new Date(b.date).toLocaleDateString("az-AZ", { day: "numeric", month: "long", year: "numeric" });
            return (
              <div
                key={b.id}
                className="rounded-[16px] p-4"
                style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-14 h-14 rounded-[14px] flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#d1fae5,#6ee7b7)" }}
                  >
                    🌿
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-[#1E1E1E] text-sm truncate">{b.placeName}</h3>
                      <span
                        className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        <Icon size={9} /> {cfg.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {b.address}</span>
                    </div>
                    <div className="mt-1.5">
                      <span className="text-[11px] text-[#9CA3AF] font-mono">{b.qrCode.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {b.status === "CONFIRMED" && (
                  <div
                    className="mt-3 pt-3 flex gap-2"
                    style={{ borderTop: "1px solid rgba(31,107,79,0.08)" }}
                  >
                    <button
                      disabled={cancelling === b.id}
                      onClick={() => cancel(b.id)}
                      className="flex-1 py-2 rounded-[10px] text-xs font-semibold transition-all hover:opacity-80"
                      style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}
                    >
                      {cancelling === b.id ? "..." : "Ləğv et"}
                    </button>
                  </div>
                )}
                {b.status === "COMPLETED" && (
                  <div
                    className="mt-3 pt-3"
                    style={{ borderTop: "1px solid rgba(31,107,79,0.08)" }}
                  >
                    <button
                      onClick={() => router.push(`/reviews/${b.placeId}`)}
                      className="w-full text-center text-xs text-[#1F6B4F] font-semibold hover:opacity-70 transition-opacity"
                    >
                      Rəy yaz →
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-[#6B7280] text-sm">Bu kateqoriyada bron yoxdur</p>
            </div>
          )}
        </div>
      )}
    </div></div>
  );
}
