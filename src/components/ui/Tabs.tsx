"use client";

import { cn } from "@/lib/utils/cn";
import { useState } from "react";

interface Tab { id: string; label: string; }

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
}

export default function Tabs({ tabs, defaultTab, children }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  return (
    <div>
      <div className="flex gap-1 p-1 rounded-xl bg-primary-light w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              active === tab.id ? "bg-accent text-text-light" : "text-muted hover:text-text-dark"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children(active)}</div>
    </div>
  );
}
