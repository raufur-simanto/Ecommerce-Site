'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Eye,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface AnalyticsData {
  revenue: {
    total: number
    previousPeriod: number
    growth: number
  }
  orders: {
    total: number
    previousPeriod: number
    growth: number
  }
  customers: {
    total: number
    previousPeriod: number
    growth: number
  }
  products: {
    total: number
    lowStock: number
  }
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    customer: string
    total: number
    status: string
    createdAt: string
  }>
  salesByCategory: Array<{
    category: string
    sales: number
    percentage: number
  }>
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    revenue: { total: 0, previousPeriod: 0, growth: 0 },
    orders: { total: 0, previousPeriod: 0, growth: 0 },
    customers: { total: 0, previousPeriod: 0, growth: 0 },
    products: { total: 0, lowStock: 0 },
    topProducts: [],
    recentOrders: [],
    salesByCategory: []
  })

  // Mock data - In a real app, this would come from your API
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data based on period
      const mockData: AnalyticsData = {
        revenue: {
          total: period === '7d' ? 12450 : period === '30d' ? 45680 : 156789,
          previousPeriod: period === '7d' ? 10200 : period === '30d' ? 42300 : 142000,
          growth: period === '7d' ? 22.1 : period === '30d' ? 8.0 : 10.4
        },
        orders: {
          total: period === '7d' ? 156 : period === '30d' ? 567 : 2145,
          previousPeriod: period === '7d' ? 142 : period === '30d' ? 523 : 1987,
          growth: period === '7d' ? 9.9 : period === '30d' ? 8.4 : 8.0
        },
        customers: {
          total: period === '7d' ? 89 : period === '30d' ? 324 : 1456,
          previousPeriod: period === '7d' ? 76 : period === '30d' ? 298 : 1342,
          growth: period === '7d' ? 17.1 : period === '30d' ? 8.7 : 8.5
        },
        products: {
          total: 245,
          lowStock: 12
        },
        topProducts: [
          { id: '1', name: 'Wireless Headphones', sales: 156, revenue: 15600 },
          { id: '2', name: 'Smart Watch', sales: 134, revenue: 26800 },
          { id: '3', name: 'Laptop Stand', sales: 98, revenue: 4900 },
          { id: '4', name: 'USB-C Cable', sales: 87, revenue: 1740 },
          { id: '5', name: 'Phone Case', sales: 76, revenue: 2280 }
        ],
        recentOrders: [
          { id: '1', orderNumber: 'ORD-2024-001', customer: 'John Doe', total: 299.99, status: 'COMPLETED', createdAt: '2024-01-15T10:30:00Z' },
          { id: '2', orderNumber: 'ORD-2024-002', customer: 'Jane Smith', total: 159.50, status: 'PROCESSING', createdAt: '2024-01-15T09:15:00Z' },
          { id: '3', orderNumber: 'ORD-2024-003', customer: 'Bob Johnson', total: 89.99, status: 'SHIPPED', createdAt: '2024-01-15T08:45:00Z' },
          { id: '4', orderNumber: 'ORD-2024-004', customer: 'Alice Brown', total: 199.00, status: 'PENDING', createdAt: '2024-01-15T07:20:00Z' },
          { id: '5', orderNumber: 'ORD-2024-005', customer: 'Charlie Wilson', total: 449.99, status: 'COMPLETED', createdAt: '2024-01-14T16:30:00Z' }
        ],
        salesByCategory: [
          { category: 'Electronics', sales: 45, percentage: 45 },
          { category: 'Accessories', sales: 25, percentage: 25 },
          { category: 'Clothing', sales: 15, percentage: 15 },
          { category: 'Home & Garden', sales: 10, percentage: 10 },
          { category: 'Books', sales: 5, percentage: 5 }
        ]
      }
      
      setAnalyticsData(mockData)
      setLoading(false)
    }

    fetchAnalytics()
  }, [period])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const GrowthIndicator = ({ growth }: { growth: number }) => {
    const isPositive = growth > 0
    const Icon = isPositive ? TrendingUp : TrendingDown
    
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <Icon className="h-4 w-4" />
        <span>{Math.abs(growth).toFixed(1)}%</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Business insights and performance metrics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analyticsData.revenue.total)}
                </p>
                <GrowthIndicator growth={analyticsData.revenue.growth} />
              </div>
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.orders.total.toLocaleString()}
                </p>
                <GrowthIndicator growth={analyticsData.orders.growth} />
              </div>
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <ShoppingCart className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.customers.total.toLocaleString()}
                </p>
                <GrowthIndicator growth={analyticsData.customers.growth} />
              </div>
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.products.total}
                </p>
                <div className="text-sm text-orange-600">
                  {analyticsData.products.lowStock} low stock
                </div>
              </div>
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.salesByCategory.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-gray-500">{category.percentage}%</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency((order as any).total || (order as any).totalAmount || 0)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
