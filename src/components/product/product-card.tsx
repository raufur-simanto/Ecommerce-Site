'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

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

interface ProductCardProps {
  product: Product
  onToggleWishlist?: (productId: string) => void
  isInWishlist?: boolean
}

export function ProductCard({ 
  product, 
  onToggleWishlist, 
  isInWishlist = false 
}: ProductCardProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <Card className="group relative overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0]?.url || '/placeholder-product.svg'}
            alt={product.images[0]?.altText || product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isFeatured && (
            <Badge variant="secondary">Featured</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive">-{discountPercentage}%</Badge>
          )}
          {product.inventory === 0 && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onToggleWishlist?.(product.id)}
        >
          <Heart
            className={`h-4 w-4 ${
              isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Category and Brand - Fixed height */}
          <div className="flex items-center justify-between min-h-[20px]">
            <p className="text-sm text-muted-foreground truncate">
              {product.category.name}
            </p>
            <p className="text-sm font-medium text-right truncate max-w-[100px]">
              {product.brand?.name || ''}
            </p>
          </div>
          
          {/* Product Name - Fixed height with consistent line clamping */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold hover:underline line-clamp-2 min-h-[48px] leading-6">
              {product.name}
            </h3>
          </Link>

          {/* Rating - Fixed height even when empty */}
          <div className="flex items-center gap-1 min-h-[20px]">
            {product.averageRating ? (
              <>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.averageRating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount || 0})
                </span>
              </>
            ) : (
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-200" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(0)</span>
              </div>
            )}
          </div>

          {/* Price - Fixed at bottom */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url || '/placeholder-product.svg',
            slug: product.slug,
            inventory: product.inventory
          })}
          disabled={product.inventory === 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inventory === 0 ? 'Out of Stock' : isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
