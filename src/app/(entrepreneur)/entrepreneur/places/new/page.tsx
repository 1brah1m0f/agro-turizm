"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Plus, Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

const AMENITIES = ["WiFi", "Parkinq", "Tualet", "Su", "Barbekü", "Uşaq üçün", "Qalaq", "Heyvanlar"];

export default function NewPlacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (a: string) =>
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const price = parseFloat(data.get("price") as string);
    const tourDuration = parseInt(data.get("tourDuration") as string) || 60;

    const body = {
      name: data.get("name") as string,
      description: data.get("description") as string,
      category: data.get("category") as string,
      address: data.get("address") as string,
      price,
      depositAmount: price * 0.3,
      tourDuration,
      amenities: selectedAmenities,
      photos: [],
    };

    if (!body.name || !body.description || !body.category || !body.address || !body.price) {
      setError("Bütün məcburi sahələri doldurun");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err?.error ?? "Xəta baş verdi");
      setLoading(false);
      return;
    }

    router.push("/entrepreneur/places");
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-muted hover:text-accent">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-serif text-2xl font-bold text-text-dark">Yeni Məkan Əlavə Et</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Photos placeholder */}
        <div className="bg-card rounded-xl p-5 border border-accent/10">
          <h2 className="font-semibold text-text-light mb-3">Şəkillər</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square rounded-xl border-2 border-dashed border-accent/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent/60 transition-colors">
              <Upload size={20} className="text-muted" />
              <span className="text-xs text-muted">Əsas şəkil</span>
            </div>
            {[1, 2].map(i => (
              <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-accent/20 flex items-center justify-center cursor-pointer hover:border-accent/40 transition-colors">
                <Plus size={18} className="text-muted/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-card rounded-xl p-5 border border-accent/10 space-y-4">
          <h2 className="font-semibold text-text-light mb-1">Əsas Məlumatlar</h2>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Məkan adı *</label>
            <Input name="name" placeholder="məs. Şəki Üzüm Bağı" required />
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Kateqoriya *</label>
            <Select name="category" required>
              <option value="">Seçin...</option>
              <option value="Ferma">Fermalar</option>
              <option value="Balıqçılıq">Balıqçılıq</option>
              <option value="Kamp">Kamp</option>
              <option value="At Minme">At Minmə</option>
              <option value="Ariciliq">Arıçılıq</option>
              <option value="Bag">Meyvə Yığımı</option>
            </Select>
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Təsvir *</label>
            <Textarea name="description" rows={4} placeholder="Məkanınız haqqında ətraflı yazın..." required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-light text-sm font-medium block mb-2">Qiymət (₼/nəfər) *</label>
              <Input name="price" type="number" min="1" placeholder="35" required />
            </div>
            <div>
              <label className="text-text-light text-sm font-medium block mb-2">Tur müddəti (dəq)</label>
              <Input name="tourDuration" type="number" min="15" placeholder="60" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-card rounded-xl p-5 border border-accent/10 space-y-4">
          <h2 className="font-semibold text-text-light mb-1">Məkan</h2>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Ünvan *</label>
            <Input name="address" placeholder="məs. Şəki, Azərbaycan" required />
          </div>
          <button type="button" className="w-full flex items-center justify-center gap-2 border border-accent/30 rounded-xl py-3 text-accent text-sm font-semibold hover:bg-accent/10 transition-colors">
            <MapPin size={16} /> Xəritədə qeyd et
          </button>
        </div>

        {/* Amenities */}
        <div className="bg-card rounded-xl p-5 border border-accent/10">
          <h2 className="font-semibold text-text-light mb-3">İmkanlar</h2>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map(a => (
              <label key={a} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                  className="accent-accent rounded"
                />
                <span className="text-text-light text-sm">{a}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={() => router.back()}>Ləğv et</Button>
          <Button type="submit" variant="gradient" size="lg" className="flex-1" disabled={loading}>
            {loading ? "Göndərilir..." : "Yer əlavə et"}
          </Button>
        </div>
      </form>
    </div>
  );
}
