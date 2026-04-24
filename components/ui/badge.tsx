import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-lime-400/10 text-lime-400 border-lime-400/20',
    secondary: 'bg-white/[0.05] text-zinc-400 border-white/[0.08]',
    destructive: 'bg-red-500/10 text-red-400 border-red-500/20',
    outline: 'text-zinc-400 border-white/[0.15] bg-transparent',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export { Badge };