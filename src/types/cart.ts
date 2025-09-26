export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  slug: string
  quantity: number
  inventory: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface CartContextType {
  cart: Cart
  addToCart: (product: {
    id: string
    name: string
    price: number
    image: string
    slug: string
    inventory: number
  }, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
  getItemQuantity: (productId: string) => number
}
