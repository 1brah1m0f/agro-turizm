import Link from "next/link";
import { Home, Map, CalendarCheck, User } from "lucide-react";

const items = [
  { href: "/home", icon: Home, label: "Ana" },
  { href: "/map", icon: Map, label: "Xəritə" },
  { href: "/bookings", icon: CalendarCheck, label: "Bronlar" },
  { href: "/profile", icon: User, label: "Profil" },
];

export default function TouristNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-primary border-t border-accent/20 md:hidden">
      <div className="flex">
        {items.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center gap-1 py-3 text-muted hover:text-accent transition-colors">
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
