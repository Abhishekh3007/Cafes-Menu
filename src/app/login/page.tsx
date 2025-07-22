'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  // Step 1: Mobile input, Step 2: OTP verification
  const [step, setStep] = useState<1 | 2>(1)
  const [mobile, setMobile] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isNewUser, setIsNewUser] = useState(false)
  
  const router = useRouter()
  const { login } = useAuth()
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (step === 2) {
      setCanResend(true)
    }
  }, [resendCountdown, step])

  // Auto-focus next OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Format mobile number
    let formattedMobile = mobile.trim()
    if (formattedMobile.startsWith('+91')) {
      formattedMobile = formattedMobile.substring(3)
    }
    if (!formattedMobile.startsWith('91') && formattedMobile.length === 10) {
      formattedMobile = '91' + formattedMobile
    }

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formattedMobile }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      // Check if user is pre-verified (manually verified)
      if (data.isPreVerified) {
        // Try direct login for pre-verified users
        const loginRes = await fetch('/api/auth/direct-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mobile: formattedMobile }),
        })

        const loginData = await loginRes.json()

        if (loginRes.ok && loginData.success) {
          login(loginData.user)
          router.push('/')
          return
        }
      }

      setIsNewUser(data.isNewUser)
      setStep(2)
      setResendCountdown(30)
      setCanResend(false)
      
      // Focus first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP')
      return
    }

    if (isNewUser && !name.trim()) {
      setError('Please enter your name')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile, 
          otp: otpCode,
          ...(isNewUser && { name: name.trim() })
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to verify OTP')
      }

      login(data.user)
      router.push('/')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return
    
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      })

      if (res.ok) {
        setResendCountdown(30)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
        otpRefs.current[0]?.focus()
      }
    } catch (err) {
      setError('Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-amber-300 border-opacity-20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-white">
              {step === 1 ? 'Login' : 'Verify OTP'}
            </h1>
            <p className="text-brown-200 mt-2">
              {step === 1 ? 'Enter your mobile number' : `Enter OTP sent to ${mobile}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2" htmlFor="mobile">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="+91 9999999999"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-xl hover:shadow-amber-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {isNewUser && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Enter 6-digit OTP
                </label>
                <div className="flex space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg text-center text-white text-lg font-semibold focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-xl hover:shadow-amber-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend || isLoading}
                  className="text-amber-300 hover:text-amber-400 disabled:text-brown-400 disabled:cursor-not-allowed transition-colors"
                >
                  {canResend ? 'Resend OTP' : `Resend in ${resendCountdown}s`}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setOtp(['', '', '', '', '', ''])
                    setError(null)
                  }}
                  className="text-brown-300 hover:text-brown-200 text-sm transition-colors"
                >
                  ← Change mobile number
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
