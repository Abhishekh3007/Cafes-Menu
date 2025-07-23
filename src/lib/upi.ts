// UPI Payment utility functions
interface UpiPaymentParams {
  amount: number
  customerName: string
  orderId: string
  merchantId?: string
  merchantName?: string
}

export const generateUpiPaymentUrl = ({
  amount,
  customerName,
  orderId,
  merchantId = process.env.UPI_MERCHANT_ID || 'sonnas@upi',
  merchantName = process.env.UPI_MERCHANT_NAME || 'SONNAS Restaurant'
}: UpiPaymentParams): string => {
  // Format amount to 2 decimal places
  const formattedAmount = amount.toFixed(2)
  
  // Create transaction note
  const transactionNote = `Order for ${customerName}`
  
  // Create transaction reference
  const transactionRef = `ORD${orderId}${customerName.replace(/\s+/g, '').toUpperCase()}`
  
  // UPI URL parameters
  const upiParams = new URLSearchParams({
    pa: merchantId,              // Payee Address (UPI ID)
    pn: merchantName,           // Payee Name
    am: formattedAmount,        // Amount
    cu: 'INR',                  // Currency
    tn: transactionNote,        // Transaction Note
    tr: transactionRef          // Transaction Reference
  })
  
  return `upi://pay?${upiParams.toString()}`
}

export const generateMultipleUpiApps = (upiUrl: string) => {
  const baseUrl = upiUrl.replace('upi://pay?', '')
  
  return {
    generic: `upi://pay?${baseUrl}`,
    googlepay: `tez://upi/pay?${baseUrl}`,
    phonepe: `phonepe://upi/pay?${baseUrl}`,
    paytm: `paytmmp://upi/pay?${baseUrl}`,
    amazonpay: `amazoncamera://upi/pay?${baseUrl}`,
    bhim: `bhim://upi/pay?${baseUrl}`,
    whatsapp: `whatsapp://pay?${baseUrl}`
  }
}

export const openUpiApp = (upiUrl: string, appType: keyof ReturnType<typeof generateMultipleUpiApps> = 'generic') => {
  const upiApps = generateMultipleUpiApps(upiUrl)
  const selectedUrl = upiApps[appType]
  
  // Try to open the UPI app
  window.location.href = selectedUrl
  
  // Fallback: If app doesn't open, show the UPI URL for manual copying
  setTimeout(() => {
    const shouldShowFallback = confirm(
      'UPI app not found or failed to open. Would you like to copy the payment details?'
    )
    
    if (shouldShowFallback) {
      navigator.clipboard.writeText(selectedUrl).then(() => {
        alert('UPI payment URL copied to clipboard!')
      }).catch(() => {
        prompt('Copy this UPI payment URL:', selectedUrl)
      })
    }
  }, 3000)
}

export const isUpiSupported = (): boolean => {
  // Check if device supports UPI
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  
  // UPI is primarily supported on mobile devices in India
  return isMobile
}

export const validateUpiId = (upiId: string): boolean => {
  // Basic UPI ID validation pattern
  const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/
  return upiPattern.test(upiId)
}
