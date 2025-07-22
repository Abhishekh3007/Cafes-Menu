const twilio = require('twilio');

// Use environment variables for credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('❌ Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function listOrCreateVerifyService() {
  try {
    console.log('🔍 Checking existing Verify Services...');
    
    // List existing services
    const services = await client.verify.v2.services.list();
    
    if (services.length > 0) {
      console.log('✅ Found existing Verify Service(s):');
      services.forEach((service, index) => {
        console.log(`${index + 1}. ${service.friendlyName} (SID: ${service.sid})`);
      });
      
      // Use the first one
      const serviceSid = services[0].sid;
      console.log(`\n🎯 Using service: ${serviceSid}`);
      console.log(`\nUpdate your .env.local file with:`);
      console.log(`TWILIO_VERIFY_SERVICE_SID=${serviceSid}`);
      return serviceSid;
    } else {
      console.log('📝 No existing Verify Services found. Creating new one...');
      
      const service = await client.verify.v2.services.create({
        friendlyName: 'SONNAS Restaurant OTP Service',
        codeLength: 6
      });
      
      console.log('✅ New Verify Service created!');
      console.log(`Service SID: ${service.sid}`);
      console.log(`\nUpdate your .env.local file with:`);
      console.log(`TWILIO_VERIFY_SERVICE_SID=${service.sid}`);
      return service.sid;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 20003) {
      console.log('💡 Authentication failed - please verify your Account SID and Auth Token');
    }
    throw error;
  }
}

listOrCreateVerifyService()
  .then(() => {
    console.log('\n🎉 Twilio setup completed!');
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error.message);
  });
