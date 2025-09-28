import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'
import { createShippingNotificationEmail, ShippingUpdateData } from '@/lib/email-templates'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { status, fulfillmentStatus, trackingNumber, carrier, estimatedDelivery } = await request.json()

    // Update order
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(fulfillmentStatus && { fulfillmentStatus }),
        ...(fulfillmentStatus === 'FULFILLED' && { shippedAt: new Date() })
      },
      include: {
        user: true,
        shippingAddress: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Create or update shipment if tracking info provided
    if (trackingNumber || carrier || estimatedDelivery) {
      const existingShipment = await prisma.shipment.findFirst({
        where: { orderId: params.id }
      })

      if (existingShipment) {
        await prisma.shipment.update({
          where: { id: existingShipment.id },
          data: {
            ...(trackingNumber && { trackingNumber }),
            ...(carrier && { carrier }),
            ...(estimatedDelivery && { estimatedDelivery: new Date(estimatedDelivery) }),
            status: fulfillmentStatus === 'FULFILLED' ? 'SHIPPED' : 'PENDING',
            ...(fulfillmentStatus === 'FULFILLED' && { shippedAt: new Date() })
          }
        })
      } else {
        await prisma.shipment.create({
          data: {
            orderId: params.id,
            status: fulfillmentStatus === 'FULFILLED' ? 'SHIPPED' : 'PENDING',
            trackingNumber,
            carrier,
            estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
            ...(fulfillmentStatus === 'FULFILLED' && { shippedAt: new Date() })
          }
        })
      }
    }

    // Send shipping notification email if order was just shipped
    if (fulfillmentStatus === 'FULFILLED' && order.customerEmail) {
      try {
        // Parse shipping address from notes (temporary solution)
        const addressMatch = order.notes?.match(/Shipping: (.+?)(?:,|$)/)
        const addressParts = addressMatch?.[1]?.split(', ') || []
        
        const shippingData: ShippingUpdateData = {
          orderNumber: order.orderNumber,
          customerName: order.user.name || 'Customer',
          trackingNumber,
          carrier,
          estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
          shippingAddress: {
            firstName: addressParts[0]?.split(' ')[0] || 'Customer',
            lastName: addressParts[0]?.split(' ').slice(1).join(' ') || '',
            street1: addressParts[1] || '',
            city: addressParts[2] || '',
            state: addressParts[3]?.split(' ')[0] || '',
            postalCode: addressParts[3]?.split(' ')[1] || '',
            country: addressParts[4] || 'US'
          }
        }

        const shippingEmailHtml = createShippingNotificationEmail(shippingData)
        
        await emailService.sendEmail({
          to: order.customerEmail,
          subject: `Your order has shipped - #${order.orderNumber}`,
          html: shippingEmailHtml
        })

      } catch (emailError) {
        console.error('Failed to send shipping email:', emailError)
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
