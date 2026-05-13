import { Map, ListTodo, ShoppingBag, BarChart2, Leaf, QrCode } from "lucide-react";

const quickActions = [
  { icon: Map, label: "Xəritə" },
  { icon: ListTodo, label: "Tapşırıqlar" },
  { icon: ShoppingBag, label: "Mağaza" },
  { icon: BarChart2, label: "Statistika" },
];

export default function PhoneMockup() {
  return (
    <div className="relative flex justify-center">
      <div className="absolute inset-0 bg-accent/10 rounded-full blur-3xl" />
      <div className="relative w-[270px] bg-primary-dark rounded-[40px] p-3 shadow-card-hover border border-accent/20">
        <div className="bg-card rounded-[32px] overflow-hidden min-h-[500px] p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted font-semibold">Günlük Araşdırma</p>
          </div>

          <div className="h-1.5 rounded-full bg-primary-light/20 overflow-hidden">
            <div className="h-full w-[70%] rounded-full bg-gradient-main" />
          </div>

          <div className="text-center py-2">
            <p className="font-serif font-bold text-4xl text-text-light">1,248</p>
            <p className="text-accent font-semibold text-sm">KOİN</p>
            <p className="text-muted text-xs mt-1">Bu ay yığılan koin</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ icon: Icon, label }) => (
              <div key={label} className="bg-primary/10 rounded-xl p-3 flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Icon size={14} className="text-accent" />
                </div>
                <span className="text-[10px] text-text-light font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-auto">
            <button className="flex-1 flex items-center justify-center gap-2 border border-accent/40 rounded-xl py-2.5 text-accent text-xs font-semibold">
              <Leaf size={14} /> Kəşf Et
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-accent/40 rounded-xl py-2.5 text-accent text-xs font-semibold">
              <QrCode size={14} /> QR Oxut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
