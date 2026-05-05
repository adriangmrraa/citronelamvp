'use client';

import React from 'react';
import { Community } from '@/constants/communities';

interface CommunityHeaderProps {
  community: Community;
}

export default function CommunityHeader({ community }: CommunityHeaderProps) {
  return (
    <div className="relative w-full h-[360px] md:h-[420px] overflow-hidden group mb-8">
      {/* Banner Image */}
      <div className="absolute inset-0">
        <img 
          src={community.banner} 
          alt={community.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Overlay Gradients - Matching ForumCarousel */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/50 to-black/80" />
      </div>

      {/* Content Area - Positioned identically to ForumCarousel */}
      <div className="absolute inset-0 flex flex-col justify-end pb-12 px-6 md:px-20">
        <div className="max-w-[2000px]">
          <h1 
            style={{ 
              fontFamily: 'var(--font-avigea)', 
              color: '#A3E635',
              textShadow: '4px 4px 10px rgba(0,0,0,0.8)'
            }}
            className="text-4xl md:text-6xl font-normal mb-1 tracking-wide leading-[1.1] normal-case animate-in slide-in-from-left duration-500"
          >
            {community.name}
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 font-medium tracking-wide mb-6 max-w-xl animate-in slide-in-from-left duration-700">
            {community.description}
          </p>

          <div className="animate-in slide-in-from-bottom duration-1000">
            <button className="bg-white text-black px-8 py-2.5 rounded-none font-bold hover:bg-[#A3E635] transition-all duration-300 uppercase text-[10px] tracking-widest shadow-xl transform hover:scale-105 active:scale-95">
              Participar
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A3E635]/30 to-transparent" />
    </div>
  );
}
