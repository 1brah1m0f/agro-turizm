"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, Heart, MapPin, Star, CheckCircle, ChevronDown, Navigation } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

interface Review {
  id: string;
  rating: number;
  body: string;
  createdAt: string;
  user: { name: string };
}

interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  price: number;
  depositAmount: number;
  tourDuration: number;
  amenities: string[];
  avgRating: number;
  reviews: Review[];
  entrepreneur: { businessName: string; location: string };
}

export default function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/places/${id}`)
      .then((r) => r.json())
      .then((data) => setPlace(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!place || (place as { error?: string }).error) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">😕</p>
        <p className="text-muted">Məkan tapılmadı</p>
        <button onClick={() => router.back()} className="text-accent text-sm">Geri qayıt</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pb-24">
      <div className="relative h-72 bg-gradient-dark overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-60">🌿</div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <ArrowLeft size={18} />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
              <Share2 size={16} />
            </button>
            <button onClick={() => setLiked(!liked)}
              className={cn("w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors",
                liked ? "text-red-400" : "text-white")}>
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-3 left-4">
          <Badge variant="accent">{place.category}</Badge>
        </div>
      </div>

      <div className="bg-card rounded-t-3xl -mt-6 relative z-10 px-5 pt-6 pb-4 shadow-card border-t border-accent/10">
        <h1 className="font-serif text-2xl font-bold text-text-light mb-2">{place.name}</h1>

        <div className="flex items-center gap-3 mb-3">
          <StarRating rating={place.avgRating} reviews={place.reviews.length} />
          <div className="flex items-center gap-1 ml-auto">
            <MapPin size={12} className="text-muted" />
            <span className="text-muted text-xs">{place.entrepreneur.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="price">₼{place.price} / nəfər</Badge>
          <span className="text-muted text-sm">• {place.tourDuration} dəq</span>
        </div>

        <div className="flex items-center gap-3 py-3 border-t border-b border-primary/10 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-main flex items-center justify-center text-white font-bold">
            {place.entrepreneur.businessName[0]}
          </div>
          <div>
            <p className="text-text-light text-sm font-medium">{place.entrepreneur.businessName}</p>
            <p className="text-muted text-xs">Ferma sahibi</p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-accent text-xs font-semibold">
            <CheckCircle size={14} /> Doğrulanmış
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-serif font-semibold text-text-light mb-2">Haqqında</h2>
          <p className={cn("text-muted text-sm leading-relaxed", !expanded && "line-clamp-3")}>
            {place.description}
          </p>
          <button onClick={() => setExpanded(!expanded)} className="text-accent text-xs font-semibold mt-1 flex items-center gap-1">
            {expanded ? "Az göstər" : "Daha çox"} <ChevronDown size={12} className={expanded ? "rotate-180" : ""} />
          </button>
        </div>

        {place.amenities.length > 0 && (
          <div className="mb-4">
            <h2 className="font-serif font-semibold text-text-light mb-3">İmkanlar</h2>
            <div className="flex flex-wrap gap-2">
              {place.amenities.map((a) => (
                <span key={a} className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2 border border-accent/10 text-xs text-text-light">
                  🌿 {a}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="font-serif font-semibold text-text-light mb-3">Məkan</h2>
          <div className="h-36 bg-gradient-dark rounded-xl flex items-center justify-center text-4xl mb-3 border border-accent/10">
            🗺️
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-muted" />
              <span className="text-muted text-sm">{place.address}</span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-accent text-sm font-semibold border border-accent/30 rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors">
              <Navigation size={14} /> Yol göstər
            </a>
          </div>
        </div>

        {place.reviews.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif font-semibold text-text-light">Rəylər</h2>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-2xl text-accent">{place.avgRating.toFixed(1)}</span>
                <div className="flex flex-col">
                  <StarRating rating={place.avgRating} />
                  <span className="text-xs text-muted">{place.reviews.length} rəy</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {place.reviews.map((rev) => (
                <div key={rev.id} className="bg-primary/10 rounded-xl p-4 border border-accent/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center text-white text-xs font-bold">
                      {rev.user.name[0]}
                    </div>
                    <div>
                      <p className="text-text-light text-sm font-medium">{rev.user.name}</p>
                      <p className="text-muted text-xs">{new Date(rev.createdAt).toLocaleDateString("az-AZ")}</p>
                    </div>
                    <StarRating rating={rev.rating} className="ml-auto" />
                  </div>
                  <p className="text-muted text-sm">{rev.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-accent/10 px-4 py-3 flex items-center justify-between z-30">
        <div>
          <span className="font-bold text-xl text-text-light font-serif">₼{place.price}</span>
          <span className="text-muted text-sm"> / nəfər</span>
        </div>
        <Button variant="gradient" size="lg" onClick={() => router.push(`/booking/${place.id}`)}>
          Bron Et
        </Button>
      </div>
    </div>
  );
}
