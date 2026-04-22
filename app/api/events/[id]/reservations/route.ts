import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events, ticketCategories, reservations, users, tokenTransactions } from '@/db/schema';
import { requireAuth, requireAdmin } from '@/lib/session';
import { eq, sql } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const eventId = parseInt(params.id, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const allReservations = await db
      .select({
        id: reservations.id,
        userId: reservations.userId,
        username: users.username,
        email: users.email,
        categoryId: reservations.categoryId,
        categoryName: ticketCategories.name,
        qrCode: reservations.qrCode,
        createdAt: reservations.createdAt,
      })
      .from(reservations)
      .innerJoin(ticketCategories, eq(reservations.categoryId, ticketCategories.id))
      .innerJoin(users, eq(reservations.userId, users.id))
      .where(eq(ticketCategories.eventId, eventId));

    return NextResponse.json({ reservations: allReservations });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('GET /api/events/[id]/reservations error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const eventId = parseInt(params.id, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const body = await request.json();
    const { categoryId } = body;

    if (!categoryId || typeof categoryId !== 'number') {
      return NextResponse.json({ error: 'categoryId requerido' }, { status: 400 });
    }

    // Validate event exists
    const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    // Validate category belongs to this event
    const [category] = await db
      .select()
      .from(ticketCategories)
      .where(eq(ticketCategories.id, categoryId))
      .limit(1);

    if (!category || category.eventId !== eventId) {
      return NextResponse.json({ error: 'Categoría no válida para este evento' }, { status: 400 });
    }

    // Check capacity: count all reservations across all categories of this event
    const [capacityCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reservations)
      .where(
        sql`${reservations.categoryId} in (select id from ticket_category where event_id = ${eventId})`
      );

    const currentCount = Number(capacityCount?.count ?? 0);
    const capacity = event.capacity ?? 50;

    if (currentCount >= capacity) {
      return NextResponse.json({ error: 'Evento sin capacidad disponible' }, { status: 409 });
    }

    const price = category.price ?? 0;

    // Check user tokens if price > 0
    if (price > 0) {
      const [user] = await db
        .select({ tokens: users.tokens })
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1);

      if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }

      if ((user.tokens ?? 0) < price) {
        return NextResponse.json({ error: 'Tokens insuficientes' }, { status: 402 });
      }

      // Deduct tokens
      await db
        .update(users)
        .set({ tokens: sql`${users.tokens} - ${price}` })
        .where(eq(users.id, session.userId));
    }

    // Generate QR code string
    const qrCode = `RES-${session.userId}-${eventId}-${Date.now()}`;

    // Create reservation
    const [reservation] = await db
      .insert(reservations)
      .values({
        userId: session.userId,
        categoryId,
        qrCode,
      })
      .returning();

    // Log token transaction if paid
    if (price > 0) {
      await db.insert(tokenTransactions).values({
        userId: session.userId,
        amount: -price,
        reason: 'event_reservation',
        performedBy: session.userId,
      });
    }

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/events/[id]/reservations error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
