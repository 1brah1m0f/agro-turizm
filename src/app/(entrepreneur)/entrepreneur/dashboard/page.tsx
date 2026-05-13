"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, CalendarCheck, Star, MapPin, QrCode, CheckCircle, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

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

interface Place {
  id: string;
  status: string;
  avgRating: number;
  reviewCount: number;
  bookingCount: number;
}

const barLabels = ["B", "B.e", "Ç.a", "Ç", "C.a", "C", "Ş"];

export default function EntrepreneurDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/entrepreneur/places").then((r) => r.json()),
    ]).then(([b, p]) => {
      setBookings(Array.isArray(b) ? b : []);
      setPlaces(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  }, []);

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthBookings = bookings.filter((b) => {
    const d = new Date(b.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthRevenue = monthBookings.reduce((s, b) => s + (b.totalAmount ?? 0), 0);
  const activePlaces = places.filter((p) => p.status === "APPROVED").length;
  const allRatings = places.flatMap((p) => p.avgRating > 0 ? [p.avgRating] : []);
  const avgRating = allRatings.length ? (allRatings.reduce((s, r) => s + r, 0) / allRatings.length).toFixed(1) : "—";

  const metrics = [
    { icon: CalendarCheck, label: "Bu ay bronlar", value: String(monthBookings.length) },
    { icon: TrendingUp, label: "Bu ay qazanc", value: `₼${monthRevenue.toFixed(0)}` },
    { icon: MapPin, label: "Aktiv məkanlar", value: String(activePlaces) },
    { icon: Star, label: "Ortalama reytinq", value: avgRating },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-text-dark">İdarə Paneli</h1>
        <Button variant="gradient" size="sm" onClick={() => router.push("/entrepreneur/bookings")}>
          <QrCode size={14} /> QR Skan
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-card rounded-xl p-4 shadow-card border border-accent/10">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className="text-accent" />
                </div>
                <p className="font-serif font-bold text-2xl text-text-light mb-0.5">{value}</p>
                <p className="text-muted text-xs">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
              <h2 className="font-semibold text-text-light mb-4">Həftəlik Bronlar</h2>
              <div className="flex items-end gap-2 h-32 mb-2">
                {barLabels.map((label, i) => {
                  const day = new Date();
                  day.setDate(day.getDate() - (6 - i));
                  const dayBookings = bookings.filter((b) => {
                    const d = new Date(b.date);
                    return d.toDateString() === day.toDateString();
                  }).length;
                  const maxDay = 5;
                  const h = dayBookings > 0 ? Math.max(10, (dayBookings / maxDay) * 100) : 5;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-md bg-accent/15 relative overflow-hidden" style={{ height: `${h}%` }}>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-main rounded-t-md" style={{ height: "60%" }} />
                      </div>
                      <span className="text-[10px] text-muted">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-light">Son Bronlar</h2>
                <button onClick={() => router.push("/entrepreneur/bookings")} className="text-accent text-xs hover:underline">Hamısı →</button>
              </div>
              {recentBookings.length === 0 ? (
                <p className="text-muted text-sm text-center py-6">Hələ bron yoxdur</p>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((b) => (
                    <div key={b.id} className="flex items-center gap-3 py-2 border-b border-primary/10 last:border-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-main flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {b.touristName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-light text-sm font-medium truncate">{b.touristName}</p>
                        <p className="text-muted text-xs">{new Date(b.date).toLocaleDateString("az-AZ")} · {b.timeSlot}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-accent text-sm font-bold">₼{b.totalAmount}</p>
                        {b.status === "CONFIRMED"
                          ? <Badge variant="accent" className="text-[9px] gap-0.5"><CheckCircle size={8} /> Təsdiqləndi</Badge>
                          : b.status === "PENDING"
                          ? <Badge variant="amber" className="text-[9px] gap-0.5"><Clock size={8} /> Gözlənilir</Badge>
                          : <Badge variant="default" className="text-[9px]">{b.status}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
