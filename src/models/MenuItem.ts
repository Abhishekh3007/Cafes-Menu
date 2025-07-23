import mongoose, { Document, Schema } from 'mongoose'

export interface IMenuItem extends Document {
  name: string
  description: string
  price: number
  category: string
  image: string
  isAvailable: boolean
  ingredients: string[]
  allergens: string[]
  nutritionalInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  preparationTime: number
  isPopular: boolean
  rating: number
  reviews: number
  isSpicy: number // 0 = not spicy, 1 = mild spicy (🌶️), 2 = very spicy (🌶️🌶️)
  isSweet: number // 0 = not sweet, 1 = mildly sweet (🧁🧁), 2 = very sweet (🧁🧁🧁)
  createdAt: Date
  updatedAt: Date
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: {
    type: String,
    required: [true, 'Please provide a name for the menu item'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Small Bites', 'Pizza', 'House Specials', 'Drinks'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  ingredients: [{
    type: String,
    trim: true,
  }],
  allergens: [{
    type: String,
    trim: true,
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  preparationTime: {
    type: Number,
    required: true,
    min: 1,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  isSpicy: {
    type: Number,
    default: 0,
    min: 0,
    max: 2,
  },
  isSweet: {
    type: Number,
    default: 0,
    min: 0,
    max: 2,
  },
}, {
  timestamps: true,
})

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema)
