
"use client"

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  reputation: number;
  className?: string;
  showScore?: boolean;
}

export function StarRating({ reputation, className, showScore = false }: StarRatingProps) {
  // Convert 0-100 reputation to 0-5 stars
  const rating = Math.min(5, Math.max(0, reputation / 20));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFull = i < fullStars;
          const isHalf = !isFull && i === fullStars && hasHalfStar;
          
          return (
            <div key={i} className="relative">
              <Star 
                className={cn(
                  "w-3 h-3 transition-colors",
                  isFull ? "fill-primary text-primary" : "text-white/10"
                )} 
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showScore && (
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {rating.toFixed(1)} / 5.0
        </span>
      )}
    </div>
  );
}
