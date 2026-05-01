import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="glass-surface overflow-hidden rounded-[2rem] border border-white/5 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] sm:aspect-square w-full bg-zinc-900/50" />
      
      {/* Content Skeleton */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <div className="h-4 sm:h-5 bg-zinc-800/50 rounded-lg w-3/4" />
          <div className="h-3 sm:h-4 bg-zinc-800/30 rounded-lg w-1/2" />
        </div>
        
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5">
          <div className="h-2 sm:h-3 bg-zinc-800/30 rounded-full w-16" />
          <div className="h-7 w-7 sm:h-9 sm:w-9 bg-zinc-800/50 rounded-lg sm:rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
