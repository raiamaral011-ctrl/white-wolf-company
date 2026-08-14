import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES_LIST = [
  { name: 'TÊNIS DE CORRIDA', slug: 'tenis', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
  { name: 'ROUPAS ESPORTIVAS', slug: 'roupas', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' },
  { name: 'TREINO & ACADEMIA', slug: 'roupas/masculino', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
  { name: 'ACESSÓRIOS & MOCHILAS', slug: 'acessorios', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  { name: 'OFERTAS IMPERDÍVEIS', slug: 'ofertas', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800' },
];

export function CategoryGrid() {
  return (
    <section className="py-20 bg-black border-b border-wolf-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-mono text-accent uppercase tracking-[0.2em] font-extrabold">
            EXPLORE POR DEPARTAMENTO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading mt-1">
            CATEGORIAS EM DESTAQUE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_LIST.map((cat, idx) => (
            <Link
              key={cat.name}
              href={`/${cat.slug}`}
              className={`group relative min-h-[280px] bg-wolf-900 overflow-hidden border border-wolf-800 hover:border-accent transition-all rounded-sm flex items-end p-6 ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2 min-h-[340px]' : ''
              }`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/40 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest block font-bold">
                  DEPARTAMENTO
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white font-heading group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs font-mono text-white underline underline-offset-4 font-bold inline-block">
                  VER PRODUTOS →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
