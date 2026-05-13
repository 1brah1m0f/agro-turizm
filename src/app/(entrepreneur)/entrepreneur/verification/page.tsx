"use client";

import { CheckCircle, Clock, Upload, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const status = "pending";

const docs = [
  { id: "id", label: "Şəxsiyyət vəsiqəsi / Pasport", done: true },
  { id: "photos", label: "Ferma / Yer şəkilləri", done: true },
  { id: "location", label: "Məkan göstərilməsi", done: false },
  { id: "phone", label: "Telefon doğrulaması", done: true },
  { id: "social", label: "Sosial media linklər (istəyə bağlı)", done: false, optional: true },
];

const lockedFeatures = ["Yer dərc etmək", "Bronları qəbul etmək", "Ödənişlər"];

export default function EntrepreneurVerificationPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">Doğrulama</h1>

      <div className={cn(
        "flex items-center gap-3 rounded-xl px-5 py-4 mb-6 border",
        status === "pending"
          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
          : "bg-accent/10 border-accent/30 text-accent"
      )}>
        {status === "pending" ? <Clock size={20} /> : <CheckCircle size={20} />}
        <div>
          <p className="font-semibold">{status === "pending" ? "Hesabınız yoxlanılır" : "Hesabınız Təsdiqləndi"}</p>
          <p className="text-sm opacity-70">{status === "pending" ? "24-48 saat ərzində nəticə bildiriləcək" : "Bütün xüsusiyyətlər açıqdır"}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-accent/10 mb-5">
        <h2 className="font-semibold text-text-light mb-4">Tələb olunan sənədlər</h2>
        <div className="space-y-3">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center gap-3 py-2 border-b border-primary/10 last:border-0">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                doc.done ? "bg-accent text-white" : "border-2 border-muted")}>
                {doc.done && <CheckCircle size={14} />}
              </div>
              <span className={cn("flex-1 text-sm", doc.done ? "text-text-light" : "text-muted")}>
                {doc.label}
                {doc.optional && <span className="text-xs opacity-50 ml-1">(istəyə bağlı)</span>}
              </span>
              {!doc.done && (
                <button className="flex items-center gap-1.5 text-xs text-accent border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors">
                  <Upload size={12} /> Yüklə
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {status === "pending" && (
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

      <Button variant="gradient" size="lg">Sənədləri Göndər</Button>
    </div>
  );
}
