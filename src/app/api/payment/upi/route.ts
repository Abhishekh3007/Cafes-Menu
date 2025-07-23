import { NextRequest, NextResponse } from 'next/server'
import { generateUpiPaymentUrl, generateMultipleUpiApps } from '@/lib/upi'

export async function POST(request: NextRequest) {
  try {
    const { amount, customerName, orderId, preferredApp } = await request.json()

    // Validate required fields
    if (!amount || !customerName || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, customerName, orderId' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Generate UPI payment URL
    const upiUrl = generateUpiPaymentUrl({
      amount,
      customerName,
      orderId
    })

    // Generate app-specific URLs
    const upiApps = generateMultipleUpiApps(upiUrl)

    return NextResponse.json({
      success: true,
      data: {
        upiUrl,
        upiApps,
        preferredUrl: preferredApp ? upiApps[preferredApp as keyof typeof upiApps] : upiUrl,
        qrCodeData: upiUrl, // This can be used to generate QR code
        paymentDetails: {
          merchantId: process.env.UPI_MERCHANT_ID || 'sonnas@upi',
          merchantName: process.env.UPI_MERCHANT_NAME || 'SONNAS Restaurant',
          amount: amount.toFixed(2),
          currency: 'INR',
          orderId,
          customerName,
          transactionNote: `Order for ${customerName}`,
          transactionRef: `ORD${orderId}${customerName.replace(/\s+/g, '').toUpperCase()}`
        }
      }
    })

  } catch (error) {
    console.error('UPI payment generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate UPI payment details' },
      { status: 500 }
    )
  }
}
