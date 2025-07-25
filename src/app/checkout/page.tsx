'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/context/AuthContext'
import { useRazorpay } from '@/hooks/useRazorpay'
import { SignInButton } from '@clerk/nextjs'
import { validateUpiId } from '@/lib/upi'
import LoyaltyPoints from '@/components/LoyaltyPoints'

interface DeliveryAddress {
  fullName: string
  phone: string
  address: string
  city: string
  pincode: string
  landmark?: string
}

interface SavedAddress {
  _id: string
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
  createdAt: string
  updatedAt: string
}

interface CustomerInfo {
  fullName: string
  phone: string
}

export default function CheckoutPage() {
  const { items, total, clearCart, closeCart } = useCart()
  const router = useRouter()
  const { initiatePayment, isLoading: paymentLoading } = useRazorpay()
  const { user, isAuthenticated } = useAuth()

  // Buy Now functionality - check for direct purchase
  const [isBuyNow, setIsBuyNow] = useState(false)
  const [buyNowItem, setBuyNowItem] = useState<any>(null)
  const [buyNowTotal, setBuyNowTotal] = useState(0)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Check if this is a Buy Now transaction
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isBuyNowMode = urlParams.get('buyNow') === 'true'
    
    if (isBuyNowMode) {
      const storedItem = sessionStorage.getItem('buyNowItem')
      if (storedItem) {
        const item = JSON.parse(storedItem)
        setIsBuyNow(true)
        setBuyNowItem(item)
        setBuyNowTotal(item.price)
        sessionStorage.removeItem('buyNowItem')
      }
    }
  }, [])

  // Use Buy Now item or cart items
  const currentItems = isBuyNow ? [buyNowItem] : items
  const currentTotal = isBuyNow ? buyNowTotal : total

  // Close cart when checkout page loads
  useEffect(() => {
    closeCart()
  }, [closeCart])
  
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery')
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
    landmark: ''
  })
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: user?.name || '',
    phone: user?.phone || ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'online'>('cod')
  const [upiId, setUpiId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0)
  const [loyaltyPointsUsed, setLoyaltyPointsUsed] = useState(0)

  // Saved addresses functionality
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showSavedAddresses, setShowSavedAddresses] = useState(false)
  const [addressesLoading, setAddressesLoading] = useState(false)

  const deliveryFee = orderType === 'delivery' ? 50 : 0
  const subtotal = currentTotal + deliveryFee
  const finalTotal = subtotal - loyaltyDiscount

  // Update customer info when user changes
  useEffect(() => {
    if (user) {
      setDeliveryAddress(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || ''
      }))
      setCustomerInfo({
        fullName: user.name || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  // Fetch saved addresses
  const fetchSavedAddresses = useCallback(async () => {
    if (!isAuthenticated) return

    setAddressesLoading(true)
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = await response.json()
        setSavedAddresses(data.addresses || [])
        
        // Auto-select default address if no address is currently selected
        const defaultAddress = data.addresses?.find((addr: SavedAddress) => addr.isDefault)
        if (defaultAddress && !deliveryAddress.address) {
          selectSavedAddress(defaultAddress)
        }
      }
    } catch (error) {
      console.error('Failed to fetch saved addresses:', error)
    } finally {
      setAddressesLoading(false)
    }
  }, [isAuthenticated, deliveryAddress.address])

  // Use saved address data
  const selectSavedAddress = (address: SavedAddress) => {
    setDeliveryAddress({
      fullName: address.fullName,
      phone: address.phone,
      address: address.street,
      city: address.city,
      pincode: address.zipCode,
      landmark: address.landmark || ''
    })
    setSelectedAddressId(address._id)
    setShowSavedAddresses(false)
  }

  // Fetch addresses when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated && orderType === 'delivery') {
      fetchSavedAddresses()
    }
  }, [isAuthenticated, orderType, fetchSavedAddresses])

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleLoyaltyRedemption = (points: number, discount: number) => {
    setLoyaltyPointsUsed(points)
    setLoyaltyDiscount(discount)
  }

  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [showLandmarkModal, setShowLandmarkModal] = useState(false)
  const [pendingLocationData, setPendingLocationData] = useState<any>(null)

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setIsLocationLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      const { latitude, longitude } = position.coords
      
      // Show map link and get address
      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
      
      // Try to get address using free geocoding service
      try {
        // Using Nominatim (OpenStreetMap) - free reverse geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'SONNAS Restaurant App'
            }
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          
          if (data && data.address) {
            const addr = data.address
            const locationData = {
              address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              city: addr.city || addr.town || addr.village || addr.suburb || '',
              pincode: addr.postcode || '',
              mapUrl: mapUrl,
              coordinates: { latitude, longitude }
            }
            
            setPendingLocationData(locationData)
            setShowLandmarkModal(true)
          } else {
            throw new Error('No address found')
          }
        } else {
          throw new Error('Geocoding service unavailable')
        }
      } catch (geocodeError) {
        // Fallback: Use coordinates with manual entry
        const locationData = {
          address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
          city: '',
          pincode: '',
          mapUrl: mapUrl,
          coordinates: { latitude, longitude }
        }
        
        setPendingLocationData(locationData)
        setShowLandmarkModal(true)
      }
      
    } catch (error: any) {
      let errorMessage = 'Unable to retrieve your location.'
      
      if (error.code) {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location access denied. Please allow location access and try again.'
            break
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information is unavailable.'
            break
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLocationLoading(false)
    }
  }

  const confirmLocationWithLandmark = (landmark: string) => {
    if (pendingLocationData) {
      setDeliveryAddress(prev => ({
        ...prev,
        address: pendingLocationData.address,
        city: pendingLocationData.city,
        pincode: pendingLocationData.pincode,
        landmark: landmark
      }))
      
      setShowLandmarkModal(false)
      setPendingLocationData(null)
    }
  }

  const validateForm = () => {
    if (orderType === 'delivery') {
      if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.pincode) {
        setError('Please fill in all delivery address fields')
        return false
      }
    } else {
      if (!customerInfo.fullName || !customerInfo.phone) {
        setError('Please fill in your contact information')
        return false
      }
    }
    
    if (paymentMethod === 'upi' && !upiId) {
      setError('Please enter your UPI ID')
      return false
    }
    
    if (paymentMethod === 'upi' && upiId && !validateUpiId(upiId)) {
      setError('Please enter a valid UPI ID (e.g., yourname@paytm)')
      return false
    }
    
    return true
  }

  const handlePayNow = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      return
    }

    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const orderData: any = {
        items: currentItems,
        orderType,
        paymentMethod,
        totalAmount: finalTotal,
        loyaltyPointsUsed,
        loyaltyDiscount,
        ...(orderType === 'delivery' ? { deliveryAddress } : { customerInfo }),
        ...(paymentMethod === 'upi' && { upiId }),
        isBuyNow,
      }

      if (paymentMethod === 'online') {
        const customerName = orderType === 'delivery' ? deliveryAddress.fullName : customerInfo.fullName
        const customerPhone = orderType === 'delivery' ? deliveryAddress.phone : customerInfo.phone
        
        const paymentResult = await initiatePayment({
          amount: finalTotal,
          customerInfo: {
            name: customerName,
            email: user?.email || '',
            contact: customerPhone,
          },
        })

        orderData.paymentId = paymentResult.paymentId
        orderData.razorpayOrderId = paymentResult.orderId
      } else if (paymentMethod === 'upi') {
        // Generate UPI payment URL
        const customerName = orderType === 'delivery' ? deliveryAddress.fullName : customerInfo.fullName
        
        const upiResponse = await fetch('/api/payment/upi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            customerName,
            orderId: `${Date.now()}`, // Generate temporary order ID
          }),
        })

        if (!upiResponse.ok) {
          throw new Error('Failed to generate UPI payment details')
        }

        const upiData = await upiResponse.json()
        
        // Store UPI payment details for the order
        orderData.upiPaymentUrl = upiData.data.upiUrl
        orderData.upiPaymentDetails = upiData.data.paymentDetails
        
        // Open UPI app immediately after order creation
        setTimeout(() => {
          window.location.href = upiData.data.upiUrl
        }, 1000)
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to place order')
      }

      const result = await response.json()

      if (isBuyNow) {
        sessionStorage.removeItem('buyNowItem')
      } else {
        clearCart()
      }

      router.push(`/order-success?orderId=${result.orderId}&orderType=${orderType}&paymentMethod=${paymentMethod}`)

    } catch (error: any) {
      setError(error.message || 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  if (currentItems.length === 0 && !isBuyNow) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl border-2 border-vibrant-coral shadow-2xl">
          <h1 className="text-3xl font-display font-bold text-charcoal-brown mb-4">Your cart is empty</h1>
          <p className="text-brown-light mb-8">Add some delicious items to proceed with checkout</p>
          <button 
            onClick={() => router.push('/menu')}
            className="bg-vibrant-coral hover:bg-coral-light text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-cream py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Buy Now Indicator */}
        {isBuyNow && (
          <div className="mb-6 bg-gradient-to-r from-vibrant-coral to-coral-light p-4 rounded-lg shadow-lg border-2 border-vibrant-coral">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white text-lg font-semibold">⚡ Express Checkout</span>
              <span className="text-white text-sm">- Amazon-style one-click buy</span>
            </div>
          </div>
        )}
        
        <h1 className="text-4xl font-display font-bold text-charcoal-brown text-center mb-8">
          {isBuyNow ? 'Express Checkout' : 'Checkout'}
        </h1>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl border-2 border-vibrant-coral shadow-2xl max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-charcoal-brown mb-4 text-center">Login Required</h2>
              <p className="text-brown-light mb-6 text-center">
                Please sign in to complete your order
              </p>
              <div className="flex flex-col space-y-4">
                <SignInButton mode="modal">
                  <button className="w-full bg-vibrant-coral hover:bg-coral-light text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full bg-light-taupe hover:bg-taupe-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Location Confirmation Modal */}
        {showLandmarkModal && pendingLocationData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl border-2 border-soft-gold shadow-2xl max-w-lg w-full mx-4">
              <h2 className="text-2xl font-bold text-charcoal-brown mb-4 text-center">📍 Confirm Your Location</h2>
              
              <div className="space-y-4 mb-6">
                <div className="bg-cream-dark p-4 rounded-lg border-2 border-soft-gold">
                  <p className="text-charcoal-brown font-medium mb-2">📍 Detected Address:</p>
                  <p className="text-brown-light text-sm mb-1">{pendingLocationData.address}</p>
                  {pendingLocationData.city && (
                    <p className="text-brown-light text-sm">🏙️ City: {pendingLocationData.city}</p>
                  )}
                  {pendingLocationData.pincode && (
                    <p className="text-brown-light text-sm">📮 Pincode: {pendingLocationData.pincode}</p>
                  )}
                  <div className="mt-2 text-xs text-brown-light">
                    <p>📐 Coordinates: {pendingLocationData.coordinates.latitude.toFixed(6)}, {pendingLocationData.coordinates.longitude.toFixed(6)}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={pendingLocationData.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center flex items-center justify-center space-x-1"
                  >
                    <span>🗺️</span>
                    <span>View on Google Maps</span>
                  </a>
                  <button
                    onClick={() => {
                      // Copy coordinates to clipboard
                      navigator.clipboard?.writeText(`${pendingLocationData.coordinates.latitude}, ${pendingLocationData.coordinates.longitude}`)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>�</span>
                    <span>Copy Coordinates</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-charcoal-brown font-medium mb-2">
                    Add Landmark (Optional but recommended)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Near McDonald's, Opposite Park, Building Name, etc."
                    className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        confirmLocationWithLandmark((e.target as HTMLInputElement).value)
                      }
                    }}
                  />
                  <p className="text-brown-light text-xs mt-1">
                    This helps our delivery partner find your location easily
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="landmark"]') as HTMLInputElement
                      confirmLocationWithLandmark(input?.value || '')
                    }}
                    className="flex-1 bg-vibrant-coral hover:bg-coral-light text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    ✅ Use This Location
                  </button>
                  <button
                    onClick={() => {
                      setShowLandmarkModal(false)
                      setPendingLocationData(null)
                    }}
                    className="flex-1 bg-light-taupe hover:bg-taupe-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 border-2 border-vibrant-coral shadow-2xl">
            <h2 className="text-2xl font-display font-bold text-charcoal-brown mb-6">
              {isBuyNow ? '⚡ Express Order' : 'Order Summary'}
            </h2>
            
            <div className="space-y-4 mb-6">
              {currentItems.map((item) => (
                <div key={item.id} className={`flex justify-between items-center py-3 border-b-2 border-light-taupe ${isBuyNow ? 'bg-coral-light bg-opacity-10 rounded-lg px-3 border-2 border-vibrant-coral' : ''}`}>
                  <div>
                    <h3 className="text-charcoal-brown font-medium text-lg">
                      {isBuyNow && '⚡ '}{item.name}
                    </h3>
                    <p className="text-brown-light text-sm">Qty: {item.quantity || 1}</p>
                    {isBuyNow && (
                      <p className="text-vibrant-coral text-xs font-medium">Express Checkout Item</p>
                    )}
                  </div>
                  <span className="text-soft-gold font-bold text-lg">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-4 border-t-2 border-vibrant-coral">
              <div className="flex justify-between text-charcoal-brown font-medium">
                <span>Subtotal:</span>
                <span>₹{currentTotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-charcoal-brown font-medium">
                  <span>Delivery Fee:</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {orderType === 'takeaway' && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Takeaway (No Delivery Fee):</span>
                  <span>₹0.00</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Loyalty Discount ({loyaltyPointsUsed} points):</span>
                  <span>-₹{loyaltyDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-vibrant-coral pt-2 border-t-2 border-vibrant-coral bg-coral-light bg-opacity-10 p-2 rounded">
                <span>Total:</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={handlePayNow}
              disabled={isLoading || paymentLoading}
              className={`w-full font-semibold py-4 rounded-lg transition-all duration-300 shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6 ${
                isBuyNow 
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-green-500/25' 
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 hover:shadow-amber-500/25'
              } text-white`}
            >
              {(isLoading || paymentLoading) ? 
                (paymentMethod === 'online' ? 'Processing Payment...' : 'Placing Order...') : 
                isBuyNow ? `⚡ Pay Now - ₹${finalTotal.toFixed(2)}` : `💳 Pay Now - ₹${finalTotal.toFixed(2)}`
              }
            </button>
            
            {!isAuthenticated && (
              <p className="text-brown-light text-xs text-center mt-2">
                You&apos;ll need to sign in when clicking Pay Now
              </p>
            )}
          </div>

          {/* Loyalty Points Section */}
          <LoyaltyPoints 
            userMobile={user?.mobile}
            billAmount={subtotal}
            onPointsRedeemed={handleLoyaltyRedemption}
          />

          {/* Order Type & Details Form */}
          <div className="space-y-6">
            {/* Order Type Selection */}
            <div className="bg-white rounded-2xl p-6 border-2 border-soft-gold shadow-2xl">
              <h2 className="text-2xl font-display font-bold text-charcoal-brown mb-6">Order Type</h2>
              
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
                      ? 'border-soft-gold bg-gold-light bg-opacity-20 shadow-lg' 
                      : 'border-light-taupe bg-cream-dark hover:border-soft-gold'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🚚</span>
                      <div>
                        <div className="text-charcoal-brown font-semibold">Home Delivery</div>
                        <div className="text-brown-light text-sm">Delivered to your doorstep</div>
                        <div className="text-vibrant-coral text-sm font-medium">+ ₹50 delivery fee</div>
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
                      ? 'border-soft-gold bg-gold-light bg-opacity-20 shadow-lg' 
                      : 'border-light-taupe bg-cream-dark hover:border-soft-gold'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏪</span>
                      <div>
                        <div className="text-charcoal-brown font-semibold">Takeaway</div>
                        <div className="text-brown-light text-sm">Pick up from restaurant</div>
                        <div className="text-green-600 text-sm font-medium">No delivery fee</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Customer Info for Takeaway */}
            {orderType === 'takeaway' && (
              <div className="bg-white rounded-2xl p-6 border-2 border-soft-gold shadow-2xl">
                <h2 className="text-2xl font-display font-bold text-charcoal-brown mb-6">Customer Information</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customerInfo.fullName}
                      onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                      className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                      required
                    />
                  </div>
                  
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-600 text-xl mt-1">ℹ️</span>
                      <div className="text-blue-800">
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
              <div className="bg-white rounded-2xl p-6 border-2 border-soft-gold shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-bold text-charcoal-brown">Delivery Address</h2>
                  
                  {/* Saved Addresses Toggle Button */}
                  {isAuthenticated && savedAddresses.length > 0 && (
                    <button
                      onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                      className="flex items-center space-x-2 bg-vibrant-coral hover:bg-vibrant-coral/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <span>🏠</span>
                      <span>{showSavedAddresses ? 'Hide' : 'Saved'} Addresses</span>
                    </button>
                  )}
                </div>

                {/* Saved Addresses List */}
                {isAuthenticated && showSavedAddresses && (
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-charcoal-brown">Your Saved Addresses</h3>
                      <button
                        onClick={() => router.push('/addresses')}
                        className="text-vibrant-coral hover:text-vibrant-coral/80 text-sm font-medium transition-colors"
                      >
                        Manage Addresses
                      </button>
                    </div>
                    
                    {addressesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-vibrant-coral border-t-transparent"></div>
                        <span className="ml-2 text-gray-600">Loading addresses...</span>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {savedAddresses.map((address) => (
                          <div
                            key={address._id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedAddressId === address._id
                                ? 'border-vibrant-coral bg-coral-light bg-opacity-10'
                                : 'border-light-taupe hover:border-soft-gold'
                            }`}
                            onClick={() => selectSavedAddress(address)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    address.addressType === 'home' ? 'text-green-600 bg-green-100' :
                                    address.addressType === 'work' ? 'text-blue-600 bg-blue-100' :
                                    'text-gray-600 bg-gray-100'
                                  }`}>
                                    <span>
                                      {address.addressType === 'home' ? '🏠' : 
                                       address.addressType === 'work' ? '🏢' : '📍'}
                                    </span>
                                    <span className="capitalize">{address.addressType}</span>
                                  </div>
                                  {address.isDefault && (
                                    <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                      <span>⭐</span>
                                      <span>Default</span>
                                    </div>
                                  )}
                                </div>
                                
                                <h4 className="font-semibold text-charcoal-brown mb-1">{address.fullName}</h4>
                                <p className="text-brown-light text-sm mb-1">{address.phone}</p>
                                
                                <div className="text-charcoal-brown text-sm space-y-1">
                                  <p>{address.street}</p>
                                  <p>{address.city}, {address.state} {address.zipCode}</p>
                                  {address.landmark && (
                                    <p className="text-brown-light">Near: {address.landmark}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="ml-4">
                                {selectedAddressId === address._id && (
                                  <div className="w-6 h-6 bg-vibrant-coral rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Address Form */}
                <div className="space-y-4">
                  {(!isAuthenticated || !showSavedAddresses || savedAddresses.length === 0) && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 text-sm mt-0.5">💡</span>
                        <div className="text-blue-800 text-xs">
                          <p className="font-medium mb-1">Tip:</p>
                          <p>
                            {!isAuthenticated 
                              ? 'Sign in to save addresses for faster checkout next time!'
                              : 'Save this address to your profile for faster checkout next time!'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={deliveryAddress.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={deliveryAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <textarea
                      placeholder="Complete Address *"
                      value={deliveryAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      rows={3}
                      className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isLocationLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {isLocationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Getting Location...</span>
                        </>
                      ) : (
                        <>
                          <span>📍</span>
                          <span>Use Current Location</span>
                        </>
                      )}
                    </button>
                    <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-600 text-sm mt-0.5">💡</span>
                        <div className="text-blue-800 text-xs">
                          <p className="font-medium mb-1">Location Features:</p>
                          <p>• Automatically detects your current address</p>
                          <p>• Opens Google Maps for verification</p>
                          <p>• Asks for landmark to help delivery</p>
                          <p>• Works offline with coordinates if needed</p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Clear all address fields for manual entry
                        setDeliveryAddress(prev => ({
                          ...prev,
                          address: '',
                          city: '',
                          pincode: '',
                          landmark: ''
                        }))
                      }}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      ✏️ Enter Address Manually
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City *"
                      value={deliveryAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={deliveryAddress.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                      required
                    />
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={deliveryAddress.landmark}
                    onChange={(e) => handleAddressChange('landmark', e.target.value)}
                    className="w-full bg-cream-dark border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold focus:bg-white"
                  />
                  <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 text-sm mt-0.5">✨</span>
                      <div className="text-green-800 text-xs">
                        <p className="font-medium mb-1">Landmark Tips:</p>
                        <p>• Near famous shops, restaurants, or buildings</p>
                        <p>• Opposite landmarks like parks, temples, etc.</p>
                        <p>• Building name, floor, apartment number</p>
                        <p>• Any visible reference point for easy delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 border-2 border-soft-gold shadow-2xl">
              <h2 className="text-2xl font-display font-bold text-charcoal-brown mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Cash on Delivery */}
                <label className="flex items-center space-x-3 cursor-pointer p-3 border-2 border-light-taupe rounded-lg hover:border-soft-gold transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                    className="w-4 h-4 text-soft-gold"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💵</span>
                    <div>
                      <div className="text-charcoal-brown font-medium">
                        {orderType === 'delivery' ? 'Cash on Delivery' : 'Cash on Pickup'}
                      </div>
                      <div className="text-brown-light text-sm">
                        {orderType === 'delivery' ? 'Pay when your order arrives' : 'Pay when you collect your order'}
                      </div>
                    </div>
                  </div>
                </label>

                {/* UPI Payment */}
                <label className="flex items-center space-x-3 cursor-pointer p-3 border-2 border-light-taupe rounded-lg hover:border-soft-gold transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                    className="w-4 h-4 text-soft-gold"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <div className="text-charcoal-brown font-medium">UPI Payment</div>
                      <div className="text-brown-light text-sm">Pay instantly using UPI apps</div>
                    </div>
                  </div>
                </label>

                {paymentMethod === 'upi' && (
                  <div className="ml-7 space-y-3 p-4 bg-cream-dark rounded-lg border-2 border-soft-gold">
                    <input
                      type="text"
                      placeholder="Enter your UPI ID for order confirmation (e.g., yourname@paytm)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white border-2 border-light-taupe rounded-lg px-4 py-3 text-charcoal-brown placeholder-brown-light focus:outline-none focus:border-soft-gold"
                    />
                    <div className="text-brown-light text-sm">
                      💡 After placing order, you&apos;ll be redirected to your UPI app to complete payment
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-brown-light text-xs">Supported apps:</span>
                      <span className="text-vibrant-coral text-xs font-medium">Google Pay • PhonePe • Paytm • BHIM • WhatsApp</span>
                    </div>
                  </div>
                )}

                {/* Online Payment with Razorpay */}
                <label className="flex items-center space-x-3 cursor-pointer p-3 border-2 border-light-taupe rounded-lg hover:border-soft-gold transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'online')}
                    className="w-4 h-4 text-soft-gold"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <div className="text-charcoal-brown font-medium">Online Payment</div>
                      <div className="text-brown-light text-sm">Pay securely with Card/UPI/Wallet via Razorpay</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 shadow-lg">
                <p className="text-red-800 text-center font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
