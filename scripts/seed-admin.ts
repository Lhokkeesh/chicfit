import { connectDB } from '../src/lib/db';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    await connectDB();
    console.log('Connected to database');

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    // Check if admin exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user exists, updating password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      await User.updateOne(
        { email: adminEmail },
        { 
          $set: { 
            password: hashedPassword,
            role: 'admin'
          } 
        }
      );
    } else {
      console.log('Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
    }

    console.log('Admin user setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin user:', error);
    process.exit(1);
  }
}

seedAdmin(); 