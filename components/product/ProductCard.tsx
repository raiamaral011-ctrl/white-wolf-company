'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatCurrency, calculateInstallments } from '@/lib/utils';
import { useFavorites } from '@/context/favorites-context';
import { useCart } from '@/context/cart-context';
import { Heart, ShoppingBag, Star, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const favorite = isFavorite(product.id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  // Calculate stock across all variants
  const totalStock = product.variants && product.variants.length > 0
    ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
    : 10;
  const isOutOfStock = totalStock <= 0;

  const installments = calculateInstallments(product.price);
  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    // Find selected variant or first available with stock > 0
    const availableVariant = product.variants?.find((v) => (selectedSize ? v.size === selectedSize : (v.stock || 0) > 0)) || product.variants?.[0] || {
      id: `${product.id}-default`,
      product_id: product.id,
      sku: product.sku,
      size: selectedSize || '40',
      color: '#0f172a',
      color_name: 'Padrão',
      stock: 10,
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
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {isOutOfStock ? (
          <span className="px-2.5 py-1 bg-rose-600 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-xs shadow-xl flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> ESGOTADO
          </span>
        ) : (
          <>
            {product.is_new && (
              <span className="px-2 py-0.5 bg-accent text-white font-mono text-[9px] font-extrabold uppercase tracking-widest rounded-xs shadow-md">
                NOVO
              </span>
            )}
            {discountPercent && (
              <span className="px-2 py-0.5 bg-emerald-500 text-wolf-950 font-mono text-[9px] font-black uppercase tracking-widest rounded-xs shadow-md">
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
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
          favorite ? 'bg-accent text-white' : 'bg-wolf-900/80 text-wolf-400 hover:text-white hover:bg-wolf-800'
        }`}
        title={favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
      >
        <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
      </button>

      {/* PRODUCT IMAGE HOVER ZOOM */}
      <Link href={`/produto/${product.slug}`} className="block relative aspect-square bg-wolf-900 overflow-hidden">
        <Image
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale-[40%]' : ''
          }`}
        />

        {/* QUICK ADD SIZE OVERLAY ON HOVER */}
        {!isOutOfStock ? (
          <div
            className={`absolute inset-x-0 bottom-0 p-3 bg-wolf-950/90 backdrop-blur-sm border-t border-wolf-800 transition-all duration-300 flex flex-col gap-2 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <span className="text-[10px] uppercase font-mono text-wolf-400 tracking-wider">
              TAMANHOS DISPONÍVEIS:
            </span>
            <div className="flex flex-wrap gap-1">
              {(product.variants?.slice(0, 5) || [{ size: '38', stock: 5 }, { size: '39', stock: 5 }, { size: '40', stock: 5 }, { size: '41', stock: 5 }, { size: '42', stock: 5 }]).map((v) => {
                const varOutOfStock = (v.stock || 0) <= 0;
                return (
                  <button
                    key={v.size}
                    disabled={varOutOfStock}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!varOutOfStock) setSelectedSize(v.size);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-mono border rounded-xs transition-colors ${
                      varOutOfStock
                        ? 'border-wolf-900 bg-wolf-900/60 text-wolf-600 line-through cursor-not-allowed'
                        : selectedSize === v.size
                        ? 'border-accent bg-accent text-white'
                        : 'border-wolf-700 text-wolf-300 hover:border-white hover:text-white'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleQuickAdd}
              className="w-full py-2 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors mt-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              ADICIONAR RÁPIDO
            </button>
          </div>
        ) : (
          <div
            className={`absolute inset-x-0 bottom-0 p-3 bg-rose-950/90 backdrop-blur-sm border-t border-rose-900 transition-all duration-300 text-center ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <span className="text-[11px] font-mono font-bold text-rose-300 uppercase tracking-wider">
              AVISE-ME QUANDO CHEGAR
            </span>
          </div>
        )}
      </Link>

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

        {/* PRICING */}
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
