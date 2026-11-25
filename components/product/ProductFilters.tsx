'use client';

import React, { useState, useEffect } from 'react';
import { BRANDS as FALLBACK_BRANDS } from '@/lib/data/products';
import { FilterOptions, Brand } from '@/types';
import { SlidersHorizontal, RotateCcw, Check, CheckCircle2, Box } from 'lucide-react';

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
}

// Full masculine shoe sizes from 38 to 45
const MALE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];

const PRICE_RANGES = [
  { label: 'Até R$ 300', min: undefined, max: 300 },
  { label: 'R$ 300 a R$ 600', min: 300, max: 600 },
  { label: 'R$ 600 a R$ 1.000', min: 600, max: 1000 },
  { label: 'Acima de R$ 1.000', min: 1000, max: undefined },
];

export function ProductFilters({ filters, onFilterChange, onReset }: ProductFiltersProps) {
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS as Brand[]);

  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch('/api/admin/meta');
        if (res.ok) {
          const data = await res.json();
          if (data.brands && data.brands.length > 0) setBrands(data.brands);
        }
      } catch (err) {
        console.error('Error fetching live brands meta:', err);
      }
    }
    loadMeta();
  }, []);

  const currentSizes = filters.sizes || [];

  const toggleSize = (size: string) => {
    const updated = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    onFilterChange({ ...filters, sizes: updated });
  };

  const applyPriceRange = (min?: number, max?: number) => {
    if (filters.minPrice === min && filters.maxPrice === max) {
      onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined });
    } else {
      onFilterChange({ ...filters, minPrice: min, maxPrice: max });
    }
  };

  return (
    <aside className="w-full lg:w-64 space-y-6 bg-wolf-950 p-6 border border-wolf-800 rounded-sm">
      {/* HEADER & RESET */}
      <div className="flex items-center justify-between pb-4 border-b border-wolf-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            FILTROS
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] font-mono text-wolf-400 hover:text-accent flex items-center gap-1 uppercase tracking-wider transition-colors"
          title="Limpar todos os filtros"
        >
          <RotateCcw className="w-3 h-3" />
          LIMPAR
        </button>
      </div>

      {/* 1. DISPONIBILIDADE EM ESTOQUE (OBRIGATÓRIO PROMPT 2) */}
      <div className="p-3 bg-wolf-900/60 border border-wolf-800 rounded-xs space-y-2">
        <label className="flex items-center gap-2.5 text-xs text-white font-bold font-mono cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="accent-rose-600 w-4 h-4 rounded cursor-pointer"
          />
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SOMENTE EM ESTOQUE
          </span>
        </label>
        <p className="text-[10px] text-wolf-400 font-mono leading-tight pl-6">
          Ocultar modelos totalmente esgotados.
        </p>
      </div>

      {/* 2. SELEÇÃO MARATONA (ALTA PERFORMANCE) */}
      <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xs space-y-1.5">
        <label className="flex items-center gap-2.5 text-xs text-emerald-300 font-bold font-mono cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.isMaratona}
            onChange={(e) => onFilterChange({ ...filters, isMaratona: e.target.checked ? true : undefined })}
            className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
          />
          <span>🏃 SELEÇÃO MARATONA</span>
        </label>
        <p className="text-[10px] text-emerald-400/80 font-mono leading-tight pl-6">
          Exibir tênis masculinos com placa de carbono.
        </p>
      </div>

      {/* 3. MARCAS PARCEIRAS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-wolf-300 font-mono">
            MARCA
          </h4>
          {filters.brandSlug && (
            <button
              onClick={() => onFilterChange({ ...filters, brandSlug: undefined })}
              className="text-[10px] font-mono text-accent hover:underline"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {brands.map((brand) => {
            const isChecked = filters.brandSlug === brand.slug;
            return (
              <label
                key={brand.id}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xs text-xs cursor-pointer select-none transition-colors ${
                  isChecked
                    ? 'bg-wolf-900 border border-accent/40 text-white font-bold'
                    : 'text-wolf-300 hover:text-white hover:bg-wolf-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="brand"
                    checked={isChecked}
                    onChange={() => onFilterChange({ ...filters, brandSlug: isChecked ? undefined : brand.slug })}
                    className="accent-rose-600 w-3.5 h-3.5"
                  />
                  <span>{brand.name}</span>
                </div>
                {isChecked && <Check className="w-3.5 h-3.5 text-accent" />}
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. NUMERAÇÃO / TAMANHO (BR) — COMPLETO DE 38 A 45 (PROMPT 2) */}
      <div className="space-y-3 pt-4 border-t border-wolf-800">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-wolf-300 font-mono">
            TAMANHO MASCULINO (BR)
          </h4>
          {currentSizes.length > 0 && (
            <button
              onClick={() => onFilterChange({ ...filters, sizes: [] })}
              className="text-[10px] font-mono text-accent hover:underline"
            >
              Limpar ({currentSizes.length})
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
          {MALE_SIZES.map((sz) => {
            const isSelected = currentSizes.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                onClick={() => toggleSize(sz)}
                className={`py-2 border text-center transition-all rounded-xs font-bold ${
                  isSelected
                    ? 'bg-accent border-accent text-white shadow-md'
                    : 'bg-wolf-900 border-wolf-800 text-wolf-300 hover:border-wolf-600 hover:text-white'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. FAIXA DE PREÇO */}
      <div className="space-y-3 pt-4 border-t border-wolf-800">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-wolf-300 font-mono">
            FAIXA DE PREÇO
          </h4>
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <button
              onClick={() => onFilterChange({ ...filters, minPrice: undefined, maxPrice: undefined })}
              className="text-[10px] font-mono text-accent hover:underline"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Preset Range Pills */}
        <div className="space-y-1">
          {PRICE_RANGES.map((r, i) => {
            const isRangeActive = filters.minPrice === r.min && filters.maxPrice === r.max;
            return (
              <button
                key={i}
                type="button"
                onClick={() => applyPriceRange(r.min, r.max)}
                className={`w-full text-left px-2.5 py-1.5 rounded-xs text-xs font-mono transition-colors flex items-center justify-between ${
                  isRangeActive
                    ? 'bg-wolf-900 border border-accent/40 text-accent font-bold'
                    : 'text-wolf-400 hover:text-white hover:bg-wolf-900/40'
                }`}
              >
                <span>{r.label}</span>
                {isRangeActive && <Check className="w-3 h-3 text-accent" />}
              </button>
            );
          })}
        </div>

        {/* Custom Min/Max Inputs */}
        <div className="flex gap-2 font-mono pt-1">
          <input
            type="number"
            placeholder="Mín R$"
            value={filters.minPrice ?? ''}
            onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-1/2 bg-wolf-900 border border-wolf-800 px-2.5 py-1.5 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent rounded-xs"
          />
          <input
            type="number"
            placeholder="Máx R$"
            value={filters.maxPrice ?? ''}
            onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-1/2 bg-wolf-900 border border-wolf-800 px-2.5 py-1.5 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent rounded-xs"
          />
        </div>
      </div>
    </aside>
  );
}
