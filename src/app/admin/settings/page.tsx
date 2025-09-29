'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings, 
  Store, 
  Mail, 
  CreditCard, 
  Truck, 
  Globe, 
  Shield,
  Bell,
  Palette,
  Database,
  Save
} from 'lucide-react'

interface SiteSettings {
  // General
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  supportEmail: string
  
  // Store
  storeName: string
  storeAddress: string
  storePhone: string
  currency: string
  timezone: string
  
  // Email
  transportType: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPassword: string
  emailFromName: string
  emailFromAddress: string
  
  // Payment
  stripePublishableKey: string
  stripeSecretKey: string
  paypalClientId: string
  paypalClientSecret: string
  enablePaypal: boolean
  enableStripe: boolean
  
  // Shipping
  freeShippingThreshold: number
  defaultShippingRate: number
  enableLocalDelivery: boolean
  
  // Features
  enableReviews: boolean
  enableWishlist: boolean
  enableCompareProducts: boolean
  autoApproveReviews: boolean
  
  // SEO
  metaTitle: string
  metaDescription: string
  googleAnalyticsId: string
  facebookPixelId: string
  
  // Maintenance
  maintenanceMode: boolean
  maintenanceMessage: string
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings>({
    // General
    siteName: 'E-Commerce Store',
    siteDescription: 'Your one-stop shop for everything',
    siteUrl: 'https://your-store.com',
    contactEmail: 'contact@your-store.com',
    supportEmail: 'support@your-store.com',
    
    // Store
    storeName: 'My Store',
    storeAddress: '123 Main St, City, State 12345',
    storePhone: '+1 (555) 123-4567',
    currency: 'USD',
    timezone: 'America/New_York',
    
    // Email
    transportType: 'smtp',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    emailFromName: 'My Store',
    emailFromAddress: 'noreply@your-store.com',
    
    // Payment
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
    paypalClientSecret: '',
    enablePaypal: false,
    enableStripe: true,
    
    // Shipping
    freeShippingThreshold: 50,
    defaultShippingRate: 5.99,
    enableLocalDelivery: false,
    
    // Features
    enableReviews: true,
    enableWishlist: true,
    enableCompareProducts: true,
    autoApproveReviews: false,
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    
    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back later.'
  })

  // Load existing settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        const data = await response.json()
        
        if (response.ok && data.settings) {
          setSettings(prev => ({
            ...prev,
            // Map database values to form state
            storeName: data.settings.storeName || prev.storeName,
            storeAddress: data.settings.storeAddress || prev.storeAddress,
            storePhone: data.settings.storePhone || prev.storePhone,
            currency: data.settings.currency || prev.currency,
            timezone: data.settings.timezone || prev.timezone,
            
            transportType: data.settings.transportType || prev.transportType,
            smtpHost: data.settings.smtpHost || prev.smtpHost,
            smtpPort: data.settings.smtpPort || prev.smtpPort,
            smtpUser: data.settings.smtpUser || prev.smtpUser,
            smtpPassword: data.settings.smtpPassword || prev.smtpPassword,
            emailFromName: data.settings.fromName || prev.emailFromName,
            emailFromAddress: data.settings.fromEmail || prev.emailFromAddress,
            
            stripePublishableKey: data.settings.stripePublishableKey || prev.stripePublishableKey,
            stripeSecretKey: data.settings.stripeSecretKey || prev.stripeSecretKey,
            paypalClientId: data.settings.paypalClientId || prev.paypalClientId,
            paypalClientSecret: data.settings.paypalClientSecret || prev.paypalClientSecret,
            enablePaypal: data.settings.enablePaypal === 'true' || prev.enablePaypal,
            enableStripe: data.settings.enableStripe === 'true' || prev.enableStripe,
            
            freeShippingThreshold: parseFloat(data.settings.freeShippingThreshold) || prev.freeShippingThreshold,
            defaultShippingRate: parseFloat(data.settings.defaultShippingRate) || prev.defaultShippingRate,
            enableLocalDelivery: data.settings.enableLocalDelivery === 'true' || prev.enableLocalDelivery,
            
            enableReviews: data.settings.enableReviews === 'true' || prev.enableReviews,
            enableWishlist: data.settings.enableWishlist === 'true' || prev.enableWishlist,
            enableCompareProducts: data.settings.enableCompareProducts === 'true' || prev.enableCompareProducts,
            autoApproveReviews: data.settings.autoApproveReviews === 'true' || prev.autoApproveReviews,
            
            metaTitle: data.settings.metaTitle || prev.metaTitle,
            metaDescription: data.settings.metaDescription || prev.metaDescription,
            googleAnalyticsId: data.settings.googleAnalyticsId || prev.googleAnalyticsId,
            facebookPixelId: data.settings.facebookPixelId || prev.facebookPixelId,
            
            maintenanceMode: data.settings.maintenanceMode === 'true' || prev.maintenanceMode,
            maintenanceMessage: data.settings.maintenanceMessage || prev.maintenanceMessage,
          }))
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleInputChange = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const [testEmail, setTestEmail] = useState('')
  const [testingEmail, setTestingEmail] = useState(false)

  const handleTestEmail = async () => {
    if (!testEmail) {
      alert('Please enter a test email address')
      return
    }

    setTestingEmail(true)
    try {
      const response = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Test email sent successfully! Check your inbox.')
      } else {
        alert(`Failed to send test email: ${data.error}`)
      }
    } catch (error) {
      console.error('Error testing email:', error)
      alert('Failed to send test email')
    } finally {
      setTestingEmail(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Settings saved successfully!')
      } else {
        alert(`Failed to save settings: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your store settings and preferences</p>
        </div>
        
        <Button onClick={handleSave} disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Store
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Settings */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => handleInputChange('storePhone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => handleInputChange('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Transport Type Selection */}
              <div>
                <Label htmlFor="transportType">Email Transport Type</Label>
                <Select
                  value={settings.transportType || 'smtp'}
                  onValueChange={(value) => handleInputChange('transportType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP Server</SelectItem>
                    <SelectItem value="mta">MTA Server (with Auth)</SelectItem>
                    <SelectItem value="sendmail">Sendmail (Local MTA)</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="postmark">Postmark</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 mt-1">
                  Choose how emails will be sent from your server
                </p>
              </div>

              {/* SMTP/MTA Settings - Show for SMTP and MTA (with auth) */}
              {(settings.transportType === 'smtp' || settings.transportType === 'mta' || !settings.transportType) && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">
                    {settings.transportType === 'mta' ? 'MTA Server Host' : 'SMTP Host'}
                  </Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    placeholder={settings.transportType === 'mta' ? 'mta.yourserver.com' : 'smtp.gmail.com'}
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">
                    {settings.transportType === 'mta' ? 'MTA Server Port' : 'SMTP Port'}
                  </Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                    placeholder={settings.transportType === 'mta' ? '587 or 25' : '587'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUser">
                    {settings.transportType === 'mta' ? 'MTA Username' : 'SMTP Username'}
                  </Label>
                  <Input
                    id="smtpUser"
                    value={settings.smtpUser}
                    onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                    placeholder="your-email@domain.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">
                    {settings.transportType === 'mta' ? 'MTA Password' : 'SMTP Password'}
                  </Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                    placeholder="Your password"
                  />
                </div>
              </div>

              {/* Test Email Section */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Test Email Configuration</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter test email address"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestEmail}
                    disabled={testingEmail || !testEmail}
                  >
                    {testingEmail ? 'Sending...' : 'Send Test Email'}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Send a test email to verify your {settings.transportType === 'mta' ? 'MTA server' : 'SMTP'} configuration is working correctly.
                </p>
              </div>

                </>
              )}

              {/* Common Email Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailFromName">From Name</Label>
                  <Input
                    id="emailFromName"
                    value={settings.emailFromName}
                    onChange={(e) => handleInputChange('emailFromName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emailFromAddress">From Address</Label>
                  <Input
                    id="emailFromAddress"
                    type="email"
                    value={settings.emailFromAddress}
                    onChange={(e) => handleInputChange('emailFromAddress', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableStripe"
                    checked={settings.enableStripe}
                    onCheckedChange={(checked) => handleInputChange('enableStripe', checked)}
                  />
                  <Label htmlFor="enableStripe">Enable Stripe</Label>
                </div>

                <div>
                  <Label htmlFor="stripePublishableKey">Publishable Key</Label>
                  <Input
                    id="stripePublishableKey"
                    value={settings.stripePublishableKey}
                    onChange={(e) => handleInputChange('stripePublishableKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>

                <div>
                  <Label htmlFor="stripeSecretKey">Secret Key</Label>
                  <Input
                    id="stripeSecretKey"
                    type="password"
                    value={settings.stripeSecretKey}
                    onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                    placeholder="sk_test_..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PayPal Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enablePaypal"
                    checked={settings.enablePaypal}
                    onCheckedChange={(checked) => handleInputChange('enablePaypal', checked)}
                  />
                  <Label htmlFor="enablePaypal">Enable PayPal</Label>
                </div>

                <div>
                  <Label htmlFor="paypalClientId">Client ID</Label>
                  <Input
                    id="paypalClientId"
                    value={settings.paypalClientId}
                    onChange={(e) => handleInputChange('paypalClientId', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="paypalClientSecret">Client Secret</Label>
                  <Input
                    id="paypalClientSecret"
                    type="password"
                    value={settings.paypalClientSecret}
                    onChange={(e) => handleInputChange('paypalClientSecret', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    step="0.01"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultShippingRate">Default Shipping Rate</Label>
                  <Input
                    id="defaultShippingRate"
                    type="number"
                    step="0.01"
                    value={settings.defaultShippingRate}
                    onChange={(e) => handleInputChange('defaultShippingRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableLocalDelivery"
                  checked={settings.enableLocalDelivery}
                  onCheckedChange={(checked) => handleInputChange('enableLocalDelivery', checked)}
                />
                <Label htmlFor="enableLocalDelivery">Enable Local Delivery</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Settings */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Store Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableReviews"
                    checked={settings.enableReviews}
                    onCheckedChange={(checked) => handleInputChange('enableReviews', checked)}
                  />
                  <Label htmlFor="enableReviews">Enable Product Reviews</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoApproveReviews"
                    checked={settings.autoApproveReviews}
                    onCheckedChange={(checked) => handleInputChange('autoApproveReviews', checked)}
                  />
                  <Label htmlFor="autoApproveReviews">Auto-approve Reviews</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableWishlist"
                    checked={settings.enableWishlist}
                    onCheckedChange={(checked) => handleInputChange('enableWishlist', checked)}
                  />
                  <Label htmlFor="enableWishlist">Enable Wishlist</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableCompareProducts"
                    checked={settings.enableCompareProducts}
                    onCheckedChange={(checked) => handleInputChange('enableCompareProducts', checked)}
                  />
                  <Label htmlFor="enableCompareProducts">Enable Product Comparison</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Default Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Default Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                    placeholder="GA-XXXXXXXXX-X"
                  />
                </div>
                <div>
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixelId"
                    value={settings.facebookPixelId}
                    onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Settings */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                />
                <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
              </div>

              <div>
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
