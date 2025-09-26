'use client'

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import SessionProvider from "@/components/providers/session-provider"
import { CartProvider } from "@/contexts/cart-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </CartProvider>
    </SessionProvider>
  )
}
