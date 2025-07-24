import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  clerkId?: string
  name: string
  email?: string
  mobile: string
  password?: string
  role: 'customer' | 'admin'
  phone?: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  address?: {
    fullName?: string
    street: string
    city: string
    state: string
    zipCode: string
    landmark?: string
    addressType?: 'home' | 'work' | 'other'
  }
  loyaltyPoints: number
  totalOrders: number
  isVerified: boolean
  verificationMethod: 'otp' | 'password'
  profileComplete: boolean
  lastLogin?: Date
  joinedDate?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  mobile: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  phone: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  address: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    landmark: String,
    addressType: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home',
    },
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
    min: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationMethod: {
    type: String,
    enum: ['otp', 'password'],
    default: 'otp',
  },
  profileComplete: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
