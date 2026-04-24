import React from 'react';
import Link from 'next/link';
import { LeafIcon } from '@/components/shared/LeafIcon';
import { avigea } from '@/lib/fonts';

export const Header = React.forwardRef<HTMLElement, {}>((props, ref) => {
  return (
    <header ref={ref} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#07120b]/60 border-b border-lime-400/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 via-green-500 to-emerald-700 flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)] group-hover:scale-110 transition-transform duration-300">
            <LeafIcon className="w-6 h-6 text-[#07120b]" />
          </div>
          <span className={`${avigea.className} text-3xl font-normal tracking-wide`}>
            <span className="text-lime-400 group-hover:text-lime-300 transition-colors duration-300">Citro</span>
            <span className="text-white">nela</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-lime-300 transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="magnetic-btn px-5 py-2.5 rounded-xl font-semibold text-sm text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Registro
          </Link>
        </nav>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
