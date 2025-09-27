'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  _count: {
    products: number
  }
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands')
        if (!response.ok) {
          throw new Error('Failed to fetch brands')
        }
        const data = await response.json()
        setBrands(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brands')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Shop by Brands
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover products from your favorite brands and explore new ones
          </p>
        </div>

        {/* Brands Grid */}
        {brands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group w-full max-w-sm"
            >
              <Card className="h-full hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  {/* Brand Logo */}
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="max-w-18 max-h-18 object-contain"
                      />
                    ) : (
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Brand Name */}
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                    {brand.name}
                  </h3>

                  {/* Description */}
                  {brand.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {brand.description}
                    </p>
                  )}

                  {/* Product Count */}
                  <Badge variant="secondary" className="text-sm px-4 py-1 bg-blue-100 text-blue-700 border-blue-200">
                    {brand._count.products} products
                  </Badge>

                  {/* Website Link */}
                  {brand.website && (
                    <div className="text-sm text-blue-600 font-medium">
                      Visit Website →
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold mb-2">No brands found</h3>
            <p className="text-muted-foreground">
              Brands will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
