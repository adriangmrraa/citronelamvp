'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TicketCategory {
  id: number;
  name: string;
  price: number;
  benefits: string | null;
  capacity: number | null;
  reserved: number;
}

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time?: string | null;
  location?: string | null;
  capacity?: number | null;
  flyerUrl?: string | null;
  ticketCategories?: TicketCategory[];
  reservationsCount?: number;
}

export default function EventCard({
  id,
  title,
  date,
  time,
  location,
  capacity,
  flyerUrl,
  ticketCategories = [],
  reservationsCount = 0,
}: EventCardProps) {
  const eventDate = new Date(date);
  const isFull = capacity !== null && capacity !== undefined && reservationsCount >= capacity;

  const formattedDate = eventDate.toLocaleDateString('es-AR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const minPrice = ticketCategories.length > 0
    ? Math.min(...ticketCategories.map((c) => c.price))
    : null;

  return (
    <Card className="group rounded-2xl glass-surface transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/[0.20] hover:shadow-lg hover:shadow-lime-400/[0.05] overflow-hidden">
      {flyerUrl ? (
        <div className="h-40 overflow-hidden">
          <img
            src={flyerUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-20 bg-gradient-to-br from-lime-400/15 to-green-500/15 border-b border-lime-400/10 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-lime-400/40" />
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-zinc-50 line-clamp-2 leading-snug">{title}</h3>

        <div className="space-y-1.5 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="bg-lime-400/10 border border-lime-400/25 text-lime-400 rounded-xl px-3 py-1 text-xs">
              {formattedDate}
            </span>
          </div>
          {time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{time}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}
          {capacity && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>{reservationsCount}/{capacity} lugares</span>
              </div>
              <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((reservationsCount / capacity) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {ticketCategories.length > 0 && (
          <div className="space-y-1 border-t border-white/[0.06] pt-2">
            <p className="text-xs font-medium text-zinc-500 flex items-center gap-1">
              <Ticket className="w-3 h-3" /> Categorias
            </p>
            {ticketCategories.slice(0, 2).map((cat) => (
              <div key={cat.id} className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{cat.name}</span>
                <span className="font-semibold text-lime-400">
                  {cat.price === 0 ? 'Gratis' : `${cat.price} tkn`}
                </span>
              </div>
            ))}
            {ticketCategories.length > 2 && (
              <p className="text-xs text-zinc-500">+{ticketCategories.length - 2} mas</p>
            )}
          </div>
        )}

        <Link href={`/events/${id}`} className="block">
          {isFull ? (
            <Button className="w-full rounded-xl" variant="secondary" disabled>
              Agotado
            </Button>
          ) : (
            <Button className="w-full bg-lime-400 text-[#07120b] hover:bg-lime-300 font-semibold rounded-xl">
              {minPrice === 0 ? 'Reservar gratis' : minPrice !== null ? `Desde ${minPrice} tkn` : 'Reservar'}
            </Button>
          )}
        </Link>
      </CardContent>
    </Card>
  );
}
