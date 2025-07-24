'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/context/AuthContext'
import { getMenuItemEmojis } from '@/lib/menuEmojis'
import Cart from '@/components/Cart'

// Menu data based on the SONNAS menu image provided
const menuItems = [
  // Small Bites
  {
    id: 1,
    name: 'Korean Bun',
    description: 'Traditional Korean-style steamed bun',
    price: 120,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.5,
    ingredients: ['Korean flour', 'Yeast', 'Sesame'],
    allergens: ['Gluten', 'Sesame'],
    preparationTime: 15,
    isSpicy: 0,
    isSweet: 1
  },
  {
    id: 2,
    name: 'Chilli Korean Bun',
    description: 'Spicy Korean-style steamed bun with chili',
    price: 140,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.6,
    ingredients: ['Korean flour', 'Chili', 'Spices'],
    allergens: ['Gluten'],
    preparationTime: 15,
    isSpicy: 2,
    isSweet: 0
  },
  {
    id: 3,
    name: 'Potato Wedges',
    description: 'Crispy seasoned potato wedges',
    price: 80,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.3,
    ingredients: ['Potatoes', 'Herbs', 'Salt'],
    allergens: [],
    preparationTime: 12,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 4,
    name: 'Chilli Garlic Wedges',
    description: 'Spicy potato wedges with chili and garlic',
    price: 100,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.4,
    ingredients: ['Potatoes', 'Chili', 'Garlic'],
    allergens: [],
    preparationTime: 12,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 5,
    name: 'Cauliflower Florets',
    description: 'Crispy battered cauliflower florets',
    price: 180,
    image: 'https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.2,
    ingredients: ['Cauliflower', 'Batter', 'Spices'],
    allergens: ['Gluten'],
    preparationTime: 15,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 6,
    name: 'Sliders',
    description: 'Mini burgers perfect for sharing',
    price: 150,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.7,
    ingredients: ['Mini bun', 'Beef patty', 'Cheese'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 10,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 7,
    name: 'Sliders Appetizers',
    description: 'Mini burgers (2 sliders)',
    price: 220,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.7,
    ingredients: ['Mini bun', 'Beef patty', 'Cheese'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 10,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 8,
    name: 'Paneer Appetizers',
    description: 'Spiced paneer bites',
    price: 200,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.6,
    ingredients: ['Paneer', 'Spices', 'Herbs'],
    allergens: ['Dairy'],
    preparationTime: 15,
    isSpicy: 1,
    isSweet: 0
  },

  // Pizza
  {
    id: 9,
    name: 'Margherita Pizza',
    description: 'Hand Folio Thin Crust pizza with tomato and mozzarella',
    price: 250,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.5,
    ingredients: ['Thin crust', 'Tomato sauce', 'Mozzarella'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 15,
    isSpicy: 0,
    isSweet: 1
  },
  {
    id: 10,
    name: 'Mexican Pizza',
    description: 'Loaded with vegetables on thin crust',
    price: 320,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.4,
    ingredients: ['Thin crust', 'Mixed vegetables', 'Cheese'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 18,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 11,
    name: 'Fantasy Pizza',
    description: 'Onions, Bell peppers, Paneer, Coriander, and Oregano',
    price: 350,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.6,
    ingredients: ['Onions', 'Bell peppers', 'Paneer', 'Coriander', 'Oregano'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 20,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 12,
    name: 'Cleilia Pizza',
    description: 'Mushroom, Pickled Onion, Chilli Garlic Oil, Basil',
    price: 350,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.7,
    ingredients: ['Mushroom', 'Pickled Onion', 'Chilli Garlic Oil', 'Basil'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 20,
    isSpicy: 2,
    isSweet: 0
  },
  {
    id: 13,
    name: 'Neapolitan Pizza',
    description: 'Onions, Bell peppers, Black Olives, Jalepeno, Chilli Garlic Oil',
    price: 350,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.5,
    ingredients: ['Onions', 'Bell peppers', 'Black Olives', 'Jalepeno', 'Chilli Garlic Oil'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 20,
    isSpicy: 2,
    isSweet: 0
  },
  {
    id: 14,
    name: 'Rustic Pizza',
    description: 'Onions, Garlic Oil, Spinach, Oregano',
    price: 320,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.3,
    ingredients: ['Onions', 'Garlic Oil', 'Spinach', 'Oregano'],
    allergens: ['Gluten', 'Dairy'],
    preparationTime: 18,
    isSpicy: 1,
    isSweet: 0
  },

  // House Specials
  {
    id: 15,
    name: 'Amritsari Chole with House Baked Kulche',
    description: 'Homemade Punjabi style Chhole filled with love',
    price: 280,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.8,
    ingredients: ['Chickpeas', 'Kulcha bread', 'Punjabi spices'],
    allergens: ['Gluten'],
    preparationTime: 25,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 16,
    name: 'Khao Suey',
    description: 'Coconut based Curry filled with noodles and loads of condiments',
    price: 320,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.7,
    ingredients: ['Coconut curry', 'Noodles', 'Various condiments'],
    allergens: ['Gluten'],
    preparationTime: 20,
    isSpicy: 1,
    isSweet: 0
  },
  {
    id: 17,
    name: 'Paneer Tikka/Butter Masala with Rice or Kulcha',
    description: 'Creamy Paneer Tikka (spicy) or Butter (sweet) Masala served with Rice or Kulcha (your choice)',
    price: 380,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.9,
    ingredients: ['Paneer', 'Tomato gravy', 'Rice/Kulcha'],
    allergens: ['Dairy', 'Gluten'],
    preparationTime: 25,
    isSpicy: 2,
    isSweet: 0
  },
  {
    id: 18,
    name: 'Dal Makhni with Rice or Kulcha',
    description: 'Creamy homemade Kali Dal served with Rice or Kulcha (your choice)',
    price: 350,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.8,
    ingredients: ['Black lentils', 'Cream', 'Rice/Kulcha'],
    allergens: ['Dairy', 'Gluten'],
    preparationTime: 30,
    isSpicy: 0,
    isSweet: 1
  },
  {
    id: 19,
    name: 'Paneer Tikka',
    description: 'Grilled spiced paneer cubes',
    price: 320,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.7,
    ingredients: ['Paneer', 'Spices', 'Yogurt marinade'],
    allergens: ['Dairy'],
    preparationTime: 20,
    isSpicy: 2,
    isSweet: 0
  },

  // Drinks
  {
    id: 20,
    name: 'Iced Teas',
    description: 'Refreshing iced tea varieties',
    price: 80,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.4,
    ingredients: ['Tea', 'Ice', 'Natural flavors'],
    allergens: [],
    preparationTime: 3,
    isSpicy: 0,
    isSweet: 1
  },
  {
    id: 21,
    name: 'Peach/Lemon/Blueberry',
    description: 'Fruit flavored refreshing drinks',
    price: 90,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.5,
    ingredients: ['Fruit juice', 'Water', 'Natural flavors'],
    allergens: [],
    preparationTime: 2,
    isSpicy: 0,
    isSweet: 2
  },
  {
    id: 22,
    name: 'Cucumber Lemonade',
    description: 'Fresh cucumber and lemon drink',
    price: 110,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.6,
    ingredients: ['Cucumber', 'Lemon', 'Mint'],
    allergens: [],
    preparationTime: 5,
    isSpicy: 0,
    isSweet: 1
  },
  {
    id: 23,
    name: 'Mojito',
    description: 'Classic mint and lime refresher',
    price: 120,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.7,
    ingredients: ['Mint', 'Lime', 'Soda water'],
    allergens: [],
    preparationTime: 4,
    isSpicy: 0,
    isSweet: 1
  },
  {
    id: 24,
    name: 'Cold Coffee',
    description: 'Refreshing iced coffee',
    price: 100,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.5,
    ingredients: ['Coffee', 'Ice', 'Milk'],
    allergens: ['Dairy'],
    preparationTime: 3,
    isSpicy: 0,
    isSweet: 1
  },
  {
    id: 25,
    name: 'Milkshakes',
    description: 'KitKat/Vanilla/Strawberry/Chocolate varieties',
    price: 150,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.8,
    ingredients: ['Milk', 'Ice cream', 'Flavoring'],
    allergens: ['Dairy', 'Gluten'],
    preparationTime: 5,
    isSpicy: 0,
    isSweet: 2
  }
]

const categories = ['All', 'Small Bites', 'Pizza', 'House Specials', 'Drinks']

function MenuContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'All')
  const { items, isOpen, total, addToCart, removeFromCart, updateQuantity, clearCart, toggleFullScreenCart } = useCart()
  const { isAuthenticated, user } = useAuth()

  // Update selected category when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-400">
      {/* Header */}
      <div className="bg-primary-600 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <nav className="flex items-center space-x-4 text-brown-200 mb-6">
            <Link href="/" className="hover:text-amber-300">Home</Link>
            <span>/</span>
            <span className="text-amber-300">Menu</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Our Menu
          </h1>
          <p className="text-xl text-brown-200">
            Discover our carefully crafted dishes made with the finest ingredients
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-brown-700 text-brown-200 hover:bg-brown-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-primary-500 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary-400"
            >
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-accent-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {item.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-display font-semibold text-white">
                      {item.name}
                    </h3>
                    {getMenuItemEmojis(item.isSpicy, item.isSweet) && (
                      <div className="text-lg mt-1">
                        {getMenuItemEmojis(item.isSpicy, item.isSweet)}
                      </div>
                    )}
                  </div>
                  <span className="text-amber-300 font-bold text-lg">
                    Rs {item.price}
                  </span>
                </div>
                
                <p className="text-brown-200 mb-4 text-sm">
                  {item.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.ingredients.map((ingredient, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-primary-400 text-white px-2 py-1 rounded"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {item.allergens.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-amber-300 font-medium mb-2">Allergens:</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.allergens.map((allergen, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-accent-500 text-white px-2 py-1 rounded"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="text-brown-400 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.preparationTime} min
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image
                      })
                    }}
                    className="flex-1 bg-primary-400 hover:bg-primary-300 text-white px-3 py-2 rounded-lg transition-all duration-200 font-medium border border-primary-300 hover:border-primary-200 hover:scale-105 text-sm"
                  >
                    🛒 Add to Cart
                  </button>
                  
                  <button 
                    onClick={() => {
                      // Create a temporary cart with just this item
                      const singleItem = {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        quantity: 1
                      }
                      // Store single item in sessionStorage for direct checkout
                      sessionStorage.setItem('buyNowItem', JSON.stringify(singleItem))
                      // Navigate to checkout immediately
                      window.location.href = '/checkout?buyNow=true'
                    }}
                    className="flex-1 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white px-3 py-2 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-accent-400/25 hover:scale-105 text-sm relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      ⚡ Buy Now
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Cart Button */}
        {items.length > 0 && (
          <div className="fixed bottom-4 right-4 z-40">
            <button
              onClick={toggleFullScreenCart}
              className="bg-accent-400 hover:bg-accent-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105"
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-2l2 10m0 0h12m-8 4a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.reduce((sum: number, item: any) => sum + item.quantity, 0)}
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Cart Sidebar */}
        <Cart />
      </div>
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading menu...</div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  )
}
