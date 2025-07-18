'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const [timeLeft, setTimeLeft] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-3xl p-8 border border-amber-300 border-opacity-20 shadow-2xl">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-display font-bold text-white mb-4">Order Placed Successfully!</h1>
          
          {orderId && (
            <div className="mb-6">
              <p className="text-brown-200 mb-2">Your Order ID:</p>
              <p className="text-amber-300 font-bold text-lg">#{orderId}</p>
            </div>
          )}

          <div className="space-y-4 text-brown-200 mb-8">
            <p>🎉 Thank you for your order!</p>
            <p>📱 You will receive a confirmation call shortly</p>
            <p>🚚 Expected delivery time: 30-45 minutes</p>
            <p>💝 Your delicious meal is being prepared with love</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
            
            <button 
              onClick={() => router.push('/menu')}
              className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Order More
            </button>
          </div>

          <p className="text-brown-400 text-sm mt-6">
            Redirecting to home in {timeLeft} seconds...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
