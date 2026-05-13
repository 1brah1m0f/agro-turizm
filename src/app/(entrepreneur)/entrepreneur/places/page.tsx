"use client";

import { useEffect, useState } from "react";
import { Plus, Star, Eye, Edit2, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";

interface Place {
  id: string;
  name: string;
  category: string;
  price: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  avgRating: number;
  reviewCount: number;
  bookingCount: number;
}

const categoryEmoji: Record<string, string> = {
  Ferma: "🌾", Kamp: "⛺", "At Minme": "🐴", Ariciliq: "🍯", Bag: "🍎", Aricilıq: "🍯",
};

export default function EntrepreneurPlacesPage() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/entrepreneur/places")
      .then((r) => r.json())
      .then((data) => setPlaces(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-text-dark">Məkanlarım</h1>
        <Link href="/entrepreneur/places/new">
          <Button variant="gradient" size="sm"><Plus size={14} /> Yeni Məkan</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : places.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏡</p>
          <p className="text-muted mb-4">Hələ məkan əlavə etməmisiniz</p>
          <Link href="/entrepreneur/places/new">
            <Button variant="gradient">İlk Məkanı Əlavə Et</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {places.map(place => (
            <div key={place.id} className="bg-card rounded-xl p-5 shadow-card border border-accent/10">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-dark flex items-center justify-center text-3xl flex-shrink-0">
                  {categoryEmoji[place.category] ?? "🌿"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-text-light">{place.name}</h3>
                      <p className="text-muted text-xs">{place.category} · ₼{place.price}/nəfər</p>
                    </div>
                    <div>
                      {place.status === "PENDING" && <Badge variant="amber" className="text-[10px]">Gözlənilir</Badge>}
                      {place.status === "APPROVED" && <Badge variant="accent" className="text-[10px]">Aktiv</Badge>}
                      {place.status === "REJECTED" && <Badge variant="red" className="text-[10px]">Rədd edildi</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                    {place.avgRating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star size={11} className="fill-accent text-accent" /> {place.avgRating.toFixed(1)} ({place.reviewCount})
                      </span>
                    )}
                    <span>{place.bookingCount} bron</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/10">
                <button
                  onClick={() => router.push(`/place/${place.id}`)}
                  className="flex items-center gap-1.5 text-xs text-muted border border-muted/20 rounded-lg px-3 py-2 hover:border-accent/40 hover:text-accent transition-colors">
                  <Eye size={13} /> Bax
                </button>
                <Link href={`/entrepreneur/places/${place.id}`}>
                  <button className="flex items-center gap-1.5 text-xs text-muted border border-muted/20 rounded-lg px-3 py-2 hover:border-accent/40 hover:text-accent transition-colors">
                    <Edit2 size={13} /> Redaktə
                  </button>
                </Link>
                <button
                  onClick={async () => {
                    const url = `${window.location.origin}/place/${place.id}`;
                    try {
                      await navigator.clipboard.writeText(url);
                      setToast({ message: "Paylaşma linki kopyalandı", type: "success" });
                    } catch {
                      setToast({ message: "Link kopyalana bilmədi", type: "error" });
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs text-muted border border-muted/20 rounded-lg px-3 py-2 hover:border-accent/40 hover:text-accent transition-colors">
                  <Share2 size={13} /> Paylaş
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast ? (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      ) : null}
    </div>
  );
}
