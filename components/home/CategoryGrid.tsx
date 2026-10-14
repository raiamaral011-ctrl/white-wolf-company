import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES_LIST = [
  {
    name: 'TÊNIS DE CORRIDA & MARATONA',
    slug: 'maratona',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description: 'Placas de carbono e máximo amortecimento para quebrar seus recordes.',
  },
  {
    name: 'TÊNIS DE TREINO & ACADEMIA',
    slug: 'produtos?sport=academia',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
    description: 'Estabilidade superior para cross-training e musculação pesada.',
  },
  {
    name: 'TÊNIS CASUAL & LIFESTYLE',
    slug: 'produtos?sport=lifestyle',
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80',
    description: 'Silhuetas clássicas e design retrô-futurista para o dia a dia.',
  },
  {
    name: 'TÊNIS MASCULINO DE ELITE',
    slug: 'produtos?genero=masculino',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
    description: 'Inovação e amortecimento responsivo em todos os tamanhos.',
  },
  {
    name: 'TÊNIS EM OFERTA',
    slug: 'ofertas',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80',
    description: 'Oportunidades exclusivas com descontos de até 30% OFF.',
  },
];

export function CategoryGrid() {
  return (
    <section className="py-20 bg-black border-b border-wolf-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-mono text-accent uppercase tracking-[0.2em] font-extrabold">
            ESPECIALIDADES EM CALÇADOS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading mt-1">
            CATEGORIAS DE TÊNIS
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
                  CATEGORIA DE TÊNIS
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white font-heading group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-wolf-300 font-sans max-w-md hidden sm:block">
                  {cat.description}
                </p>
                <span className="text-xs font-mono text-white underline underline-offset-4 font-bold inline-block pt-1">
                  VER MODELOS →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
