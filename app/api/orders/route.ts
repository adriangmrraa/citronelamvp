import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await requireAuth();

    const userOrders = await db
      .select({
        orderId: orders.id,
        totalPrice: orders.totalPrice,
        status: orders.status,
        createdAt: orders.createdAt,
        itemId: orderItems.id,
        quantity: orderItems.quantity,
        itemPrice: orderItems.price,
        productId: products.id,
        productName: products.name,
        productImageUrl: products.imageUrl,
        productCategory: products.category,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(products, eq(products.id, orderItems.productId))
      .where(eq(orders.buyerId, session.userId))
      .orderBy(desc(orders.createdAt));

    // Group items by order
    const ordersMap = new Map<number, {
      id: number;
      totalPrice: number;
      status: string;
      createdAt: Date | null;
      items: Array<{ id: number | null; quantity: number | null; price: number; product: { id: number | null; name: string | null; imageUrl: string | null; category: string | null } }>;
    }>();

    for (const row of userOrders) {
      if (!ordersMap.has(row.orderId)) {
        ordersMap.set(row.orderId, {
          id: row.orderId,
          totalPrice: row.totalPrice,
          status: row.status ?? 'Pendiente',
          createdAt: row.createdAt,
          items: [],
        });
      }
      if (row.itemId) {
        ordersMap.get(row.orderId)!.items.push({
          id: row.itemId,
          quantity: row.quantity,
          price: row.itemPrice ?? 0,
          product: {
            id: row.productId,
            name: row.productName,
            imageUrl: row.productImageUrl,
            category: row.productCategory,
          },
        });
      }
    }

    return NextResponse.json({ orders: Array.from(ordersMap.values()) });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
