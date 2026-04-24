import React from 'react';
import { AnimatedOrb } from '@/components/shared/AnimatedOrb';
import { ecosystemWords } from '../data';
import { avigea } from '@/lib/fonts';

export const EcosystemBand = React.forwardRef<HTMLElement, {}>((props, ref) => {
  return (
    <section ref={ref} className="relative py-20 border-y border-lime-400/10 overflow-hidden z-[2] bg-[#07120b] gpu-section">
      <AnimatedOrb className="top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] blur-[120px]" color="rgba(163,230,53,0.06)" />
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <p data-eco-word className="text-sm tracking-[0.3em] uppercase text-lime-400/60 mb-8">Un ecosistema completo</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {ecosystemWords.map((w) => (
            <span
              key={w}
              data-eco-word
              className={`${avigea.className} text-2xl sm:text-3xl font-normal text-zinc-600 hover:text-lime-300 transition-all duration-500 cursor-default hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.4)]`}
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
});

EcosystemBand.displayName = 'EcosystemBand';
