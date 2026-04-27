'use client';

import React from 'react';
import { EventCard, EventData } from './EventCard';

const trendingEvents: EventData[] = [
  {
    id: 1,
    title: 'Expo Cannabica',
    date: '10 de Julio',
    time: '18hs',
    location: 'Club 24, Córdoba',
    img: '/images/events/1.jpg',
    attendees: 20,
    price: '25 TOKENS'
  },
  {
    id: 2,
    title: 'Terapia Cannabica',
    date: '08 de Febrero',
    time: '10hs',
    location: 'Plaza de la Intendencia, Córdoba',
    img: '/images/events/2.jpg',
    attendees: 45,
    price: 'GRATIS'
  },
  {
    id: 3,
    title: 'Curso de Hidroponia',
    date: '04 de Mayo',
    time: '10hs',
    location: "O'Higgings 585, Córdoba",
    img: '/images/events/3.jpg',
    attendees: 12,
    price: '10 TOKENS'
  }
];

export function TrendingEvents({ searchTerm = "" }: { searchTerm?: string }) {
  const filteredEvents = trendingEvents.filter(evt => 
    evt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10 pb-6 md:pb-0 overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0">
        {filteredEvents.length === 0 ? (
          <div className="min-w-full md:col-span-full h-40 flex items-center justify-center text-zinc-500 bg-zinc-900/30 rounded-[2rem] border border-dashed border-zinc-700 mx-auto w-full">
            No se encontraron eventos.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div key={evt.id} className="snap-center md:snap-align-none min-w-[320px] md:min-w-0">
              <EventCard evt={evt} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
