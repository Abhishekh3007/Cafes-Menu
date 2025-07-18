'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from './CartProvider'

export default function Cart() {
  const { 
    isOpen, 
    items, 
    total, 
    toggleCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleCart}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-brown-800 shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-brown-700">
            <h2 className="text-lg font-display font-bold text-white">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="text-brown-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-10">
                <svg className="w-12 h-12 mx-auto text-brown-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-2l2 10m0 0h12m-8 4a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <p className="text-brown-300">Your cart is empty</p>
                <p className="text-brown-400 text-sm mt-1">Add some delicious items to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-brown-700 rounded-lg p-3">
                    <div className="relative w-14 h-14 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{item.name}</h3>
                      <p className="text-amber-300 font-semibold">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-brown-600 text-white flex items-center justify-center hover:bg-brown-500"
                      >
                        -
                      </button>
                      <span className="text-white font-medium w-7 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-brown-600 text-white flex items-center justify-center hover:bg-brown-500"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-brown-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">Total:</span>
                <span className="text-amber-300 font-bold text-lg">${total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Link href="/checkout">
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg font-semibold transition-colors">
                    Proceed to Checkout
                  </button>
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
