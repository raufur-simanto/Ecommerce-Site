import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'
import { createLowStockAlert } from '@/lib/email-templates'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find products with low stock
    const lowStockProducts = await prisma.product.findMany({
      where: {
        OR: [
          {
            AND: [
              { trackInventory: true },
              { inventory: { lte: prisma.product.fields.lowStockLevel } }
            ]
          },
          {
            inventory: 0
          }
        ],
        isActive: true
      },
      select: {
        id: true,
        name: true,
        sku: true,
        inventory: true,
        lowStockLevel: true
      }
    })

    if (lowStockProducts.length === 0) {
      return NextResponse.json({
        message: 'No low stock products found'
      })
    }

    // Get admin email from settings
    const adminSettings = await prisma.siteSettings.findFirst({
      where: { key: 'adminNotificationEmail' }
    })
    
    const adminEmail = adminSettings?.value || 'admin@example.com'

    try {
      const lowStockEmailHtml = createLowStockAlert(
        lowStockProducts.map(product => ({
          name: product.name,
          sku: product.sku,
          currentStock: product.inventory,
          lowStockLevel: product.lowStockLevel
        }))
      )
      
      await emailService.sendEmail({
        to: adminEmail,
        subject: `Low Stock Alert - ${lowStockProducts.length} Product(s) Need Attention`,
        html: lowStockEmailHtml
      })

      return NextResponse.json({
        success: true,
        message: `Low stock alert sent for ${lowStockProducts.length} product(s)`,
        products: lowStockProducts
      })

    } catch (emailError) {
      console.error('Failed to send low stock alert:', emailError)
      return NextResponse.json(
        { error: 'Failed to send low stock alert email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Low stock alert error:', error)
    return NextResponse.json(
      { error: 'Failed to check stock levels' },
      { status: 500 }
    )
  }
}

// GET endpoint to check current low stock products
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const lowStockProducts = await prisma.product.findMany({
      where: {
        OR: [
          {
            AND: [
              { trackInventory: true },
              { inventory: { lte: prisma.product.fields.lowStockLevel } }
            ]
          },
          {
            inventory: 0
          }
        ],
        isActive: true
      },
      select: {
        id: true,
        name: true,
        sku: true,
        inventory: true,
        lowStockLevel: true,
        updatedAt: true
      },
      orderBy: {
        inventory: 'asc'
      }
    })

    return NextResponse.json({ 
      products: lowStockProducts,
      count: lowStockProducts.length 
    })

  } catch (error) {
    console.error('Error fetching low stock products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch low stock products' },
      { status: 500 }
    )
  }
}
