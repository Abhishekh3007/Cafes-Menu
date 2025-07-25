import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Address from '@/models/Address'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const addressId = params.id

    await dbConnect()

    // First, unset all default addresses for this user
    await Address.updateMany(
      { clerkId: user.id },
      { isDefault: false }
    )

    // Set the specified address as default
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, clerkId: user.id },
      { isDefault: true },
      { new: true }
    )

    if (!updatedAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      address: updatedAddress,
      message: 'Default address updated successfully'
    })

  } catch (error) {
    console.error('Set default address error:', error)
    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    )
  }
}
