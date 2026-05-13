"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Plus, Upload, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import PlacePickerModal, { type PlacePick } from "@/components/map/PlacePickerModal";

const AMENITIES = ["WiFi", "Parkinq", "Tualet", "Su", "Barbekü", "Uşaq üçün", "Qalaq", "Heyvanlar"];

export default function NewPlacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [picked, setPicked] = useState<PlacePick | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const apiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim();

  const geocodeAddress = async (addr: string) => {
    if (!apiKey) return null;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addr)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    const result = data?.results?.[0];
    if (!result?.geometry?.location) return null;
    return {
      address: result.formatted_address as string,
      lat: result.geometry.location.lat as number,
      lng: result.geometry.location.lng as number,
    };
  };

  const uploadPhotos = async () => {
    if (photoFiles.length === 0) return [] as string[];
    const formData = new FormData();
    photoFiles.forEach((file) => formData.append("files", file));
    const res = await fetch("/api/uploads", { method: "POST", body: formData });
    if (!res.ok) {
      throw new Error("Yükləmə xətası");
    }
    const data = await res.json();
    return Array.isArray(data?.urls) ? (data.urls as string[]) : [];
  };

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

    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const category = data.get("category") as string;

    const body = {
      name,
      description,
      category,
      address,
      price,
      depositAmount: price * 0.3,
      tourDuration,
      amenities: selectedAmenities,
      photos: [],
      lat: picked?.lat ?? null,
      lng: picked?.lng ?? null,
    };

    if (!body.name || !body.description || !body.category || !body.address || !body.price) {
      setError("Bütün məcburi sahələri doldurun");
      setLoading(false);
      return;
    }

    if (!body.lat || !body.lng) {
      const resolved = await geocodeAddress(body.address);
      if (!resolved) {
        setError("Ünvan xəritədə tapılmadı. Xəritədən seçin və ya ünvanı dəqiqləşdirin.");
        setLoading(false);
        return;
      }
      setPicked(resolved);
      body.address = resolved.address;
      body.lat = resolved.lat;
      body.lng = resolved.lng;
    }

    let uploaded: string[] = [];
    try {
      uploaded = await uploadPhotos();
    } catch {
      setError("Şəkillər yüklənmədi");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, photos: uploaded }),
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
          <div className="space-y-3">
            <label className="aspect-square rounded-xl border-2 border-dashed border-accent/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent/60 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []).slice(0, 5);
                  setPhotoFiles(files);
                }}
              />
              <Upload size={20} className="text-muted" />
              <span className="text-xs text-muted">Şəkil seç (1-5)</span>
            </label>
            {photoFiles.length > 0 && (
              <div className="space-y-2">
                {photoFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-muted border border-accent/10 rounded-lg px-3 py-2">
                    <span className="truncate">{file.name}</span>
                    <button type="button" onClick={() => setPhotoFiles(photoFiles.filter((_, idx) => idx !== i))} className="text-muted hover:text-accent">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            <Input
              name="address"
              placeholder="məs. Şəki, Azərbaycan"
              required
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setPicked(null);
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full flex items-center justify-center gap-2 border border-accent/30 rounded-xl py-3 text-accent text-sm font-semibold hover:bg-accent/10 transition-colors"
          >
            <MapPin size={16} /> Xəritədə qeyd et
          </button>
          {picked ? (
            <p className="text-xs text-muted">Seçilmiş ünvan: {picked.address}</p>
          ) : null}
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

      <PlacePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        apiKey={apiKey}
        initial={picked}
        onSelect={(pick) => {
          setPicked(pick);
          setAddress(pick.address);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
