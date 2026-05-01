'use client';

import React from 'react';

export function EventCardSkeleton() {
  return (
    <div className="min-w-[320px] w-full rounded-[2rem] overflow-hidden flex flex-col relative bg-zinc-900/40 border border-white/5 animate-pulse">
      {/* Image Skeleton with Shimmer effect */}
      <div className="aspect-square w-full bg-zinc-800/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Info Skeleton */}
      <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* Title Line */}
          <div className="h-7 bg-zinc-800/80 rounded-full w-3/4" />
          
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-zinc-800/80 rounded-full" />
              <div className="h-3 bg-zinc-800/60 rounded-full w-14" />
            </div>
            {/* Time */}
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-zinc-800/80 rounded-full" />
              <div className="h-3 bg-zinc-800/60 rounded-full w-10" />
            </div>
            {/* Location */}
            <div className="flex items-center gap-3 col-span-2">
              <div className="w-4 h-4 bg-zinc-800/80 rounded-full" />
              <div className="h-3 bg-zinc-800/60 rounded-full w-1/2" />
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="flex justify-between items-center pt-5 border-t border-white/5 mt-auto">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-zinc-800/80 border-2 border-zinc-900" />
            ))}
          </div>
          <div className="h-9 bg-zinc-800/80 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}
