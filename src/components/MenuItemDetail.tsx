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
    const basePrice = getSelectedSizePrice()
    const addOnPrice = getAddOnPrice()
    return (basePrice + addOnPrice) * quantity
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
          <h2 className="text-xl font-bold text-gray-800">Customize:</h2>
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
          {/* Customization Options */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="space-y-3">
              {item.addOns.map((addOn) => (
                <label key={addOn.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                    className="w-5 h-5 text-orange-500 rounded border-2 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="flex-1 text-gray-800 font-medium">{addOn.name} +₹{addOn.price}</span>
                </label>
              ))}
            </div>
          )}

          {/* Size Selection */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="space-y-3">
              {item.sizes.map((size) => (
                <label key={size.size} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    value={size.size}
                    checked={selectedSize === size.size}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-5 h-5 text-orange-500 border-2 border-gray-300 focus:ring-orange-500"
                  />
                  <span className="flex-1 text-gray-800 font-medium">{size.size} +₹{size.price - item.price}</span>
                </label>
              ))}
            </div>
          )}

          {/* Price Display */}
          <div className="py-4">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-3xl font-bold text-orange-500">₹{getTotalPrice()}</span>
              <span className="text-gray-500 text-lg">/{selectedSize || '½kg'}</span>
            </div>
            
            {getOriginalPrice() && (
              <div className="flex items-center space-x-3">
                <span className="text-lg text-gray-400 line-through">₹{getOriginalPrice()}</span>
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm font-medium">
                  {selectedSize || '1kg'} • Save ₹{getSavings()}
                </span>
              </div>
            )}
          </div>

          {/* Bestseller and Time */}
          <div className="flex items-center space-x-4 py-2">
            {item.bestseller && (
              <div className="flex items-center space-x-1">
                <span className="text-orange-500">🔥</span>
                <span className="text-gray-700 text-sm font-medium">Bestseller</span>
              </div>
            )}
            {item.preparationTime && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
                <span className="text-gray-600 text-sm">{item.preparationTime}</span>
              </div>
            )}
          </div>

          {/* Show Details Button */}
          <button className="w-full py-3 flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9,12l2,2 4-4"></path>
            </svg>
            <span className="font-medium">Show Details</span>
          </button>
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
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
