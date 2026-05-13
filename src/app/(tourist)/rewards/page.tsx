"use client";

import { useEffect, useState } from "react";
import { Coins, Gift, Trophy, CheckCircle, Lock } from "lucide-react";
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
  { id: "pakhlava",    name: "Paklava Qutusu",      description: "Xüsusi hazırlanmış paklava — 12 ədəd",       emoji: "🍬", coins: 250,  category: "Şirniyyat",   rarity: "common" },
  { id: "halva",       name: "Şəki Halvası",         description: "Əl işi Şəki halvası — 500q",                 emoji: "🍯", coins: 300,  category: "Yemək",       rarity: "common" },
  { id: "pomegranate", name: "Nar Suyu Paketi",      description: "Təbii sıxılmış nar suyu 3×500ml",            emoji: "🧃", coins: 350,  category: "İçki",        rarity: "common" },
  { id: "honey",       name: "Yerli Arı Balı",       description: "Qax meşə balı — 250q",                       emoji: "🫙", coins: 400,  category: "Yemək",       rarity: "common" },
  { id: "grape_juice", name: "Qəbələ Üzüm Suyu",    description: "Üzvi üzüm suyu 2×750ml",                     emoji: "🍇", coins: 450,  category: "İçki",        rarity: "common" },
  { id: "silk_scarf",  name: "Şəki İpək Şərfəsi",   description: "Əl toxuması, 100% ipək",                     emoji: "🧣", coins: 800,  category: "Sənətkarlıq", rarity: "rare" },
  { id: "horse",       name: "At Minmə Dərsi",       description: "30 dəq at minmə dərsi sertifikatı",          emoji: "🐴", coins: 1500, category: "Təcrübə",     rarity: "rare" },
  { id: "copper_set",  name: "Mis Çay Dəsti",        description: "Ənənəvi Azərbaycan mis dəsti — 2 fincan",    emoji: "🫖", coins: 1200, category: "Sənətkarlıq", rarity: "rare" },
  { id: "farm_tour",   name: "Ferma Ziyarəti",       description: "1 nəfər üçün tam ferma turu sertifikatı",    emoji: "🏡", coins: 2000, category: "Təcrübə",     rarity: "epic" },
  { id: "carpet",      name: "Mini Qarabağ Xalçası", description: "Əl toxuması mini xalça — 20×30sm",           emoji: "🎨", coins: 3000, category: "Sənətkarlıq", rarity: "epic" },
];

const CATEGORIES = ["Hamısı", "Yemək", "İçki", "Şirniyyat", "Sənətkarlıq", "Təcrübə"];

type Tab = "rewards" | "spin";

interface SpinPrize {
  id: string;
  name: string;
  emoji: string;
  type: "coins" | "item";
  value?: number;
}

const SPIN_COST = 50;

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

  const rarityBorder: Record<string, string> = {
    common: "rgba(31,107,79,0.08)",
    rare:   "rgba(214,167,95,0.35)",
    epic:   "rgba(168,85,247,0.3)",
  };

  return (
    <div className="h-full overflow-y-auto"><div className="px-6 pt-8 pb-10" style={{ background: "#F7F8F5", minHeight: "100%" }}>

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <h1
          className="text-[22px] font-bold text-[#1E1E1E]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Mükafatlar
        </h1>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(31,107,79,0.08)", border: "1px solid rgba(31,107,79,0.15)" }}
        >
          <Coins size={13} className="text-[#1F6B4F]" />
          <span className="text-[#1F6B4F] text-sm font-bold">{balance.toLocaleString()}</span>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-[14px]"
        style={{ background: "rgba(31,107,79,0.06)" }}
      >
        <button
          onClick={() => setTab("rewards")}
          className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] text-sm font-semibold transition-all",
            tab === "rewards" ? "text-white" : "text-[#6B7280] hover:text-[#1F6B4F]")}
          style={tab === "rewards" ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" } : {}}
        >
          <Gift size={14} /> Mükafatlar
        </button>
        <button
          onClick={() => setTab("spin")}
          className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] text-sm font-semibold transition-all",
            tab === "spin" ? "text-white" : "text-[#6B7280] hover:text-[#1F6B4F]")}
          style={tab === "spin" ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" } : {}}
        >
          <Trophy size={14} /> Şanslı Qutu
        </button>
      </div>

      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-[12px] text-red-400 text-sm"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          {error}
        </div>
      )}

      {/* REWARDS TAB */}
      {tab === "rewards" && (
        <div>
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                  activeCategory === c ? "text-white" : "text-[#6B7280]",
                )}
                style={
                  activeCategory === c
                    ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }
                    : { background: "#ffffff", border: "1px solid #E5E7EB" }
                }
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((reward) => {
              const canAfford = balance >= reward.coins;
              const isClaimed = claimed.includes(reward.id);
              return (
                <div
                  key={reward.id}
                  className="rounded-[16px] p-4 flex items-center gap-4"
                  style={{
                    background: "#ffffff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    border: `1px solid ${rarityBorder[reward.rarity]}`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-[14px] flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%)" }}
                  >
                    {reward.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-[#1E1E1E] text-sm">{reward.name}</h3>
                      {reward.rarity !== "common" && (
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                          style={
                            reward.rarity === "epic"
                              ? { background: "rgba(168,85,247,0.12)", color: "#A855F7" }
                              : { background: "rgba(214,167,95,0.15)", color: "#D6A75F" }
                          }
                        >
                          {reward.rarity === "epic" ? "Epik" : "Nadir"}
                        </span>
                      )}
                    </div>
                    <p className="text-[#6B7280] text-xs mb-2 line-clamp-1">{reward.description}</p>
                    <div
                      className="flex items-center gap-1 w-fit px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(31,107,79,0.08)", border: "1px solid rgba(31,107,79,0.15)" }}
                    >
                      <Coins size={10} className="text-[#1F6B4F]" />
                      <span className="text-[#1F6B4F] text-xs font-bold">{reward.coins.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isClaimed ? (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(31,107,79,0.1)", border: "1px solid rgba(31,107,79,0.2)" }}
                      >
                        <CheckCircle size={18} className="text-[#1F6B4F]" />
                      </div>
                    ) : !canAfford ? (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ background: "#F3F4F6" }}
                        title="Koin kifayət deyil"
                      >
                        <Lock size={15} className="text-[#9CA3AF]" />
                      </div>
                    ) : (
                      <button
                        disabled={claiming === reward.id}
                        onClick={() => claimReward(reward)}
                        className="px-3 py-2 rounded-[10px] text-white text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
                      >
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

      {/* SPIN TAB */}
      {tab === "spin" && (
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <h2
              className="text-[18px] font-bold text-[#1E1E1E] mb-1"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Şanslı Qutu
            </h2>
            <p className="text-[#6B7280] text-sm">
              Hər açılış <span className="text-[#1F6B4F] font-bold">50 koin</span> — şansa bax!
            </p>
          </div>

          <div
            className="w-full rounded-[16px] p-4 mb-6"
            style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(31,107,79,0.06)" }}
          >
            <p className="text-[#9CA3AF] text-xs text-center mb-3">Mümkün mükafatlar</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { emoji: "💫", label: "+20 Koin" }, { emoji: "🪙", label: "+50 Koin" },
                { emoji: "🍯", label: "Halva" },    { emoji: "🍬", label: "Paklava" },
                { emoji: "🫙", label: "Bal" },      { emoji: "🎉", label: "+100 Koin" },
                { emoji: "🧣", label: "İpək Şərfə" }, { emoji: "💎", label: "+200 Koin" },
              ].map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-1 py-2 rounded-[10px]" style={{ background: "#F7F8F5" }}>
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[9px] text-[#6B7280] text-center leading-tight">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex flex-col items-center mb-8">
            {spinState === "revealed" && spinPrize ? (
              <div className="flex flex-col items-center">
                <div
                  className="w-36 h-36 rounded-[28px] flex items-center justify-center text-7xl shadow-lg animate-bounce mb-4"
                  style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
                >
                  {spinPrize.emoji}
                </div>
                <div
                  className="text-center rounded-[20px] px-8 py-5"
                  style={{ background: "#ffffff", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid rgba(31,107,79,0.1)" }}
                >
                  <p className="text-[#1F6B4F] font-bold text-xl mb-1">{spinPrize.name}</p>
                  <p className="text-[#6B7280] text-sm">
                    {spinPrize.type === "coins" ? "Balansınıza əlavə edildi" : "Tezliklə çatdırılacaq"}
                  </p>
                </div>
                <button
                  onClick={() => { setSpinState("idle"); setSpinPrize(null); }}
                  className="mt-4 text-[#1F6B4F] text-sm font-semibold hover:opacity-70 transition-opacity"
                >
                  Yenidən oyna
                </button>
              </div>
            ) : (
              <div
                className={cn(
                  "w-36 h-36 rounded-[28px] flex items-center justify-center text-7xl cursor-pointer select-none",
                  spinState === "spinning" && "animate-pulse",
                )}
                style={{
                  background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)",
                  boxShadow: "0 8px 32px rgba(31,107,79,0.3)",
                }}
              >
                🎁
              </div>
            )}
          </div>

          {spinState === "idle" && (
            <>
              <button
                className="w-full max-w-xs py-3.5 rounded-[14px] text-white font-bold text-sm mb-3 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
                disabled={balance < SPIN_COST}
                onClick={doSpin}
              >
                🎁 Aç! — <Coins size={14} className="inline" /> 50 Koin
              </button>
              {balance < SPIN_COST && (
                <p className="text-[#9CA3AF] text-xs text-center">Kifayət qədər koin yoxdur.</p>
              )}
            </>
          )}

          {spinState === "spinning" && (
            <div className="flex flex-col items-center gap-3">
              <Spinner className="w-7 h-7" />
              <p className="text-[#6B7280] text-sm">Açılır...</p>
            </div>
          )}
        </div>
      )}
    </div></div>
  );
}
