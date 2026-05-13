"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Phone } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

interface Booking {
  id: string;
  touristName: string;
  placeName: string;
  date: string;
  timeSlot: string;
  participantCount: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

const tabs = ["Hamısı", "Gözlənilir", "Təsdiqlənmiş", "Tamamlanmış"];

const demoBookings: Booking[] = [
  { id: "1", touristName: "Aysel Məmmədova", placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 0 * 86400000).toISOString(), timeSlot: "10:00", participantCount: 3, totalAmount: 135, status: "CONFIRMED" },
  { id: "2", touristName: "Orxan Hüseynov", placeName: "Bal Dadımı Turu", date: new Date(Date.now() - 1 * 86400000).toISOString(), timeSlot: "14:00", participantCount: 2, totalAmount: 60, status: "PENDING" },
  { id: "3", touristName: "Nigar Əliyeva", placeName: "At Minmə Səyahəti", date: new Date(Date.now() - 2 * 86400000).toISOString(), timeSlot: "09:00", participantCount: 4, totalAmount: 140, status: "COMPLETED" },
  { id: "4", touristName: "Rəşad Quliyev", placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 3 * 86400000).toISOString(), timeSlot: "11:00", participantCount: 2, totalAmount: 90, status: "CONFIRMED" },
  { id: "5", touristName: "Leyla Abbasova", placeName: "Bal Dadımı Turu", date: new Date(Date.now() - 4 * 86400000).toISOString(), timeSlot: "15:00", participantCount: 1, totalAmount: 30, status: "PENDING" },
  { id: "6", touristName: "Elnur Əhmədov", placeName: "Dağ Kampı", date: new Date(Date.now() - 5 * 86400000).toISOString(), timeSlot: "08:00", participantCount: 5, totalAmount: 200, status: "COMPLETED" },
  { id: "7", touristName: "Sevinc Nağıyeva", placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 6 * 86400000).toISOString(), timeSlot: "10:00", participantCount: 2, totalAmount: 90, status: "CONFIRMED" },
  { id: "8", touristName: "Kamran Babayev", placeName: "At Minmə Səyahəti", date: new Date(Date.now() - 7 * 86400000).toISOString(), timeSlot: "13:00", participantCount: 3, totalAmount: 105, status: "CANCELLED" },
  { id: "9", touristName: "Günel Rzayeva", placeName: "Dağ Kampı", date: new Date(Date.now() - 8 * 86400000).toISOString(), timeSlot: "09:00", participantCount: 2, totalAmount: 80, status: "COMPLETED" },
  { id: "10", touristName: "Tural Əsgərov", placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 9 * 86400000).toISOString(), timeSlot: "11:00", participantCount: 4, totalAmount: 180, status: "PENDING" },
];

const statusBadge: Record<string, "amber" | "accent" | "default" | "red"> = {
  PENDING: "amber", CONFIRMED: "accent", COMPLETED: "default", CANCELLED: "red",
};
const statusLabel: Record<string, string> = {
  PENDING: "Gözlənilir", CONFIRMED: "Təsdiqləndi", COMPLETED: "Tamamlandı", CANCELLED: "Ləğv edildi",
};

export default function EntrepreneurBookingsPage() {
  const [activeTab, setActiveTab] = useState("Hamısı");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(Array.isArray(data) && data.length > 0 ? data : demoBookings))
      .finally(() => setLoading(false));
  }, []);

  const act = async (id: string, action: "confirm" | "scan" | "reject") => {
    setActing(id);
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      const newStatus = action === "confirm" ? "CONFIRMED" : action === "reject" ? "CANCELLED" : "COMPLETED";
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus as Booking["status"] } : b));
    }
    setActing(null);
  };

  const filtered = bookings.filter(b => {
    if (activeTab === "Gözlənilir") return b.status === "PENDING";
    if (activeTab === "Təsdiqlənmiş") return b.status === "CONFIRMED";
    if (activeTab === "Tamamlanmış") return b.status === "COMPLETED";
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">Bronlar</h1>

      <div className="flex gap-1 mb-6 bg-primary-dark rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === t ? "bg-accent text-white" : "text-muted hover:text-accent")}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-muted">Bu kateqoriyada bron yoxdur</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div>
                  <h3 className="font-semibold text-text-light">{b.touristName}</h3>
                  <p className="text-muted text-sm">{b.placeName}</p>
                </div>
                <Badge variant={statusBadge[b.status]} className="text-xs">
                  {statusLabel[b.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs text-muted mb-4">
                <div>
                  <p className="text-text-light font-medium">{new Date(b.date).toLocaleDateString("az-AZ")}</p>
                  <p>Tarix</p>
                </div>
                <div>
                  <p className="text-text-light font-medium">{b.timeSlot}</p>
                  <p>Saat</p>
                </div>
                <div>
                  <p className="text-text-light font-medium">{b.participantCount} nəfər</p>
                  <p>İştirakçı</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                <span className="font-bold text-accent text-lg">₼{b.totalAmount}</span>
                <div className="flex gap-2">
                  {b.status === "PENDING" && (
                    <>
                      <button
                        disabled={acting === b.id}
                        onClick={() => act(b.id, "confirm")}
                        className="flex items-center gap-1.5 text-xs text-green-400 border border-green-500/30 rounded-lg px-3 py-2 hover:bg-green-500/5 transition-colors disabled:opacity-50">
                        <CheckCircle size={13} /> {acting === b.id ? "..." : "Təsdiqlə"}
                      </button>
                      <button
                        disabled={acting === b.id}
                        onClick={() => act(b.id, "reject")}
                        className="flex items-center gap-1.5 text-xs text-red-400 border border-red-500/30 rounded-lg px-3 py-2 hover:bg-red-500/5 transition-colors disabled:opacity-50">
                        <XCircle size={13} /> Rədd et
                      </button>
                    </>
                  )}
                  <button className="flex items-center gap-1.5 text-xs text-muted border border-muted/20 rounded-lg px-3 py-2 hover:border-accent/40 hover:text-accent transition-colors">
                    <Phone size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
