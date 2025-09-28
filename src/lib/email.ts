import nodemailer from 'nodemailer'
import { prisma } from './prisma'

export interface EmailConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
}

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private config: EmailConfig | null = null

  async getEmailConfig(): Promise<EmailConfig | null> {
    try {
      const settings = await prisma.siteSettings.findMany({
        where: {
          key: {
            in: ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword', 'fromEmail', 'fromName']
          }
        }
      })

      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {} as Record<string, string>)

      if (!settingsMap.smtpHost || !settingsMap.smtpUser || !settingsMap.smtpPassword) {
        console.warn('SMTP configuration incomplete')
        return null
      }

      return {
        smtpHost: settingsMap.smtpHost,
        smtpPort: parseInt(settingsMap.smtpPort) || 587,
        smtpUser: settingsMap.smtpUser,
        smtpPassword: settingsMap.smtpPassword,
        fromEmail: settingsMap.fromEmail || settingsMap.smtpUser,
        fromName: settingsMap.fromName || 'E-Commerce Store'
      }
    } catch (error) {
      console.error('Failed to get email configuration:', error)
      return null
    }
  }

  async initializeTransporter(): Promise<boolean> {
    try {
      this.config = await this.getEmailConfig()
      
      if (!this.config) {
        return false
      }

      this.transporter = nodemailer.createTransporter({
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        secure: this.config.smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: this.config.smtpUser,
          pass: this.config.smtpPassword,
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates for development
        }
      })

      // Verify connection
      await this.transporter.verify()
      console.log('Email service initialized successfully')
      return true
    } catch (error) {
      console.error('Failed to initialize email service:', error)
      this.transporter = null
      return false
    }
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      if (!this.transporter || !this.config) {
        const initialized = await this.initializeTransporter()
        if (!initialized) {
          throw new Error('Email service not configured')
        }
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: `"${this.config!.fromName}" <${this.config!.fromEmail}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text || stripHtml(emailData.html)
      }

      const result = await this.transporter!.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.initializeTransporter()
      return this.transporter !== null
    } catch (error) {
      console.error('Email connection test failed:', error)
      return false
    }
  }
}

// Utility function to strip HTML for plain text version
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

// Export singleton instance
export const emailService = new EmailService()

// Email template helper functions
export const createEmailTemplate = (content: string, title?: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'E-Commerce Store'}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .content {
            padding: 40px 30px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: 600;
        }
        .button:hover {
            opacity: 0.9;
        }
        .order-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .order-items {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
        }
        .order-items th,
        .order-items td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .order-items th {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        .total-row {
            font-weight: 600;
            background-color: #f8f9fa;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0;
                box-shadow: none;
            }
            .content {
                padding: 20px 15px;
            }
            .header {
                padding: 20px 15px;
            }
            .order-items {
                font-size: 14px;
            }
            .order-items th,
            .order-items td {
                padding: 8px 4px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>E-Commerce Store</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
  `
}
