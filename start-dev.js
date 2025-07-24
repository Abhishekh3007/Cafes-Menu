const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting SONNAS Development Server...');
console.log('📍 Project Directory:', __dirname);
console.log('⏰ Time:', new Date().toLocaleString());

// Change to project directory
process.chdir(path.resolve(__dirname));

// Start the development server
const devServer = exec('npm run dev', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error starting server:', error);
    return;
  }
});

devServer.stdout.on('data', (data) => {
  console.log(data.toString());
});

devServer.stderr.on('data', (data) => {
  console.error(data.toString());
});

devServer.on('close', (code) => {
  console.log(`🔚 Development server exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down development server...');
  devServer.kill('SIGINT');
  process.exit(0);
});

console.log(`
🌟 SONNAS Restaurant System Started!
📊 Features Available:
   ✅ Dynamic Profile Data (Real-time from database)
   ✅ Loyalty Points System (10 points per order)
   ✅ Order Tracking (Real-time status updates)
   ✅ User Authentication (Clerk integration)
   ✅ Menu Customization (Dynamic pricing)
   ✅ Mobile-Responsive Cart

🔗 Access your application at: http://localhost:3000
📱 Test on mobile by visiting: http://[YOUR-IP]:3000

Press Ctrl+C to stop the server.
`);
