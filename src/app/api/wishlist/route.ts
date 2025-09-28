import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required')
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const [wishlistItems, total] = await Promise.all([
      prisma.wishlistItem.findMany({
        where: { userId: session.user.id },
        include: {
          product: {
            include: {
              category: { select: { name: true, slug: true } },
              brand: { select: { name: true, slug: true } },
              images: { 
                orderBy: { sortOrder: 'asc' },
                take: 1
              },
              reviews: {
                where: { isApproved: true },
                select: { rating: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.wishlistItem.count({
        where: { userId: session.user.id }
      })
    ])

    // Calculate average ratings for products
    const wishlistWithRatings = wishlistItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        averageRating: item.product.reviews.length > 0 
          ? item.product.reviews.reduce((sum, review) => sum + review.rating, 0) / item.product.reviews.length
          : null,
        reviewCount: item.product.reviews.length
      }
    }))

    return NextResponse.json({
      wishlistItems: wishlistWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = addToWishlistSchema.parse(body)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if item already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      )
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId
      },
      include: {
        product: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json({ 
      wishlistItem,
      message: 'Product added to wishlist'
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}
