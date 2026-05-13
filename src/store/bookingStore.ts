import { create } from "zustand";

interface BookingStore {
  step: number;
  placeId: string | null;
  date: Date | null;
  participants: number;
  setStep: (step: number) => void;
  setPlaceId: (id: string) => void;
  setDate: (date: Date) => void;
  setParticipants: (n: number) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  step: 0,
  placeId: null,
  date: null,
  participants: 1,
  setStep: (step) => set({ step }),
  setPlaceId: (placeId) => set({ placeId }),
  setDate: (date) => set({ date }),
  setParticipants: (participants) => set({ participants }),
  reset: () => set({ step: 0, placeId: null, date: null, participants: 1 }),
}));
