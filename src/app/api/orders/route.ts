import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import type { Session as NextAuthSession } from 'next-auth';
import Product from '@/models/Product';

interface SessionUser {
  id: string;
  role: "user" | "admin";
}

interface CustomSession extends NextAuthSession {
  user: SessionUser;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as CustomSession;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to view orders.' },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .populate('products.product');

    return NextResponse.json(orders);
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
    const session = await getServerSession(authOptions) as CustomSession;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to create an order.' },
        { status: 401 }
      );
    }

    const data = await request.json();
    await connectDB();

    // Verify products exist and calculate total
    const productIds = data.products.map((item: { productId: string }) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 400 }
      );
    }

    const order = await Order.create({
      userId: session.user.id,
      products: data.products,
      total: data.total,
      status: 'pending'
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 