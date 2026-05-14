"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle,
  Coffee,
  Coins,
  Crown,
  Gift,
  Lock,
  Percent,
  Sparkles,
  Trophy,
  Utensils,
} from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

type RewardCategory = "Kafe" | "Restoran" | "Servis" | "Tədbir/VIP";

interface Reward {
  id: string;
  name: string;
  partner: string;
  description: string;
  coins: number;
  category: RewardCategory;
  icon: LucideIcon;
}

const REWARDS: Reward[] = [
  {
    id: "anadolu_reservation_5",
    name: "5% reservation discount",
    partner: "Anadolu Restaurant",
    description: "Ailə və qrup rezervasiyaları üçün giriş səviyyəli endirim.",
    coins: 10,
    category: "Restoran",
    icon: Utensils,
  },
  {
    id: "coffeebear_coffee_10",
    name: "10% coffee discount",
    partner: "CoffeeBear",
    description: "İsti və soyuq qəhvə sifarişlərində 10% endirim.",
    coins: 15,
    category: "Kafe",
    icon: Coffee,
  },
  {
    id: "nergiz_reservation_10",
    name: "10% reservation discount",
    partner: "Nergiz Restaurant",
    description: "Əvvəlcədən edilən masa rezervasiyası üçün endirim.",
    coins: 20,
    category: "Restoran",
    icon: Utensils,
  },
  {
    id: "coffeelea_dessert",
    name: "Dessert discount",
    partner: "CoffeeLea",
    description: "Desert seçiminə tətbiq olunan yüngül kafe endirimi.",
    coins: 25,
    category: "Kafe",
    icon: Coffee,
  },
  {
    id: "sabahhub_event_20",
    name: "20% service discount for a partner workshop or event",
    partner: "SABAH.HUB Events",
    description: "Seçilmiş workshop və icma tədbirlərində 20% endirim.",
    coins: 30,
    category: "Servis",
    icon: Percent,
  },
  {
    id: "coffeebear_americano_tea",
    name: "Free Americano or tea",
    partner: "CoffeeBear",
    description: "Bir Americano və ya klassik çay hədiyyəsi.",
    coins: 35,
    category: "Kafe",
    icon: Coffee,
  },
  {
    id: "entree_lunch_20",
    name: "20% business lunch discount",
    partner: "Entrée Baku",
    description: "Həftəiçi biznes lanç menyusunda 20% endirim.",
    coins: 40,
    category: "Restoran",
    icon: Utensils,
  },
  {
    id: "coffeemania_free_order",
    name: "Free coffee order",
    partner: "CoffeeMania",
    description: "Bir standart qəhvə sifarişini koinlərlə qarşılayın.",
    coins: 50,
    category: "Kafe",
    icon: Coffee,
  },
  {
    id: "asan_partner_30",
    name: "30% service discount for selected platform partners",
    partner: "ASAN Xidmət Partner Services",
    description: "Platforma üzrə seçilmiş servis paketlərində 30% endirim.",
    coins: 60,
    category: "Servis",
    icon: Percent,
  },
  {
    id: "shaurma_n1_lunch",
    name: "Business lunch discount",
    partner: "Shaurma N1",
    description: "Biznes lanç sifarişi üçün partnyor endirimi.",
    coins: 70,
    category: "Restoran",
    icon: Utensils,
  },
  {
    id: "pizza_bruno_reservation_30",
    name: "30% reservation discount",
    partner: "Pizza Bruno",
    description: "Masa rezervasiyası və qrup yeməkləri üçün 30% endirim.",
    coins: 80,
    category: "Restoran",
    icon: Utensils,
  },
  {
    id: "premium_drink_gift",
    name: "Premium drink gift",
    partner: "CoffeeLea or CoffeeMania",
    description: "Premium içki seçimlərindən bir hədiyyə kuponu.",
    coins: 100,
    category: "Kafe",
    icon: Coffee,
  },
  {
    id: "baku_workshop_50",
    name: "50% service discount for selected workshops",
    partner: "Baku Workshop Center",
    description: "Seçilmiş təlim və praktiki workshoplarda 50% endirim.",
    coins: 120,
    category: "Servis",
    icon: Percent,
  },
  {
    id: "vapiano_lunch_gift",
    name: "Business lunch gift",
    partner: "Vapiano Baku",
    description: "Bir nəfərlik biznes lanç hədiyyə kuponu.",
    coins: 150,
    category: "Restoran",
    icon: Utensils,
  },
  {
    id: "baku_food_festival_50",
    name: "50% festival or workshop discount",
    partner: "Baku Food Festival",
    description: "Festival bileti və ya workshop iştirakında 50% endirim.",
    coins: 180,
    category: "Tədbir/VIP",
    icon: CalendarDays,
  },
  {
    id: "bigchefs_voucher",
    name: "25-30 AZN restaurant voucher",
    partner: "BigChefs Baku",
    description: "Restoran hesabında istifadə edilən 25-30 AZN kupon.",
    coins: 220,
    category: "Restoran",
    icon: Utensils,
  },
  {
    id: "pasha_travel_premium_70",
    name: "70% service discount for premium partner services",
    partner: "PASHA Travel Services",
    description: "Premium turizm və konsyerj servis paketlərində 70% endirim.",
    coins: 300,
    category: "Servis",
    icon: Percent,
  },
  {
    id: "mado_ozsut_dinner",
    name: "Premium dinner voucher",
    partner: "Mado Azerbaijan or Özsüt Azerbaijan",
    description: "Premium şam yeməyi üçün restoran kuponu.",
    coins: 400,
    category: "Restoran",
    icon: Utensils,
  },
  {
    id: "sabahhub_workshop_100",
    name: "100% workshop participation discount",
    partner: "SABAH.HUB Workshops",
    description: "Seçilmiş workshop iştirak haqqını tam qarşılayır.",
    coins: 500,
    category: "Servis",
    icon: Sparkles,
  },
  {
    id: "agrofest_pass_100",
    name: "100% festival pass discount",
    partner: "AgroFest Azerbaijan",
    description: "Seçilmiş aqro və food festival keçidini tam qarşılayır.",
    coins: 700,
    category: "Tədbir/VIP",
    icon: CalendarDays,
  },
  {
    id: "vip_event_access",
    name: "VIP festival / premium event access",
    partner: "Baku Expo Center Premium Events",
    description: "VIP giriş və premium tədbir zonası üçün xüsusi keçid.",
    coins: 1000,
    category: "Tədbir/VIP",
    icon: Crown,
  },
];

const CATEGORIES: Array<"Hamısı" | RewardCategory> = ["Hamısı", "Kafe", "Restoran", "Servis", "Tədbir/VIP"];

const CATEGORY_STYLES: Record<RewardCategory, { bg: string; border: string; text: string; soft: string }> = {
  Kafe: {
    bg: "linear-gradient(135deg, #7C5C3E 0%, #B8874A 100%)",
    border: "rgba(124,92,62,0.22)",
    text: "#7C5C3E",
    soft: "rgba(124,92,62,0.1)",
  },
  Restoran: {
    bg: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)",
    border: "rgba(31,107,79,0.2)",
    text: "#1F6B4F",
    soft: "rgba(31,107,79,0.1)",
  },
  Servis: {
    bg: "linear-gradient(135deg, #1A688E 0%, #4EA0B8 100%)",
    border: "rgba(26,104,142,0.2)",
    text: "#1A688E",
    soft: "rgba(26,104,142,0.1)",
  },
  "Tədbir/VIP": {
    bg: "linear-gradient(135deg, #9B6A2F 0%, #D6A75F 100%)",
    border: "rgba(214,167,95,0.3)",
    text: "#9B6A2F",
    soft: "rgba(214,167,95,0.14)",
  },
};

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
  const [activeCategory, setActiveCategory] = useState<"Hamısı" | RewardCategory>("Hamısı");
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
      body: JSON.stringify({
        type: "reward",
        rewardName: `${reward.partner}: ${reward.name}`,
        coinCost: reward.coins,
      }),
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
    <div className="h-full overflow-y-auto">
      <div className="px-4 sm:px-6 pt-8 pb-10" style={{ background: "#F7F8F5", minHeight: "100%" }}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-[22px] font-bold text-[#1E1E1E]" style={{ fontFamily: "var(--font-serif)" }}>
              Mükafatlar
            </h1>
            <p className="text-[#6B7280] text-sm mt-1">
              Ödənişin 10%-i koin kimi qayıdır. 50 AZN ödəniş = 5 koin.
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
            style={{ background: "rgba(31,107,79,0.08)", border: "1px solid rgba(31,107,79,0.15)" }}
          >
            <Coins size={13} className="text-[#1F6B4F]" />
            <span className="text-[#1F6B4F] text-sm font-bold">{balance.toLocaleString()}</span>
          </div>
        </div>

        <div
          className="mb-5 rounded-[18px] p-4"
          style={{ background: "#ffffff", border: "1px solid rgba(31,107,79,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: "rgba(31,107,79,0.1)" }}>
              <Percent size={18} className="text-[#1F6B4F]" />
            </div>
            <div className="min-w-0">
              <p className="text-[#1E1E1E] text-sm font-semibold">Real partnyor üstünlükləri</p>
              <p className="text-[#6B7280] text-xs">
                Koinləri kafe, restoran, servis və tədbir partnyorlarında istifadə et.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-5 p-1 rounded-[14px]" style={{ background: "rgba(31,107,79,0.06)" }}>
          <button
            onClick={() => setTab("rewards")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] text-sm font-semibold transition-all",
              tab === "rewards" ? "text-white" : "text-[#6B7280] hover:text-[#1F6B4F]",
            )}
            style={tab === "rewards" ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" } : {}}
          >
            <Gift size={14} /> Mükafatlar
          </button>
          <button
            onClick={() => setTab("spin")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] text-sm font-semibold transition-all",
              tab === "spin" ? "text-white" : "text-[#6B7280] hover:text-[#1F6B4F]",
            )}
            style={tab === "spin" ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" } : {}}
          >
            <Trophy size={14} /> Şanslı Qutu
          </button>
        </div>

        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-[12px] text-red-500 text-sm"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            {error}
          </div>
        )}

        {tab === "rewards" && (
          <div>
            <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                    activeCategory === category ? "text-white" : "text-[#6B7280]",
                  )}
                  style={
                    activeCategory === category
                      ? { background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }
                      : { background: "#ffffff", border: "1px solid #E5E7EB" }
                  }
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {filtered.map((reward) => {
                const canAfford = balance >= reward.coins;
                const isClaimed = claimed.includes(reward.id);
                const styles = CATEGORY_STYLES[reward.category];
                const Icon = reward.icon;

                return (
                  <div
                    key={reward.id}
                    className="rounded-[16px] p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                    style={{
                      background: "#ffffff",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                      border: `1px solid ${styles.border}`,
                    }}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
                        style={{ background: styles.bg }}
                      >
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                            style={{ background: "rgba(31,107,79,0.08)", color: "#1F6B4F" }}
                          >
                            <Coins size={11} />
                            {reward.coins.toLocaleString()} koin
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                            style={{ background: styles.soft, color: styles.text }}
                          >
                            {reward.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-[#1E1E1E] text-sm leading-snug">{reward.name}</h3>
                        <p className="text-[#1F6B4F] text-xs font-bold mt-1">{reward.partner}</p>
                        <p className="text-[#6B7280] text-xs mt-1 leading-relaxed">{reward.description}</p>
                      </div>
                    </div>

                    <div className="sm:w-[72px] flex sm:justify-end">
                      {isClaimed ? (
                        <div
                          className="w-full sm:w-10 h-10 rounded-[12px] flex items-center justify-center gap-2 px-3"
                          style={{ background: "rgba(31,107,79,0.1)", border: "1px solid rgba(31,107,79,0.2)" }}
                        >
                          <CheckCircle size={18} className="text-[#1F6B4F]" />
                          <span className="sm:hidden text-[#1F6B4F] text-xs font-semibold">Alındı</span>
                        </div>
                      ) : !canAfford ? (
                        <div
                          className="w-full sm:w-10 h-10 rounded-[12px] flex items-center justify-center gap-2 px-3"
                          style={{ background: "#F3F4F6" }}
                          title="Koin kifayət deyil"
                        >
                          <Lock size={15} className="text-[#9CA3AF]" />
                          <span className="sm:hidden text-[#9CA3AF] text-xs font-semibold">Koin kifayət deyil</span>
                        </div>
                      ) : (
                        <button
                          disabled={claiming === reward.id}
                          onClick={() => claimReward(reward)}
                          className="w-full sm:w-auto px-3 py-2 rounded-[10px] text-white text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
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

        {tab === "spin" && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-6">
              <h2 className="text-[18px] font-bold text-[#1E1E1E] mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                Şanslı Qutu
              </h2>
              <p className="text-[#6B7280] text-sm">
                Hər açılış <span className="text-[#1F6B4F] font-bold">50 koin</span> - şansa bax!
              </p>
            </div>

            <div
              className="w-full rounded-[16px] p-4 mb-6"
              style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(31,107,79,0.06)" }}
            >
              <p className="text-[#9CA3AF] text-xs text-center mb-3">Mümkün mükafatlar</p>
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
                  🎁 Aç! - <Coins size={14} className="inline" /> 50 Koin
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
      </div>
    </div>
  );
}
