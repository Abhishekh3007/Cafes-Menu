'use client'

import { useState, useEffect } from 'react'

interface VerifiedUser {
  _id: string
  mobile: string
  name: string
  verificationMethod: string
  createdAt: string
}

export default function AdminPhoneVerification() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verifiedNumbers, setVerifiedNumbers] = useState<VerifiedUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchVerifiedNumbers()
  }, [])

  const fetchVerifiedNumbers = async () => {
    try {
      const response = await fetch('/api/admin/verify-phone')
      const data = await response.json()
      
      if (data.success) {
        setVerifiedNumbers(data.verifiedNumbers)
      }
    } catch (error) {
      console.error('Error fetching verified numbers:', error)
    }
  }

  const handleVerifyPhone = async () => {
    if (!phoneNumber) {
      setMessage('Please enter a phone number')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: phoneNumber,
          action: 'verify'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage(`✅ Phone number ${phoneNumber} has been verified successfully!`)
        setPhoneNumber('')
        fetchVerifiedNumbers() // Refresh the list
      } else {
        setMessage(`❌ Error: ${data.message}`)
      }
    } catch (error) {
      setMessage('❌ Error verifying phone number')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 border border-amber-300 border-opacity-20">
          <h1 className="text-4xl font-display font-bold text-white text-center mb-8">
            📱 Phone Number Verification Admin
          </h1>
          
          {/* Twilio Trial Account Warning */}
          <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 mb-8">
            <h2 className="text-red-200 font-bold text-lg mb-2">🚨 Twilio Trial Account Limitation</h2>
            <p className="text-red-100 text-sm mb-2">
              Your Twilio account is in trial mode, which means OTP can only be sent to verified phone numbers.
            </p>
            <p className="text-red-100 text-sm mb-3">
              <strong>Solutions:</strong>
            </p>
            <ul className="text-red-100 text-sm list-disc list-inside space-y-1">
              <li>Upgrade your Twilio account to send OTP to any number</li>
              <li>Manually verify phone numbers in Twilio Console</li>
              <li>Use this admin panel to manually verify users (bypass OTP)</li>
            </ul>
          </div>

          {/* Manual Verification Form */}
          <div className="bg-amber-900 bg-opacity-20 rounded-lg p-6 mb-8">
            <h2 className="text-amber-200 font-bold text-xl mb-4">
              Manual Phone Verification (Bypass OTP)
            </h2>
            <p className="text-amber-100 text-sm mb-4">
              Use this to manually verify phone numbers that cannot receive OTP due to Twilio trial limitations.
            </p>
            
            <div className="flex gap-4 mb-4">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter 10-digit phone number (e.g., 9876543210)"
                className="flex-1 px-4 py-2 bg-brown-700 text-white rounded-lg border border-brown-600 focus:outline-none focus:border-amber-500"
                maxLength={10}
              />
              <button
                onClick={handleVerifyPhone}
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Phone'}
              </button>
            </div>
            
            {message && (
              <div className={`p-3 rounded-lg ${
                message.includes('✅') 
                  ? 'bg-green-900 bg-opacity-50 text-green-200' 
                  : 'bg-red-900 bg-opacity-50 text-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Verified Numbers List */}
          <div>
            <h2 className="text-white font-bold text-xl mb-4">
              ✅ Verified Phone Numbers ({verifiedNumbers.length})
            </h2>
            
            {verifiedNumbers.length === 0 ? (
              <p className="text-brown-300">No verified phone numbers found.</p>
            ) : (
              <div className="space-y-2">
                {verifiedNumbers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-brown-700 bg-opacity-30 p-4 rounded-lg border border-brown-600"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-white font-medium">{user.mobile}</span>
                        <span className="text-brown-300 ml-3">{user.name}</span>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.verificationMethod === 'otp' 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-blue-900 text-blue-200'
                        }`}>
                          {user.verificationMethod === 'otp' ? 'OTP Verified' : 'Manual Verify'}
                        </span>
                        <div className="text-brown-400 text-xs mt-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-900 bg-opacity-20 rounded-lg p-6">
            <h3 className="text-blue-200 font-bold mb-3">📋 How to Fix OTP Issues:</h3>
            <div className="space-y-3 text-blue-100 text-sm">
              <div>
                <strong>Option 1 - Upgrade Twilio Account:</strong>
                <p>Go to Twilio Console → Billing → Upgrade to remove trial limitations</p>
              </div>
              <div>
                <strong>Option 2 - Verify in Twilio Console:</strong>
                <p>Go to Twilio Console → Phone Numbers → Verified Caller IDs → Add new number</p>
              </div>
              <div>
                <strong>Option 3 - Manual Verification:</strong>
                <p>Use this admin panel to manually verify users who cannot receive OTP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
