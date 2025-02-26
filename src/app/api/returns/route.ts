import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Return from '@/models/Return';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: Request) {
  try {
    await connectDB();
    console.log('Connected to database');

    // Check authentication
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Return request data:', data);

    const { items, shippingMethod } = data;

    // Validate required fields
    if (!items?.length || !shippingMethod) {
      return NextResponse.json(
        { error: 'Please provide items and shipping method' },
        { status: 400 }
      );
    }

    // Create return request
    const returnRequest = await Return.create({
      user: session.user.id,
      items,
      shippingMethod,
      status: 'pending'
    });

    console.log('Created return request:', returnRequest);

    // Send confirmation email
    try {
      await sendEmail({
        to: session.user.email!,
        subject: 'Return Request Confirmation - ChicFit',
        text: `Dear ${session.user.name},\n\nYour return request has been received. Return Request ID: ${returnRequest._id}\n\nWe will review your request and get back to you shortly.\n\nBest regards,\nChicFit Team`,
        html: `
          <h1>Return Request Confirmation</h1>
          <p>Dear ${session.user.name},</p>
          <p>We have received your return request. Our team will review it shortly.</p>
          <p><strong>Return Request ID:</strong> ${returnRequest._id}</p>
          <h2>Items to Return:</h2>
          <ul>
            ${items.map((item: any) => `
              <li>
                ${item.name} (Size: ${item.size})
                <br>Reason: ${item.reason}
              </li>
            `).join('')}
          </ul>
          <p><strong>Shipping Method:</strong> ${shippingMethod}</p>
          <h2>Next Steps:</h2>
          <ol>
            <li>We will review your return request within 1-2 business days.</li>
            <li>Once approved, we will send you a return shipping label via email.</li>
            <li>Package your items securely and attach the shipping label.</li>
            <li>Drop off your package at the specified carrier location.</li>
          </ol>
          <p>You can track your return status at any time by visiting your account dashboard.</p>
          <br>
          <p>Best regards,</p>
          <p>ChicFit Team</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: 'Return request submitted successfully',
      id: returnRequest._id
    });
  } catch (error: any) {
    console.error('Return request error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit return request' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get return ID from query params if provided
    const { searchParams } = new URL(request.url);
    const returnId = searchParams.get('id');

    let returnRequest;
    if (returnId) {
      // Get specific return request
      returnRequest = await Return.findOne({
        _id: returnId,
        user: session.user.id
      });

      if (!returnRequest) {
        return NextResponse.json(
          { error: 'Return request not found' },
          { status: 404 }
        );
      }
    } else {
      // Get all return requests for user
      returnRequest = await Return.find({ user: session.user.id })
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(returnRequest);
  } catch (error: any) {
    console.error('Return fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch return requests' },
      { status: 500 }
    );
  }
} 