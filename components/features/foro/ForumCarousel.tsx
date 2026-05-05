"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Comunidad Citronela",
    subtitle: "Compartí tu experiencia con otros cultivadores",
    image: "/images/market/1.jpg",
    color: "from-lime-500/20"
  },
  {
    id: 2,
    title: "Debates Técnicos",
    subtitle: "Nutrición, genéticas y sistemas de automatización",
    image: "/images/market/20.jpg",
    color: "from-blue-500/20"
  },
  {
    id: 3,
    title: "Seguimientos en vivo",
    subtitle: "Mostrá el progreso de tus plantas a la comunidad",
    image: "/images/market/8.jpg",
    color: "from-green-500/20"
  },
  {
    id: 4,
    title: "Noticias del sector",
    subtitle: "Lo último en legislación y cultura cannábica",
    image: "/images/market/3.jpg",
    color: "from-emerald-500/20"
  }
];

export const ForumCarousel = () => {
  const [current, setCurrent] = useState(0);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<(HTMLDivElement | null)[]>([]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 8000); // Slightly faster for community vibes
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      if (i === current) {
        gsap.to(slide, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          zIndex: 10
        });
        if (contentRef.current[i]) {
          gsap.fromTo(contentRef.current[i], 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
          );
        }
      } else {
        gsap.to(slide, {
          opacity: 0,
          scale: 1.05,
          duration: 1,
          ease: "power2.inOut",
          zIndex: 0
        });
      }
    });
  }, [current]);

  return (
    <div className="relative w-full h-[360px] md:h-[420px] overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          ref={(el) => { slidesRef.current[i] = el; }}
          className="absolute inset-0 opacity-0 scale-105"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/50 to-black/80`} />
          
          {/* Content */}
          <div 
            ref={(el) => { contentRef.current[i] = el; }}
            className="absolute inset-0 flex flex-col justify-end pb-12 px-6 md:px-20"
          >
            <h3 
              style={{ 
                fontFamily: 'var(--font-avigea)', 
                color: '#A3E635',
                textShadow: '4px 4px 10px rgba(0,0,0,0.8)'
              }}
              className="text-4xl md:text-6xl font-normal mb-1 tracking-wide leading-[1.1] normal-case" 
            >
              {slide.title}
            </h3>
            <p className="text-lg md:text-xl text-white/80 font-medium tracking-wide mb-6 max-w-xl">
              {slide.subtitle}
            </p>
            <div>
              <button className="bg-white text-black px-8 py-2.5 rounded-none font-bold hover:bg-[#A3E635] transition-all duration-300 uppercase text-[10px] tracking-widest shadow-xl transform hover:scale-105 active:scale-95">
                Participar
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-40 flex items-center justify-between px-4 pointer-events-none">
        <button 
          onClick={prev}
          className="flex items-center justify-center text-[#A3E635] hover:scale-125 transition-all duration-300 pointer-events-auto"
        >
          <ChevronLeft size={44} strokeWidth={2.5} />
        </button>
        <button 
          onClick={next}
          className="flex items-center justify-center text-[#A3E635] hover:scale-125 transition-all duration-300 pointer-events-auto"
        >
          <ChevronRight size={44} strokeWidth={2.5} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-6 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all duration-500 ${
              current === i ? "w-8 bg-[#A3E635]" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ForumCarousel;
