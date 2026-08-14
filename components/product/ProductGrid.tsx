'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = 'Nenhum produto encontrado.' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-wolf-800 rounded-sm bg-wolf-950/40 p-8">
        <p className="text-wolf-400 font-mono text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
