# 🛍️ Modern E-Commerce Platform

A scalable, secure, and feature-rich e-commerce platform built with Next.js 14, TypeScript, and modern web technologies. This platform supports product catalogs, user management, shopping cart, payments, and comprehensive admin features.

## ✨ Features

### 🏪 **Single-Vendor Storefront (MVP)**
- **Product Catalog**: Browse products with categories, tags, images, and detailed attributes
- **Advanced Search & Filters**: Search by name, filter by category, brand, price range
- **Product Reviews & Ratings**: Customer reviews with star ratings
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Meta tags, structured data, and search engine optimization

### 👤 **User Management**
- **Authentication**: Multiple sign-in options (Google, GitHub, Email/Password)
- **User Profiles**: Complete profile management with addresses
- **Order History**: Track past orders and order status
- **Wishlist**: Save favorite products for later
- **Account Settings**: Manage personal information and preferences

### 🛒 **Shopping Experience**
- **Shopping Cart**: Add/remove items with persistent storage
- **Guest Checkout**: Shop without creating an account
- **Multiple Payment Methods**: Stripe integration for secure payments
- **Order Management**: Real-time order tracking and status updates
- **Email Notifications**: Order confirmations and status updates

### 🔧 **Admin Dashboard**
- **Product Management**: CRUD operations for products, categories, and brands
- **Order Management**: View, process, and manage customer orders
- **User Management**: Manage customer accounts and roles
- **Analytics**: Basic sales and user analytics
- **Inventory Management**: Track stock levels and low inventory alerts

### 🔒 **Security & Performance**
- **HTTPS Ready**: Secure SSL certificate configuration
- **Data Validation**: Comprehensive input validation with Zod
- **Authentication**: Secure session management with NextAuth.js
- **Database Security**: Parameterized queries and data sanitization
- **Performance**: Optimized images, caching, and fast loading

## 🚀 Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **Lucide Icons** - Beautiful icon library

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database operations
- **SQLite** - Lightweight database for development
- **Zod** - Schema validation library

### **Authentication & Payments**
- **NextAuth.js** - Authentication solution
- **Stripe** - Payment processing (ready to integrate)
- **bcryptjs** - Password hashing

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Prisma Studio** - Database browser

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd e-commerce-site
npm install
```

### 2. Environment Setup
Copy the environment example file:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000" 
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users & Authentication** - User accounts, profiles, addresses
- **Products & Catalog** - Products, categories, brands, images, attributes
- **Reviews & Ratings** - Customer reviews and ratings
- **Shopping & Orders** - Cart items, orders, payments, shipments
- **Admin & Settings** - Site settings, analytics, coupons

### Sample Data
The seed script creates:
- Admin user (admin@store.com)
- Sample categories (Electronics, Fashion, Sports, etc.)
- Sample brands (Apple, Samsung, Nike, etc.)
- Sample products with images and reviews
- Basic site settings

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database and reseed
```

## 🔗 API Endpoints

### Products
- `GET /api/products` - List products with search and filters
- `GET /api/products/[slug]` - Get single product
- `POST /api/products` - Create product (admin)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin)

### Authentication
- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Production Database
For production, switch from SQLite to PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update environment variable:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"
```

## 🛠️ Customization

### Adding New Features
The codebase is designed for extensibility:

1. **Multi-vendor Marketplace**: Add vendor models and relationships
2. **Advanced Analytics**: Integrate analytics services
3. **Mobile App**: Use as backend for React Native app
4. **Inventory Management**: Expand inventory tracking features
5. **Marketing Tools**: Add email campaigns, discounts, promotions

### UI Customization
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration for brand colors
- Customize components in `src/components/ui/`

### Business Logic
- API routes in `src/app/api/`
- Database models in `prisma/schema.prisma`
- Validation schemas in `src/lib/validations.ts`

## 📋 Roadmap

### Phase 1 (Completed)
- ✅ Project setup and architecture
- ✅ Database schema and models  
- ✅ Authentication system
- ✅ Product catalog and search
- ✅ User interface components
- ✅ Basic admin functionality

### Phase 2 (Next Steps)
- 🔄 Shopping cart implementation
- 🔄 Checkout and payment flow
- 🔄 Order management system
- 🔄 Email notifications
- 🔄 Advanced admin dashboard

### Phase 3 (Future)
- 📅 Multi-vendor marketplace
- 📅 Mobile app integration
- 📅 Advanced analytics
- 📅 Marketing automation
- 📅 Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Prisma](https://prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Vercel](https://vercel.com/) - Deployment platform

---

**Made with ❤️ for modern e-commerce**
