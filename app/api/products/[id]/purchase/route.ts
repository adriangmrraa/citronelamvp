import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, users, orders, orderItems, tokenTransactions } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, sql } from 'drizzle-orm';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const productId = parseInt(params.id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Read product
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    if (product.status !== 'Active') {
      return NextResponse.json({ error: 'Producto no disponible' }, { status: 409 });
    }
    if ((product.stock ?? 0) <= 0) {
      return NextResponse.json({ error: 'Sin stock' }, { status: 409 });
    }

    const sellerId = product.sellerId;
    const buyerId = session.userId;

    if (buyerId === sellerId) {
      return NextResponse.json({ error: 'No podés comprar tu propio producto' }, { status: 400 });
    }

    const price = product.price ?? 0;
    if (price <= 0) {
      return NextResponse.json({ error: 'El total debe ser mayor a 0' }, { status: 400 });
    }

    // Read buyer tokens BEFORE update to validate solvency
    const [buyer] = await db.select({ tokens: users.tokens }).from(users).where(eq(users.id, buyerId));
    if (!buyer) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    const buyerTokens = buyer.tokens ?? 0;
    if (buyerTokens < price) {
      return NextResponse.json({ error: 'Tokens insuficientes' }, { status: 402 });
    }

    // Atomic transfer: debit buyer, credit seller, decrement stock, create order + items + tx log
    const newStock = (product.stock ?? 1) - 1;
    const newStatus = newStock === 0 ? 'SoldOut' : 'Active';

    // 1. Debit buyer
    await db
      .update(users)
      .set({ tokens: sql`${users.tokens} - ${price}` })
      .where(eq(users.id, buyerId));

    // 2. Credit seller
    await db
      .update(users)
      .set({ tokens: sql`${users.tokens} + ${price}` })
      .where(eq(users.id, sellerId));

    // 3. Decrement stock (set SoldOut if reaches 0)
    await db
      .update(products)
      .set({ stock: newStock, status: newStatus })
      .where(eq(products.id, productId));

    // 4. Create order
    const [order] = await db
      .insert(orders)
      .values({ buyerId, totalPrice: price, status: 'Pendiente' })
      .returning();

    // 5. Create order item
    await db.insert(orderItems).values({
      orderId: order.id,
      productId,
      quantity: 1,
      price,
    });

    // 6. Token transaction log — buyer debit
    await db.insert(tokenTransactions).values({
      userId: buyerId,
      amount: -price,
      reason: 'purchase',
      relatedOrderId: order.id,
      performedBy: buyerId,
    });

    // 7. Token transaction log — seller credit
    await db.insert(tokenTransactions).values({
      userId: sellerId,
      amount: price,
      reason: 'sale',
      relatedOrderId: order.id,
      performedBy: buyerId,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/products/[id]/purchase error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
