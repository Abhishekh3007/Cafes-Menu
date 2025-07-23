'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import withAuth from '@/components/withAuth/withAuth'

interface UserProfile {
  name: string
  email: string
  mobile: string
  dateOfBirth: string
  gender: string
  address: {
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
    landmark: string
    addressType: string
  }
}

function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    address: {
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: '',
      addressType: 'home'
    }
  })
  const [orders, setOrders] = useState([])
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        address: {
          fullName: user.address?.fullName || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          landmark: user.address?.landmark || '',
          addressType: user.address?.addressType || 'home'
        }
      })
      setLoyaltyPoints(user.loyaltyPoints || 0)
      fetchUserOrders()
    }
  }, [user])

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('address.')) {
      const addressField = field.replace('address.', '')
      setProfile(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        setIsEditing(false)
        // Refresh user data
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get current location for address
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // Use a simple coordinates format since we don't have geocoding API
            const locationString = `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
            handleInputChange('address.street', locationString)
            alert('Location captured! Please complete the address details.')
          } catch (error) {
            // Fallback to coordinates
            const locationString = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
            handleInputChange('address.street', locationString)
          }
        },
        (error) => {
          alert('Unable to get your location. Please enter address manually.')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">My Profile</h1>
          <p className="text-brown-200">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">Basic Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={profile.mobile}
                    disabled
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                  <p className="text-xs text-brown-300 mt-1">Mobile number cannot be changed</p>
                </div>
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-brown-200 text-sm font-medium mb-2">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Address Information */}
            <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Delivery Address</h2>
              
              {isEditing && (
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={getCurrentLocation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    📍 Use Current Location
                  </button>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.address.fullName}
                    onChange={(e) => handleInputChange('address.fullName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">Address Type</label>
                  <select
                    value={profile.address.addressType}
                    onChange={(e) => handleInputChange('address.addressType', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-brown-200 text-sm font-medium mb-2">Street Address</label>
                  <textarea
                    value={profile.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={profile.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={profile.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={profile.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-brown-200 text-sm font-medium mb-2">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={profile.address.landmark}
                    onChange={(e) => handleInputChange('address.landmark', e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-brown-700 bg-opacity-50 border border-brown-600 rounded-lg px-4 py-3 text-white placeholder-brown-300 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Order History</h2>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order._id} className="bg-brown-700 bg-opacity-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Order #{order.orderId}</span>
                        <span className="text-amber-300 font-bold">Rs {order.total}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-brown-200">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered' ? 'bg-green-600 text-white' :
                          order.status === 'confirmed' ? 'bg-blue-600 text-white' :
                          order.status === 'preparing' ? 'bg-yellow-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <button className="w-full text-amber-300 hover:text-amber-400 font-medium">
                      View All Orders ({orders.length})
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-6xl mb-4 block">🍽️</span>
                  <p className="text-brown-200">No orders yet</p>
                  <button
                    onClick={() => router.push('/menu')}
                    className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Loyalty Points */}
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-white">
              <div className="text-center">
                <span className="text-4xl mb-2 block">🏆</span>
                <h3 className="text-xl font-bold mb-2">Loyalty Points</h3>
                <div className="text-3xl font-display font-bold mb-1">{loyaltyPoints}</div>
                <p className="text-amber-100 text-sm">Points earned</p>
                <div className="mt-4 text-xs text-amber-100">
                  Earn 1 point for every Rs 10 spent
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
              <h3 className="text-xl font-display font-bold text-white mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-brown-200">Total Orders</span>
                  <span className="text-white font-bold">{user?.totalOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brown-200">Member Since</span>
                  <span className="text-white font-bold">
                    {user?.createdAt ? new Date(user.createdAt).getFullYear() : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brown-200">Verification Status</span>
                  <span className={`font-bold ${user?.isVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {user?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-brown-800 bg-opacity-30 backdrop-blur-sm rounded-2xl p-6 border border-amber-300 border-opacity-20">
              <h3 className="text-xl font-display font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/menu')}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors"
                >
                  Browse Menu
                </button>
                <button
                  onClick={() => router.push('/reserve')}
                  className="w-full bg-brown-600 hover:bg-brown-700 text-white py-2 rounded-lg transition-colors"
                >
                  Reserve Table
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full bg-brown-600 hover:bg-brown-700 text-white py-2 rounded-lg transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(ProfilePage)
