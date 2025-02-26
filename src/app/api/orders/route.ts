import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { Session } from 'next-auth';
import dbConnect from '@/lib/dbConnect';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Session {
  user: SessionUser;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({ user: session.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    // Get user from request headers (set by middleware)
    const userStr = request.headers.get('user');
    if (!userStr) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userStr);
    const orderData = await request.json();

    // Validate and update product stock
    for (const item of orderData.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.product}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product.name}` },
          { status: 400 }
        );
      }

      // Update stock
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Create order
    const order = await Order.create({
      ...orderData,
      user: user.id,
      status: 'pending',
      paymentStatus: 'pending',
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 