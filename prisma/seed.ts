import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: {
      email: 'admin@store.com',
      name: 'Admin User',
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User'
        }
      }
    }
  })

  console.log('✅ Created admin user')

  // Create brands
  const brands = [
    { name: 'Apple', slug: 'apple', description: 'Innovative technology products' },
    { name: 'Samsung', slug: 'samsung', description: 'Electronics and mobile devices' },
    { name: 'Nike', slug: 'nike', description: 'Athletic apparel and footwear' },
    { name: 'Adidas', slug: 'adidas', description: 'Sports clothing and accessories' },
    { name: 'Sony', slug: 'sony', description: 'Entertainment and electronics' }
  ]

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: brand
    })
  }

  console.log('✅ Created brands')

  // Create categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Latest electronic devices and gadgets' },
    { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories for all styles' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Everything for your home and garden' },
    { name: 'Sports', slug: 'sports', description: 'Sports equipment and athletic wear' },
    { name: 'Books', slug: 'books', description: 'Books for all interests and ages' },
    { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care products' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('✅ Created categories')

  // Get created categories and brands for products
  const electronicsCategory = await prisma.category.findUnique({ where: { slug: 'electronics' } })
  const fashionCategory = await prisma.category.findUnique({ where: { slug: 'fashion' } })
  const sportsCategory = await prisma.category.findUnique({ where: { slug: 'sports' } })
  
  const appleBrand = await prisma.brand.findUnique({ where: { slug: 'apple' } })
  const samsungBrand = await prisma.brand.findUnique({ where: { slug: 'samsung' } })
  const nikeBrand = await prisma.brand.findUnique({ where: { slug: 'nike' } })

  // Create sample products
  const products = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'The most advanced iPhone yet with titanium design and A17 Pro chip.',
      shortDescription: 'Latest iPhone with titanium design',
      sku: 'IPHONE-15-PRO-001',
      price: 999.99,
      comparePrice: 1099.99,
      inventory: 50,
      isFeatured: true,
      categoryId: electronicsCategory!.id,
      brandId: appleBrand!.id,
      images: {
          create: [
            { url: '/iphone-15-pro.svg', altText: 'iPhone 15 Pro' }
          ]
        }
    },
    {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Powerful Android smartphone with AI-enhanced photography.',
      shortDescription: 'Latest Samsung flagship phone',
      sku: 'GALAXY-S24-001',
      price: 799.99,
      comparePrice: 899.99,
      inventory: 30,
      isFeatured: true,
      categoryId: electronicsCategory!.id,
      brandId: samsungBrand!.id,
      images: {
          create: [
            { url: '/galaxy-s24.svg', altText: 'Samsung Galaxy S24' }
          ]
        }
    },
    {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Comfortable running shoes with Max Air technology.',
      shortDescription: 'Premium running shoes',
      sku: 'NIKE-AIRMAX-270-001',
      price: 149.99,
      comparePrice: 179.99,
      inventory: 75,
      isFeatured: false,
      categoryId: sportsCategory!.id,
      brandId: nikeBrand!.id,
      images: {
          create: [
            { url: '/air-max-270.svg', altText: 'Nike Air Max 270' }
          ]
        }
    },
    {
      name: 'Wireless Bluetooth Headphones',
      slug: 'wireless-bluetooth-headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
      shortDescription: 'Wireless noise-cancelling headphones',
      sku: 'HEADPHONES-BT-001',
      price: 199.99,
      comparePrice: 249.99,
      inventory: 40,
      isFeatured: true,
      categoryId: electronicsCategory!.id,
      images: {
          create: [
            { url: '/headphones.svg', altText: 'Wireless Bluetooth Headphones' }
          ]
        }
    },
    {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-t-shirt',
      description: 'Comfortable 100% cotton t-shirt in various colors.',
      shortDescription: 'Basic cotton t-shirt',
      sku: 'TSHIRT-COTTON-001',
      price: 24.99,
      comparePrice: 29.99,
      inventory: 100,
      isFeatured: false,
      categoryId: fashionCategory!.id,
      images: {
          create: [
            { url: '/t-shirt.svg', altText: 'Classic Cotton T-Shirt' }
          ]
        }
    }
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product
    })
  }

  console.log('✅ Created sample products')

  // Create sample reviews
  const sampleProducts = await prisma.product.findMany({ take: 3 })
  const sampleUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Sample Customer',
      role: 'CUSTOMER'
    }
  })

  for (const product of sampleProducts) {
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: sampleUser.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        title: 'Great product!',
        content: 'Really happy with this purchase. Highly recommended!',
        isApproved: true
      }
    })
  }

  console.log('✅ Created sample reviews')

  // Create site settings
  const settings = [
    { key: 'site_name', value: 'E-Commerce Store' },
    { key: 'site_description', value: 'Your one-stop shop for everything' },
    { key: 'contact_email', value: 'support@store.com' },
    { key: 'contact_phone', value: '+1 (555) 123-4567' },
    { key: 'free_shipping_threshold', value: '50' },
    { key: 'currency', value: 'USD' }
  ]

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }

  console.log('✅ Created site settings')
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
