import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build query
    const queryObj: any = {};
    if (category) {
      queryObj.category = category;
    }
    if (query) {
      queryObj.$text = { $search: query };
    }

    // Build sort
    let sortObj: any = {};
    if (sort === 'price_asc') {
      sortObj.price = 1;
    } else if (sort === 'price_desc') {
      sortObj.price = -1;
    } else {
      sortObj.createdAt = -1; // Default sort by newest
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(queryObj)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(queryObj);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
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
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const productData = await request.json();
    const product = await Product.create(productData);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 