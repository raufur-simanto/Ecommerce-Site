import { prisma } from '@/lib/prisma'

export interface SearchProductsParams {
  q?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'createdAt' | 'price' | 'name'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export async function searchProducts(params: SearchProductsParams) {
  const {
    q,
    category,
    brand,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  } = params

  const skip = (page - 1) * limit

  // Build base conditions
  const conditions: string[] = ['p.isActive = 1']
  const values: any[] = []
  let paramIndex = 1

  // Search query with case-insensitive LIKE
  if (q) {
    conditions.push(`(
      p.name LIKE $${paramIndex} COLLATE NOCASE OR 
      p.description LIKE $${paramIndex} COLLATE NOCASE OR 
      p.shortDescription LIKE $${paramIndex} COLLATE NOCASE
    )`)
    values.push(`%${q}%`)
    paramIndex++
  }

  // Category filter
  if (category) {
    conditions.push(`c.slug = $${paramIndex}`)
    values.push(category)
    paramIndex++
  }

  // Brand filter
  if (brand) {
    conditions.push(`b.slug = $${paramIndex}`)
    values.push(brand)
    paramIndex++
  }

  // Price filters
  if (minPrice !== undefined) {
    conditions.push(`p.price >= $${paramIndex}`)
    values.push(minPrice)
    paramIndex++
  }

  if (maxPrice !== undefined) {
    conditions.push(`p.price <= $${paramIndex}`)
    values.push(maxPrice)
    paramIndex++
  }

  // Build WHERE clause
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  // Build ORDER BY clause
  let orderByClause = ''
  switch (sortBy) {
    case 'price':
      orderByClause = `ORDER BY p.price ${sortOrder.toUpperCase()}`
      break
    case 'name':
      orderByClause = `ORDER BY p.name ${sortOrder.toUpperCase()}`
      break
    default:
      orderByClause = `ORDER BY p.createdAt ${sortOrder.toUpperCase()}`
  }

  // Build the query
  const baseQuery = `
    FROM Product p
    LEFT JOIN Category c ON p.categoryId = c.id
    LEFT JOIN Brand b ON p.brandId = b.id
    ${whereClause}
  `

  // Get products with all related data
  const productsQuery = `
    SELECT 
      p.*,
      c.name as categoryName,
      c.slug as categorySlug,
      b.name as brandName,
      b.slug as brandSlug
    ${baseQuery}
    ${orderByClause}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `

  // Get total count
  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`

  try {
    // Execute queries
    const [productsResult, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(productsQuery, ...values, limit, skip),
      prisma.$queryRawUnsafe(countQuery, ...values)
    ])

    const products = productsResult as any[]
    const total = (countResult as any[])[0]?.total || 0

    // Get images and reviews for each product
    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const [images, reviews] = await Promise.all([
          prisma.productImage.findMany({
            where: { productId: product.id },
            orderBy: { sortOrder: 'asc' },
            take: 1
          }),
          prisma.review.findMany({
            where: { productId: product.id },
            select: { rating: true }
          })
        ])

        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : null

        return {
          ...product,
          category: product.categoryName ? {
            name: product.categoryName,
            slug: product.categorySlug
          } : null,
          brand: product.brandName ? {
            name: product.brandName,
            slug: product.brandSlug
          } : null,
          images,
          reviews,
          averageRating,
          reviewCount: reviews.length
        }
      })
    )

    return {
      products: productsWithDetails,
      pagination: {
        page,
        limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit)
      }
    }
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}
