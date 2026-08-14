'use client';

import React from 'react';
import { BRANDS, CATEGORIES } from '@/lib/data/products';
import { FilterOptions } from '@/types';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
}

export function ProductFilters({ filters, onFilterChange, onReset }: ProductFiltersProps) {
  return (
    <aside className="w-full lg:w-64 space-y-6 bg-wolf-950 p-6 border border-wolf-800 rounded-sm">
      <div className="flex items-center justify-between pb-4 border-b border-wolf-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            FILTROS
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] font-mono text-wolf-400 hover:text-accent flex items-center gap-1 uppercase tracking-wider"
          title="Limpar todos os filtros"
        >
          <RotateCcw className="w-3 h-3" />
          LIMPAR
        </button>
      </div>

      {/* MARCAS */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-wolf-300 font-mono">
          MARCAS
        </h4>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2.5 text-xs text-wolf-300 hover:text-white cursor-pointer select-none">
              <input
                type="radio"
                name="brand"
                checked={filters.brandSlug === brand.slug}
                onChange={() => onFilterChange({ ...filters, brandSlug: filters.brandSlug === brand.slug ? undefined : brand.slug })}
                className="accent-rose-600 bg-wolf-900 border-wolf-700"
              />
              <span className={filters.brandSlug === brand.slug ? 'text-accent font-bold' : ''}>
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* CATEGORIAS */}
      <div className="space-y-3 pt-4 border-t border-wolf-800">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-wolf-300 font-mono">
          CATEGORIA
        </h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 text-xs text-wolf-300 hover:text-white cursor-pointer select-none">
              <input
                type="radio"
                name="category"
                checked={filters.categorySlug === cat.slug}
                onChange={() => onFilterChange({ ...filters, categorySlug: filters.categorySlug === cat.slug ? undefined : cat.slug })}
                className="accent-rose-600 bg-wolf-900 border-wolf-700"
              />
              <span className={filters.categorySlug === cat.slug ? 'text-accent font-bold' : ''}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* GÊNERO */}
      <div className="space-y-3 pt-4 border-t border-wolf-800">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-wolf-300 font-mono">
          GÊNERO
        </h4>
        <div className="space-y-2">
          {[
            { label: 'Masculino', value: 'masculino' },
            { label: 'Feminino', value: 'feminino' },
            { label: 'Infantil', value: 'infantil' },
            { label: 'Unissex', value: 'unisex' },
          ].map((g) => (
            <label key={g.value} className="flex items-center gap-2.5 text-xs text-wolf-300 hover:text-white cursor-pointer select-none">
              <input
                type="radio"
                name="gender"
                checked={filters.gender === g.value}
                onChange={() => onFilterChange({ ...filters, gender: filters.gender === g.value ? undefined : g.value })}
                className="accent-rose-600 bg-wolf-900 border-wolf-700"
              />
              <span className={filters.gender === g.value ? 'text-accent font-bold' : ''}>
                {g.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* PREÇO */}
      <div className="space-y-3 pt-4 border-t border-wolf-800">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-wolf-300 font-mono">
          FAIXA DE PREÇO
        </h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min R$"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-1/2 bg-wolf-900 border border-wolf-800 px-2.5 py-1.5 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
          />
          <input
            type="number"
            placeholder="Máx R$"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-1/2 bg-wolf-900 border border-wolf-800 px-2.5 py-1.5 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
          />
        </div>
      </div>
    </aside>
  );
}
