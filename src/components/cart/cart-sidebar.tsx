'use client'

import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/cart-context'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted) return null

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white flex-shrink-0">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{cart.itemCount} items</Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto min-h-0 relative">
            {cart.items.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Add some products to get started</p>
                <Button onClick={onClose} asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="bg-white rounded-lg p-4 border shadow-sm">
                    <div className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${item.slug}`}
                          className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors block truncate leading-tight"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          ${item.price.toFixed(2)} each
                        </p>
                        
                        {item.inventory <= 5 && (
                          <p className="text-xs text-orange-600 mt-1">
                            Only {item.inventory} left in stock
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-sm text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quantity Controls - Full Width Row */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-gray-200"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center bg-white border-x">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-gray-200"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.inventory}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {/* Add padding at bottom to prevent overlap with checkout button */}
                <div className="h-4"></div>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom with clear separation */}
          {cart.items.length > 0 && (
            <div className="border-t-2 bg-white p-4 space-y-4 flex-shrink-0 shadow-lg">
              <div className="flex justify-between items-center py-2">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full h-12 text-base font-semibold" size="lg" asChild>
                  <Link href="/checkout" onClick={onClose}>
                    Proceed to Checkout ({cart.itemCount} items)
                  </Link>
                </Button>
                <Button variant="outline" className="w-full h-10 text-sm" onClick={onClose} asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
