import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let serviceId = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken) {
  throw new Error('Twilio Account SID and Auth Token are required');
}

const client = twilio(accountSid, authToken);

// Function to create or get Verify Service
async function getOrCreateVerifyService(): Promise<string> {
  try {
    console.log('Getting or creating Twilio Verify Service...');
    console.log('Current serviceId:', serviceId);
    
    // If we have a service ID and it's not a placeholder, use it
    if (serviceId && serviceId !== 'create_new_service' && serviceId.startsWith('VA')) {
      console.log('Using configured service ID:', serviceId);
      return serviceId;
    }

    console.log('Listing existing Twilio services...');
    // Try to list existing services first
    const services = await client.verify.v2.services.list();
    
    if (services.length > 0) {
      // Use the first existing service
      console.log('Using existing Twilio Verify Service:', services[0].sid);
      serviceId = services[0].sid; // Cache it
      return services[0].sid;
    }

    // Create a new service if none exists
    console.log('Creating new Twilio Verify Service...');
    const service = await client.verify.v2.services.create({
      friendlyName: 'SONNAS Restaurant OTP Service',
      codeLength: 6,
    });
    
    console.log('Created Twilio Verify Service:', service.sid);
    serviceId = service.sid; // Cache it
    return service.sid;
  } catch (error: any) {
    console.error('Error managing Verify Service:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status
    });
    throw new Error(`Failed to setup Verify Service: ${error.message}`);
  }
}

export interface OTPResponse {
  success: boolean;
  message: string;
  sid?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  isValid?: boolean;
}

export const sendOTP = async (phoneNumber: string): Promise<OTPResponse> => {
  try {
    console.log('sendOTP called with:', phoneNumber);
    
    // Get or create the verify service
    const verifyServiceId = await getOrCreateVerifyService();
    console.log('Using verify service:', verifyServiceId);
    
    // Format phone number to international format
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    console.log('Formatted phone number:', formattedPhone);
    
    console.log('Sending verification request to Twilio...');
    const verification = await client.verify.v2
      .services(verifyServiceId)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms'
      });

    console.log('Twilio response:', verification.status, verification.sid);
    
    return {
      success: true,
      message: 'OTP sent successfully',
      sid: verification.sid
    };
  } catch (error: any) {
    console.error('Twilio SMS Error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      status: error.status,
      moreInfo: error.moreInfo
    });
    return {
      success: false,
      message: error.message || 'Failed to send OTP'
    };
  }
};

export const verifyOTP = async (phoneNumber: string, otpCode: string): Promise<VerifyOTPResponse> => {
  try {
    // Get or create the verify service
    const verifyServiceId = await getOrCreateVerifyService();
    
    // Format phone number to international format
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    
    const verificationCheck = await client.verify.v2
      .services(verifyServiceId)
      .verificationChecks.create({
        to: formattedPhone,
        code: otpCode
      });

    return {
      success: true,
      message: verificationCheck.status === 'approved' ? 'OTP verified successfully' : 'Invalid OTP',
      isValid: verificationCheck.status === 'approved'
    };
  } catch (error: any) {
    console.error('Twilio Verify Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to verify OTP',
      isValid: false
    };
  }
};

export default client;