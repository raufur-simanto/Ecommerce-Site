import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().nullish(),
  costPrice: z.number().positive().nullish(),
  inventory: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().nullish(),
  weight: z.number().positive().nullish(),
  dimensions: z.string().nullish(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  images: z.array(z.object({
    url: z.string().min(1),
    alt: z.string().optional()
  })).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    return NextResponse.json({
      product: {
        ...product,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length
      }
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real app, you'd check if user has admin role
    // For demo purposes, we'll allow any authenticated user

    const { id: productId } = await params
    const body = await request.json()

    // Validate the input
    const validatedData = productUpdateSchema.parse(body)
    const { images, compareAtPrice, lowStockThreshold, ...productData } = validatedData

    // Map form fields to database fields
    const mappedData = {
      ...productData,
      ...(compareAtPrice !== undefined && { comparePrice: compareAtPrice }),
      ...(lowStockThreshold !== undefined && { lowStockLevel: lowStockThreshold }),
    }

    // Update product data
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...mappedData,
        updatedAt: new Date()
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    // Handle images separately if provided
    if (images && images.length > 0) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId }
      })

      // Create new images
      await prisma.productImage.createMany({
        data: images.map((img, index) => ({
          productId,
          url: img.url,
          altText: img.alt || updatedProduct.name,
          sortOrder: index
        }))
      })

      // Fetch updated product with new images
      const productWithImages = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      })

      return NextResponse.json({ product: productWithImages })
    }

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: productId } = await params

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Instead of hard delete, we'll soft delete by setting isActive to false
    // This preserves data integrity for existing orders
    const deletedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: 'Product deleted successfully',
      product: deletedProduct 
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
