import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  current: number;
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
            i < current ? "bg-accent text-text-light" : i === current ? "bg-accent text-text-light" : "bg-primary-light text-muted"
          )}>
            {i < current ? <Check size={14} /> : i + 1}
          </div>
          <span className={cn("text-sm hidden sm:block", i === current ? "text-text-dark" : "text-muted")}>{label}</span>
          {i < steps.length - 1 && <div className={cn("h-px w-8 flex-1", i < current ? "bg-accent" : "bg-primary-light")} />}
        </div>
      ))}
    </div>
  );
}
