'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartProvider'

export default function FullScreenCart() {
  const pathname = usePathname()
  const { 
    items, 
    isFullScreenOpen, 
    total, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    closeFullScreenCart 
  } = useCart()

  // Don't show on checkout page or when not open
  if (!isFullScreenOpen || pathname === '/checkout') return null

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-400">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary-600 border-b border-primary-500">
        <div className="flex items-center space-x-3">
          <button
            onClick={closeFullScreenCart}
            className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-400 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-display font-bold text-white">Your Cart</h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-accent-400 hover:text-accent-500 text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col h-full">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="text-center">
              <svg className="w-24 h-24 mx-auto text-primary-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-2l2 10m0 0h12m-8 4a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-2">Your cart is empty</h2>
              <p className="text-neutral-600 mb-8 max-w-sm">
                Looks like you haven&apos;t added any delicious items to your cart yet. 
                Start exploring our menu!
              </p>
              <Link href="/menu" onClick={closeFullScreenCart}>
                <button className="bg-accent-400 hover:bg-accent-500 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg">
                  Browse Menu
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-primary-300">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-800 text-lg truncate">{item.name}</h3>
                      <p className="text-accent-500 font-bold text-xl">₹{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 bg-primary-100 rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-full bg-primary-400 text-white flex items-center justify-center hover:bg-primary-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-neutral-800 font-semibold text-lg w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-full bg-primary-400 text-white flex items-center justify-center hover:bg-primary-300 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-accent-500 hover:text-accent-600 p-2"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer - Checkout Section */}
            <div className="flex-shrink-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-primary-300 p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-semibold text-neutral-800">Total:</span>
                <span className="text-2xl font-bold text-accent-500">₹{total.toFixed(2)}</span>
              </div>
              
              <Link href="/checkout" onClick={closeFullScreenCart}>
                <button className="w-full bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-accent-400/25">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
