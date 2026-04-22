import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { requireAuth, requireAdmin } from '@/lib/session';
import { eq } from 'drizzle-orm';

const VALID_ORDER_STATUSES = ['Pendiente', 'Entregado', 'Cancelado'] as const;
type OrderStatus = (typeof VALID_ORDER_STATUSES)[number];

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Only the buyer or admin/staff can see the order
    if (order.buyerId !== session.userId && session.role !== 'ADMIN' && session.role !== 'STAFF') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        productId: products.id,
        productName: products.name,
        productImageUrl: products.imageUrl,
        productCategory: products.category,
        productSellerId: products.sellerId,
      })
      .from(orderItems)
      .leftJoin(products, eq(products.id, orderItems.productId))
      .where(eq(orderItems.orderId, id));

    return NextResponse.json({ order: { ...order, items } });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_ORDER_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Estado inválido. Valores: Pendiente, Entregado, Cancelado' }, { status: 400 });
    }

    const [updated] = await db
      .update(orders)
      .set({ status: status as OrderStatus })
      .where(eq(orders.id, id))
      .returning();

    return NextResponse.json({ order: updated });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      const status = error.message === 'No autenticado' ? 401 : 403;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error('PATCH /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
