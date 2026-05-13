"use client";

import { useEffect, useState } from "react";
import { Coins, Gift, Trophy, ChevronRight, CheckCircle, Lock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

interface Reward {
  id: string;
  name: string;
  description: string;
  emoji: string;
  coins: number;
  category: string;
  rarity: "common" | "rare" | "epic";
}

const REWARDS: Reward[] = [
  { id: "pakhlava",   name: "Paklava Qutusu",       description: "Xüsusi hazırlanmış paklava — 12 ədəd",        emoji: "🍬", coins: 250,  category: "Şirniyyat", rarity: "common" },
  { id: "halva",      name: "Şəki Halvası",          description: "Əl işi Şəki halvası — 500q",                  emoji: "🍯", coins: 300,  category: "Yemək",     rarity: "common" },
  { id: "pomegranate",name: "Nar Suyu Paketi",       description: "Təbii sıxılmış nar suyu 3×500ml",             emoji: "🧃", coins: 350,  category: "İçki",      rarity: "common" },
  { id: "honey",      name: "Yerli Arı Balı",        description: "Qax meşə balı — 250q",                        emoji: "🫙", coins: 400,  category: "Yemək",     rarity: "common" },
  { id: "grape_juice",name: "Qəbələ Üzüm Suyu",     description: "Üzvi üzüm suyu 2×750ml",                      emoji: "🍇", coins: 450,  category: "İçki",      rarity: "common" },
  { id: "silk_scarf", name: "Şəki İpək Şərfəsi",    description: "Əl toxuması, 100% ipək",                      emoji: "🧣", coins: 800,  category: "Sənətkarlıq", rarity: "rare" },
  { id: "horse",      name: "At Minmə Dərsi",        description: "30 dəq at minmə dərsi sertifikatı",           emoji: "🐴", coins: 1500, category: "Təcrübə",   rarity: "rare" },
  { id: "copper_set", name: "Mis Çay Dəsti",         description: "Ənənəvi Azərbaycan mis dəsti — 2 fincan",     emoji: "🫖", coins: 1200, category: "Sənətkarlıq", rarity: "rare" },
  { id: "farm_tour",  name: "Ferma Ziyarəti",        description: "1 nəfər üçün tam ferma turu sertifikatı",     emoji: "🏡", coins: 2000, category: "Təcrübə",   rarity: "epic" },
  { id: "carpet",     name: "Mini Qarabağ Xalçası",  description: "Əl toxuması mini xalça — 20×30sm",            emoji: "🎨", coins: 3000, category: "Sənətkarlıq", rarity: "epic" },
];

const CATEGORIES = ["Hamısı", "Yemək", "İçki", "Şirniyyat", "Sənətkarlıq", "Təcrübə"];

const rarityStyle: Record<string, { badge: string; border: string; glow: string }> = {
  common: { badge: "bg-primary-light/50 text-text-dark",    border: "border-accent/10",           glow: "" },
  rare:   { badge: "bg-accent/20 text-accent border border-accent/30", border: "border-accent/30", glow: "shadow-[0_0_12px_rgba(232,181,71,0.15)]" },
  epic:   { badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30", border: "border-purple-500/30", glow: "shadow-[0_0_16px_rgba(168,85,247,0.2)]" },
};
const rarityLabel: Record<string, string> = { common: "Adi", rare: "Nadir", epic: "Epik" };

const SPIN_COST = 50;

interface SpinPrize {
  id: string;
  name: string;
  emoji: string;
  type: "coins" | "item";
  value?: number;
}

type Tab = "rewards" | "spin";

export default function RewardsPage() {
  const [tab, setTab] = useState<Tab>("rewards");
  const [balance, setBalance] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Hamısı");
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [spinState, setSpinState] = useState<"idle" | "spinning" | "revealed">("idle");
  const [spinPrize, setSpinPrize] = useState<SpinPrize | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coins").then((r) => r.json()).then((d) => setBalance(d?.coinBalance ?? 0));
  }, []);

  const filtered = REWARDS.filter((r) => activeCategory === "Hamısı" || r.category === activeCategory);

  const claimReward = async (reward: Reward) => {
    setError(null);
    setClaiming(reward.id);
    const res = await fetch("/api/coins/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reward", rewardName: reward.name, coinCost: reward.coins }),
    });
    const data = await res.json();
    if (res.ok) {
      setBalance(data.newBalance);
      setClaimed((prev) => [...prev, reward.id]);
    } else {
      setError(data?.error ?? "Xəta baş verdi");
    }
    setClaiming(null);
  };

  const doSpin = async () => {
    if (spinState !== "idle") return;
    setError(null);
    setSpinState("spinning");
    const res = await fetch("/api/coins/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "spin" }),
    });
    const data = await res.json();
    await new Promise((r) => setTimeout(r, 1800));
    if (res.ok) {
      setSpinPrize(data.prize);
      setBalance(data.newBalance);
      setSpinState("revealed");
    } else {
      setError(data?.error ?? "Xəta baş verdi");
      setSpinState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-primary pb-24">
      {/* Header */}
      <div className="bg-primary-dark px-4 pt-5 pb-4 border-b border-accent/10">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold text-text-dark">Mükafatlar</h1>
          <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-3 py-1.5">
            <Coins size={14} className="text-accent" />
            <span className="text-accent text-sm font-bold">{balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-primary rounded-xl p-1">
          <button onClick={() => setTab("rewards")}
            className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
              tab === "rewards" ? "bg-accent text-white" : "text-muted hover:text-accent")}>
            <Gift size={15} /> Mükafatlar
          </button>
          <button onClick={() => setTab("spin")}
            className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
              tab === "spin" ? "bg-accent text-white" : "text-muted hover:text-accent")}>
            <Trophy size={15} /> Şanslı Qutu
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-4 mt-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── REWARDS TAB ── */}
      {tab === "rewards" && (
        <div className="px-4 pt-4 space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={cn("flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeCategory === c ? "bg-accent text-white" : "bg-primary-dark text-muted border border-muted/20 hover:border-accent/40")}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filtered.map((reward) => {
              const style = rarityStyle[reward.rarity];
              const canAfford = balance >= reward.coins;
              const isClaimed = claimed.includes(reward.id);
              return (
                <div key={reward.id}
                  className={cn("bg-card rounded-xl p-4 border flex items-center gap-4", style.border, style.glow)}>
                  <div className="w-16 h-16 rounded-xl bg-gradient-dark flex items-center justify-center text-3xl flex-shrink-0">
                    {reward.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap mb-0.5">
                      <h3 className="font-semibold text-text-light text-sm">{reward.name}</h3>
                      <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider", style.badge)}>
                        {rarityLabel[reward.rarity]}
                      </span>
                    </div>
                    <p className="text-muted text-xs mb-2 line-clamp-1">{reward.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-accent/10 border border-accent/20 rounded-full px-2.5 py-1">
                        <Coins size={11} className="text-accent" />
                        <span className="text-accent text-xs font-bold">{reward.coins.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isClaimed ? (
                      <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                        <CheckCircle size={18} className="text-accent" />
                      </div>
                    ) : !canAfford ? (
                      <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center" title="Koin kifayət deyil">
                        <Lock size={16} className="text-muted" />
                      </div>
                    ) : (
                      <button
                        disabled={claiming === reward.id}
                        onClick={() => claimReward(reward)}
                        className="px-3 py-2 rounded-xl bg-gradient-main text-white text-xs font-semibold hover:brightness-110 transition-all disabled:opacity-50">
                        {claiming === reward.id ? "..." : "Al"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LUCKY BOX TAB ── */}
      {tab === "spin" && (
        <div className="px-4 pt-6 flex flex-col items-center">
          <div className="text-center mb-6">
            <h2 className="font-serif text-xl font-bold text-text-dark mb-1">Şanslı Qutu</h2>
            <p className="text-muted text-sm">Hər açılış <span className="text-accent font-bold">50 koin</span> — şansa bax!</p>
          </div>

          {/* Possible prizes preview */}
          <div className="w-full bg-card rounded-2xl p-4 border border-accent/10 mb-6">
            <p className="text-muted text-xs text-center mb-3">Mümkün mükafatlar</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { emoji: "💫", label: "+20 Koin" },
                { emoji: "🪙", label: "+50 Koin" },
                { emoji: "🍯", label: "Halva" },
                { emoji: "🍬", label: "Paklava" },
                { emoji: "🫙", label: "Bal" },
                { emoji: "🎉", label: "+100 Koin" },
                { emoji: "🧣", label: "İpək Şərfə" },
                { emoji: "💎", label: "+200 Koin" },
              ].map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-1 py-2 rounded-lg bg-primary/30">
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[9px] text-muted text-center leading-tight">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box */}
          <div className="relative flex flex-col items-center mb-8">
            {spinState === "revealed" && spinPrize ? (
              <div className="flex flex-col items-center">
                <div className="w-36 h-36 rounded-3xl bg-gradient-main flex items-center justify-center text-7xl shadow-card-hover animate-bounce mb-4">
                  {spinPrize.emoji}
                </div>
                <div className="text-center bg-card rounded-2xl px-8 py-5 border border-accent/20 shadow-card">
                  <p className="text-accent font-bold text-xl mb-1">{spinPrize.name}</p>
                  <p className="text-muted text-sm">
                    {spinPrize.type === "coins" ? "Balansınıza əlavə edildi" : "Tezliklə çatdırılacaq"}
                  </p>
                </div>
                <button
                  onClick={() => { setSpinState("idle"); setSpinPrize(null); }}
                  className="mt-4 text-accent text-sm font-semibold hover:underline">
                  Yenidən oyna
                </button>
              </div>
            ) : (
              <div className={cn(
                "w-36 h-36 rounded-3xl bg-gradient-dark border-2 border-accent/30 flex items-center justify-center text-7xl shadow-card-hover cursor-pointer select-none",
                spinState === "spinning" && "animate-[wiggle_0.3s_ease-in-out_infinite]"
              )}
                style={spinState === "spinning" ? {
                  animation: "wiggle 0.25s ease-in-out infinite",
                } : {}}>
                🎁
              </div>
            )}
          </div>

          {spinState === "idle" && (
            <>
              <Button
                variant="gradient"
                size="lg"
                className="w-full max-w-xs mb-3"
                disabled={balance < SPIN_COST}
                onClick={doSpin}>
                🎁 Aç! — <Coins size={14} className="inline mx-0.5" /> 50 Koin
              </Button>
              {balance < SPIN_COST && (
                <p className="text-muted text-xs text-center">Kifayət qədər koin yoxdur. Daha çox fəaliyyət tamamlayın!</p>
              )}
            </>
          )}

          {spinState === "spinning" && (
            <div className="flex flex-col items-center gap-3">
              <Spinner className="w-7 h-7" />
              <p className="text-muted text-sm">Açılır...</p>
            </div>
          )}

          {/* Earn more tips */}
          <div className="w-full mt-8 bg-card rounded-xl p-4 border border-accent/10">
            <h3 className="font-semibold text-text-light text-sm mb-3">Daha çox koin qazanmaq üçün</h3>
            <div className="space-y-2">
              {[
                { emoji: "🌿", text: "Aktivlik tamamla", coins: "+50" },
                { emoji: "📱", text: "QR kod oxut", coins: "+50" },
                { emoji: "⭐", text: "Rəy yaz", coins: "+20" },
                { emoji: "🎯", text: "Qeydiyyat bonusu", coins: "+100" },
              ].map((tip) => (
                <div key={tip.text} className="flex items-center gap-3">
                  <span className="text-lg">{tip.emoji}</span>
                  <span className="flex-1 text-text-light text-xs">{tip.text}</span>
                  <span className="text-accent text-xs font-bold">{tip.coins}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
