import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function PhoneMockup({ children, className = '', glowColor = 'rgba(163,230,53,0.2)' }: PhoneMockupProps) {
  return (
    <div className={`relative will-change-transform ${className}`}>
      <div
        className="phone-glow absolute inset-0 -z-10 rounded-[50px] blur-3xl scale-125 opacity-50"
        style={{ background: glowColor }}
      />
      <div className="relative w-[280px] h-[580px] rounded-[42px] border-[3px] border-zinc-700/80 bg-[#0a0a0a] shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_60px_rgba(163,230,53,0.08)] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[26px] bg-[#0a0a0a] rounded-b-2xl z-20" />
        <div className="absolute top-[2px] left-0 right-0 h-7 flex items-center justify-between px-7 z-20 text-[9px] font-semibold text-white/50">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
              <rect x="0" y="4" width="2" height="4" rx="0.5" />
              <rect x="3" y="2.5" width="2" height="5.5" rx="0.5" />
              <rect x="6" y="1" width="2" height="7" rx="0.5" />
              <rect x="9" y="0" width="2" height="8" rx="0.5" />
            </svg>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="currentColor">
              <rect x="0.5" y="0.5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
              <rect x="12" y="2.5" width="1.5" height="3" rx="0.5" />
              <rect x="1.5" y="1.5" width="9" height="5" rx="0.8" />
            </svg>
          </div>
        </div>
        <div className="relative w-full h-full pt-7 overflow-hidden bg-[#07120b]">{children}</div>
      </div>
    </div>
  );
}
