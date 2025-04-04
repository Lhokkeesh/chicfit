import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import type { Session as NextAuthSession } from 'next-auth';
import { CreateOrderData } from '@/types/order';

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

    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product');

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
    const session = await getServerSession(authOptions) as CustomSession;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to create an order.' },
        { status: 401 }
      );
    }

    const data = await request.json() as CreateOrderData;
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!data.shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify products exist and calculate total
    const productIds = data.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 400 }
      );
    }

    // Create order items with product references
    const orderItems = data.items.map(item => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      totalAmount: data.total,
      shippingAddress: data.shippingAddress,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'card',
    });

    // Populate the product details in the response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product')
      .populate('user', 'name email');

    return NextResponse.json({
      orderId: order._id,
      order: populatedOrder,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
} 