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
  const { toggleCart, items } = useCart()

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

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
    if (isAuthenticated && isLoaded && isSignedIn) {
      // Navigate to profile page using Next.js router
      router.push('/profile')
    } else {
      // Navigate to login page or trigger sign-in modal
      router.push('/sign-in')
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brown-800 border-t border-brown-600 shadow-2xl">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <div key={item.name} className="relative">
              {item.isCart ? (
                <button
                  onClick={toggleCart}
                  className={`w-full h-full flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? 'text-amber-300 bg-brown-700' 
                      : 'text-brown-200 hover:text-amber-300 hover:bg-brown-700'
                  }`}
                >
                  <div className="relative">
                    <span className="text-lg">{item.icon}</span>
                    {item.count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
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
                      ? 'text-amber-300 bg-brown-700' 
                      : 'text-brown-200 hover:text-amber-300 hover:bg-brown-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium mt-1">{item.name}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`w-full h-full flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? 'text-amber-300 bg-brown-700' 
                      : 'text-brown-200 hover:text-amber-300 hover:bg-brown-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium mt-1">{item.name}</span>
                </Link>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-b-full"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
