import Razorpay from 'razorpay'

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Razorpay configuration for frontend
export const razorpayConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  currency: 'INR',
  name: 'SONNAS Restaurant',
  description: 'Food Order Payment',
  image: '/logo.png', // Add your restaurant logo
  theme: {
    color: '#D97706', // Amber color to match your theme
  },
}
