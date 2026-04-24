'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Sections
import { Header } from '../features/landing/sections/Header';
import { Hero } from '../features/landing/sections/Hero';
import { HorizontalShowcase } from '../features/landing/sections/HorizontalShowcase';
import { FeaturesGrid } from '../features/landing/sections/FeaturesGrid';
import { EcosystemBand } from '../features/landing/sections/EcosystemBand';
import { CTA } from '../features/landing/sections/CTA';
import { Footer } from '../features/landing/sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  // Refs for animation orchestration
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroPhoneRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const ecosystemRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ 
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
    });
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      /* ======================================================
         HERO ORCHESTRATION
         ====================================================== */
      if (heroRef.current) {
        const tl = gsap.timeline();
        tl.from(heroRef.current.querySelectorAll('[data-hero-text]'), { 
          y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out', delay: 0.5 
        })
        .from(heroRef.current.querySelectorAll('[data-hero-stat]'), { 
          y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' 
        }, '-=0.4')
        .from(heroPhoneRef.current, { 
          y: 100, scale: 0.8, opacity: 0, duration: 1.2, rotateY: -15, ease: 'power3.out' 
        }, '-=1');

        // Hero Scroll Effects
        const phase1 = gsap.timeline({ 
          scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } 
        });
        phase1.to(heroRef.current.querySelectorAll('[data-hero-text]'), { 
          y: -100, opacity: 0.3, stagger: 0.05, ease: 'none', duration: 0.5 
        });
        phase1.to({}, { duration: 0.25 });
        phase1.to(heroPhoneRef.current, { 
          y: -80, scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.inOut' 
        });

        // Parallax Orbs
        heroRef.current.querySelectorAll('[data-parallax-orb]').forEach((orb, i) => {
          gsap.to(orb, { 
            y: -80 - i * 40, 
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } 
          });
        });
      }

      /* ======================================================
         HORIZONTAL SHOWCASE
         ====================================================== */
      if (horizontalWrapperRef.current && horizontalTrackRef.current) {
        const track = horizontalTrackRef.current;
        const panelEls = track.querySelectorAll<HTMLElement>('[data-panel]');

        // Set initial states
        panelEls.forEach((panel) => {
          gsap.set(panel.querySelectorAll('[data-panel-text]'), { y: 60, opacity: 0 });
          const phone = panel.querySelector('[data-panel-phone]');
          if (phone) gsap.set(phone, { scale: 0.5, opacity: 0, rotateY: -20 });
          gsap.set(panel.querySelectorAll('[data-phone-item]'), { y: 15, opacity: 0 });
          gsap.set(panel.querySelectorAll('[data-gauge]'), { width: '0%' });
        });

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

        // First panel entry
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

        // Subsequent panels
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
         FEATURES, ECOSYSTEM & CTA
         ====================================================== */
      if (featuresRef.current) {
        gsap.from(featuresRef.current.querySelectorAll('[data-feat-title]'), {
          y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
        const cards = featuresRef.current.querySelectorAll('[data-feature]');
        gsap.from(cards, {
          y: 80, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: cards[0]?.parentElement, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      if (ecosystemRef.current) {
        gsap.from(ecosystemRef.current.querySelectorAll('[data-eco-word]'), {
          y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: ecosystemRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current.querySelectorAll('[data-cta]'), {
            y: 60, opacity: 0, scale: 0.95, duration: 0.9, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { trigger: ctaRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
        ctaRef.current.querySelectorAll('[data-parallax-orb]').forEach((orb, i) => {
            gsap.to(orb, {
                y: -50 - i * 30, x: i % 2 === 0 ? 30 : -30,
                scrollTrigger: { trigger: ctaRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            });
        });
      }

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-[#07120b] text-zinc-100 overflow-x-hidden">
      <Header />

      {/* FIXED PARALLAX BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ contain: 'strict' }}>
        <div 
          className="absolute inset-0 animate-ken-burns" 
          style={{ backgroundImage: 'url(/images/imagen-parallax.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} 
        />
        <div className="absolute inset-0 bg-[#07120b]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07120b] via-transparent to-[#07120b]/40" />
      </div>

      <Hero 
        ref={heroRef} 
        textRef={heroTextRef}
        phoneRef={heroPhoneRef} 
      />

      <HorizontalShowcase ref={horizontalWrapperRef} trackRef={horizontalTrackRef} />

      <FeaturesGrid ref={featuresRef} />

      <EcosystemBand ref={ecosystemRef} />

      <CTA ref={ctaRef} />

      <Footer />
    </div>
  );
}
