'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { FilterOptions, Product } from '@/types';
import { normalizeText } from '@/lib/utils';
import {
  RefreshCw, Search, X, SlidersHorizontal, ChevronDown,
  RotateCcw, CheckCircle2
} from 'lucide-react';

interface CategoryCatalogProps {
  title: string;
  subtitle: string;
  brandSlug?: string;
  isMaratona?: boolean;
  onlySale?: boolean;
  // Kept for backward compatibility if routes pass it, but internal filters ignore them
  categorySlug?: string;
  genderFilter?: string;
}

export function CategoryCatalog({
  title,
  subtitle,
  brandSlug,
  isMaratona,
  onlySale,
}: CategoryCatalogProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    brandSlug,
    isMaratona,
    sort: 'relevance',
    inStockOnly: false,
    sizes: [],
  });

  // Keep brandSlug and isMaratona in sync if props change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      brandSlug: brandSlug ?? prev.brandSlug,
      isMaratona: isMaratona ?? prev.isMaratona,
    }));
  }, [brandSlug, isMaratona]);

  // Fetch products from live database via API (which enforces masculine shoes only)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.brandSlug) params.set('brand', filters.brandSlug);
        if (filters.isMaratona) params.set('maratona', 'true');
        if (filters.inStockOnly) params.set('inStock', 'true');
        if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
        if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
        if (filters.sort) params.set('sort', filters.sort);
        if (onlySale) params.set('sale', 'true');
        if (searchQuery.trim()) params.set('q', searchQuery.trim());

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data: Product[] = await res.json();
          setAllProducts(data || []);
        } else {
          setAllProducts([]);
        }
      } catch (err) {
        console.error('Error fetching catalog products:', err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    filters.brandSlug,
    filters.isMaratona,
    filters.inStockOnly,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    searchQuery,
    onlySale,
  ]);

  // Client-side filtering logic (ensuring strict compliance with masculine shoe catalog)
  const displayedProducts = allProducts.filter((p) => {
    // 0. Strict Masculine check (double guarantee)
    if (p.gender?.toLowerCase() !== 'masculino') return false;

    // 1. Maratona Check
    if (filters.isMaratona && !p.is_maratona) return false;

    // 2. Sale check
    if (onlySale && !p.is_sale) return false;

    // 3. Brand Check (strict equality)
    if (filters.brandSlug) {
      const targetBrand = filters.brandSlug.toLowerCase();
      const pBrandSlug = (p.brand?.slug || '').toLowerCase();
      const pBrandName = (p.brand?.name || '').toLowerCase();
      if (pBrandSlug !== targetBrand && pBrandName !== targetBrand) return false;
    }

    // 4. Stock Availability Filter
    if (filters.inStockOnly) {
      const totalStock = (p.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
      if (totalStock <= 0) return false;
    }

    // 5. Price Min
    if (filters.minPrice !== undefined && Number(p.price) < filters.minPrice) return false;

    // 6. Price Max
    if (filters.maxPrice !== undefined && Number(p.price) > filters.maxPrice) return false;

    // 7. Size Filter (Check if product has any variant in filters.sizes with stock > 0)
    if (filters.sizes && filters.sizes.length > 0) {
      if (!p.variants || p.variants.length === 0) return true;
      const hasSelectedSize = p.variants.some(
        (v) => filters.sizes!.includes(String(v.size)) && Number(v.stock) > 0
      );
      if (!hasSelectedSize) return false;
    }

    // 8. In-catalog Accent-Insensitive Search
    if (searchQuery.trim()) {
      const normQ = normalizeText(searchQuery);
      const name = normalizeText(p.name);
      const brand = normalizeText(p.brand?.name);
      const desc = normalizeText(p.description);
      const sku = normalizeText(p.sku);
      if (!name.includes(normQ) && !brand.includes(normQ) && !desc.includes(normQ) && !sku.includes(normQ)) {
        return false;
      }
    }

    return true;
  });

  // Client-side sorting
  if (filters.sort === 'price_asc') {
    displayedProducts.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (filters.sort === 'price_desc') {
    displayedProducts.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (filters.sort === 'rating') {
    displayedProducts.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  } else if (filters.sort === 'newest') {
    displayedProducts.sort(
      (a, b) =>
        new Date(b.created_at || Date.now()).getTime() -
        new Date(a.created_at || Date.now()).getTime()
    );
  }

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      brandSlug: brandSlug,
      isMaratona: isMaratona,
      sort: 'relevance',
      inStockOnly: false,
      minPrice: undefined,
      maxPrice: undefined,
      sizes: [],
    });
    setSearchQuery('');
  };

  // Count active non-default filters (exclusive of category/gender)
  const activeFiltersCount =
    (filters.brandSlug && filters.brandSlug !== brandSlug ? 1 : 0) +
    (filters.isMaratona && !isMaratona ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.sizes && filters.sizes.length > 0 ? filters.sizes.length : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      {/* CATALOG HEADER HERO */}
      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold bg-accent/10 border border-accent/30 px-2.5 py-0.5 rounded-xs">
              COLEÇÃO MASCULINA EXCLUSIVA
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-wolf-300 max-w-2xl font-sans">
            {subtitle}
          </p>
        </div>
      </section>

      {/* MAIN CATALOG AREA */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* DESKTOP FILTERS SIDEBAR (NO CATEGORY / NO GENDER) */}
          <div className="hidden lg:block shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* MAIN CONTENT COLUMN */}
          <div className="flex-1 space-y-6">
            {/* TOP CONTROLS BAR: SEARCH, MOBILE FILTER TRIGGER, SORTING */}
            <div className="bg-wolf-900/80 border border-wolf-800 rounded-sm p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* In-Catalog Search Bar (Accent Insensitive) */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-wolf-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar tênis por nome ou modelo (ex: Air Max, Campus)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-wolf-950 border border-wolf-800 pl-9 pr-8 py-2 text-xs text-white placeholder-wolf-500 rounded-xs focus:outline-none focus:border-accent font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-wolf-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Button + Sorting Dropdown */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                {/* Mobile Filter Drawer Trigger */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden px-3.5 py-2 bg-wolf-950 border border-wolf-800 text-white rounded-xs text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:border-accent"
                >
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  <span>Filtros</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sorting Select */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-wolf-400 hidden xl:inline uppercase">
                    ORDENAR:
                  </span>
                  <select
                    value={filters.sort || 'relevance'}
                    onChange={(e) =>
                      handleFilterChange({ ...filters, sort: e.target.value as FilterOptions['sort'] })
                    }
                    className="bg-wolf-950 border border-wolf-800 text-white text-xs px-3 py-2 rounded-xs focus:outline-none focus:border-accent font-mono uppercase cursor-pointer"
                  >
                    <option value="relevance">Mais Relevantes</option>
                    <option value="price_asc">Menor Preço</option>
                    <option value="price_desc">Maior Preço</option>
                    <option value="rating">Melhor Avaliados</option>
                    <option value="newest">Mais Recentes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ACTIVE FILTER BADGES (MARCA, TAMANHO, PREÇO, ESTOQUE, MARATONA, BUSCA) */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-wolf-900/40 border border-wolf-800/80 rounded-xs">
                <span className="text-[10px] font-mono text-wolf-400 uppercase tracking-wider mr-1">
                  FILTROS ATIVOS:
                </span>

                {/* Search Query Badge */}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-wolf-900 border border-wolf-700 text-xs font-mono text-white rounded-xs">
                    Busca: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery('')} className="text-wolf-400 hover:text-accent">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* In Stock Badge */}
                {filters.inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-wolf-900 border border-wolf-700 text-xs font-mono text-emerald-400 rounded-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Em Estoque
                    <button onClick={() => handleFilterChange({ ...filters, inStockOnly: false })} className="text-wolf-400 hover:text-accent">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Brand Badge */}
                {filters.brandSlug && filters.brandSlug !== brandSlug && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-wolf-900 border border-wolf-700 text-xs font-mono text-white rounded-xs uppercase">
                    Marca: {filters.brandSlug}
                    <button onClick={() => handleFilterChange({ ...filters, brandSlug: undefined })} className="text-wolf-400 hover:text-accent">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Maratona Badge */}
                {filters.isMaratona && !isMaratona && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 border border-emerald-700 text-xs font-mono text-emerald-300 rounded-xs">
                    🏃 Maratona
                    <button onClick={() => handleFilterChange({ ...filters, isMaratona: undefined })} className="text-emerald-400 hover:text-emerald-200">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Sizes Badges */}
                {filters.sizes && filters.sizes.map((sz) => (
                  <span key={sz} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-wolf-900 border border-wolf-700 text-xs font-mono text-white rounded-xs">
                    Tam {sz}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          ...filters,
                          sizes: filters.sizes?.filter((s) => s !== sz),
                        })
                      }
                      className="text-wolf-400 hover:text-accent"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Price Range Badge */}
                {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-wolf-900 border border-wolf-700 text-xs font-mono text-white rounded-xs">
                    Preço: {filters.minPrice ? `R$${filters.minPrice}` : 'R$0'} - {filters.maxPrice ? `R$${filters.maxPrice}` : '∞'}
                    <button
                      onClick={() => handleFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined })}
                      className="text-wolf-400 hover:text-accent"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {/* Reset All Button */}
                <button
                  onClick={handleReset}
                  className="text-[11px] font-mono text-accent hover:underline uppercase font-bold ml-auto flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Limpar Filtros
                </button>
              </div>
            )}

            {/* RESULTS COUNT & STATUS */}
            <div className="flex items-center justify-between text-xs font-mono text-wolf-400 pb-2">
              <div className="flex items-center gap-2">
                <span>
                  EXIBINDO <strong className="text-white">{loading ? '...' : displayedProducts.length}</strong> TÊNIS MASCULINOS
                </span>
                {loading && <RefreshCw className="w-3.5 h-3.5 text-accent animate-spin" />}
              </div>
            </div>

            {/* PRODUCT GRID OR EMPTY STATE */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
              <div className="text-center py-24 bg-wolf-900/40 border border-wolf-800 rounded-sm space-y-4 font-mono p-8">
                <p className="text-base text-wolf-300">Nenhum tênis masculino encontrado com os filtros selecionados.</p>
                <p className="text-xs text-wolf-500">Tente ajustar a busca ou limpar os filtros de tamanho e preço.</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-accent hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors inline-block"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <ProductGrid products={displayedProducts} />
            )}
          </div>
        </div>
      </main>

      {/* MOBILE FILTERS MODAL DRAWER */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="w-full max-w-xs sm:max-w-sm bg-wolf-950 border-l border-wolf-800 h-full flex flex-col">
            <div className="p-4 border-b border-wolf-800 flex items-center justify-between">
              <span className="text-xs font-heading font-black uppercase text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-accent" /> FILTROS
              </span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 text-wolf-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>

            <div className="p-4 border-t border-wolf-800 bg-wolf-950 flex gap-2">
              <button
                onClick={handleReset}
                className="w-1/3 py-3 bg-wolf-900 border border-wolf-800 text-wolf-300 font-mono text-xs uppercase"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-2/3 py-3 bg-accent text-white font-mono text-xs font-bold uppercase tracking-widest shadow-lg"
              >
                Ver ({displayedProducts.length}) Resultados
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
