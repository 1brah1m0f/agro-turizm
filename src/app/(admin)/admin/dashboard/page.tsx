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
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">İdarə Paneli</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map(({ icon: Icon, label, value, badge, color }) => (
          <div key={label} className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
            <div className="flex items-start justify-between mb-3">
              <Icon size={20} className={color} />
              <Badge variant="default" className="text-[10px]">{badge}</Badge>
            </div>
            <p className={`font-serif font-bold text-3xl mb-1 ${color}`}>{value}</p>
            <p className="text-muted text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
          <h2 className="font-semibold text-text-light mb-4">Son Fəaliyyətlər</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-primary/10 last:border-0">
                <span className="text-muted text-xs w-12 flex-shrink-0 mt-0.5">{item.time}</span>
                <div className="flex-1">
                  <p className="text-text-light text-sm">{item.action}</p>
                  <p className={`text-xs ${typeColors[item.type]}`}>{item.entity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
          <h2 className="font-semibold text-text-light mb-4">Sürətli Keçidlər</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-accent/10">
              <div>
                <p className="text-text-light text-sm font-medium">Doğrulama Növbəsi</p>
                <p className="text-muted text-xs">12 gözləyən müraciət</p>
              </div>
              <Button variant="gradient" size="sm">Bax</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-accent/10">
              <div>
                <p className="text-text-light text-sm font-medium">Məkan Təsdiqləri</p>
                <p className="text-muted text-xs">7 gözləyən məkan</p>
              </div>
              <Button variant="gradient" size="sm">Bax</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div>
                <p className="text-text-light text-sm font-medium">Aktiv Şikayətlər</p>
                <p className="text-amber-400 text-xs">3 şikayət həll gözləyir</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">Bax</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
