import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import MenuItem from '@/models/MenuItem'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const popular = searchParams.get('popular')
    const available = searchParams.get('available')

    let filter: any = {}
    
    if (category) {
      filter.category = category
    }
    
    if (popular === 'true') {
      filter.isPopular = true
    }
    
    if (available !== 'false') {
      filter.isAvailable = true
    }

    const menuItems = await MenuItem.find(filter).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: menuItems,
    })

  } catch (error) {
    console.error('Menu fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const menuItemData = await request.json()

    const menuItem = new MenuItem(menuItemData)
    await menuItem.save()

    return NextResponse.json({
      success: true,
      data: menuItem,
      message: 'Menu item created successfully',
    }, { status: 201 })

  } catch (error) {
    console.error('Menu creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}
