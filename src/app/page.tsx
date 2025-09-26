import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Shield, Truck, HeadphonesIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🎉 Welcome to our store
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Discover Amazing Products at
                  <span className="text-primary"> Great Prices</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md">
                  Shop the latest electronics, fashion, home goods, and more. Fast shipping, 
                  easy returns, and excellent customer service.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
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
            <div className="relative lg:h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-6xl">🛍️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience possible.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders over $50
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Your payment information is always secure
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <HeadphonesIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Get help whenever you need it
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day hassle-free returns
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground">
            Explore our wide range of product categories
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Electronics", emoji: "📱", count: "1,200+ products" },
            { name: "Fashion", emoji: "👗", count: "2,500+ products" },
            { name: "Home & Garden", emoji: "🏠", count: "800+ products" },
            { name: "Sports", emoji: "⚽", count: "600+ products" },
            { name: "Books", emoji: "📚", count: "1,000+ products" },
            { name: "Beauty", emoji: "💄", count: "400+ products" },
          ].map((category) => (
            <Card key={category.name} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">{category.emoji}</div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50">
        <div className="container py-16 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready to Start Shopping?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers and discover amazing products today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Browse All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
