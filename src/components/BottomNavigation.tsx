'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from './CartProvider'
import { useUser, SignInButton } from '@clerk/nextjs'
import ClerkUserButton from './ClerkUserButton'

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { isSignedIn, isLoaded } = useUser()
  const { toggleFullScreenCart, items, closeCart, closeFullScreenCart } = useCart()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const handleNavigation = (href: string) => {
    closeCart() // Close sidebar cart when navigating
    closeFullScreenCart() // Close full-screen cart when navigating
    router.push(href)
  }

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: '🏠',
      activeIcon: '🏠'
    },
    {
      name: 'Menu',
      href: '/menu',
      icon: '🍽️',
      activeIcon: '🍽️'
    },
    {
      name: 'Cart',
      href: '#',
      icon: '🛒',
      activeIcon: '🛒',
      isCart: true,
      count: itemCount
    },
    {
      name: 'Reserve',
      href: '/reserve',
      icon: '🎫',
      activeIcon: '🎫'
    },
    {
      name: (isAuthenticated && isLoaded && isSignedIn) ? 'Profile' : 'Login',
      href: (isAuthenticated && isLoaded && isSignedIn) ? '/profile' : '/login',
      icon: (isAuthenticated && isLoaded && isSignedIn) ? '👤' : '🔐',
      activeIcon: (isAuthenticated && isLoaded && isSignedIn) ? '👤' : '🔐',
      isProfile: true
    }
  ]

  const handleProfileClick = () => {
    closeCart() // Close sidebar cart when accessing profile/login
    closeFullScreenCart() // Close full-screen cart when accessing profile/login
    if (isAuthenticated && isLoaded && isSignedIn) {
      // Navigate to profile page using Next.js router
      router.push('/profile')
    } else {
      // Navigate to login page or trigger sign-in modal
      router.push('/login')
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-light-taupe border-t border-taupe-dark shadow-2xl">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <div key={item.name} className="relative">
              {item.isCart ? (
                <button
                  onClick={toggleFullScreenCart}
                  className={`w-full h-full flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? 'text-soft-gold bg-cream-dark' 
                      : 'text-charcoal-brown hover:text-soft-gold hover:bg-cream-dark'
                  }`}
                >
                  <div className="relative">
                    <span className="text-lg">{item.icon}</span>
                    {item.count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-vibrant-coral text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {item.count > 9 ? '9+' : item.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium mt-1">{item.name}</span>
                </button>
              ) : item.isProfile ? (
                <button
                  onClick={handleProfileClick}
                  className={`w-full h-full flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? 'text-soft-gold bg-cream-dark' 
                      : 'text-charcoal-brown hover:text-soft-gold hover:bg-cream-dark'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium mt-1">{item.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full h-full flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? 'text-soft-gold bg-cream-dark' 
                      : 'text-charcoal-brown hover:text-soft-gold hover:bg-cream-dark'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium mt-1">{item.name}</span>
                </button>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-vibrant-coral rounded-b-full"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
