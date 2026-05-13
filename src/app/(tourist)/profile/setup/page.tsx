"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

const steps = ["Məlumat", "Maraqlar", "Foto"];

const interests = [
  { id: "fishing", label: "Balıqçılıq", emoji: "🎣" },
  { id: "camping", label: "Kamp", emoji: "⛺" },
  { id: "harvest", label: "Meyvə Yığımı", emoji: "🍎" },
  { id: "horse", label: "At Minmə", emoji: "🐴" },
  { id: "food", label: "Kənd Yeməyi", emoji: "🍳" },
  { id: "wine", label: "Şərab Təcrübəsi", emoji: "🍇" },
  { id: "nature", label: "Təbiət", emoji: "🌿" },
  { id: "adventure", label: "Macəra", emoji: "🧗" },
];

export default function TouristProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleInterest = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <div className="max-w-xl mx-auto w-full px-6 pt-10 pb-6 flex-1">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                i === step ? "bg-accent text-white" : i < step ? "bg-accent/50 text-white" : "bg-primary-light text-muted"
              )}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={cn("text-sm hidden sm:block", i === step ? "text-text-dark font-semibold" : "text-muted")}>
                {label}
              </span>
              {i < steps.length - 1 && (
                <div className={cn("h-px w-8", i < step ? "bg-accent" : "bg-primary-light")} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card-hover border border-accent/10">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-text-light mb-4">Şəxsi Məlumatlar</h2>
              <Input placeholder="Ad Soyad" />
              <Input placeholder="İstifadəçi adı (@username)" />
              <Input type="tel" placeholder="+994 XX XXX XX XX" />
              <select className="w-full rounded-lg bg-primary-light text-text-dark px-4 py-3 text-sm border border-white/10 outline-none focus:border-accent">
                <option value="">Ölkə seçin</option>
                <option value="az">Azərbaycan</option>
                <option value="tr">Türkiyə</option>
                <option value="ru">Rusiya</option>
              </select>
              <select className="w-full rounded-lg bg-primary-light text-text-dark px-4 py-3 text-sm border border-white/10 outline-none focus:border-accent">
                <option value="az">Azərbaycan dili</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-text-light mb-2">Maraqlarınız</h2>
              <p className="text-muted text-sm mb-5">Sizə uyğun fəaliyyətləri seçin</p>
              <div className="grid grid-cols-2 gap-3">
                {interests.map(int => (
                  <button
                    key={int.id}
                    onClick={() => toggleInterest(int.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                      selected.includes(int.id)
                        ? "border-accent bg-accent/10 text-text-light"
                        : "border-primary/20 text-muted hover:border-accent/40"
                    )}
                  >
                    <span className="text-2xl">{int.emoji}</span>
                    <span className="text-sm font-medium">{int.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-text-light mb-2">Profil Fotosu</h2>
              <p className="text-muted text-sm mb-6">İstəyə bağlı</p>
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-accent/40 flex items-center justify-center bg-primary-light cursor-pointer hover:border-accent transition-colors">
                  <Upload size={28} className="text-muted" />
                </div>
                <p className="text-muted text-xs text-center">PNG, JPG — maks. 5MB</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-primary/10">
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 text-muted hover:text-accent text-sm">
                <ChevronLeft size={16} /> Geri
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {step < steps.length - 1 && (
                <button onClick={() => setStep(s => s + 1)} className="text-muted text-sm hover:text-accent">Keç</button>
              )}
              <Button variant="gradient" disabled={saving} onClick={async () => {
                if (step < steps.length - 1) { setStep(s => s + 1); return; }
                setSaving(true);
                await fetch("/api/tourist/profile", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ phone, country, interests: selected }),
                });
                router.push("/home");
              }}>
                {step < steps.length - 1 ? <>Davam et <ChevronRight size={16} /></> : saving ? "Saxlanılır..." : "Tamamla"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
