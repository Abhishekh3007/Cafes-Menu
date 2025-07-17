# SONNAS Restaurant System

A modern, fullstack restaurant ordering system built with Next.js, TypeScript, and MongoDB.

## Features

### Frontend
- 🎨 Modern, elegant UI with dark brown/amber theme
- 📱 Fully responsive design
- 🍽️ Menu browsing with categories (Starters, Main Course, Desserts, Beverages)
- ⭐ Popular items showcase
- 🎯 Special offers and promotions (20% off first order)
- 🛒 Shopping cart functionality
- 👤 User authentication and profiles

### Backend
- 🔐 JWT-based authentication
- 📊 MongoDB database with Mongoose ODM
- 🛒 Order management system
- 💳 Payment processing ready (Stripe integration)
- 📧 Email notifications
- 🔒 Role-based access control (Customer/Admin)

### Admin Features
- 📋 Menu management (Add/Edit/Delete items)
- 📦 Order tracking and management
- 👥 User management
- 📈 Sales analytics
- 🍯 Inventory management

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, NextAuth.js
- **Payments**: Stripe
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Animation**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd sonnas-restaurant
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
Copy \`.env.local\` and update the values:
\`\`\`bash
cp .env.local .env.local
\`\`\`

4. Start MongoDB
Make sure MongoDB is running on your system or update the MONGODB_URI to point to your MongoDB instance.

5. Run the development server
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── menu/          # Menu management
│   │   └── orders/        # Order management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── Hero.tsx          # Hero section
│   ├── FeaturedCategories.tsx
│   ├── PopularItems.tsx
│   ├── SpecialOffer.tsx
│   └── Footer.tsx
├── lib/                  # Utility libraries
│   └── mongodb.ts        # Database connection
└── models/               # MongoDB models
    ├── User.ts
    ├── MenuItem.ts
    └── Order.ts
\`\`\`

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login

### Menu
- \`GET /api/menu\` - Get menu items (with filtering)
- \`POST /api/menu\` - Create menu item (admin only)

### Orders
- \`GET /api/orders\` - Get orders (filtered by user/status)
- \`POST /api/orders\` - Create new order

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| \`MONGODB_URI\` | MongoDB connection string | Yes |
| \`JWT_SECRET\` | Secret key for JWT tokens | Yes |
| \`NEXTAUTH_SECRET\` | NextAuth.js secret | Yes |
| \`STRIPE_PUBLISHABLE_KEY\` | Stripe publishable key | For payments |
| \`STRIPE_SECRET_KEY\` | Stripe secret key | For payments |

## Design System

### Colors
- **Primary Brown**: #43302b - #8d5d3e
- **Accent Amber**: #f59e0b - #d97706
- **Background**: Dark brown gradients
- **Text**: White and light browns

### Typography
- **Display Font**: Playfair Display (headings)
- **Body Font**: Inter (body text)

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@sonnas.com or create an issue in the repository.
