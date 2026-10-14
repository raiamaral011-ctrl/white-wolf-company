'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BRANDS } from '@/lib/data/products';
import { ArrowRight, Tag } from 'lucide-react';

export function BrandShowcase() {
  const [brands, setBrands] = useState<any[]>(BRANDS);

  useEffect(() => {
    async function loadBrands() {
      try {
        const res = await fetch('/api/brands');
        if (res.ok) {
          const data = await res.json();
          if (data.brands && data.brands.length > 0) {
            setBrands(data.brands);
          }
        }
      } catch (err) {
        // Fallback to static brands
      }
    }
    loadBrands();
  }, []);

  return (
    <section className="py-20 bg-wolf-950 border-b border-wolf-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-accent uppercase tracking-[0.2em] font-extrabold">
              CURADORIA OFICIAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading mt-1">
              MARCAS DE ELITE EM TÊNIS
            </h2>
          </div>
          <Link
            href="/marcas"
            className="text-xs font-mono text-accent hover:underline uppercase tracking-wider flex items-center gap-1 font-bold"
          >
            VER TODAS AS MARCAS
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id || brand.slug}
              href={`/marca/${brand.slug}`}
              className="group p-8 bg-wolf-900/60 border border-wolf-800 hover:border-accent hover:bg-wolf-900 transition-all rounded-sm flex flex-col justify-between items-center text-center space-y-4 hover:-translate-y-1 transform shadow-xl"
            >
              <div className="space-y-2">
                <span className="text-2xl font-black font-heading tracking-tighter text-white group-hover:text-accent transition-colors block">
                  {brand.name}
                </span>
                <p className="text-[11px] text-wolf-400 font-sans line-clamp-2 leading-snug">
                  {brand.description || `Coleção exclusiva de calçados de corrida e treino ${brand.name}.`}
                </p>
              </div>

              <span className="text-[10px] font-mono text-wolf-300 uppercase tracking-widest px-3 py-1 bg-wolf-950 border border-wolf-800 rounded-full group-hover:border-accent">
                VER CATÁLOGO →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
