'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Star, Shield, Truck, HeadphonesIcon, Search } from "lucide-react";

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 lg:py-32 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🎉 Welcome to our store
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Discover Amazing Products at
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Great Prices</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md">
                  Shop the latest electronics, fashion, home goods, and more. Fast shipping, 
                  easy returns, and excellent customer service.
                </p>
              </div>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="rounded-xl border-gray-200 hover:bg-blue-50">
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">5K+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    Rating
                  </div>
                </div>
              </div>
            </div>
            <div className="relative lg:h-[600px] flex justify-center">
              <div className="w-full max-w-md bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border-0 flex items-center justify-center">
                <div className="text-8xl lg:text-9xl">🛍️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Why Choose Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We're committed to providing you with the best shopping experience possible.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          <Card className="w-full max-w-sm bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">Free Shipping</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </CardContent>
          </Card>
          <Card className="w-full max-w-sm bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">Secure Payment</h3>
              <p className="text-muted-foreground">
                Your payment information is always secure
              </p>
            </CardContent>
          </Card>
          <Card className="w-full max-w-sm bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <HeadphonesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">24/7 Support</h3>
              <p className="text-muted-foreground">
                Get help whenever you need it
              </p>
            </CardContent>
          </Card>
          <Card className="w-full max-w-sm bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg">Easy Returns</h3>
              <p className="text-muted-foreground">
                30-day hassle-free returns
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Shop by Category</h2>
          <p className="text-muted-foreground text-lg">
            Explore our wide range of product categories
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {[
            { name: "Electronics", emoji: "📱", count: "1,200+ products" },
            { name: "Fashion", emoji: "👗", count: "2,500+ products" },
            { name: "Home & Garden", emoji: "🏠", count: "800+ products" },
            { name: "Sports", emoji: "⚽", count: "600+ products" },
            { name: "Books", emoji: "📚", count: "1,000+ products" },
            { name: "Beauty", emoji: "💄", count: "400+ products" },
          ].map((category) => (
            <Card key={category.name} className="w-full max-w-sm group hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-6">{category.emoji}</div>
                <h3 className="font-bold text-xl mb-3">{category.name}</h3>
                <p className="text-muted-foreground font-medium">{category.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white/60 backdrop-blur-sm border-t border-gray-100">
        <div className="container mx-auto px-4 py-16 text-center space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ready to Start Shopping?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join thousands of satisfied customers and discover amazing products today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Link href="/products">
                Browse All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-xl border-gray-200 hover:bg-blue-50">
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
