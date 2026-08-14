'use client';

import React from 'react';
import Link from 'next/link';

const BRANDS_LIST = [
  { name: 'ADIDAS', slug: 'adidas' },
  { name: 'NIKE', slug: 'nike' },
  { name: 'ASICS', slug: 'asics' },
  { name: 'PUMA', slug: 'puma' },
  { name: 'NEW BALANCE', slug: 'new-balance' },
];

export function BrandBar() {
  return (
    <div className="bg-wolf-950 text-white border-b border-wolf-800 py-2.5 px-4 overflow-x-auto whitespace-nowrap">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 text-xs font-semibold tracking-wider">
        <div className="flex items-center gap-1.5 text-wolf-400 uppercase text-[10px] tracking-widest font-mono">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          MARCAS PARCEIRAS:
        </div>
        <div className="flex items-center gap-6 sm:gap-10">
          {BRANDS_LIST.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marca/${brand.slug}`}
              className="text-wolf-300 hover:text-white transition-colors duration-200 uppercase tracking-widest hover:scale-105 transform inline-block"
            >
              {brand.name}
            </Link>
          ))}
        </div>
        <Link
          href="/marcas"
          className="text-accent hover:text-rose-400 font-mono text-[11px] uppercase tracking-wider underline underline-offset-4 hidden md:inline-block"
        >
          VER TODAS →
        </Link>
      </div>
    </div>
  );
}
