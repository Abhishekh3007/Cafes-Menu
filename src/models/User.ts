import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email?: string
  mobile: string
  password: string
  role: 'customer' | 'admin'
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
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
    required: [true, 'Please provide a mobile number'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
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
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
