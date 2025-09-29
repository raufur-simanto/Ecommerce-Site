import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    const order = await prisma.order.findFirst({
      where: {
        id,
        user: {
          email: session.user.email
        }
      },
      include: {
        items: true,
        shippingAddress: true,
        payments: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get product details for each item
    const itemsWithProducts = await Promise.all(
      order.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, images: true }
        })
        
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.unitPrice,
          product: {
            name: product?.name || item.productName,
            image: product?.images?.[0] || '/placeholder.jpg'
          }
        }
      })
    )

    // Format the response
    const formattedOrder = {
      id: order.id,
      total: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      items: itemsWithProducts,
      shippingAddress: {
        street1: order.shippingAddress?.street1 || '',
        street2: order.shippingAddress?.street2 || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        postalCode: order.shippingAddress?.postalCode || '',
        country: order.shippingAddress?.country || ''
      }
    }

    return NextResponse.json(formattedOrder)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
