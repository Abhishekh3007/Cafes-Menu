# Twilio OTP Setup Guide

This guide will help you set up Twilio OTP functionality for the SONNAS restaurant app.

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com/)
2. A phone number verified with Twilio
3. Twilio Verify Service configured

## Step 1: Create Twilio Account

1. Go to https://www.twilio.com/ and sign up for a free account
2. Verify your email and phone number
3. Complete the account setup process

## Step 2: Get Account Credentials

1. Go to the Twilio Console: https://console.twilio.com/
2. From the dashboard, copy:
   - **Account SID**
   - **Auth Token**

## Step 3: Create Verify Service

1. In the Twilio Console, go to **Verify** → **Services**
2. Click **Create new Service**
3. Give it a name (e.g., "SONNAS OTP")
4. Copy the **Service SID**

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_VERIFY_SERVICE_SID=your_service_sid_here
```

## Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/otp-login` in your browser
3. Enter a valid mobile number (must be verified in Twilio for trial accounts)
4. You should receive an OTP SMS

## Important Notes

### Trial Account Limitations

- **Trial accounts** can only send OTP to verified phone numbers
- To send to any number, you need to upgrade to a paid plan
- Trial accounts include $15 credit

### Phone Number Format

- The app automatically formats numbers to international format (+91 for India)
- Users enter 10-digit numbers (e.g., 9876543210)
- The system converts to +919876543210

### Testing with Trial Account

1. Go to **Phone Numbers** → **Manage** → **Verified Caller IDs** in Twilio Console
2. Add your test phone numbers here
3. These numbers will receive OTP during development

## Production Deployment

### Upgrade Twilio Account

1. Go to **Billing** in Twilio Console
2. Add payment method
3. This removes the verified number restriction

### Add Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the Twilio variables

## API Endpoints

The OTP system uses these endpoints:

- `POST /api/auth/send-otp` - Send OTP to mobile number
- `POST /api/auth/verify-otp` - Verify OTP and login/register user

## Security Features

- **Rate limiting**: Prevents spam OTP requests
- **Expiration**: OTPs expire after 10 minutes
- **Format validation**: Validates Indian mobile numbers
- **Automatic cleanup**: Invalid OTP attempts are handled gracefully

## Troubleshooting

### Common Issues

1. **"Invalid phone number"**
   - Ensure the number is in correct format
   - For trial accounts, verify the number in Twilio Console

2. **"Service not found"**
   - Check your TWILIO_VERIFY_SERVICE_SID
   - Ensure the Verify service is active

3. **"Authentication failed"**
   - Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
   - Check for any extra spaces in environment variables

### Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Twilio Console shows the Verify service
- [ ] Test phone number is verified (for trial accounts)
- [ ] Application starts without errors
- [ ] OTP SMS is received
- [ ] OTP verification works

## Features Implemented

### User Experience

- **Auto-focus**: Automatically moves to next OTP input field
- **Auto-submit**: Submits form when all 6 digits are entered
- **Resend timer**: 30-second cooldown for resend OTP
- **Error handling**: Clear error messages for invalid OTP

### Backend Logic

- **User creation**: Creates user record on first OTP request
- **Verification status**: Tracks user verification state
- **JWT tokens**: Issues secure tokens after verification
- **Database integration**: Stores user data in MongoDB

## Cost Considerations

### Twilio Pricing (as of 2024)

- **Verify API**: ~$0.05 per verification
- **Free trial**: $15 credit included
- **Monthly estimates**: 
  - 100 logins/month = ~$5
  - 1000 logins/month = ~$50

### Optimization Tips

- Cache user sessions to reduce re-authentication
- Implement remember me functionality
- Use OTP only for new users, password for returning users

## Support

If you encounter issues:

1. Check the Twilio Console logs
2. Review the application logs
3. Verify environment variables
4. Check network connectivity

For Twilio-specific issues, refer to their documentation: https://www.twilio.com/docs/verify
