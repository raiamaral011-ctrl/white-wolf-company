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

  // Keep initial categorySlug / brandSlug synced if props change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categorySlug: categorySlug ?? prev.categorySlug,
      brandSlug: brandSlug ?? prev.brandSlug,
      gender: genderFilter ?? prev.gender,
    }));
  }, [categorySlug, brandSlug, genderFilter]);

  // Fetch live products from API (Supabase-backed, fallback to mock)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.categorySlug) params.set('category', filters.categorySlug);
        if (filters.brandSlug) params.set('brand', filters.brandSlug);
        if (filters.gender) params.set('gender', filters.gender);
        if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
        if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
        if (filters.sort) params.set('sort', filters.sort);
        if (onlySale) params.set('sale', 'true');

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data: Product[] = await res.json();
          setAllProducts(data);
        } else {
          setAllProducts([...MOCK_PRODUCTS]);
        }
      } catch (err) {
        console.error('Error fetching catalog products:', err);
        setAllProducts([...MOCK_PRODUCTS]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    filters.categorySlug,
    filters.brandSlug,
    filters.gender,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.sizes,
    onlySale,
  ]);

  // STRICT CLIENT-SIDE AND FILTERING AS EXTRA GUARANTEE
  const displayedProducts = allProducts.filter((p) => {
    // 1. Sale check
    if (onlySale && !p.is_sale) return false;

    // 2. Brand Check (STRICT EQUALITY)
    if (filters.brandSlug) {
      const targetBrand = filters.brandSlug.toLowerCase();
      const pBrandSlug = p.brand?.slug?.toLowerCase() || '';
      const pBrandName = p.brand?.name?.toLowerCase() || '';
      if (pBrandSlug !== targetBrand && pBrandName !== targetBrand) return false;
    }

    // 3. Category Check (STRICT EQUALITY)
    if (filters.categorySlug) {
      const targetCat = filters.categorySlug.toLowerCase();
      const pCatSlug = p.category?.slug?.toLowerCase() || '';
      const pCatName = p.category?.name?.toLowerCase() || '';
      if (pCatSlug !== targetCat && pCatName !== targetCat) return false;
    }

    // 4. Gender Check
    if (filters.gender) {
      const targetGender = filters.gender.toLowerCase();
      const pGender = p.gender?.toLowerCase() || 'unisex';
      if (pGender !== targetGender && pGender !== 'unisex') return false;
    }

    // 5. Price Min
    if (filters.minPrice !== undefined && Number(p.price) < filters.minPrice) return false;

    // 6. Price Max
    if (filters.maxPrice !== undefined && Number(p.price) > filters.maxPrice) return false;

    // 7. Size Filter
    if (filters.sizes && filters.sizes.length > 0) {
      if (!p.variants || p.variants.length === 0) return true;
      const hasSize = p.variants.some(
        (v) => filters.sizes!.includes(String(v.size)) && Number(v.stock) > 0
      );
      if (!hasSize) return false;
    }

    return true;
  });

  // Sort displayed products
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
      categorySlug: categorySlug,
      brandSlug: brandSlug,
      gender: genderFilter,
      sort: 'relevance',
      minPrice: undefined,
      maxPrice: undefined,
      sizes: [],
    });
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
                  className="bg-wolf-900 border border-wolf-800 text-white text-xs px-3 py-1.5 focus:outline-none focus:border-accent font-mono uppercase cursor-pointer"
                >
                  <option value="relevance">Mais Relevantes</option>
                  <option value="price_asc">Menor Preço</option>
                  <option value="price_desc">Maior Preço</option>
                  <option value="rating">Melhor Avaliados</option>
                  <option value="newest">Mais Recentes</option>
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
              <div className="text-center py-20 bg-wolf-900/50 border border-wolf-800 rounded-sm space-y-3 font-mono">
                <p className="text-sm text-wolf-300">Nenhum produto encontrado com os filtros selecionados.</p>
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-accent uppercase hover:underline"
                >
                  Limpar todos os filtros →
                </button>
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
