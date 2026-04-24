import React from 'react';
import { BgImage } from '@/components/shared/BgImage';
import { AnimatedOrb } from '@/components/shared/AnimatedOrb';
import { PhoneMockup } from '@/components/shared/PhoneMockup';
import { avigea } from '@/lib/fonts';
import { panelConfig } from '../data';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CultivoScreen } from '../screens/CultivoScreen';
import { MarketScreen } from '../screens/MarketScreen';
import { CommunityScreen } from '../screens/CommunityScreen';

const screenComponents = [DashboardScreen, CultivoScreen, MarketScreen, CommunityScreen];

interface HorizontalShowcaseProps {
  trackRef: React.RefObject<HTMLDivElement>;
}

export const HorizontalShowcase = React.forwardRef<HTMLElement, HorizontalShowcaseProps>(({ trackRef }, ref) => {
  return (
    <section ref={ref} className="relative overflow-hidden z-[2] bg-[#07120b]/95 backdrop-blur-xl border-t border-lime-400/10 shadow-[0_-40px_80px_rgba(7,18,11,0.9)]">
      <div ref={trackRef} className="flex" style={{ width: `${panelConfig.length * 100}vw` }}>
        {panelConfig.map((panel, i) => {
          const Screen = screenComponents[i];
          return (
            <div
              key={i}
              data-panel
              className="relative w-screen h-screen flex-shrink-0 flex items-center overflow-hidden"
            >
              {/* Background photo */}
              <BgImage src={panel.bgImage} />
              
              {/* Per-panel animated background */}
              <div className="absolute inset-0 pointer-events-none">
                <AnimatedOrb className="top-[10%] left-[15%] w-[500px] h-[500px] blur-[120px]" color={panel.orbColor} delay={i * -3} />
                <AnimatedOrb className="bottom-[10%] right-[15%] w-[400px] h-[400px] blur-[100px]" color={panel.orbColor2} delay={i * -5} />
                <AnimatedOrb className="top-[50%] left-[60%] w-[300px] h-[300px] blur-[90px]" color={panel.orbColor} delay={i * -7} />
              </div>
              <div className="absolute inset-0 bg-grid-weed opacity-8 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_65%)]" />

              <div className={`relative max-w-7xl mx-auto px-6 sm:px-12 w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
                {/* Text */}
                <div className={`${i % 2 === 1 ? 'lg:order-2' : ''} text-center lg:text-left`}>
                  <h2 data-panel-text className={`${avigea.className} text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white mb-5 leading-tight`}>
                    {panel.title}<span className="text-lime-400">{panel.hl}</span>{panel.end}
                  </h2>
                  <p data-panel-text className="text-zinc-400 text-xl max-w-md leading-relaxed mb-6">{panel.desc}</p>
                  <div data-panel-text className="flex flex-wrap gap-2.5">
                    {panel.chips.map((c) => (
                      <span key={c} className={`${avigea.className} px-3 py-1.5 text-sm font-normal rounded-full border ${panel.chipCls}`}>{c}</span>
                    ))}
                  </div>
                </div>
                {/* Phone */}
                <div className={`flex justify-center ${i % 2 === 1 ? 'lg:order-1 lg:justify-start' : 'lg:justify-end'}`}>
                  <div data-panel-phone className="will-change-transform" style={{ perspective: '1200px' }}>
                    <div className="animate-float-phone">
                      <PhoneMockup glowColor={panel.glow}>
                        <Screen />
                      </PhoneMockup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

HorizontalShowcase.displayName = 'HorizontalShowcase';
