'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react'

interface WishlistItem {
  id: string
  createdAt: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    images: { url: string; altText?: string }[]
    category: { name: string; slug: string }
    brand?: { name: string; slug: string }
    inventory: number
    isFeatured: boolean
    averageRating?: number
    reviewCount?: number
  }
}

interface WishlistResponse {
  wishlistItems: WishlistItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin?callbackUrl=/wishlist')
      return
    }

    fetchWishlist()
  }, [session, status, router])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist')
      
      if (response.ok) {
        const data: WishlistResponse = await response.json()
        setWishlistItems(data.wishlistItems)
      } else {
        throw new Error('Failed to fetch wishlist')
      }
    } catch (err) {
      setError('Failed to load wishlist items')
      console.error('Error fetching wishlist:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingId(productId)
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
      } else {
        alert('Failed to remove item from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      alert('Failed to remove item from wishlist')
    } finally {
      setRemovingId(null)
    }
  }

  const handleToggleWishlist = (productId: string) => {
    handleRemoveFromWishlist(productId)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null // Redirecting
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {wishlistItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding items to your wishlist by clicking the heart icon on products you love!
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/products">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/new-arrivals">
                  New Arrivals
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Wishlist Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard
                  product={item.product}
                  onToggleWishlist={handleToggleWishlist}
                  isInWishlist={true}
                />
                {removingId === item.product.id && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Wishlist Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/products">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/new-arrivals">
                    Browse New Arrivals
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/deals">
                    View Deals
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
