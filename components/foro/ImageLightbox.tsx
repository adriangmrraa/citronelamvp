'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) handlePrevious();
      if (e.key === 'ArrowRight' && images.length > 1) handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, handlePrevious, handleNext, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[1010]"
      >
        <X size={24} />
      </button>

      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrevious}
            className="absolute left-4 lg:left-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[1010] border border-white/10"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 lg:right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-[1010] border border-white/10"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div 
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Imagen ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300"
        />
        
        {images.length > 1 && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <div 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-lime-400 w-4' : 'bg-white/20'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
