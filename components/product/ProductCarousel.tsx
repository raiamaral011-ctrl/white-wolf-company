'use client';

import React, { useRef } from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductCarousel({ products, emptyMessage = 'Nenhum produto encontrado.' }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-wolf-800 rounded-sm bg-wolf-950/40 p-8">
        <p className="text-wolf-400 font-mono text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {/* Scroll controls (Nike-style top right or floating on sides) */}
      <div className="hidden sm:flex items-center gap-2 absolute -top-14 right-0 z-10">
        <button
          onClick={() => scroll('left')}
          className="p-2.5 rounded-full bg-wolf-900 border border-wolf-800 text-wolf-300 hover:text-white hover:border-accent transition-all active:scale-95"
          aria-label="Rolar produtos para a esquerda"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="p-2.5 rounded-full bg-wolf-900 border border-wolf-800 text-wolf-300 hover:text-white hover:border-accent transition-all active:scale-95"
          aria-label="Rolar produtos para a direita"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal smooth scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
