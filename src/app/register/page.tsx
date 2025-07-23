'use client'

import { SignUp } from '@clerk/nextjs'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 hero-pattern">
      {/* Elegant overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-16 pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Join SONNAS</h1>
            <p className="text-brown-200 text-base md:text-lg">Create your account and start your culinary journey</p>
          </div>
          
          <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-amber-300 border-opacity-20 shadow-2xl">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/25 text-sm md:text-base',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-white text-xl md:text-2xl font-display font-bold',
                  headerSubtitle: 'text-brown-200 text-sm md:text-base',
                  socialButtonsBlockButton: 'bg-brown-700 hover:bg-brown-600 border border-brown-600 text-white transition-colors text-sm md:text-base',
                  formFieldInput: 'bg-brown-700 bg-opacity-50 border border-brown-600 text-white placeholder-brown-300 focus:border-amber-400 text-sm md:text-base',
                  formFieldLabel: 'text-brown-200 text-sm md:text-base',
                  identityPreviewText: 'text-brown-200 text-sm md:text-base',
                  formButtonReset: 'text-amber-300 hover:text-amber-200 text-sm md:text-base',
                  footerActionLink: 'text-amber-300 hover:text-amber-200 text-sm md:text-base',
                  dividerLine: 'bg-brown-600',
                  dividerText: 'text-brown-300 text-sm md:text-base',
                  alternativeMethodsBlockButton: 'bg-brown-700 hover:bg-brown-600 border border-brown-600 text-white text-sm md:text-base',
                  root: 'w-full',
                  cardBox: 'w-full shadow-none',
                  formFieldWarningText: 'text-red-400 text-sm',
                  otpCodeFieldInput: 'bg-brown-700 border-brown-600 text-white text-sm md:text-base'
                }
              }}
              redirectUrl="/reserve"
              signInUrl="/login"
            />
          </div>
        </div>
      </div>
    </div>
  )
}