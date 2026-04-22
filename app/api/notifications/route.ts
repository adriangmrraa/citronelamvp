import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and, desc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const offset = (page - 1) * limit;

    const baseCondition = unreadOnly
      ? and(eq(notifications.userId, session.userId), eq(notifications.isRead, false))
      : eq(notifications.userId, session.userId);

    const [rows, unreadResult] = await Promise.all([
      db
        .select()
        .from(notifications)
        .where(baseCondition)
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(notifications)
        .where(and(eq(notifications.userId, session.userId), eq(notifications.isRead, false))),
    ]);

    const unreadCount = unreadResult[0]?.count ?? 0;

    return NextResponse.json({ notifications: rows, unreadCount, page, limit });
  } catch {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
}
