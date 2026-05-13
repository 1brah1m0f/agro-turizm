"use client";

import { useState } from "react";
import { MapPin, Heart, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";

const filters = ["Hamısı", "Fermalar", "Balıqçılıq", "Kamp", "At Minmə"];

const activities = [
  { title: "Üzümçülük Dərsləri", category: "Fermalar", location: "Şəki, Azərbaycan", rating: 4.9, reviews: 32, price: 45, duration: "4 saat", emoji: "🍇", desc: "Qədim üzüm bağlarında yerli fermerlərlə birgə üzüm yığımı." },
  { title: "Meyvə Yığımı Festivalı", category: "Məhsul Yığımı", location: "Quba, Azərbaycan", rating: 4.7, reviews: 48, price: 30, duration: "3 saat", emoji: "🍎", desc: "Quba meyvə bağlarında alma, armud yığımında iştirak et." },
  { title: "Dağ Ferması Turu", category: "Fermalar", location: "Qax, Azərbaycan", rating: 4.8, reviews: 21, price: 55, duration: "6 saat", emoji: "⛰️", desc: "Şəlalə kənarındakı dağ fermasını kəşf et." },
  { title: "Yaşıl Texnologiya Ferması", category: "Fermalar", location: "Gəncə, Azərbaycan", rating: 4.6, reviews: 15, price: 25, duration: "2 saat", emoji: "🌿", desc: "Müasir ekoloji ferma texnologiyaları ilə tanış ol." },
];

export default function PopularActivities() {
  const [active, setActive] = useState("Hamısı");

  return (
    <section id="activities" className="bg-primary-light py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3">
          <div>
            <Badge variant="accent" className="mb-3">Kəşf Et</Badge>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-dark">Populyar Fəaliyyətlər</h2>
          </div>
          <button className="flex items-center gap-1 text-accent text-sm font-semibold hover:underline">
            Bütün Fəaliyyətlər <ChevronRight size={16} />
          </button>
        </div>
        <p className="text-muted mb-8 max-w-2xl">Azərbaycanda ən çox sevilən aqroturizm aktivlikləri</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button key={f} onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === f ? "bg-accent text-white" : "border border-muted/40 text-muted hover:border-accent hover:text-text-dark"
              }`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activities.map((act, i) => (
            <Card key={i} hover className="flex flex-col">
              <div className="relative h-44 bg-gradient-dark overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-60">{act.emoji}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="accent" className="text-[10px]">{act.category}</Badge>
                </div>
                <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:text-accent transition-colors">
                  <Heart size={12} className="text-white" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1 bg-card">
                <h3 className="font-serif font-bold text-text-light mb-1">{act.title}</h3>
                <StarRating rating={act.rating} reviews={act.reviews} className="mb-2" />
                <div className="flex items-center gap-1 mb-2">
                  <MapPin size={11} className="text-muted" />
                  <span className="text-muted text-xs">{act.location}</span>
                </div>
                <p className="text-muted text-xs leading-relaxed mb-3 line-clamp-2">{act.desc}</p>
                <div className="mt-auto pt-3 border-t border-primary/10 flex items-center justify-between gap-2">
                  <Badge variant="price">₼{act.price}/nəfər</Badge>
                  <span className="text-muted text-xs">{act.duration}</span>
                  <Button size="sm">Bron Et</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
