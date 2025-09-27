'use client'

import { usePathname } from 'next/navigation'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import SessionProvider from "@/components/providers/session-provider"
import { CartProvider } from "@/contexts/cart-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <SessionProvider>
      <CartProvider>
        {!isAdminPage && <Header />}
        <main className="flex-1">{children}</main>
        {!isAdminPage && <Footer />}
      </CartProvider>
    </SessionProvider>
  )
}
