import { connectDB } from '../src/lib/db';
import User from '../src/models/User';
import bcrypt from 'bcryptjs';

async function resetPassword() {
  try {
    await connectDB();
    console.log('Connected to database');

    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.error('Please provide email and new password');
      process.exit(1);
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    console.log('Password reset successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
}

resetPassword(); 