import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crops, cropLogs, labReports } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and, desc } from 'drizzle-orm';

const VALID_STATUSES = ['Verde', 'Amarillo', 'Rojo'] as const;
const VALID_METHODS = ['Hidroponia', 'Organico', 'SalesMinerales', 'Mixto'] as const;

type RouteParams = { params: Promise<{ id: string }> };

async function getCropOrFail(cropId: number, userId: number) {
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

    const crop = await getCropOrFail(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const logs = await db
      .select()
      .from(cropLogs)
      .where(eq(cropLogs.cropId, cropId))
      .orderBy(desc(cropLogs.createdAt));

    const reports = await db
      .select()
      .from(labReports)
      .where(eq(labReports.cropId, cropId))
      .orderBy(desc(labReports.createdAt));

    return NextResponse.json({ crop, logs, labReports: reports });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/crops/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const cropId = parseInt(id, 10);

    if (isNaN(cropId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await getCropOrFail(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { bucketName, imageUrl, status, cultivationMethod } = body;

    if (bucketName !== undefined && (!bucketName || bucketName.trim().length === 0)) {
      return NextResponse.json({ error: 'Nombre de parcela requerido' }, { status: 400 });
    }
    if (bucketName && bucketName.length > 100) {
      return NextResponse.json({ error: 'Nombre demasiado largo (máx 100 caracteres)' }, { status: 400 });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }
    if (cultivationMethod && !VALID_METHODS.includes(cultivationMethod)) {
      return NextResponse.json({ error: 'Método de cultivo inválido' }, { status: 400 });
    }

    const updateData: Partial<typeof crop> = {};
    if (bucketName !== undefined) updateData.bucketName = bucketName.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (status !== undefined) updateData.status = status;
    if (cultivationMethod !== undefined) updateData.cultivationMethod = cultivationMethod;

    const [updated] = await db
      .update(crops)
      .set(updateData)
      .where(eq(crops.id, cropId))
      .returning();

    return NextResponse.json({ crop: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('PUT /api/crops/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const cropId = parseInt(id, 10);

    if (isNaN(cropId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await getCropOrFail(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    // Cascade: delete logs and lab reports first
    await db.delete(cropLogs).where(eq(cropLogs.cropId, cropId));
    await db.delete(labReports).where(eq(labReports.cropId, cropId));
    await db.delete(crops).where(eq(crops.id, cropId));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('DELETE /api/crops/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
