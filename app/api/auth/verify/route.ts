import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const [user] = await db.select().from(users)
      .where(eq(users.verificationToken, token)).limit(1);

    if (!user) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.redirect(new URL('/login?verified=already', request.url));
    }

    await db.update(users).set({
      emailVerified: true,
      verificationToken: null,
    }).where(eq(users.id, user.id));

    return NextResponse.redirect(new URL('/login?verified=true', request.url));
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
