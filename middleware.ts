import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from './lib/session';

const publicRoutes = ['/', '/login', '/register', '/legal/terms', '/legal/privacy'];
const publicApiRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/verify', '/api/health'];
const adminRoutes = ['/admin', '/api/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith('/images/')) {
    return NextResponse.next();
  }

  // For API routes
  if (pathname.startsWith('/api/')) {
    if (publicApiRoutes.some(r => pathname.startsWith(r))) {
      return NextResponse.next();
    }

    const cookieValue = request.cookies.get('session')?.value;
    if (!cookieValue) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const session = await decrypt(cookieValue);
    if (!session) {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }

    // Admin routes check
    if (adminRoutes.some(r => pathname.startsWith(r))) {
      if (session.role !== 'ADMIN' && session.role !== 'STAFF') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
      }
    }

    return NextResponse.next();
  }

  // For protected pages — redirect to login if no session
  const cookieValue = request.cookies.get('session')?.value;
  if (!cookieValue) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const session = await decrypt(cookieValue);
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin page access
  if (pathname.startsWith('/admin')) {
    if (session.role !== 'ADMIN' && session.role !== 'STAFF') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)'],
};
