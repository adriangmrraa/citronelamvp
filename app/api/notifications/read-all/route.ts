import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { and, eq } from 'drizzle-orm';

export async function POST() {
  try {
    const session = await requireAuth();

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, session.userId),
          eq(notifications.isRead, false)
        )
      );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
}
