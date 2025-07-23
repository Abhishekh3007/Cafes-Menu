'use client'

import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 hero-pattern">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-16 pb-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-brown-200 text-base md:text-lg">Sign in to your SONNAS account</p>
          </div>
          
          <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-amber-300 border-opacity-20 shadow-2xl">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-amber-600 hover:bg-amber-700 text-white text-sm md:text-base',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-white text-xl md:text-2xl font-display',
                  headerSubtitle: 'text-brown-200 text-sm md:text-base',
                  socialButtonsBlockButton: 'bg-brown-700 border-brown-600 text-white hover:bg-brown-600 text-sm md:text-base',
                  formFieldInput: 'bg-brown-700 border-brown-600 text-white placeholder-brown-300 text-sm md:text-base',
                  formFieldLabel: 'text-brown-200 text-sm md:text-base',
                  footerActionLink: 'text-amber-400 hover:text-amber-300 text-sm md:text-base',
                  dividerLine: 'bg-brown-600',
                  dividerText: 'text-brown-300 text-sm md:text-base',
                  formResendCodeLink: 'text-amber-400 hover:text-amber-300 text-sm md:text-base',
                  otpCodeFieldInput: 'bg-brown-700 border-brown-600 text-white text-sm md:text-base',
                  formFieldWarningText: 'text-red-400 text-sm',
                  identityPreviewText: 'text-brown-200 text-sm md:text-base',
                  identityPreviewEditButton: 'text-amber-400 hover:text-amber-300 text-sm md:text-base',
                  root: 'w-full',
                  cardBox: 'w-full shadow-none'
                }
              }}
              redirectUrl="/reserve"
              signUpUrl="/register"
            />
          </div>
        </div>
      </div>
    </div>
  )
}