'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

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
  createdAt: string
}

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        // Fetch latest products (created in the last 30 days or the most recent 20 products)
        const response = await fetch('/api/products?sortBy=createdAt&sortOrder=desc&limit=20')
        if (!response.ok) {
          throw new Error('Failed to fetch new arrivals')
        }
        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load new arrivals')
      } finally {
        setLoading(false)
      }
    }

    fetchNewArrivals()
  }, [])

  const handleToggleWishlist = (productId: string) => {
    // TODO: Implement wishlist functionality
    console.log('Toggle wishlist:', productId)
  }

  const isNewArrival = (createdAt: string) => {
    const productDate = new Date(createdAt)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return productDate > thirtyDaysAgo
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              New Arrivals
            </h1>
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm px-3 py-1">
              Latest Products
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our latest collection of products just added to our store
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border-0">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-bold text-primary">{products.length}</div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => isNewArrival(p.createdAt)).length}
              </div>
              <div className="text-sm text-muted-foreground">Added This Month</div>
            </div>
          </div>
          <Badge variant="outline">
            Updated {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                product={product}
                onToggleWishlist={handleToggleWishlist}
              />
              {/* New Badge for recent products */}
              {isNewArrival(product.createdAt) && (
                <Badge 
                  variant="default" 
                  className="absolute top-2 left-2 bg-green-500 hover:bg-green-500 z-10"
                >
                  NEW
                </Badge>
              )}
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No new arrivals yet</h3>
            <p className="text-muted-foreground">
              New products will appear here as they are added to our store.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Be the first to know about new arrivals and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
