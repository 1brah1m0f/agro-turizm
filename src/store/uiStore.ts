import { create } from "zustand";

interface UIStore {
  toastMessage: string | null;
  toastType: "success" | "error";
  showToast: (message: string, type?: "success" | "error") => void;
  hideToast: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  toastMessage: null,
  toastType: "success",
  showToast: (message, type = "success") => set({ toastMessage: message, toastType: type }),
  hideToast: () => set({ toastMessage: null }),
}));
