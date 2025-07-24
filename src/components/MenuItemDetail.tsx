'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { MenuItem, AddOn } from '@/lib/enhancedMenuData'

interface MenuItemDetailProps {
  item: MenuItem
  onClose: () => void
}

export default function MenuItemDetail({ item, onClose }: MenuItemDetailProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [selectedSize, setSelectedSize] = useState(item.sizes?.[0]?.size || '')
  const [customMessage, setCustomMessage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const router = useRouter()

  const getSelectedSizePrice = () => {
    if (!item.sizes) return item.price
    const size = item.sizes.find(s => s.size === selectedSize)
    return size ? size.price : item.price
  }

  const getAddOnPrice = () => {
    return selectedAddOns.reduce((total, addOnId) => {
      const addOn = item.addOns.find(a => a.id === addOnId)
      return total + (addOn ? addOn.price : 0)
    }, 0)
  }

  const getTotalPrice = () => {
    return (getSelectedSizePrice() + getAddOnPrice()) * quantity
  }

  const getOriginalPrice = () => {
    if (!item.sizes) return null
    const size = item.sizes.find(s => s.size === selectedSize)
    if (size?.originalPrice) {
      return (size.originalPrice + getAddOnPrice()) * quantity
    }
    return null
  }

  const getSavings = () => {
    const original = getOriginalPrice()
    if (original) {
      return original - getTotalPrice()
    }
    return 0
  }

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    )
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: getTotalPrice(),
      image: item.image,
      quantity: quantity,
      customizations: {
        size: selectedSize,
        addOns: selectedAddOns.map(id => {
          const addOn = item.addOns.find(a => a.id === id)
          return addOn ? { id, name: addOn.name, price: addOn.price } : null
        }).filter(Boolean),
        customMessage: customMessage
      }
    }
    
    addToCart(cartItem)
    onClose()
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md h-[85vh] flex flex-col rounded-t-3xl">
        {/* Header */}
        <div className="flex-shrink-0 bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">Customize</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Item Image & Basic Info */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">{item.name}</h1>
            <p className="text-gray-600 mb-3">{item.description}</p>
            
            <div className="flex items-center justify-center space-x-4 mb-4">
              {item.bestseller && (
                <span className="flex items-center text-orange-500 text-sm font-semibold">
                  🔥 Bestseller
                </span>
              )}
              {item.preparationTime && (
                <span className="flex items-center text-gray-500 text-sm">
                  🕒 {item.preparationTime}
                </span>
              )}
            </div>

            {/* Spice and Sweetness Indicators */}
            {(item.spiceLevel || item.sweetnessLevel) && (
              <div className="flex items-center justify-center space-x-4 mb-4">
                {item.spiceLevel && item.spiceLevel > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-red-600 font-medium">Spice:</span>
                    <span className="text-sm">
                      {'🌶️'.repeat(Math.min(item.spiceLevel, 5))}
                    </span>
                  </div>
                )}
                {item.sweetnessLevel && item.sweetnessLevel > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-pink-600 font-medium">Sweet:</span>
                    <span className="text-sm">
                      {'🧁'.repeat(Math.min(item.sweetnessLevel, 5))}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Size Selection */}
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Choose Size</h3>
              <div className="space-y-2">
                {item.sizes.map((size) => (
                  <label key={size.size} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="size"
                        value={size.size}
                        checked={selectedSize === size.size}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="text-orange-500"
                      />
                      <span className="font-medium text-black">{size.size}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-orange-500 font-bold">₹{size.price}</span>
                      {size.originalPrice && (
                        <div className="text-sm">
                          <span className="text-gray-400 line-through">₹{size.originalPrice}</span>
                          <span className="text-orange-100 bg-orange-500 px-2 py-1 rounded-full text-xs ml-2">
                            Save ₹{size.originalPrice - size.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons */}
          {item.addOns && item.addOns.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">Customize</h3>
              <div className="space-y-2">
                {item.addOns.map((addOn) => (
                  <label key={addOn.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(addOn.id)}
                        onChange={() => toggleAddOn(addOn.id)}
                        className="text-orange-500 rounded"
                      />
                      <span className="text-black">{addOn.name}</span>
                    </div>
                    <span className="text-orange-500 font-semibold">+₹{addOn.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Custom Message */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-3">Special Instructions</h3>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Any special requests or instructions..."
              className="w-full p-3 border border-gray-200 rounded-xl resize-none"
              rows={3}
            />
          </div>

          {/* Quantity & Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between text-2xl font-bold">
                <span className="text-orange-500">₹{getTotalPrice()}</span>
                <span className="text-gray-600">/{selectedSize || 'each'}</span>
              </div>
              {getOriginalPrice() && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-400 line-through">₹{getOriginalPrice()}</span>
                  <span className="text-orange-600 font-semibold">Save ₹{getSavings()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Buttons */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-white border-2 border-orange-500 text-orange-500 py-3 px-6 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
            >
              <span>+</span>
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
