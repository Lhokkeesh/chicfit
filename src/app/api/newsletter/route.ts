import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.subscribed) {
        return NextResponse.json(
          { error: 'Email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Resubscribe if previously unsubscribed
        existingSubscription.subscribed = true;
        existingSubscription.subscribedAt = new Date();
        existingSubscription.unsubscribedAt = undefined;
        await existingSubscription.save();
        return NextResponse.json({ message: 'Successfully resubscribed to newsletter' });
      }
    }

    // Create new subscription
    await Newsletter.create({ email });

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    // Only allow admin users to get the list (you should add proper authentication)
    const subscribers = await Newsletter.find({ subscribed: true })
      .sort({ subscribedAt: -1 });

    return NextResponse.json({ subscribers });
  } catch (error: any) {
    console.error('Newsletter fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const subscription = await Newsletter.findOne({ email });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Soft delete by marking as unsubscribed
    subscription.subscribed = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    return NextResponse.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    );
  }
} 