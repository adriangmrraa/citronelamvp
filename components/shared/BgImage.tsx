import React from 'react';

interface BgImageProps {
  src: string;
  className?: string;
  position?: string;
}

export function BgImage({ src, className = '', position = 'center' }: BgImageProps) {
  return (
    <div
      data-bg-image
      className={`absolute inset-0 pointer-events-none opacity-[0.07] animate-bg-drift ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      }}
    />
  );
}
