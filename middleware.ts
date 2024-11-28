import { NextResponse, type NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';

  // Se l'utente non è autenticato e prova ad accedere alle pagine protette
  if (!isAuthenticated && (request.nextUrl.pathname === '/admin')) {
    // Reindirizza alla home se non autenticato
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Consenti l'accesso se autenticato o su pagine non protette
  return NextResponse.next();
}

// Specifica su quali percorsi attivare il middleware
export const config = {
  matcher: ['/((?!api|_next).*)'],
};