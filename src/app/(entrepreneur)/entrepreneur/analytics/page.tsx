import { TrendingUp, TrendingDown, Users, Star } from "lucide-react";

const months = ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"];
const revenueData = [210, 285, 340, 420, 390, 580, 640, 720, 510, 680, 940, 1120];
const bookingData = [5, 7, 9, 11, 10, 16, 18, 20, 14, 19, 26, 31];

const kpis = [
  { label: "Aylıq Qazanc", value: "₼1 120", change: "+19%", up: true, icon: TrendingUp },
  { label: "Bronlar", value: "31", change: "+5", up: true, icon: Users },
  { label: "Orta Reytinq", value: "4.8", change: "+0.2", up: true, icon: Star },
  { label: "Ləğv edilmə", value: "6%", change: "-2%", up: true, icon: TrendingDown },
];

const topActivities = [
  { name: "Üzüm Yığımı Festivalı", bookings: 14, revenue: 630, percent: 100 },
  { name: "At Minmə Səyahəti", bookings: 9, revenue: 315, percent: 64 },
  { name: "Bal Dadımı Turu", bookings: 5, revenue: 150, percent: 36 },
  { name: "Dağ Kampı", bookings: 3, revenue: 120, percent: 21 },
];

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">Analitika</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, change, up, icon: Icon }) => (
          <div key={label} className="bg-card rounded-xl p-4 shadow-card border border-accent/10">
            <div className="flex items-center justify-between mb-2">
              <Icon size={16} className="text-accent" />
              <span className={`text-xs font-medium ${up ? "text-accent" : "text-red-400"}`}>{change}</span>
            </div>
            <p className="font-serif font-bold text-2xl text-text-light">{value}</p>
            <p className="text-muted text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-accent/10 mb-6">
        <h2 className="font-semibold text-text-light mb-4">İllik Qazanc (₼)</h2>
        <div className="flex items-end gap-1 h-44 mb-2">
          {revenueData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
              <div className="text-[10px] text-accent font-semibold">₼{val}</div>
              <div className="w-full rounded-t-sm bg-accent/10 relative overflow-hidden"
                style={{ height: `${maxRevenue > 0 ? Math.max(4, Math.round((val / maxRevenue) * 152)) : 0}px` }}>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-main rounded-t-sm" style={{ height: "70%" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {months.map(m => (
            <div key={m} className="flex-1 text-center text-[9px] text-muted">{m}</div>
          ))}
        </div>
      </div>

      {/* Top activities */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-accent/10 mb-6">
        <h2 className="font-semibold text-text-light mb-4">Ən Populyar Fəaliyyətlər</h2>
        <div className="space-y-4">
          {topActivities.map(act => (
            <div key={act.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-text-light text-sm font-medium">{act.name}</span>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{act.bookings} bron</span>
                  <span className="text-accent font-semibold">₼{act.revenue}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-primary-dark overflow-hidden">
                <div className="h-full rounded-full bg-gradient-main transition-all" style={{ width: `${act.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly bookings chart */}
      <div className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
        <h2 className="font-semibold text-text-light mb-4">Aylıq Bronlar</h2>
        <div className="flex items-end gap-1 h-32 mb-2">
          {bookingData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
              <div className="text-[10px] text-accent font-semibold">{val}</div>
              <div className="w-full rounded-t-sm bg-primary-dark/60 relative overflow-hidden"
                style={{ height: `${Math.max(...bookingData) > 0 ? Math.max(4, Math.round((val / Math.max(...bookingData)) * 104)) : 0}px` }}>
                <div className="absolute bottom-0 inset-x-0 bg-accent/60 rounded-t-sm" style={{ height: "60%" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {months.map(m => <div key={m} className="flex-1 text-center text-[9px] text-muted">{m}</div>)}
        </div>
      </div>
    </div>
  );
}
