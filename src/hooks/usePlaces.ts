"use client";

import { useState, useEffect } from "react";

export function usePlaces(params?: { category?: string; search?: string }) {
  const [places, setPlaces] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL("/api/places", window.location.origin);
    if (params?.category) url.searchParams.set("category", params.category);
    if (params?.search) url.searchParams.set("search", params.search);

    setLoading(true);
    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        setPlaces(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError("Məkanlar yüklənmədi"))
      .finally(() => setLoading(false));
  }, [params?.category, params?.search]);

  return { places, loading, error };
}
