'use client'

import { formatDistanceToNow } from 'date-fns'
import { StarRating } from '@/components/ui/star-rating'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

interface Review {
  id: string
  rating: number
  title?: string
  content?: string
  createdAt: string
  isApproved: boolean
  user: {
    name: string
    image?: string
  }
}

interface ReviewCardProps {
  review: Review
  showApprovalStatus?: boolean
  compact?: boolean
}

export function ReviewCard({ review, showApprovalStatus = false, compact = false }: ReviewCardProps) {
  const userInitials = review.user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  const timeAgo = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })

  if (compact) {
    return (
      <div className="border-b pb-4 last:border-b-0 last:pb-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="font-medium text-sm">{review.user.name}</span>
            {showApprovalStatus && (
              <Badge variant={review.isApproved ? "default" : "secondary"} className="text-xs">
                {review.isApproved ? 'Approved' : 'Pending'}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
        
        {review.title && (
          <h4 className="font-medium text-sm mb-1">{review.title}</h4>
        )}
        
        {review.content && (
          <p className="text-sm text-muted-foreground line-clamp-3">{review.content}</p>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.user.image} alt={review.user.name} />
            <AvatarFallback>
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="font-medium">{review.user.name}</span>
                  {showApprovalStatus && (
                    <Badge variant={review.isApproved ? "default" : "secondary"}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  )}
                </div>
                
                {review.title && (
                  <h4 className="font-medium text-gray-900">{review.title}</h4>
                )}
              </div>
              
              <span className="text-sm text-muted-foreground">{timeAgo}</span>
            </div>

            {review.content && (
              <p className="text-muted-foreground">{review.content}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
