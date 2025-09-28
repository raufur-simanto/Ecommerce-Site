import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email'
import { createWelcomeEmail } from '@/lib/email-templates'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { testEmail } = await request.json()

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      )
    }

    // Test connection first
    const isConfigured = await emailService.testConnection()
    
    if (!isConfigured) {
      return NextResponse.json(
        { error: 'Email service is not properly configured. Please check SMTP settings in admin.' },
        { status: 400 }
      )
    }

    // Send test email
    const testEmailHtml = createWelcomeEmail('Test User', testEmail)
    
    const success = await emailService.sendEmail({
      to: testEmail,
      subject: 'Test Email - E-Commerce Store',
      html: testEmailHtml
    })

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
