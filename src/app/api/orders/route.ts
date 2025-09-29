import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { orderCreateSchema } from '@/lib/validations'
import { stripe, isDemoMode } from '@/lib/stripe-server'
import { emailService } from '@/lib/email'
import { createOrderConfirmationEmail, createAdminNewOrderEmail, OrderEmailData } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    const body = await request.json()
    const validatedData = orderCreateSchema.parse(body)

    // For MVP, require authentication for orders
    // In production, you'd implement guest checkout differently
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required to place orders' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Verify payment intent if provided
    if (validatedData.paymentIntentId) {
      if (isDemoMode || !stripe || validatedData.paymentIntentId.startsWith('pi_demo_')) {
        // Demo mode - accept any demo payment intent
        console.log('Demo mode: Accepting payment intent', validatedData.paymentIntentId)
      } else {
        // Real Stripe verification
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(validatedData.paymentIntentId)
          
          if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json(
              { error: 'Payment not completed' },
              { status: 400 }
            )
          }
        } catch (error) {
          console.error('Error verifying payment intent:', error)
          return NextResponse.json(
            { error: 'Invalid payment intent' },
            { status: 400 }
          )
        }
      }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Get product details for order items
    const productIds = validatedData.items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    // For MVP, we'll store customer info directly on the order
    // In production, you'd use the Address relations
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: 'PENDING',
        paymentStatus: validatedData.paymentIntentId ? 'COMPLETED' : 'PENDING',
        fulfillmentStatus: 'UNFULFILLED',
        subtotal: validatedData.total,
        totalAmount: validatedData.total,
        customerEmail: validatedData.shippingAddress.email,
        customerPhone: validatedData.shippingAddress.phone,
        notes: `Shipping: ${validatedData.shippingAddress.firstName} ${validatedData.shippingAddress.lastName}, ${validatedData.shippingAddress.address}, ${validatedData.shippingAddress.city}, ${validatedData.shippingAddress.state} ${validatedData.shippingAddress.postalCode}, ${validatedData.shippingAddress.country}`,
        items: {
          create: validatedData.items.map(item => {
            const product = products.find(p => p.id === item.productId)!
            return {
              productId: item.productId,
              productName: product.name,
              productSku: product.sku,
              quantity: item.quantity,
              unitPrice: item.price,
              totalPrice: item.price * item.quantity,
            }
          })
        }
      },
      include: {
        items: true,
      }
    })

    // Create payment record if we have a payment intent
    if (validatedData.paymentIntentId) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          status: 'COMPLETED',
          method: 'STRIPE',
          amount: validatedData.total,
          currency: 'USD',
          processorId: validatedData.paymentIntentId,
        }
      })
    }

    // Update product inventory
    for (const item of validatedData.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          inventory: {
            decrement: item.quantity
          }
        }
      })
    }

    // Send order confirmation email
    try {
      const orderEmailData: OrderEmailData = {
        orderNumber: order.orderNumber,
        customerName: `${validatedData.shippingAddress.firstName} ${validatedData.shippingAddress.lastName}`,
        customerEmail: validatedData.shippingAddress.email,
        items: order.items.map(item => ({
          name: item.productName,
          sku: item.productSku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        })),
        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        shippingAmount: order.shippingAmount,
        discountAmount: order.discountAmount,
        totalAmount: order.totalAmount,
        shippingAddress: {
          firstName: validatedData.shippingAddress.firstName,
          lastName: validatedData.shippingAddress.lastName,
          street1: validatedData.shippingAddress.address,
          city: validatedData.shippingAddress.city,
          state: validatedData.shippingAddress.state,
          postalCode: validatedData.shippingAddress.postalCode,
          country: validatedData.shippingAddress.country
        }
      }

      // Send customer confirmation email
      const customerEmailHtml = createOrderConfirmationEmail(orderEmailData)
      await emailService.sendEmail({
        to: validatedData.shippingAddress.email,
        subject: `Order Confirmation - #${order.orderNumber}`,
        html: customerEmailHtml
      })

      // Send admin notification email
      const adminEmailHtml = createAdminNewOrderEmail(orderEmailData)
      
      // Get admin emails from settings or fallback to a default
      const adminSettings = await prisma.siteSettings.findFirst({
        where: { key: 'adminNotificationEmail' }
      })
      
      const adminEmail = adminSettings?.value || 'admin@example.com'
      
      await emailService.sendEmail({
        to: adminEmail,
        subject: `New Order Alert - #${order.orderNumber}`,
        html: adminEmailHtml
      })

    } catch (emailError) {
      // Log email error but don't fail the order
      console.error('Failed to send order emails:', emailError)
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: true,
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
