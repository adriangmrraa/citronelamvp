import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, users, labReports } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

const VALID_CATEGORIES = ['Flores', 'Parafernalia', 'Geneticas'] as const;
type Category = (typeof VALID_CATEGORIES)[number];

const VALID_STATUSES = ['Active', 'Paused', 'SoldOut'] as const;
type ProductStatus = (typeof VALID_STATUSES)[number];

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [row] = await db
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
        sellerAvatar: users.avatar,
        sellerBio: users.bio,
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(eq(products.id, id));

    if (!row) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Fetch lab report if linked
    let labReport = null;
    if (row.labReportId) {
      const [report] = await db
        .select()
        .from(labReports)
        .where(eq(labReports.id, row.labReportId));
      labReport = report ?? null;
    }

    return NextResponse.json({ product: { ...row, labReport } });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [existing] = await db.select().from(products).where(eq(products.id, id));
    if (!existing) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    if (existing.sellerId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, price, basePrice, stock, imageUrl, labReportId, status } = body;

    const errors: string[] = [];
    if (name !== undefined) {
      if (!name || name.trim().length === 0) errors.push('Nombre requerido');
      if (name && name.length > 200) errors.push('Nombre demasiado largo');
    }
    if (price !== undefined) {
      if (price < 0) errors.push('Precio debe ser >= 0');
      if (!Number.isInteger(price)) errors.push('Precio debe ser entero (tokens)');
    }
    if (category !== undefined && !VALID_CATEGORIES.includes(category)) errors.push('Categoría inválida');
    if (stock !== undefined && (stock < 0 || !Number.isInteger(stock))) errors.push('Stock debe ser entero >= 0');
    if (status !== undefined && !VALID_STATUSES.includes(status)) errors.push('Estado inválido');

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const updates: Partial<typeof existing> = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category as Category;
    if (price !== undefined) updates.price = price;
    if (basePrice !== undefined) updates.basePrice = basePrice;
    if (stock !== undefined) updates.stock = stock;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (labReportId !== undefined) updates.labReportId = labReportId;
    if (status !== undefined) updates.status = status as ProductStatus;

    const [updated] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json({ product: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [existing] = await db.select().from(products).where(eq(products.id, id));
    if (!existing) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    if (existing.sellerId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
