"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Edit2, Coins, MapPin, Settings, HelpCircle, LogOut, ChevronRight } from "lucide-react";
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: "#F7F8F5" }}>
        <Spinner />
      </div>
    );
  }

  const profile = me?.profile;
  const user = me?.user;
  const name = user?.name ?? "İstifadəçi";
  const interests = profile?.interests ?? [];

  const menuGroups = [
    {
      title: "Hesab",
      items: [
        { icon: Edit2,       label: "Profili Redaktə Et", action: () => router.push("/profile/setup"), danger: false },
        { icon: Settings,    label: "Tənzimləmələr",      action: () => {},                            danger: false },
        { icon: HelpCircle,  label: "Yardım & Dəstək",    action: () => {},                            danger: false },
      ],
    },
    {
      title: "Digər",
      items: [
        { icon: LogOut, label: "Çıxış", action: handleLogout, danger: true },
      ],
    },
  ];

  return (
    <div className="h-full overflow-y-auto"><div className="px-6 pt-8 pb-10" style={{ background: "#F7F8F5", minHeight: "100%" }}>

      {/* Profile hero card */}
      <div
        className="rounded-[20px] p-6 mb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1F6B4F 0%, #2E8B57 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-[18px] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}
          >
            {name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className="font-bold text-[18px] text-white mb-0.5 truncate"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {name}
            </h2>
            <p className="text-white/70 text-sm truncate">{user?.email}</p>
            <span
              className="text-[10px] font-semibold text-white/80 px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              Aktiv Turist
            </span>
          </div>
          <button
            onClick={() => router.push("/profile/setup")}
            className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white flex-shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Edit2 size={15} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 gap-3 rounded-[16px] p-4 mb-5"
        style={{
          background: "#ffffff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid rgba(31,107,79,0.06)",
        }}
      >
        <div className="flex flex-col items-center gap-1 py-2">
          <Coins size={18} className="text-[#1F6B4F]" />
          <span className="font-bold text-[#1E1E1E] text-lg">{profile?.coinBalance ?? 0}</span>
          <span className="text-[#9CA3AF] text-[10px]">Koin</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-2">
          <MapPin size={18} className="text-[#1F6B4F]" />
          <span className="font-bold text-[#1E1E1E] text-lg">{profile?.country ?? "—"}</span>
          <span className="text-[#9CA3AF] text-[10px]">Ölkə</span>
        </div>
      </div>

      {/* Interests */}
      {interests.length > 0 && (
        <div
          className="rounded-[16px] p-4 mb-5"
          style={{
            background: "#ffffff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            border: "1px solid rgba(31,107,79,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#1E1E1E] text-sm">Maraqlarım</h3>
            <button
              onClick={() => router.push("/profile/setup")}
              className="text-[#1F6B4F] text-xs font-semibold hover:opacity-70 transition-opacity"
            >
              Düzəliş et
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map(i => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  background: "rgba(31,107,79,0.08)",
                  color: "#1F6B4F",
                  border: "1px solid rgba(31,107,79,0.15)",
                }}
              >
                {interestEmoji[i.toLowerCase()] ?? "🌿"} {i}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Menu groups */}
      {menuGroups.map((group) => (
        <div
          key={group.title}
          className="rounded-[16px] overflow-hidden mb-3"
          style={{
            background: "#ffffff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "#9CA3AF", borderBottom: "1px solid rgba(31,107,79,0.06)" }}
          >
            {group.title}
          </div>
          {group.items.map(({ icon: Icon, label, danger, action }, i) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#F7F8F5]"
              style={i < group.items.length - 1 ? { borderBottom: "1px solid rgba(31,107,79,0.06)" } : {}}
            >
              <div
                className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0"
                style={{
                  background: danger ? "rgba(239,68,68,0.08)" : "rgba(31,107,79,0.08)",
                }}
              >
                <Icon size={15} className={danger ? "text-red-400" : "text-[#1F6B4F]"} />
              </div>
              <span
                className="flex-1 text-sm font-medium text-left"
                style={{ color: danger ? "#EF4444" : "#1E1E1E" }}
              >
                {label}
              </span>
              <ChevronRight size={14} className="text-[#9CA3AF]" />
            </button>
          ))}
        </div>
      ))}
    </div></div>
  );
}
