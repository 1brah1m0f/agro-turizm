import { Backpack, Trophy, MapPin, UtensilsCrossed, Users, Leaf, Compass, ShieldCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";

const features = [
  { icon: Backpack, title: "Həqiqi Təcrübə", desc: "Kənd həyatını birinci əldən, fermerlər ilə birgə öyrən." },
  { icon: Trophy, title: "Geymifikasiya", desc: "Hər fəaliyyət üçün qazanılan koinlər mükafatlara çevrilir." },
  { icon: MapPin, title: "İnteraktiv Xəritə", desc: "Azərbaycanın ən gözəl ferma nöqtələrini xəritədə kəşf et." },
  { icon: UtensilsCrossed, title: "Təmiz Qida", desc: "Öz əlinlə topladığın məhsullarla hazırlanmış yeməkləri dadımla." },
  { icon: Users, title: "İcma Ruhu", desc: "Digər aqroturizm həvəskarları ilə birlik qur, birlikdə gəz." },
  { icon: Leaf, title: "Eko-Davamlılıq", desc: "Yerli iqtisadiyyatı dəstəklə, ekoloji turizmi inkişaf etdir." },
  { icon: Compass, title: "Şəxsi Rəhbər", desc: "Hər səfərdə yerli ekspert kəndin gizli guşələrini sənə tanıdır." },
  { icon: ShieldCheck, title: "Təhlükəsiz Ödəniş", desc: "Bütün rezervasiyalar qorunan sistem ilə saxlanır." },
];

export default function WhyFarMorfX() {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="accent" className="mb-4">Üstünlüklər</Badge>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-dark">Niyə FarMorfX?</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card rounded-[16px] p-5 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 border border-accent/10">
              <div className="w-10 h-10 rounded-full bg-gradient-main flex items-center justify-center mb-4">
                <Icon size={18} className="text-white" />
              </div>
              <h3 className="font-semibold text-text-light text-sm mb-2">{title}</h3>
              <p className="text-muted text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
