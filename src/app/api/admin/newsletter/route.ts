import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const subscribers = await Newsletter.find()
      .sort({ subscribedAt: -1 });

    return NextResponse.json({ subscribers });
  } catch (error: any) {
    console.error('Newsletter subscribers fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
} 