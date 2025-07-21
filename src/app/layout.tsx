import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-body`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Cart />
            <FloatingCartButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
