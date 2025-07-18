'use client'

import { useState } from 'react'
import { useRazorpay } from '@/hooks/useRazorpay'

export default function PaymentTestPage() {
  const { initiatePayment, isLoading, error } = useRazorpay()
  const [amount, setAmount] = useState(100)
  const [message, setMessage] = useState('')

  const handleTestPayment = async () => {
    try {
      setMessage('')
      const result = await initiatePayment({
        amount: amount,
        customerInfo: {
          name: 'Test Customer',
          email: 'test@example.com',
          contact: '9999999999',
        },
      })
      setMessage(`Payment successful! Payment ID: ${result.paymentId}`)
    } catch (err: any) {
      setMessage(`Payment failed: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 flex items-center justify-center p-4">
      <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-amber-300 border-opacity-20 max-w-md w-full">
        <h1 className="text-2xl font-display font-bold text-white mb-6 text-center">
          Razorpay Payment Test
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-brown-200 mb-2">Test Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white"
              min="1"
            />
          </div>
          
          <button
            onClick={handleTestPayment}
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : `Pay ₹${amount}`}
          </button>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          {message && (
            <div className={`border border-opacity-30 rounded-lg p-4 ${
              message.includes('successful') 
                ? 'bg-green-500 bg-opacity-20 border-green-500' 
                : 'bg-red-500 bg-opacity-20 border-red-500'
            }`}>
              <p className={`text-sm ${
                message.includes('successful') ? 'text-green-300' : 'text-red-300'
              }`}>
                {message}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-brown-400 text-sm">
          <p className="font-medium mb-2">Test Card Details:</p>
          <p>Card: 4111 1111 1111 1111</p>
          <p>CVV: Any 3 digits</p>
          <p>Expiry: Any future date</p>
        </div>
      </div>
    </div>
  )
}
