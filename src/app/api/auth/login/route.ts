import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { mobile, password } = await request.json()

    if (!mobile || !password) {
      return NextResponse.json(
        { error: 'Mobile number and password are required' },
        { status: 400 }
      )
    }

    // Find user by mobile number
    const user = await User.findOne({ mobile }).select('+password')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      phone: user.phone,
      address: user.address,
    }

    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
