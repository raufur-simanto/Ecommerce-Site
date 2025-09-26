const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    price: 79.99,
    comparePrice: 99.99,
    description: 'High-quality wireless headphones with active noise cancellation, superior sound quality, and up to 30 hours of battery life. Perfect for music lovers, commuters, and professionals.',
    shortDescription: 'Premium wireless headphones with noise cancellation',
    sku: 'WBH-001',
    inventory: 25,
    isActive: true,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
        altText: 'Wireless Bluetooth Headphones',
        sortOrder: 0
      }
    ]
  },
  {
    name: 'Premium Coffee Beans',
    slug: 'premium-coffee-beans',
    price: 24.99,
    description: 'Single-origin organic coffee beans sourced directly from Ethiopian highlands. Medium roast with notes of chocolate and citrus. Perfect for pour-over, French press, or espresso.',
    shortDescription: 'Organic single-origin coffee beans from Ethiopia',
    sku: 'PCB-001',
    inventory: 50,
    isActive: true,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop',
        altText: 'Premium Coffee Beans',
        sortOrder: 0
      }
    ]
  },
  {
    name: 'Minimalist Watch',
    slug: 'minimalist-watch',
    price: 149.99,
    comparePrice: 199.99,
    description: 'Elegant minimalist watch featuring a clean design, genuine leather strap, and precise quartz movement. Water-resistant and perfect for both casual and formal occasions.',
    shortDescription: 'Elegant minimalist watch with leather strap',
    sku: 'MW-001',
    inventory: 15,
    isActive: true,
    isFeatured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
        altText: 'Minimalist Watch',
        sortOrder: 0
      }
    ]
  },
  {
    name: 'Premium Yoga Mat',
    slug: 'premium-yoga-mat',
    price: 39.99,
    description: 'Non-slip premium yoga mat made from eco-friendly TPE material. 6mm thick for optimal cushioning and joint protection. Includes carrying strap and exercise guide.',
    shortDescription: 'Eco-friendly non-slip yoga mat with carrying strap',
    sku: 'PYM-001',
    inventory: 30,
    isActive: true,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=800&fit=crop',
        altText: 'Premium Yoga Mat',
        sortOrder: 0
      }
    ]
  },
  {
    name: 'Smart Water Bottle',
    slug: 'smart-water-bottle',
    price: 34.99,
    description: 'Intelligent water bottle with temperature display, hydration tracking, and smartphone app integration. BPA-free stainless steel construction keeps drinks cold for 24 hours.',
    shortDescription: 'Smart water bottle with temperature display and app',
    sku: 'SWB-001',
    inventory: 20,
    isActive: true,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop',
        altText: 'Smart Water Bottle',
        sortOrder: 0
      }
    ]
  },
  {
    name: 'Desk Succulent Plant',
    slug: 'desk-succulent-plant',
    price: 12.99,
    description: 'Beautiful low-maintenance succulent plant perfect for office desks or home decor. Comes with decorative ceramic pot and care instructions. Adds natural beauty to any space.',
    shortDescription: 'Low-maintenance succulent with decorative pot',
    sku: 'DSP-001',
    inventory: 40,
    isActive: true,
    isFeatured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop',
        altText: 'Desk Succulent Plant',
        sortOrder: 0
      }
    ]
  }
]

async function main() {
  try {
    console.log('🌱 Seeding sample products...')

    // Create Electronics category if it doesn't exist
    const electronicsCategory = await prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        isActive: true,
        sortOrder: 1
      }
    })

    // Create other categories
    const categories = [
      { name: 'Food & Beverage', slug: 'food-beverage', description: 'Food and beverages' },
      { name: 'Fashion', slug: 'fashion', description: 'Fashion and accessories' },
      { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Sports and fitness equipment' },
      { name: 'Health & Wellness', slug: 'health-wellness', description: 'Health and wellness products' },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home and garden products' }
    ]

    const createdCategories = {}
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          ...cat,
          isActive: true,
          sortOrder: 1
        }
      })
      createdCategories[cat.slug] = category
    }
    createdCategories['electronics'] = electronicsCategory

    // Create sample brand
    const sampleBrand = await prisma.brand.upsert({
      where: { slug: 'sample-brand' },
      update: {},
      create: {
        name: 'Sample Brand',
        slug: 'sample-brand',
        description: 'Sample brand for demo purposes',
        isActive: true
      }
    })

    // Assign categories to products
    const productCategoryMap = {
      'wireless-bluetooth-headphones': 'electronics',
      'premium-coffee-beans': 'food-beverage',
      'minimalist-watch': 'fashion',
      'premium-yoga-mat': 'sports-fitness',
      'smart-water-bottle': 'health-wellness',
      'desk-succulent-plant': 'home-garden'
    }

    // Create products with relationships
    for (const productData of sampleProducts) {
      const categorySlug = productCategoryMap[productData.slug]
      const category = createdCategories[categorySlug]

      const { images, ...productWithoutImages } = productData

      const product = await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          ...productWithoutImages,
          categoryId: category.id,
          brandId: sampleBrand.id,
          images: {
            create: images
          }
        }
      })

      console.log(`✅ Created product: ${product.name}`)
    }

    console.log('🎉 Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
