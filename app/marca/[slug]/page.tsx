'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { BRANDS, getProducts } from '@/lib/data/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { FilterOptions } from '@/types';

interface BrandPageProps {
  params: {
    slug: string;
  };
}

export default function BrandDetailPage({ params }: BrandPageProps) {
  const brand = BRANDS.find((b) => b.slug === params.slug);

  if (!brand) {
    notFound();
  }

  const [filters, setFilters] = useState<FilterOptions>({
    brandSlug: brand.slug,
    sort: 'relevance',
  });

  const [products, setProducts] = useState(() => {
    // Initial fetch sync
    return getProductsSync({ brandSlug: brand.slug, sort: 'relevance' });
  });

  function getProductsSync(options: FilterOptions) {
    let list = getProductsSyncMock(options);
    return list;
  }

  function getProductsSyncMock(options: FilterOptions) {
    const { MOCK_PRODUCTS } = require('@/lib/data/products');
    let prods = MOCK_PRODUCTS.filter((p: any) => p.brand?.slug === brand?.slug);

    if (options.gender) {
      prods = prods.filter((p: any) => p.gender === options.gender || p.gender === 'unisex');
    }
    if (options.minPrice !== undefined) {
      prods = prods.filter((p: any) => p.price >= options.minPrice!);
    }
    if (options.maxPrice !== undefined) {
      prods = prods.filter((p: any) => p.price <= options.maxPrice!);
    }
    if (options.sort === 'price_asc') {
      prods.sort((a: any, b: any) => a.price - b.price);
    } else if (options.sort === 'price_desc') {
      prods.sort((a: any, b: any) => b.price - a.price);
    }
    return prods;
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setProducts(getProductsSyncMock(newFilters));
  };

  const handleReset = () => {
    const initial = { brandSlug: brand.slug, sort: 'relevance' as const };
    setFilters(initial);
    setProducts(getProductsSyncMock(initial));
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      {/* BRAND HERO BANNER */}
      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            LOJA OFICIAL DA MARCA
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-heading tracking-tight">
            {brand.name}
          </h1>
          <p className="text-sm text-wolf-300 max-w-2xl">
            {brand.description}
          </p>
        </div>
      </section>

      {/* CATALOG SECTION WITH FILTERS */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* FILTERS SIDEBAR */}
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />

          {/* PRODUCT LIST */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-wolf-800">
              <span className="text-xs font-mono text-wolf-400 uppercase">
                EXIBINDO <strong className="text-white">{products.length}</strong> PRODUTOS {brand.name.toUpperCase()}
              </span>

              {/* SORT DROPDOWN */}
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

            <ProductGrid products={products} emptyMessage={`Nenhum produto da marca ${brand.name} encontrado com os filtros aplicados.`} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
