"use client";

import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, CheckCircle, CreditCard, Coins, Smartphone } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const steps = ["Fəaliyyət", "Tarix", "Saat", "İştirakçı", "Ödəniş"];

const activities = [
  { emoji: "🍇", name: "Üzüm Yığımı", duration: "3 saat", price: 35 },
  { emoji: "🐴", name: "At Minmə", duration: "1 saat", price: 25 },
  { emoji: "🍯", name: "Bal Dadımı", duration: "45 dəq", price: 15 },
  { emoji: "⛺", name: "Kamp", duration: "1 gecə", price: 60 },
];

const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
const unavailableSlots = ["11:00", "14:00"];

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const paymentMethods = [
  { id: "card", icon: CreditCard, label: "Kart" },
  { id: "apple", icon: Smartphone, label: "Apple Pay" },
  { id: "coin", icon: Coins, label: "Koin" },
];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [participants, setParticipants] = useState(2);
  const [payMethod, setPayMethod] = useState("card");
  const [confirmed, setConfirmed] = useState(false);

  const activity = selectedActivity !== null ? activities[selectedActivity] : activities[0];
  const total = activity.price * participants;
  const deposit = Math.round(total * 0.3);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-main flex items-center justify-center mb-6 shadow-card-hover">
          <CheckCircle size={36} className="text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-text-dark mb-2">Bronlamanız Təsdiqləndi!</h1>
        <p className="text-muted mb-8">Qəbz e-poçtunuza göndərilib</p>

        <div className="bg-card rounded-2xl p-6 shadow-card-hover border border-accent/20 w-full max-w-sm mb-6">
          <div className="w-40 h-40 bg-primary-dark rounded-xl mx-auto mb-4 flex items-center justify-center text-6xl">
            🎟️
          </div>
          <div className="text-center mb-4">
            <p className="font-bold text-accent text-lg font-mono tracking-wider">FMX-2024-0042</p>
            <p className="text-muted text-xs">Bron kodu</p>
          </div>
          <div className="space-y-2 text-sm border-t border-primary/10 pt-4">
            <div className="flex justify-between"><span className="text-muted">Yer</span><span className="text-text-light font-medium">Şəki Üzüm Bağı</span></div>
            <div className="flex justify-between"><span className="text-muted">Tarix</span><span className="text-text-light font-medium">15 Noyabr 2024</span></div>
            <div className="flex justify-between"><span className="text-muted">Saat</span><span className="text-text-light font-medium">10:00</span></div>
            <div className="flex justify-between"><span className="text-muted">İştirakçı</span><span className="text-text-light font-medium">{participants} nəfər</span></div>
          </div>
        </div>

        <div className="flex gap-3 w-full max-w-sm">
          <button className="flex-1 border border-accent/30 rounded-xl py-3 text-accent text-sm font-semibold">Əsas Səhifə</button>
          <Button variant="gradient" className="flex-1">Bronlarım</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Top bar */}
      <div className="bg-primary-dark px-4 py-4 flex items-center gap-3 border-b border-accent/10">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : undefined} className="text-muted hover:text-accent">
          <ArrowLeft size={20} />
        </button>
        <span className="font-serif font-semibold text-text-dark flex-1">{steps[step]}</span>
        <span className="text-muted text-sm">{step + 1}/{steps.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-primary-dark">
        <div className="h-full bg-gradient-main transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>

      {/* Step content */}
      <div className="flex-1 p-4 overflow-y-auto">

        {/* Step 1: Activity */}
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {activities.map((act, i) => (
              <button key={i} onClick={() => setSelectedActivity(i)}
                className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 bg-card transition-all",
                  selectedActivity === i ? "border-accent bg-accent/5" : "border-primary/20 hover:border-accent/40")}>
                <span className="text-3xl">{act.emoji}</span>
                <span className="font-semibold text-text-light text-sm">{act.name}</span>
                <span className="text-muted text-xs">{act.duration}</span>
                <span className="text-accent font-bold text-sm">₼{act.price}/nəfər</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Date */}
        {step === 1 && (
          <div className="bg-card rounded-2xl p-4 border border-accent/10">
            <h3 className="font-semibold text-text-light mb-1 text-center">Noyabr 2024</h3>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["B", "B.e", "Ç.a", "Ç", "C.a", "C", "Ş"].map(d => (
                <span key={d} className="text-muted text-xs py-1">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map(d => (
                <button key={d} onClick={() => setSelectedDay(d)}
                  className={cn("h-9 rounded-full text-sm transition-all",
                    selectedDay === d ? "bg-accent text-white font-bold" :
                    d === 15 ? "border border-accent text-accent" :
                    "text-text-light hover:bg-primary/20")}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Time slot */}
        {step === 2 && (
          <div>
            <p className="text-muted text-sm mb-4">Mövcud vaxt seçin</p>
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map(slot => {
                const unavail = unavailableSlots.includes(slot);
                return (
                  <button key={slot} disabled={unavail} onClick={() => setSelectedSlot(slot)}
                    className={cn("py-3 rounded-xl text-sm font-medium border transition-all",
                      unavail ? "border-muted/10 text-muted/40 line-through cursor-not-allowed bg-primary/5" :
                      selectedSlot === slot ? "border-accent bg-accent text-white" :
                      "border-primary/20 text-text-light hover:border-accent/40 bg-card")}>
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Participants */}
        {step === 3 && (
          <div>
            <div className="bg-card rounded-2xl p-6 border border-accent/10 mb-4">
              <h3 className="font-semibold text-text-light mb-4 text-center">İştirakçı sayı</h3>
              <div className="flex items-center justify-center gap-8">
                <button onClick={() => setParticipants(p => Math.max(1, p - 1))}
                  className="w-12 h-12 rounded-full border-2 border-accent/40 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all">
                  <Minus size={20} />
                </button>
                <span className="font-serif font-bold text-5xl text-text-light">{participants}</span>
                <button onClick={() => setParticipants(p => Math.min(20, p + 1))}
                  className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white hover:brightness-110 transition-all">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 border border-accent/10 space-y-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>{participants} nəfər × ₼{activity.price}</span>
                <span className="text-text-light font-medium">₼{total}</span>
              </div>
              <div className="flex justify-between border-t border-primary/10 pt-3">
                <span className="text-muted">Depozit (30%)</span>
                <span className="text-accent font-bold">₼{deposit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Qalan məbləğ</span>
                <span className="text-text-light">₼{total - deposit} (yerə gəldikdə)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Payment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-4 border border-accent/10 text-sm space-y-2">
              <h3 className="font-semibold text-text-light mb-3">Sifariş xülasəsi</h3>
              {[
                ["Yer", "Şəki Üzüm Bağı"],
                ["Fəaliyyət", activity.name],
                ["Tarix", selectedDay ? `${selectedDay} Noyabr` : "—"],
                ["Saat", selectedSlot ?? "—"],
                ["İştirakçı", `${participants} nəfər`],
                ["Cəmi", `₼${total}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted">{k}</span>
                  <span className="text-text-light font-medium">{v}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-muted text-sm mb-3">Ödəniş üsulu</p>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map(({ id, icon: Icon, label }) => (
                  <button key={id} onClick={() => setPayMethod(id)}
                    className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 bg-card transition-all",
                      payMethod === id ? "border-accent bg-accent/10" : "border-primary/20 hover:border-accent/40")}>
                    <Icon size={22} className={payMethod === id ? "text-accent" : "text-muted"} />
                    <span className={cn("text-xs font-medium", payMethod === id ? "text-accent" : "text-muted")}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {payMethod === "card" && (
              <div className="space-y-3">
                <input className="w-full bg-primary-light text-text-dark rounded-lg px-4 py-3 text-sm border border-white/10 outline-none focus:border-accent placeholder-muted"
                  placeholder="Kart nömrəsi" />
                <div className="grid grid-cols-2 gap-3">
                  <input className="w-full bg-primary-light text-text-dark rounded-lg px-4 py-3 text-sm border border-white/10 outline-none focus:border-accent placeholder-muted"
                    placeholder="AA/İİ" />
                  <input className="w-full bg-primary-light text-text-dark rounded-lg px-4 py-3 text-sm border border-white/10 outline-none focus:border-accent placeholder-muted"
                    placeholder="CVV" />
                </div>
              </div>
            )}

            {payMethod === "coin" && (
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm">
                <p className="text-accent font-semibold">Balans: 1,248 KOİN = ₼12.48</p>
                <p className="text-muted mt-1">Qalan məbləğ: ₼{total - 12.48 > 0 ? (total - 12.48).toFixed(2) : 0} kart ilə</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="bg-primary-dark px-4 py-4 border-t border-accent/10 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 text-muted hover:text-accent text-sm">
            <ChevronLeft size={16} /> Geri
          </button>
        ) : <div />}

        <Button variant="gradient" size="lg"
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : setConfirmed(true)}>
          {step < steps.length - 1 ? <>Davam et <ChevronRight size={16} /></> : "Ödənişi tamamla"}
        </Button>
      </div>
    </div>
  );
}
