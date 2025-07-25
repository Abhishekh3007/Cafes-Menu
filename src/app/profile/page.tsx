'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import withAuth from '@/components/withAuth/withAuth'
import BottomNavigation from '@/components/BottomNavigation'
import { ArrowLeft, User, Heart, Gift, Phone, MapPin, Settings, ChevronRight, Package, Clock, CheckCircle, Truck } from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  _id: string
  clerkId: string
  email: string
  name: string
  phone?: string
  loyaltyPoints: number
  totalOrders: number
  joinedDate: string
  membershipTier: string
}

interface Order {
  _id: string
  orderNumber: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  orderDate: string
  deliveryDate?: string
  paymentStatus: 'pending' | 'completed' | 'failed'
  deliveryAddress?: string
}

function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const { user: clerkUser } = useUser()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data.profile)
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Profile fetch error:', err)
    }
  }

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Orders fetch error:', err)
    }
  }

  // Create test data for testing
  const createTestData = async () => {
    try {
      const response = await fetch('/api/test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' })
      })
      
      if (response.ok) {
        // Refresh data
        await Promise.all([fetchProfile(), fetchOrders()])
        alert('Test data created successfully!')
      } else {
        alert('Failed to create test data')
      }
    } catch (error) {
      console.error('Error creating test data:', error)
      alert('Error creating test data')
    }
  }

  // Clear test data
  const clearTestData = async () => {
    try {
      const response = await fetch('/api/test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      })
      
      if (response.ok) {
        // Refresh data
        await Promise.all([fetchProfile(), fetchOrders()])
        alert('Test data cleared successfully!')
      } else {
        alert('Failed to clear test data')
      }
    } catch (error) {
      console.error('Error clearing test data:', error)
      alert('Error clearing test data')
    }
  }

  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && clerkUser) {
        setLoading(true)
        await Promise.all([fetchProfile(), fetchOrders()])
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [isAuthenticated, clerkUser])

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'preparing': return <Package className="w-4 h-4 text-orange-600" />
      case 'out_for_delivery': return <Truck className="w-4 h-4 text-purple-600" />
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'cancelled': return <div className="w-4 h-4 bg-red-600 rounded-full" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Order Pending'
      case 'confirmed': return 'Order Confirmed'
      case 'preparing': return 'Being Prepared'
      case 'out_for_delivery': return 'Out for Delivery'
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      default: return 'Unknown Status'
    }
  }

  const getTierFromPoints = (points: number) => {
    if (points >= 5000) return 'Platinum Member'
    if (points >= 2000) return 'Gold Member'
    if (points >= 500) return 'Silver Member'
    return 'Bronze Member'
  }

  const getNextTierPoints = (points: number) => {
    if (points < 500) return 500 - points
    if (points < 2000) return 2000 - points
    if (points < 5000) return 5000 - points
    return 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-vibrant-coral text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const loyaltyProgress = profile.loyaltyPoints >= 5000 ? 100 : (profile.loyaltyPoints / 5000) * 100
  const pointsToNextTier = getNextTierPoints(profile.loyaltyPoints)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-orange-100 px-3 py-1 rounded-full">
            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-orange-600 font-medium">{profile.loyaltyPoints.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-2l2 10m0 0h12m-8 4a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">U</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">Welcome back!</h1>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-700 font-medium">{profile.loyaltyPoints.toLocaleString()} loyalty points</span>
                </div>
                <span className="text-orange-600 font-medium">{profile.membershipTier}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Data Buttons (for testing) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-medium text-yellow-800 mb-3">Test Data Controls</h3>
          <div className="flex space-x-3">
            <button
              onClick={createTestData}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create Test Data
            </button>
            <button
              onClick={clearTestData}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Test Data
            </button>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            Use these buttons to test the loyalty points and orders system
          </p>
        </div>

        {/* Favorites and Rewards Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Favorites</h3>
            <p className="text-gray-500 text-sm">0 saved items</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Rewards</h3>
            <p className="text-gray-500 text-sm">{Math.floor(profile.loyaltyPoints / 100)} available</p>
          </div>
        </div>

        {/* Loyalty Program */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h3 className="text-lg font-bold text-gray-800">Loyalty Program</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Earn points with every order and unlock rewards</p>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Progress to Platinum</span>
              <span className="text-gray-600 text-sm">{profile.loyaltyPoints.toLocaleString()} / 2,000 points</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loyaltyProgress}%` }}
              ></div>
            </div>
            
            <p className="text-gray-500 text-sm">
              {pointsToNextTier} more points to unlock Platinum benefits
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          <button 
            onClick={() => router.push('/contact')}
            className="w-full bg-white rounded-xl p-4 flex items-center space-x-4 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-gray-800 font-medium">Contact Support</span>
          </button>
          
          <button 
            onClick={() => router.push('/addresses')}
            className="w-full bg-white rounded-xl p-4 flex items-center space-x-4 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-800 font-medium">Delivery Addresses</span>
          </button>
          
          <button 
            onClick={() => router.push('/settings')}
            className="w-full bg-white rounded-xl p-4 flex items-center space-x-4 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-800 font-medium">Settings & Privacy</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

export default withAuth(ProfilePage)