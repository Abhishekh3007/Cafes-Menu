'use client'

import { useState } from 'react'

export default function FixUserPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fixUser = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/fix-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to fix user' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Fix User ClerkID</h1>
        
        <button
          onClick={fixUser}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Fixing...' : 'Fix User'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
