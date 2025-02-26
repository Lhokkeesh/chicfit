import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Check if it's an API route that needs protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Skip auth routes and public routes
    if (
      request.nextUrl.pathname.startsWith('/api/auth/') ||
      request.nextUrl.pathname.startsWith('/api/products')
    ) {
      return NextResponse.next();
    }

    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user', JSON.stringify({
      id: token.id,
      email: token.email,
      name: token.name,
      role: token.role
    }));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 