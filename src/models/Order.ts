import mongoose, { Document, Schema } from 'mongoose'

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId
  quantity: number
  price: number
  specialInstructions?: string
}

export interface IOrder extends Document {
  orderNumber: string
  customer: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'card' | 'cash' | 'online'
  orderType: 'dine-in' | 'takeout' | 'delivery'
  deliveryAddress?: {
    street: string
    city: string
    state: string
    zipCode: string
    instructions?: string
  }
  estimatedDeliveryTime?: Date
  actualDeliveryTime?: Date
  specialInstructions?: string
  discount?: {
    type: 'percentage' | 'fixed'
    value: number
    code: string
  }
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItem: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  specialInstructions: {
    type: String,
    trim: true,
  },
})

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'online'],
    required: true,
  },
  orderType: {
    type: String,
    enum: ['dine-in', 'takeout', 'delivery'],
    required: true,
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    instructions: String,
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  specialInstructions: {
    type: String,
    trim: true,
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
    },
    value: Number,
    code: String,
  },
}, {
  timestamps: true,
})

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
