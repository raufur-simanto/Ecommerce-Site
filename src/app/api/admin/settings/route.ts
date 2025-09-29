import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const settings = await request.json()

    // Save each setting to the database
    const settingsToSave = [
      // General
      { key: 'storeName', value: settings.storeName, type: 'string' },
      { key: 'storeAddress', value: settings.storeAddress, type: 'string' },
      { key: 'storePhone', value: settings.storePhone, type: 'string' },
      { key: 'currency', value: settings.currency, type: 'string' },
      { key: 'timezone', value: settings.timezone, type: 'string' },
      
      // Email
      { key: 'transportType', value: settings.transportType, type: 'string' },
      { key: 'smtpHost', value: settings.smtpHost, type: 'string' },
      { key: 'smtpPort', value: settings.smtpPort, type: 'string' },
      { key: 'smtpUser', value: settings.smtpUser, type: 'string' },
      { key: 'smtpPassword', value: settings.smtpPassword, type: 'string' },
      { key: 'fromEmail', value: settings.emailFromAddress, type: 'string' },
      { key: 'fromName', value: settings.emailFromName, type: 'string' },
      
      // Payment
      { key: 'stripePublishableKey', value: settings.stripePublishableKey, type: 'string' },
      { key: 'stripeSecretKey', value: settings.stripeSecretKey, type: 'string' },
      { key: 'paypalClientId', value: settings.paypalClientId, type: 'string' },
      { key: 'paypalClientSecret', value: settings.paypalClientSecret, type: 'string' },
      { key: 'enablePaypal', value: settings.enablePaypal.toString(), type: 'boolean' },
      { key: 'enableStripe', value: settings.enableStripe.toString(), type: 'boolean' },
      
      // Shipping
      { key: 'freeShippingThreshold', value: settings.freeShippingThreshold.toString(), type: 'number' },
      { key: 'defaultShippingRate', value: settings.defaultShippingRate.toString(), type: 'number' },
      { key: 'enableLocalDelivery', value: settings.enableLocalDelivery.toString(), type: 'boolean' },
      
      // Features
      { key: 'enableReviews', value: settings.enableReviews.toString(), type: 'boolean' },
      { key: 'enableWishlist', value: settings.enableWishlist.toString(), type: 'boolean' },
      { key: 'enableCompareProducts', value: settings.enableCompareProducts.toString(), type: 'boolean' },
      { key: 'autoApproveReviews', value: settings.autoApproveReviews.toString(), type: 'boolean' },
      
      // SEO
      { key: 'metaTitle', value: settings.metaTitle, type: 'string' },
      { key: 'metaDescription', value: settings.metaDescription, type: 'string' },
      { key: 'googleAnalyticsId', value: settings.googleAnalyticsId, type: 'string' },
      { key: 'facebookPixelId', value: settings.facebookPixelId, type: 'string' },
      
      // Maintenance
      { key: 'maintenanceMode', value: settings.maintenanceMode.toString(), type: 'boolean' },
      { key: 'maintenanceMessage', value: settings.maintenanceMessage, type: 'string' },
      
      // Admin notification email (for admin alerts)
      { key: 'adminNotificationEmail', value: settings.smtpUser || 'admin@example.com', type: 'string' }
    ]

    // Use upsert to create or update each setting
    for (const setting of settingsToSave) {
      await prisma.siteSettings.upsert({
        where: { key: setting.key },
        update: { 
          value: setting.value,
          type: setting.type,
          updatedAt: new Date()
        },
        create: {
          key: setting.key,
          value: setting.value,
          type: setting.type
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully'
    })

  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const settings = await prisma.siteSettings.findMany()
    
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({ settings: settingsMap })

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
