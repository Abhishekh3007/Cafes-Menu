'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import withAuth from '@/components/withAuth/withAuth'
import { ArrowLeft, User, Phone, Mail, Calendar, UserCheck, Eye, EyeOff, Save, X } from 'lucide-react'

interface UserProfile {
  _id: string
  clerkId: string
  email: string
  name: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  loyaltyPoints: number
  totalOrders: number
  joinedDate: string
  membershipTier: string
}

function SettingsPrivacyPage() {
  const { user, isAuthenticated } = useAuth()
  const { user: clerkUser } = useUser()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | ''
  })

  // Privacy settings states
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: true,
    showPhone: true,
    showOrderHistory: true,
    allowPromotionalEmails: true,
    allowSmsNotifications: true
  })

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      const data = await response.json()
      setProfile(data.profile)
      
      // Set form data
      setFormData({
        name: data.profile.name || '',
        phone: data.profile.phone || '',
        dateOfBirth: data.profile.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : '',
        gender: data.profile.gender || ''
      })
    } catch (err) {
      setError('Failed to load profile data')
      console.error('Profile fetch error:', err)
    }
  }

  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && clerkUser) {
        setLoading(true)
        await fetchProfile()
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [isAuthenticated, clerkUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePrivacyChange = (setting: string, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      setProfile(data.profile)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
      console.error('Profile update error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        gender: profile.gender || ''
      })
    }
    setIsEditing(false)
    setError(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Settings & Privacy</h1>
        </div>
        
        {isEditing && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-1 bg-vibrant-coral text-white px-4 py-2 rounded-lg hover:bg-vibrant-coral/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-vibrant-coral hover:text-vibrant-coral/80 text-sm font-medium transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile?.name || 'Not provided'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed here. Please update in your account settings.</p>
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{profile?.phone || 'Not provided'}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Date of Birth</span>
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                  {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <UserCheck className="w-4 h-4" />
                <span>Gender</span>
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                  {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Privacy Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Control what information is visible and how you receive notifications</p>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Show Email */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Show Email in Profile</h3>
                <p className="text-xs text-gray-600">Allow others to see your email address</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.showEmail}
                  onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-vibrant-coral/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-coral"></div>
              </label>
            </div>

            {/* Show Phone */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Show Phone Number</h3>
                <p className="text-xs text-gray-600">Allow others to see your phone number</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.showPhone}
                  onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-vibrant-coral/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-coral"></div>
              </label>
            </div>

            {/* Show Order History */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Show Order History</h3>
                <p className="text-xs text-gray-600">Display your order history in profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.showOrderHistory}
                  onChange={(e) => handlePrivacyChange('showOrderHistory', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-vibrant-coral/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-coral"></div>
              </label>
            </div>

            {/* Promotional Emails */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Promotional Emails</h3>
                <p className="text-xs text-gray-600">Receive offers and promotions via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.allowPromotionalEmails}
                  onChange={(e) => handlePrivacyChange('allowPromotionalEmails', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-vibrant-coral/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-coral"></div>
              </label>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800">SMS Notifications</h3>
                <p className="text-xs text-gray-600">Receive order updates via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacySettings.allowSmsNotifications}
                  onChange={(e) => handlePrivacyChange('allowSmsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-vibrant-coral/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-coral"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Account Actions</h2>
          </div>
          
          <div className="p-6 space-y-3">
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="text-sm font-medium text-gray-800">Download My Data</h3>
              <p className="text-xs text-gray-600 mt-1">Get a copy of your data</p>
            </button>
            
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <h3 className="text-sm font-medium text-gray-800">Delete Account</h3>
              <p className="text-xs text-gray-600 mt-1">Permanently delete your account and data</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(SettingsPrivacyPage)
