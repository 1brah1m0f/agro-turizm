"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const AZ_CENTER: [number, number] = [40.8, 47.5];
const TILE_URL    = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>';

export interface PlacePick {
  lat: number;
  lng: number;
  address: string;
}

interface PlacePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (pick: PlacePick) => void;
  initial?: { lat: number; lng: number; address?: string } | null;
}

export default function PlacePickerModal({ open, onClose, onSelect, initial }: PlacePickerModalProps) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance  = useRef<L.Map | null>(null);
  const markerRef    = useRef<L.Marker | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress]   = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!open) return;
    setPosition(initial ? { lat: initial.lat, lng: initial.lng } : null);
    setAddress(initial?.address ?? "");
  }, [open, initial]);

  useEffect(() => {
    if (!open || !mapRef.current || mapInstance.current) return;
    const center: [number, number] = initial ? [initial.lat, initial.lng] : AZ_CENTER;
    const map = L.map(mapRef.current, { center, zoom: initial ? 12 : 7, zoomControl: false });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, subdomains: "abc", maxZoom: 19 }).addTo(map);
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      void reverseGeocode(lat, lng);
    });
    mapInstance.current = map;
    setTimeout(() => map.invalidateSize(), 50);
    return () => { map.remove(); mapInstance.current = null; markerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !position) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([position.lat, position.lng]);
    } else {
      const icon = L.divIcon({
        html: '<div style="width:18px;height:18px;border-radius:50%;background:#16a34a;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25)"></div>',
        className: "", iconSize: [18, 18], iconAnchor: [9, 9],
      });
      markerRef.current = L.marker([position.lat, position.lng], { icon }).addTo(map);
    }
  }, [position]);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await res.json();
      setAddress(data?.display_name ?? "");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Xəritədə məkan seç">
      <div className="space-y-4">
        <div className="h-80 rounded-xl overflow-hidden border border-accent/10">
          <div ref={mapRef} className="w-full h-full" />
        </div>
        <div className="text-xs text-muted">
          {loading ? "Ünvan tapılır..." : address ? `Seçilmiş ünvan: ${address}` : "Xəritəyə klikləyin və ünvan seçin."}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Bağla</Button>
          <Button
            variant="gradient"
            className="flex-1"
            disabled={!position || !address}
            onClick={() => position && address && onSelect({ lat: position.lat, lng: position.lng, address })}
          >
            Seç
          </Button>
        </div>
      </div>
    </Modal>
  );
}
