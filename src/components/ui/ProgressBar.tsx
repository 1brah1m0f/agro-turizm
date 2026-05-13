import { cn } from "@/lib/utils/cn";

interface ProgressBarProps {
  value: number;
  className?: string;
}

export default function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={cn("h-1.5 rounded-full bg-primary-dark overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-accent transition-all duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
