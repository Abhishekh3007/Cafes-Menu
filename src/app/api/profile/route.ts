import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectToDatabase()

    // Find or create user profile
    let user = await User.findOne({ clerkId: userId })
    
    if (!user) {
      // Create new user profile with basic info
      user = new User({
        clerkId: userId,
        email: '',
        name: 'User',
        phone: '',
        loyaltyPoints: 0,
        totalOrders: 0,
        joinedDate: new Date()
      })
      
      await user.save()
    }

    const profile = {
      _id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      loyaltyPoints: user.loyaltyPoints || 0,
      totalOrders: user.totalOrders || 0,
      joinedDate: user.joinedDate,
      membershipTier: getTierFromPoints(user.loyaltyPoints || 0)
    }

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
    await dbConnect()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    const updateData = await request.json()
    
    // Remove fields that shouldn't be updated via this endpoint
    delete updateData.mobile
    delete updateData.password
    delete updateData.role
    delete updateData.loyaltyPoints
    delete updateData.totalOrders
    delete updateData.isVerified

    // Convert date string to Date object if provided
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth)
    }

    // Mark profile as complete if basic fields are filled
    const profileComplete = !!(
      updateData.name &&
      updateData.email &&
      updateData.dateOfBirth &&
      updateData.gender
    )

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { 
        ...updateData,
        profileComplete,
        lastLogin: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
