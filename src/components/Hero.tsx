'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCart } from './CartProvider'

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const { toggleCart, items } = useCart()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 hero-pattern">
      {/* Elegant overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      {/* Navigation */}
      <nav className="relative z-50 px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-display font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200">
                SONNAS
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-amber-300 transition-colors">
              Home
            </Link>
            <Link href="/menu" className="text-white hover:text-amber-300 transition-colors">
              Menu
            </Link>
            <Link href="/about" className="text-white hover:text-amber-300 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-amber-300 transition-colors font-medium">
              📞 Contact Us
            </Link>
            
            {/* Cart Button - Always visible and prominent */}
            <button 
              onClick={toggleCart} 
              className="relative bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/25"
            >
              <div className="flex items-center space-x-2">
                <span>🛒</span>
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </div>
            </button>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button onClick={logout} className="text-white hover:text-amber-300 transition-colors">
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login">
                    <button className="text-white hover:text-amber-300 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="bg-brown-700 hover:bg-brown-600 text-white px-6 py-2 rounded-lg transition-colors">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-brown-800 border-t border-brown-700 shadow-xl">
            <div className="px-4 py-4 space-y-4">
              <Link href="/" className="block text-white hover:text-amber-300">Home</Link>
              <Link href="/menu" className="block text-white hover:text-amber-300">Menu</Link>
              <Link href="/about" className="block text-white hover:text-amber-300">About</Link>
              <Link href="/contact" className="block text-white hover:text-amber-300 font-medium">📞 Contact Us</Link>
              
              {/* Mobile Cart Button - Prominent */}
              <button 
                onClick={toggleCart} 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-medium"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>🛒</span>
                  <span>Cart</span>
                  {itemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                      {itemCount} items
                    </span>
                  )}
                </div>
              </button>
              
              <div className="border-t border-brown-700 pt-4 space-y-2">
                {isAuthenticated ? (
                  <button onClick={logout} className="w-full text-left text-white hover:text-amber-300">
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href="/login">
                      <button className="w-full text-left text-white hover:text-amber-300">
                        Login
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center bg-amber-100 bg-opacity-10 backdrop-blur-sm border border-amber-300 border-opacity-20 rounded-full px-6 py-2 mb-8">
            <span className="text-amber-300 text-sm font-medium tracking-wide">PREMIUM DINING EXPERIENCE</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-6 leading-tight">
            Welcome to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              SONNAS
            </span>
          </h1>

          {/* Elegant Description */}
          <p className="text-lg md:text-2xl text-brown-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Where culinary artistry meets exceptional service. Experience the finest flavors 
            crafted with passion and served with elegance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/menu">
              <button className="group relative overflow-hidden bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-lg font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 hover:scale-105 min-w-[200px]">
                <span className="relative z-10">Explore Menu</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </Link>
            <Link href="/contact">
              <button className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-2xl hover:shadow-green-500/25 hover:scale-105 min-w-[200px]">
                📞 Contact Us
              </button>
            </Link>
            <Link href="/reserve">
              <button className="group border-2 border-white text-white hover:bg-white hover:text-brown-900 text-lg font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-2xl hover:shadow-white/25 hover:scale-105 min-w-[200px]">
                Reserve Table
              </button>
            </Link>
          </div>

          {/* Elegant Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-amber-300 mb-2">4.9★</div>
              <div className="text-brown-200 text-sm font-medium">Customer Rating</div>
            </div>
            <div className="text-center border-l border-r border-brown-600 border-opacity-30">
              <div className="text-3xl font-display font-bold text-amber-300 mb-2">50+</div>
              <div className="text-brown-200 text-sm font-medium">Signature Dishes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-amber-300 mb-2">24/7</div>
              <div className="text-brown-200 text-sm font-medium">Online Ordering</div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-brown-300 text-sm mb-2 opacity-75">Scroll to explore</div>
        <div className="w-px h-8 bg-gradient-to-b from-brown-300 to-transparent mx-auto"></div>
      </div>
    </div>
  )
}
