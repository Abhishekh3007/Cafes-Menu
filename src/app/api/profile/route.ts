import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Profile API called')
    
    // Use currentUser() which works without middleware protection
    const user = await currentUser()
    
    if (!user) {
      console.log('❌ No user found in Clerk')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ Clerk user found:', user.id)

    await dbConnect()
    console.log('✅ MongoDB connected')

    // Find or create user profile
    let userProfile = await User.findOne({ clerkId: user.id })
    console.log('🔍 User profile query result:', userProfile ? 'Found' : 'Not found')
    
    if (!userProfile) {
      console.log('🆕 Creating new user profile')
      // Create new user profile with basic info
      userProfile = new User({
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || '',
        name: user.firstName || user.username || 'User',
        phone: user.phoneNumbers?.[0]?.phoneNumber || '',
        loyaltyPoints: 0,
        totalOrders: 0,
        joinedDate: new Date(),
        mobile: user.phoneNumbers?.[0]?.phoneNumber || '' // Required field
      })
      
      await userProfile.save()
      console.log('✅ New user profile created')
    }

    const profile = {
      _id: userProfile._id,
      clerkId: userProfile.clerkId,
      email: userProfile.email,
      name: userProfile.name,
      phone: userProfile.phone,
      loyaltyPoints: userProfile.loyaltyPoints || 0,
      totalOrders: userProfile.totalOrders || 0,
      joinedDate: userProfile.joinedDate,
      membershipTier: getTierFromPoints(userProfile.loyaltyPoints || 0)
    }

    console.log('📊 Profile data:', profile)

    return NextResponse.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone } = body

    await dbConnect()

    const userProfile = await User.findOneAndUpdate(
      { clerkId: user.id },
      { 
        name: name || undefined,
        phone: phone || undefined,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: {
        _id: userProfile._id,
        clerkId: userProfile.clerkId,
        email: userProfile.email,
        name: userProfile.name,
        phone: userProfile.phone,
        loyaltyPoints: userProfile.loyaltyPoints || 0,
        totalOrders: userProfile.totalOrders || 0,
        joinedDate: userProfile.joinedDate,
        membershipTier: getTierFromPoints(userProfile.loyaltyPoints || 0)
      }
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

function getTierFromPoints(points: number): string {
  if (points >= 5000) return 'Platinum Member'
  if (points >= 2000) return 'Gold Member'
  if (points >= 500) return 'Silver Member'
  return 'Bronze Member'
}
