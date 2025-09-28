import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(brand)
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, logo, website, isActive } = body

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if another brand with the same name/slug exists (excluding current brand)
    const existingBrand = await prisma.brand.findFirst({
      where: {
        AND: [
          { id: { not: params.id } },
          {
            OR: [
              { name: { equals: name, mode: 'insensitive' } },
              { slug }
            ]
          }
        ]
      }
    })

    if (existingBrand) {
      return NextResponse.json(
        { error: 'A brand with this name already exists' },
        { status: 400 }
      )
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description || null,
        logo: logo || null,
        website: website || null,
        isActive: Boolean(isActive)
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(updatedBrand)
  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if brand exists and has products
    const brand = await prisma.brand.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Prevent deletion if brand has products
    if (brand._count.products > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete brand "${brand.name}" because it has ${brand._count.products} product(s). Please remove all products from this brand first.` 
        },
        { status: 400 }
      )
    }

    await prisma.brand.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
