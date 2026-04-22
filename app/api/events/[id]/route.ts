import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events, ticketCategories, reservations } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, sql } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    const categories = await db
      .select()
      .from(ticketCategories)
      .where(eq(ticketCategories.eventId, eventId));

    const [reservationCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reservations)
      .where(
        sql`${reservations.categoryId} in (select id from ticket_category where event_id = ${eventId})`
      );

    return NextResponse.json({
      event: {
        ...event,
        ticketCategories: categories,
        reservationCount: Number(reservationCount?.count ?? 0),
      },
    });
  } catch (error) {
    console.error('GET /api/events/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const eventId = parseInt(params.id, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [existing] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!existing) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, date, time, location, requirements, flyerUrl, capacity } = body;

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
      }
      updates.date = parsedDate;
    }
    if (time !== undefined) updates.time = String(time);
    if (location !== undefined) updates.location = String(location).trim();
    if (requirements !== undefined) updates.requirements = requirements ? String(requirements) : null;
    if (flyerUrl !== undefined) updates.flyerUrl = flyerUrl ? String(flyerUrl) : null;
    if (capacity !== undefined) {
      if (capacity < 1 || !Number.isInteger(capacity)) {
        return NextResponse.json({ error: 'Capacidad debe ser entero >= 1' }, { status: 400 });
      }
      updates.capacity = capacity;
    }

    const [updated] = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, eventId))
      .returning();

    return NextResponse.json({ event: updated });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('PUT /api/events/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const eventId = parseInt(params.id, 10);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [existing] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (!existing) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    // Fetch categories for cascade
    const categories = await db
      .select({ id: ticketCategories.id })
      .from(ticketCategories)
      .where(eq(ticketCategories.eventId, eventId));

    // Delete reservations for each category
    for (const cat of categories) {
      await db.delete(reservations).where(eq(reservations.categoryId, cat.id));
    }

    // Delete ticket categories
    await db.delete(ticketCategories).where(eq(ticketCategories.eventId, eventId));

    // Delete event
    await db.delete(events).where(eq(events.id, eventId));

    return NextResponse.json({ message: 'Evento eliminado' });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('DELETE /api/events/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
