import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, tokenTransactions } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    const userId = parseInt(params.id);
    const body = await request.json();
    const { amount } = body;

    if (isNaN(userId) || !amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'ID y cantidad válida requeridos' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    await db.update(users).set({
      tokens: sql`${users.tokens} + ${amount}`,
    }).where(eq(users.id, userId));

    await db.insert(tokenTransactions).values({
      userId,
      amount,
      reason: 'admin_grant',
      performedBy: session.userId,
    });

    return NextResponse.json({
      message: `${amount} tokens asignados`,
      newBalance: (user.tokens || 0) + amount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}
