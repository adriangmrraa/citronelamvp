import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wishlists, products } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await requireAuth();

    const items = await db
      .select({
        id: wishlists.id,
        createdAt: wishlists.createdAt,
        productId: products.id,
        productName: products.name,
        productDescription: products.description,
        productPrice: products.price,
        productImageUrl: products.imageUrl,
        productCategory: products.category,
        productStatus: products.status,
        productStock: products.stock,
      })
      .from(wishlists)
      .leftJoin(products, eq(products.id, wishlists.productId))
      .where(eq(wishlists.userId, session.userId))
      .orderBy(desc(wishlists.createdAt));

    return NextResponse.json({ wishlist: items });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/wishlist error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { productId } = body;

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json({ error: 'productId requerido' }, { status: 400 });
    }

    // Verify product exists
    const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId));
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Upsert — unique index on (userId, productId) will throw if duplicate
    try {
      const [created] = await db
        .insert(wishlists)
        .values({ userId: session.userId, productId })
        .returning();
      return NextResponse.json({ item: created }, { status: 201 });
    } catch {
      // Already in wishlist — return 200 instead of 409 for idempotency
      const [existing] = await db
        .select()
        .from(wishlists)
        .where(and(eq(wishlists.userId, session.userId), eq(wishlists.productId, productId)));
      return NextResponse.json({ item: existing });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/wishlist error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { productId } = body;

    if (!productId || typeof productId !== 'number') {
      return NextResponse.json({ error: 'productId requerido' }, { status: 400 });
    }

    const result = await db
      .delete(wishlists)
      .where(and(eq(wishlists.userId, session.userId), eq(wishlists.productId, productId)));

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('DELETE /api/wishlist error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
