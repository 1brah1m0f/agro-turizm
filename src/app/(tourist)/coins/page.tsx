"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, TrendingUp, TrendingDown, CreditCard, ReceiptText, Percent } from "lucide-react";

const howToEarn = [
  { icon: Percent,    label: "Hər ödənişdən qaytarım", coins: "10%" },
  { icon: CreditCard, label: "50 AZN ödəniş nümunəsi", coins: "+5" },
  { icon: ReceiptText, label: "100 AZN ödəniş nümunəsi", coins: "+10" },
  { icon: Coins,      label: "Koinləri mükafata dəyiş", coins: "10+" },
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
    <div className="h-full overflow-y-auto"><div className="px-6 pt-8 pb-10" style={{ background: "#F7F8F5", minHeight: "100%" }}>

      <h1
        className="text-[22px] font-bold text-[#1E1E1E] mb-5"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Koin Balansım
      </h1>

      {/* Balance hero */}
      <div
        className="rounded-[20px] p-6 mb-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-10 translate-x-10"
          style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-8 -translate-x-8"
          style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={16} className="text-white/70" />
            <span className="text-white/70 text-sm">Ümumi balans</span>
          </div>
          <p
            className="font-bold text-5xl text-white mb-1"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {balance.toLocaleString()}
          </p>
          <p className="text-white/60 text-sm">KOİN</p>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp size={13} className="text-white/70" />
            <span className="text-white/70 text-xs">Bu ay: <strong className="text-white">+{thisMonth} koin</strong></span>
          </div>
        </div>
      </div>

      {/* Rewards CTA */}
      <div
        className="rounded-[16px] p-4 mb-6 flex items-center gap-3"
        style={{
          background: "#ffffff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid rgba(31,107,79,0.08)",
        }}
      >
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "rgba(31,107,79,0.08)" }}
        >
          🎁
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#1E1E1E] font-semibold text-sm">Koinlərinizi xərclə!</p>
          <p className="text-[#6B7280] text-xs">CoffeeBear, Entrée Baku, BigChefs və tədbir partnyorları.</p>
        </div>
        <button
          onClick={() => router.push("/rewards")}
          className="text-xs font-bold text-white px-3 py-2 rounded-[10px] flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
        >
          Bax →
        </button>
      </div>

      {/* How to earn */}
      <div className="mb-6">
        <h2 className="font-semibold text-[#1E1E1E] text-sm mb-3">Necə qazanmaq olar</h2>
        <div className="grid grid-cols-2 gap-3">
          {howToEarn.map(({ icon: Icon, label, coins }) => (
            <div
              key={label}
              className="rounded-[14px] p-4 flex items-center gap-3"
              style={{
                background: "#ffffff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                border: "1px solid rgba(31,107,79,0.06)",
              }}
            >
              <div
                className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
              >
                <Icon size={15} className="text-white" />
              </div>
              <div>
                <p className="text-[#374151] text-xs font-medium leading-tight">{label}</p>
                <p className="text-[#1F6B4F] text-sm font-bold">{coins}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      {transactions.length > 0 && (
        <div>
          <h2 className="font-semibold text-[#1E1E1E] text-sm mb-3">Tarix</h2>
          <div
            className="rounded-[16px] overflow-hidden"
            style={{ background: "#ffffff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            {transactions.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3"
                style={i < transactions.length - 1 ? { borderBottom: "1px solid rgba(31,107,79,0.06)" } : {}}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: item.amount > 0 ? "rgba(31,107,79,0.1)" : "rgba(239,68,68,0.1)",
                  }}
                >
                  {item.amount > 0
                    ? <TrendingUp size={13} className="text-[#1F6B4F]" />
                    : <TrendingDown size={13} className="text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#374151] text-xs font-medium truncate">{item.reason}</p>
                  <p className="text-[#9CA3AF] text-[10px]">{new Date(item.createdAt).toLocaleDateString("az-AZ")}</p>
                </div>
                <span
                  className="text-sm font-bold flex-shrink-0"
                  style={{ color: item.amount > 0 ? "#1F6B4F" : "#EF4444" }}
                >
                  {item.amount > 0 ? "+" : ""}{item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div></div>
  );
}
