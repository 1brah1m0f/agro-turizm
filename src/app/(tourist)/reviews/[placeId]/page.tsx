"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ArrowLeft, Camera } from "lucide-react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { cn } from "@/lib/utils/cn";

const ratingLabels = ["", "Pis", "Orta", "Yaxşı", "Çox yaxşı", "Əla!"];

export default function ReviewPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeId, rating, body: comment }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Xəta baş verdi");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">⭐</div>
        <h2 className="font-serif text-xl font-bold text-text-dark mb-2">Rəyiniz üçün təşəkkür!</h2>
        <p className="text-muted text-sm mb-2">+20 koin qazandınız</p>
        <div className="bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 mt-2 mb-6">
          <span className="text-accent font-bold">+20 KOİN</span>
        </div>
        <button onClick={() => router.push("/bookings")} className="text-accent text-sm font-semibold hover:underline">
          Bronlarıma qayıt
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="bg-primary-dark px-4 py-4 flex items-center gap-3 border-b border-accent/10">
        <button onClick={() => router.back()} className="text-muted hover:text-accent">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-serif text-lg font-bold text-text-dark">Rəy Yaz</h1>
      </div>

      <div className="px-4 pt-5 space-y-5">
        <div className="bg-card rounded-xl p-5 border border-accent/10 text-center">
          <p className="text-muted text-sm mb-4">Təcrübənizi qiymətləndirin</p>
          <div className="flex justify-center gap-3 mb-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}>
                <Star
                  size={36}
                  className={cn("transition-all", (hover || rating) >= n ? "fill-accent text-accent scale-110" : "text-muted")}
                />
              </button>
            ))}
          </div>
          {(hover || rating) > 0 && (
            <p className="text-accent font-semibold text-sm">{ratingLabels[hover || rating]}</p>
          )}
        </div>

        <div className="bg-card rounded-xl p-4 border border-accent/10">
          <label className="text-text-light text-sm font-medium block mb-2">Şərhiniz *</label>
          <Textarea
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Təcrübənizi digər turistlərlə paylaşın..."
            maxLength={500}
          />
          <p className="text-muted text-xs text-right mt-1">{comment.length}/500</p>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-card rounded-xl py-4 border-2 border-dashed border-accent/30 text-muted hover:border-accent/60 hover:text-accent transition-colors">
          <Camera size={18} />
          <span className="text-sm">Şəkil əlavə et (istəyə bağlı)</span>
        </button>

        <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-xl px-4 py-3">
          <span className="text-2xl">🪙</span>
          <p className="text-accent text-sm">Bu rəy üçün <strong>+20 koin</strong> qazanacaqsınız</p>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <Button
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={rating === 0 || !comment.trim() || loading}
          onClick={handleSubmit}
        >
          {loading ? "Göndərilir..." : "Rəyi Göndər"}
        </Button>
      </div>
    </div>
  );
}
