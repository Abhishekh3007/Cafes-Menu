'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function TestOTPPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSendOTP = async () => {
    const testMobile = '9876543210'
    addResult(`Testing OTP send to ${testMobile}`)
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: testMobile })
      })

      const data = await response.json()
      
      if (data.success) {
        addResult(`✅ OTP sent successfully. New user: ${data.isNewUser}`)
      } else {
        addResult(`❌ Failed to send OTP: ${data.message}`)
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`)
    }
  }

  const testVerifyOTP = async () => {
    const testMobile = '9876543210'
    const testOTP = '123456' // This will fail - for demo purposes
    addResult(`Testing OTP verification for ${testMobile} with OTP: ${testOTP}`)
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile: testMobile, 
          otp: testOTP,
          name: 'Test User'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        addResult(`✅ OTP verified successfully`)
      } else {
        addResult(`❌ OTP verification failed: ${data.message}`)
      }
    } catch (error) {
      addResult(`❌ Network error: ${error}`)
    }
  }

  const testEnvironmentVariables = () => {
    addResult('Testing environment variables...')
    
    // Check if we can access the API endpoints
    fetch('/api/auth/send-otp', { method: 'GET' })
      .then(response => {
        if (response.status === 405) {
          addResult('✅ Send OTP endpoint is accessible (Method Not Allowed expected)')
        } else {
          addResult(`⚠️ Unexpected response from send-otp: ${response.status}`)
        }
      })
      .catch(error => {
        addResult(`❌ Cannot access send-otp endpoint: ${error}`)
      })

    fetch('/api/auth/verify-otp', { method: 'GET' })
      .then(response => {
        if (response.status === 405) {
          addResult('✅ Verify OTP endpoint is accessible (Method Not Allowed expected)')
        } else {
          addResult(`⚠️ Unexpected response from verify-otp: ${response.status}`)
        }
      })
      .catch(error => {
        addResult(`❌ Cannot access verify-otp endpoint: ${error}`)
      })
  }

  const runAllTests = async () => {
    setIsLoading(true)
    setTestResults([])
    
    addResult('🧪 Starting OTP system tests...')
    
    // Test environment
    testEnvironmentVariables()
    
    // Wait a bit for environment tests
    setTimeout(async () => {
      // Test sending OTP
      await testSendOTP()
      
      // Wait before testing verification
      setTimeout(async () => {
        await testVerifyOTP()
        addResult('🏁 All tests completed')
        setIsLoading(false)
      }, 2000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-brown-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-brown-800 rounded-lg shadow-lg border border-brown-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">OTP System Test Console</h1>
          
          {/* Current Auth Status */}
          <div className="bg-brown-700 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-amber-300 mb-2">Current Authentication Status</h2>
            <p className="text-white">
              <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
            </p>
            {user && (
              <div className="mt-2 text-brown-200">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Mobile:</strong> {user.mobile}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Verified:</strong> {user.isVerified ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Loyalty Points:</strong> {user.loyaltyPoints}</p>
              </div>
            )}
          </div>

          {/* Test Controls */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-amber-300 mb-4">Test Controls</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={runAllTests}
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {isLoading ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <button
                onClick={testSendOTP}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Test Send OTP
              </button>
              
              <button
                onClick={testVerifyOTP}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Test Verify OTP
              </button>
              
              <button
                onClick={testEnvironmentVariables}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Test Environment
              </button>
              
              <button
                onClick={() => setTestResults([])}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h2 className="text-xl font-semibold text-amber-300 mb-4">Test Results</h2>
            <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-400">No test results yet. Click &quot;Run All Tests&quot; to start.</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-green-400 font-mono text-sm">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="mt-8 bg-amber-900 bg-opacity-20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-amber-300 mb-2">Setup Required</h3>
            <p className="text-brown-200 text-sm mb-2">
              To test the OTP functionality, you need to configure Twilio credentials in your .env.local file:
            </p>
            <pre className="bg-black rounded p-2 text-xs text-green-400 overflow-x-auto">
{`TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_service_sid`}
            </pre>
            <p className="text-brown-200 text-sm mt-2">
              📖 Check TWILIO_OTP_SETUP.md for detailed setup instructions.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-6 text-center">
            <a 
              href="/login" 
              className="text-amber-300 hover:text-amber-400 font-medium"
            >
              → Go to Login Page (OTP)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
