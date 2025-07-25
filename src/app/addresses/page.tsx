'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import withAuth from '@/components/withAuth/withAuth'
import { ArrowLeft, Plus, MapPin, Home, Briefcase, User, Phone, Edit2, Trash2, Star, MapIcon } from 'lucide-react'

interface Address {
  _id: string
  userId: string
  clerkId: string
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  landmark?: string
  addressType: 'home' | 'work' | 'other'
  isDefault: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
  instructions?: string
  createdAt: string
  updatedAt: string
}

function AddressesPage() {
  const { user, isAuthenticated } = useAuth()
  const { user: clerkUser } = useUser()
  const router = useRouter()
  
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    addressType: 'home' as 'home' | 'work' | 'other',
    instructions: '',
    isDefault: false
  })

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (!response.ok) throw new Error('Failed to fetch addresses')
      const data = await response.json()
      setAddresses(data.addresses || [])
    } catch (err) {
      setError('Failed to load addresses')
      console.error('Address fetch error:', err)
    }
  }

  useEffect(() => {
    const loadAddresses = async () => {
      if (isAuthenticated && clerkUser) {
        setLoading(true)
        await fetchAddresses()
        setLoading(false)
      }
    }
    
    loadAddresses()
  }, [isAuthenticated, clerkUser])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      landmark: '',
      addressType: 'home',
      instructions: '',
      isDefault: false
    })
    setEditingAddress(null)
    setShowAddForm(false)
    setError(null)
  }

  const handleEdit = (address: Address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      landmark: address.landmark || '',
      addressType: address.addressType,
      instructions: address.instructions || '',
      isDefault: address.isDefault
    })
    setEditingAddress(address)
    setShowAddForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Validate required fields
      if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
        throw new Error('Please fill in all required fields')
      }

      const url = editingAddress ? '/api/addresses' : '/api/addresses'
      const method = editingAddress ? 'PUT' : 'POST'
      const body = editingAddress 
        ? { addressId: editingAddress._id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save address')
      }

      const data = await response.json()
      setSuccessMessage(data.message)
      
      // Refresh addresses
      await fetchAddresses()
      resetForm()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save address. Please try again.')
      console.error('Address save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const response = await fetch(`/api/addresses?id=${addressId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete address')
      }

      setSuccessMessage('Address deleted successfully')
      await fetchAddresses()
      
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to delete address')
      console.error('Address delete error:', err)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}/default`, {
        method: 'PUT'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to set default address')
      }

      setSuccessMessage('Default address updated')
      await fetchAddresses()
      
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to set default address')
      console.error('Set default error:', err)
    }
  }

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-4 h-4" />
      case 'work': return <Briefcase className="w-4 h-4" />
      default: return <MapPin className="w-4 h-4" />
    }
  }

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'text-green-600 bg-green-100'
      case 'work': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-coral mx-auto mb-4"></div>
          <p className="text-gray-600">Loading addresses...</p>
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
          <h1 className="text-lg font-semibold text-gray-800">Delivery Addresses</h1>
        </div>
        
        <button
          onClick={() => {
            resetForm()
            setShowAddForm(true)
          }}
          className="flex items-center space-x-1 bg-vibrant-coral text-white px-4 py-2 rounded-lg hover:bg-vibrant-coral/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      <div className="px-4 py-6 space-y-4">
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

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                  placeholder="Enter street address"
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                    placeholder="State"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                  placeholder="ZIP Code"
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                  placeholder="Nearby landmark"
                />
              </div>

              {/* Address Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <select
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vibrant-coral focus:border-transparent"
                  placeholder="Special instructions for delivery"
                />
              </div>

              {/* Default Address */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-vibrant-coral bg-gray-100 border-gray-300 rounded focus:ring-vibrant-coral"
                />
                <label className="text-sm font-medium text-gray-700">
                  Set as default address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-vibrant-coral text-white px-4 py-3 rounded-lg hover:bg-vibrant-coral/90 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingAddress ? 'Update' : 'Save')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Address List */}
        {addresses.length === 0 && !showAddForm ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No addresses yet</h3>
            <p className="text-gray-600 mb-4">Add your first delivery address to get started</p>
            <button
              onClick={() => {
                resetForm()
                setShowAddForm(true)
              }}
              className="bg-vibrant-coral text-white px-6 py-2 rounded-lg hover:bg-vibrant-coral/90 transition-colors"
            >
              Add Address
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div key={address._id} className="bg-white rounded-2xl shadow-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getAddressTypeColor(address.addressType)}`}>
                          {getAddressTypeIcon(address.addressType)}
                          <span className="capitalize">{address.addressType}</span>
                        </div>
                        {address.isDefault && (
                          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            <Star className="w-3 h-3" />
                            <span>Default</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-1">{address.fullName}</h3>
                      <p className="text-gray-600 text-sm mb-1">{address.phone}</p>
                      
                      <div className="text-gray-700 text-sm space-y-1">
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        {address.landmark && (
                          <p className="text-gray-500">Near: {address.landmark}</p>
                        )}
                        {address.instructions && (
                          <p className="text-gray-500 italic">&ldquo;{address.instructions}&rdquo;</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 ml-4">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  {!address.isDefault && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="text-vibrant-coral hover:text-vibrant-coral/80 text-sm font-medium transition-colors"
                      >
                        Set as Default
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(AddressesPage)
