import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { name, mobile, password, phone, address } = await request.json()

    if (!name || !mobile || !password) {
      return NextResponse.json(
        { error: 'Name, mobile number, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobile })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this mobile number' },
        { status: 400 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const user = new User({
      name,
      mobile,
      password: hashedPassword,
      phone: mobile, // Use mobile as phone as well
      address,
      role: 'customer',
    })

    await user.save()

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
      message: 'Registration successful',
      user: userResponse,
      token,
    }, { status: 201 })

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
