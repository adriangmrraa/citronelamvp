import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications, users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq } from 'drizzle-orm';

type BroadcastTarget = 'all' | 'verified' | 'cultivators' | 'admins';

const VALID_TARGETS: BroadcastTarget[] = ['all', 'verified', 'cultivators', 'admins'];

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { target, message } = body;

    if (!target || !VALID_TARGETS.includes(target as BroadcastTarget)) {
      return NextResponse.json(
        { error: 'Target inválido: debe ser all, verified, cultivators o admins' },
        { status: 400 }
      );
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

    // Query users by target filter
    let targetUsers: { id: number }[] = [];

    switch (target as BroadcastTarget) {
      case 'all':
        targetUsers = await db.select({ id: users.id }).from(users);
        break;
      case 'verified':
        targetUsers = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.isVerified, true));
        break;
      case 'cultivators':
        targetUsers = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.isCultivator, true));
        break;
      case 'admins':
        targetUsers = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.role, 'ADMIN'));
        break;
    }

    if (targetUsers.length === 0) {
      return NextResponse.json({ sent: 0 });
    }

    // Insert one notification per matching user
    await db.insert(notifications).values(
      targetUsers.map((u) => ({ userId: u.id, message: trimmed }))
    );

    return NextResponse.json({ sent: targetUsers.length });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}
