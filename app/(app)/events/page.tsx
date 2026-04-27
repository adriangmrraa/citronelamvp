'use client';

import React, { useState } from 'react';
import { EventsHeader } from '@/components/features/events/EventsHeader';
import { CategoriesRibbon } from '@/components/features/events/CategoriesRibbon';
import { TrendingEvents } from '@/components/features/events/TrendingEvents';
import { UpcomingEvents } from '@/components/features/events/UpcomingEvents';

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-24 font-sans relative overflow-x-hidden">
      {/* Organic High-Tech Background Glows */}
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <main className="px-6 md:px-12 pt-12 space-y-12 relative z-10 max-w-[2000px] mx-auto">
        <EventsHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoriesRibbon />
        
        <div className="space-y-12">
          <TrendingEvents searchTerm={searchTerm} />
          
          {/* Upcoming Events Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 style={{ fontFamily: 'var(--font-avigea)' }} className="text-3xl text-white tracking-wide">Próximos eventos</h2>
              <button className="text-zinc-500 text-sm hover:text-primary transition-colors">Show all</button>
            </div>
            <UpcomingEvents searchTerm={searchTerm} />
          </section>
        </div>
      </main>
    </div>
  );
}
