import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crops, cropLogs } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

const VALID_PHASES = ['Germinacion', 'Vegetacion', 'Floracion', 'Senescencia'] as const;

type RouteParams = { params: Promise<{ id: string; logId: string }> };

async function verifyCropOwnership(cropId: number, userId: number) {
  const [crop] = await db
    .select()
    .from(crops)
    .where(and(eq(crops.id, cropId), eq(crops.userId, userId)));
  return crop ?? null;
}

async function verifyLogBelongsToCrop(logId: number, cropId: number) {
  const [log] = await db
    .select()
    .from(cropLogs)
    .where(and(eq(cropLogs.id, logId), eq(cropLogs.cropId, cropId)));
  return log ?? null;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id, logId } = await params;
    const cropId = parseInt(id, 10);
    const logIdNum = parseInt(logId, 10);

    if (isNaN(cropId) || isNaN(logIdNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await verifyCropOwnership(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const log = await verifyLogBelongsToCrop(logIdNum, cropId);
    if (!log) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const {
      week, phase, ph, ec, grow, micro, bloom, notes,
      lightHours, nutrientsSolution, sanitaryNotes, preventives, imageUrl,
    } = body;

    if (phase && !VALID_PHASES.includes(phase)) {
      return NextResponse.json({ error: 'Fase fenológica inválida' }, { status: 400 });
    }
    if (ph !== undefined && (ph < 0 || ph > 14)) {
      return NextResponse.json({ error: 'pH debe estar entre 0 y 14' }, { status: 400 });
    }
    if (ec !== undefined && ec < 0) {
      return NextResponse.json({ error: 'EC no puede ser negativa' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (week !== undefined) updateData.week = week.trim();
    if (phase !== undefined) updateData.phase = phase;
    if (ph !== undefined) updateData.ph = ph;
    if (ec !== undefined) updateData.ec = ec;
    if (grow !== undefined) updateData.grow = grow;
    if (micro !== undefined) updateData.micro = micro;
    if (bloom !== undefined) updateData.bloom = bloom;
    if (notes !== undefined) updateData.notes = notes;
    if (lightHours !== undefined) updateData.lightHours = lightHours;
    if (nutrientsSolution !== undefined) updateData.nutrientsSolution = nutrientsSolution;
    if (sanitaryNotes !== undefined) updateData.sanitaryNotes = sanitaryNotes;
    if (preventives !== undefined) updateData.preventives = preventives;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const [updated] = await db
      .update(cropLogs)
      .set(updateData)
      .where(eq(cropLogs.id, logIdNum))
      .returning();

    return NextResponse.json({ log: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('PUT /api/crops/[id]/logs/[logId] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id, logId } = await params;
    const cropId = parseInt(id, 10);
    const logIdNum = parseInt(logId, 10);

    if (isNaN(cropId) || isNaN(logIdNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await verifyCropOwnership(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const log = await verifyLogBelongsToCrop(logIdNum, cropId);
    if (!log) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    await db.delete(cropLogs).where(eq(cropLogs.id, logIdNum));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('DELETE /api/crops/[id]/logs/[logId] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
