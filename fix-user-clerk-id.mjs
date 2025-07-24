import dbConnect from './src/lib/mongodb.js';
import User from './src/models/User.js';

async function fixUserClerkId() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: 'waliabhishek120@gmail.com' });
    
    if (user) {
      console.log('Found user:', {
        _id: user._id,
        email: user.email,
        name: user.name,
        clerkId: user.clerkId,
        loyaltyPoints: user.loyaltyPoints,
        totalOrders: user.totalOrders
      });

      // Update with clerkId if missing
      if (!user.clerkId) {
        const updatedUser = await User.findOneAndUpdate(
          { email: 'waliabhishek120@gmail.com' },
          { 
            clerkId: 'user_2zRSeNg0JRGV1OagIG8wlXBjpmt', // From the logs
            updatedAt: new Date()
          },
          { new: true }
        );
        console.log('✅ Updated user with clerkId:', updatedUser.clerkId);
      } else {
        console.log('✅ User already has clerkId:', user.clerkId);
      }
    } else {
      console.log('❌ No user found with that email');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixUserClerkId();
