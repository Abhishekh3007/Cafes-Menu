'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { IUser } from '@/models/User'

interface User extends Partial<IUser> {
  id?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (userData: User) => void
  logout: () => void
  updateUser: (userData: User) => void
  isLoading: boolean
  clerkUser: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerkAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Derive authentication state from Clerk
  const isAuthenticated = !!clerkUser && isLoaded

  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        // Convert Clerk user to our user format
        const userData: User = {
          id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: clerkUser.fullName || clerkUser.firstName || '',
          phone: clerkUser.phoneNumbers[0]?.phoneNumber,
        }
        setUser(userData)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
  }, [clerkUser, isLoaded])

  const login = (userData: User) => {
    // For Clerk, login is handled by Clerk components
    // This function is kept for backward compatibility
    setUser(userData)
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await signOut()
      localStorage.removeItem('sonnas-cart') // Clear cart data on logout
      setUser(null)
      // Dispatch custom event to notify cart to clear
      window.dispatchEvent(new CustomEvent('auth-logout'))
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    updateUser,
    isLoading,
    clerkUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
