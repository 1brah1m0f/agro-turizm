"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Map, Compass, CalendarCheck, Coins, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/home",     icon: Home,          label: "Ana Səhifə" },
  { href: "/map",      icon: Map,           label: "Xəritə" },
  { href: "/explore",  icon: Compass,       label: "Kəşf Et" },
  { href: "/bookings", icon: CalendarCheck, label: "Bronlarım" },
  { href: "/coins",    icon: Coins,         label: "Koinlər" },
  { href: "/rewards",  icon: Gift,          label: "Mükafatlar" },
  { href: "/profile",  icon: User,          label: "Profil" },
];

export default function TouristSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex w-[248px] flex-shrink-0 flex-col h-full"
      style={{ background: "#FFFFFF", boxShadow: "4px 0 40px rgba(0,0,0,0.06)" }}
    >
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[12px] overflow-hidden flex-shrink-0">
            <img src="/logo.jpg" alt="AgroFlow" className="w-full h-full object-cover" />
          </div>
          <div>
            <span
              className="font-bold text-[#1E1E1E] text-[17px] tracking-tight leading-none"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              AgroFlow
            </span>
            <p className="text-[10px] text-[#6B7280] mt-0.5 tracking-wide uppercase">Eco Tourism</p>
          </div>
        </div>
      </div>

      <div className="mx-5 mb-2 h-px bg-[#F0F0EC]" />

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] text-sm font-medium transition-all duration-150 text-left",
                active
                  ? "text-white"
                  : "text-[#6B7280] hover:text-[#1E1E1E] hover:bg-[#F7F8F5]",
              )}
              style={
                active
                  ? {
                      background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)",
                      boxShadow: "0 4px 14px rgba(31,107,79,0.28)",
                    }
                  : {}
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="truncate">{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D6A75F]" />}
            </button>
          );
        })}
      </nav>

      {/* User pill */}
      <div className="p-4 border-t border-[#F0F0EC]">
        <button
          onClick={() => router.push("/profile")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] hover:bg-[#F7F8F5] transition-all text-left"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #D6A75F 0%, #B8843A 100%)" }}
          >
            T
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#1E1E1E] truncate">Turist</p>
            <p className="text-[10px] text-[#6B7280]">Profili gör</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
