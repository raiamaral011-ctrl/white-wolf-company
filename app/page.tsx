'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Product, Brand, Category } from '@/types';
import { HomeSection } from '@/app/admin/gerenciar-home/page';
import {
  ChevronRight, Sparkles, ShoppingBag, ArrowRight, ShieldCheck,
  Award, Zap, Star, RefreshCw, Layers, Tag
} from 'lucide-react';

export default function HomePage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsMap, setProductsMap] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        // Fetch active home sections, brands, categories in parallel
        const [secRes, metaRes] = await Promise.all([
          fetch('/api/admin/home-sections'),
          fetch('/api/admin/meta'),
        ]);

        let activeSections: HomeSection[] = [];
        if (secRes.ok) {
          const secData = await secRes.json();
          activeSections = (secData || []).filter((s: HomeSection) => s.is_active);
          setSections(activeSections);
        }

        if (metaRes.ok) {
          const metaData = await metaRes.json();
          setBrands(metaData.brands || []);
          const shoeCats = (metaData.categories || []).filter((c: Category) => {
            const slug = c.slug?.toLowerCase() || '';
            return slug !== 'roupas' && slug !== 'acessorios';
          });
          setCategories(shoeCats);
        }

        // Fetch products for any 'products' sections
        const prodSections = activeSections.filter((s) => s.type === 'products');
        if (prodSections.length > 0) {
          const map: { [key: string]: Product[] } = {};
          for (const s of prodSections) {
            const source = s.content?.productSource || 'all';
            let url = '/api/products';
            if (source === 'nike') url = '/api/products?brand=nike';
            else if (source === 'adidas') url = '/api/products?brand=adidas';
            else if (source === 'tenis') url = '/api/products?category=tenis';
            else if (source === 'maratona') url = '/api/products?maratona=true';
            else if (source === 'sale') url = '/api/products?sale=true';

            const res = await fetch(url);
            if (res.ok) {
              const prods = await res.json();
              map[s.id] = prods;
            }
          }
          setProductsMap(map);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      {/* RENDER DYNAMIC SECTIONS CONTROLLED BY ADMIN */}
      <main className="flex-1 space-y-16 pb-16">
        {loading ? (
          <div className="p-20 text-center text-wolf-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-accent animate-spin" />
            <span>Carregando experiência White Wolf Company...</span>
          </div>
        ) : sections.length === 0 ? (
          /* ELEGANT EMPTY/WELCOME HOME STATE inspirada no layout minimalista da Nike */
          <div className="space-y-16">
            {/* HERO BI-COLOR BRAND BANNER */}
            <section className="relative bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
              <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/30 px-3 py-1 rounded-xs">
                  <Sparkles className="w-3.5 h-3.5" /> LOJA OFICIAL WHITE WOLF COMPANY
                </span>

                <h1 className="text-4xl sm:text-6xl font-black uppercase font-heading tracking-tight text-white leading-tight">
                  EQUIPAMENTOS DE ELITE PARA <span className="text-accent">ALTA PERFORMANCE</span>
                </h1>

                <p className="text-sm sm:text-base text-wolf-300 max-w-2xl mx-auto font-sans leading-relaxed">
                  Trabalhamos exclusivamente com as maiores marcas mundiais de artigos esportivos: Adidas, Nike, ASICS, Puma e New Balance.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link
                    href="/produtos"
                    className="px-8 py-4 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-rose-950/50"
                  >
                    EXPLORAR CATÁLOGO COMPLETO →
                  </Link>
                  <Link
                    href="/marcas"
                    className="px-8 py-4 bg-wolf-900 hover:bg-wolf-800 border border-wolf-700 text-white font-mono text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    VER MARCAS PARCEIRAS
                  </Link>
                </div>
              </div>
            </section>

            {/* QUICK FEATURE BADGES */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-wolf-900/60 border border-wolf-800 rounded-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xs bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase font-heading text-white">PRODUTOS 100% ORIGINAIS</h3>
                    <p className="text-xs text-wolf-400 font-mono">Garantia direta com distribuidor oficial.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xs bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase font-heading text-white">ENTREGA RÁPIDA DE ELITE</h3>
                    <p className="text-xs text-wolf-400 font-mono">Frete grátis em compras acima de R$299.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xs bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase font-heading text-white">PARCELAMENTO FACILITADO</h3>
                    <p className="text-xs text-wolf-400 font-mono">Até 12x sem juros no cartão ou 5% OFF PIX.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* BRAND CATEGORIES SELECTION */}
            {categories.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-center justify-between border-b border-wolf-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                      NAVEGUE POR CATEGORIA
                    </span>
                    <h2 className="text-2xl font-black uppercase font-heading tracking-tight text-white">
                      ESPECIALIDADES ESPORTIVAS
                    </h2>
                  </div>
                  <Link href="/produtos" className="text-xs font-mono text-accent hover:underline uppercase">
                    VER TODAS →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/produtos?categoria=${cat.slug}`}
                      className="p-6 bg-wolf-900/60 border border-wolf-800 hover:border-accent hover:bg-wolf-900 transition-all text-center space-y-2 rounded-xs group"
                    >
                      <Layers className="w-8 h-8 text-accent mx-auto group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-mono font-bold uppercase text-white block">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* BRANDS SECTION */}
            {brands.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-center justify-between border-b border-wolf-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                      PARCEIROS GLOBAIS
                    </span>
                    <h2 className="text-2xl font-black uppercase font-heading tracking-tight text-white">
                      MARCAS DE ALTA PERFORMANCE
                    </h2>
                  </div>
                  <Link href="/marcas" className="text-xs font-mono text-accent hover:underline uppercase">
                    VER TODAS AS MARCAS →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={`/marca/${b.slug}`}
                      className="p-6 bg-wolf-900/60 border border-wolf-800 hover:border-accent hover:bg-wolf-900 transition-all text-center space-y-3 rounded-xs group"
                    >
                      <Tag className="w-6 h-6 text-accent mx-auto group-hover:scale-110 transition-transform" />
                      <h3 className="text-lg font-black font-heading uppercase text-white">
                        {b.name}
                      </h3>
                      <span className="text-[10px] font-mono text-accent uppercase tracking-wider block font-bold">
                        VER COLEÇÃO →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* DYNAMIC SECTIONS RENDERER (CONTROLLED BY ADMIN) */
          sections.map((sec) => {
            if (sec.type === 'hero') {
              return (
                <section key={sec.id} className="relative bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-4">
                      {sec.subtitle && (
                        <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/30 px-3 py-1 rounded-xs inline-block">
                          {sec.subtitle}
                        </span>
                      )}
                      <h1 className="text-3xl sm:text-5xl font-black uppercase font-heading tracking-tight text-white leading-tight">
                        {sec.title}
                      </h1>
                      {sec.description && (
                        <p className="text-sm text-wolf-300 font-sans leading-relaxed">
                          {sec.description}
                        </p>
                      )}
                      {sec.button_text && (
                        <div className="pt-2">
                          <Link
                            href={sec.button_url || '/produtos'}
                            className="px-8 py-4 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-widest inline-block transition-all shadow-xl"
                          >
                            {sec.button_text} →
                          </Link>
                        </div>
                      )}
                    </div>

                    {sec.image_url && (
                      <div className="lg:col-span-6">
                        <div className="aspect-[16/9] relative rounded-sm overflow-hidden border border-wolf-800 shadow-2xl">
                          <Image src={sec.image_url} alt={sec.title || 'Banner'} fill className="object-cover" />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            if (sec.type === 'banner_split') {
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-wolf-900 border border-wolf-800 rounded-sm space-y-4">
                      {sec.subtitle && (
                        <span className="text-xs font-mono text-accent uppercase font-bold tracking-wider">
                          {sec.subtitle}
                        </span>
                      )}
                      <h2 className="text-2xl font-black uppercase font-heading text-white">{sec.title}</h2>
                      {sec.description && <p className="text-xs text-wolf-300">{sec.description}</p>}
                      {sec.button_text && (
                        <Link href={sec.button_url || '/produtos'} className="text-xs font-mono text-accent font-bold uppercase hover:underline inline-block">
                          {sec.button_text} →
                        </Link>
                      )}
                    </div>
                  </div>
                </section>
              );
            }

            if (sec.type === 'categories') {
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div className="border-b border-wolf-800 pb-4">
                    <span className="text-xs font-mono text-accent uppercase font-bold">{sec.subtitle || 'CATEGORIAS'}</span>
                    <h2 className="text-2xl font-black uppercase font-heading text-white">{sec.title || 'EXPLORAR CATEGORIAS'}</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/produtos?categoria=${cat.slug}`}
                        className="p-6 bg-wolf-900/60 border border-wolf-800 hover:border-accent transition-all text-center space-y-2 rounded-xs"
                      >
                        <Layers className="w-8 h-8 text-accent mx-auto" />
                        <span className="text-xs font-mono font-bold uppercase text-white block">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.type === 'brands') {
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div className="border-b border-wolf-800 pb-4">
                    <span className="text-xs font-mono text-accent uppercase font-bold">{sec.subtitle || 'MARCAS'}</span>
                    <h2 className="text-2xl font-black uppercase font-heading text-white">{sec.title || 'MARCAS PARCEIRAS DE ELITE'}</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {brands.map((b) => (
                      <Link
                        key={b.id}
                        href={`/marca/${b.slug}`}
                        className="p-6 bg-wolf-900/60 border border-wolf-800 hover:border-accent text-center space-y-3 rounded-xs"
                      >
                        <Tag className="w-6 h-6 text-accent mx-auto" />
                        <h3 className="text-lg font-black font-heading uppercase text-white">{b.name}</h3>
                        <span className="text-[10px] font-mono text-accent uppercase font-bold block">VER COLEÇÃO →</span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            }

            if (sec.type === 'products') {
              const prods = productsMap[sec.id] || [];
              return (
                <section key={sec.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-wolf-800 pb-4">
                    <div>
                      {sec.subtitle && <span className="text-xs font-mono text-accent uppercase font-bold">{sec.subtitle}</span>}
                      <h2 className="text-2xl font-black uppercase font-heading text-white">{sec.title || 'VITRINE DE PRODUTOS'}</h2>
                    </div>
                    {sec.button_text && (
                      <Link href={sec.button_url || '/produtos'} className="text-xs font-mono text-accent uppercase hover:underline">
                        {sec.button_text} →
                      </Link>
                    )}
                  </div>

                  <ProductGrid
                    products={prods}
                    emptyMessage="Nenhum produto cadastrado nesta categoria no momento."
                  />
                </section>
              );
            }

            if (sec.type === 'cta') {
              return (
                <section key={sec.id} className="bg-gradient-to-r from-rose-950 via-wolf-900 to-black py-16 border-y border-wolf-800">
                  <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
                    {sec.subtitle && <span className="text-xs font-mono text-accent font-bold uppercase">{sec.subtitle}</span>}
                    <h2 className="text-3xl font-black font-heading uppercase text-white">{sec.title}</h2>
                    {sec.description && <p className="text-xs text-wolf-300">{sec.description}</p>}
                    {sec.button_text && (
                      <Link href={sec.button_url || '/produtos'} className="px-8 py-3.5 bg-accent text-white font-mono text-xs font-bold uppercase tracking-widest inline-block shadow-lg">
                        {sec.button_text} →
                      </Link>
                    )}
                  </div>
                </section>
              );
            }

            return null;
          })
        )}
      </main>

      <Footer />
    </div>
  );
}
