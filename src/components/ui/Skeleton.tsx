import { cn } from "@/lib/utils/cn";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-primary-light/60", className)} />
  );
}
