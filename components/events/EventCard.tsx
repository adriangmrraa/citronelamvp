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
    <Card className="overflow-hidden group">
      {flyerUrl && (
        <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={flyerUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {!flyerUrl && (
        <div className="h-20 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white/60" />
        </div>
      )}

      <CardContent className="p-4 space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">{title}</h3>

        <div className="space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{formattedDate}</span>
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
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>{reservationsCount}/{capacity} lugares</span>
            </div>
          )}
        </div>

        {ticketCategories.length > 0 && (
          <div className="space-y-1 border-t border-gray-100 dark:border-gray-800 pt-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Ticket className="w-3 h-3" /> Categorías
            </p>
            {ticketCategories.slice(0, 2).map((cat) => (
              <div key={cat.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {cat.price === 0 ? 'Gratis' : `${cat.price} tkn`}
                </span>
              </div>
            ))}
            {ticketCategories.length > 2 && (
              <p className="text-xs text-gray-400">+{ticketCategories.length - 2} más</p>
            )}
          </div>
        )}

        <Link href={`/events/${id}`} className="block">
          {isFull ? (
            <Button className="w-full" variant="secondary" disabled>
              Agotado
            </Button>
          ) : (
            <Button className="w-full">
              {minPrice === 0 ? 'Reservar gratis' : minPrice !== null ? `Desde ${minPrice} tkn` : 'Reservar'}
            </Button>
          )}
        </Link>
      </CardContent>
    </Card>
  );
}
