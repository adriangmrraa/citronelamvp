import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crops, users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();

    const allCrops = await db
      .select({
        id: crops.id,
        bucketName: crops.bucketName,
        imageUrl: crops.imageUrl,
        status: crops.status,
        cultivationMethod: crops.cultivationMethod,
        createdAt: crops.createdAt,
        userId: crops.userId,
        username: users.username,
        email: users.email,
      })
      .from(crops)
      .innerJoin(users, eq(crops.userId, users.id))
      .orderBy(desc(crops.createdAt));

    return NextResponse.json({ crops: allCrops });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'No autenticado') {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
      }
      if (error.message === 'No autorizado') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
      }
    }
    console.error('GET /api/admin/crops error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
