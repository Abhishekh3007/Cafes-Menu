import { NextRequest, NextResponse } from 'next/server'

// Password-based login is disabled - use OTP login instead
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Password-based login is no longer supported. Please use OTP login.',
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
