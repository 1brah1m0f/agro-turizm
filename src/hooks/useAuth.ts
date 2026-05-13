"use client";

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const isAuthenticated = user !== null;
  const isEntrepreneur = user?.role === "ENTREPRENEUR";
  const isAdmin = user?.role === "ADMIN";

  return { user, setUser, isAuthenticated, isEntrepreneur, isAdmin };
}
