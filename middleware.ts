import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession, decrypt } from './lib/session';

// Routes that don't require auth
const publicRoutes = ['/', '/login', '/register'];
const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/health'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For API routes
  if (pathname.startsWith('/api/')) {
    // Allow public API routes
    if (publicApiRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    
    // Check session for protected API routes
    const cookieStore = request.cookies.get('session')?.value;
    
    if (!cookieStore) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const session = await decrypt(cookieStore);
    
    if (!session) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};