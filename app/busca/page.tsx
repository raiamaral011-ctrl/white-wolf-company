'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types';
import { Search, RefreshCw } from 'lucide-react';

function BuscaContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data: Product[] = await res.json();
          setResults(data);
        } else {
          fallbackLocal(q);
        }
      } catch {
        fallbackLocal(q);
      } finally {
        setLoading(false);
      }
    };

    const fallbackLocal = (termStr: string) => {
      const term = termStr.toLowerCase();
      const filtered = MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand?.name.toLowerCase().includes(term) ||
          p.category?.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
      setResults(filtered);
    };

    fetchSearch();
  }, [q]);

  return (
    <>
      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            RESULTADOS DA BUSCA EM TEMPO REAL
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <Search className="w-8 h-8 text-accent" />
            TERMO: &quot;{q}&quot;
            {loading && <RefreshCw className="w-5 h-5 text-accent animate-spin" />}
          </h1>
          <p className="text-sm text-wolf-400 font-mono">
            Foram encontrados <strong className="text-white">{loading ? '...' : results.length}</strong> produtos correspondentes.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-wolf-800" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-wolf-800 rounded w-1/2" />
                  <div className="h-4 bg-wolf-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid
            products={results}
            emptyMessage={`Nenhum produto encontrado para "${q}". Tente buscar por marcas como Nike, Adidas ou termos como Ultraboost.`}
          />
        )}
      </main>
    </>
  );
}

export default function BuscaPage() {
  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-wolf-400 font-mono">Carregando busca...</div>}>
        <BuscaContent />
      </Suspense>
      <Footer />
    </div>
  );
}
