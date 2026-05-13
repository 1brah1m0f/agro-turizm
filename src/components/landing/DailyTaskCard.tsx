"use client";

import { Flame, Leaf, MapPin, Coins } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

export default function DailyTaskCard() {
  return (
    <div className="relative bg-card rounded-[20px] shadow-card-hover p-6 w-full max-w-sm border border-accent/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-accent" />
          <span className="font-semibold text-text-light text-sm">Günlük Tapşırıq</span>
        </div>
        <Badge variant="accent" className="text-[10px]">Aktiv</Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Leaf size={14} className="text-accent" />
          </div>
          <span className="font-semibold text-text-light">Meyvə Yığımı</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-muted" />
          <span className="text-muted text-xs">Quba, Azərbaycan</span>
        </div>
      </div>

      <ProgressBar value={65} className="mb-4" />

      <div className="flex items-center gap-2 mb-4">
        <Coins size={16} className="text-accent" />
        <Badge variant="accent" className="text-xs">+50 KOİN</Badge>
      </div>

      <Button className="w-full" variant="gradient">Qəbul Et</Button>
    </div>
  );
}
