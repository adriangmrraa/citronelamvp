'use client';

import React from 'react';
import { EventCard, EventData } from './EventCard';

const upcomingEvents: EventData[] = [
  {
    id: 101, // ID distinto para no colisionar si se mezclan
    title: 'Marcha mundial de la Marihuana',
    date: '4 de Mayo',
    time: '16hs',
    location: 'Palermo, BA',
    img: '/images/events/4.jpg',
    attendees: 1540,
    price: 'GRATIS'
  }
];

export function UpcomingEvents({ searchTerm = "" }: { searchTerm?: string }) {
  const filteredEvents = upcomingEvents.filter(evt => 
    evt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10 pb-6 md:pb-0 overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
      {filteredEvents.length === 0 ? (
        <div className="min-w-full md:col-span-full h-40 flex items-center justify-center text-zinc-500 bg-zinc-900/30 rounded-[2rem] border border-dashed border-zinc-700 mx-auto w-full">
          {searchTerm ? 'No se encontraron eventos.' : 'Próximamente más eventos...'}
        </div>
      ) : (
        filteredEvents.map((evt) => (
          <div key={evt.id} className="snap-center md:snap-align-none min-w-[320px] md:min-w-0">
            <EventCard evt={evt} />
          </div>
        ))
      )}
    </div>
  );
}
