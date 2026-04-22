import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications } from '@/db/schema';
import { requireAdmin } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { userId, message } = body;

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ error: 'userId requerido' }, { status: 400 });
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const trimmed = message.trim();

    if (trimmed.length === 0) {
      return NextResponse.json({ error: 'Mensaje no puede estar vacío' }, { status: 400 });
    }

    if (trimmed.length > 500) {
      return NextResponse.json({ error: 'Mensaje demasiado largo (máx 500)' }, { status: 400 });
    }

    const [created] = await db
      .insert(notifications)
      .values({ userId, message: trimmed })
      .returning();

    return NextResponse.json({ notification: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}
