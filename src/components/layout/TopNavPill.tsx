"use client";

import { useRouter } from "next/navigation";
import { Home, Map, Compass, CalendarCheck, Coins, Gift, User } from "lucide-react";

const NAV = [
  { href: "/home",     icon: Home,          label: "Ana" },
  { href: "/map",      icon: Map,           label: "Xəritə" },
  { href: "/explore",  icon: Compass,       label: "Kəşf" },
  { href: "/bookings", icon: CalendarCheck, label: "Bronlar" },
  { href: "/coins",    icon: Coins,         label: "Koinlər" },
  { href: "/rewards",  icon: Gift,          label: "Mükafat" },
  { href: "/profile",  icon: User,          label: "Profil" },
];

export default function TopNavPill() {
  const router = useRouter();
  return (
    <div
      className="absolute top-4 right-4 z-[600] flex items-center gap-0.5 px-2 py-1.5 rounded-[16px]"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        border: "1px solid rgba(255,255,255,0.8)",
      }}
    >
      {NAV.map(({ href, icon: Icon, label }) => (
        <button
          key={href}
          onClick={() => router.push(href)}
          title={label}
          className="w-8 h-8 flex items-center justify-center rounded-[10px] text-[#6B7280] hover:text-[#1F6B4F] hover:bg-[#1F6B4F]/[0.08] transition-all"
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
