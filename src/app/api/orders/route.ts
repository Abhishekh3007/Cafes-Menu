import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'
import MenuItem from '@/models/MenuItem'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    let filter: any = {}
    
    if (userId) {
      filter.customer = userId
    }
    
    if (status) {
      filter.status = status
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: orders,
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
    
    const orderData = await request.json()
    const { items, customer, orderType, deliveryAddress, paymentMethod, specialInstructions, discount } = orderData

    // Calculate total amount
    let totalAmount = 0
    const processedItems = []

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem)
      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menuItem} not found` },
          { status: 400 }
        )
      }
      
      if (!menuItem.isAvailable) {
        return NextResponse.json(
          { error: `${menuItem.name} is currently unavailable` },
          { status: 400 }
        )
      }

      const itemTotal = menuItem.price * item.quantity
      totalAmount += itemTotal

      processedItems.push({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: menuItem.price,
        specialInstructions: item.specialInstructions,
      })
    }

    // Apply discount if provided
    if (discount && discount.code) {
      if (discount.type === 'percentage') {
        totalAmount = totalAmount * (1 - discount.value / 100)
      } else if (discount.type === 'fixed') {
        totalAmount = Math.max(0, totalAmount - discount.value)
      }
    }

    // Calculate estimated delivery time (30-60 minutes)
    const estimatedDeliveryTime = new Date()
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 45)

    const order = new Order({
      customer,
      items: processedItems,
      totalAmount,
      orderType,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      discount,
      estimatedDeliveryTime,
    })

    await order.save()

    // Populate the order for response
    await order.populate('customer', 'name email phone')
    await order.populate('items.menuItem', 'name price image')

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order placed successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
