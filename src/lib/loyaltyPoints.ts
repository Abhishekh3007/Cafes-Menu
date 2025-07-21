// Loyalty Points System for SONNAS Restaurant
// Rules:
// - 100 points = ₹2 discount
// - Minimum redemption: 1000 points = ₹20 discount
// - Can only redeem on bills ₹200 or above
// - Earn 100 points per 10 orders completed

export interface LoyaltyPointsCalculation {
  availablePoints: number
  redeemableAmount: number
  pointsToRedeem: number
  minimumBillForRedemption: number
  canRedeem: boolean
  remainingPointsAfterRedemption: number
}

export interface LoyaltyEarning {
  pointsEarned: number
  totalOrders: number
  totalPoints: number
  milestone?: string
}

export class LoyaltyPointsService {
  // Constants
  static readonly POINTS_PER_RUPEE = 100 / 2 // 100 points = ₹2
  static readonly MINIMUM_REDEMPTION_POINTS = 1000
  static readonly MINIMUM_BILL_FOR_REDEMPTION = 200
  static readonly POINTS_PER_ORDER_MILESTONE = 10 // Every 10 orders
  static readonly POINTS_EARNED_PER_MILESTONE = 100

  /**
   * Calculate how many points a customer can redeem and the discount amount
   */
  static calculateRedemption(
    availablePoints: number, 
    billAmount: number
  ): LoyaltyPointsCalculation {
    const canRedeem = availablePoints >= this.MINIMUM_REDEMPTION_POINTS && 
                     billAmount >= this.MINIMUM_BILL_FOR_REDEMPTION

    if (!canRedeem) {
      return {
        availablePoints,
        redeemableAmount: 0,
        pointsToRedeem: 0,
        minimumBillForRedemption: this.MINIMUM_BILL_FOR_REDEMPTION,
        canRedeem: false,
        remainingPointsAfterRedemption: availablePoints
      }
    }

    // Calculate maximum redeemable points (in chunks of 1000)
    const maxRedeemableChunks = Math.floor(availablePoints / this.MINIMUM_REDEMPTION_POINTS)
    const maxRedeemablePoints = maxRedeemableChunks * this.MINIMUM_REDEMPTION_POINTS
    const maxDiscountAmount = maxRedeemablePoints / this.POINTS_PER_RUPEE

    // Ensure discount doesn't exceed 50% of bill amount
    const maxAllowedDiscount = Math.floor(billAmount * 0.5)
    const actualDiscountAmount = Math.min(maxDiscountAmount, maxAllowedDiscount)
    const actualPointsToRedeem = actualDiscountAmount * this.POINTS_PER_RUPEE

    return {
      availablePoints,
      redeemableAmount: actualDiscountAmount,
      pointsToRedeem: actualPointsToRedeem,
      minimumBillForRedemption: this.MINIMUM_BILL_FOR_REDEMPTION,
      canRedeem: true,
      remainingPointsAfterRedemption: availablePoints - actualPointsToRedeem
    }
  }

  /**
   * Calculate points earned when completing an order
   */
  static calculatePointsEarning(currentTotalOrders: number): LoyaltyEarning {
    const newTotalOrders = currentTotalOrders + 1
    const currentMilestones = Math.floor(currentTotalOrders / this.POINTS_PER_ORDER_MILESTONE)
    const newMilestones = Math.floor(newTotalOrders / this.POINTS_PER_ORDER_MILESTONE)
    
    const pointsEarned = (newMilestones - currentMilestones) * this.POINTS_EARNED_PER_MILESTONE
    const totalPoints = newMilestones * this.POINTS_EARNED_PER_MILESTONE

    let milestone
    if (pointsEarned > 0) {
      milestone = `Congratulations! You've completed ${newTotalOrders} orders and earned ${pointsEarned} loyalty points!`
    }

    return {
      pointsEarned,
      totalOrders: newTotalOrders,
      totalPoints,
      milestone
    }
  }

  /**
   * Get loyalty tier based on total orders
   */
  static getLoyaltyTier(totalOrders: number): {
    tier: string
    color: string
    nextTierOrders?: number
    benefits: string[]
  } {
    if (totalOrders >= 100) {
      return {
        tier: 'PLATINUM',
        color: 'text-purple-400',
        benefits: ['20% bonus points', 'Free delivery', 'Priority support', 'Exclusive menu items']
      }
    } else if (totalOrders >= 50) {
      return {
        tier: 'GOLD',
        color: 'text-yellow-400',
        nextTierOrders: 100,
        benefits: ['15% bonus points', 'Free delivery on orders above ₹300', 'Priority support']
      }
    } else if (totalOrders >= 20) {
      return {
        tier: 'SILVER',
        color: 'text-gray-300',
        nextTierOrders: 50,
        benefits: ['10% bonus points', 'Free delivery on orders above ₹500']
      }
    } else if (totalOrders >= 10) {
      return {
        tier: 'BRONZE',
        color: 'text-orange-400',
        nextTierOrders: 20,
        benefits: ['5% bonus points', 'Birthday discount']
      }
    } else {
      return {
        tier: 'NEWCOMER',
        color: 'text-green-400',
        nextTierOrders: 10,
        benefits: ['Welcome bonus', 'First order discount']
      }
    }
  }

  /**
   * Format points for display
   */
  static formatPoints(points: number): string {
    return points.toLocaleString()
  }

  /**
   * Calculate discount percentage for display
   */
  static calculateDiscountPercentage(discount: number, billAmount: number): number {
    return Math.round((discount / billAmount) * 100)
  }
}
