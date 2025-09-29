import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'
import { createReviewRequestEmail } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Get order with items and user info
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Only send review request if order is delivered
    if (order.fulfillmentStatus !== 'FULFILLED') {
      return NextResponse.json(
        { error: 'Order must be fulfilled before sending review request' },
        { status: 400 }
      )
    }

    // Check if review request already sent (you might want to track this)
    // For now, we'll just send it

    const reviewRequestData = {
      orderNumber: order.orderNumber,
      customerName: order.user.name || 'Customer',
      items: order.items.map(item => ({
        name: item.productName,
        id: item.productId
      }))
    }

    try {
      const reviewEmailHtml = createReviewRequestEmail(reviewRequestData)
      
      await emailService.sendEmail({
        to: order.customerEmail,
        subject: `How was your recent purchase? - Order #${order.orderNumber}`,
        html: reviewEmailHtml
      })

      return NextResponse.json({
        success: true,
        message: 'Review request email sent successfully'
      })

    } catch (emailError) {
      console.error('Failed to send review request email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send review request email' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Review request error:', error)
    return NextResponse.json(
      { error: 'Failed to send review request' },
      { status: 500 }
    )
  }
}

// GET endpoint to get orders eligible for review requests
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get fulfilled orders from the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const eligibleOrders = await prisma.order.findMany({
      where: {
        fulfillmentStatus: 'FULFILLED',
        shippedAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        shippedAt: 'desc'
      }
    })

    return NextResponse.json({ orders: eligibleOrders })

  } catch (error) {
    console.error('Error fetching eligible orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
