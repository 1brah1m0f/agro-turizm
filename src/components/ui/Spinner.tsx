import { cn } from "@/lib/utils/cn";

export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("animate-spin rounded-full border-2 border-muted border-t-accent h-5 w-5", className)} />
  );
}
