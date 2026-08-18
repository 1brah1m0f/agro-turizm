"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, MapPin, Upload, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { type PlacePick } from "@/components/map/PlacePickerModal";

const PlacePickerModal = dynamic(() => import("@/components/map/PlacePickerModal"), { ssr: false });

const AMENITIES = ["WiFi", "Parkinq", "Tualet", "Su", "Barbekü", "Uşaq üçün", "Qalaq", "Heyvanlar"];

interface PlaceForm {
  name: string;
  description: string;
  category: string;
  address: string;
  price: string;
  tourDuration: string;
  amenities: string[];
}

export default function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PlaceForm>({
    name: "",
    description: "",
    category: "",
    address: "",
    price: "",
    tourDuration: "",
    amenities: [],
  });
  const [picked, setPicked] = useState<PlacePick | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { id } = await params;
      if (!mounted) return;
      setPlaceId(id);
      const res = await fetch(`/api/places/${id}`);
      const data = await res.json();
      if (!mounted) return;
      setForm({
        name: data?.name ?? "",
        description: data?.description ?? "",
        category: data?.category ?? "",
        address: data?.address ?? "",
        price: String(data?.price ?? ""),
        tourDuration: String(data?.tourDuration ?? ""),
        amenities: Array.isArray(data?.amenities) ? data.amenities : [],
      });
      setPhotoUrls(Array.isArray(data?.photos) ? data.photos : []);
      if (data?.lat && data?.lng) {
        setPicked({ lat: data.lat, lng: data.lng, address: data.address ?? "" });
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [params]);

  const geocodeAddress = async (addr: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(addr)}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await res.json();
    const result = data?.[0];
    if (!result) return null;
    return {
      address: result.display_name as string,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };
  };

  const toggleAmenity = (a: string) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
    }));

  const updateField = (key: keyof PlaceForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!placeId) return;
    setError(null);
    setSaving(true);

    const price = parseFloat(form.price);
    const tourDuration = parseInt(form.tourDuration) || 60;
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      address: form.address,
      price,
      depositAmount: price * 0.3,
      tourDuration,
      amenities: form.amenities,
      lat: picked?.lat ?? null,
      lng: picked?.lng ?? null,
      photos: photoUrls,
    };

    if (!payload.name || !payload.description || !payload.category || !payload.address || !payload.price) {
      setError("Bütün məcburi sahələri doldurun");
      setSaving(false);
      return;
    }

    if (!payload.lat || !payload.lng) {
      const resolved = await geocodeAddress(payload.address);
      if (!resolved) {
        setError("Ünvan xəritədə tapılmadı. Xəritədən seçin və ya ünvanı dəqiqləşdirin.");
        setSaving(false);
        return;
      }
      setPicked(resolved);
      payload.address = resolved.address;
      payload.lat = resolved.lat;
      payload.lng = resolved.lng;
    }

    let uploaded: string[] = [];
    try {
      uploaded = await uploadPhotos();
    } catch {
      setError("Şəkillər yüklənmədi");
      setSaving(false);
      return;
    }

    const res = await fetch(`/api/places/${placeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, photos: [...payload.photos, ...uploaded] }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err?.error ?? "Xəta baş verdi");
      setSaving(false);
      return;
    }

    router.push("/entrepreneur/places");
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner /></div>;
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-muted hover:text-accent">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-serif text-2xl font-bold text-text-dark">Məkanı Redaktə Et</h1>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
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
              <span className="text-xs text-muted">Yeni şəkil əlavə et</span>
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
            {photoUrls.length > 0 && (
              <div className="space-y-2">
                {photoUrls.map((url) => (
                  <div key={url} className="flex items-center justify-between text-xs text-muted border border-accent/10 rounded-lg px-3 py-2">
                    <span className="truncate">{url}</span>
                    <button type="button" onClick={() => setPhotoUrls(photoUrls.filter((u) => u !== url))} className="text-muted hover:text-accent">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="bg-card rounded-xl p-5 border border-accent/10 space-y-4">
          <h2 className="font-semibold text-text-light mb-1">Əsas Məlumatlar</h2>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Məkan adı *</label>
            <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
          </div>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Kateqoriya *</label>
            <Select value={form.category} onChange={(e) => updateField("category", e.target.value)} required>
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
            <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={4} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-text-light text-sm font-medium block mb-2">Qiymət (₼/nəfər) *</label>
              <Input value={form.price} onChange={(e) => updateField("price", e.target.value)} type="number" min="1" required />
            </div>
            <div>
              <label className="text-text-light text-sm font-medium block mb-2">Tur müddəti (dəq)</label>
              <Input value={form.tourDuration} onChange={(e) => updateField("tourDuration", e.target.value)} type="number" min="15" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 border border-accent/10 space-y-4">
          <h2 className="font-semibold text-text-light mb-1">Məkan</h2>
          <div>
            <label className="text-text-light text-sm font-medium block mb-2">Ünvan *</label>
            <Input
              value={form.address}
              onChange={(e) => {
                updateField("address", e.target.value);
                setPicked(null);
              }}
              required
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

        <div className="bg-card rounded-xl p-5 border border-accent/10">
          <h2 className="font-semibold text-text-light mb-3">İmkanlar</h2>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map(a => (
              <label key={a} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.amenities.includes(a)}
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
          <Button type="submit" variant="gradient" size="lg" className="flex-1" disabled={saving}>
            {saving ? "Yadda saxlanır..." : "Yadda saxla"}
          </Button>
        </div>
      </form>

      <PlacePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initial={picked}
        onSelect={(pick) => {
          setPicked(pick);
          setForm((prev) => ({ ...prev, address: pick.address }));
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
