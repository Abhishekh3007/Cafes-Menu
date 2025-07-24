'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartProvider'
import { useAuth } from '@/context/AuthContext'

const popularItems = [
  {
    id: 1,
    name: 'Paneer Tikka/Butter Masala',
    description: 'Creamy Paneer Tikka (spicy) or Butter (sweet) Masala served with Rice or Kulcha',
    price: 295,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 2,
    name: 'Dal Makhni with Rice or Kulcha',
    description: 'Creamy homemade Kail Dal served with Rice or Kulcha',
    price: 295,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 3,
    name: 'Khao Suey',
    description: 'Coconut based Curry filled with noodles and loads of condiments',
    price: 280,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'House Specials',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 4,
    name: 'Neapolitan Pizza',
    description: 'Onions, Bellpeppers, Black Olives, Jalepeno, Chilli Garlic Oil',
    price: 290,
    image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Pizza',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 5,
    name: 'Milkshakes',
    description: 'KitKat/Vanilla/Strawberry/Chocolate flavored milkshakes',
    price: 160,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Drinks',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 6,
    name: 'Sliders Appetizers',
    description: 'Mini burgers (2 sliders) perfect for sharing',
    price: 260,
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    category: 'Small Bites',
    rating: 4.9,
    isPopular: true
  }
]

export default function PopularItems() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 px-4 lg:px-8 bg-brown-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Popular Items
          </h2>
          <p className="text-xl text-brown-200 max-w-2xl mx-auto">
            Our guests&apos; favorite dishes that keep them coming back for more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularItems.map((item) => (
            <div 
              key={item.id}
              className="group bg-brown-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border border-brown-700"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                {item.isPopular && (
                  <div className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Popular
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-sm flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {item.rating}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-display font-semibold text-white">
                    {item.name}
                  </h3>
                  <span className="text-amber-300 font-bold text-lg">
                    ₹{item.price}
                  </span>
                </div>
                <p className="text-brown-200 mb-3 text-sm">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-brown-400 text-sm">
                    {item.category}
                  </span>
                  <button 
                    onClick={() => {
                      if (isAuthenticated) {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image
                        })
                      } else {
                        window.location.href = '/login'
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    {isAuthenticated ? 'Add to Cart' : 'Login to Order'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/menu">
            <button className="bg-transparent border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-lg transition-colors font-semibold text-lg">
              View Full Menu
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
