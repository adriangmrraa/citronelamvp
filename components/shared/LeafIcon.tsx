import React from 'react';

interface LeafIconProps {
  className?: string;
}

export function LeafIcon({ className = '' }: LeafIconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden>
      <path d="M32 2c-1 6-4 10-8 13 3-1 6-1 9 0-3 3-5 7-6 12 3-2 6-3 10-3-2 4-3 8-3 13 3-3 7-5 11-6-1 4-2 9-1 14-4-2-8-3-12-3 1 3 3 6 5 8-5-1-9-1-13 1 2-5 1-10-1-14-2 2-5 4-8 5 2-4 3-8 2-12-4 2-8 3-12 3 3-4 4-9 4-13-4 1-9 1-13 0 4-3 7-7 8-12 4 1 9 2 13 1-1-5 0-10 2-14 3 3 6 6 8 10 2-4 4-8 5-12z" />
    </svg>
  );
}
