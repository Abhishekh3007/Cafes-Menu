import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Orders API called')
    const user = await currentUser()
    
    if (!user) {
      console.log('❌ No user found in Clerk for orders')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ Clerk user found for orders:', user.id)

    await dbConnect()
    console.log('✅ MongoDB connected for orders')
    
    // Find the user's MongoDB document to get their ObjectId
    const userProfile = await User.findOne({ clerkId: user.id })
    console.log('🔍 User profile for orders:', userProfile ? userProfile._id : 'Not found')
    
    if (!userProfile) {
      console.log('⚠️ No user profile found, returning empty orders')
      return NextResponse.json({
        success: true,
        orders: [],
      })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let filter: any = {
      customer: userProfile._id
    }
    
    if (status) {
      filter.status = status
    }

    console.log('🔍 Orders filter:', filter)

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 })

    console.log('📊 Orders found:', orders.length)

    return NextResponse.json({
      success: true,
      orders: orders,
    })

  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const {
      items,
      orderType,
      deliveryAddress,
      customerInfo,
      paymentMethod,
      paymentId,
      razorpayOrderId,
      upiId,
      total,
      deliveryFee,
      finalTotal,
      orderDate
    } = await request.json()

    // Validate required fields
    if (!items || !orderType || !paymentMethod || !total || !finalTotal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate type-specific requirements
    if (orderType === 'delivery' && !deliveryAddress) {
      return NextResponse.json(
        { error: 'Delivery address is required for delivery orders' },
        { status: 400 }
      )
    }

    if (orderType === 'takeaway' && !customerInfo) {
      return NextResponse.json(
        { error: 'Customer information is required for takeaway orders' },
        { status: 400 }
      )
    }

    // Generate unique order number
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    const orderNumber = `SONNAS-${timestamp}-${random}`.toUpperCase()

    // Calculate estimated time based on order type
    const estimatedTime = new Date()
    if (orderType === 'delivery') {
      estimatedTime.setMinutes(estimatedTime.getMinutes() + 45) // 45 minutes for delivery
    } else {
      estimatedTime.setMinutes(estimatedTime.getMinutes() + 25) // 25 minutes for takeaway
    }

    // Create order items (simplified - without referencing MenuItem)
    const orderItems = items.map((item: any) => ({
      menuItem: null,
      quantity: item.quantity,
      price: item.price,
      specialInstructions: `${item.name} - ${item.image}`
    }))

    // Prepare special instructions based on payment method and order type
    let specialInstructions = ''
    if (paymentMethod === 'cod') {
      specialInstructions = orderType === 'delivery' ? 'Cash on Delivery' : 'Cash on Pickup'
    } else if (paymentMethod === 'upi') {
      specialInstructions = `UPI ID: ${upiId}`
    } else if (paymentMethod === 'online') {
      specialInstructions = `Online Payment - Payment ID: ${paymentId}`
    }

    // Prepare delivery address or customer info based on order type
    let orderDeliveryAddress = null
    let customerContact = ''

    if (orderType === 'delivery') {
      orderDeliveryAddress = {
        street: `${deliveryAddress.address}, ${deliveryAddress.landmark || ''}`,
        city: deliveryAddress.city,
        state: 'India',
        zipCode: deliveryAddress.pincode,
        instructions: `Contact: ${deliveryAddress.fullName}, Phone: ${deliveryAddress.phone}`
      }
      customerContact = `${deliveryAddress.fullName} - ${deliveryAddress.phone}`
    } else {
      specialInstructions += ` | Customer: ${customerInfo.fullName}, Phone: ${customerInfo.phone}`
      customerContact = `${customerInfo.fullName} - ${customerInfo.phone}`
    }

    // Create new order
    const newOrder = new Order({
      orderNumber,
      customer: null, // Will be linked to user later
      items: orderItems,
      totalAmount: finalTotal,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentMethod: paymentMethod === 'online' ? 'online' : paymentMethod,
      orderType: orderType,
      deliveryAddress: orderDeliveryAddress,
      estimatedDeliveryTime: estimatedTime,
      specialInstructions: `${specialInstructions} | ${customerContact}`,
      paymentDetails: paymentMethod === 'online' ? {
        paymentId,
        razorpayOrderId
      } : undefined
    })

    const savedOrder = await newOrder.save()

    return NextResponse.json({
      success: true,
      orderId: orderNumber,
      orderType: orderType,
      estimatedTime: estimatedTime,
      message: orderType === 'delivery' 
        ? 'Order placed successfully! Your food will be delivered in 45 minutes.' 
        : 'Order placed successfully! Your food will be ready for pickup in 25 minutes.'
    })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
