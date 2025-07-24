'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useCart } from './CartProvider'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import ClerkUserButton from './ClerkUserButton'

export default function Hero() {
  const { isAuthenticated, user } = useAuth()
  const { isSignedIn, isLoaded } = useUser()
  const { toggleCart, toggleFullScreenCart, items, closeCart, closeFullScreenCart } = useCart()

  const handleCloseAllCarts = () => {
    closeCart()
    closeFullScreenCart()
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-warm-cream via-cream-dark to-light-taupe hero-pattern">
      {/* Elegant overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-10"></div>
      {/* Navigation */}
      <nav className="relative z-50 px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-display font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-vibrant-coral via-soft-gold to-vibrant-coral">
                SONNAS
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" onClick={handleCloseAllCarts} className="text-charcoal-brown hover:text-vibrant-coral transition-colors font-semibold">
              Home
            </Link>
            <Link href="/menu" onClick={handleCloseAllCarts} className="text-charcoal-brown hover:text-vibrant-coral transition-colors font-semibold">
              Menu
            </Link>
            <Link href="/about" onClick={handleCloseAllCarts} className="text-charcoal-brown hover:text-vibrant-coral transition-colors font-semibold">
              About
            </Link>
            <Link href="/contact" onClick={handleCloseAllCarts} className="text-charcoal-brown hover:text-vibrant-coral transition-colors font-semibold">
              📞 Contact Us
            </Link>
            
            {/* Cart Button - Always visible and prominent */}
            <button 
              onClick={toggleCart} 
              className="relative bg-vibrant-coral hover:bg-coral-light text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-vibrant-coral/25"
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
              {isAuthenticated && isLoaded && isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-soft-gold font-medium">
                    Hi, {user?.name || 'Guest'}!
                  </span>
                  <ClerkUserButton />
                </div>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button 
                      onClick={handleCloseAllCarts}
                      className="bg-vibrant-coral hover:bg-coral-light text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button 
                      onClick={handleCloseAllCarts}
                      className="bg-soft-gold hover:bg-gold-light text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>

          {/* Mobile Cart Button - Only show cart and login for mobile since bottom nav handles navigation */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Button */}
            <button 
              onClick={toggleFullScreenCart} 
              className="relative bg-vibrant-coral hover:bg-coral-light text-white px-3 py-2 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-1">
                <span>🛒</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </div>
            </button>

            {/* Mobile Auth */}
            {isAuthenticated && isLoaded && isSignedIn ? (
              <ClerkUserButton />
            ) : (
              <SignInButton mode="modal">
                <button 
                  onClick={handleCloseAllCarts}
                  className="bg-vibrant-coral hover:bg-coral-light text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Login
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center bg-light-taupe bg-opacity-20 backdrop-blur-sm border border-vibrant-coral border-opacity-30 rounded-full px-6 py-2 mb-8">
            <span className="text-soft-gold text-sm font-medium tracking-wide">PREMIUM DINING EXPERIENCE</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-8xl font-display font-bold text-charcoal-brown mb-6 leading-tight">
            Welcome to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibrant-coral to-soft-gold">
              SONNAS
            </span>
          </h1>

          {/* Elegant Description */}
          <p className="text-lg md:text-2xl text-brown-light mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Where culinary artistry meets exceptional service. Experience the finest flavors 
            crafted with passion and served with elegance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link href="/menu" onClick={handleCloseAllCarts}>
              <button className="group relative overflow-hidden bg-gradient-to-r from-vibrant-coral to-coral-light hover:from-coral-light hover:to-vibrant-coral text-white text-lg font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-2xl hover:shadow-vibrant-coral/25 hover:scale-105 min-w-[200px]">
                <span className="relative z-10">Order Online</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </Link>
            <Link href="/reserve" onClick={handleCloseAllCarts}>
              <button className="group border-2 border-charcoal-brown text-charcoal-brown hover:bg-charcoal-brown hover:text-warm-cream text-lg font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-2xl hover:shadow-charcoal-brown/25 hover:scale-105 min-w-[200px]">
                Eat With Us
              </button>
            </Link>
          </div>
        </div>
      </div>

  
      
    </div>
  )
}
