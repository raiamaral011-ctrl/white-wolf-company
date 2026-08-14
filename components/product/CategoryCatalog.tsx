'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { FilterOptions, Product } from '@/types';

interface CategoryCatalogProps {
  title: string;
  subtitle: string;
  categorySlug?: string;
  genderFilter?: string;
  onlySale?: boolean;
}

export function CategoryCatalog({ title, subtitle, categorySlug, genderFilter, onlySale }: CategoryCatalogProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categorySlug,
    gender: genderFilter,
    sort: 'relevance',
  });

  const getFilteredProducts = (opts: FilterOptions): Product[] => {
    let prods = [...MOCK_PRODUCTS];

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
    }

    return prods;
  };

  const [products, setProducts] = useState<Product[]>(() => getFilteredProducts(filters));

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setProducts(getFilteredProducts(newFilters));
  };

  const handleReset = () => {
    const initial = { categorySlug, gender: genderFilter, sort: 'relevance' as const };
    setFilters(initial);
    setProducts(getFilteredProducts(initial));
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
              <span className="text-xs font-mono text-wolf-400 uppercase">
                EXIBINDO <strong className="text-white">{products.length}</strong> PRODUTOS
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-wolf-400 hidden sm:inline">ORDENAR POR:</span>
                <select
                  value={filters.sort || 'relevance'}
                  onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value as any })}
                  className="bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-1.5 focus:outline-none focus:border-accent font-mono uppercase"
                >
                  <option value="relevance">Mais Relevantes</option>
                  <option value="price_asc">Menor Preço</option>
                  <option value="price_desc">Maior Preço</option>
                  <option value="rating">Melhor Avaliados</option>
                </select>
              </div>
            </div>

            <ProductGrid products={products} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
