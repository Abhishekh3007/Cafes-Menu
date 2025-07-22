import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json()

    if (!mobile) {
      return NextResponse.json(
        { success: false, message: 'Mobile number is required' },
        { status: 400 }
      )
    }

    // Clean and normalize mobile number
    const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '')
    const normalizedMobile = cleanMobile.replace(/^(\+91|91)/, '')

    // Connect to database
    await dbConnect()

    // Check if user exists and is manually verified
    const user = await User.findOne({ 
      mobile: normalizedMobile,
      isVerified: true,
      verificationMethod: 'manual'
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'This number is not pre-verified. Please use OTP login.' },
        { status: 404 }
      )
    }

    // Return user data for direct login
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        mobile: user.mobile,
        name: user.name || 'User',
        isVerified: user.isVerified,
        role: user.role || 'customer'
      }
    })

  } catch (error: any) {
    console.error('Direct login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
