'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  mobile: string
  name?: string
  email?: string
  loyaltyPoints?: number
  totalOrders?: number
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (token: string, userData?: User) => void
  logout: () => void
  updateUser: (userData: User) => void
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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    if (token) {
      setIsAuthenticated(true)
      if (userData) {
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      }
    }
  }, [])

  const login = (token: string, userData?: User) => {
    localStorage.setItem('authToken', token)
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData))
      setUser(userData)
    }
    setIsAuthenticated(true)
  }

  const updateUser = (userData: User) => {
    localStorage.setItem('userData', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('sonnas-cart') // Clear cart data on logout
    setIsAuthenticated(false)
    setUser(null)
    // Dispatch custom event to notify cart to clear
    window.dispatchEvent(new CustomEvent('auth-logout'))
  }

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
