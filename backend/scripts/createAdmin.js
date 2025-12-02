const mongoose = require('mongoose');
const User = require('../src/models/User'); // Changed path
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/medicollab'
    );

    console.log('📦 Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@medicollab.com' });
    
    if (adminExists) {
      console.log('❌ Admin already exists!');
      console.log('📧 Email: admin@medicollab.com');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@medicollab.com',
      password: 'Admin@123',
      role: 'ADMIN',
      phone: '9999999999',
      isVerified: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@medicollab.com');
    console.log('🔑 Password: Admin@123');
    console.log('🔐 Role: ADMIN');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();