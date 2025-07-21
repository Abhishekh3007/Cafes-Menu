import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { LoyaltyPointsService } from '@/lib/loyaltyPoints'

// GET /api/loyalty - Get user's loyalty points information
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const mobile = searchParams.get('mobile')
    const billAmount = searchParams.get('billAmount')

    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ mobile })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const loyaltyTier = LoyaltyPointsService.getLoyaltyTier(user.totalOrders)
    
    let redemptionInfo = null
    if (billAmount) {
      redemptionInfo = LoyaltyPointsService.calculateRedemption(
        user.loyaltyPoints,
        parseFloat(billAmount)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        loyaltyPoints: user.loyaltyPoints,
        totalOrders: user.totalOrders,
        loyaltyTier,
        redemptionInfo,
        formattedPoints: LoyaltyPointsService.formatPoints(user.loyaltyPoints)
      }
    })

  } catch (error) {
    console.error('Loyalty points fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch loyalty points' },
      { status: 500 }
    )
  }
}

// POST /api/loyalty - Redeem loyalty points
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { mobile, pointsToRedeem, billAmount } = await request.json()

    if (!mobile || !pointsToRedeem || !billAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ mobile })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate redemption
    const redemptionInfo = LoyaltyPointsService.calculateRedemption(
      user.loyaltyPoints,
      billAmount
    )

    if (!redemptionInfo.canRedeem) {
      return NextResponse.json(
        { error: 'Cannot redeem points. Check minimum requirements.' },
        { status: 400 }
      )
    }

    if (pointsToRedeem > redemptionInfo.pointsToRedeem) {
      return NextResponse.json(
        { error: 'Cannot redeem more points than available for this bill amount' },
        { status: 400 }
      )
    }

    // Ensure points are redeemed in chunks of 1000
    if (pointsToRedeem % LoyaltyPointsService.MINIMUM_REDEMPTION_POINTS !== 0) {
      return NextResponse.json(
        { error: 'Points must be redeemed in chunks of 1000' },
        { status: 400 }
      )
    }

    // Calculate discount
    const discountAmount = pointsToRedeem / LoyaltyPointsService.POINTS_PER_RUPEE

    // Update user's loyalty points
    user.loyaltyPoints -= pointsToRedeem
    await user.save()

    return NextResponse.json({
      success: true,
      data: {
        pointsRedeemed: pointsToRedeem,
        discountAmount,
        remainingPoints: user.loyaltyPoints,
        message: `Successfully redeemed ${pointsToRedeem} points for ₹${discountAmount} discount!`
      }
    })

  } catch (error) {
    console.error('Loyalty points redemption error:', error)
    return NextResponse.json(
      { error: 'Failed to redeem loyalty points' },
      { status: 500 }
    )
  }
}

// PUT /api/loyalty - Award loyalty points (called when order is completed)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    const { mobile } = await request.json()

    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ mobile })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate points earning
    const earningInfo = LoyaltyPointsService.calculatePointsEarning(user.totalOrders)

    // Update user's loyalty points and total orders
    user.loyaltyPoints += earningInfo.pointsEarned
    user.totalOrders = earningInfo.totalOrders
    await user.save()

    const loyaltyTier = LoyaltyPointsService.getLoyaltyTier(user.totalOrders)

    return NextResponse.json({
      success: true,
      data: {
        pointsEarned: earningInfo.pointsEarned,
        totalPoints: user.loyaltyPoints,
        totalOrders: user.totalOrders,
        loyaltyTier,
        milestone: earningInfo.milestone,
        message: earningInfo.pointsEarned > 0 
          ? `Congratulations! You earned ${earningInfo.pointsEarned} loyalty points!`
          : 'Order completed successfully!'
      }
    })

  } catch (error) {
    console.error('Loyalty points award error:', error)
    return NextResponse.json(
      { error: 'Failed to award loyalty points' },
      { status: 500 }
    )
  }
}
