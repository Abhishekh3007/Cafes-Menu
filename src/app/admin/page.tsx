'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Define interfaces for our data structures
interface Stat {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
}

interface Order {
  _id: string;
  orderId: string;
  customerInfo: { name: string; mobile?: string };
  items: any[];
  total: number;
  status: 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'delivery' | 'takeaway';
  createdAt: string;
}

interface TopItem {
  name: string;
  orders: number;
  revenue: number;
}

// Helper to format time since an event
const timeSince = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<Stat[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [topItems, setTopItems] = useState<TopItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulated data - in production, fetch from your API endpoints
        const fetchedStats = [
          { name: 'Total Orders', value: '1,234', change: '+12%', changeType: 'increase' as const },
          { name: 'Revenue Today', value: '₹12,345', change: '+5%', changeType: 'increase' as const },
          { name: 'Active Menu Items', value: '45', change: '+2', changeType: 'increase' as const },
          { name: 'Avg. Rating', value: '4.8', change: '+0.2', changeType: 'increase' as const },
        ];
        const fetchedOrders: Order[] = [
          { _id: '1', orderId: 'ORD-001', customerInfo: { name: 'John Doe', mobile: '+919876543210' }, items: [{},{},{}], total: 45.99, status: 'preparing', orderType: 'delivery', createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
          { _id: '2', orderId: 'ORD-002', customerInfo: { name: 'Jane Smith', mobile: '+919876543211' }, items: [{},{}], total: 28.50, status: 'ready', orderType: 'takeaway', createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
          { _id: '3', orderId: 'ORD-003', customerInfo: { name: 'Mike Johnson', mobile: '+919876543212' }, items: [{},{},{},{},{}], total: 67.25, status: 'delivered', orderType: 'delivery', createdAt: new Date(Date.now() - 25 * 60000).toISOString() },
          { _id: '4', orderId: 'ORD-004', customerInfo: { name: 'Sarah Wilson', mobile: '+919876543213' }, items: [{}], total: 16.99, status: 'confirmed', orderType: 'takeaway', createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
        ];
        const fetchedTopItems = [
          { name: 'Grilled Salmon', orders: 45, revenue: 1304.55 },
          { name: 'Beef Wellington', orders: 23, revenue: 1057.77 },
          { name: 'Lobster Bisque', orders: 38, revenue: 645.62 },
          { name: 'Chocolate Soufflé', orders: 31, revenue: 402.69 },
        ];
        
        setStats(fetchedStats);
        setRecentOrders(fetchedOrders);
        setTopItems(fetchedTopItems);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-900 text-blue-200'
      case 'preparing': return 'bg-yellow-900 text-yellow-200'
      case 'ready': return 'bg-green-900 text-green-200'
      case 'delivered': return 'bg-gray-700 text-gray-200'
      case 'cancelled': return 'bg-red-900 text-red-200'
      default: return 'bg-brown-700 text-brown-200'
    }
  }

  const getOrderTypeIcon = (type: string) => {
    return type === 'delivery' ? '🚚' : '🏪'
  }

  const getOrderTypeColor = (type: string) => {
    return type === 'delivery' ? 'text-sky-300' : 'text-amber-300'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-900 flex items-center justify-center">
        <p className="text-amber-300 text-xl animate-pulse">Loading Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brown-900">
      {/* Header */}
      <div className="bg-brown-800 border-b border-brown-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <Link href="/" className="text-sm text-amber-300 hover:text-amber-400">
              View Live Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-brown-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['overview', 'orders', 'menu', 'customers', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-amber-400 text-amber-300'
                      : 'border-transparent text-brown-300 hover:text-white hover:border-brown-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-brown-800 rounded-lg p-6 border border-brown-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-brown-300">{stat.name}</p>
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

            {/* Recent Orders - Full Width for better focus */}
            <div className="bg-brown-800 rounded-lg border border-brown-700">
              <div className="p-6 border-b border-brown-700">
                <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 hover:bg-brown-700/50 rounded-md transition-colors">
                      <div className="flex items-center space-x-4">
                        <span className={`text-xl ${getOrderTypeColor(order.orderType)}`}>
                          {getOrderTypeIcon(order.orderType)}
                        </span>
                        <div>
                          <p className="text-white font-medium">{order.orderId}</p>
                          <p className="text-brown-300 text-sm">
                            {order.customerInfo.name} • {order.customerInfo.mobile} • {order.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹{order.total.toFixed(2)}</p>
                        <div className="flex items-center space-x-2 justify-end mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-brown-400 text-xs">{timeSince(new Date(order.createdAt))}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 text-amber-300 hover:text-amber-400 font-medium">
                  View All Orders
                </button>
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
              {/* Top Menu Items moved here for focused analysis */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Top Menu Items</h4>
                <div className="space-y-3">
                  {topItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-brown-900/50 rounded-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-amber-800 rounded-full flex items-center justify-center text-amber-200 text-sm font-bold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-brown-300 text-sm">{item.orders} orders</p>
                        </div>
                      </div>
                      <p className="text-amber-300 font-semibold">₹{item.revenue.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 text-amber-300 hover:text-amber-400 font-medium">
                  View Full Menu Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
