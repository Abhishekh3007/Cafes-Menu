import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Order from '@/models/Order'

export interface LoyaltyUpdate {
  userId: string
  points: number
  reason: string
  orderId?: string
}

export async function awardLoyaltyPoints(update: LoyaltyUpdate): Promise<boolean> {
  try {
    await dbConnect()
    
    const user = await User.findOneAndUpdate(
      { clerkId: update.userId },
      { 
        $inc: { loyaltyPoints: update.points },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    )

    if (!user) {
      console.error('User not found for loyalty points update:', update.userId)
      return false
    }

    console.log(`✅ Awarded ${update.points} loyalty points to user ${user.name} (${user.email})`)
    console.log(`   Reason: ${update.reason}`)
    console.log(`   New total: ${user.loyaltyPoints} points`)
    
    return true

  } catch (error) {
    console.error('Error awarding loyalty points:', error)
    return false
  }
}

export async function updateOrderStatus(orderId: string, status: string, clerkUserId?: string): Promise<boolean> {
  try {
    await dbConnect()
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        updatedAt: new Date(),
        ...(status === 'delivered' && { deliveryDate: new Date() })
      },
      { new: true }
    )

    if (!order) {
      console.error('Order not found:', orderId)
      return false
    }

    // Award loyalty points when order is delivered (10 points per order)
    if (status === 'delivered' && clerkUserId) {
      await awardLoyaltyPoints({
        userId: clerkUserId,
        points: 10,
        reason: `Order delivered: #${order.orderNumber}`,
        orderId: order._id.toString()
      })

      // Increment total orders count
      await User.findOneAndUpdate(
        { clerkId: clerkUserId },
        { $inc: { totalOrders: 1 } }
      )
    }

    console.log(`✅ Order ${order.orderNumber} status updated to: ${status}`)
    return true

  } catch (error) {
    console.error('Error updating order status:', error)
    return false
  }
}

export function getTierFromPoints(points: number): string {
  if (points >= 5000) return 'Platinum Member'
  if (points >= 2000) return 'Gold Member' 
  if (points >= 500) return 'Silver Member'
  return 'Bronze Member'
}

export function getPointsToNextTier(points: number): number {
  if (points < 500) return 500 - points
  if (points < 2000) return 2000 - points
  if (points < 5000) return 5000 - points
  return 0
}

export function calculateRewardsAvailable(points: number): number {
  // 1 reward for every 100 points
  return Math.floor(points / 100)
}
