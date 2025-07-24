'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/context/AuthContext'
import Cart from '@/components/Cart'

// Menu data - simplified version
const menuItems = [
  {
    id: 1,
    name: 'Korean Bun',
    description: 'Traditional Korean-style steamed bun',
    price: 120,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella and basil',
    price: 280,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.8,
  }
]

const categories = ['All', 'Small Bites', 'Pizza', 'House Specials', 'Drinks']

function MenuContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All')
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream via-cream-dark to-light-taupe">
      {/* Header */}
      <div className="bg-light-taupe py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex items-center space-x-4 text-brown-light mb-6">
            <Link href="/" className="hover:text-soft-gold">Home</Link>
            <span>›</span>
            <span className="text-soft-gold">Menu</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal-brown mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-brown-light">
            Discover our carefully curated selection of premium dishes
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-vibrant-coral text-white shadow-lg'
                  : 'bg-cream-dark text-charcoal-brown hover:bg-light-taupe'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-cream-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-light-taupe"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-vibrant-coral text-white px-3 py-1 rounded-full text-sm font-medium">
                  {item.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-display font-semibold text-charcoal-brown">
                    {item.name}
                  </h3>
                  <span className="text-soft-gold font-bold text-lg">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>
                
                <p className="text-brown-light mb-4 text-sm">
                  {item.description}
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-gradient-to-r from-vibrant-coral to-coral-light hover:from-coral-light hover:to-vibrant-coral text-white px-3 py-2 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-vibrant-coral/25 hover:scale-105 text-sm relative overflow-hidden group"
                  >
                    <span className="relative z-10">Add to Cart</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Cart />
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
