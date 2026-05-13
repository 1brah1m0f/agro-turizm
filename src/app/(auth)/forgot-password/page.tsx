"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl p-8 shadow-card-hover border border-accent/10">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
              <Mail size={28} className="text-accent" />
            </div>
            <h1 className="font-serif text-xl font-bold text-text-light mb-2">Email göndərildi</h1>
            <p className="text-muted text-sm mb-6">
              <span className="text-accent font-medium">{email}</span> ünvanına şifrə sıfırlama linki göndərildi.
            </p>
            <Link href="/login" className="text-accent text-sm font-semibold hover:underline">
              Giriş səhifəsinə qayıt
            </Link>
          </div>
        ) : (
          <>
            <Link href="/login" className="flex items-center gap-1.5 text-muted hover:text-accent text-sm mb-6">
              <ArrowLeft size={15} /> Geri
            </Link>
            <h1 className="font-serif text-2xl font-bold text-text-light mb-1">Şifrəni Sıfırla</h1>
            <p className="text-muted text-sm mb-8">Email ünvanınızı daxil edin, sıfırlama linki göndərəcəyik.</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-text-light text-sm font-medium block mb-2">E-poçt</label>
                <Input
                  type="email"
                  placeholder="email@nümunə.az"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" size="lg" variant="gradient" disabled={loading}>
                {loading ? "Göndərilir..." : "Link Göndər"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
