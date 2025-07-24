'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/context/AuthContext'
import Cart from '@/components/Cart'
import MenuItemDetail from '@/components/MenuItemDetail'

// Complete Menu data from SONNAS menu
const menuItems = [
  // Small Bites
  {
    id: 1,
    name: 'Korean Bun',
    description: 'Traditional Korean-style steamed bun',
    price: 160,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Chilli Korean Bun',
    description: 'Spicy Korean-style steamed bun with chili',
    price: 170,
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Potato Wedges',
    description: 'Crispy golden potato wedges',
    price: 120,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.3,
  },
  {
    id: 4,
    name: 'Chilli Garlic Wedges',
    description: 'Spicy potato wedges with chili and garlic',
    price: 150,
    image: 'https://images.unsplash.com/photo-1608767221051-2b9c18319fbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.4,
  },
  {
    id: 5,
    name: 'Cauliflower Florets',
    description: 'Crispy fried cauliflower florets',
    price: 260,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f932a4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.7,
  },
  {
    id: 6,
    name: 'Sliders',
    description: 'Mini burgers perfect for sharing',
    price: 185,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.8,
  },
  {
    id: 7,
    name: 'Sliders Appetizers',
    description: 'Mini Burgers (2 sliders)',
    price: 260,
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.9,
  },
  {
    id: 8,
    name: 'Paneer Appetizers',
    description: 'Delicious paneer appetizers',
    price: 260,
    image: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.6,
  },

  // Pizza - Hand Rolled Thin Crust
  {
    id: 9,
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella and basil',
    price: 230,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.8,
  },
  {
    id: 10,
    name: 'Mexican Pizza',
    description: 'Loaded Vegetables pizza with Mexican flavors',
    price: 270,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.7,
  },
  {
    id: 11,
    name: 'Fantasy Pizza',
    description: 'Onions, Bellpeppers, Paneer, Coriander, and Oregano',
    price: 270,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.6,
  },
  {
    id: 12,
    name: 'Cleilia Pizza',
    description: 'Mushroom, Pickled Onion, Chilli Garlic Oil, Basil',
    price: 290,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.8,
  },
  {
    id: 13,
    name: 'Neapolitan Pizza',
    description: 'Onions, Bellpeppers, Black Olives, Jalepeno, Chilli Garlic Oil',
    price: 290,
    image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.9,
  },
  {
    id: 14,
    name: 'Rustic Pizza',
    description: 'Onions, Garlic Oil, Spinach, Oregano',
    price: 290,
    image: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.7,
  },

  // House Specials
  {
    id: 15,
    name: 'Amritsari Chole with House Baked Kulche',
    description: 'Homemade Punjabi style Chhole filled with love',
    price: 240,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.9,
  },
  {
    id: 16,
    name: 'Khao Suey',
    description: 'Coconut based Curry filled with noodles and loads of condiments',
    price: 280,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.8,
  },
  {
    id: 17,
    name: 'Paneer Tikka/Butter Masala with Rice or Kulcha',
    description: 'Creamy Paneer Tikay (spicy) or Butter (sweet) Masala served with Rice or Kulcha (your choice)',
    price: 295,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.9,
  },
  {
    id: 18,
    name: 'Dal Makhni with Rice or Kulcha',
    description: 'Creamy homemade Kail Dal served with Rice or Kulcha (your choice)',
    price: 295,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.8,
  },
  {
    id: 19,
    name: 'Paneer Tikka',
    description: 'Grilled paneer with aromatic spices',
    price: 290,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.7,
  },
  {
    id: 20,
    name: 'Customise Your Own Pizza',
    description: 'Create your perfect pizza with your choice of toppings',
    price: 0, // Variable pricing
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.8,
  },

  // Drinks
  {
    id: 21,
    name: 'Iced Teas',
    description: 'Refreshing iced tea',
    price: 120,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.4,
  },
  {
    id: 22,
    name: 'Peach/Lemon/Blueberry',
    description: 'Flavored refreshing drinks',
    price: 130,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.5,
  },
  {
    id: 23,
    name: 'Cucumber Lemonade',
    description: 'Fresh cucumber and lemon drink',
    price: 140,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.6,
  },
  {
    id: 24,
    name: 'Mojito',
    description: 'Classic refreshing mojito',
    price: 140,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.7,
  },
  {
    id: 25,
    name: 'Cold Coffee',
    description: 'Chilled coffee drink',
    price: 120,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.5,
  },
  {
    id: 26,
    name: 'Milkshakes',
    description: 'KitKat/Vanilla/Strawberry/Chocolate flavored milkshakes',
    price: 160,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.8,
  }
]

const categories = ['All', 'Small Bites', 'Pizza', 'House Specials', 'Drinks']

function MenuContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All')
  const [selectedItem, setSelectedItem] = useState<any>(null)
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
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-3 py-2 border-2 border-vibrant-coral text-vibrant-coral hover:bg-vibrant-coral hover:text-white rounded-lg transition-all duration-200 font-semibold hover:scale-105 text-sm"
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
