import React from 'react';
import Link from 'next/link';
import { LeafIcon } from '@/components/shared/LeafIcon';

export const Footer = () => {
  return (
    <footer className="relative border-t border-lime-400/10 bg-[#050d07] py-12 z-[2]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 via-green-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.25)]">
              <LeafIcon className="w-5 h-5 text-[#07120b]" />
            </div>
            <span className="font-extrabold text-lg">
              <span className="text-white">Citro</span>
              <span className="text-gradient-weed">nela</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/legal/terms" className="hover:text-lime-300 transition-colors">Términos</Link>
            <Link href="/legal/privacy" className="hover:text-lime-300 transition-colors">Privacidad</Link>
            <Link href="/login" className="hover:text-lime-300 transition-colors">Login</Link>
          </div>
          <p className="text-xs text-zinc-600">&copy; 2026 Citronela. Cultivado con 🌿</p>
        </div>
      </div>
    </footer>
  );
};
