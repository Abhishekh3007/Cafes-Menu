// Simple Twilio test and setup
async function testTwilioAndCreateService() {
  try {
    const twilio = require('twilio');
    
    // Use environment variables for credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.error('❌ Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables');
      return;
    }

    const client = twilio(accountSid, authToken);
    
    console.log('Testing Twilio connection...');
    
    // First test the account
    const account = await client.api.accounts.list({ limit: 1 });
    console.log('✅ Twilio account connection successful');
    
    // Create verify service
    console.log('Creating Verify Service...');
    const service = await client.verify.v2.services.create({
      friendlyName: 'SONNAS Restaurant OTP'
    });
    
    console.log('✅ Verify Service Created!');
    console.log('Service SID:', service.sid);
    console.log('Add this to your .env.local:');
    console.log(`TWILIO_VERIFY_SERVICE_SID=${service.sid}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
  }
}

testTwilioAndCreateService();
