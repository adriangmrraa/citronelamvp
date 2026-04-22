import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, desc } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  try {
    await requireAdmin();

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        category: products.category,
        price: products.price,
        basePrice: products.basePrice,
        stock: products.stock,
        imageUrl: products.imageUrl,
        sellerId: products.sellerId,
        labReportId: products.labReportId,
        status: products.status,
        createdAt: products.createdAt,
        sellerUsername: users.username,
        sellerEmail: users.email,
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .orderBy(desc(products.createdAt));

    return NextResponse.json({ products: rows });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      const status = error.message === 'No autenticado' ? 401 : 403;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error('GET /api/admin/products error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
