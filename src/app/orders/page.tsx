'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Order {
  _id: string
  items: Array<{
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
  createdAt: string
  address: string
  phone: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Mock orders data for now - replace with actual API call
    const mockOrders: Order[] = [
      {
        _id: '1',
        items: [
          {
            name: 'Margherita Pizza',
            price: 299,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop'
          },
          {
            name: 'Garlic Bread',
            price: 149,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1619985365426-87fb5b456fb8?w=300&h=200&fit=crop'
          }
        ],
        total: 597,
        status: 'delivered',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        address: '123 Main Street, City',
        phone: '+91 9876543210'
      },
      {
        _id: '2',
        items: [
          {
            name: 'Chicken Tikka',
            price: 349,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=300&h=200&fit=crop'
          }
        ],
        total: 349,
        status: 'preparing',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        address: '123 Main Street, City',
        phone: '+91 9876543210'
      }
    ]

    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [isAuthenticated, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'preparing':
        return 'bg-blue-100 text-blue-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'preparing':
        return '👨‍🍳'
      case 'ready':
        return '✅'
      case 'delivered':
        return '🚚'
      default:
        return '📦'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream pt-20 pb-20">
        <div className="max-w-md mx-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-20 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-charcoal-brown mb-2">📦 Your Orders</h1>
          <p className="text-brown-light">Track your delicious orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-xl font-bold text-charcoal-brown mb-2">No orders yet</p>
            <p className="text-brown-light mb-6">Start ordering some delicious food!</p>
            <button
              onClick={() => router.push('/menu')}
              className="bg-vibrant-coral text-white px-6 py-3 rounded-xl font-semibold hover:bg-coral-light transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal-brown">Order #{order._id}</h3>
                    <p className="text-sm text-brown-light">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                    <span>{getStatusEmoji(order.status)}</span>
                    <span className="capitalize">{order.status}</span>
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="text-charcoal-brown font-medium">{item.name}</span>
                        <span className="text-brown-light ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-charcoal-brown font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-bold text-charcoal-brown">Total</span>
                  <span className="text-lg font-bold text-vibrant-coral">₹{order.total}</span>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-charcoal-brown py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button className="flex-1 bg-vibrant-coral text-white py-2 rounded-lg font-medium hover:bg-coral-light transition-colors">
                      Reorder
                    </button>
                  )}
                  {order.status !== 'delivered' && (
                    <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                      Track Order
                    </button>
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
