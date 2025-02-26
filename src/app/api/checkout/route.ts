import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { sendEmail, emailTemplates } from '@/lib/sendgrid';

interface CustomSession {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, totalAmount, shippingAddress, paymentMethod } = body;

    await connectDB();

    // Validate items and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
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

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      });
    }

    // Create order with simulated payment success
    const order = await Order.create({
      user: session.user.id,
      items: orderItems,
      totalAmount: total,
      shippingAddress,
      paymentMethod,
      status: 'processing',
      paymentStatus: 'paid', // Simulate successful payment
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Send confirmation email
    try {
      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'name email')
        .populate('items.product', 'name price image');

      if (shippingAddress.email) {
        await sendEmail({
          to: shippingAddress.email,
          ...emailTemplates.orderConfirmation(populatedOrder),
        });
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the order if email fails
    }

    // Return simulated payment success
    return NextResponse.json({
      orderId: order._id,
      clientSecret: 'mock_client_secret_for_development',
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 