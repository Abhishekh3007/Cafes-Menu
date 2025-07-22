const twilio = require('twilio');

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('❌ Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables');
  console.log('\nExample:');
  console.log('set TWILIO_ACCOUNT_SID=your_account_sid');
  console.log('set TWILIO_AUTH_TOKEN=your_auth_token');
  console.log('node scripts/setup-twilio.js');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function createVerifyService() {
  try {
    console.log('Creating Twilio Verify Service...');
    
    const service = await client.verify.v2.services.create({
      friendlyName: 'SONNAS Restaurant OTP Service',
      codeLength: 6,
    });

    console.log('✅ Verify Service created successfully!');
    console.log('Service SID:', service.sid);
    console.log('Service Name:', service.friendlyName);
    
    console.log('\n📝 Update your .env.local file with:');
    console.log(`TWILIO_VERIFY_SERVICE_SID=${service.sid}`);
    
    return service.sid;
  } catch (error) {
    console.error('❌ Error creating Verify Service:', error.message);
    
    if (error.code === 20003) {
      console.log('\n💡 Authentication failed. Please check your Account SID and Auth Token.');
    } else if (error.code === 54007) {
      console.log('\n💡 Trial account limitation. You may need to verify your phone number first.');
    }
    
    throw error;
  }
}

// Run the setup
createVerifyService()
  .then((serviceSid) => {
    console.log('\n🎉 Twilio setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  });
