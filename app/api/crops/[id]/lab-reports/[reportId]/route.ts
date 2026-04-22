import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crops, labReports } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

type RouteParams = { params: Promise<{ id: string; reportId: string }> };

async function verifyCropOwnership(cropId: number, userId: number) {
  const [crop] = await db
    .select()
    .from(crops)
    .where(and(eq(crops.id, cropId), eq(crops.userId, userId)));
  return crop ?? null;
}

async function verifyReportBelongsToCrop(reportId: number, cropId: number) {
  const [report] = await db
    .select()
    .from(labReports)
    .where(and(eq(labReports.id, reportId), eq(labReports.cropId, cropId)));
  return report ?? null;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id, reportId } = await params;
    const cropId = parseInt(id, 10);
    const reportIdNum = parseInt(reportId, 10);

    if (isNaN(cropId) || isNaN(reportIdNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await verifyCropOwnership(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const report = await verifyReportBelongsToCrop(reportIdNum, cropId);
    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ labReport: report });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/crops/[id]/lab-reports/[reportId] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id, reportId } = await params;
    const cropId = parseInt(id, 10);
    const reportIdNum = parseInt(reportId, 10);

    if (isNaN(cropId) || isNaN(reportIdNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await verifyCropOwnership(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const report = await verifyReportBelongsToCrop(reportIdNum, cropId);
    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { plantId, collectionDate, results, reportUrl } = body;

    if (results !== undefined) {
      try {
        const parsed = JSON.parse(results);
        if (typeof parsed !== 'object' || Array.isArray(parsed)) {
          return NextResponse.json({ error: 'Resultados deben ser un objeto JSON' }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: 'Resultados deben ser JSON válido' }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (plantId !== undefined) updateData.plantId = plantId;
    if (collectionDate !== undefined) updateData.collectionDate = new Date(collectionDate);
    if (results !== undefined) updateData.results = results;
    if (reportUrl !== undefined) updateData.reportUrl = reportUrl;

    const [updated] = await db
      .update(labReports)
      .set(updateData)
      .where(eq(labReports.id, reportIdNum))
      .returning();

    return NextResponse.json({ labReport: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('PUT /api/crops/[id]/lab-reports/[reportId] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id, reportId } = await params;
    const cropId = parseInt(id, 10);
    const reportIdNum = parseInt(reportId, 10);

    if (isNaN(cropId) || isNaN(reportIdNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const crop = await verifyCropOwnership(cropId, session.userId);
    if (!crop) {
      return NextResponse.json({ error: 'Cultivo no encontrado' }, { status: 404 });
    }

    const report = await verifyReportBelongsToCrop(reportIdNum, cropId);
    if (!report) {
      return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
    }

    await db.delete(labReports).where(eq(labReports.id, reportIdNum));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('DELETE /api/crops/[id]/lab-reports/[reportId] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
