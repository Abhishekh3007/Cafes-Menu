# Razorpay Integration Setup Guide

## Overview
This guide will help you integrate Razorpay payment gateway into your SONNAS restaurant application.

## Prerequisites
1. Razorpay account (Sign up at [https://razorpay.com](https://razorpay.com))
2. Valid business documents for account verification

## Setup Steps

### 1. Get Razorpay Credentials
1. Login to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate API Keys if not already generated
4. Copy the `Key ID` and `Key Secret`

### 2. Configure Environment Variables
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Razorpay credentials to `.env.local`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   ```

   **Note**: 
   - Use `rzp_test_` prefix for test environment
   - Use `rzp_live_` prefix for production environment

### 3. Test the Integration

#### Test Mode Setup
1. Ensure you're using test API keys (starting with `rzp_test_`)
2. Use test card numbers provided by Razorpay:
   - **Success**: 4111 1111 1111 1111
   - **Failure**: 4111 1111 1111 1112
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date

#### Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Fill delivery address
4. Select "Online Payment"
5. Click "Place Order"
6. Complete payment in Razorpay modal
7. Verify order creation

### 4. Go Live
1. Complete KYC verification in Razorpay Dashboard
2. Replace test API keys with live API keys
3. Test with small amounts initially

## Supported Payment Methods
- Credit Cards (Visa, Mastercard, American Express, etc.)
- Debit Cards
- UPI (GPay, PhonePe, Paytm, etc.)
- Net Banking
- Wallets (Paytm, Airtel Money, JioMoney, etc.)
- EMI options

## Security Features
- PCI DSS compliant
- Payment signature verification
- Secure webhook handling
- Encrypted transactions

## Testing Credentials
- **Test Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **Test UPI ID**: success@razorpay
- **Test Wallet**: Use any test phone number

## Webhook Setup (Optional)
1. Go to Settings → Webhooks in Razorpay Dashboard
2. Add endpoint: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`

## Troubleshooting

### Common Issues
1. **Payment modal not opening**: Check if Razorpay script is loaded
2. **Invalid key_id error**: Verify environment variables
3. **Signature verification failed**: Check webhook secret

### Debug Mode
Add to your `.env.local` for debugging:
```env
RAZORPAY_DEBUG=true
```

## Support
- Razorpay Documentation: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- Razorpay Support: [https://razorpay.com/support/](https://razorpay.com/support/)

## API Endpoints Created
- `POST /api/payment/create-order` - Creates Razorpay order
- `POST /api/payment/verify` - Verifies payment signature
- `POST /api/orders` - Creates order after payment (updated to handle Razorpay)

## Components Updated
- `CheckoutPage` - Added online payment option
- `useRazorpay` hook - Handles payment flow
- `Order` API - Stores payment details

---

**Note**: Always test thoroughly in test mode before going live with real payments.
