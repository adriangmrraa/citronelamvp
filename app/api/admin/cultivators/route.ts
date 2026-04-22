import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { solidaryCultivators, users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, and, sql } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const cultivators = await db.select({
      id: solidaryCultivators.id,
      cultivatorUserId: solidaryCultivators.cultivatorUserId,
      patientUserId: solidaryCultivators.patientUserId,
      status: solidaryCultivators.status,
      createdAt: solidaryCultivators.createdAt,
    }).from(solidaryCultivators)
      .orderBy(solidaryCultivators.createdAt);

    return NextResponse.json({ cultivators });
  } catch (error) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { cultivatorUserId, patientUserId } = body;

    if (!cultivatorUserId || !patientUserId) {
      return NextResponse.json(
        { error: 'cultivatorUserId y patientUserId son requeridos' },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Check cultivator exists and isCultivator
    const [cultivator] = await db.select().from(users)
      .where(and(eq(users.id, cultivatorUserId), eq(users.isCultivator, true))).limit(1);

    if (!cultivator) {
      return NextResponse.json(
        { error: 'El usuario no es un cultivador solidario' },
        { status: 400 }
      );
    }

    // Check max 3 patients per cultivator
    const existing = await db.select({ count: sql<number>`count(*)` })
      .from(solidaryCultivators)
      .where(and(
        eq(solidaryCultivators.cultivatorUserId, cultivatorUserId),
        eq(solidaryCultivators.status, 'active')
      ));

    if (existing[0] && Number(existing[0].count) >= 3) {
      return NextResponse.json(
        { error: 'El cultivador ya tiene 3 pacientes asignados (máximo permitido)' },
        { status: 400 }
      );
    }

    const [assignment] = await db.insert(solidaryCultivators).values({
      cultivatorUserId,
      patientUserId,
    }).returning();

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error: any) {
    if (error?.code === '23505') {
      return NextResponse.json(
        { error: 'Este paciente ya está asignado a este cultivador' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}
