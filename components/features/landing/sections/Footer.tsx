import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { avigea } from '@/lib/fonts';

export const Footer = () => {
  return (
    <footer className="relative border-t border-lime-400/10 bg-[#050d07] py-12 z-[2]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-0.5">
            <div className="relative w-11 h-11">
              <Image 
                src="/images/citrologoficial.svg" 
                alt="Citronela Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className={`${avigea.className} text-2xl font-normal tracking-wide`}>
              <span className="text-lime-400">Citro</span><span className="text-white">nela</span>
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
