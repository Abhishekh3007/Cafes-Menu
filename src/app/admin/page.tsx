'use client'

import { useState } from 'react'
import Link from 'next/link'

const stats = [
  { name: 'Total Orders', value: '1,234', change: '+12%', changeType: 'increase' },
  { name: 'Revenue Today', value: '$12,345', change: '+5%', changeType: 'increase' },
  { name: 'Active Menu Items', value: '45', change: '+2', changeType: 'increase' },
  { name: 'Customer Reviews', value: '4.8', change: '+0.2', changeType: 'increase' },
]

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', items: 3, total: 45.99, status: 'preparing', time: '10 min ago' },
  { id: 'ORD-002', customer: 'Jane Smith', items: 2, total: 28.50, status: 'ready', time: '15 min ago' },
  { id: 'ORD-003', customer: 'Mike Johnson', items: 5, total: 67.25, status: 'delivered', time: '25 min ago' },
  { id: 'ORD-004', customer: 'Sarah Wilson', items: 1, total: 16.99, status: 'confirmed', time: '30 min ago' },
]

const topItems = [
  { name: 'Grilled Salmon', orders: 45, revenue: 1304.55 },
  { name: 'Beef Wellington', orders: 23, revenue: 1057.77 },
  { name: 'Lobster Bisque', orders: 38, revenue: 645.62 },
  { name: 'Chocolate Soufflé', orders: 31, revenue: 402.69 },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-900 text-blue-200'
      case 'preparing': return 'bg-yellow-900 text-yellow-200'
      case 'ready': return 'bg-green-900 text-green-200'
      case 'delivered': return 'bg-gray-700 text-gray-200'
      default: return 'bg-brown-700 text-brown-200'
    }
  }

  return (
    <div className="min-h-screen bg-brown-900">
      {/* Header */}
      <div className="bg-brown-800 border-b border-brown-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-brown-200 mt-1">
                Welcome back! Here&apos;s what&apos;s happening at SONNAS today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-brown-200 hover:text-amber-300">
                ← Back to Site
              </Link>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg">
                New Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {['overview', 'orders', 'menu', 'customers', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-amber-600 text-amber-300'
                    : 'border-transparent text-brown-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-brown-800 rounded-lg p-6 border border-brown-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-brown-300 text-sm font-medium">{stat.name}</h3>
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders & Top Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-brown-800 rounded-lg border border-brown-700">
                <div className="p-6 border-b border-brown-700">
                  <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{order.id}</p>
                          <p className="text-brown-300 text-sm">{order.customer} • {order.items} items</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">${order.total}</p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <span className="text-brown-400 text-xs">{order.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-amber-300 hover:text-amber-400 font-medium">
                    View All Orders
                  </button>
                </div>
              </div>

              {/* Top Menu Items */}
              <div className="bg-brown-800 rounded-lg border border-brown-700">
                <div className="p-6 border-b border-brown-700">
                  <h3 className="text-xl font-semibold text-white">Top Menu Items</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {topItems.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-brown-300 text-sm">{item.orders} orders</p>
                          </div>
                        </div>
                        <p className="text-amber-300 font-semibold">${item.revenue.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-amber-300 hover:text-amber-400 font-medium">
                    View Menu Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-brown-800 rounded-lg border border-brown-700">
            <div className="p-6 border-b border-brown-700">
              <h3 className="text-xl font-semibold text-white">Order Management</h3>
            </div>
            <div className="p-6">
              <p className="text-brown-300">Order management interface would go here...</p>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="bg-brown-800 rounded-lg border border-brown-700">
            <div className="p-6 border-b border-brown-700 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Menu Management</h3>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg">
                Add New Item
              </button>
            </div>
            <div className="p-6">
              <p className="text-brown-300">Menu management interface would go here...</p>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-brown-800 rounded-lg border border-brown-700">
            <div className="p-6 border-b border-brown-700">
              <h3 className="text-xl font-semibold text-white">Customer Management</h3>
            </div>
            <div className="p-6">
              <p className="text-brown-300">Customer management interface would go here...</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-brown-800 rounded-lg border border-brown-700">
            <div className="p-6 border-b border-brown-700">
              <h3 className="text-xl font-semibold text-white">Analytics & Reports</h3>
            </div>
            <div className="p-6">
              <p className="text-brown-300">Analytics dashboard would go here...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
