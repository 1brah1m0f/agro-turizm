import { Users, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const metrics = [
  { icon: Users, label: "Yeni sahibkar müraciətləri", value: "12", badge: "Bu həftə", color: "text-accent" },
  { icon: MapPin, label: "Yoxlanma gözləyən məkanlar", value: "7", badge: "Gözlənilir", color: "text-amber-400" },
  { icon: AlertTriangle, label: "Bu həftəki şikayətlər", value: "3", badge: "Aktiv", color: "text-red-400" },
  { icon: CheckCircle, label: "Aktiv hesablar", value: "1,247", badge: "Cəmi", color: "text-green-400" },
];

const recentActivity = [
  { time: "09:14", action: "Yeni sahibkar qeydiyyatı", entity: "Elçin Həsənov", type: "new" },
  { time: "08:52", action: "Məkan təsdiqləndi", entity: "Quba Meyvə Bağı", type: "approved" },
  { time: "08:30", action: "Şikayət daxil oldu", entity: "Ferma #142", type: "report" },
  { time: "07:55", action: "Rəy silindi (spam)", entity: "Nigar Ə.", type: "deleted" },
  { time: "07:20", action: "Hesab doğrulandı", entity: "Rauf M.", type: "approved" },
];

const typeColors: Record<string, string> = {
  new: "text-accent",
  approved: "text-green-400",
  report: "text-red-400",
  deleted: "text-amber-400",
};

export default function AdminDashboard() {
  return (
    <div className="p-6 pt-16 max-w-7xl mx-auto">
      <h1 className="font-serif text-3xl font-bold text-text-dark mb-10">İdarə Paneli</h1>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-text-light mb-4 flex items-center gap-2">
          <Users size={20} className="text-accent" />
          Sistem Metrikaları
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(({ icon: Icon, label, value, badge, color }) => (
            <div key={label} className="bg-card rounded-xl p-5 shadow-card border border-accent/10 transition-transform hover:scale-105">
              <div className="flex items-start justify-between mb-3">
                <Icon size={20} className={color} />
                <Badge variant="default" className="text-[10px] font-bold">{badge}</Badge>
              </div>
              <p className={`font-serif font-bold text-3xl mb-1 ${color}`}>{value}</p>
              <p className="text-muted text-xs font-medium uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-xl p-6 shadow-card border border-accent/10">
          <h2 className="font-bold text-text-light text-lg mb-6">Son Sistem Fəaliyyətləri</h2>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-primary/10 last:border-0 transition-colors hover:bg-primary/5 px-2 rounded-lg">
                <span className="text-muted text-xs w-12 flex-shrink-0 mt-0.5 font-medium">{item.time}</span>
                <div className="flex-1">
                  <p className="text-text-light text-sm font-medium">{item.action}</p>
                  <p className={`text-xs font-bold ${typeColors[item.type]}`}>{item.entity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card border border-accent/10">
          <h2 className="font-bold text-text-light text-lg mb-6">Sürətli Administrasiya</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-accent/10 transition-all hover:bg-primary/20">
              <div className="flex gap-3">
                <div className="w-1 h-10 bg-accent rounded-full" />
                <div>
                  <p className="text-text-light text-sm font-bold">Doğrulama Növbəsi</p>
                  <p className="text-muted text-xs font-medium">12 gözləyən müraciət</p>
                </div>
              </div>
              <Button variant="gradient" size="sm" className="font-bold">Bax</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-accent/10 transition-all hover:bg-primary/20">
              <div className="flex gap-3">
                <div className="w-1 h-10 bg-accent rounded-full" />
                <div>
                  <p className="text-text-light text-sm font-bold">Məkan Təsdiqləri</p>
                  <p className="text-muted text-xs font-medium">7 gözləyən məkan</p>
                </div>
              </div>
              <Button variant="gradient" size="sm" className="font-bold">Bax</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 transition-all hover:bg-amber-500/20">
              <div className="flex gap-3">
                <div className="w-1 h-10 bg-amber-500 rounded-full" />
                <div>
                  <p className="text-text-light text-sm font-bold">Aktiv Şikayətlər</p>
                  <p className="text-amber-400 text-xs font-medium">3 şikayət həll gözləyir</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 hover:bg-amber-500/30 transition-colors">Bax</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
