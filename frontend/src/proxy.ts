import { NextRequest, NextResponse } from 'next/server';

// Protect dashboard routes
export function proxy(request: NextRequest) {
  // Check if the user is trying to access the dashboard or dashboard subpages
  if (request.nextUrl.pathname.startsWith('/dam')) {
    // Get the authentication token from cookies or headers
    const token = request.cookies.get('access_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    // If no token exists, redirect to signin
    if (!token) {
      // Check if it's an API request (return 401) or page request (redirect)
      if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else {
        // For page requests, redirect to signin
        return NextResponse.redirect(new URL('/signin', request.url));
      }
    }
  }

  // Allow the request to proceed for unprotected routes
  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|_next|favicon.ico).*)',
  ],
};