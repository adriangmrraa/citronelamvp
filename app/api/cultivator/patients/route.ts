import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { solidaryCultivators, users } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await requireAuth();

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Check user is a cultivator
    const [user] = await db.select().from(users)
      .where(eq(users.id, session.userId)).limit(1);

    if (!user?.isCultivator) {
      return NextResponse.json({ error: 'No sos cultivador solidario' }, { status: 403 });
    }

    const assignments = await db.select({
      id: solidaryCultivators.id,
      patientId: users.id,
      patientUsername: users.username,
      patientEmail: users.email,
      patientPlanType: users.planType,
      status: solidaryCultivators.status,
      assignedAt: solidaryCultivators.createdAt,
    }).from(solidaryCultivators)
      .innerJoin(users, eq(solidaryCultivators.patientUserId, users.id))
      .where(and(
        eq(solidaryCultivators.cultivatorUserId, session.userId),
        eq(solidaryCultivators.status, 'active')
      ));

    return NextResponse.json({ patients: assignments });
  } catch (error) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
}
