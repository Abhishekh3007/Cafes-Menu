'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/context/AuthContext'
import Cart from '@/components/Cart'
import MenuItemDetail from '@/components/MenuItemDetail'
import { enhancedMenuItems } from '@/lib/enhancedMenuData'

const categories = ['All', 'Small Bites', 'Pizza', 'House Specials', 'Drinks', 'Desserts']

function MenuContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const filteredItems = selectedCategory === 'All' 
    ? enhancedMenuItems 
    : enhancedMenuItems.filter(item => item.category === selectedCategory)

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

  const handleAddToCart = (item: any) => {
    addToCart(item)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-cream-dark to-light-taupe">
      {/* Header */}
      <div className="bg-charcoal-brown text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-display font-bold mb-2">SONNAS Menu</h1>
          <p className="text-brown-200">Discover our delicious offerings</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 bg-light-taupe/95 backdrop-blur-sm border-b border-taupe-dark py-4 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-vibrant-coral text-white shadow-md'
                    : 'bg-warm-cream text-charcoal-brown hover:bg-taupe-dark hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-warm-cream rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-taupe-dark border-opacity-20"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                {item.bestseller && (
                  <div className="absolute top-3 left-3 bg-vibrant-coral text-white px-2 py-1 rounded-full text-xs font-semibold">
                    🔥 Bestseller
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                  ⭐ {item.rating}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-charcoal-brown mb-2">{item.name}</h3>
                <p className="text-brown-medium text-sm mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-soft-gold">₹{item.price}</span>
                    {item.sizes && item.sizes[0]?.originalPrice && (
                      <span className="text-brown-light line-through text-sm">₹{item.sizes[0].originalPrice}</span>
                    )}
                  </div>
                  {item.preparationTime && (
                    <span className="text-brown-light text-xs">🕒 {item.preparationTime}</span>
                  )}
                </div>

                {/* Spice/Sweet Level Indicators */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {item.spiceLevel && item.spiceLevel > 0 && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-red-600">🌶️</span>
                        <span className="text-xs text-red-600">{item.spiceLevel}/5</span>
                      </div>
                    )}
                    {item.sweetnessLevel && item.sweetnessLevel > 0 && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-pink-600">🧁</span>
                        <span className="text-xs text-pink-600">{item.sweetnessLevel}/5</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-soft-gold hover:bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 text-sm sm:text-base"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 sm:flex-none px-4 py-3 border-2 border-vibrant-coral text-vibrant-coral hover:bg-vibrant-coral hover:text-white rounded-lg transition-all duration-200 font-semibold hover:scale-105 text-sm sm:text-base"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Cart />
      
      {selectedItem && (
        <MenuItemDetail 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-warm-cream via-cream-dark to-light-taupe flex items-center justify-center">
        <div className="text-charcoal-brown text-xl">Loading menu...</div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  )
}