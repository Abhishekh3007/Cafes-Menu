import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Address from '@/models/Address'
import User from '@/models/User'

// GET - Fetch all addresses for user
export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    // Get user profile to get userId
    const userProfile = await User.findOne({ clerkId: user.id })
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    const addresses = await Address.find({ 
      clerkId: user.id 
    }).sort({ isDefault: -1, createdAt: -1 })

    return NextResponse.json({
      success: true,
      addresses
    })

  } catch (error) {
    console.error('Address fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      fullName,
      phone,
      street,
      city,
      state,
      zipCode,
      landmark,
      addressType,
      isDefault,
      coordinates,
      instructions
    } = body

    // Validate required fields
    if (!fullName || !phone || !street || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Get user profile
    const userProfile = await User.findOne({ clerkId: user.id })
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      await Address.updateMany(
        { clerkId: user.id },
        { isDefault: false }
      )
    }

    // If no addresses exist, make this one default
    const existingAddresses = await Address.countDocuments({ clerkId: user.id })
    const shouldBeDefault = isDefault || existingAddresses === 0

    const newAddress = new Address({
      userId: userProfile._id.toString(),
      clerkId: user.id,
      fullName,
      phone,
      street,
      city,
      state,
      zipCode,
      landmark,
      addressType: addressType || 'home',
      isDefault: shouldBeDefault,
      coordinates,
      instructions
    })

    await newAddress.save()

    return NextResponse.json({
      success: true,
      address: newAddress,
      message: 'Address added successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Address creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}

// PUT - Update address
export async function PUT(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { addressId, ...updateData } = body

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    // If setting as default, unset other default addresses
    if (updateData.isDefault) {
      await Address.updateMany(
        { clerkId: user.id, _id: { $ne: addressId } },
        { isDefault: false }
      )
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, clerkId: user.id },
      { ...updateData, updatedAt: new Date() },
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
      message: 'Address updated successfully'
    })

  } catch (error) {
    console.error('Address update error:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

// DELETE - Delete address
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    await dbConnect()

    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      clerkId: user.id
    })

    if (!deletedAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // If deleted address was default, make another address default
    if (deletedAddress.isDefault) {
      const remainingAddress = await Address.findOne({ clerkId: user.id })
      if (remainingAddress) {
        await Address.findByIdAndUpdate(remainingAddress._id, { isDefault: true })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Address deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
