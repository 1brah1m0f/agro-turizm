"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Compass, Tractor, Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

type Role = "tourist" | "entrepreneur" | null;

export default function RegisterPage() {
  const [role, setRole] = useState<Role>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!role || !firstName || !lastName || !email || !password) {
      setError("Məlumatlar natamamdır");
      return;
    }
    setLoading(true);
    const payload = {
      email,
      password,
      name: `${firstName} ${lastName}`.trim(),
      role: role === "tourist" ? "TOURIST" : "ENTREPRENEUR",
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Qeydiyyat zamanı xəta baş verdi");
      setLoading(false);
      return;
    }
    const result = await signIn("credentials", { email, password, redirect: false });
    if (!result?.ok) {
      setError("Daxil olmaq alınmadı");
      setLoading(false);
      return;
    }
    if (role === "entrepreneur") window.location.href = "/entrepreneur/dashboard";
    else window.location.href = "/home";
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl p-8 shadow-card-hover border border-accent/10">
        <h1 className="font-serif text-2xl font-bold text-text-light mb-1">Hesab Yarat</h1>
        <p className="text-muted text-sm mb-6">
          FarMorfX-ə qoşulun və <span className="text-accent font-semibold">100 bonus koin</span> qazanın
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setRole("tourist")}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
              role === "tourist"
                ? "border-accent bg-accent/10 text-accent"
                : "border-primary/20 text-muted hover:border-accent/40"
            )}
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center",
              role === "tourist" ? "bg-accent text-white" : "bg-primary/20 text-muted")}>
              <Compass size={22} />
            </div>
            <span className="font-semibold text-sm">Turist</span>
            <span className="text-xs opacity-70 text-center">Fermaları kəşf et, koin yığ</span>
          </button>

          <button
            onClick={() => setRole("entrepreneur")}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all",
              role === "entrepreneur"
                ? "border-accent bg-accent/10 text-accent"
                : "border-primary/20 text-muted hover:border-accent/40"
            )}
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center",
              role === "entrepreneur" ? "bg-accent text-white" : "bg-primary/20 text-muted")}>
              <Tractor size={22} />
            </div>
            <span className="font-semibold text-sm">Sahibkar / Host</span>
            <span className="text-xs opacity-70 text-center">Fermanı qeydiyyata al</span>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-light text-sm font-medium block mb-2">Ad</label>
              <Input placeholder="Adınız" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
            </div>
            <div>
              <label className="text-text-light text-sm font-medium block mb-2">Soyad</label>
              <Input placeholder="Soyadınız" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">E-poçt</label>
            <Input type="email" placeholder="email@nümunə.az" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Şifrə</label>
            <div className="relative">
              <Input type="password" placeholder="Min. 8 simvol" className="pr-10" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent">
                <Eye size={16} />
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button
            className="w-full"
            size="lg"
            variant="gradient"
            disabled={!role || loading}
          >
            {loading ? "Yaradılır..." : role ? "Qeydiyyatdan keç" : "Rol seçin"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-primary/10 text-center text-sm text-muted">
          Artıq hesabınız var?{" "}
          <Link href="/login" className="text-accent hover:underline font-semibold">Daxil olun</Link>
        </div>
      </div>
    </div>
  );
}
