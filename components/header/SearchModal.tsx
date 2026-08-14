'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    ).slice(0, 6);

    setResults(filtered);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 md:p-20">
      <div className="max-w-3xl mx-auto bg-wolf-950 border border-wolf-800 rounded-sm shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="p-4 border-b border-wolf-800 flex items-center gap-3">
          <Search className="w-6 h-6 text-wolf-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por tênis, roupas, maratonas, marcas (ex: Ultraboost, Nike)..."
            className="flex-1 bg-transparent text-white placeholder-wolf-500 font-sans text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-wolf-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-wolf-800 text-wolf-300 hover:text-white text-xs font-mono uppercase"
          >
            ESC
          </button>
        </form>

        {/* Results / Autocomplete */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <span className="text-xs uppercase font-mono tracking-widest text-wolf-400 block">
                SUGESTÕES POPULARES
              </span>
              <div className="flex flex-wrap gap-2">
                {['Ultraboost', 'Air Max', 'Metcon 9', 'GEL-Nimbus', 'Tech Fleece', 'Shorts Corrida', 'Adidas', 'Nike'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-wolf-900 border border-wolf-800 hover:border-accent text-wolf-300 hover:text-white text-xs uppercase font-mono tracking-wider transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-wolf-400">
              Nenhum produto encontrado para &quot;<span className="text-white font-semibold">{query}</span>&quot;.
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-widest text-accent block">
                PRODUTOS ENCONTRADOS ({results.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produto/${product.slug}`}
                    onClick={onClose}
                    className="flex gap-3 p-2.5 bg-wolf-900/60 hover:bg-wolf-900 border border-wolf-800 hover:border-wolf-700 transition-all group rounded-sm"
                  >
                    <div className="relative w-16 h-16 bg-wolf-950 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-[10px] font-mono text-wolf-400 uppercase tracking-widest">
                        {product.brand?.name}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-accent transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-1">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-3 border-t border-wolf-800 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs text-accent font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1"
                >
                  VER TODOS OS RESULTADOS DA BUSCA &quot;{query}&quot;
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
