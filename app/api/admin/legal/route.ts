import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { legalContents } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const contents = await db.select().from(legalContents);
    return NextResponse.json({ contents });
  } catch (error) {
    console.error('GET /api/admin/legal error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { type, terms } = body;

    if (!type || typeof type !== 'string' || type.trim().length === 0) {
      return NextResponse.json({ error: 'Tipo requerido' }, { status: 400 });
    }
    if (!terms || typeof terms !== 'string' || terms.trim().length === 0) {
      return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 });
    }

    // Check if existing record for this type
    const [existing] = await db
      .select()
      .from(legalContents)
      .where(eq(legalContents.type, type))
      .limit(1);

    let content;
    if (existing) {
      [content] = await db
        .update(legalContents)
        .set({ terms, updatedAt: new Date() })
        .where(eq(legalContents.type, type))
        .returning();
    } else {
      [content] = await db
        .insert(legalContents)
        .values({ type, terms })
        .returning();
    }

    return NextResponse.json({ content });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('PUT /api/admin/legal error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
