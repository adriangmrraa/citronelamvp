import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, reviews, products } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const orderId = parseInt(params.id, 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // Verify order belongs to buyer and is delivered
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }
    if (order.buyerId !== session.userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    if (order.status !== 'Entregado') {
      return NextResponse.json({ error: 'Solo podés reseñar pedidos entregados' }, { status: 409 });
    }

    // Check for duplicate review (orderId is unique in reviews)
    const [existingReview] = await db.select().from(reviews).where(eq(reviews.orderId, orderId));
    if (existingReview) {
      return NextResponse.json({ error: 'Ya existe una reseña para este pedido' }, { status: 409 });
    }

    // Get first item from order to determine product and seller
    const [item] = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    if (!item) {
      return NextResponse.json({ error: 'El pedido no tiene items' }, { status: 400 });
    }

    const body = await request.json();
    const { rating, comment } = body;

    const errors: string[] = [];
    if (rating === undefined) errors.push('Rating requerido');
    else if (rating < 1 || rating > 5 || !Number.isInteger(rating)) errors.push('Rating debe ser entre 1 y 5');
    if (comment !== undefined && comment.length > 1000) errors.push('Comentario demasiado largo');

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Resolve sellerId from the product linked in the order item
    const [product] = await db.select({ sellerId: products.sellerId }).from(products).where(eq(products.id, item.productId));
    if (!product) {
      return NextResponse.json({ error: 'Producto del pedido no encontrado' }, { status: 404 });
    }

    const [review] = await db
      .insert(reviews)
      .values({
        rating,
        comment: comment ?? null,
        orderId,
        productId: item.productId,
        sellerId: product.sellerId,
      })
      .returning();

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/orders/[id]/review error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
