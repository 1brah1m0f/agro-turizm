"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Check, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";

interface EntrepreneurProfile {
  id: string;
  businessName: string;
  phone: string;
  category: string;
  location: string;
  description?: string;
  user: { name: string; email: string };
}

export default function VerificationsPage() {
  const [entrepreneurs, setEntrepreneurs] = useState<EntrepreneurProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/entrepreneurs")
      .then((r) => r.json())
      .then((data) => setEntrepreneurs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const approve = async (id: string) => {
    setActing(id);
    const res = await fetch(`/api/admin/entrepreneurs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: true }),
    });
    if (res.ok) {
      setEntrepreneurs((prev) => prev.filter((e) => e.id !== id));
    }
    setActing(null);
  };

  const reject = async (id: string) => {
    setActing(id);
    const res = await fetch(`/api/admin/entrepreneurs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: false }),
    });
    if (res.ok) {
      setEntrepreneurs((prev) => prev.filter((e) => e.id !== id));
    }
    setActing(null);
  };

  return (
    <div className="p-6">
      <h1 className="font-serif text-2xl font-bold text-text-dark mb-6">Sahibkar Yoxlaması</h1>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : entrepreneurs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-muted">Gözləyən müraciət yoxdur</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entrepreneurs.map(item => (
            <div key={item.id} className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-semibold text-text-light">{item.businessName}</h3>
                  <p className="text-muted text-sm">{item.user.name} · {item.user.email}</p>
                  <p className="text-muted text-xs mt-1">{item.category} · {item.location} · {item.phone}</p>
                  {item.description && <p className="text-muted text-xs mt-1 line-clamp-2">{item.description}</p>}
                </div>
                <Badge variant="amber" className="text-xs"><Clock size={10} /> Gözlənilir</Badge>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button
                  disabled={acting === item.id}
                  onClick={() => approve(item.id)}
                  className="flex items-center gap-1.5 text-sm text-green-400 border border-green-500/30 rounded-lg px-3 py-2 bg-green-500/5 hover:bg-green-500/10 transition-colors disabled:opacity-50">
                  <CheckCircle size={14} /> {acting === item.id ? "..." : "Təsdiqlə"}
                </button>
                <button
                  disabled={acting === item.id}
                  onClick={() => reject(item.id)}
                  className="flex items-center gap-1.5 text-sm text-red-400 border border-red-500/30 rounded-lg px-3 py-2 bg-red-500/5 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                  <XCircle size={14} /> Rədd et
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
