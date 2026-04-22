'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TicketSelector from '@/components/events/TicketSelector';
import ReservationCard from '@/components/events/ReservationCard';
import { ArrowLeft, Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

interface TicketCategory {
  id: number;
  name: string;
  price: number;
  benefits: string | null;
  capacity: number | null;
  reserved: number;
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

interface Reservation {
  id: number;
  categoryName: string;
  qrCode: string;
  createdAt: string;
}

interface UserData {
  tokens: number;
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [evRes, meRes] = await Promise.all([
        fetch(`/api/events/${id}`),
        fetch('/api/users/me'),
      ]);

      const evData = await evRes.json();
      setEvent(evData.event ?? null);

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser({ tokens: meData.user?.tokens ?? 0 });

        // Check if user has a reservation
        const resRes = await fetch(`/api/events/${id}/reservations/me`);
        if (resRes.ok) {
          const resData = await resRes.json();
          setReservation(resData.reservation ?? null);
        }
      }
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
    return <div className="p-6 text-center text-gray-400">Cargando evento...</div>;
  }

  if (!event) {
    return (
      <div className="p-6 text-center space-y-4">
        <AlertCircle className="w-10 h-10 mx-auto text-gray-300" />
        <p className="text-gray-500 dark:text-gray-400">Evento no encontrado.</p>
        <Link href="/events">
          <Button variant="outline">Ver todos los eventos</Button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href="/events">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a eventos
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {event.flyerUrl && (
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={event.flyerUrl} alt={event.title} className="w-full object-cover max-h-72" />
            </div>
          )}

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{event.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                {formattedDate}
              </span>
              {event.time && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                  {event.time}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                  {event.location}
                </span>
              )}
              {event.capacity && (
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                  {event.reservationsCount}/{event.capacity} lugares
                </span>
              )}
            </div>

            {event.description && (
              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p className="whitespace-pre-line">{event.description}</p>
              </div>
            )}

            {event.requirements && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Requisitos</p>
                <p className="text-sm text-amber-700 dark:text-amber-400 whitespace-pre-line">{event.requirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: reservation */}
        <div className="space-y-4">
          {reservation ? (
            <div className="space-y-2">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Tu reserva</h2>
              <ReservationCard
                eventTitle={event.title}
                categoryName={reservation.categoryName}
                qrCode={reservation.qrCode}
                reservedAt={reservation.createdAt}
              />
            </div>
          ) : user ? (
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900">
              <TicketSelector
                eventId={event.id}
                categories={event.ticketCategories}
                userTokens={user.tokens}
                onSuccess={load}
              />
            </div>
          ) : (
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-2xl text-center space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Iniciá sesión para reservar tu entrada.
              </p>
              <Link href="/login">
                <Button className="w-full">Iniciar sesión</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
