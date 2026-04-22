import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crops, cropLogs } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and, desc } from 'drizzle-orm';

const VALID_PHASES = ['Germinacion', 'Vegetacion', 'Floracion', 'Senescencia'] as const;

type RouteParams = { params: Promise<{ id: string }> };

async function verifyCropOwnership(cropId: number, userId: number) {
  const [crop] = await db
    .select()
    .from(crops)
    .where(and(eq(crops.id, cropId), eq(crops.userId, userId)));
  return crop ?? null;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const cropId = parseInt(id, 10);

    if (isNaN(cropId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await verifyCropOwnership(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const logs = await db
      .select()
      .from(cropLogs)
      .where(eq(cropLogs.cropId, cropId))
      .orderBy(desc(cropLogs.createdAt));

    return NextResponse.json({ logs });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/crops/[id]/logs error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const cropId = parseInt(id, 10);

    if (isNaN(cropId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await verifyCropOwnership(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const {
      week, phase, ph, ec, grow, micro, bloom, notes,
      lightHours, nutrientsSolution, sanitaryNotes, preventives, imageUrl,
    } = body;

    if (!week || week.trim().length === 0) {
      return NextResponse.json({ error: 'Semana requerida' }, { status: 400 });
    }
    if (phase && !VALID_PHASES.includes(phase)) {
      return NextResponse.json({ error: 'Fase fenológica inválida' }, { status: 400 });
    }
    if (ph !== undefined && (ph < 0 || ph > 14)) {
      return NextResponse.json({ error: 'pH debe estar entre 0 y 14' }, { status: 400 });
    }
    if (ec !== undefined && ec < 0) {
      return NextResponse.json({ error: 'EC no puede ser negativa' }, { status: 400 });
    }

    const [created] = await db
      .insert(cropLogs)
      .values({
        week: week.trim(),
        phase: phase ?? 'Vegetacion',
        ph: ph ?? null,
        ec: ec ?? null,
        grow: grow ?? 0,
        micro: micro ?? 0,
        bloom: bloom ?? 0,
        notes: notes ?? null,
        lightHours: lightHours ?? null,
        nutrientsSolution: nutrientsSolution ?? null,
        sanitaryNotes: sanitaryNotes ?? null,
        preventives: preventives ?? null,
        imageUrl: imageUrl ?? null,
        cropId,
      })
      .returning();

    return NextResponse.json({ log: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/crops/[id]/logs error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
