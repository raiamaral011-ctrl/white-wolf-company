'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types';
import { formatCurrency, calculateInstallments } from '@/lib/utils';
import { useFavorites } from '@/context/favorites-context';
import { useCart } from '@/context/cart-context';
import {
  Heart, ShoppingBag, Star, AlertTriangle, ChevronLeft, ChevronRight
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const DEFAULT_MALE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
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

  // Build sorted list of all available variants/sizes (ensuring full support up to 45)
  const variantsList: { size: string; stock: number; variant?: ProductVariant }[] = (() => {
    if (product.variants && product.variants.length > 0) {
      // Sort numerically by size
      const sorted = [...product.variants].sort((a, b) => Number(a.size) - Number(b.size));
      return sorted.map((v) => ({
        size: String(v.size),
        stock: Number(v.stock ?? 0),
        variant: v,
      }));
    }
    // Fallback if variants table has not yet loaded for mock data
    return DEFAULT_MALE_SIZES.map((sz) => ({
      size: sz,
      stock: 10,
    }));
  })();

  // Calculate total stock across all sizes
  const totalStock = variantsList.reduce((sum, v) => sum + v.stock, 0);
  const isOutOfStock = totalStock <= 0;

  const installments = calculateInstallments(product.price);
  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    // Find selected variant or first available variant with stock > 0
    const matched = variantsList.find((v) => (selectedSize ? v.size === selectedSize : v.stock > 0)) || variantsList[0];
    const availableVariant: ProductVariant = matched.variant || {
      id: `${product.id}-${matched.size}`,
      product_id: product.id,
      sku: `${product.sku}-${matched.size}`,
      size: matched.size,
      color: '#0f172a',
      color_name: 'Padrão',
      stock: matched.stock,
      created_at: '',
      updated_at: '',
    };

    addItem(product, availableVariant, 1);
  };

  return (
    <div
      className={`group bg-wolf-950 border rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 relative shadow-lg ${
        isOutOfStock
          ? 'border-rose-950/60 opacity-90'
          : 'border-wolf-800 hover:border-wolf-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        {/* QUICK ADD SIZE OVERLAY ON HOVER (SHOWS ALL SIZES UP TO 45 WITH STOCK) */}
        {!isOutOfStock ? (
          <div
            className={`absolute inset-x-0 bottom-0 p-3 bg-wolf-950/95 backdrop-blur-md border-t border-wolf-800 transition-all duration-300 flex flex-col gap-2 z-20 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-wolf-400 tracking-wider">
                NUMERAÇÃO MASCULINA:
              </span>
              {selectedSize && (
                <span className="text-[10px] font-mono text-accent font-bold">
                  Tam: {selectedSize}
                </span>
              )}
            </div>

            {/* Grid of sizes up to 45 */}
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-1">
              {variantsList.map((v) => {
                const varOutOfStock = v.stock <= 0;
                const isSelected = selectedSize === v.size;
                return (
                  <button
                    key={v.size}
                    disabled={varOutOfStock}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!varOutOfStock) setSelectedSize(v.size);
                    }}
                    title={varOutOfStock ? `Tamanho ${v.size} esgotado` : `Tamanho ${v.size} (${v.stock} em estoque)`}
                    className={`py-1 text-[10px] font-mono border rounded-xs transition-colors font-bold ${
                      varOutOfStock
                        ? 'border-wolf-900 bg-wolf-900/60 text-wolf-600 line-through cursor-not-allowed'
                        : isSelected
                        ? 'border-accent bg-accent text-white'
                        : 'border-wolf-700 bg-wolf-900/80 text-wolf-300 hover:border-white hover:text-white'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleQuickAdd}
              className="w-full py-2 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors mt-1 rounded-xs shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              ADICIONAR AO CARRINHO
            </button>
          </div>
        ) : (
          <div
            className={`absolute inset-x-0 bottom-0 p-3 bg-rose-950/95 backdrop-blur-sm border-t border-rose-900 transition-all duration-300 text-center z-20 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <span className="text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider">
              PRODUTO INDISPONÍVEL
            </span>
          </div>
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
