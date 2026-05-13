"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, CalendarCheck, Star, MapPin, CheckCircle, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
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

const demoBookings: Booking[] = [
  // today — 3 bookings
  { id: "1",  touristName: "Aysel Məmmədova",  placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 0 * 86400000).toISOString(), timeSlot: "10:00", participantCount: 3, totalAmount: 135, status: "CONFIRMED" },
  { id: "2",  touristName: "Orxan Hüseynov",   placeName: "Bal Dadımı Turu",        date: new Date(Date.now() - 0 * 86400000).toISOString(), timeSlot: "14:00", participantCount: 2, totalAmount: 60,  status: "PENDING"   },
  { id: "3",  touristName: "Rəşad Quliyev",    placeName: "At Minmə Səyahəti",      date: new Date(Date.now() - 0 * 86400000).toISOString(), timeSlot: "16:00", participantCount: 1, totalAmount: 35,  status: "CONFIRMED" },
  // yesterday — 2 bookings
  { id: "4",  touristName: "Nigar Əliyeva",    placeName: "At Minmə Səyahəti",      date: new Date(Date.now() - 1 * 86400000).toISOString(), timeSlot: "09:00", participantCount: 4, totalAmount: 140, status: "COMPLETED"  },
  { id: "5",  touristName: "Leyla Abbasova",   placeName: "Bal Dadımı Turu",        date: new Date(Date.now() - 1 * 86400000).toISOString(), timeSlot: "15:00", participantCount: 1, totalAmount: 30,  status: "PENDING"   },
  // 2 days ago — 4 bookings
  { id: "6",  touristName: "Elnur Əhmədov",    placeName: "Dağ Kampı",              date: new Date(Date.now() - 2 * 86400000).toISOString(), timeSlot: "08:00", participantCount: 5, totalAmount: 200, status: "COMPLETED"  },
  { id: "7",  touristName: "Sevinc Nağıyeva",  placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 2 * 86400000).toISOString(), timeSlot: "10:00", participantCount: 2, totalAmount: 90,  status: "CONFIRMED" },
  { id: "8",  touristName: "Kamran Babayev",   placeName: "At Minmə Səyahəti",      date: new Date(Date.now() - 2 * 86400000).toISOString(), timeSlot: "13:00", participantCount: 3, totalAmount: 105, status: "CANCELLED"  },
  { id: "9",  touristName: "Günel Rzayeva",    placeName: "Bal Dadımı Turu",        date: new Date(Date.now() - 2 * 86400000).toISOString(), timeSlot: "15:00", participantCount: 1, totalAmount: 30,  status: "COMPLETED"  },
  // 3 days ago — 1 booking
  { id: "10", touristName: "Tural Əsgərov",    placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 3 * 86400000).toISOString(), timeSlot: "11:00", participantCount: 4, totalAmount: 180, status: "CONFIRMED" },
  // 4 days ago — 3 bookings
  { id: "11", touristName: "Vüsal Nəsirov",    placeName: "Dağ Kampı",              date: new Date(Date.now() - 4 * 86400000).toISOString(), timeSlot: "09:00", participantCount: 2, totalAmount: 80,  status: "COMPLETED"  },
  { id: "12", touristName: "Xədicə Hümbətova", placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 4 * 86400000).toISOString(), timeSlot: "11:00", participantCount: 3, totalAmount: 135, status: "CONFIRMED" },
  { id: "13", touristName: "Fərid Məmmədov",   placeName: "Bal Dadımı Turu",        date: new Date(Date.now() - 4 * 86400000).toISOString(), timeSlot: "14:00", participantCount: 2, totalAmount: 60,  status: "PENDING"   },
  // 5 days ago — 5 bookings
  { id: "14", touristName: "Aytən Qasımova",   placeName: "At Minmə Səyahəti",      date: new Date(Date.now() - 5 * 86400000).toISOString(), timeSlot: "08:00", participantCount: 3, totalAmount: 105, status: "COMPLETED"  },
  { id: "15", touristName: "Bəhruz Əlizadə",   placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 5 * 86400000).toISOString(), timeSlot: "10:00", participantCount: 2, totalAmount: 90,  status: "CONFIRMED" },
  { id: "16", touristName: "Cavid Rəhimov",    placeName: "Dağ Kampı",              date: new Date(Date.now() - 5 * 86400000).toISOString(), timeSlot: "12:00", participantCount: 4, totalAmount: 160, status: "COMPLETED"  },
  { id: "17", touristName: "Dilnoza Həsənova", placeName: "Bal Dadımı Turu",        date: new Date(Date.now() - 5 * 86400000).toISOString(), timeSlot: "14:00", participantCount: 1, totalAmount: 30,  status: "CONFIRMED" },
  { id: "18", touristName: "Emil Musayev",     placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 5 * 86400000).toISOString(), timeSlot: "16:00", participantCount: 2, totalAmount: 90,  status: "PENDING"   },
  // 6 days ago — 2 bookings
  { id: "19", touristName: "Fidan Xəlilova",   placeName: "At Minmə Səyahəti",      date: new Date(Date.now() - 6 * 86400000).toISOString(), timeSlot: "10:00", participantCount: 2, totalAmount: 70,  status: "COMPLETED"  },
  { id: "20", touristName: "Gülnar Əhmədova",  placeName: "Üzüm Yığımı Festivalı", date: new Date(Date.now() - 6 * 86400000).toISOString(), timeSlot: "13:00", participantCount: 3, totalAmount: 135, status: "CONFIRMED" },
];

const demoPlaces: Place[] = [
  { id: "1", status: "APPROVED", avgRating: 4.8, reviewCount: 23, bookingCount: 42 },
  { id: "2", status: "APPROVED", avgRating: 4.6, reviewCount: 15, bookingCount: 28 },
  { id: "3", status: "PENDING", avgRating: 0, reviewCount: 0, bookingCount: 0 },
];

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
      setBookings(Array.isArray(b) && b.length > 0 ? b : demoBookings);
      setPlaces(Array.isArray(p) && p.length > 0 ? p : demoPlaces);
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

  const weekCounts = barLabels.map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    return bookings.filter((b) => new Date(b.date).toDateString() === day.toDateString()).length;
  });
  const maxCount = Math.max(...weekCounts, 1);

  return (
    <div className="p-6 pt-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl font-bold text-text-dark">İdarə Paneli</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <>
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-text-light mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-accent" />
              Ümumi Statistika
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-card rounded-xl p-5 shadow-card border border-accent/10 transition-transform hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <p className="font-serif font-bold text-3xl text-text-light mb-1">{value}</p>
                  <p className="text-muted text-xs font-medium uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-card border border-accent/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-text-light text-lg">Həftəlik Bron Analitikası</h2>
                <Badge variant="accent" className="text-[10px]">Canlı</Badge>
              </div>
              <div className="flex gap-2 items-end h-36">
                {weekCounts.map((count, i) => {
                  const h = count > 0 ? Math.max(6, Math.round((count / maxCount) * 110)) : 3;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                      <div className="text-[10px] text-accent font-bold">{count}</div>
                      <div className="w-full rounded-t-md bg-accent/15 relative overflow-hidden transition-all hover:bg-accent/20" style={{ height: `${h}px` }}>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-main rounded-t-md" style={{ height: "60%" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-3">
                {barLabels.map((label, i) => (
                  <div key={i} className="flex-1 text-center text-[11px] text-muted font-medium">{label}</div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-card border border-accent/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-text-light text-lg">Son Rezervasiyalar</h2>
                <button onClick={() => router.push("/entrepreneur/bookings")} className="text-accent text-xs font-semibold hover:underline flex items-center gap-1">Hamısı →</button>
              </div>
              {recentBookings.length === 0 ? (
                <p className="text-muted text-sm text-center py-10">Hələ bron yoxdur</p>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((b) => (
                    <div key={b.id} className="flex items-center gap-4 py-3 border-b border-primary/10 last:border-0 transition-colors hover:bg-primary/5 px-2 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-main flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
                        {b.touristName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-light text-sm font-bold truncate">{b.touristName}</p>
                        <p className="text-muted text-xs">{new Date(b.date).toLocaleDateString("az-AZ")} · {b.timeSlot}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-accent text-sm font-bold">₼{b.totalAmount}</p>
                        {b.status === "CONFIRMED"
                          ? <Badge variant="accent" className="text-[9px] gap-0.5 font-bold"><CheckCircle size={8} /> Təsdiqləndi</Badge>
                          : b.status === "PENDING"
                          ? <Badge variant="amber" className="text-[9px] gap-0.5 font-bold"><Clock size={8} /> Gözlənilir</Badge>
                          : <Badge variant="default" className="text-[9px] font-bold">{b.status}</Badge>}
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
