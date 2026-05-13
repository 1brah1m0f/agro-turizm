"use client";

import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "dark" | "gradient";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 cursor-pointer select-none",
          "hover:scale-[1.03] active:scale-[0.98]",
          {
            "bg-accent text-text-light hover:bg-accent-dark": variant === "primary",
            "border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-text-light": variant === "ghost",
            "bg-primary-dark text-text-dark hover:brightness-110": variant === "dark",
            "bg-gradient-main text-white hover:brightness-110 shadow-card": variant === "gradient",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
