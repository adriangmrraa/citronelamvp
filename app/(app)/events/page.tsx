'use client';

import React, { useState } from 'react';
import { EventsPageHeader } from '@/components/features/events/EventsPageHeader';
import { CategoriesRibbon } from '@/components/features/events/CategoriesRibbon';
import { EventsCarousel } from '@/components/features/events/EventsCarousel';
import { TrendingEvents } from '@/components/features/events/TrendingEvents';
import { UpcomingEvents } from '@/components/features/events/UpcomingEvents';

import { useSearch } from '@/context/SearchContext';

export default function EventsPage() {
  const { searchTerm } = useSearch();
  const [activeCategory, setActiveCategory] = useState('Todos');

  return (
    <div className="min-h-screen text-zinc-200 pb-24 font-sans">
      <div className="relative z-20">
        {/* Solid Green Header Area - CONTAINS CATEGORIES NOW */}
        <div className="bg-[#A3E635] pt-3 pb-0 px-6 md:px-12 border-b border-[#07120b]/10">
          <div className="max-w-[2000px] mx-auto space-y-2">
            <EventsPageHeader />
            <CategoriesRibbon 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />
          </div>
        </div>

        {/* Gradient Transition Area (Behind Carousel) */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#A3E635] via-[#A3E635] via-40% to-transparent pointer-events-none -z-10" />
          <div className="w-full py-1">
            <EventsCarousel />
          </div>
        </div>
      </div>

      <main className="px-6 md:px-12 pt-6 space-y-12 relative z-10 max-w-[2000px] mx-auto">
        {/* CategoriesRibbon removed from here */}
        
        <div className="space-y-12">
          <section className="space-y-6">
            <h2 style={{ fontFamily: 'var(--font-avigea)' }} className="text-3xl text-white tracking-wide">
              {activeCategory === 'Todos' ? 'Eventos actuales' : `Eventos: ${activeCategory}`}
            </h2>
            <TrendingEvents searchTerm={searchTerm} category={activeCategory} />
          </section>
          
          {/* Upcoming Events Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 style={{ fontFamily: 'var(--font-avigea)' }} className="text-3xl text-white tracking-wide">
                {activeCategory === 'Todos' ? 'Próximos eventos' : `Más de ${activeCategory}`}
              </h2>
              <button className="text-zinc-500 text-sm hover:text-primary transition-colors">Show all</button>
            </div>
            <UpcomingEvents searchTerm={searchTerm} category={activeCategory} />
          </section>
        </div>
      </main>
    </div>
  );
}
