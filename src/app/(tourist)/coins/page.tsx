"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, TrendingUp, TrendingDown, Leaf, QrCode, Navigation, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const history = [
  { type: "earn", event: "Üzüm Yığımı tamamlandı", amount: 50, date: "Bu gün, 14:22" },
  { type: "earn", event: "QR kodu oxuduldu — Şəki Ferması", amount: 80, date: "Dünən, 11:05" },
  { type: "spend", event: "Bron endirimi istifadə edildi", amount: -120, date: "3 gün əvvəl" },
  { type: "earn", event: "Yeni fermada gəzinti — Quba", amount: 150, date: "5 gün əvvəl" },
  { type: "earn", event: "Rəy yazıldı", amount: 30, date: "1 həftə əvvəl" },
  { type: "earn", event: "Gündəlik giriş", amount: 10, date: "1 həftə əvvəl" },
];

const howToEarn = [
  { icon: Leaf, label: "Aktivlik tamamla", coins: "+50" },
  { icon: QrCode, label: "QR kod oxut", coins: "+80" },
  { icon: Navigation, label: "Yeni fermaya get", coins: "+150" },
  { icon: Star, label: "Rəy yaz", coins: "+30" },
];

interface Transaction {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export default function CoinsPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/api/coins")
      .then((r) => r.json())
      .then((data) => {
        setBalance(data?.coinBalance ?? 0);
        setTransactions(data?.transactions ?? []);
      });
  }, []);

  const thisMonth = transactions
    .filter((t) => {
      const d = new Date(t.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.amount > 0;
    })
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-primary pb-24">
      <div className="bg-primary-dark px-4 pt-5 pb-4 border-b border-accent/10">
        <h1 className="font-serif text-xl font-bold text-text-dark">Koin Balansım</h1>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Balance card */}
        <div className="bg-gradient-main rounded-2xl p-6 shadow-card-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Coins size={18} className="text-white/80" />
              <span className="text-white/70 text-sm">Ümumi balans</span>
            </div>
            <p className="font-serif font-bold text-5xl text-white mb-1">{balance.toLocaleString()}</p>
            <p className="text-white/70 text-sm">KOİN</p>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-white/80" />
              <span className="text-white/80 text-xs">Bu ay: <strong className="text-white">+{thisMonth} koin</strong></span>
            </div>
          </div>
        </div>

        {/* Redeem */}
        <div className="bg-card rounded-xl p-4 shadow-card border border-accent/10">
          <h2 className="font-semibold text-text-light mb-1 text-sm">Koinlər nə ilə dəyişilir?</h2>
          <p className="text-muted text-xs mb-3">100 koin = ₼1 endirim</p>
          <Button variant="gradient" className="w-full" onClick={() => router.push("/explore")}>Mağazaya Get →</Button>
        </div>

        {/* How to earn */}
        <div>
          <h2 className="font-semibold text-text-dark mb-3">Necə qazanmaq olar</h2>
          <div className="grid grid-cols-2 gap-3">
            {howToEarn.map(({ icon: Icon, label, coins }) => (
              <div key={label} className="bg-card rounded-xl p-4 border border-accent/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-main flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-text-light text-xs font-medium leading-tight">{label}</p>
                  <p className="text-accent text-sm font-bold">{coins}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {transactions.length > 0 && (
          <div>
            <h2 className="font-semibold text-text-dark mb-3">Tarix</h2>
            <div className="bg-card rounded-xl shadow-card border border-accent/10 overflow-hidden">
              {transactions.map((item, i) => (
                <div key={item.id} className={`flex items-center gap-3 px-4 py-3 ${i < transactions.length - 1 ? "border-b border-primary/10" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.amount > 0 ? "bg-accent/10" : "bg-red-500/10"
                  }`}>
                    {item.amount > 0
                      ? <TrendingUp size={14} className="text-accent" />
                      : <TrendingDown size={14} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-light text-xs font-medium truncate">{item.reason}</p>
                    <p className="text-muted text-[10px]">{new Date(item.createdAt).toLocaleDateString("az-AZ")}</p>
                  </div>
                  <span className={`text-sm font-bold flex-shrink-0 ${item.amount > 0 ? "text-accent" : "text-red-400"}`}>
                    {item.amount > 0 ? "+" : ""}{item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
