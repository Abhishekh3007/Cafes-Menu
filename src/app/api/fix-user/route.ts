import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // Find existing user by email
    const existingUser = await User.findOne({ 
      email: user.emailAddresses?.[0]?.emailAddress 
    });

    if (existingUser) {
      console.log('🔄 Found existing user, updating with clerkId')
      
      // Update existing user with clerkId
      const updatedUser = await User.findOneAndUpdate(
        { email: user.emailAddresses?.[0]?.emailAddress },
        { 
          clerkId: user.id,
          name: user.firstName || user.username || existingUser.name,
          phone: user.phoneNumbers?.[0]?.phoneNumber || existingUser.phone,
          updatedAt: new Date()
        },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: 'User updated with clerkId',
        user: {
          _id: updatedUser._id,
          clerkId: updatedUser.clerkId,
          email: updatedUser.email,
          name: updatedUser.name,
          loyaltyPoints: updatedUser.loyaltyPoints,
          totalOrders: updatedUser.totalOrders
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'No existing user found with that email'
      });
    }

  } catch (error) {
    console.error('Fix user error:', error);
    return NextResponse.json(
      { error: 'Failed to fix user' },
      { status: 500 }
    );
  }
}
