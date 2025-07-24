'use client'

import { useCart } from './CartProvider'
import { useEffect } from 'react'

export default function CartToast() {
  const { showToast, toastMessage, hideToast } = useCart()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (showToast) {
      // Auto-hide after 4 seconds
      timeoutId = setTimeout(() => {
        hideToast()
      }, 4000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [showToast, hideToast])

  if (!showToast) return null

  return (
    <div 
      className="fixed left-4 right-4 z-50 transition-all duration-300 ease-in-out"
      style={{ bottom: '88px' }} // 24px above 64px bottom nav = 88px
    >
      <div className="bg-gradient-to-r from-accent-400 to-accent-500 text-white p-4 rounded-2xl shadow-2xl border border-accent-300 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">{toastMessage}</p>
              <p className="text-xs text-white/80">Tap cart to review your order</p>
            </div>
          </div>
          
          <button
            onClick={hideToast}
            className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss notification"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full animate-progress-bar"
            style={{
              animation: 'progress-bar 4s linear forwards'
            }}
          />
        </div>
      </div>
    </div>
  )
}
