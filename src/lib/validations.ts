import { z } from 'zod'

// User schemas
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
})

// Address schemas
export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  street1: z.string().min(1, 'Street address is required'),
  street2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
  type: z.enum(['BILLING', 'SHIPPING', 'BOTH']).optional(),
})

// Product schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  comparePrice: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
  trackInventory: z.boolean().optional(),
  inventory: z.number().min(0).optional(),
  lowStockLevel: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
})

export const productImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  altText: z.string().optional(),
  sortOrder: z.number().optional(),
})

export const productAttributeSchema = z.object({
  name: z.string().min(1, 'Attribute name is required'),
  value: z.string().min(1, 'Attribute value is required'),
})

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().optional(),
  content: z.string().optional(),
})

// Cart schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
})

// Order schemas
export const checkoutSchema = z.object({
  billingAddress: addressSchema,
  shippingAddress: addressSchema.optional(),
  useShippingAsBilling: z.boolean().optional(),
  paymentMethod: z.enum(['CREDIT_CARD', 'PAYPAL', 'STRIPE']),
  notes: z.string().optional(),
})

// Search and filter schemas
export const searchParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
})

export const productSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortBy: z.enum(['createdAt', 'price', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
  country: z.string().min(1, 'Country is required'),
})

export const orderCreateSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })),
  total: z.number().positive(),
  shippingAddress: checkoutFormSchema,
  paymentIntentId: z.string().optional(),
})

// Admin schemas
export const couponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  name: z.string().min(1, 'Coupon name is required'),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.number().min(0, 'Value must be positive'),
  minimumAmount: z.number().min(0).optional(),
  maximumDiscount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  userLimit: z.number().min(1).optional(),
  isActive: z.boolean().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
})

// Type exports
export type UserInput = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BrandInput = z.infer<typeof brandSchema>
export type ProductInput = z.infer<typeof productSchema>
export type ProductImageInput = z.infer<typeof productImageSchema>
export type ProductAttributeInput = z.infer<typeof productAttributeSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductSearchInput = z.infer<typeof productSearchSchema>
export type CouponInput = z.infer<typeof couponSchema>
