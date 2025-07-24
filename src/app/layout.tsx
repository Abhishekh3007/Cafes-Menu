import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'SONNAS - Premium Restaurant Experience',
  description: 'Discover exceptional cuisine and elegant dining at SONNAS. Order online and enjoy 20% off your first order.',
  keywords: 'restaurant, fine dining, online ordering, food delivery, SONNAS',
}

import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/components/CartProvider'
import Cart from '@/components/Cart'
import FloatingCartButton from '@/components/FloatingCartButton'
import BottomNavigation from '@/components/BottomNavigation'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure Clerk has a publishable key during build
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  if (!clerkPublishableKey && process.env.NODE_ENV !== 'development') {
    console.warn('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable')
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en">
        <body className={`${inter.variable} ${playfair.variable} font-body`}>
          <AuthProvider>
            <CartProvider>
              {children}
              <Cart />
              <FloatingCartButton />
              <BottomNavigation />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#6CA1A6',
                    color: '#ffffff',
                    border: '1px solid #92400e',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#ffffff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
