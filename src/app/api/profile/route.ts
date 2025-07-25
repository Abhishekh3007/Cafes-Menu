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
      // Check if user exists by email (for migration from old system)
      const existingUser = await User.findOne({ email: user.emailAddresses?.[0]?.emailAddress })
      
      if (existingUser) {
        console.log('🔄 Found existing user by email, updating with clerkId')
        // Update existing user with clerkId
        userProfile = await User.findOneAndUpdate(
          { email: user.emailAddresses?.[0]?.emailAddress },
          { 
            clerkId: user.id,
            name: user.firstName || user.username || existingUser.name,
            phone: user.phoneNumbers?.[0]?.phoneNumber || existingUser.phone,
            updatedAt: new Date()
          },
          { new: true }
        )
        console.log('✅ Updated existing user with clerkId')
      } else {
        console.log('🆕 Creating new user profile')
        // Create new user profile with basic info
        try {
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
        } catch (error: any) {
          if (error.code === 11000) {
            // Handle duplicate key error by finding the existing user
            console.log('⚠️ Duplicate key error, finding existing user')
            userProfile = await User.findOne({ 
              $or: [
                { email: user.emailAddresses?.[0]?.emailAddress },
                { clerkId: user.id }
              ]
            })
            
            if (userProfile && !userProfile.clerkId) {
              // Update with clerkId if missing
              userProfile = await User.findOneAndUpdate(
                { _id: userProfile._id },
                { clerkId: user.id },
                { new: true }
              )
            }
          } else {
            throw error
          }
        }
      }
    }

    const profile = {
      _id: userProfile._id,
      clerkId: userProfile.clerkId,
      email: userProfile.email,
      name: userProfile.name,
      phone: userProfile.phone,
      dateOfBirth: userProfile.dateOfBirth,
      gender: userProfile.gender,
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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch profile'
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        errorMessage = 'Profile already exists with this email'
      } else if (error.message.includes('MONGODB_URI')) {
        errorMessage = 'Database connection error'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
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
    const { name, phone, dateOfBirth, gender } = body

    await dbConnect()

    // Prepare update object
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null
    if (gender !== undefined) updateData.gender = gender || null

    const userProfile = await User.findOneAndUpdate(
      { clerkId: user.id },
      updateData,
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
        dateOfBirth: userProfile.dateOfBirth,
        gender: userProfile.gender,
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
