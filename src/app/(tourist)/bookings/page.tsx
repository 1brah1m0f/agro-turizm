"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, CheckCircle, XCircle, AlertCircle, QrCode } from "lucide-react";
import Badge from "@/components/ui/Badge";
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

const statusConfig: Record<Status, { label: string; icon: typeof CheckCircle; badge: "accent" | "amber" | "red" | "default" }> = {
  CONFIRMED: { label: "Təsdiqləndi", icon: CheckCircle, badge: "accent" },
  PENDING: { label: "Gözlənilir", icon: AlertCircle, badge: "amber" },
  CANCELLED: { label: "Ləğv edildi", icon: XCircle, badge: "red" },
  COMPLETED: { label: "Tamamlandı", icon: CheckCircle, badge: "default" },
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
    <div className="min-h-screen bg-primary pb-24">
      <div className="bg-primary-dark px-4 pt-5 pb-4 sticky top-0 z-10 border-b border-accent/10">
        <h1 className="font-serif text-xl font-bold text-text-dark mb-3">Bronlarım</h1>
        <div className="flex gap-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={cn("flex-1 py-2 rounded-xl text-xs font-medium transition-all",
                activeTab === t ? "bg-accent text-white" : "text-muted hover:text-accent")}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <>
            {filtered.map(b => {
              const cfg = statusConfig[b.status];
              const Icon = cfg.icon;
              const dateStr = new Date(b.date).toLocaleDateString("az-AZ", { day: "numeric", month: "long", year: "numeric" });
              return (
                <div key={b.id} className="bg-card rounded-xl p-4 shadow-card border border-accent/10">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-dark flex items-center justify-center text-2xl flex-shrink-0">
                      🌿
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-text-light text-sm truncate">{b.placeName}</h3>
                        <Badge variant={cfg.badge} className="text-[10px] flex-shrink-0 gap-1">
                          <Icon size={10} /> {cfg.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted">
                        <span className="flex items-center gap-1"><Calendar size={11} /> {dateStr}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {b.address}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted font-mono">{b.qrCode.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {b.status === "CONFIRMED" && (
                    <div className="mt-3 pt-3 border-t border-primary/10 flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 bg-accent/10 border border-accent/30 rounded-lg py-2 text-accent text-xs font-semibold">
                        <QrCode size={13} /> QR Bilet
                      </button>
                      <button
                        disabled={cancelling === b.id}
                        onClick={() => cancel(b.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-red-500/30 rounded-lg py-2 text-red-400 text-xs font-semibold disabled:opacity-50">
                        <XCircle size={13} /> {cancelling === b.id ? "..." : "Ləğv et"}
                      </button>
                    </div>
                  )}
                  {b.status === "COMPLETED" && (
                    <div className="mt-3 pt-3 border-t border-primary/10">
                      <button onClick={() => router.push(`/reviews/${b.placeId}`)} className="w-full text-center text-xs text-accent hover:underline">Rəy yaz →</button>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-muted text-sm">Bu kateqoriyada bron yoxdur</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
