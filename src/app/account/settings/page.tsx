'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bell, 
  Mail, 
  Shield, 
  Trash2, 
  LogOut,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'

interface NotificationSettings {
  emailMarketing: boolean
  emailOrders: boolean
  emailSecurity: boolean
  pushNotifications: boolean
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailMarketing: true,
    emailOrders: true,
    emailSecurity: true,
    pushNotifications: false
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin?callbackUrl=/account/settings')
      return
    }

    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      setNotifications(JSON.parse(savedSettings))
    }
    
    setLoading(false)
  }, [session, status, router])

  const handleNotificationChange = async (key: keyof NotificationSettings, value: boolean) => {
    setSaving(true)
    
    const newSettings = { ...notifications, [key]: value }
    setNotifications(newSettings)
    
    // Save to localStorage (in a real app, you'd save to database)
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaving(false)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      // In a real app, you'd make an API call to delete the account
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      alert('Failed to delete account. Please try again.')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Please sign in to access settings
        </h2>
        <Button onClick={() => router.push('/auth/signin')}>
          Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security settings</p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-orders">Order Updates</Label>
                <p className="text-sm text-gray-500">
                  Receive email notifications about your order status
                </p>
              </div>
              <Switch
                id="email-orders"
                checked={notifications.emailOrders}
                onCheckedChange={(checked) => handleNotificationChange('emailOrders', checked)}
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-marketing">Marketing & Promotions</Label>
                <p className="text-sm text-gray-500">
                  Receive emails about new products, sales, and special offers
                </p>
              </div>
              <Switch
                id="email-marketing"
                checked={notifications.emailMarketing}
                onCheckedChange={(checked) => handleNotificationChange('emailMarketing', checked)}
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-security">Security Alerts</Label>
                <p className="text-sm text-gray-500">
                  Important security notifications about your account
                </p>
              </div>
              <Switch
                id="email-security"
                checked={notifications.emailSecurity}
                onCheckedChange={(checked) => handleNotificationChange('emailSecurity', checked)}
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive push notifications in your browser
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-gray-500">
                  Control who can see your profile information
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Public
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Data Download</Label>
                <p className="text-sm text-gray-500">
                  Download a copy of your personal data
                </p>
              </div>
              <Button variant="outline" size="sm">
                Download Data
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sign Out</Label>
                <p className="text-sm text-gray-500">
                  Sign out from this device
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <Separator />

            <Alert className="border-red-200 bg-red-50">
              <Trash2 className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Delete Account</strong>
                    <p className="text-sm mt-1">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
