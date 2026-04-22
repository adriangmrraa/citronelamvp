import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tokenTransactions, users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)));
    const offset = (page - 1) * limit;

    const transactions = await db
      .select({
        id: tokenTransactions.id,
        userId: tokenTransactions.userId,
        username: users.username,
        amount: tokenTransactions.amount,
        reason: tokenTransactions.reason,
        relatedOrderId: tokenTransactions.relatedOrderId,
        performedBy: tokenTransactions.performedBy,
        createdAt: tokenTransactions.createdAt,
      })
      .from(tokenTransactions)
      .leftJoin(users, eq(tokenTransactions.userId, users.id))
      .orderBy(desc(tokenTransactions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ transactions, page, limit });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('GET /api/admin/transactions error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
