'use client';

import React from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useFavorites } from '@/context/favorites-context';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { Heart } from 'lucide-react';

export default function FavoritosPage() {
  const { favoriteIds } = useFavorites();
  const favoriteProducts = MOCK_PRODUCTS.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            SUA LISTA DE DESEJOS
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            MEUS FAVORITOS ({favoriteProducts.length})
          </h1>
          <p className="text-sm text-wolf-400 font-mono">
            Seus produtos salvos são sincronizados com a sua conta White Wolf Company.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <ProductGrid
          products={favoriteProducts}
          emptyMessage="Você ainda não adicionou nenhum produto aos favoritos. Clique no ícone de coração nos cards de produtos para salvar."
        />
      </main>

      <Footer />
    </div>
  );
}
