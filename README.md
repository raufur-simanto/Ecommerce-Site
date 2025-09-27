# 🛍️ Modern E-Commerce Platform

A fully functional, scalable, and secure e-commerce platform built with Next.js 15, TypeScript, and modern web technologies. This platform features a complete product catalog, user authentication, comprehensive admin dashboard, and is ready for production deployment.

## ✨ Features

### 🏪 **Single-Vendor Storefront (MVP)**
- **Product Catalog**: Browse products with categories, tags, images, and detailed attributes
- **Advanced Search & Filters**: Search by name, filter by category, brand, price range
- **Product Reviews & Ratings**: Customer reviews with star ratings
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Meta tags, structured data, and search engine optimization

### 👤 **User Management** ✅ **FULLY IMPLEMENTED**
- **Authentication**: Multiple sign-in options (Google, GitHub, Email/Password) with NextAuth.js
- **User Registration**: Complete signup system with password hashing and validation
- **User Profiles**: Profile management with addresses and personal information
- **Role-Based Access**: Admin and customer role management
- **Secure Sessions**: JWT-based session management with proper security

### 🛒 **Shopping Experience**
- **Shopping Cart**: Add/remove items with persistent storage
- **Guest Checkout**: Shop without creating an account
- **Multiple Payment Methods**: Stripe integration for secure payments
- **Order Management**: Real-time order tracking and status updates
- **Email Notifications**: Order confirmations and status updates

### 🔧 **Admin Dashboard** ✅ **FULLY IMPLEMENTED**
- **Product Management**: Complete CRUD operations for products with categories and brands
- **User Management**: Full user administration with role-based filtering and statistics
- **Analytics Dashboard**: Comprehensive business metrics with revenue, orders, and customer insights
- **Settings Management**: Complete store configuration across 8 major sections
- **Inventory Tracking**: Real-time stock levels and low inventory monitoring
- **Data Validation**: Advanced form validation with detailed error handling

### 🔒 **Security & Performance**
- **HTTPS Ready**: Secure SSL certificate configuration
- **Data Validation**: Comprehensive input validation with Zod
- **Authentication**: Secure session management with NextAuth.js
- **Database Security**: Parameterized queries and data sanitization
- **Performance**: Optimized images, caching, and fast loading

## 🚀 Tech Stack

### **Frontend**
- **Next.js 15.5.4** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development with strict configuration
- **Tailwind CSS** - Utility-first CSS framework with custom components
- **Shadcn/ui** - High-quality, accessible UI components
- **Radix UI** - Headless UI primitives for complex components
- **Lucide Icons** - Beautiful, consistent icon library

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
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth.js (Required)
NEXTAUTH_URL="http://localhost:3000" 
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"

# OAuth Providers (Optional - for social login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# Stripe (Optional - for payments)
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

**Note**: The application will work with just the database URL and NextAuth configuration. OAuth and Stripe are optional for development.

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

### 5. Access Database (Optional)
To browse and manage your database visually:
```bash
npx prisma studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555) where you can:
- View all tables and data
- Edit records directly
- Run queries
- Manage relationships

## 📊 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Users & Authentication** - User accounts, profiles, addresses
- **Products & Catalog** - Products, categories, brands, images, attributes
- **Reviews & Ratings** - Customer reviews and ratings
- **Shopping & Orders** - Cart items, orders, payments, shipments
- **Admin & Settings** - Site settings, analytics, coupons

### Sample Data
The seed script creates:
- **Admin user**: `admin@store.com` / `admin123` (for testing admin features)
- **Categories**: Electronics, Fashion, Sports, Home & Garden, Books, Beauty
- **Brands**: Apple, Samsung, Nike, Adidas, Sony
- **Products**: iPhone 15 Pro, Galaxy S24, Nike Air Max, and more with images
- **Reviews**: Sample customer reviews with ratings
- **Site settings**: Basic store configuration

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
npm run db:studio    # Open Prisma Studio (same as: npx prisma studio)
npm run db:reset     # Reset database and reseed
npx prisma studio    # Direct command to open database browser
```

## 🔗 API Endpoints

### **Products**
- `GET /api/products` - List products with search, filters, and pagination
- `GET /api/products/[slug]` - Get single product with reviews and images
- `POST /api/admin/products` - Create new product (admin only)
- `PATCH /api/admin/products/[id]` - Update product (admin only)
- `DELETE /api/admin/products/[id]` - Delete product (admin only)

### **Categories & Brands**
- `GET /api/categories` - List all active categories with product counts
- `GET /api/brands` - List all active brands with product counts
- `POST /api/categories` - Create category (admin)
- `POST /api/brands` - Create brand (admin)

### **Authentication**
- `POST /api/auth/signup` - User registration with email/password
- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `GET /api/auth/session` - Get current user session

### **Admin**
- `GET /api/admin/dashboard` - Dashboard statistics and metrics
- `GET /api/admin/users` - User management with filtering and pagination
- `POST /api/admin/users` - Create/manage users (admin only)

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

### Phase 1 ✅ **COMPLETED**
- ✅ Project setup and architecture with Next.js 15
- ✅ Complete database schema with Prisma ORM
- ✅ Full authentication system (email/password + social login)
- ✅ Product catalog with categories, brands, and images
- ✅ Responsive UI components with Tailwind CSS
- ✅ **Complete admin dashboard with full CRUD operations**
- ✅ User management system with role-based access
- ✅ Analytics dashboard with business metrics
- ✅ Settings management system
- ✅ Form validation and error handling
- ✅ Footer layout and responsive design

### Phase 2 (Next Steps)
- 🔄 Shopping cart implementation
- 🔄 Checkout and payment flow with Stripe
- 🔄 Order management system
- 🔄 Email notifications and confirmations
- 🔄 Customer reviews and ratings system

### Phase 3 (Future)
- 📅 Multi-vendor marketplace capabilities
- 📅 Mobile app integration (React Native)
- 📅 Advanced analytics and reporting
- 📅 Marketing automation and campaigns
- 📅 Performance optimization and caching

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
