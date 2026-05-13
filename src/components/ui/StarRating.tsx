import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  rating: number;
  reviews?: number;
  className?: string;
}

export default function StarRating({ rating, reviews, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < Math.round(rating) ? "fill-accent text-accent" : "text-muted"}
        />
      ))}
      {reviews !== undefined && (
        <span className="text-muted text-xs ml-1">({reviews} rəy)</span>
      )}
    </div>
  );
}
