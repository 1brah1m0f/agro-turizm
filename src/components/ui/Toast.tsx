"use client";

import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-card-hover text-sm font-medium",
      type === "success" ? "bg-card text-text-light border-l-4 border-accent" : "bg-card text-text-light border-l-4 border-red-500"
    )}>
      {type === "success" ? <CheckCircle size={18} className="text-accent" /> : <XCircle size={18} className="text-red-500" />}
      {message}
      <button onClick={onClose} className="ml-2 text-muted hover:text-text-light"><X size={14} /></button>
    </div>
  );
}
