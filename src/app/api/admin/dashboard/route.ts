import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In a real app, you'd check if user has admin role
    // For demo purposes, we'll allow any authenticated user

    // Get dashboard statistics
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      totalRevenue
    ] = await Promise.all([
      // Total products
      prisma.product.count({
        where: { isActive: true }
      }),

      // Total orders
      prisma.order.count(),

      // Total users
      prisma.user.count(),

      // Recent orders with user info
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }),

      // Total revenue
      prisma.order.aggregate({
        _sum: {
          totalAmount: true
        }
      })
    ])

    // Get top products based on order items
    const topProducts = await prisma.product.findMany({
      take: 10,
      include: {
        orderItems: {
          select: {
            quantity: true
          }
        }
      }
    })

    // Calculate sold quantities and sort
    const productsWithSales = topProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      sold: product.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    })).sort((a, b) => b.sold - a.sold)

    const dashboardStats = {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentOrders,
      topProducts: productsWithSales.slice(0, 10)
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
