"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Spinner from "@/components/ui/Spinner";

const lockedFeatures = ["Yer dərc etmək", "Bronları qəbul etmək", "Ödənişlər"];

export default function EntrepreneurVerificationPage() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entrepreneur/verification")
      .then((r) => r.json())
      .then((data) => setIsVerified(data?.isVerified ?? false))
      .catch(() => setIsVerified(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center pt-12"><Spinner /></div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">Doğrulama</h1>

      <div className={cn(
        "flex items-center gap-3 rounded-xl px-5 py-4 mb-6 border",
        !isVerified
          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
          : "bg-accent/10 border-accent/30 text-accent"
      )}>
        {!isVerified ? <Clock size={20} /> : <CheckCircle size={20} />}
        <div>
          <p className="font-semibold">{!isVerified ? "Hesabınız yoxlanılır" : "Hesabınız Təsdiqləndi"}</p>
          <p className="text-sm opacity-70">
            {!isVerified ? "24-48 saat ərzində nəticə bildiriləcək" : "Bütün xüsusiyyətlər açıqdır"}
          </p>
        </div>
      </div>

      {!isVerified && (
        <div className="bg-primary-light rounded-xl p-5 border border-accent/10 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock size={16} className="text-muted" />
            <span className="text-sm text-muted font-medium">Doğrulamadan sonra açılacaq</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lockedFeatures.map(f => (
              <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-primary-dark text-muted border border-white/5">{f}</span>
            ))}
          </div>
        </div>
      )}

      {isVerified && (
        <div className="bg-accent/5 rounded-xl p-5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-accent" />
            <span className="text-accent font-semibold">Bütün xüsusiyyətlər aktivdir</span>
          </div>
          <p className="text-muted text-sm">Məkanlarınızı əlavə edə, bronları idarə edə bilərsiniz.</p>
        </div>
      )}
    </div>
  );
}
