"use client";

import { useEffect, useMemo, useState } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const AZ_CENTER = { lat: 40.8, lng: 47.5 };

export interface PlacePick {
  lat: number;
  lng: number;
  address: string;
}

interface PlacePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (pick: PlacePick) => void;
  apiKey: string;
  initial?: { lat: number; lng: number; address?: string } | null;
}

function PickerMarker({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google?.maps?.marker || !position) return;
    const el = document.createElement("div");
    el.innerHTML = "<div style=\"width:18px;height:18px;border-radius:50%;background:#16a34a;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25)\"></div>";
    const marker = new google.maps.marker.AdvancedMarkerElement({ position, map, content: el, zIndex: 10 });
    return () => { marker.map = null; };
  }, [map, position]);

  return null;
}

export default function PlacePickerModal({ open, onClose, onSelect, apiKey, initial }: PlacePickerModalProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const center = useMemo(() => position ?? initial ?? AZ_CENTER, [position, initial]);

  useEffect(() => {
    if (!open) return;
    setPosition(initial ? { lat: initial.lat, lng: initial.lng } : null);
    setAddress(initial?.address ?? "");
  }, [open, initial]);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const formatted = data?.results?.[0]?.formatted_address ?? "";
      setAddress(formatted);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Xəritədə məkan seç">
      {!apiKey ? (
        <div className="text-sm text-red-400">Google Maps API açarı tapılmadı.</div>
      ) : (
        <div className="space-y-4">
          <div className="h-80 rounded-xl overflow-hidden border border-accent/10">
            <APIProvider apiKey={apiKey} libraries={["marker"]}>
              <Map
                defaultCenter={center}
                defaultZoom={9}
                gestureHandling="greedy"
                disableDefaultUI
                className="w-full h-full"
                onClick={(e) => {
                  const latLng = e.detail.latLng;
                  if (!latLng) return;
                  const { lat, lng } = latLng;
                  setPosition({ lat, lng });
                  void reverseGeocode(lat, lng);
                }}
              >
                <PickerMarker position={position} />
              </Map>
            </APIProvider>
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
      )}
    </Modal>
  );
}
