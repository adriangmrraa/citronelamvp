'use client';

import { useEffect, useRef, lazy, Suspense } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = lazy(() => import('./Scene3D').then((m) => ({ default: m.HeroScene })));

/* ================================================================
   PHONE MOCKUP
   ================================================================ */
function PhoneMockup({
  children,
  className = '',
  glowColor = 'rgba(163,230,53,0.2)',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  return (
    <div className={`relative will-change-transform ${className}`}>
      <div className="phone-glow absolute inset-0 -z-10 rounded-[50px] blur-3xl scale-125 opacity-50" style={{ background: glowColor }} />
      <div className="relative w-[280px] h-[580px] rounded-[42px] border-[3px] border-zinc-700/80 bg-[#0a0a0a] shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_60px_rgba(163,230,53,0.08)] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[26px] bg-[#0a0a0a] rounded-b-2xl z-20" />
        <div className="absolute top-[2px] left-0 right-0 h-7 flex items-center justify-between px-7 z-20 text-[9px] font-semibold text-white/50">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor"><rect x="0" y="4" width="2" height="4" rx="0.5"/><rect x="3" y="2.5" width="2" height="5.5" rx="0.5"/><rect x="6" y="1" width="2" height="7" rx="0.5"/><rect x="9" y="0" width="2" height="8" rx="0.5"/></svg>
            <svg width="14" height="8" viewBox="0 0 14 8" fill="currentColor"><rect x="0.5" y="0.5" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="0.8" fill="none"/><rect x="12" y="2.5" width="1.5" height="3" rx="0.5"/><rect x="1.5" y="1.5" width="9" height="5" rx="0.8"/></svg>
          </div>
        </div>
        <div className="relative w-full h-full pt-7 overflow-hidden bg-[#07120b]">{children}</div>
      </div>
    </div>
  );
}

/* ================================================================
   ANIMATED ORB — Floating gradient orb for backgrounds
   ================================================================ */
function AnimatedOrb({ className, color, delay = 0, ...props }: { className: string; color: string; delay?: number; [key: string]: any }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none animate-blob ${className}`}
      style={{ background: color, animationDelay: `${delay}s` }}
      {...props}
    />
  );
}

/* ================================================================
   BACKGROUND IMAGE — Parallax image with opacity and movement
   ================================================================ */
function BgImage({ src, className = '', position = 'center' }: { src: string; className?: string; position?: string }) {
  return (
    <div
      data-bg-image
      className={`absolute inset-0 pointer-events-none opacity-[0.07] animate-bg-drift ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      }}
    />
  );
}

/* ================================================================
   SCREENS (compact)
   ================================================================ */
function DashboardScreen() {
  return (
    <div className="h-full px-4 pt-4 text-white text-[11px] space-y-3">
      <div data-phone-item className="flex items-center justify-between">
        <div><p className="text-[9px] text-zinc-500 uppercase tracking-wider">Bienvenido</p><p className="text-[14px] font-bold">Hola, Adrian</p></div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-[12px] font-bold text-[#07120b]">A</div>
      </div>
      <div data-phone-item className="grid grid-cols-3 gap-2">
        {[{ n: '3', l: 'Cultivos', c: 'from-lime-400/20 to-lime-400/5' }, { n: '12', l: 'Registros', c: 'from-emerald-400/20 to-emerald-400/5' }, { n: '5', l: 'Pedidos', c: 'from-amber-400/20 to-amber-400/5' }].map((s) => (
          <div key={s.l} className={`p-2.5 rounded-xl bg-gradient-to-b ${s.c} border border-white/5`}><p className="text-[16px] font-black">{s.n}</p><p className="text-[8px] text-zinc-400 uppercase tracking-wider">{s.l}</p></div>
        ))}
      </div>
      <div><p data-phone-item className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Cultivos Activos</p>
        {[{ name: 'Blue Dream', phase: 'Vegetativo', week: 'Sem 4', ph: '6.2', ec: '1.4' }, { name: 'OG Kush', phase: 'Floración', week: 'Sem 7', ph: '6.0', ec: '1.8' }, { name: 'Amnesia Haze', phase: 'Secado', week: 'Sem 12', ph: '—', ec: '—' }].map((c) => (
          <div data-phone-item key={c.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 mb-1.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-lime-400/30 to-green-600/30 flex items-center justify-center text-[16px]">🌱</div>
            <div className="flex-1 min-w-0"><p className="text-[11px] font-semibold truncate">{c.name}</p><p className="text-[9px] text-lime-400/70">{c.phase} · {c.week}</p></div>
            <div className="text-right"><p className="text-[9px] text-zinc-500">pH {c.ph}</p><p className="text-[9px] text-zinc-500">EC {c.ec}</p></div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-[#0a0a0a]/90 backdrop-blur-sm border-t border-white/5 flex items-center justify-around px-2">
        {['🏠', '🌱', '🛒', '👥', '👤'].map((icon, i) => (
          <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? 'text-lime-400' : 'text-zinc-500'}`}><span className="text-[16px]">{icon}</span><span className="text-[7px]">{['Inicio', 'Cultivo', 'Mercado', 'Social', 'Perfil'][i]}</span></div>
        ))}
      </div>
    </div>
  );
}

function CultivoScreen() {
  return (
    <div className="h-full px-4 pt-3 text-white text-[11px]">
      <div data-phone-item className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[10px]">←</div>
        <p className="text-[13px] font-bold flex-1">Blue Dream</p>
        <span className="px-2 py-0.5 rounded-full bg-lime-400/15 text-lime-400 text-[8px] font-semibold">Vegetativo</span>
      </div>
      <div data-phone-item className="relative h-28 rounded-2xl bg-gradient-to-b from-lime-400/10 to-transparent border border-lime-400/10 flex items-center justify-center mb-3 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(163,230,53,0.15),transparent_70%)]" />
        <span className="text-[48px] relative z-10">🌿</span>
        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[8px] text-zinc-400"><span>Semana 4 de 8</span><span>50%</span></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5"><div data-gauge className="h-full w-0 bg-gradient-to-r from-lime-400 to-green-500 rounded-full" /></div>
      </div>
      <div data-phone-item className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between mb-1.5"><span className="text-[9px] text-zinc-400 uppercase">pH</span><span className="text-[14px] font-black text-lime-400">6.2</span></div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div data-gauge className="h-full w-0 rounded-full bg-gradient-to-r from-yellow-400 via-lime-400 to-green-500" /></div>
          <p className="text-[7px] text-emerald-400 mt-1">Rango ideal</p>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center justify-between mb-1.5"><span className="text-[9px] text-zinc-400 uppercase">EC</span><span className="text-[14px] font-black text-emerald-400">1.4</span></div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div data-gauge className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400" /></div>
          <p className="text-[7px] text-emerald-400 mt-1">Rango ideal</p>
        </div>
      </div>
      <div data-phone-item className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-3">
        <p className="text-[9px] text-zinc-400 uppercase tracking-wider mb-2">Nutrientes (ml/L)</p>
        <div className="grid grid-cols-3 gap-2">
          {[{ n: 'N', v: '4.2', c: 'text-lime-400' }, { n: 'P', v: '1.8', c: 'text-amber-400' }, { n: 'K', v: '3.5', c: 'text-cyan-400' }].map((x) => (
            <div key={x.n} className="text-center"><p className={`text-[13px] font-black ${x.c}`}>{x.v}</p><p className="text-[8px] text-zinc-500">{x.n}</p></div>
          ))}
        </div>
      </div>
      <p data-phone-item className="text-[9px] text-zinc-400 uppercase tracking-wider mb-1.5">Registros</p>
      {[{ d: 'Hoy', n: 'Ajuste de pH a 6.2', t: '14:30' }, { d: 'Ayer', n: 'Cambio solución nutritiva', t: '09:15' }].map((l) => (
        <div data-phone-item key={l.d} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5 mb-1"><div className="w-1 h-6 rounded-full bg-lime-400/40" /><div className="flex-1"><p className="text-[10px] font-medium">{l.n}</p><p className="text-[8px] text-zinc-500">{l.d} · {l.t}</p></div></div>
      ))}
    </div>
  );
}

function MarketScreen() {
  return (
    <div className="h-full px-4 pt-3 text-white text-[11px]">
      <div data-phone-item className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.05] border border-white/5 mb-3">
        <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span className="text-zinc-500 text-[10px]">Buscar productos...</span>
      </div>
      <div data-phone-item className="flex gap-1.5 mb-3 overflow-hidden">
        {['Todo', 'Genéticas', 'Nutrientes', 'Equipos'].map((f, i) => (
          <span key={f} className={`shrink-0 px-2.5 py-1 rounded-full text-[8px] font-semibold ${i === 0 ? 'bg-lime-400 text-[#07120b]' : 'bg-white/5 text-zinc-400 border border-white/5'}`}>{f}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[{ name: 'Blue Dream Seeds', price: '$25', r: 4.8, e: '🌱', s: '142' }, { name: 'Flora Trio Pack', price: '$38', r: 4.6, e: '🧪', s: '89' }, { name: 'LED Grow 600W', price: '$185', r: 4.9, e: '💡', s: '64' }, { name: 'Coco Coir 50L', price: '$12', r: 4.5, e: '🥥', s: '210' }, { name: 'pH Meter Pro', price: '$45', r: 4.7, e: '📊', s: '156' }, { name: 'Air Pump Kit', price: '$28', r: 4.4, e: '💨', s: '93' }].map((p) => (
          <div data-phone-item key={p.name} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="h-14 rounded-lg bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-center text-[24px] mb-2">{p.e}</div>
            <p className="text-[10px] font-semibold truncate">{p.name}</p>
            <div className="flex items-center justify-between mt-1"><span className="text-[12px] font-black text-lime-400">{p.price}</span><div className="flex items-center gap-0.5"><span className="text-[8px] text-amber-400">★</span><span className="text-[8px] text-zinc-400">{p.r}</span></div></div>
            <p className="text-[7px] text-zinc-500 mt-0.5">{p.s} vendidos</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityScreen() {
  return (
    <div className="h-full px-4 pt-3 text-white text-[11px]">
      <div data-phone-item className="flex items-center justify-between mb-3">
        <p className="text-[14px] font-bold">Comunidad</p>
        <div className="px-2.5 py-1 rounded-lg bg-lime-400/15 text-lime-400 text-[9px] font-semibold">+ Publicar</div>
      </div>
      <div data-phone-item className="flex gap-1.5 mb-3 overflow-hidden">
        {['Todos', 'Tips', 'Investigación', 'Dudas'].map((c, i) => (
          <span key={c} className={`shrink-0 px-2.5 py-1 rounded-full text-[8px] font-semibold ${i === 0 ? 'bg-lime-400 text-[#07120b]' : 'bg-white/5 text-zinc-400 border border-white/5'}`}>{c}</span>
        ))}
      </div>
      {[
        { a: 'María G.', av: '🧑‍🌾', t: '2h', title: 'Mi primera cosecha!', c: 'Después de 12 semanas, finalmente corté mi Blue Dream...', l: 24, cm: 8, tag: 'Showcase', tc: 'text-emerald-400 bg-emerald-400/10' },
        { a: 'Carlos R.', av: '👨‍🔬', t: '5h', title: 'Tips pH estable en floración', c: 'Un método con resultados increíbles. La clave está en la frecuencia...', l: 15, cm: 12, tag: 'Tips', tc: 'text-amber-400 bg-amber-400/10' },
        { a: 'Laura M.', av: '👩‍🔬', t: '1d', title: 'Espectro LED y terpenos', c: 'Resultados de mi investigación sobre espectros de luz...', l: 42, cm: 19, tag: 'Research', tc: 'text-cyan-400 bg-cyan-400/10' },
      ].map((p) => (
        <div data-phone-item key={p.title} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lime-400/30 to-green-600/30 flex items-center justify-center text-[12px]">{p.av}</div>
            <div className="flex-1"><p className="text-[10px] font-semibold">{p.a}</p><p className="text-[8px] text-zinc-500">{p.t}</p></div>
            <span className={`px-1.5 py-0.5 rounded text-[7px] font-semibold ${p.tc}`}>{p.tag}</span>
          </div>
          <p className="text-[10px] font-semibold mb-1">{p.title}</p>
          <p className="text-[9px] text-zinc-400 leading-relaxed line-clamp-2">{p.c}</p>
          <div className="flex items-center gap-4 mt-2 text-[9px] text-zinc-500"><span>♥ {p.l}</span><span>💬 {p.cm}</span></div>
        </div>
      ))}
    </div>
  );
}

function LeafIcon({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 64 64" className={className} fill="currentColor" aria-hidden><path d="M32 2c-1 6-4 10-8 13 3-1 6-1 9 0-3 3-5 7-6 12 3-2 6-3 10-3-2 4-3 8-3 13 3-3 7-5 11-6-1 4-2 9-1 14-4-2-8-3-12-3 1 3 3 6 5 8-5-1-9-1-13 1 2-5 1-10-1-14-2 2-5 4-8 5 2-4 3-8 2-12-4 2-8 3-12 3 3-4 4-9 4-13-4 1-9 1-13 0 4-3 7-7 8-12 4 1 9 2 13 1-1-5 0-10 2-14 3 3 6 6 8 10 2-4 4-8 5-12z" /></svg>;
}

/* ================================================================
   PANEL CONFIG
   ================================================================ */
const panelConfig = [
  { tag: 'Gestión de Cultivo', tagCls: 'bg-lime-400/10 border-lime-400/20 text-lime-300', title: 'Control ', hl: 'total', end: ' de cada planta', desc: 'Registrá pH, EC, nutrientes y fases de crecimiento. Nuestra IA te sugiere correcciones en tiempo real para maximizar tu cosecha.', chips: ['pH/EC', 'IA', 'Fases', 'Lab Reports'], chipCls: 'bg-lime-400/10 text-lime-300 border-lime-400/20', glow: 'rgba(163,230,53,0.2)', orbColor: 'rgba(163,230,53,0.12)', orbColor2: 'rgba(34,197,94,0.08)', bgImage: '/images/bg/cultivo.jpg' },
  { tag: 'Marketplace', tagCls: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300', title: 'Tu ', hl: 'mercado', end: ' cannábico', desc: 'Comprá y vendé genéticas, nutrientes y equipos. Reseñas verificadas, informes de laboratorio y reputación de vendedores.', chips: ['Genéticas', 'Nutrientes', 'Equipos', 'Reseñas'], chipCls: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20', glow: 'rgba(16,185,129,0.2)', orbColor: 'rgba(6,182,212,0.1)', orbColor2: 'rgba(16,185,129,0.08)', bgImage: '/images/bg/market.jpg' },
  { tag: 'Comunidad', tagCls: 'bg-amber-400/10 border-amber-400/20 text-amber-300', title: 'Compartí y ', hl: 'aprendé', end: '', desc: 'Debates, papers, investigaciones y eventos. Una comunidad de cultivadores que comparte conocimiento y experiencia real.', chips: ['Debates', 'Papers', 'Eventos', 'Tips'], chipCls: 'bg-amber-400/10 text-amber-300 border-amber-400/20', glow: 'rgba(251,191,36,0.15)', orbColor: 'rgba(251,191,36,0.08)', orbColor2: 'rgba(245,158,11,0.05)', bgImage: '/images/bg/community.jpg' },
];
const screenComponents = [CultivoScreen, MarketScreen, CommunityScreen];

/* ================================================================
   FEATURE DATA
   ================================================================ */
const features = [
  { icon: '🌱', title: 'Tracking de Cultivos', desc: 'Registrá cada bucket con log semanal de pH, EC, nutrientes y fases.', gradient: 'from-lime-300 to-green-600', glow: 'rgba(163,230,53,0.3)', border: 'border-lime-400/15 hover:border-lime-400/40', bg: 'bg-lime-400/10 group-hover:bg-lime-400/25' },
  { icon: '🧪', title: 'Lab Reports', desc: 'Informes de laboratorio verificados. Trazabilidad del esqueje a la cosecha.', gradient: 'from-emerald-300 to-teal-600', glow: 'rgba(16,185,129,0.3)', border: 'border-emerald-400/15 hover:border-emerald-400/40', bg: 'bg-emerald-400/10 group-hover:bg-emerald-400/25' },
  { icon: '🤖', title: 'IA Integrada', desc: 'Sugerencias de pH/EC y nutrientes basadas en la fase de tu cultivo.', gradient: 'from-cyan-300 to-blue-600', glow: 'rgba(6,182,212,0.3)', border: 'border-cyan-400/15 hover:border-cyan-400/40', bg: 'bg-cyan-400/10 group-hover:bg-cyan-400/25' },
  { icon: '🛒', title: 'Marketplace', desc: 'Comprá y vendé genéticas, nutrientes y equipos con reseñas reales.', gradient: 'from-amber-300 to-orange-600', glow: 'rgba(251,191,36,0.3)', border: 'border-amber-400/15 hover:border-amber-400/40', bg: 'bg-amber-400/10 group-hover:bg-amber-400/25' },
  { icon: '📊', title: 'Panel de Admin', desc: 'Dashboard con KPIs, gestión de usuarios, tokens y transacciones.', gradient: 'from-violet-300 to-purple-600', glow: 'rgba(139,92,246,0.3)', border: 'border-violet-400/15 hover:border-violet-400/40', bg: 'bg-violet-400/10 group-hover:bg-violet-400/25' },
  { icon: '🎪', title: 'Eventos', desc: 'Organizá y descubrí eventos, clases y meetups con reservas integradas.', gradient: 'from-rose-300 to-pink-600', glow: 'rgba(244,63,94,0.3)', border: 'border-rose-400/15 hover:border-rose-400/40', bg: 'bg-rose-400/10 group-hover:bg-rose-400/25' },
];

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroPhoneRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const ecosystemRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    /* -------- Lenis -------- */
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {

      /* ======================================================
         HERO
         ====================================================== */

      // Text entrance — stagger on load
      if (heroTextRef.current) {
        gsap.from(heroTextRef.current.querySelectorAll('[data-hero-text]'), {
          y: 80, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out',
        });
      }

      // Phone — starts hidden, FIXED in center, enters on SCROLL
      if (heroPhoneRef.current && heroRef.current) {
        // Initial state: hidden below center
        gsap.set(heroPhoneRef.current, { y: 250, scale: 0.4, rotateY: -25, opacity: 0 });
        const items = heroPhoneRef.current.querySelectorAll('[data-phone-item]');
        gsap.set(items, { y: 20, opacity: 0 });

        // Phase 1: Text fades out + phone enters center (scroll 0-40%)
        const phase1 = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=40%',
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        });
        // Text exits
        phase1.to(heroTextRef.current, { y: -120, opacity: 0, duration: 0.5 });
        // Phone enters to center
        phase1.to(heroPhoneRef.current, { y: 0, scale: 1, rotateY: 0, opacity: 1, duration: 0.7 }, '<0.1');
        // Phone items stagger in
        phase1.to(items, { y: 0, opacity: 1, stagger: 0.03, duration: 0.3 }, '-=0.2');

        // Phase 2: Phone stays visible, then gently fades out before showcase
        gsap.to(heroPhoneRef.current, {
          y: -150, scale: 0.85, opacity: 0,
          scrollTrigger: {
            trigger: horizontalWrapperRef.current,
            start: 'top 70%',
            end: 'top 15%',
            scrub: 1.5,
          },
        });
      }

      // Background orbs parallax
      if (heroRef.current) {
        heroRef.current.querySelectorAll('[data-parallax-orb]').forEach((orb, i) => {
          gsap.to(orb, {
            y: -80 - i * 40,
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 },
          });
        });
      }

      /* ======================================================
         HORIZONTAL SHOWCASE
         ====================================================== */

      if (horizontalWrapperRef.current && horizontalTrackRef.current) {
        const track = horizontalTrackRef.current;
        const panelEls = track.querySelectorAll<HTMLElement>('[data-panel]');

        // Set initial states for ALL panel content
        panelEls.forEach((panel) => {
          gsap.set(panel.querySelectorAll('[data-panel-text]'), { y: 60, opacity: 0 });
          const phone = panel.querySelector('[data-panel-phone]');
          if (phone) gsap.set(phone, { scale: 0.5, opacity: 0, rotateY: -20 });
          gsap.set(panel.querySelectorAll('[data-phone-item]'), { y: 15, opacity: 0 });
          gsap.set(panel.querySelectorAll('[data-gauge]'), { width: '0%' });
        });

        // Horizontal scroll tween
        const scrollEnd = track.scrollWidth - window.innerWidth;
        const horizontalTween = gsap.to(track, {
          x: -scrollEnd,
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalWrapperRef.current,
            start: 'top top',
            end: () => `+=${scrollEnd}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // First panel — animate when horizontal wrapper enters viewport
        const firstPanel = panelEls[0];
        if (firstPanel) {
          ScrollTrigger.create({
            trigger: horizontalWrapperRef.current,
            start: 'top 70%',
            onEnter: () => {
              const tl = gsap.timeline();
              tl.to(firstPanel.querySelectorAll('[data-panel-text]'), { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out' });
              const phone = firstPanel.querySelector('[data-panel-phone]');
              if (phone) tl.to(phone, { scale: 1, opacity: 1, rotateY: 0, duration: 1.2, ease: 'power3.out' }, '<0.2');
              tl.to(firstPanel.querySelectorAll('[data-phone-item]'), { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, '<0.4');
              tl.to(firstPanel.querySelectorAll('[data-gauge]'), { width: '60%', duration: 1, ease: 'power2.out' }, '<0.2');
            },
            once: true,
          });
        }

        // Subsequent panels — animate via containerAnimation
        panelEls.forEach((panel, i) => {
          if (i === 0) return;
          const phone = panel.querySelector('[data-panel-phone]');
          const textEls = panel.querySelectorAll('[data-panel-text]');
          const phoneItems = panel.querySelectorAll('[data-phone-item]');
          const gauges = panel.querySelectorAll('[data-gauge]');
          const fromRight = i % 2 === 0;

          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: horizontalTween,
            start: 'left 75%',
            onEnter: () => {
              const tl = gsap.timeline();
              tl.to(textEls, { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'power3.out' });
              if (phone) {
                gsap.set(phone, { x: fromRight ? 150 : -150, rotateY: fromRight ? -20 : 20 });
                tl.to(phone, { x: 0, scale: 1, opacity: 1, rotateY: 0, duration: 1.2, ease: 'power3.out' }, '<0.15');
              }
              tl.to(phoneItems, { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'power2.out' }, '<0.4');
              if (gauges.length) tl.to(gauges, { width: '55%', duration: 0.8, ease: 'power2.out' }, '<0.2');
            },
            once: true,
          });
        });
      }

      /* ======================================================
         FEATURES
         ====================================================== */

      if (featuresRef.current) {
        // Title animation
        const titleEls = featuresRef.current.querySelectorAll('[data-feat-title]');
        gsap.from(titleEls, {
          y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });

        // Cards — IMPORTANT: use immediateRender false
        const cards = featuresRef.current.querySelectorAll('[data-feature]');
        gsap.from(cards, {
          y: 80, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: cards[0]?.parentElement, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      /* ======================================================
         ECOSYSTEM BAND
         ====================================================== */

      if (ecosystemRef.current) {
        const words = ecosystemRef.current.querySelectorAll('[data-eco-word]');
        gsap.from(words, {
          y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: ecosystemRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      /* ======================================================
         CTA
         ====================================================== */

      if (ctaRef.current) {
        gsap.from(ctaRef.current.querySelectorAll('[data-cta]'), {
          y: 60, opacity: 0, scale: 0.95, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });

        // CTA background orbs
        ctaRef.current.querySelectorAll('[data-parallax-orb]').forEach((orb, i) => {
          gsap.to(orb, {
            y: -50 - i * 30, x: i % 2 === 0 ? 30 : -30,
            scrollTrigger: { trigger: ctaRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          });
        });
      }

      // Refresh after everything is set up
      ScrollTrigger.refresh();

    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div ref={containerRef} className="bg-[#07120b] text-zinc-100 overflow-x-hidden">

      {/* ============ HEADER ============ */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#07120b]/60 border-b border-lime-400/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 via-green-500 to-emerald-700 flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.3)] group-hover:scale-110 transition-transform duration-300">
              <LeafIcon className="w-6 h-6 text-[#07120b]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight"><span className="text-white">Citro</span><span className="text-gradient-weed">nela</span></span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-lime-300 transition-colors">Login</Link>
            <Link href="/register" className="magnetic-btn px-5 py-2.5 rounded-xl font-semibold text-sm text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:scale-105 active:scale-95 transition-all duration-300">Registro</Link>
          </nav>
        </div>
      </header>

      {/* ============ PARALLAX FIXED BACKGROUND ============ */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Image with Ken Burns cinematic zoom */}
        <div
          className="absolute inset-0 animate-ken-burns"
          style={{
            backgroundImage: 'url(/images/imagen-parallax.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#07120b]/60" />
        {/* Bottom gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07120b] via-transparent to-[#07120b]/40" />
      </div>

      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 z-[1]">
        {/* Animated background orbs */}
        <AnimatedOrb data-parallax-orb className="top-[-10%] left-[-5%] w-[520px] h-[520px] blur-[100px]" color="rgba(163,230,53,0.18)" />
        <AnimatedOrb data-parallax-orb className="top-[20%] right-[-10%] w-[600px] h-[600px] blur-[120px]" color="rgba(34,197,94,0.12)" delay={-4} />
        <AnimatedOrb data-parallax-orb className="bottom-[-10%] left-[30%] w-[480px] h-[480px] blur-[100px]" color="rgba(251,191,36,0.08)" delay={-8} />
        <AnimatedOrb className="top-[40%] left-[50%] w-[300px] h-[300px] blur-[80px]" color="rgba(6,182,212,0.06)" delay={-2} />

        <div className="absolute inset-0 bg-grid-weed opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        {/* 3D Scene */}
        <Suspense fallback={null}><HeroScene className="opacity-50 lg:opacity-65" /></Suspense>

        {/* Floating leaves */}
        <LeafIcon className="absolute top-28 left-[8%] w-20 h-20 text-lime-400/[0.06] animate-float rotate-12" />
        <LeafIcon className="absolute top-[55%] right-[5%] w-28 h-28 text-emerald-400/[0.04] animate-float-slow -rotate-12" />
        <LeafIcon className="absolute bottom-[20%] left-[18%] w-14 h-14 text-amber-400/[0.05] animate-float [animation-delay:-3s] rotate-45" />

        {/* Text — centered, will scroll away */}
        <div ref={heroTextRef} className="relative max-w-3xl mx-auto px-6 w-full text-center z-10">
          <div data-hero-text className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/5 backdrop-blur-sm mb-8">
            <span className="relative flex w-2 h-2"><span className="absolute inline-flex w-full h-full rounded-full bg-lime-400 opacity-75 animate-ping" /><span className="relative inline-flex w-2 h-2 rounded-full bg-lime-400" /></span>
            <span className="text-xs sm:text-sm font-medium text-lime-300 tracking-wide uppercase">Plataforma de cultivo</span>
          </div>
          <h1 data-hero-text className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Cultivá tu{' '}<br className="hidden sm:block" />
            <span className="relative inline-block"><span className="text-gradient-weed">ecosistema</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-lime-400/50" viewBox="0 0 200 12" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M2 7 Q 50 -2 100 6 T 198 5" /></svg>
            </span>
          </h1>
          <p data-hero-text className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
            La plataforma definitiva para gestionar tus cultivos hidropónicos. Registrá, monitoreá y hacé crecer tus plantas con control total — <span className="text-lime-300 font-medium">del esqueje a la cosecha</span>.
          </p>
          <div data-hero-text className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="magnetic-btn group w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 hover:shadow-[0_0_40px_rgba(163,230,53,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
              Comenzar ahora <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-zinc-200 border border-zinc-700 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-800/60 hover:border-lime-400/40 hover:text-lime-300 transition-all duration-300">Ya tengo cuenta</Link>
          </div>
          <div data-hero-text className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[{ n: '150+', l: 'Cultivadores' }, { n: '24/7', l: 'Monitoreo' }, { n: '100%', l: 'Trazabilidad' }].map((s) => (
              <div key={s.l} className="group p-3 rounded-xl border border-lime-400/10 bg-white/[0.02] backdrop-blur-sm hover:border-lime-400/30 hover:bg-lime-400/5 transition-all duration-300">
                <div className="text-2xl font-black text-gradient-weed">{s.n}</div>
                <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone — FIXED position, centered via flexbox. opacity-0 prevents flash before GSAP takes control */}
        <div ref={heroPhoneRef} className="fixed inset-0 z-20 flex items-center justify-center will-change-transform pointer-events-none opacity-0" style={{ perspective: '1200px' }}>
          <div className="animate-float-phone pointer-events-auto">
            <PhoneMockup glowColor="rgba(163,230,53,0.18)"><DashboardScreen /></PhoneMockup>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in [animation-delay:2s]">
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-zinc-600 flex items-start justify-center p-1"><div className="w-1 h-2 rounded-full bg-lime-400 animate-bounce" /></div>
        </div>
      </section>

      {/* ============ HORIZONTAL SHOWCASE ============ */}
      <section ref={horizontalWrapperRef} className="relative overflow-hidden z-[2] bg-[#07120b]/95 backdrop-blur-xl border-t border-lime-400/10 shadow-[0_-40px_80px_rgba(7,18,11,0.9)]">

        <div ref={horizontalTrackRef} className="flex" style={{ width: `${panelConfig.length * 100}vw` }}>
          {panelConfig.map((panel, i) => {
            const Screen = screenComponents[i];
            return (
              <div key={i} data-panel className="relative w-screen h-screen flex-shrink-0 flex items-center overflow-hidden">
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
                    <span data-panel-text className={`inline-block w-fit px-3 py-1 rounded-full border text-[10px] font-semibold tracking-wider uppercase mb-5 ${panel.tagCls}`}>{panel.tag}</span>
                    <h2 data-panel-text className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-5 leading-tight">{panel.title}<span className="text-gradient-weed">{panel.hl}</span>{panel.end}</h2>
                    <p data-panel-text className="text-zinc-400 text-lg max-w-md leading-relaxed mb-6">{panel.desc}</p>
                    <div data-panel-text className="flex flex-wrap gap-2.5">
                      {panel.chips.map((c) => <span key={c} className={`px-3 py-1.5 text-xs font-medium rounded-full border ${panel.chipCls}`}>{c}</span>)}
                    </div>
                  </div>
                  {/* Phone */}
                  <div className={`flex justify-center ${i % 2 === 1 ? 'lg:order-1 lg:justify-start' : 'lg:justify-end'}`}>
                    <div data-panel-phone className="will-change-transform" style={{ perspective: '1200px' }}>
                      <div className="animate-float-phone"><PhoneMockup glowColor={panel.glow}><Screen /></PhoneMockup></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section ref={featuresRef} className="relative py-24 sm:py-32 overflow-hidden z-[2] bg-[#07120b]">
        <BgImage src="/images/bg/features.jpg" position="center" />
        <AnimatedOrb className="top-[20%] left-[-5%] w-[400px] h-[400px] blur-[100px]" color="rgba(163,230,53,0.08)" delay={-2} />
        <AnimatedOrb className="bottom-[10%] right-[-5%] w-[350px] h-[350px] blur-[90px]" color="rgba(34,197,94,0.06)" delay={-6} />
        <div className="absolute inset-0 bg-grid-weed opacity-12 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span data-feat-title className="inline-block px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-xs font-semibold tracking-wider uppercase text-lime-300 mb-4">Funcionalidades</span>
            <h2 data-feat-title className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">Todo lo que necesitás, <span className="text-gradient-weed">en un solo lugar</span></h2>
            <p data-feat-title className="text-zinc-400 text-lg">Herramientas potentes, interfaz simple. Diseñado por cultivadores, para cultivadores.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} data-feature className="group relative p-7 rounded-3xl border bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full ${f.bg} blur-3xl transition-all duration-500`} />
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`} style={{ boxShadow: `0 10px 30px -10px ${f.glow}` }}>
                    <span className="text-2xl">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ECOSYSTEM ============ */}
      <section ref={ecosystemRef} className="relative py-20 border-y border-lime-400/10 overflow-hidden z-[2] bg-[#07120b]">
        <AnimatedOrb className="top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] blur-[120px]" color="rgba(163,230,53,0.06)" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <p data-eco-word className="text-xs tracking-[0.3em] uppercase text-lime-400/60 mb-8">Un ecosistema completo</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {['Hidroponía', 'Orgánico', 'Sales Minerales', 'Mixto', 'Lab Reports', 'Trazabilidad', 'Genéticas', 'Comunidad'].map((w) => (
              <span key={w} data-eco-word className="text-xl sm:text-2xl font-bold text-zinc-600 hover:text-lime-300 transition-all duration-500 cursor-default hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.4)]">{w}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section ref={ctaRef} className="relative py-28 sm:py-36 overflow-hidden z-[2] bg-[#07120b]">
        <BgImage src="/images/bg/cta.jpg" position="center" />
        <AnimatedOrb data-parallax-orb className="top-[-10%] left-[20%] w-[450px] h-[450px] blur-[120px]" color="rgba(163,230,53,0.15)" />
        <AnimatedOrb data-parallax-orb className="bottom-[-10%] right-[20%] w-[450px] h-[450px] blur-[120px]" color="rgba(34,197,94,0.12)" delay={-5} />
        <AnimatedOrb className="top-[30%] right-[40%] w-[250px] h-[250px] blur-[80px]" color="rgba(251,191,36,0.06)" delay={-3} />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div data-cta className="inline-flex p-[2px] rounded-full bg-gradient-to-r from-lime-400 via-emerald-400 to-amber-400 mb-8">
            <div className="px-5 py-2 rounded-full bg-[#07120b] text-sm font-medium text-lime-300">Empezá gratis hoy</div>
          </div>
          <h2 data-cta className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight">Listo para <span className="text-gradient-weed">florecer</span>?</h2>
          <p data-cta className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto mb-12">Sumate a la comunidad de cultivadores que ya están llevando su cultivo al próximo nivel.</p>
          <div data-cta>
            <Link href="/register" className="magnetic-btn group inline-flex items-center gap-3 px-12 py-6 rounded-2xl font-bold text-lg text-[#07120b] bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 hover:shadow-[0_0_60px_rgba(163,230,53,0.5)] hover:scale-105 active:scale-95 transition-all duration-300">
              Crear mi cuenta <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative border-t border-lime-400/10 bg-[#050d07] py-12 z-[2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 via-green-500 to-emerald-700 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.25)]"><LeafIcon className="w-5 h-5 text-[#07120b]" /></div>
              <span className="font-extrabold text-lg"><span className="text-white">Citro</span><span className="text-gradient-weed">nela</span></span>
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
    </div>
  );
}
