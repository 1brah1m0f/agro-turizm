import { Apple, Smartphone, Navigation, ChevronDown } from "lucide-react";
import Badge from "@/components/ui/Badge";
import PhoneMockup from "./PhoneMockup";

const rewards = [
  { icon: Apple, label: "Meyvə yığım aktivliyini tamamla", coins: "+50 KOİN" },
  { icon: Smartphone, label: "QR kodunu tərəfdaş yerdə oxut", coins: "+80 KOİN" },
  { icon: Navigation, label: "Yeni fermada gəzinti et", coins: "+150 KOİN" },
];

export default function HowToEarnCoins() {
  return (
    <section className="bg-primary-light py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-center">
        <div>
          <Badge variant="accent" className="mb-4">KOİN SİSTEMİ</Badge>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-dark mb-4">Necə Koin Qazanmalı?</h2>
          <p className="text-muted text-base leading-relaxed mb-8">
            FarMorfX-də kəşfiyyatın hər anı dəyərlidir. Aktiv iştirak et, koin yığ və onları xüsusi mükafatlar üçün istifadə et.
          </p>
          <div className="space-y-3 mb-6">
            {rewards.map(({ icon: Icon, label, coins }) => (
              <div key={label} className="flex items-center gap-3 bg-primary-dark rounded-2xl px-4 py-3 border border-accent/10">
                <div className="w-9 h-9 rounded-lg bg-gradient-main flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <span className="flex-1 text-text-dark text-sm">{label}</span>
                <Badge variant="accent" className="flex-shrink-0 text-[11px]">{coins}</Badge>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 text-accent text-sm font-semibold hover:underline">
            Koinləri nə ilə dəyişmək olar? <ChevronDown size={16} />
          </button>
        </div>
        <PhoneMockup />
      </div>
    </section>
  );
}
