import React from 'react';
import { BgImage } from '@/components/shared/BgImage';
import { AnimatedOrb } from '@/components/shared/AnimatedOrb';
import { avigea } from '@/lib/fonts';
import { features } from '../data';

export const FeaturesGrid = React.forwardRef<HTMLElement, {}>((props, ref) => {
  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden z-[2] bg-[#07120b] gpu-section">
      <BgImage src="/images/bg/features.jpg" position="center" />
      <AnimatedOrb className="top-[20%] left-[-5%] w-[400px] h-[400px] blur-[100px]" color="rgba(163,230,53,0.08)" delay={-2} />
      <AnimatedOrb className="bottom-[10%] right-[-5%] w-[350px] h-[350px] blur-[90px]" color="rgba(34,197,94,0.06)" delay={-6} />
      <div className="absolute inset-0 bg-grid-weed opacity-12 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 data-feat-title className={`${avigea.className} text-5xl sm:text-6xl font-normal tracking-tight text-white mb-4`}>
            Todo lo que necesitás, <span className="text-lime-400">en un solo lugar</span>
          </h2>
          <p data-feat-title className="text-zinc-400 text-xl">
            Herramientas potentes, interfaz simple. Diseñado por cultivadores, para cultivadores.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              data-feature
              className="group relative p-7 rounded-3xl border bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full ${f.bg} blur-3xl transition-all duration-500`} />
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  style={{ boxShadow: `0 10px 30px -10px ${f.glow}` }}
                >
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className={`${avigea.className} text-2xl font-normal text-white mb-2`}>{f.title}</h3>
                <p className="text-zinc-400 text-base leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturesGrid.displayName = 'FeaturesGrid';
