import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "accent" | "primary" | "price" | "default" | "green" | "red" | "amber";
}

export default function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        {
          "bg-accent text-white": variant === "accent",
          "bg-primary text-text-dark border border-accent/30": variant === "primary",
          "bg-primary-dark text-accent border border-accent/30": variant === "price",
          "bg-primary-light/50 text-text-dark": variant === "default",
          "bg-green-500/20 text-green-300 border border-green-500/30": variant === "green",
          "bg-red-500/20 text-red-300 border border-red-500/30": variant === "red",
          "bg-amber-500/20 text-amber-300 border border-amber-500/30": variant === "amber",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
