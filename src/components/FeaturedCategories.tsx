'use client'

import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 1,
    name: 'Small Bites',
    description: 'Quick appetizers & snacks',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    itemCount: 8
  },
  {
    id: 2,
    name: 'Pizza',
    description: 'Hand Folio Thin Crust',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    itemCount: 6
  },
  {
    id: 3,
    name: 'House Specials',
    description: 'Our signature dishes',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    itemCount: 5
  },
  {
    id: 4,
    name: 'Drinks',
    description: 'Refreshing beverages',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    itemCount: 6
  }
]

export default function FeaturedCategories() {
  return (
    <section className="py-20 px-4 lg:px-8 bg-brown-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Our Menu Categories
          </h2>
          <p className="text-xl text-brown-200 max-w-2xl mx-auto">
            Discover our carefully curated selection of dishes, each category offering unique flavors and experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/menu?category=${encodeURIComponent(category.name)}`}
              className="group cursor-pointer bg-brown-700 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-display font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-brown-200 mb-3">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-medium">
                    {category.itemCount} items
                  </span>
                  <button className="text-amber-300 hover:text-amber-400 font-medium flex items-center">
                    Explore
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
