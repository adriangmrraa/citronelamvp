import React from 'react';

interface AnimatedOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  className: string;
  color: string;
  delay?: number;
}

export function AnimatedOrb({ className, color, delay = 0, ...props }: AnimatedOrbProps) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none animate-blob ${className}`}
      style={{
        background: color,
        animationDelay: `${delay}s`,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        contain: 'layout style paint',
      }}
      {...props}
    />
  );
}
