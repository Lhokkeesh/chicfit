import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch all counts
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalContacts,
      recentOrders,
      recentUsers
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Contact.countDocuments(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id totalAmount status createdAt'),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id name email createdAt')
    ]);

    return NextResponse.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalContacts,
      recentOrders,
      recentUsers
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 