'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Calendar, Clock, MapPin, Users, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ALL_EVENTS } from '@/hooks/useEvents';
import TicketSelector from '@/components/events/TicketSelector';
import ReservationCard from '@/components/events/ReservationCard';

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
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [user, setUser] = useState<UserData | null>({ tokens: 500 }); // Simulamos sesión iniciada con 500 tokens
  const [loading, setLoading] = useState(true);

  const mockEvent = ALL_EVENTS.find(e => e.id === Number(id));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [evRes, meRes] = await Promise.all([
        fetch(`/api/events/${id}`),
        fetch('/api/users/me'),
      ]);

      if (evRes.ok) {
        const evData = await evRes.json();
        setEvent(evData.event ?? null);
      } else if (mockEvent) {
        setEvent({
          id: mockEvent.id,
          title: mockEvent.title,
          description: "Únete a este increíble evento de la comunidad Citronela. Una oportunidad única para aprender, compartir y crecer juntos en el mundo del cultivo y la cultura cannábica.\n\nContaremos con expertos en la materia, sesiones de preguntas y respuestas, y mucho más. ¡No te lo pierdas!",
          date: mockEvent.date,
          time: mockEvent.time,
          location: mockEvent.location,
          capacity: mockEvent.attendees * 2,
          flyerUrl: mockEvent.img,
          requirements: "Puntualidad y llevar el código QR de la reserva.",
          ticketCategories: [
            { id: 1, name: "General", price: mockEvent.price.includes('GRATIS') ? 0 : parseInt(mockEvent.price), benefits: "Acceso completo", capacity: 100, reserved: mockEvent.attendees }
          ],
          reservationsCount: mockEvent.attendees
        });
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser({ tokens: meData.user?.tokens ?? 500 });

        const resRes = await fetch(`/api/events/${id}/reservations/me`);
        if (resRes.ok) {
          const resData = await resRes.json();
          setReservation(resData.reservation ?? null);
        }
      }
    } catch {
      if (mockEvent) {
        setEvent({
          id: mockEvent.id,
          title: mockEvent.title,
          description: "Únete a este increíble evento de la comunidad Citronela. Una oportunidad única para aprender, compartir y crecer juntos en el mundo del cultivo y la cultura cannábica.\n\nContaremos con expertos en la materia, sesiones de preguntas y respuestas, y mucho más. ¡No te lo pierdas!",
          date: mockEvent.date,
          time: mockEvent.time,
          location: mockEvent.location,
          capacity: mockEvent.attendees * 2,
          flyerUrl: mockEvent.img,
          requirements: "Puntualidad y llevar el código QR de la reserva.",
          ticketCategories: [
            { id: 1, name: "General", price: mockEvent.price.includes('GRATIS') ? 0 : parseInt(mockEvent.price), benefits: "Acceso completo", capacity: 100, reserved: mockEvent.attendees }
          ],
          reservationsCount: mockEvent.attendees
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id, mockEvent]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return (
    <div className="min-h-screen bg-[#07120b] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-[#07120b] flex flex-col items-center justify-center text-white gap-4">
      <AlertCircle className="w-12 h-12 opacity-20" />
      <p className="text-xl font-medium opacity-50">Evento no encontrado</p>
      <Button onClick={() => router.push('/events')} variant="outline" className="border-white/10">
        Volver a Eventos
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen text-zinc-100 pb-24 font-sans">
      {/* Top Navigation */}
      <div className="sticky top-0 z-30 bg-[#07120b]/80 backdrop-blur-md border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-[#A3E635] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver a Eventos
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Flyer Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] w-full bg-zinc-900 rounded-none overflow-hidden border border-white/5 shadow-2xl">
            {event.flyerUrl && (
              <Image
                src={event.flyerUrl}
                alt={event.title}
                fill
                priority
                className="object-cover"
              />
            )}
          </div>
        </div>

        {/* Right Column: Event Info */}
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
              Evento Confirmado  |  {event.reservationsCount} inscritos
            </p>
          </div>

          {/* Title Block */}
          <div className="space-y-2">
            <h1 
              style={{ fontFamily: 'var(--font-avigea)' }}
              className="text-3xl md:text-5xl text-white tracking-wide leading-[1.1]"
            >
              {event.title}
            </h1>
          </div>

          {/* Technical Data Blocks */}
          <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Fecha</span>
              </div>
              <p className="text-sm font-bold text-white">{event.date}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Hora</span>
              </div>
              <p className="text-sm font-bold text-white">{event.time || 'A confirmar'}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <div className="flex items-center gap-2 text-zinc-500">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Ubicación</span>
              </div>
              <p className="text-sm font-bold text-white">{event.location || 'Online'}</p>
            </div>
          </div>

          {/* Reservation / Ticket Section */}
          <div className="space-y-6 pt-4">
            {reservation ? (
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#A3E635]/10 border border-[#A3E635]/20 px-3 py-1.5 rounded-sm">
                  <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
                  <span className="text-[10px] font-black text-[#A3E635] uppercase tracking-widest">Ya tienes tu entrada</span>
                </div>
                <ReservationCard
                  eventTitle={event.title}
                  categoryName={reservation.categoryName}
                  qrCode={reservation.qrCode}
                  reservedAt={reservation.createdAt}
                />
              </div>
            ) : user ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                <TicketSelector
                  eventId={event.id}
                  categories={event.ticketCategories}
                  userTokens={user.tokens}
                  onSuccess={load}
                />
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center space-y-4">
                <p className="text-zinc-400 text-sm">
                  Iniciá sesión para reservar tu entrada para este evento.
                </p>
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#A3E635] text-[#07120b] hover:bg-[#b4f346] font-black"
                >
                  INICIAR SESIÓN
                </Button>
              </div>
            )}
          </div>

          {/* Protection Info */}
          <div className="flex items-center gap-3 pt-4 text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Evento Verificado por Citronela</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2 pt-16 space-y-8">
          <div className="flex gap-8 border-b border-white/5">
            <button className="pb-4 border-b-2 border-[#A3E635] text-white font-bold text-sm tracking-wider">
              INFORMACIÓN
            </button>
            <button className="pb-4 border-b-2 border-transparent text-zinc-500 font-bold text-sm tracking-wider hover:text-zinc-300 transition-colors">
              REQUISITOS
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap font-light">
                {event.description}
              </p>
            </div>
            
            {event.requirements && (
              <div className="space-y-4">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Lo que debes saber</h4>
                <div className="p-4 bg-amber-400/5 border border-amber-400/10 rounded-lg">
                  <p className="text-sm text-amber-200/70 leading-relaxed italic">
                    "{event.requirements}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
