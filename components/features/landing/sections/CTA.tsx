import React from 'react';
import Link from 'next/link';
import { BgImage } from '@/components/shared/BgImage';
import { AnimatedOrb } from '@/components/shared/AnimatedOrb';
import { avigea } from '@/lib/fonts';

export const CTA = React.forwardRef<HTMLElement, {}>((props, ref) => {
  return (
    <section ref={ref} className="relative py-28 sm:py-36 overflow-hidden z-[2] bg-[#07120b] gpu-section">
      <BgImage src="/images/bg/cta.jpg" position="center" />
      <AnimatedOrb data-parallax-orb className="top-[-10%] left-[20%] w-[450px] h-[450px] blur-[120px]" color="rgba(163,230,53,0.15)" />
      <AnimatedOrb data-parallax-orb className="bottom-[-10%] right-[20%] w-[450px] h-[450px] blur-[120px]" color="rgba(34,197,94,0.12)" delay={-5} />
      <AnimatedOrb className="top-[30%] right-[40%] w-[250px] h-[250px] blur-[80px]" color="rgba(251,191,36,0.06)" delay={-3} />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 data-cta className={`${avigea.className} text-5xl sm:text-7xl font-normal tracking-tight text-white mb-8 leading-[1.1]`}>
          ¿Listo para subir el nivel de tu <span className="text-lime-400">cultivo</span>?
        </h2>
        <p data-cta className="text-zinc-400 text-xl sm:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Unite a la comunidad de cultivadores más avanzada. Registrate hoy y obtené acceso exclusivo al Market.
        </p>
        <div data-cta className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/register"
            className="group relative px-10 py-5 rounded-2xl font-bold text-lg text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(163,230,53,0.4)] active:scale-95"
          >
            <span className="relative z-10">Empezar ahora gratis</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-5 rounded-2xl font-bold text-lg text-white border border-white/10 hover:bg-white/5 transition-all duration-300"
          >
            Ver demo en vivo
          </Link>
        </div>
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';
