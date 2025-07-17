const mongoose = require('mongoose')

// Simple connection without ES6 imports for Node.js script
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sonnas-restaurant'

// Define schemas directly in the script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
}, { timestamps: true })

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Small Bites', 'Pizza', 'House Specials', 'Drinks'] },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  preparationTime: { type: Number, required: true },
  isPopular: { type: Boolean, default: false },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)
const MenuItem = mongoose.model('MenuItem', MenuItemSchema)

const sampleMenuItems = [
  // Small Bites
  {
    name: 'Korean Bun',
    description: 'Traditional Korean-style steamed bun',
    price: 1.60,
    category: 'Small Bites',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Korean flour', 'Yeast', 'Sesame'],
    allergens: ['Gluten', 'Sesame'],
    nutritionalInfo: { calories: 180, protein: 6, carbs: 32, fat: 3 },
    preparationTime: 15,
    isPopular: false,
    rating: 4.5,
    reviews: 45,
    isAvailable: true,
  },
  {
    name: 'Chilli Korean Bun',
    description: 'Spicy Korean-style steamed bun with chili',
    price: 1.70,
    category: 'Small Bites',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Korean flour', 'Chili', 'Spices'],
    allergens: ['Gluten'],
    nutritionalInfo: { calories: 190, protein: 6, carbs: 33, fat: 4 },
    preparationTime: 15,
    isPopular: false,
    rating: 4.6,
    reviews: 52,
    isAvailable: true,
  },
  {
    name: 'Sliders Appetizers',
    description: 'Mini burgers (2 sliders)',
    price: 2.60,
    category: 'Small Bites',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Mini bun', 'Beef patty', 'Cheese'],
    allergens: ['Gluten', 'Dairy'],
    nutritionalInfo: { calories: 420, protein: 22, carbs: 28, fat: 24 },
    preparationTime: 10,
    isPopular: true,
    rating: 4.7,
    reviews: 89,
    isAvailable: true,
  },
  {
    name: 'Paneer Appetizers',
    description: 'Spiced paneer bites',
    price: 2.60,
    category: 'Small Bites',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Paneer', 'Spices', 'Herbs'],
    allergens: ['Dairy'],
    nutritionalInfo: { calories: 280, protein: 18, carbs: 8, fat: 20 },
    preparationTime: 15,
    isPopular: false,
    rating: 4.6,
    reviews: 67,
    isAvailable: true,
  },

  // Pizza
  {
    name: 'Fantasy Pizza',
    description: 'Onions, Bell peppers, Paneer, Coriander, and Oregano',
    price: 2.90,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Onions', 'Bell peppers', 'Paneer', 'Coriander', 'Oregano'],
    allergens: ['Gluten', 'Dairy'],
    nutritionalInfo: { calories: 350, protein: 16, carbs: 38, fat: 16 },
    preparationTime: 20,
    isPopular: true,
    rating: 4.6,
    reviews: 134,
    isAvailable: true,
  },
  {
    name: 'Margherita Pizza',
    description: 'Hand Folio Thin Crust pizza with tomato and mozzarella',
    price: 2.30,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Thin crust', 'Tomato sauce', 'Mozzarella'],
    allergens: ['Gluten', 'Dairy'],
    nutritionalInfo: { calories: 280, protein: 12, carbs: 35, fat: 10 },
    preparationTime: 15,
    isPopular: false,
    rating: 4.5,
    reviews: 98,
    isAvailable: true,
  },

  // House Specials
  {
    name: 'Paneer Tikka/Butter Masala with Rice or Kulcha',
    description: 'Creamy Paneer Tikka (spicy) or Butter (sweet) Masala served with Rice or Kulcha (your choice)',
    price: 2.95,
    category: 'House Specials',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Paneer', 'Tomato gravy', 'Rice/Kulcha'],
    allergens: ['Dairy', 'Gluten'],
    nutritionalInfo: { calories: 450, protein: 22, carbs: 45, fat: 22 },
    preparationTime: 25,
    isPopular: true,
    rating: 4.9,
    reviews: 203,
    isAvailable: true,
  },
  {
    name: 'Dal Makhni with Rice or Kulcha',
    description: 'Creamy homemade Kali Dal served with Rice or Kulcha (your choice)',
    price: 2.95,
    category: 'House Specials',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Black lentils', 'Cream', 'Rice/Kulcha'],
    allergens: ['Dairy', 'Gluten'],
    nutritionalInfo: { calories: 380, protein: 18, carbs: 42, fat: 16 },
    preparationTime: 30,
    isPopular: true,
    rating: 4.8,
    reviews: 167,
    isAvailable: true,
  },
  {
    name: 'Khao Suey',
    description: 'Coconut based Curry filled with noodles and loads of condiments',
    price: 2.80,
    category: 'House Specials',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Coconut curry', 'Noodles', 'Various condiments'],
    allergens: ['Gluten'],
    nutritionalInfo: { calories: 420, protein: 14, carbs: 52, fat: 18 },
    preparationTime: 20,
    isPopular: true,
    rating: 4.7,
    reviews: 145,
    isAvailable: true,
  },
  {
    name: 'Amritsari Chole with House Baked Kulche',
    description: 'Homemade Punjabi style Chhole filled with love',
    price: 2.40,
    category: 'House Specials',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Chickpeas', 'Kulcha bread', 'Punjabi spices'],
    allergens: ['Gluten'],
    nutritionalInfo: { calories: 380, protein: 16, carbs: 58, fat: 8 },
    preparationTime: 25,
    isPopular: false,
    rating: 4.8,
    reviews: 123,
    isAvailable: true,
  },

  // Drinks
  {
    name: 'Milkshakes',
    description: 'KitKat/Vanilla/Strawberry/Chocolate varieties',
    price: 1.60,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Milk', 'Ice cream', 'Flavoring'],
    allergens: ['Dairy', 'Gluten'],
    nutritionalInfo: { calories: 320, protein: 8, carbs: 42, fat: 14 },
    preparationTime: 5,
    isPopular: true,
    rating: 4.8,
    reviews: 189,
    isAvailable: true,
  },
  {
    name: 'Cucumber Lemonade',
    description: 'Fresh cucumber and lemon drink',
    price: 1.40,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Cucumber', 'Lemon', 'Mint'],
    allergens: [],
    nutritionalInfo: { calories: 45, protein: 1, carbs: 11, fat: 0 },
    preparationTime: 5,
    isPopular: false,
    rating: 4.6,
    reviews: 76,
    isAvailable: true,
  },
  {
    name: 'Mojito',
    description: 'Classic mint and lime refresher',
    price: 1.40,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    ingredients: ['Mint', 'Lime', 'Soda water'],
    allergens: [],
    nutritionalInfo: { calories: 35, protein: 0, carbs: 9, fat: 0 },
    preparationTime: 4,
    isPopular: false,
    rating: 4.7,
    reviews: 92,
    isAvailable: true,
  }
]

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@sonnas.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPfKwqzrj6M0m', // hashed 'admin123'
    role: 'admin',
    phone: '(555) 123-4567',
    address: {
      street: '123 Restaurant Ave',
      city: 'Culinary City',
      state: 'CA',
      zipCode: '90210',
    },
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPfKwqzrj6M0m', // hashed 'password123'
    role: 'customer',
    phone: '(555) 987-6543',
    address: {
      street: '456 Customer St',
      city: 'Food City',
      state: 'CA',
      zipCode: '90211',
    },
  }
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await MenuItem.deleteMany({})
    console.log('Cleared existing data')

    // Insert sample data
    await User.insertMany(sampleUsers)
    console.log('Inserted sample users')

    await MenuItem.insertMany(sampleMenuItems)
    console.log('Inserted sample menu items')

    console.log('Database seeded successfully!')
    console.log(`Inserted ${sampleUsers.length} users and ${sampleMenuItems.length} menu items`)

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seed function
seedDatabase()
