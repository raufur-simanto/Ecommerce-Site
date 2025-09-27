import { NextRequest, NextResponse } from 'next/server'
import { productSearchSchema } from '@/lib/validations'
import { searchProducts } from '@/lib/search-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawParams = Object.fromEntries(searchParams.entries())
    
    // Convert numeric params
    const params: any = { ...rawParams }
    if (params.minPrice) params.minPrice = parseFloat(params.minPrice)
    if (params.maxPrice) params.maxPrice = parseFloat(params.maxPrice)
    if (params.page) params.page = parseInt(params.page)
    if (params.limit) params.limit = parseInt(params.limit)

    const validatedParams = productSearchSchema.parse(params)
    
    // Use the new search utility for SQLite compatibility
    const result = await searchProducts(validatedParams)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
