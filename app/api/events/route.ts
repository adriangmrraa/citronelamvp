import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events, ticketCategories } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, asc } from 'drizzle-orm';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const allEvents = await db
      .select()
      .from(events)
      .orderBy(asc(events.date));

    // Fetch ticket categories for each event
    const eventIds = allEvents.map((e) => e.id);
    const categories =
      eventIds.length > 0
        ? await db
            .select()
            .from(ticketCategories)
            .where(
              eventIds.length === 1
                ? eq(ticketCategories.eventId, eventIds[0])
                : undefined
            )
        : [];

    // Attach categories to events
    const eventsWithCategories = allEvents.map((event) => ({
      ...event,
      ticketCategories: categories.filter((c) => c.eventId === event.id),
    }));

    return NextResponse.json({ events: eventsWithCategories });
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { title, description, date, time, location, requirements, flyerUrl, capacity } = body;

    const validationErrors: string[] = [];
    if (!title || String(title).trim().length === 0) validationErrors.push('Título requerido');
    if (!description || String(description).trim().length === 0) validationErrors.push('Descripción requerida');
    if (!date) validationErrors.push('Fecha requerida');
    if (!time) validationErrors.push('Hora requerida');
    if (!location || String(location).trim().length === 0) validationErrors.push('Ubicación requerida');
    if (capacity !== undefined && (capacity < 1 || !Number.isInteger(capacity))) {
      validationErrors.push('Capacidad debe ser entero >= 1');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
    }

    const [event] = await db
      .insert(events)
      .values({
        title: String(title).trim(),
        description: String(description).trim(),
        date: parsedDate,
        time: String(time),
        location: String(location).trim(),
        requirements: requirements ? String(requirements) : null,
        flyerUrl: flyerUrl ? String(flyerUrl) : null,
        capacity: capacity !== undefined ? capacity : 50,
      })
      .returning();

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('POST /api/events error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
