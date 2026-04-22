import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crops } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, desc } from 'drizzle-orm';

const VALID_METHODS = ['Hidroponia', 'Organico', 'SalesMinerales', 'Mixto'] as const;

export async function GET() {
  try {
    const session = await requireAuth();

    const userCrops = await db
      .select()
      .from(crops)
      .where(eq(crops.userId, session.userId))
      .orderBy(desc(crops.createdAt));

    return NextResponse.json({ crops: userCrops });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/crops error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { bucketName, cultivationMethod, imageUrl } = body;

    if (!bucketName || bucketName.trim().length === 0) {
      return NextResponse.json({ error: 'Nombre de parcela requerido' }, { status: 400 });
    }
    if (bucketName.length > 100) {
      return NextResponse.json({ error: 'Nombre demasiado largo (máx 100 caracteres)' }, { status: 400 });
    }
    if (cultivationMethod && !VALID_METHODS.includes(cultivationMethod)) {
      return NextResponse.json({ error: 'Método de cultivo inválido' }, { status: 400 });
    }

    const [created] = await db
      .insert(crops)
      .values({
        bucketName: bucketName.trim(),
        cultivationMethod: cultivationMethod ?? 'Organico',
        imageUrl: imageUrl ?? null,
        userId: session.userId,
      })
      .returning();

    return NextResponse.json({ crop: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/crops error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
