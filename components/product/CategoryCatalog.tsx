'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { FilterOptions, Product } from '@/types';
import { RefreshCw } from 'lucide-react';

interface CategoryCatalogProps {
  title: string;
  subtitle: string;
  categorySlug?: string;
  brandSlug?: string;
  genderFilter?: string;
  onlySale?: boolean;
}

function applyFilters(products: Product[], opts: FilterOptions, onlySale?: boolean): Product[] {
  let prods = [...products];

  if (onlySale) {
    prods = prods.filter((p) => p.is_sale);
  }

  if (opts.categorySlug) {
    prods = prods.filter((p) => p.category?.slug === opts.categorySlug);
  }

  if (opts.brandSlug) {
    prods = prods.filter((p) => p.brand?.slug === opts.brandSlug);
  }

  if (opts.gender) {
    prods = prods.filter((p) => p.gender === opts.gender || p.gender === 'unisex');
  }

  if (opts.minPrice !== undefined) {
    prods = prods.filter((p) => p.price >= opts.minPrice!);
  }

  if (opts.maxPrice !== undefined) {
    prods = prods.filter((p) => p.price <= opts.maxPrice!);
  }

  if (opts.sort === 'price_asc') {
    prods.sort((a, b) => a.price - b.price);
  } else if (opts.sort === 'price_desc') {
    prods.sort((a, b) => b.price - a.price);
  } else if (opts.sort === 'rating') {
    prods.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return prods;
}

export function CategoryCatalog({
  title,
  subtitle,
  categorySlug,
  brandSlug,
  genderFilter,
  onlySale,
}: CategoryCatalogProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    categorySlug,
    brandSlug,
    gender: genderFilter,
    sort: 'relevance',
  });

  // Fetch live products from API (Supabase-backed, falls back to mock)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categorySlug) params.set('category', categorySlug);
        if (brandSlug) params.set('brand', brandSlug);
        if (onlySale) params.set('sale', 'true');

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data: Product[] = await res.json();
          setAllProducts(data);
        } else {
          setAllProducts([...MOCK_PRODUCTS]);
        }
      } catch {
        setAllProducts([...MOCK_PRODUCTS]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, brandSlug, onlySale]);

  const displayedProducts = applyFilters(allProducts, filters, onlySale);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({ categorySlug, brandSlug, gender: genderFilter, sort: 'relevance' as const });
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            CATÁLOGO WHITE WOLF COMPANY
          </span>
          <h1 className="text-4xl font-black uppercase font-heading tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-wolf-300 max-w-2xl">
            {subtitle}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-wolf-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-wolf-400 uppercase">
                  EXIBINDO{' '}
                  <strong className="text-white">{loading ? '...' : displayedProducts.length}</strong>{' '}
                  PRODUTOS
                </span>
                {loading && (
                  <RefreshCw className="w-3.5 h-3.5 text-accent animate-spin" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-wolf-400 hidden sm:inline">ORDENAR POR:</span>
                <select
                  value={filters.sort || 'relevance'}
                  onChange={(e) =>
                    handleFilterChange({ ...filters, sort: e.target.value as FilterOptions['sort'] })
                  }
                  className="bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-1.5 focus:outline-none focus:border-accent font-mono uppercase"
                >
                  <option value="relevance">Mais Relevantes</option>
                  <option value="price_asc">Menor Preço</option>
                  <option value="price_desc">Maior Preço</option>
                  <option value="rating">Melhor Avaliados</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden animate-pulse">
                    <div className="aspect-square bg-wolf-800" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-wolf-800 rounded w-1/2" />
                      <div className="h-4 bg-wolf-800 rounded w-3/4" />
                      <div className="h-3 bg-wolf-800 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-16 text-wolf-500 font-mono text-sm">
                Nenhum produto encontrado com os filtros selecionados.
              </div>
            ) : (
              <ProductGrid products={displayedProducts} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
