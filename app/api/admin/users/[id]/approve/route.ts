import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, tokenTransactions } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: 'El usuario no ha verificado su email' }, { status: 400 });
    }

    const INITIAL_TOKENS = 300;

    await db.update(users).set({
      isVerified: true,
      tokens: INITIAL_TOKENS,
    }).where(eq(users.id, userId));

    await db.insert(tokenTransactions).values({
      userId,
      amount: INITIAL_TOKENS,
      reason: 'subscription_approval',
      performedBy: session.userId,
    });

    return NextResponse.json({ message: 'Usuario aprobado', tokens: INITIAL_TOKENS });
  } catch (error) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}
