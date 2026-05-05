'use client';

import React from 'react';
import { EventCard } from './EventCard';
import { EventCardSkeleton } from './EventCardSkeleton';
import { useTrendingEvents } from '@/hooks/useEvents';

export function TrendingEvents({ searchTerm = "", category = "Todos" }: { searchTerm?: string; category?: string }) {
  const { data, isLoading, error } = useTrendingEvents(searchTerm, category);

  if (isLoading) {
    return (
      <section>
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10 pb-6 md:pb-0 overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
          {[1, 2, 3].map((n) => (
            <div key={n} className="snap-center md:snap-align-none min-w-[320px] md:min-w-0">
              <EventCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl">
        {error}
      </div>
    );
  }

  return (
    <section>
      <div className="flex md:grid md:grid-cols-4 gap-6 md:gap-10 pb-6 md:pb-0 overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
        {data.length === 0 ? (
          <div className="min-w-full md:col-span-full h-40 flex items-center justify-center text-zinc-500 bg-zinc-900/30 rounded-[2rem] border border-dashed border-zinc-700 mx-auto w-full">
            No se encontraron eventos destacados.
          </div>
        ) : (
          data.map((evt) => (
            <div key={evt.id} className="snap-center md:snap-align-none min-w-[320px] md:min-w-0">
              <EventCard evt={evt} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

