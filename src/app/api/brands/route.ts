import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { brandSchema } from '@/lib/validations'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = brandSchema.parse(body)

    const brand = await prisma.brand.create({
      data: {
        ...validatedData,
        slug: validatedData.name.toLowerCase().replace(/\s+/g, '-')
      }
    })

    return NextResponse.json(brand, { status: 201 })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}
