'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/events/EventForm';
import { Plus, Pencil, Trash2, Users, Calendar } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  capacity: number | null;
  reservationsCount: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminás este evento? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) setEvents((ev) => ev.filter((e) => e.id !== id));
      else alert('No se pudo eliminar el evento');
    } catch {
      alert('Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Gestión de eventos</h1>
          <p className="text-zinc-400 mt-1">{events.length} evento{events.length !== 1 ? 's' : ''} registrado{events.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo evento
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-zinc-500">Cargando eventos...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No hay eventos todavía.</p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Crear primer evento
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.04] text-left">
                <th className="px-4 py-3 font-semibold text-zinc-400">Evento</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Fecha</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Lugar</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Reservas</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/events/${ev.id}`} className="font-medium text-zinc-100 hover:text-lime-400 transition-colors">
                      {ev.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                    {new Date(ev.date).toLocaleDateString('es-AR')}
                    {ev.time && <span className="text-zinc-500 ml-1">{ev.time}</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 max-w-[180px] truncate">
                    {ev.location ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Users className="w-3.5 h-3.5" />
                      {ev.reservationsCount}{ev.capacity ? `/${ev.capacity}` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/events/${ev.id}`}>
                        <Button size="sm" variant="outline">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(ev.id)}
                        disabled={deletingId === ev.id}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EventForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}
