'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/context/AuthContext'
import withAuth from '@/components/withAuth/withAuth'
import { useRazorpay } from '@/hooks/useRazorpay'

interface DeliveryAddress {
  fullName: string
  phone: string
  address: string
  city: string
  pincode: string
  landmark?: string
}

interface CustomerInfo {
  fullName: string
  phone: string
}

function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const { initiatePayment, isLoading: paymentLoading } = useRazorpay()
  
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery')
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    landmark: ''
  })
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'online'>('cod')
  const [upiId, setUpiId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deliveryFee = orderType === 'delivery' ? 50 : 0
  const finalTotal = total + deliveryFee

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    // Validate customer info for takeaway
    if (orderType === 'takeaway') {
      if (!customerInfo.fullName || !customerInfo.phone) {
        setError('Please fill your name and phone number')
        return false
      }
    }
    
    // Validate delivery address for delivery orders
    if (orderType === 'delivery') {
      if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.address || 
          !deliveryAddress.city || !deliveryAddress.pincode) {
        setError('Please fill all required address fields')
        return false
      }
    }
    
    if (paymentMethod === 'upi' && !upiId) {
      setError('Please enter your UPI ID')
      return false
    }
    
    return true
  }

  const handleSubmitOrder = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Handle online payment with Razorpay
      if (paymentMethod === 'online') {
        const customerName = orderType === 'delivery' ? deliveryAddress.fullName : customerInfo.fullName
        const customerPhone = orderType === 'delivery' ? deliveryAddress.phone : customerInfo.phone
        
        const paymentResult = await initiatePayment({
          amount: finalTotal,
          customerInfo: {
            name: customerName,
            email: '', // Email not available in current auth context
            contact: customerPhone,
          },
        })

        // If payment successful, create order with payment details
        const orderData = {
          items: items,
          orderType: orderType,
          deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
          customerInfo: orderType === 'takeaway' ? customerInfo : null,
          paymentMethod: 'online',
          paymentId: paymentResult.paymentId,
          razorpayOrderId: paymentResult.orderId,
          total: total,
          deliveryFee: deliveryFee,
          finalTotal: finalTotal,
          orderDate: new Date().toISOString()
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Failed to place order')
        }

        const result = await response.json()
        clearCart()
        router.push(`/order-success?orderId=${result.orderId}&orderType=${orderType}`)
      } else {
        // Handle COD and UPI orders (existing logic)
        const orderData = {
          items: items,
          orderType: orderType,
          deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
          customerInfo: orderType === 'takeaway' ? customerInfo : null,
          paymentMethod: paymentMethod,
          upiId: paymentMethod === 'upi' ? upiId : null,
          total: total,
          deliveryFee: deliveryFee,
          finalTotal: finalTotal,
          orderDate: new Date().toISOString()
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Failed to place order')
        }

        const result = await response.json()
        clearCart()
        router.push(`/order-success?orderId=${result.orderId}&orderType=${orderType}`)
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-brown-200 mb-8">Add some delicious items to proceed with checkout</p>
          <button 
            onClick={() => router.push('/menu')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-white text-center mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
            <h2 className="text-2xl font-display font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-brown-700">
                  <div>
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-brown-300 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-amber-300 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-4 border-t border-brown-700">
              <div className="flex justify-between text-brown-200">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-brown-200">
                  <span>Delivery Fee:</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {orderType === 'takeaway' && (
                <div className="flex justify-between text-green-400">
                  <span>Takeaway (No Delivery Fee):</span>
                  <span>₹0.00</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-amber-300 pt-2 border-t border-brown-600">
                <span>Total:</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Type & Details Form */}
          <div className="space-y-6">
            {/* Order Type Selection */}
            <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Order Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delivery Option */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={orderType === 'delivery'}
                    onChange={(e) => setOrderType(e.target.value as 'delivery')}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    orderType === 'delivery' 
                      ? 'border-amber-400 bg-amber-400 bg-opacity-10' 
                      : 'border-brown-600 bg-brown-700 bg-opacity-30'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <div className="text-white font-semibold">Home Delivery</div>
                        <div className="text-brown-300 text-sm">Delivered to your doorstep</div>
                        <div className="text-amber-300 text-sm font-medium">+ ₹50 delivery fee</div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Takeaway Option */}
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="orderType"
                    value="takeaway"
                    checked={orderType === 'takeaway'}
                    onChange={(e) => setOrderType(e.target.value as 'takeaway')}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    orderType === 'takeaway' 
                      ? 'border-amber-400 bg-amber-400 bg-opacity-10' 
                      : 'border-brown-600 bg-brown-700 bg-opacity-30'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏪</span>
                      <div>
                        <div className="text-white font-semibold">Takeaway</div>
                        <div className="text-brown-300 text-sm">Pick up from restaurant</div>
                        <div className="text-green-400 text-sm font-medium">No delivery fee</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Customer Info for Takeaway */}
            {orderType === 'takeaway' && (
              <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
                <h2 className="text-2xl font-display font-bold text-white mb-6">Customer Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customerInfo.fullName}
                      onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                      className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  
                  <div className="bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-400 text-xl mt-1">ℹ️</span>
                      <div className="text-blue-300">
                        <p className="font-semibold mb-1">Pickup Information:</p>
                        <p className="text-sm">• Your order will be ready for pickup in 20-30 minutes</p>
                        <p className="text-sm">• Please bring your order confirmation</p>
                        <p className="text-sm">• Restaurant Address: SONNAS Restaurant, Main Street</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Address for Home Delivery */}
            {orderType === 'delivery' && (
              <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
                <h2 className="text-2xl font-display font-bold text-white mb-6">Delivery Address</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={deliveryAddress.fullName}
                    onChange={(e) => handleAddressChange('fullName', e.target.value)}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={deliveryAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                
                <textarea
                  placeholder="Complete Address *"
                  value={deliveryAddress.address}
                  onChange={(e) => handleAddressChange('address', e.target.value)}
                  rows={3}
                  className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City *"
                    value={deliveryAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={deliveryAddress.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={deliveryAddress.landmark}
                  onChange={(e) => handleAddressChange('landmark', e.target.value)}
                  className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            )}

            {/* Payment Method */}
            <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Cash on Delivery */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                    className="w-4 h-4 text-amber-600"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💵</span>
                    <div>
                      <div className="text-white font-medium">
                        {orderType === 'delivery' ? 'Cash on Delivery' : 'Cash on Pickup'}
                      </div>
                      <div className="text-brown-300 text-sm">
                        {orderType === 'delivery' ? 'Pay when your order arrives' : 'Pay when you collect your order'}
                      </div>
                    </div>
                  </div>
                </label>

                {/* UPI Payment */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                    className="w-4 h-4 text-amber-600"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <div className="text-white font-medium">UPI Payment</div>
                      <div className="text-brown-300 text-sm">Pay using UPI ID</div>
                    </div>
                  </div>
                </label>

                {paymentMethod === 'upi' && (
                  <input
                    type="text"
                    placeholder="Enter your UPI ID (e.g., yourname@paytm)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 ml-7"
                  />
                )}

                {/* Online Payment with Razorpay */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                    className="w-4 h-4 text-amber-600"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <div className="text-white font-medium">Online Payment</div>
                      <div className="text-brown-300 text-sm">Pay securely with Card/UPI/Wallet via Razorpay</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-4">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isLoading || paymentLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 rounded-lg transition-all duration-300 shadow-xl hover:shadow-amber-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isLoading || paymentLoading) ? 
                (paymentMethod === 'online' ? 'Processing Payment...' : 'Placing Order...') : 
                `Place Order - ₹${finalTotal.toFixed(2)}`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(CheckoutPage)
