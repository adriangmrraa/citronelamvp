import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'bg-gradient-to-r from-lime-400 to-green-500 text-[#07120b] font-semibold hover:from-lime-300 hover:to-green-400 hover:shadow-lg hover:shadow-lime-400/30 hover:scale-105 active:scale-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25',
      outline: 'glass-surface text-zinc-300 hover:border-lime-400/25 hover:bg-white/[0.06] hover:text-zinc-50',
      secondary: 'bg-white/[0.06] border border-white/[0.10] text-zinc-300 hover:bg-white/[0.10] hover:text-zinc-50',
      ghost: 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-50',
      link: 'text-lime-400 underline-offset-4 hover:underline hover:text-lime-300',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };