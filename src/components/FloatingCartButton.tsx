'use client'

import { usePathname } from 'next/navigation'
import { useCart } from './CartProvider'
import { useAuth } from '@/context/AuthContext'

export default function FloatingCartButton() {
  const pathname = usePathname()
  const { toggleCart, items, isOpen } = useCart()
  const { isAuthenticated } = useAuth()
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Don't show if not authenticated, no items, on checkout page, or cart is already open
  if (!isAuthenticated || items.length === 0 || pathname === '/checkout' || isOpen) {
    return null
  }

  return (
    <button
      onClick={toggleCart}
      className="hidden lg:flex fixed bottom-24 right-6 z-50 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white p-4 rounded-full shadow-2xl hover:shadow-accent-400/25 transition-all duration-300 hover:scale-110 group"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8l-2.9-7M7 13L5.1 5M7 13l-2.6 0M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.5 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </div>
        <div className="hidden sm:block">
          <div className="text-sm font-medium">Cart</div>
          <div className="text-xs opacity-90">₹{total.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Pulse animation for attention */}
      <div className="absolute inset-0 rounded-full bg-accent-400 opacity-75 animate-ping"></div>
    </button>
  )
}
