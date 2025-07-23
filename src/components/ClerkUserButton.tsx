'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { useAuth } from '@/context/AuthContext'

export default function ClerkUserButton() {
  const { isLoaded, isSignedIn } = useUser()
  const { isAuthenticated } = useAuth()

  if (!isLoaded || !isSignedIn || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex items-center">
      <UserButton 
        appearance={{
          elements: {
            avatarBox: 'w-8 h-8',
            userButtonPopoverCard: 'bg-brown-800 border border-amber-300 border-opacity-20',
            userButtonPopoverActionButton: 'hover:bg-brown-700 text-white',
            userButtonPopoverActionButtonText: 'text-white',
            userButtonPopoverFooter: 'hidden'
          }
        }}
        afterSignOutUrl="/"
      />
    </div>
  )
}
