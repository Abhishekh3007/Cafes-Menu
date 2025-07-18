'use client'

import { useState } from 'react'

interface PaymentData {
  amount: number
  currency?: string
  orderId?: string
  customerInfo?: {
    name: string
    email: string
    contact: string
  }
}

interface UseRazorpayResult {
  initiatePayment: (data: PaymentData) => Promise<any>
  isLoading: boolean
  error: string | null
}

export const useRazorpay = (): UseRazorpayResult => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const initiatePayment = async (data: PaymentData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if Razorpay is configured
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_your_razorpay_key_id' ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_placeholder_for_build') {
        throw new Error('Razorpay not configured. Please check your environment variables.')
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK')
      }

      // Create order on backend
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency || 'INR',
        }),
      })

      const orderData = await orderResponse.json()
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SONNAS Restaurant',
        description: 'Food Order Payment',
        order_id: orderData.orderId,
        theme: {
          color: '#D97706',
        },
        prefill: data.customerInfo ? {
          name: data.customerInfo.name,
          email: data.customerInfo.email,
          contact: data.customerInfo.contact,
        } : {},
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()
            if (verifyData.success) {
              return {
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              }
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError)
            throw verifyError
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
            throw new Error('Payment cancelled by user')
          },
        },
      }

      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options)
      
      return new Promise((resolve, reject) => {
        razorpay.on('payment.success', (response: any) => {
          setIsLoading(false)
          resolve(response)
        })
        
        razorpay.on('payment.error', (error: any) => {
          setIsLoading(false)
          reject(new Error(error.description || 'Payment failed'))
        })
        
        razorpay.open()
      })

    } catch (err) {
      setIsLoading(false)
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      throw err
    }
  }

  return {
    initiatePayment,
    isLoading,
    error,
  }
}
