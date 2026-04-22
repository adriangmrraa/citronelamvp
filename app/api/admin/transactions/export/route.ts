import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tokenTransactions, users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const transactions = await db
      .select({
        id: tokenTransactions.id,
        username: users.username,
        amount: tokenTransactions.amount,
        reason: tokenTransactions.reason,
        createdAt: tokenTransactions.createdAt,
      })
      .from(tokenTransactions)
      .leftJoin(users, eq(tokenTransactions.userId, users.id))
      .orderBy(desc(tokenTransactions.createdAt));

    const header = 'id,username,amount,reason,date\n';
    const rows = transactions
      .map((t) => {
        const date = t.createdAt ? new Date(t.createdAt).toISOString() : '';
        const username = (t.username ?? '').replace(/,/g, ' ');
        const reason = (t.reason ?? '').replace(/,/g, ' ');
        return `${t.id},${username},${t.amount},${reason},${date}`;
      })
      .join('\n');

    const csv = header + rows;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="transactions.csv"',
      },
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('GET /api/admin/transactions/export error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
