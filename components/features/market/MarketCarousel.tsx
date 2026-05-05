"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Temporada de cultivo",
    subtitle: "20% OFF en todas las semillas",
    image: "/images/market/1.jpg",
    color: "from-lime-500/20"
  },
  {
    id: 2,
    title: "Equipamiento pro",
    subtitle: "Nuevos paneles LED disponibles",
    image: "/images/market/3.jpg",
    color: "from-blue-500/20"
  },
  {
    id: 3,
    title: "Kit principiantes",
    subtitle: "Todo lo que necesitás en un solo lugar",
    image: "/images/market/16.jpg",
    color: "from-purple-500/20"
  },
  {
    id: 4,
    title: "Nutrición orgánica",
    subtitle: "Sustratos y fertilizantes premium",
    image: "/images/market/2.jpg",
    color: "from-emerald-500/20"
  },
  {
    id: 5,
    title: "Parafernalia deluxe",
    subtitle: "Accesorios exclusivos de Citronela",
    image: "/images/market/5.jpg",
    color: "from-amber-500/20"
  },
  {
    id: 6,
    title: "Genética premium",
    subtitle: "Selección exclusiva de bancos mundiales",
    image: "/images/market/8.jpg",
    color: "from-green-500/20"
  },
  {
    id: 7,
    title: "Cosecha dorada",
    subtitle: "Herramientas de precisión para el corte",
    image: "/images/market/12.jpg",
    color: "from-yellow-500/20"
  },
  {
    id: 8,
    title: "Extracción pura",
    subtitle: "Prensas y accesorios para rosin",
    image: "/images/market/10.jpg",
    color: "from-orange-500/20"
  },
  {
    id: 9,
    title: "Control total",
    subtitle: "Sistemas de automatización y sensores",
    image: "/images/market/20.jpg",
    color: "from-cyan-500/20"
  },
  {
    id: 10,
    title: "Protección total",
    subtitle: "Soluciones para el control de plagas",
    image: "/images/market/14.jpg",
    color: "from-red-500/20"
  },
  {
    id: 11,
    title: "Cuidado experto",
    subtitle: "Medidores y herramientas de precisión",
    image: "/images/market/17.jpg",
    color: "from-blue-500/20"
  },
  {
    id: 12,
    title: "Iluminación smart",
    subtitle: "Controlá tu cultivo desde el celular",
    image: "/images/market/18.jpg",
    color: "from-indigo-500/20"
  },
  {
    id: 13,
    title: "Riego automatizado",
    subtitle: "Eficiencia y precisión en cada gota",
    image: "/images/market/19.jpg",
    color: "from-teal-500/20"
  }
];

export const MarketCarousel = () => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<(HTMLDivElement | null)[]>([]);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 12000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    // Animation logic
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      if (i === current) {
        gsap.to(slide, {
          opacity: 1,
          scale: 1,
          duration: 1,
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
          scale: 1.1,
          duration: 1,
          ease: "power2.inOut",
          zIndex: 0
        });
      }
    });
  }, [current]);

  return (
    <div className="relative w-full h-[400px] rounded-none overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          ref={(el) => { slidesRef.current[i] = el; }}
          className="absolute inset-0 opacity-0 scale-110"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-black/60 to-black/80`} />
          
          {/* Content */}
          <div 
            ref={(el) => { contentRef.current[i] = el; }}
            className="absolute inset-0 flex flex-col justify-end pb-8 px-12 md:px-20"
          >
            <h3 
              style={{ 
                fontFamily: 'var(--font-avigea)', 
                color: '#A3E635',
                textShadow: '6px 6px 12px rgba(0,0,0,0.9)'
              }}
              className="text-5xl md:text-7xl font-normal mb-1 tracking-wide leading-[1.1] normal-case" 
            >
              {slide.title}
            </h3>
            <p className="text-xl md:text-2xl text-white/80 font-medium tracking-wide mb-4">
              {slide.subtitle}
            </p>
            <div>
              <button className="bg-white text-black px-10 py-3 rounded-none font-bold hover:bg-[#A3E635] transition-all duration-300 uppercase text-xs tracking-widest shadow-xl transform hover:scale-105 active:scale-95">
                Ver más
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-none transition-all duration-500 ${
              current === i ? "w-8 bg-primary" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketCarousel;
