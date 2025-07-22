'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login after a short delay to show the message
    const timer = setTimeout(() => {
      router.push('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-amber-300 border-opacity-20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📱</div>
            <h1 className="text-4xl font-display font-bold text-white">One Login Method</h1>
            <p className="text-brown-200 mt-2">We&apos;ve simplified authentication</p>
          </div>

          <div className="bg-amber-900 bg-opacity-20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-amber-300 mb-3">New & Existing Users</h2>
            <p className="text-brown-200 text-sm leading-relaxed">
              We now use <strong className="text-white">one simple login method</strong> for everyone:
            </p>
            <ul className="mt-3 space-y-2 text-brown-200 text-sm">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Enter your mobile number
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Receive OTP via SMS
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Verify and login instantly
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-brown-300 text-sm mb-4">
              Redirecting to login in 3 seconds...
            </p>
            
            <Link
              href="/login"
              className="inline-block w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-xl hover:shadow-amber-500/25 hover:scale-105"
            >
              Go to Login Now
            </Link>
          </div>

          <div className="text-center mt-6">
            <p className="text-brown-200 text-sm">
              No passwords, no complications<br/>
              <span className="text-amber-300">Just quick & secure OTP login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}