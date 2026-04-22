import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userDocuments } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const userId = parseInt(params.id);

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const docs = await db.select().from(userDocuments)
      .where(eq(userDocuments.userId, userId))
      .orderBy(userDocuments.createdAt);

    return NextResponse.json({ documents: docs });
  } catch (error) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    const userId = parseInt(params.id);
    const body = await request.json();
    const { name, url, type } = body;

    if (!name || !url || !type) {
      return NextResponse.json({ error: 'name, url y type son requeridos' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const [doc] = await db.insert(userDocuments).values({
      userId,
      name,
      url,
      type,
      uploadedBy: session.userId,
    }).returning();

    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}
