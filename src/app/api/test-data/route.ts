import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { createTestDataForUser, clearTestData } from '@/lib/testData'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action } = await request.json()
    
    if (action === 'create') {
      const success = await createTestDataForUser(user.id)
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Test data created successfully'
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to create test data'
        }, { status: 500 })
      }
    } else if (action === 'clear') {
      const success = await clearTestData(user.id)
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Test data cleared successfully'
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to clear test data'
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Test data API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
