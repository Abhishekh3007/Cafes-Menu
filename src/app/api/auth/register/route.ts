import { NextRequest, NextResponse } from 'next/server'

// Password-based registration is disabled - use OTP login instead
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Password-based registration is no longer supported. Please use OTP login.',
      message: 'Registration happens automatically when you login with OTP for the first time.',
      redirectTo: '/login'
    },
    { status: 410 } // Gone
  )
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'This endpoint is disabled. Use OTP authentication at /login',
      redirectTo: '/login'
    },
    { status: 410 }
  )
}
