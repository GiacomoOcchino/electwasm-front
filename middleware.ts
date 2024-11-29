import { NextResponse, type NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';

  // If the user is not authenticated and tries to access protected pages
  if (!isAuthenticated && (request.nextUrl.pathname === '/admin')) {
    // Redirect to home if not authenticated
    return NextResponse.redirect(new URL('/unauthorized', request.url));
    // return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access when authenticated or on non-secure pages
  return NextResponse.next();
}

// Specify on which paths to enable the middleware
export const config = {
  matcher: ['/((?!api|_next).*)'],
};