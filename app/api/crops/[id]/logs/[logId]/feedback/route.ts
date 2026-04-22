import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crops, cropLogs } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

type RouteParams = { params: Promise<{ id: string; logId: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id, logId } = await params;
    const cropId = parseInt(id, 10);
    const logIdNum = parseInt(logId, 10);

    if (isNaN(cropId) || isNaN(logIdNum)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Verify log belongs to crop
    const [log] = await db
      .select()
      .from(cropLogs)
      .where(and(eq(cropLogs.id, logIdNum), eq(cropLogs.cropId, cropId)));

    if (!log) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { feedback } = body;

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json({ error: 'Feedback requerido' }, { status: 400 });
    }

    const [updated] = await db
      .update(cropLogs)
      .set({ feedback: feedback.trim() })
      .where(eq(cropLogs.id, logIdNum))
      .returning();

    return NextResponse.json({ log: updated });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      const status = error.message === 'No autenticado' ? 401 : 403;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error('POST /api/crops/[id]/logs/[logId]/feedback error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
