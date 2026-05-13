import { TrendingUp, TrendingDown, Users, Star } from "lucide-react";

const months = ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"];
const revenueData = [120, 180, 150, 240, 200, 310, 280, 350, 290, 400, 840, 0];
const bookingData = [3, 5, 4, 7, 6, 9, 8, 10, 8, 12, 12, 0];

const kpis = [
  { label: "Aylıq Qazanc", value: "₼840", change: "+12%", up: true, icon: TrendingUp },
  { label: "Bronlar", value: "12", change: "+3", up: true, icon: Users },
  { label: "Orta Reytinq", value: "4.8", change: "+0.1", up: true, icon: Star },
  { label: "Ləğv edilmə", value: "8%", change: "-2%", up: true, icon: TrendingDown },
];

const topActivities = [
  { name: "Üzüm Yığımı", bookings: 7, revenue: 315, percent: 85 },
  { name: "At Minmə", bookings: 3, revenue: 105, percent: 35 },
  { name: "Bal Dadımı", bookings: 2, revenue: 30, percent: 20 },
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
        <div className="flex items-end gap-1 h-40 mb-2">
          {revenueData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-sm bg-accent/10 relative overflow-hidden"
                style={{ height: `${maxRevenue > 0 ? (val / maxRevenue) * 100 : 0}%`, minHeight: val > 0 ? "4px" : 0 }}>
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
        <div className="flex items-end gap-1 h-28 mb-2">
          {bookingData.map((val, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-primary-dark/60 relative overflow-hidden"
              style={{ height: `${Math.max(...bookingData) > 0 ? (val / Math.max(...bookingData)) * 100 : 0}%`, minHeight: val > 0 ? "4px" : 0 }}>
              <div className="absolute bottom-0 inset-x-0 bg-accent/60 rounded-t-sm" style={{ height: "60%" }} />
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
