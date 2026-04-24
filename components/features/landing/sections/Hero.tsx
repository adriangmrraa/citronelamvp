import React, { Suspense, lazy } from 'react';
import Link from 'next/link';
import { AnimatedOrb } from '@/components/shared/AnimatedOrb';
import { LeafIcon } from '@/components/shared/LeafIcon';
import { PhoneMockup } from '@/components/shared/PhoneMockup';
import { avigea } from '@/lib/fonts';
import { DashboardScreen } from '../screens/DashboardScreen';
import { heroStats } from '../data';

const HeroScene = lazy(() => import('@/components/landing/Scene3D').then((m) => ({ default: m.HeroScene })));

interface HeroProps {
  textRef: React.RefObject<HTMLDivElement>;
  phoneRef: React.RefObject<HTMLDivElement>;
}

export const Hero = React.forwardRef<HTMLElement, HeroProps>(({ textRef, phoneRef }, ref) => {
  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden pt-20 z-[1]">
      <AnimatedOrb data-parallax-orb className="top-[-10%] left-[-5%] w-[520px] h-[520px] blur-[100px]" color="rgba(163,230,53,0.18)" />
      <AnimatedOrb data-parallax-orb className="top-[20%] right-[-10%] w-[600px] h-[600px] blur-[120px]" color="rgba(34,197,94,0.12)" delay={-4} />
      <AnimatedOrb data-parallax-orb className="bottom-[-10%] left-[30%] w-[480px] h-[480px] blur-[100px]" color="rgba(251,191,36,0.08)" delay={-8} />
      <AnimatedOrb className="top-[40%] left-[50%] w-[300px] h-[300px] blur-[80px]" color="rgba(6,182,212,0.06)" delay={-2} />

      <div className="absolute inset-0 bg-grid-weed opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <Suspense fallback={null}>
        <HeroScene className="opacity-50 lg:opacity-65" />
      </Suspense>

      <LeafIcon className="absolute top-28 left-[8%] w-20 h-20 text-lime-400/[0.06] animate-float rotate-12" />
      <LeafIcon className="absolute top-[55%] right-[5%] w-28 h-28 text-emerald-400/[0.04] animate-float-slow -rotate-12" />
      <LeafIcon className="absolute bottom-[20%] left-[18%] w-14 h-14 text-amber-400/[0.05] animate-float [animation-delay:-3s] rotate-45" />

      <div ref={textRef} className="relative max-w-3xl mx-auto px-6 w-full text-center z-10">
        <h1 data-hero-text className={`${avigea.className} text-6xl sm:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.05] mb-6`}>
          Cultivá tu{' '}
          <br className="hidden sm:block" />
          <span className="relative inline-block">
            <span className="text-lime-400">ecosistema</span>
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-lime-400/50"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M2 7 Q 50 -2 100 6 T 198 5" />
            </svg>
          </span>
        </h1>
        <p data-hero-text className="text-xl sm:text-2xl text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
          La plataforma definitiva para gestionar tus cultivos hidropónicos. Registrá, monitoreá y hacé crecer tus
          plantas con control total — <span className="text-lime-300 font-medium">del esqueje a la cosecha</span>.
        </p>
        <div data-hero-text className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="magnetic-btn group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 hover:shadow-[0_0_40px_rgba(163,230,53,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Comenzar ahora{' '}
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-lg text-zinc-200 border border-zinc-700 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-800/60 hover:border-lime-400/40 hover:text-lime-300 transition-all duration-300"
          >
            Ya tengo cuenta
          </Link>
        </div>
        <div data-hero-text className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {heroStats.map((s) => (
            <div
              key={s.l}
              className="group p-3 rounded-xl border border-lime-400/10 bg-white/[0.02] backdrop-blur-sm hover:border-lime-400/30 hover:bg-lime-400/5 transition-all duration-300"
            >
              <div className={`${avigea.className} text-3xl font-normal text-lime-400`}>{s.n}</div>
              <div className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={phoneRef}
        className="fixed inset-0 z-20 flex items-center justify-center will-change-transform pointer-events-none opacity-0"
        style={{ perspective: '1200px' }}
      >
        <div className="animate-float-phone pointer-events-auto">
          <PhoneMockup glowColor="rgba(163,230,53,0.18)">
            <DashboardScreen />
          </PhoneMockup>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in [animation-delay:2s]">
        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-zinc-600 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-lime-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
