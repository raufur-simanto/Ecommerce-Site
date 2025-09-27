'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Percent, Tag } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: { url: string; altText?: string }[]
  category: { name: string; slug: string }
  brand?: { name: string }
  inventory: number
  isFeatured: boolean
  averageRating?: number
  reviewCount?: number
}

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Fetch products that have comparePrice (indicating a discount)
        const response = await fetch('/api/products?sortBy=price&sortOrder=asc&limit=24')
        if (!response.ok) {
          throw new Error('Failed to fetch deals')
        }
        const data = await response.json()
        // Filter products that have comparePrice (deals)
        const dealsProducts = data.products?.filter((p: Product) => p.comparePrice && p.comparePrice > p.price) || []
        setProducts(dealsProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals')
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  const handleToggleWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', productId)
  }

  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Deals & Offers
            </h1>
            <Badge variant="secondary" className="bg-red-100 text-red-800 text-sm px-3 py-1">
              <Tag className="w-3 h-3 mr-1" />
              Limited Time
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on these amazing deals and special offers
          </p>
        </div>

        {/* Deals Banner */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardContent className="p-6 text-center">
            <Percent className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-1">Up to 50% Off</h3>
            <p className="text-sm opacity-90">Selected items</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-1">Flash Sale</h3>
            <p className="text-sm opacity-90">24 hours only</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <CardContent className="p-6 text-center">
            <Tag className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-1">Free Shipping</h3>
            <p className="text-sm opacity-90">On orders over $50</p>
          </CardContent>
        </Card>
      </div>

        {/* Stats */}
        {products.length > 0 && (
          <div className="mb-12 p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border-0">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold text-primary">{products.length}</div>
                <div className="text-sm text-muted-foreground">Products on Sale</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Math.max(...products.map(p => p.comparePrice ? calculateDiscount(p.price, p.comparePrice) : 0))}%
                </div>
                <div className="text-sm text-muted-foreground">Max Discount</div>
              </div>
            </div>
            <Badge variant="outline" className="text-red-600 border-red-200">
              <Clock className="w-3 h-3 mr-1" />
              Limited Time Offers
            </Badge>
          </div>
        </div>
      )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onToggleWishlist={handleToggleWishlist}
              />
              {/* Discount Badge */}
              {product.comparePrice && (
                <Badge 
                  variant="default" 
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-500 z-10"
                >
                  -{calculateDiscount(product.price, product.comparePrice)}%
                </Badge>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold mb-2">No active deals</h3>
            <p className="text-muted-foreground">
              Check back soon for amazing deals and special offers!
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to get notified about flash sales and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
