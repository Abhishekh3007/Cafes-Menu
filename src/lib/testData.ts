import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'
import { awardLoyaltyPoints, updateOrderStatus } from '@/lib/dynamicLoyalty'

export async function createTestDataForUser(clerkUserId: string) {
  try {
    await dbConnect()
    
    // Find or create user
    let user = await User.findOne({ clerkId: clerkUserId })
    
    if (!user) {
      console.log('User not found, cannot create test data')
      return false
    }

    // Create test orders
    const testOrders = [
      {
        orderNumber: `ORD-${Date.now()}-1`,
        customer: user._id,
        items: [
          {
            name: 'Butter Chicken',
            quantity: 2,
            price: 320,
            customizations: []
          },
          {
            name: 'Garlic Naan',
            quantity: 3,
            price: 60,
            customizations: []
          }
        ],
        totalAmount: 820,
        status: 'delivered',
        orderType: 'delivery',
        paymentMethod: 'online',
        paymentStatus: 'paid',
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        deliveryDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        deliveryAddress: '123 Main St, City, State 12345'
      },
      {
        orderNumber: `ORD-${Date.now()}-2`,
        customer: user._id,
        items: [
          {
            name: 'Biryani',
            quantity: 1,
            price: 280,
            customizations: ['Extra Raita']
          }
        ],
        totalAmount: 280,
        status: 'delivered',
        orderType: 'delivery',
        paymentMethod: 'online',  
        paymentStatus: 'paid',
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        deliveryAddress: '123 Main St, City, State 12345'
      },
      {
        orderNumber: `ORD-${Date.now()}-3`,
        customer: user._id,
        items: [
          {
            name: 'Paneer Tikka',
            quantity: 1,
            price: 240,
            customizations: []
          }
        ],
        totalAmount: 240,
        status: 'preparing',
        orderType: 'delivery',
        paymentMethod: 'online',
        paymentStatus: 'paid',
        orderDate: new Date(),
        deliveryAddress: '123 Main St, City, State 12345'
      }
    ]

    // Create orders in database
    const createdOrders = await Order.insertMany(testOrders)
    
    // Award loyalty points for delivered orders
    let totalPointsAwarded = 0
    for (const order of createdOrders) {
      if (order.status === 'delivered') {
        await awardLoyaltyPoints({
          userId: clerkUserId,
          points: 10,
          reason: `Order delivered: #${order.orderNumber}`,
          orderId: order._id.toString()
        })
        totalPointsAwarded += 10
        
        // Update total orders count
        await User.findOneAndUpdate(
          { clerkId: clerkUserId },
          { $inc: { totalOrders: 1 } }
        )
      }
    }

    console.log(`✅ Created ${createdOrders.length} test orders`)
    console.log(`✅ Awarded ${totalPointsAwarded} loyalty points`)
    
    return true

  } catch (error) {
    console.error('Error creating test data:', error)
    return false
  }
}

export async function clearTestData(clerkUserId: string) {
  try {
    await dbConnect()
    
    const user = await User.findOne({ clerkId: clerkUserId })
    if (!user) return false

    // Delete test orders
    await Order.deleteMany({ customer: user._id })
    
    // Reset user stats
    await User.findOneAndUpdate(
      { clerkId: clerkUserId },
      { 
        loyaltyPoints: 0,
        totalOrders: 0
      }
    )
    
    console.log('✅ Cleared test data')
    return true

  } catch (error) {
    console.error('Error clearing test data:', error)
    return false
  }
}
