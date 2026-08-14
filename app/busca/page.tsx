'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types';
import { Search } from 'lucide-react';

function BuscaContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const term = q.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand?.name.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
    );

    setResults(filtered);
  }, [q]);

  return (
    <>
      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            RESULTADOS DA BUSCA
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <Search className="w-8 h-8 text-accent" />
            TERMO: &quot;{q}&quot;
          </h1>
          <p className="text-sm text-wolf-400 font-mono">
            Foram encontrados <strong className="text-white">{results.length}</strong> produtos correspondentes.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <ProductGrid products={results} emptyMessage={`Nenhum produto encontrado para "${q}". Tente buscar por marcas como Nike, Adidas ou termos como Ultraboost.`} />
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
