'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Cart, CartItem, CartContextType } from '@/types/cart'

// Cart actions
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Omit<CartItem, 'quantity'>; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { cart: Cart } }

// Initial cart state
const initialCart: Cart = {
  items: [],
  total: 0,
  itemCount: 0
}

// Cart reducer
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload
      const existingItem = state.items.find(item => item.productId === product.productId)
      
      let updatedItems: CartItem[]
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = Math.min(existingItem.quantity + quantity, product.inventory)
        updatedItems = state.items.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          quantity: Math.min(quantity, product.inventory)
        }
        updatedItems = [...state.items, newItem]
      }
      
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: updatedItems,
        total,
        itemCount
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.productId !== action.payload.productId)
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: updatedItems,
        total,
        itemCount
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { productId } })
      }
      
      const updatedItems = state.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.inventory) }
          : item
      )
      
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: updatedItems,
        total,
        itemCount
      }
    }
    
    case 'CLEAR_CART':
      return initialCart
    
    case 'LOAD_CART':
      return action.payload.cart
    
    default:
      return state
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: { cart: parsedCart } })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  const addToCart = (product: {
    id: string
    name: string
    price: number
    image: string
    slug: string
    inventory: number
  }, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product: {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
          inventory: product.inventory
        },
        quantity
      }
    })
  }

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const isInCart = (productId: string) => {
    return cart.items.some(item => item.productId === productId)
  }

  const getItemQuantity = (productId: string) => {
    const item = cart.items.find(item => item.productId === productId)
    return item?.quantity || 0
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
