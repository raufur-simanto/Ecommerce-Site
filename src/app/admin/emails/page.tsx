'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Package, 
  Star,
  Users,
  Settings
} from 'lucide-react'

interface LowStockProduct {
  id: string
  name: string
  sku: string
  inventory: number
  lowStockLevel: number
  updatedAt: string
}

interface EligibleOrder {
  id: string
  orderNumber: string
  customerEmail: string
  shippedAt: string
  user: {
    name: string
  }
  items: Array<{
    productName: string
    productId: string
  }>
}

export default function EmailManagementPage() {
  const [testEmail, setTestEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [eligibleOrders, setEligibleOrders] = useState<EligibleOrder[]>([])

  useEffect(() => {
    fetchLowStockProducts()
    fetchEligibleOrders()
  }, [])

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch('/api/admin/stock/alerts')
      const data = await response.json()
      if (response.ok) {
        setLowStockProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error)
    }
  }

  const fetchEligibleOrders = async () => {
    try {
      const response = await fetch('/api/admin/reviews/request')
      const data = await response.json()
      if (response.ok) {
        setEligibleOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching eligible orders:', error)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail }),
      })

      const data = await response.json()
      setMessage(data.error || 'Test email sent successfully!')
    } catch (error) {
      setMessage('Failed to send test email')
    } finally {
      setLoading(false)
    }
  }

  const sendLowStockAlert = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/stock/alerts', {
        method: 'POST',
      })

      const data = await response.json()
      setMessage(data.error || data.message)
    } catch (error) {
      setMessage('Failed to send low stock alert')
    } finally {
      setLoading(false)
    }
  }

  const sendReviewRequest = async (orderId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/reviews/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()
      setMessage(data.error || 'Review request sent successfully!')
      
      if (response.ok) {
        // Remove the order from the list
        setEligibleOrders(prev => prev.filter(order => order.id !== orderId))
      }
    } catch (error) {
      setMessage('Failed to send review request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
          <p className="text-gray-600">Manage email notifications and campaigns</p>
        </div>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="test">Test Email</TabsTrigger>
          <TabsTrigger value="stock">Stock Alerts</TabsTrigger>
          <TabsTrigger value="reviews">Review Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Types</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">
                  Order, Auth, Review, Stock, Shipping, Welcome
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockProducts.length}</div>
                <p className="text-xs text-muted-foreground">
                  Items need restocking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Review Eligible</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eligibleOrders.length}</div>
                <p className="text-xs text-muted-foreground">
                  Orders ready for review request
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">
                  SMTP configured and working
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Email Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Automatic Emails</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Order confirmations after checkout</li>
                    <li>• Shipping notifications with tracking</li>
                    <li>• Welcome emails for new users</li>
                    <li>• Admin alerts for new orders</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Manual Campaigns</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Review request emails</li>
                    <li>• Low stock alerts</li>
                    <li>• Password reset emails</li>
                    <li>• Custom promotional campaigns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Send Test Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="testEmail">Test Email Address</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                  <Button
                    onClick={sendTestEmail}
                    disabled={!testEmail || loading}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Sending...' : 'Send Test'}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                This will send a sample welcome email to test your SMTP configuration.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Low Stock Alerts</CardTitle>
              <Button onClick={sendLowStockAlert} disabled={loading || lowStockProducts.length === 0}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Send Alert Email
              </Button>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  No low stock items found. All products are well stocked!
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={product.inventory === 0 ? "destructive" : "secondary"}>
                          {product.inventory} / {product.lowStockLevel}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.inventory === 0 ? 'Out of Stock' : 'Low Stock'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Review Request Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {eligibleOrders.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  No orders eligible for review requests at this time.
                </p>
              ) : (
                <div className="space-y-3">
                  {eligibleOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Order #{order.orderNumber}</h4>
                        <p className="text-sm text-gray-600">{order.user.name} ({order.customerEmail})</p>
                        <p className="text-xs text-gray-500">
                          Shipped: {new Date(order.shippedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Button
                          size="sm"
                          onClick={() => sendReviewRequest(order.id)}
                          disabled={loading}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Request Review
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.items.length} item(s)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
