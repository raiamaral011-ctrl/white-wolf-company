'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types';
import { formatCurrency, calculateInstallments } from '@/lib/utils';
import { useFavorites } from '@/context/favorites-context';
import {
  Heart, Star, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const favorite = isFavorite(product.id);
  const fallbackImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

  // Filter valid image URLs (excluding video files)
  const validImages = (product.images || [])
    .filter((img) => img.url && !img.url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) && img.alt !== 'video')
    .map((img) => img.url);

  const imagesList = validImages.length > 0 ? validImages : [fallbackImg];
  const safeImgIndex = currentImgIndex % imagesList.length;
  const currentDisplayImage = imageError ? fallbackImg : imagesList[safeImgIndex];

  const isDataUrl = currentDisplayImage.startsWith('data:');
  const isAvif = currentDisplayImage.toLowerCase().includes('.avif');

  // Carousel navigation (isolated per product card)
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageError(false);
    setCurrentImgIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImageError(false);
    setCurrentImgIndex((prev) => (prev + 1) % imagesList.length);
  };

  // Build sorted list of all available variants/sizes
  const variantsList = (() => {
    if (product.variants && product.variants.length > 0) {
      const sorted = [...product.variants].sort((a, b) => Number(a.size) - Number(b.size));
      return sorted.map((v) => ({
        size: String(v.size),
        stock: Number(v.stock ?? 0),
        variant: v,
      }));
    }
    return [];
  })();

  // Calculate total stock across all sizes
  const totalStock = variantsList.length > 0
    ? variantsList.reduce((sum, v) => sum + v.stock, 0)
    : 10;
  const isOutOfStock = totalStock <= 0;

  const installments = calculateInstallments(product.price);
  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  return (
    <div
      className={`group bg-wolf-950 border rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 relative shadow-lg ${
        isOutOfStock
          ? 'border-rose-950/60 opacity-90'
          : 'border-wolf-800 hover:border-wolf-600'
      }`}
    >
      {/* BADGES */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {isOutOfStock ? (
          <span className="px-2.5 py-1 bg-rose-600 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-xs shadow-xl flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> ESGOTADO
          </span>
        ) : (
          <>
            {product.is_maratona && (
              <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-600 text-emerald-300 font-mono text-[9px] font-black uppercase tracking-widest rounded-xs shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MARATONA
              </span>
            )}
            {product.is_new && (
              <span className="px-2 py-0.5 bg-accent text-white font-mono text-[9px] font-extrabold uppercase tracking-widest rounded-xs shadow-md">
                NOVO
              </span>
            )}
            {discountPercent && (
              <span className="px-2 py-0.5 bg-rose-500 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-xs shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
          </>
        )}
      </div>

      {/* FAVORITE BUTTON */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product);
        }}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
          favorite ? 'bg-accent text-white' : 'bg-wolf-900/80 text-wolf-400 hover:text-white hover:bg-wolf-800'
        }`}
        title={favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        aria-label="Favoritar"
      >
        <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
      </button>

      {/* PRODUCT IMAGE & INDIVIDUAL CAROUSEL */}
      <div className="relative aspect-square bg-wolf-900 overflow-hidden">
        <Link href={`/produto/${product.slug}`} className="block w-full h-full relative">
          <Image
            src={currentDisplayImage}
            alt={product.name}
            fill
            unoptimized={isDataUrl || isAvif}
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? 'grayscale-[40%]' : ''
            }`}
          />
        </Link>

        {/* CAROUSEL ARROWS (CIRCULAR NAVIGATION, ONLY IF MULTIPLE IMAGES) */}
        {imagesList.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-wolf-950/80 hover:bg-accent text-white border border-wolf-700 transition-all opacity-0 group-hover:opacity-100 sm:opacity-0 focus:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
              title="Imagem anterior"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-wolf-950/80 hover:bg-accent text-white border border-wolf-700 transition-all opacity-0 group-hover:opacity-100 sm:opacity-0 focus:opacity-100 hover:scale-110 active:scale-95 shadow-lg"
              title="Próxima imagem"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* IMAGE DOTS INDICATOR */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs pointer-events-none">
              {imagesList.map((_, idx) => (
                <span
                  key={idx}
                  className={`block rounded-full transition-all ${
                    idx === safeImgIndex
                      ? 'w-2 h-2 bg-accent'
                      : 'w-1.5 h-1.5 bg-wolf-600'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* CONTENT INFO */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-wolf-400">
            <span className="uppercase text-accent font-semibold tracking-wider">
              {product.brand?.name}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-wolf-500">({product.review_count})</span>
            </div>
          </div>

          <Link href={`/produto/${product.slug}`} className="block mt-1">
            <h3 className="text-sm font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* PRICING & INSTALLMENTS */}
        <div className="pt-2 border-t border-wolf-800/80">
          {isOutOfStock ? (
            <div className="py-1">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                Indisponível no estoque
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-black font-mono text-white">
                  {formatCurrency(product.price)}
                </span>
                {product.compare_at_price && (
                  <span className="text-xs font-mono text-wolf-500 line-through">
                    {formatCurrency(product.compare_at_price)}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-wolf-400 mt-0.5">
                ou {installments.count}x de <span className="text-white font-semibold">{formatCurrency(installments.amount)}</span> sem juros
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
