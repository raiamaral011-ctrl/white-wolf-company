import React from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { Hero } from '@/components/home/Hero';
import { BrandShowcase } from '@/components/home/BrandShowcase';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ProductGrid } from '@/components/product/ProductGrid';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { Product } from '@/types';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles, Tag } from 'lucide-react';

async function getLiveProducts(): Promise<Product[]> {
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as Product[];
    }
  } catch (err) {
    console.error('Homepage Supabase fetch failed, using mock data:', err);
  }
  return MOCK_PRODUCTS;
}

export default async function HomePage() {
  const allProducts = await getLiveProducts();

  const featuredProducts = allProducts.filter((p) => p.featured);
  const newProducts = allProducts.filter((p) => p.is_new);
  const adidasProducts = allProducts.filter((p) => p.brand?.slug === 'adidas');
  const nikeProducts = allProducts.filter((p) => p.brand?.slug === 'nike');

  // Filter products for marathoners
  const marathonProducts = allProducts.filter((p) => {
    const nameLower = p.name.toLowerCase();
    const descLower = p.description.toLowerCase();
    return (
      p.sport === 'corrida' ||
      p.sport === 'running' ||
      nameLower.includes('adizero') ||
      nameLower.includes('alphafly') ||
      nameLower.includes('nimbus') ||
      nameLower.includes('pegasus') ||
      nameLower.includes('marathon') ||
      descLower.includes('maratona')
    );
  });

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <Hero />

        {/* BRAND SHOWCASE */}
        <BrandShowcase />

        {/* CATEGORIES */}
        <CategoryGrid />

        {/* PRODUTOS EM DESTAQUE */}
        <section className="py-20 bg-wolf-950 border-b border-wolf-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-widest">
                  <Flame className="w-4 h-4 fill-accent" />
                  SELEÇÃO ESPECIAL
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading mt-1">
                  PRODUTOS EM DESTAQUE
                </h2>
              </div>
              <Link href="/tenis" className="text-xs font-mono text-accent hover:underline uppercase tracking-wider flex items-center gap-1 font-bold hidden sm:flex">
                VER CATALOGO COMPLETO <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <ProductGrid products={(featuredProducts.length > 0 ? featuredProducts : allProducts).slice(0, 4)} />
          </div>
        </section>

        {/* BANNER PROMOCIONAL */}
        <section className="py-16 bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-xl">
              <span className="px-3 py-1 bg-accent text-white text-[10px] font-mono font-extrabold uppercase tracking-widest inline-block">
                OFERTA DA SEMANA
              </span>
              <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-heading">
                DESCONTO ESPECIAL DE ATÉ 30% OFF
              </h3>
              <p className="text-sm text-wolf-300">
                Aproveite preços reduzidos em calçados de corrida e vestuário de alta performance. Estoque limitado.
              </p>
            </div>

            <Link
              href="/ofertas"
              className="px-8 py-4 bg-white text-wolf-950 font-black text-xs uppercase tracking-widest hover:bg-wolf-200 transition-colors flex items-center gap-2 shrink-0"
            >
              VER OFERTAS DA SEMANA
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* NOVIDADES */}
        <section className="py-20 bg-black border-b border-wolf-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" />
                  ÚLTIMOS LANÇAMENTOS
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading mt-1">
                  NOVIDADES CHEGANDO
                </h2>
              </div>
              <Link href="/tenis" className="text-xs font-mono text-accent hover:underline uppercase tracking-wider flex items-center gap-1 font-bold hidden sm:flex">
                VER NOVIDADES <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <ProductGrid products={(newProducts.length > 0 ? newProducts : allProducts).slice(0, 4)} />
          </div>
        </section>

        {/* ESPAÇO MARATONISTA PERFORMANCE SECTION */}
        <section className="py-20 bg-wolf-900/40 border-b border-wolf-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/20 via-transparent to-transparent z-0 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-accent uppercase font-black tracking-widest block">
                  ALTA PERFORMANCE • 42K
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-heading mt-1">
                  ESPAÇO MARATONISTA
                </h2>
                <p className="text-sm text-wolf-400 font-mono mt-1">
                  Tênis de elite com placa de carbono, amortecimento responsivo e artigos para longas distâncias.
                </p>
              </div>
              <Link
                href="/maratona"
                className="px-5 py-2.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xs transition-colors self-start sm:self-auto"
              >
                VER LINHA CORRIDA COMPLETA <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <ProductGrid products={marathonProducts.slice(0, 4)} />
          </div>
        </section>

        {/* PRODUTOS POR MARCA SPOTLIGHTS */}
        <section className="py-20 bg-wolf-950 border-b border-wolf-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {/* ADIDAS SPOTLIGHT */}
            {adidasProducts.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-wolf-800">
                  <h3 className="text-2xl font-black uppercase font-heading text-white tracking-wider flex items-center gap-3">
                    PRODUTOS <span className="text-accent">ADIDAS</span>
                  </h3>
                  <Link href="/marca/adidas" className="text-xs font-mono text-wolf-400 hover:text-white uppercase">
                    VER ADIDAS →
                  </Link>
                </div>
                <ProductGrid products={adidasProducts.slice(0, 4)} />
              </div>
            )}

            {/* NIKE SPOTLIGHT */}
            {nikeProducts.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-wolf-800">
                  <h3 className="text-2xl font-black uppercase font-heading text-white tracking-wider flex items-center gap-3">
                    PRODUTOS <span className="text-accent">NIKE</span>
                  </h3>
                  <Link href="/marca/nike" className="text-xs font-mono text-wolf-400 hover:text-white uppercase">
                    VER NIKE →
                  </Link>
                </div>
                <ProductGrid products={nikeProducts.slice(0, 4)} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
