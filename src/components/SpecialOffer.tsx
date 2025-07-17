'use client'

import { useState } from 'react'

export default function SpecialOffer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log('Email submitted:', email)
    setEmail('')
  }

  return (
    <section className="py-20 px-4 lg:px-8 bg-gradient-to-r from-amber-600 to-amber-700">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Special Offer
          </h2>
          <div className="text-6xl md:text-8xl font-display font-bold text-white mb-4">
            20% OFF
          </div>
          <p className="text-2xl text-amber-100 mb-2">
            Your First Order
          </p>
          <p className="text-lg text-amber-200 max-w-2xl mx-auto">
            Join our family and enjoy a special discount on your first dining experience with us. 
            Sign up now and taste the excellence!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-transparent focus:border-white focus:outline-none text-brown-900 font-medium"
              required
            />
            <button
              type="submit"
              className="bg-brown-900 hover:bg-brown-800 text-white px-6 py-3 rounded-lg transition-colors font-semibold whitespace-nowrap"
            >
              Claim Offer
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Sign Up</h3>
            <p className="text-amber-200 text-sm">Enter your email to join</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Order</h3>
            <p className="text-amber-200 text-sm">Place your first order</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Save</h3>
            <p className="text-amber-200 text-sm">Enjoy 20% discount</p>
          </div>
        </div>

        <div className="mt-8 text-amber-200 text-sm">
          * Offer valid for new customers only. Cannot be combined with other offers.
        </div>
      </div>
    </section>
  )
}
