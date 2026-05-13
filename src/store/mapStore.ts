import { create } from "zustand";

interface MapStore {
  selectedPlaceId: string | null;
  activeCategory: string;
  setSelectedPlace: (id: string | null) => void;
  setActiveCategory: (cat: string) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedPlaceId: null,
  activeCategory: "all",
  setSelectedPlace: (selectedPlaceId) => set({ selectedPlaceId }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
}));
