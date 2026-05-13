"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Eye } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (!result?.ok) {
      setError("E-poçt və ya şifrə yanlışdır");
      setLoading(false);
      return;
    }
    const meRes = await fetch("/api/users/me");
    const me = await meRes.json().catch(() => ({}));
    const role = me?.user?.role;
    if (role === "ADMIN") window.location.href = "/admin/dashboard";
    else if (role === "ENTREPRENEUR") window.location.href = "/entrepreneur/dashboard";
    else window.location.href = "/home";
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl p-8 shadow-card-hover border border-accent/10">
        <h1 className="font-serif text-2xl font-bold text-text-light mb-1">Xoş gəlmisiniz</h1>
        <p className="text-muted text-sm mb-8">Hesabınıza daxil olun</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">E-poçt</label>
            <Input type="email" placeholder="email@nümunə.az" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Şifrə</label>
            <div className="relative">
              <Input type="password" placeholder="••••••••" className="pr-10" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent">
                <Eye size={16} />
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-muted hover:text-accent">Şifrəni unutdum?</Link>
          </div>
          <Button className="w-full" size="lg" variant="gradient" disabled={loading}>{loading ? "Daxil olunur..." : "Daxil ol"}</Button>
        </form>

        <div className="mt-6 pt-6 border-t border-primary/10 text-center text-sm text-muted">
          Hesab yoxdur?{" "}
          <Link href="/register" className="text-accent hover:underline font-semibold">Qeydiyyat</Link>
        </div>
      </div>
    </div>
  );
}
