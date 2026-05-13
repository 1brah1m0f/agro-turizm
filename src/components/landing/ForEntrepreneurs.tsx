import { CheckCircle, TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";

const benefits = [
  "Pulsuz qeydiyyat və profil yaratma",
  "Bronlamaları asanlıqla idarə et",
  "Aylıq ətraflı analitika hesabatları",
  "Azərbaycanın aktiv turist kütləsinə çatın",
];

const metrics = [
  { value: "12", label: "Bron" },
  { value: "₼840", label: "Bu ay" },
  { value: "4.8 ★", label: "Reytinq" },
];

export default function ForEntrepreneurs() {
  return (
    <section id="entrepreneurs" className="bg-primary-light py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-accent uppercase text-xs tracking-widest font-semibold mb-3">SAHİBKARLAR ÜÇÜN</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-dark mb-6">
            Fermanızı Platformaya Qoşun
          </h2>
          <ul className="space-y-4 mb-8">
            {benefits.map(b => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-text-dark">{b}</span>
              </li>
            ))}
          </ul>
          <Button size="lg" variant="gradient" className="mb-4">Sahibkar Kimi Qoşul →</Button>
          <p className="text-muted text-sm">Artıq 84+ sertifikatlı ferma platformadadır</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-3xl" />
          <div className="relative bg-card rounded-2xl p-6 shadow-card-hover border border-accent/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-text-light font-serif">Ferma Paneli</h3>
              <div className="w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center text-white text-xs font-bold">F</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {metrics.map(m => (
                <div key={m.label} className="bg-primary/10 rounded-xl p-3 text-center border border-accent/10">
                  <p className="font-bold text-accent font-serif text-lg">{m.value}</p>
                  <p className="text-muted text-xs">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="mb-5">
              <p className="text-muted text-xs mb-3 uppercase tracking-wider">Aylıq Bronlar</p>
              <div className="flex items-end gap-2 h-20">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-accent/10 relative overflow-hidden">
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-main rounded-t-sm" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-accent text-sm font-semibold hover:underline">
              <TrendingUp size={14} /> Hesabat Bax →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
