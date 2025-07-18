import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Reservation from '@/models/Reservation'

export async function POST(request: Request) {
  await dbConnect()

  try {
    const body = await request.json()
    const { name, phone, email, date, time, guests, notes } = body

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const newReservation = new Reservation({
      name,
      phone,
      email,
      date,
      time,
      guests,
      notes,
    })

    await newReservation.save()

    return NextResponse.json(newReservation, { status: 201 })
  } catch (error) {
    console.error('Reservation API Error:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
