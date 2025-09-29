'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, SlidersHorizontal, ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

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

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })

  // Get filters from URL parameters directly - no state needed
  const searchQuery = searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category') || ''
  const selectedBrand = searchParams.get('brand') || ''

  // Sync search input with URL param
  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder,
        ...(searchQuery && { q: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedBrand && { brand: selectedBrand })
      })

      console.log('Frontend - Fetching products with params:', {
        page: currentPage,
        sortBy,
        sortOrder,
        searchQuery,
        selectedCategory,
        selectedBrand
      })
      console.log('Frontend - Full URL:', `/api/products?${params}`)

      const response = await fetch(`/api/products?${params}`)
      const data: ProductsResponse = await response.json()
      
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, sortOrder, searchQuery, selectedCategory, selectedBrand])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchInput.trim()) {
      params.set('q', searchInput.trim())
    } else {
      params.delete('q')
    }
    params.delete('page') // Reset to page 1
    router.push(`/products?${params.toString()}`)
  }

  const handleToggleWishlist = async (productId: string) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      // Check current wishlist status
      const checkResponse = await fetch(`/api/wishlist/${productId}`)
      const checkData = await checkResponse.json()
      
      if (checkData.isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          alert('Product removed from wishlist')
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        })
        if (response.ok) {
          alert('Product added to wishlist')
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      alert('Failed to update wishlist')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-purple-600 flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-purple-600">
            Products
          </Link>
          {selectedCategory && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link href="/categories" className="hover:text-purple-600">
                Categories
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-purple-600 font-medium">
                {selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </>
          )}
          {selectedBrand && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link href="/brands" className="hover:text-purple-600">
                Brands
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-purple-600 font-medium">
                {selectedBrand.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </>
          )}
        </nav>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {selectedCategory ? `Category: ${selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` :
             selectedBrand ? `Brand: ${selectedBrand.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` :
             searchQuery ? `Search Results for "${searchQuery}"` :
             'All Products'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {selectedCategory ? `Browse products in ${selectedCategory.replace(/-/g, ' ')} category` :
             selectedBrand ? `Discover products from ${selectedBrand.replace(/-/g, ' ')} brand` :
             searchQuery ? `Found products matching "${searchQuery}"` :
             'Discover our amazing collection of products across all categories'}
          </p>
        </div>

        {/* Active Filters */}
        {(selectedCategory || selectedBrand || searchQuery) && (
          <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {selectedCategory && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer" 
                       onClick={() => {
                         const params = new URLSearchParams(searchParams.toString())
                         params.delete('category')
                         params.delete('page')
                         router.push(`/products?${params.toString()}`)
                       }}>
                  Category: {selectedCategory.replace(/-/g, ' ')} ✕
                </Badge>
              )}
              {selectedBrand && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                       onClick={() => {
                         const params = new URLSearchParams(searchParams.toString())
                         params.delete('brand')
                         params.delete('page')
                         router.push(`/products?${params.toString()}`)
                       }}>
                  Brand: {selectedBrand.replace(/-/g, ' ')} ✕
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="bg-pink-100 text-pink-800 hover:bg-pink-200 cursor-pointer"
                       onClick={() => {
                         const params = new URLSearchParams(searchParams.toString())
                         params.delete('q')
                         params.delete('page')
                         router.push(`/products?${params.toString()}`)
                       }}>
                  Search: "{searchQuery}" ✕
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-gray-800"
                onClick={() => {
                  router.push('/products')
                }}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-12 space-y-6 bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-0">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 h-12 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
            <Button onClick={handleSearch} className="h-12 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Search
            </Button>
          </div>

        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value: string) => {
              const [newSortBy, newSortOrder] = value.split('-')
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
              setCurrentPage(1)
            }}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Badge variant="secondary">
            {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
            {(selectedCategory || selectedBrand) && (
              <span className="ml-1">
                {selectedCategory && `in ${selectedCategory.replace(/-/g, ' ')}`}
                {selectedBrand && `from ${selectedBrand.replace(/-/g, ' ')}`}
              </span>
            )}
          </Badge>
        </div>
      </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white/60 rounded-2xl h-[420px] animate-pulse shadow-lg w-full" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="rounded-xl hover:bg-purple-50"
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page 
                      ? "rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                      : "rounded-xl hover:bg-purple-50"
                    }
                  >
                    {page}
                  </Button>
                )
              })}
              
              <Button
                variant="outline"
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="rounded-xl hover:bg-purple-50"
              >
                Next
              </Button>
            </div>
          )}
        </>
        ) : (
          <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
