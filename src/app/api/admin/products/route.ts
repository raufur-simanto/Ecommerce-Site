import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  inventory: z.number().int().min(0).optional().default(0),
  lowStockLevel: z.number().int().min(0).optional().default(5),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real app, you'd check if user has admin role
    // For demo purposes, we'll allow any authenticated user

    const body = await request.json()

    // Validate the input
    const validatedData = productCreateSchema.parse(body)

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists and make it unique
    let uniqueSlug = slug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    // Generate SKU
    const sku = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    const newProduct = await prisma.product.create({
      data: {
        ...validatedData,
        slug: uniqueSlug,
        sku,
        createdAt: new Date(),
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

    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
