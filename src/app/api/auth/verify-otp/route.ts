import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/twilio'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp, name, email, dateOfBirth, gender } = await request.json()

    // Validate input
    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, message: 'Mobile number and OTP are required' },
        { status: 400 }
      )
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid 10-digit mobile number' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid 6-digit OTP' },
        { status: 400 }
      )
    }

    // Verify OTP with Twilio
    const verificationResult = await verifyOTP(mobile, otp)

    if (!verificationResult.success || !verificationResult.isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Connect to database
    await dbConnect()

    // Find user by mobile number
    let user = await User.findOne({ mobile })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please send OTP first.' },
        { status: 404 }
      )
    }

    // Check if this is a new user (no name set) and basic info is provided
    const isNewUser = !user.name || user.name === ''
    
    // Update user verification status
    user.isVerified = true
    user.lastLogin = new Date()
    
    // If this is a new user or updating profile, update the fields
    if (name && name.trim()) {
      user.name = name.trim()
    }
    
    if (email && email.trim()) {
      user.email = email.trim()
    }
    
    if (dateOfBirth) {
      user.dateOfBirth = new Date(dateOfBirth)
    }
    
    if (gender) {
      user.gender = gender
    }

    // Check if profile is complete
    user.profileComplete = !!(
      user.name &&
      user.email &&
      user.dateOfBirth &&
      user.gender
    )

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        mobile: user.mobile,
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      isNewUser,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        totalOrders: user.totalOrders,
        isVerified: user.isVerified,
        profileComplete: user.profileComplete,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address
      }
    })

    // Set HTTP-only cookie with the token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    })

    return response

  } catch (error: any) {
    console.error('Verify OTP Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}