import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crops, labReports } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and, desc } from 'drizzle-orm';

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

    const reports = await db
      .select()
      .from(labReports)
      .where(eq(labReports.cropId, cropId))
      .orderBy(desc(labReports.createdAt));

    return NextResponse.json({ labReports: reports });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/crops/[id]/lab-reports error:', error);
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
    const { plantId, collectionDate, results, reportUrl } = body;

    if (!collectionDate) {
      return NextResponse.json({ error: 'Fecha de recolección requerida' }, { status: 400 });
    }
    if (!results) {
      return NextResponse.json({ error: 'Resultados requeridos' }, { status: 400 });
    }
    try {
      const parsed = JSON.parse(results);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        return NextResponse.json({ error: 'Resultados deben ser un objeto JSON' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Resultados deben ser JSON válido' }, { status: 400 });
    }

    const [created] = await db
      .insert(labReports)
      .values({
        cropId,
        plantId: plantId ?? null,
        collectionDate: new Date(collectionDate),
        results,
        reportUrl: reportUrl ?? null,
        createdBy: session.userId,
      })
      .returning();

    return NextResponse.json({ labReport: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/crops/[id]/lab-reports error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
