import { NextRequest, NextResponse } from 'next/server'
import { sendOTP } from '@/lib/twilio'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json()

    console.log('Received mobile number:', mobile)

    // Validate mobile number - accept various formats
    if (!mobile) {
      return NextResponse.json(
        { success: false, message: 'Mobile number is required' },
        { status: 400 }
      )
    }

    // Clean the mobile number (remove spaces, hyphens, etc.)
    const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '')
    
    // Accept formats: 9876543210, +919876543210, 919876543210
    const mobileRegex = /^(\+91|91)?[6-9]\d{9}$/
    
    if (!mobileRegex.test(cleanMobile)) {
      console.log('Invalid mobile format:', cleanMobile)
      return NextResponse.json(
        { success: false, message: 'Please provide a valid Indian mobile number (10 digits starting with 6-9)' },
        { status: 400 }
      )
    }

    // Extract just the 10-digit number for database storage
    const normalizedMobile = cleanMobile.replace(/^(\+91|91)/, '')
    console.log('Normalized mobile:', normalizedMobile)

    // Connect to database
    await dbConnect()

    // Check if user exists with this mobile number
    let user = await User.findOne({ mobile: normalizedMobile })
    let isNewUser = false

    if (!user) {
      // Create a new user record (will be completed after OTP verification)
      user = new User({
        mobile: normalizedMobile,
        name: '', // Will be set after OTP verification
        isVerified: false,
        verificationMethod: 'otp'
      })
      await user.save()
      isNewUser = true
    }

    // Check if user is already manually verified
    if (user.isVerified && user.verificationMethod === 'manual') {
      return NextResponse.json({
        success: true,
        message: 'This number is pre-verified. You can login directly.',
        isPreVerified: true,
        userId: user._id
      })
    }

    // Send OTP using Twilio (use the original mobile number format)
    console.log('Sending OTP to:', mobile)
    const otpResult = await sendOTP(mobile)

    if (!otpResult.success) {
      console.log('Twilio error:', otpResult.message)
      return NextResponse.json(
        { success: false, message: otpResult.message },
        { status: 500 }
      )
    }

    console.log('OTP sent successfully to:', normalizedMobile)
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      isNewUser,
      userId: user._id
    })

  } catch (error: any) {
    console.error('Send OTP Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}