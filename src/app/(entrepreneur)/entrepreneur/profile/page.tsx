"use client";

import { useEffect, useState } from "react";
import { Edit2, MapPin, Phone, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";

interface Profile {
  businessName: string;
  phone: string;
  category: string;
  location: string;
  description?: string;
  logoUrl?: string;
  isVerified: boolean;
}

interface Me {
  user: { name: string; email: string };
  profile: Profile | null;
}

export default function EntrepreneurProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then(setMe)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      businessName: data.get("businessName") as string,
      phone: data.get("phone") as string,
      category: data.get("category") as string,
      location: data.get("location") as string,
      description: data.get("description") as string,
    };
    const res = await fetch("/api/entrepreneur/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const err = await res.json().catch(() => ({}));
      setError(err?.error ?? "Xəta baş verdi");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-6 flex justify-center pt-12"><Spinner /></div>;
  }

  const profile = me?.profile;
  const user = me?.user;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-text-dark">Sahibkar Profili</h1>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-accent/10 mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-main opacity-10 rounded-full translate-x-8 -translate-y-8" />
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-main flex items-center justify-center text-3xl flex-shrink-0 shadow-card">
            🌿
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl text-text-light">{profile?.businessName ?? user?.name}</h2>
            <p className="text-muted text-sm">{user?.name}</p>
            <div className="flex items-center gap-2 mt-2">
              {profile?.isVerified
                ? <Badge variant="accent" className="text-[10px]">Doğrulanmış</Badge>
                : <Badge variant="amber" className="text-[10px]">Yoxlanılır</Badge>}
              {profile?.category && <Badge variant="default" className="text-[10px]">{profile.category}</Badge>}
            </div>
          </div>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="bg-card rounded-xl p-5 border border-accent/10 space-y-4">
          <h2 className="font-semibold text-text-light">Biznes Məlumatları</h2>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Ferma / Biznes adı</label>
            <Input name="businessName" defaultValue={profile?.businessName ?? ""} placeholder="Biznes adınız" />
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Kateqoriya</label>
            <Input name="category" defaultValue={profile?.category ?? ""} placeholder="məs. Ferma" />
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Qısa təsvir</label>
            <Textarea name="description" rows={3} defaultValue={profile?.description ?? ""} placeholder="Ferma haqqında..." />
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-accent/10 space-y-4">
          <h2 className="font-semibold text-text-light">Əlaqə</h2>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-muted flex-shrink-0" />
            <Input name="phone" type="tel" defaultValue={profile?.phone ?? ""} placeholder="+994 XX XXX XX XX" />
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-muted flex-shrink-0" />
            <Input type="email" defaultValue={user?.email ?? ""} disabled className="opacity-60" />
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-muted flex-shrink-0" />
            <Input name="location" defaultValue={profile?.location ?? ""} placeholder="Bölgə, Azərbaycan" />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {saved && <p className="text-accent text-sm">Dəyişikliklər saxlanıldı ✓</p>}

        <Button variant="gradient" size="lg" className="w-full" disabled={saving}>
          <Edit2 size={14} /> {saving ? "Saxlanılır..." : "Dəyişiklikləri Saxla"}
        </Button>
      </form>
    </div>
  );
}
