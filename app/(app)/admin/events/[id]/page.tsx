'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/events/EventForm';
import { ArrowLeft, Pencil, Calendar, MapPin, Users } from 'lucide-react';

interface TicketCategory {
  id: number;
  name: string;
  price: number;
  benefits: string | null;
  capacity: number | null;
  reserved: number;
}

interface Reservation {
  id: number;
  userId: number;
  username: string;
  categoryName: string;
  qrCode: string;
  createdAt: string;
}

interface EventDetail {
  id: number;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  capacity: number | null;
  flyerUrl: string | null;
  requirements: string | null;
  ticketCategories: TicketCategory[];
  reservationsCount: number;
}

export default function AdminEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [evRes, resRes] = await Promise.all([
        fetch(`/api/events/${id}`),
        fetch(`/api/events/${id}/reservations`),
      ]);
      const evData = await evRes.json();
      const resData = await resRes.json();
      setEvent(evData.event ?? null);
      setReservations(resData.reservations ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <div className="p-6 text-center text-zinc-500">Cargando...</div>;
  }

  if (!event) {
    return (
      <div className="p-6 text-center">
        <p className="text-zinc-500">Evento no encontrado.</p>
        <Link href="/admin/events">
          <Button className="mt-4" variant="outline">Volver</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-50">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(event.date).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {event.time && ` — ${event.time}`}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {event.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {event.reservationsCount}{event.capacity ? `/${event.capacity}` : ''} reservas
            </span>
          </div>
          {event.description && (
            <p className="text-zinc-400 text-sm max-w-2xl">{event.description}</p>
          )}
        </div>
        <Button onClick={() => setShowEdit(true)} variant="outline" className="shrink-0">
          <Pencil className="w-4 h-4 mr-1.5" />
          Editar
        </Button>
      </div>

      {/* Ticket categories */}
      {event.ticketCategories.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">Categorías de entrada</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {event.ticketCategories.map((cat) => (
              <div key={cat.id} className="p-3 border border-white/[0.08] rounded-xl bg-white/[0.02]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-zinc-100 text-sm">{cat.name}</span>
                  <span className="font-bold text-lime-400 text-sm">
                    {cat.price === 0 ? 'Gratis' : `${cat.price} tkn`}
                  </span>
                </div>
                {cat.benefits && <p className="text-xs text-zinc-500">{cat.benefits}</p>}
                {cat.capacity !== null && (
                  <p className="text-xs text-zinc-600 mt-1">{cat.reserved}/{cat.capacity} reservas</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservations table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-100">
          Reservas ({reservations.length})
        </h2>
        {reservations.length === 0 ? (
          <p className="text-center py-8 text-zinc-500 text-sm">Sin reservas todavía.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/[0.04] text-left">
                  <th className="px-4 py-3 font-semibold text-zinc-400">Usuario</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Categoría</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Código QR</th>
                  <th className="px-4 py-3 font-semibold text-zinc-400">Fecha reserva</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-100">{r.username}</td>
                    <td className="px-4 py-3 text-zinc-300">{r.categoryName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500 max-w-[200px] truncate">{r.qrCode}</td>
                    <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEdit && (
        <EventForm
          eventId={event.id}
          initialData={{
            title: event.title,
            description: event.description ?? '',
            date: event.date.slice(0, 10),
            time: event.time ?? '',
            location: event.location ?? '',
            capacity: event.capacity?.toString() ?? '',
            flyerUrl: event.flyerUrl ?? '',
            requirements: event.requirements ?? '',
          }}
          onClose={() => setShowEdit(false)}
          onSuccess={() => { setShowEdit(false); load(); }}
        />
      )}
    </div>
  );
}
