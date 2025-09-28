'use client'

import { useState, useEffect } from 'react'
import { ReviewCard } from './review-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, MessageSquare } from 'lucide-react'

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

interface ReviewListProps {
  productId: string
  initialReviews?: Review[]
  showTitle?: boolean
  limit?: number
}

export function ReviewList({ 
  productId, 
  initialReviews = [], 
  showTitle = true,
  limit = 10 
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchReviews()
    }
  }, [productId, initialReviews.length])

  const fetchReviews = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      setError('')

      const response = await fetch(
        `/api/reviews?productId=${productId}&page=${pageNum}&limit=${limit}`
      )

      if (response.ok) {
        const data = await response.json()
        
        if (append) {
          setReviews(prev => [...prev, ...data.reviews])
        } else {
          setReviews(data.reviews)
        }
        
        setHasMore(data.pagination.page < data.pagination.totalPages)
        setPage(pageNum)
      } else {
        throw new Error('Failed to fetch reviews')
      }
    } catch (err) {
      setError('Failed to load reviews')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchReviews(page + 1, true)
    }
  }

  const refresh = () => {
    setPage(1)
    setHasMore(true)
    fetchReviews(1, false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading reviews...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refresh} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews ({reviews.length})
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? '' : 'pt-6'}>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <ReviewCard 
                key={review.id} 
                review={review}
                compact={index > 2} // Show compact view for reviews after the first 3
              />
            ))}
            
            {hasMore && (
              <div className="text-center pt-4">
                <Button 
                  onClick={loadMore} 
                  variant="outline"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Reviews'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
