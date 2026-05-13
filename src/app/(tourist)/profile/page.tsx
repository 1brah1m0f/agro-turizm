"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Edit2, Star, CalendarCheck, Coins, MapPin, Settings, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";

interface Profile {
  phone?: string;
  country?: string;
  interests: string[];
  coinBalance: number;
}

interface Me {
  user: { id: string; name: string; email: string; role: string };
  profile: Profile | null;
}

const interestEmoji: Record<string, string> = {
  fishing: "🎣", camping: "⛺", harvest: "🍎", horse: "🐴",
  food: "🍳", wine: "🍇", nature: "🌿", adventure: "🧗",
  ferma: "🌾", yemek: "🍳", kamp: "⛺", kultura: "🏛️", "at minme": "🐴",
};

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then(setMe)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  const menuItems = [
    { icon: Edit2, label: "Profili Redaktə Et", action: () => router.push("/profile/setup") },
    { icon: Settings, label: "Tənzimləmələr", action: () => {} },
    { icon: HelpCircle, label: "Yardım & Dəstək", action: () => {} },
    { icon: LogOut, label: "Çıxış", danger: true, action: handleLogout },
  ];

  if (loading) {
    return <div className="min-h-screen bg-primary flex items-center justify-center"><Spinner /></div>;
  }

  const profile = me?.profile;
  const user = me?.user;
  const name = user?.name ?? "İstifadəçi";
  const interests = profile?.interests ?? [];

  return (
    <div className="min-h-screen bg-primary pb-24">
      <div className="bg-gradient-main px-4 pt-10 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative flex items-center justify-between mb-4">
          <h1 className="font-serif text-xl font-bold text-white">Profilim</h1>
        </div>
        <div className="relative flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold text-white border-2 border-white/30">
            {name[0]}
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-white">{name}</h2>
            <p className="text-white/70 text-sm">{user?.email}</p>
            <Badge className="mt-1 bg-white/20 text-white border-0 text-[10px]">Aktiv Turist</Badge>
          </div>
          <button onClick={() => router.push("/profile/setup")} className="ml-auto w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-card rounded-2xl p-4 shadow-card-hover border border-accent/10 grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center gap-1">
            <Coins size={18} className="text-accent" />
            <span className="font-bold text-text-light text-lg">{profile?.coinBalance ?? 0}</span>
            <span className="text-muted text-[10px]">Koin</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MapPin size={18} className="text-accent" />
            <span className="font-bold text-text-light text-lg">{profile?.country ?? "—"}</span>
            <span className="text-muted text-[10px]">Ölkə</span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {interests.length > 0 && (
          <div className="bg-card rounded-xl p-4 shadow-card border border-accent/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-light text-sm">Maraqlarım</h3>
              <button onClick={() => router.push("/profile/setup")} className="text-accent text-xs hover:underline">Düzəliş et</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map(i => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {interestEmoji[i.toLowerCase()] ?? "🌿"} {i}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl shadow-card border border-accent/10 overflow-hidden">
          {menuItems.map(({ icon: Icon, label, danger, action }, i) => (
            <button key={label} onClick={action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 ${i < menuItems.length - 1 ? "border-b border-primary/10" : ""} hover:bg-primary/5 transition-colors`}>
              <Icon size={18} className={danger ? "text-red-400" : "text-muted"} />
              <span className={`flex-1 text-sm text-left font-medium ${danger ? "text-red-400" : "text-text-light"}`}>{label}</span>
              <ChevronRight size={14} className="text-muted" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
