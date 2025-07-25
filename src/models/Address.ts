import mongoose, { Document, Schema } from 'mongoose'

export interface IAddress extends Document {
  userId: string
  clerkId: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  landmark?: string
  addressType: 'home' | 'work' | 'other'
  isDefault: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
  instructions?: string
  createdAt: Date
  updatedAt: Date
}

const AddressSchema = new Schema<IAddress>({
  userId: {
    type: String,
    required: true,
  },
  clerkId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true,
  },
  street: {
    type: String,
    required: [true, 'Please provide street address'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'Please provide city'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'Please provide state'],
    trim: true,
  },
  zipCode: {
    type: String,
    required: [true, 'Please provide zip code'],
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    required: true,
    default: 'home',
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  coordinates: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  instructions: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
})

// Index for efficient queries
AddressSchema.index({ clerkId: 1 })
AddressSchema.index({ userId: 1 })

export default mongoose.models.Address || mongoose.model<IAddress>('Address', AddressSchema)
