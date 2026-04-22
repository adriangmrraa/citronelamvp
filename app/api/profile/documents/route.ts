import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userDocuments } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await requireAuth();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const docs = await db.select().from(userDocuments)
      .where(eq(userDocuments.userId, session.userId))
      .orderBy(userDocuments.createdAt);
    return NextResponse.json({ documents: docs });
  } catch (error) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
}
