import nodemailer from 'nodemailer'
import { prisma } from './prisma'

export interface EmailConfig {
  transportType: 'smtp' | 'mta' | 'sendmail' | 'ses' | 'mailgun' | 'postmark'
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  fromEmail: string
  fromName: string
  // MTA/Sendmail specific
  sendmailPath?: string
  sendmailArgs?: string[]
  // AWS SES specific
  sesAccessKeyId?: string
  sesSecretAccessKey?: string
  sesRegion?: string
  // Mailgun specific
  mailgunApiKey?: string
  mailgunDomain?: string
  // Postmark specific
  postmarkServerToken?: string
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
            in: [
              'transportType', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword', 
              'fromEmail', 'fromName', 'sendmailPath', 'sendmailArgs',
              'sesAccessKeyId', 'sesSecretAccessKey', 'sesRegion',
              'mailgunApiKey', 'mailgunDomain', 'postmarkServerToken'
            ]
          }
        }
      })

      console.log('Retrieved settings from database:', settings.length)

      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      }, {} as Record<string, string>)

      console.log('Settings map:', Object.keys(settingsMap))

      const transportType = (settingsMap.transportType || 'smtp') as EmailConfig['transportType']

      // Validate configuration based on transport type
      switch (transportType) {
        case 'smtp':
        case 'mta':
          if (!settingsMap.smtpHost || !settingsMap.smtpUser || !settingsMap.smtpPassword) {
            console.warn('SMTP/MTA configuration incomplete')
            return null
          }
          break
        case 'sendmail':
          // Sendmail doesn't require authentication, just path
          break
        case 'ses':
          if (!settingsMap.sesAccessKeyId || !settingsMap.sesSecretAccessKey) {
            console.warn('AWS SES configuration incomplete')
            return null
          }
          break
        case 'mailgun':
          if (!settingsMap.mailgunApiKey || !settingsMap.mailgunDomain) {
            console.warn('Mailgun configuration incomplete')
            return null
          }
          break
        case 'postmark':
          if (!settingsMap.postmarkServerToken) {
            console.warn('Postmark configuration incomplete')
            return null
          }
          break
      }

      return {
        transportType,
        smtpHost: settingsMap.smtpHost,
        smtpPort: parseInt(settingsMap.smtpPort) || 587,
        smtpUser: settingsMap.smtpUser,
        smtpPassword: settingsMap.smtpPassword,
        fromEmail: settingsMap.fromEmail || settingsMap.smtpUser || 'noreply@example.com',
        fromName: settingsMap.fromName || 'E-Commerce Store',
        sendmailPath: settingsMap.sendmailPath,
        sendmailArgs: settingsMap.sendmailArgs ? JSON.parse(settingsMap.sendmailArgs) : undefined,
        sesAccessKeyId: settingsMap.sesAccessKeyId,
        sesSecretAccessKey: settingsMap.sesSecretAccessKey,
        sesRegion: settingsMap.sesRegion || 'us-east-1',
        mailgunApiKey: settingsMap.mailgunApiKey,
        mailgunDomain: settingsMap.mailgunDomain,
        postmarkServerToken: settingsMap.postmarkServerToken
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

      let transportConfig: any

      switch (this.config.transportType) {
        case 'smtp':
          transportConfig = {
            host: this.config.smtpHost,
            port: this.config.smtpPort,
            secure: this.config.smtpPort === 465,
            auth: {
              user: this.config.smtpUser,
              pass: this.config.smtpPassword,
            },
            tls: {
              rejectUnauthorized: false
            }
          }
          break

        case 'mta':
          transportConfig = {
            host: this.config.smtpHost,
            port: this.config.smtpPort || 587,
            secure: this.config.smtpPort === 465,
            auth: {
              user: this.config.smtpUser,
              pass: this.config.smtpPassword,
            },
            tls: {
              rejectUnauthorized: false
            },
            // MTA specific settings
            connectionTimeout: 60000, // 60 seconds
            greetingTimeout: 30000,   // 30 seconds
            socketTimeout: 60000,     // 60 seconds
          }
          break

        case 'sendmail':
          transportConfig = {
            sendmail: true,
            newline: 'unix',
            path: this.config.sendmailPath || '/usr/sbin/sendmail',
            args: this.config.sendmailArgs || ['-t']
          }
          break

        case 'ses':
          // You'll need to install @aws-sdk/client-ses
          transportConfig = {
            SES: {
              ses: {
                accessKeyId: this.config.sesAccessKeyId,
                secretAccessKey: this.config.sesSecretAccessKey,
                region: this.config.sesRegion
              },
              aws: {
                SendRawEmail: {},
                SendBulkTemplatedEmail: {}
              }
            }
          }
          break

        case 'mailgun':
          // You'll need to install nodemailer-mailgun-transport
          transportConfig = {
            service: 'Mailgun',
            auth: {
              api_key: this.config.mailgunApiKey,
              domain: this.config.mailgunDomain
            }
          }
          break

        case 'postmark':
          // You'll need to install nodemailer-postmark-transport
          transportConfig = {
            service: 'Postmark',
            auth: {
              server: this.config.postmarkServerToken
            }
          }
          break

        default:
          throw new Error(`Unsupported transport type: ${this.config.transportType}`)
      }

      this.transporter = nodemailer.createTransport(transportConfig)

      // Verify connection (skip for sendmail as it doesn't support verify)
      // For MTA, try verify but don't fail if it doesn't work
      if (this.config.transportType !== 'sendmail') {
        try {
          await this.transporter.verify()
        } catch (verifyError) {
          if (this.config.transportType === 'mta') {
            console.warn('MTA verification failed, but continuing (some MTA servers don\'t support VERIFY):', verifyError)
          } else {
            throw verifyError
          }
        }
      }
      
      console.log(`Email service initialized successfully with ${this.config.transportType}`)
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
