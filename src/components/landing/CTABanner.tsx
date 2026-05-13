import { Lock } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-24 bg-gradient-main relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-5">
          Kəşfi Bu Gün Başlat
        </h2>
        <p className="text-white/80 text-lg mb-8">
          Pulsuz qeydiyyat ol. İlk fəaliyyətin üçün 100 bonus koin qazan.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button className="px-8 py-4 rounded-full bg-white text-primary-dark font-bold text-lg hover:scale-[1.03] hover:brightness-105 transition-all shadow-card">
            Qeydiyyatdan keç
          </button>
          <button className="px-8 py-4 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all">
            Daha çox öyrən
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
          <Lock size={14} /> Heç bir kredit kartı tələb olunmur
        </div>
      </div>
    </section>
  );
}
