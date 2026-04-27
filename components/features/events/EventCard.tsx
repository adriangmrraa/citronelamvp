'use client';

import React from 'react';

export interface EventData {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  img: string;
  attendees: number;
  price: string;
}

interface EventCardProps {
  evt: EventData;
}

export function EventCard({ evt }: EventCardProps) {
  return (
    <div 
      className="min-w-[320px] w-full snap-center rounded-3xl overflow-hidden flex flex-col relative transition-all duration-500 bg-[#07120b] border border-[#a3e635]/20 hover:border-[#a3e635]/40"
    >
      {/* Image 1:1 Aspect Ratio */}
      <div className="aspect-square w-full relative bg-zinc-950">
        <img src={evt.img} alt={evt.title} className="w-full h-full object-cover" />
      </div>

      {/* Bottom Half Info */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <h3 
            className="text-3xl font-normal leading-tight text-[#a3e635] tracking-wide min-h-[4.5rem] flex items-center"
            style={{ fontFamily: 'var(--font-avigea)' }}
          >
            {evt.title}
          </h3>

          <div className="grid grid-cols-2 gap-5 text-[13px] text-white font-medium">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#a3e635]">calendar_month</span>
              <span>{evt.date}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#a3e635]">schedule</span>
              <span>{evt.time}</span>
            </div>
            <div className="flex items-center gap-2.5 col-span-2">
              <span className="material-symbols-outlined text-[20px] text-[#a3e635]">location_on</span>
              <span className="text-white line-clamp-1">{evt.location}</span>
            </div>
          </div>
        </div>

        {/* Footer: Attendees + Button */}
        <div className="flex justify-between items-center pt-3 border-t border-zinc-800/20 mt-auto">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <img 
                key={i} 
                src={`https://i.pravatar.cc/100?img=${(i * evt.id * 5) % 70}`} 
                className="w-8 h-8 rounded-full border-2 border-[#07120b] object-cover"
                alt="Attendee"
              />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#07120b] bg-[#a3e635] flex items-center justify-center z-10 text-black text-[10px] font-bold">
              +{evt.attendees}
            </div>
          </div>

          <button className="bg-transparent text-[#a3e635] px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition-colors border border-zinc-800 hover:border-[#a3e635] hover:bg-zinc-900/40 flex items-center gap-1">
            {evt.price}
          </button>
        </div>
      </div>
    </div>
  );
}
