'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  _count: {
    products: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Shop by Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of product categories and find exactly what you're looking for
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group w-full max-w-sm"
            >
              <Card className="h-full hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  {/* Category Image or Icon */}
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-14 h-14 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-3xl">
                        {getCategoryIcon(category.name)}
                      </div>
                    )}
                  </div>

                  {/* Category Name */}
                  <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}

                  {/* Product Count */}
                  <Badge variant="secondary" className="text-sm px-4 py-1 bg-primary/10 text-primary border-primary/20">
                    {category._count.products} products
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              Categories will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get category icons based on name
function getCategoryIcon(categoryName: string): string {
  const name = categoryName.toLowerCase()
  if (name.includes('electronic') || name.includes('tech')) return '📱'
  if (name.includes('fashion') || name.includes('clothing')) return '👗'
  if (name.includes('home') || name.includes('garden')) return '🏠'
  if (name.includes('sport') || name.includes('fitness')) return '⚽'
  if (name.includes('book')) return '📚'
  if (name.includes('beauty') || name.includes('cosmetic')) return '💄'
  if (name.includes('food') || name.includes('beverage')) return '🍽️'
  if (name.includes('health') || name.includes('wellness')) return '💊'
  if (name.includes('toy') || name.includes('game')) return '🎮'
  if (name.includes('car') || name.includes('auto')) return '🚗'
  return '📦' // Default icon
}
