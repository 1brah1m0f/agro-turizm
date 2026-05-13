import Button from "@/components/ui/Button";

const stats = ["2024 — Qurulub", "12 Region", "Yerli Komanda"];

export default function AboutUs() {
  return (
    <section id="about" className="bg-primary py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-accent uppercase text-xs tracking-widest font-semibold mb-3">BİZ KİMİK?</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-dark mb-5">
            Kəndlərimizi Birlikdə Canlandırırıq
          </h2>
          <p className="text-muted text-base leading-[1.7] mb-6">
            FarMorfX Azərbaycan kəndlərinin əsl ruhunu turistlərə çatdıran rəqəmsal platformadır.
            Yerli fermerlər üçün yeni gəlir qapıları açır, dayanıqlı turizmi dəstəkləyir.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {stats.map(s => (
              <span key={s} className="px-4 py-2 rounded-full bg-primary-light text-text-dark text-sm font-medium border border-accent/20">
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="gradient">Bizimlə Əlaqə →</Button>
            <Button variant="ghost">Komandamıza Bax</Button>
          </div>
        </div>

        <div className="relative h-80 lg:h-96">
          <div className="absolute top-0 right-0 w-3/4 h-64 rounded-2xl bg-primary-light shadow-card-hover overflow-hidden border border-accent/20">
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">🏡</div>
          </div>
          <div className="absolute bottom-0 left-0 w-2/3 h-52 rounded-2xl bg-gradient-dark shadow-card-hover overflow-hidden border-4 border-primary border-accent/20">
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">👨‍🌾</div>
          </div>
          <div className="absolute bottom-12 right-0 w-44 bg-card rounded-xl p-4 shadow-card-hover z-10 border border-accent/10">
            <p className="font-serif italic text-text-light text-sm">"Hər kənd bir hekayədir."</p>
            <p className="text-muted text-xs mt-1">— FarMorfX Komandası</p>
          </div>
        </div>
      </div>
    </section>
  );
}
