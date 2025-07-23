#!/usr/bin/env node

// Vercel Environment Setup Script
// Run this to ensure all environment variables are properly set

const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'MONGODB_URI',
  'JWT_SECRET',
  'NEXTAUTH_SECRET'
];

console.log('🔍 Checking environment variables...\n');

let missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.log('\n🚨 Missing environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n📝 Please add these to your Vercel project settings.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are present!');
  console.log('🚀 Ready for deployment!');
}
