import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { mobile, action } = await request.json()

    if (!mobile || !action) {
      return NextResponse.json(
        { success: false, message: 'Mobile number and action are required' },
        { status: 400 }
      )
    }

    // Connect to database
    await dbConnect()

    if (action === 'verify') {
      // Manually verify a phone number (admin function)
      let user = await User.findOne({ mobile })
      
      if (!user) {
        // Create user if doesn't exist
        user = new User({
          mobile,
          name: 'Manual Verification',
          isVerified: true,
          verificationMethod: 'manual',
          role: 'customer'
        })
      } else {
        user.isVerified = true
        user.verificationMethod = 'manual'
      }
      
      await user.save()
      
      return NextResponse.json({
        success: true,
        message: `Phone number ${mobile} has been manually verified`,
        user: user
      })
    }

    if (action === 'list') {
      // List all verified numbers
      const verifiedUsers = await User.find({ isVerified: true }).select('mobile name verificationMethod')
      
      return NextResponse.json({
        success: true,
        verifiedNumbers: verifiedUsers
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Admin verify error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect()
    
    // List all verified numbers
    const verifiedUsers = await User.find({ isVerified: true }).select('mobile name verificationMethod createdAt')
    
    return NextResponse.json({
      success: true,
      verifiedNumbers: verifiedUsers
    })

  } catch (error: any) {
    console.error('Admin get error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
