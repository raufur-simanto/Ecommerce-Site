'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleStarClick = (starRating: number) => {
    if (interactive && onChange) {
      onChange(starRating)
    }
  }

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating

  return (
    <div 
      className={cn('flex items-center gap-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= displayRating
        const isPartial = !interactive && starValue === Math.ceil(displayRating) && displayRating % 1 !== 0

        return (
          <button
            key={index}
            type="button"
            className={cn(
              sizeClasses[size],
              interactive
                ? 'cursor-pointer transition-colors hover:scale-110'
                : 'cursor-default',
              'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 rounded-sm'
            )}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            disabled={!interactive}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isPartial
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300',
                interactive && hoverRating >= starValue && 'fill-yellow-500 text-yellow-500'
              )}
            />
          </button>
        )
      })}
      {!interactive && (
        <span className="ml-1 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
