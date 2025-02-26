import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { sendEmail } from '@/lib/sendgrid';

export async function POST(request: Request) {
  try {
    await connectDB();

    const data = await request.json();
    const { name, email, orderNumber, inquiryType, message } = data;
    console.log('Contact form data:', data); // Debug log

    // Validate required fields
    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Create contact submission
    const contact = await Contact.create({
      name,
      email,
      orderNumber,
      inquiryType,
      message,
      status: 'pending'
    });

    console.log('Created contact:', contact); // Debug log

    // Send confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'We received your message - ChicFit Support',
        text: `Dear ${name},\n\nThank you for contacting us. We have received your message and will get back to you as soon as possible.\n\nBest regards,\nChicFit Support Team`,
        html: `
          <h1>Thank You for Contacting Us</h1>
          <p>Dear ${name},</p>
          <p>We have received your message regarding ${inquiryType.toLowerCase()}. Our team will review your inquiry and get back to you as soon as possible.</p>
          <p>Your reference number is: ${contact._id}</p>
          <br>
          <p>Best regards,</p>
          <p>ChicFit Support Team</p>
        `,
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      message: 'Message sent successfully', 
      id: contact._id 
    });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    return NextResponse.json({ contacts });
  } catch (error: any) {
    console.error('Contact fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
} 