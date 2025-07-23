'use client'

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Join SONNAS</h1>
          <p className="text-amber-700">Create your account and start your culinary journey</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-amber-600 hover:bg-amber-700',
              card: 'shadow-2xl border border-amber-200',
              headerTitle: 'text-amber-900',
              headerSubtitle: 'text-amber-700',
            }
          }}
        />
      </div>
    </div>
  )
}
