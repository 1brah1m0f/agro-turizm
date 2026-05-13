"use client";

import { useState, useEffect } from "react";

interface Coords { lat: number; lng: number; }

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation dəstəklənmir");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Konum alınamadı")
    );
  }, []);

  return { coords, error };
}
