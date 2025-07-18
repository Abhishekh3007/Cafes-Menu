import Razorpay from 'razorpay'

// Initialize Razorpay instance only if credentials are provided
let razorpay: Razorpay | null = null

if (process.env.RAZORPAY_KEY_ID && 
    process.env.RAZORPAY_KEY_SECRET && 
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_your_razorpay_key_id' &&
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder_for_build' &&
    process.env.RAZORPAY_KEY_SECRET !== 'your_razorpay_key_secret' &&
    process.env.RAZORPAY_KEY_SECRET !== 'placeholder_secret_for_build') {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

export { razorpay }

// Razorpay configuration for frontend
export const razorpayConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  currency: 'INR',
  name: 'SONNAS Restaurant',
  description: 'Food Order Payment',
  image: '/logo.png', // Add your restaurant logo
  theme: {
    color: '#D97706', // Amber color to match your theme
  },
}
