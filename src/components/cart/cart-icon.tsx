'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/cart-context'
import { useState } from 'react'
import { CartSidebar } from './cart-sidebar'

export function CartIcon() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {cart.itemCount > 99 ? '99+' : cart.itemCount}
          </Badge>
        )}
        <span className="sr-only">Shopping cart</span>
      </Button>
      
      <CartSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
