'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useFavorites } from '@/context/favorites-context';
import { createClient } from '@/lib/supabase/browser';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { Heart, RefreshCw, LogIn, Sparkles } from 'lucide-react';

export default function FavoritosPage() {
  const { favoriteIds } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function loadFavoriteProducts() {
      if (favoriteIds.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const allProducts: Product[] = await res.json();
          const matched = allProducts.filter((p) => favoriteIds.includes(p.id));
          if (matched.length > 0) {
            setFavoriteProducts(matched);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching favorite products:', err);
      }

      // Fallback to MOCK_PRODUCTS if API didn't return matches
      const fallbackMatched = MOCK_PRODUCTS.filter((p) => favoriteIds.includes(p.id));
      setFavoriteProducts(fallbackMatched);
      setLoading(false);
    }

    loadFavoriteProducts();
  }, [favoriteIds]);

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            SUA LISTA DE DESEJOS
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-accent fill-accent" />
            MEUS FAVORITOS ({favoriteProducts.length})
          </h1>
          <p className="text-sm text-wolf-400 font-mono">
            Seus tênis prediletos reunidos em um só lugar com acesso rápido e estoque em tempo real.
          </p>

          {!isLoggedIn && (
            <div className="mt-4 p-3 bg-wolf-900/90 border border-wolf-800 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-wolf-300">
                <Sparkles className="w-4 h-4 text-accent shrink-0" />
                <span>Você está navegando como visitante. Entre na sua conta para salvar seus favoritos permanentemente.</span>
              </div>
              <Link
                href="/login?redirect=/favoritos"
                className="px-3 py-1.5 bg-accent hover:bg-rose-700 text-white font-bold uppercase rounded-xs tracking-wider shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Entrar na Conta
              </Link>
            </div>
          )}
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="p-20 text-center text-wolf-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-accent animate-spin" />
            <span>Carregando seus favoritos...</span>
          </div>
        ) : (
          <ProductGrid
            products={favoriteProducts}
            emptyMessage="Você ainda não adicionou nenhum tênis aos favoritos. Clique no ícone de coração nos cards de produtos para salvar."
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
