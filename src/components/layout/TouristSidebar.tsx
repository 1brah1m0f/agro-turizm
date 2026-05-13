import Link from "next/link";
import { Home, Map, Search, CalendarCheck, Coins, Gift, User, Wheat } from "lucide-react";

const items = [
  { href: "/home",     icon: Home,         label: "Ana Səhifə" },
  { href: "/map",      icon: Map,          label: "Xəritə" },
  { href: "/explore",  icon: Search,       label: "Kəşf Et" },
  { href: "/bookings", icon: CalendarCheck, label: "Bronlarım" },
  { href: "/coins",    icon: Coins,        label: "Koinlər" },
  { href: "/rewards",  icon: Gift,         label: "Mükafatlar" },
  { href: "/profile",  icon: User,         label: "Profil" },
];

export default function TouristSidebar() {
  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-primary border-r border-accent/20 flex-col">
      <div className="p-6 border-b border-accent/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Wheat size={18} className="text-text-light" />
          </div>
          <span className="font-serif font-bold text-lg text-text-dark">FarMorfX</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-all text-sm font-medium">
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
