'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { Product, Brand, Category } from '@/types';
import { HomeSection } from '@/app/admin/gerenciar-home/page';
import {
  ChevronRight, Sparkles, ShoppingBag, ArrowRight, ShieldCheck,
  Award, Zap, Star, RefreshCw, Layers, Tag, Flame, Truck, CreditCard,
  RotateCcw
} from 'lucide-react';

export default function HomePage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [maratonaProducts, setMaratonaProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [productsMap, setProductsMap] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      try {
        // Fetch active home sections, brands, categories and products in parallel
        const [secRes, metaRes, prodsRes, maraRes, saleRes, popRes] = await Promise.all([
          fetch('/api/admin/home-sections'),
          fetch('/api/admin/meta'),
          fetch('/api/products?featured=true'),
          fetch('/api/products?maratona=true'),
          fetch('/api/products?sale=true'),
          fetch('/api/products?sort=rating'),
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

        if (prodsRes.ok) {
          const prods = await prodsRes.json();
          setFeaturedProducts(prods || []);
        }

        if (maraRes.ok) {
          const mara = await maraRes.json();
          setMaratonaProducts(mara || []);
        }

        if (saleRes.ok) {
          const sales = await saleRes.json();
          setSaleProducts(sales || []);
        }

        if (popRes.ok) {
          const pop = await popRes.json();
          setPopularProducts(pop || []);
        }

        // Fetch products for any admin-configured 'products' sections
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

      <main className="flex-1 space-y-16 sm:space-y-24 pb-20">
        {loading ? (
          <div className="p-24 text-center text-wolf-400 font-mono text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-accent animate-spin" />
            <span>Carregando experiência White Wolf Company...</span>
          </div>
        ) : sections.length === 0 ? (
          /* HOMEPAGE PADRÃO PROFISSIONAL (ESTILO NIKE: HIERARQUIA CLARA E NAVEGAÇÃO INTUITIVA) */
          <div className="space-y-16 sm:space-y-24">
            {/* 1. HERO BANNER PRINCIPAL DE DESTAQUE */}
            <section className="relative min-h-[70vh] sm:min-h-[80vh] bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 flex items-center justify-center text-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
              {/* Background ambient lighting */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-rose-600/30 rounded-full blur-[140px]" />
                <div className="absolute -bottom-32 right-10 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]" />
              </div>

              <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent uppercase tracking-widest bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" /> CURADORIA OFICIAL EM CALÇADOS DE ALTA PERFORMANCE
                </span>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase font-heading tracking-tight text-white leading-tight">
                  TÊNIS DE ELITE PARA <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-rose-500">
                    SUPERAR LIMITES
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-wolf-300 max-w-2xl mx-auto font-sans leading-relaxed">
                  As principais tecnologias mundiais de amortecimento e propulsão: <strong className="text-white">Nike, Adidas, ASICS, Puma e New Balance</strong> reunidas em uma experiência de compra rápida e segura.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link
                    href="/produtos"
                    className="px-8 py-4 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-950/60 hover:scale-105 transform flex items-center gap-2"
                  >
                    EXPLORAR TODOS OS TÊNIS
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/maratona"
                    className="px-8 py-4 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 font-mono text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    🏃 SELEÇÃO MARATONA
                  </Link>
                  <Link
                    href="/marcas"
                    className="px-6 py-4 bg-wolf-900/90 hover:bg-wolf-800 border border-wolf-700 text-wolf-300 hover:text-white font-mono text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    MARCAS PARCEIRAS
                  </Link>
                </div>
              </div>
            </section>

            {/* 2. BARRA DE BENEFÍCIOS (ESTILO NIKE) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-wolf-900/95 border border-wolf-800 rounded-sm shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xs bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase font-heading text-white">100% ORIGINAIS</h3>
                    <p className="text-[11px] text-wolf-400 font-mono">Garantia direta das marcas oficiais.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xs bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase font-heading text-white">FRETE GRÁTIS BRASIL</h3>
                    <p className="text-[11px] text-wolf-400 font-mono">Em pedidos acima de R$ 299.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xs bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase font-heading text-white">PARCELAMENTO SEM JUROS</h3>
                    <p className="text-[11px] text-wolf-400 font-mono">Até 10x no cartão ou 5% no PIX.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xs bg-wolf-800 border border-wolf-700 flex items-center justify-center text-wolf-300 shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase font-heading text-white">PRIMEIRA TROCA GRÁTIS</h3>
                    <p className="text-[11px] text-wolf-400 font-mono">Até 30 dias após o recebimento.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. CAMPANHAS E LANÇAMENTOS (DESTAQUES DA SEMANA COM CARROSSEL) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-end justify-between border-b border-wolf-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" /> LANÇAMENTOS OFICIAIS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase font-heading tracking-tight text-white mt-1">
                    DESTAQUES DA SEMANA
                  </h2>
                </div>
                <Link
                  href="/produtos"
                  className="text-xs font-mono text-accent hover:underline uppercase font-bold flex items-center gap-1 shrink-0"
                >
                  VER TODOS OS MODELOS <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Product Carousel with left/right buttons */}
              <ProductCarousel
                products={featuredProducts.length > 0 ? featuredProducts : popularProducts}
                emptyMessage="Carregando calçados em destaque..."
              />
            </section>

            {/* 4. EXPLORE POR CATEGORIA DE TÊNIS (ESTILO NIKE: CARDS VISUAIS DE MODALIDADES) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-end justify-between border-b border-wolf-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                    NAVEGUE POR FINALIDADE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase font-heading tracking-tight text-white mt-1">
                    CATEGORIAS DE TÊNIS
                  </h2>
                </div>
                <Link href="/produtos" className="text-xs font-mono text-accent hover:underline uppercase font-bold">
                  VER TODAS →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Corrida & Maratona */}
                <Link
                  href="/maratona"
                  className="group relative min-h-[300px] bg-wolf-900 border border-wolf-800 hover:border-emerald-500 rounded-sm overflow-hidden p-6 flex flex-col justify-end transition-all shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
                    alt="Tênis de Corrida e Maratona"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/50 to-transparent" />
                  <div className="relative z-10 space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                      ALTA PERFORMANCE
                    </span>
                    <h3 className="text-2xl font-black uppercase font-heading text-white group-hover:text-emerald-300 transition-colors">
                      CORRIDA &amp; MARATONA
                    </h3>
                    <p className="text-xs text-wolf-300 font-sans">
                      Placas de carbono e retorno máximo de energia para quebrar seus recordes.
                    </p>
                    <span className="text-xs font-mono text-emerald-400 font-bold underline underline-offset-4 inline-block pt-1">
                      VER MODELOS MARATONA →
                    </span>
                  </div>
                </Link>

                {/* Treino & Academia */}
                <Link
                  href="/produtos?sport=academia"
                  className="group relative min-h-[300px] bg-wolf-900 border border-wolf-800 hover:border-accent rounded-sm overflow-hidden p-6 flex flex-col justify-end transition-all shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80"
                    alt="Tênis de Treino e Academia"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/50 to-transparent" />
                  <div className="relative z-10 space-y-1.5">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
                      FORÇA &amp; ESTABILIDADE
                    </span>
                    <h3 className="text-2xl font-black uppercase font-heading text-white group-hover:text-accent transition-colors">
                      TREINO &amp; ACADEMIA
                    </h3>
                    <p className="text-xs text-wolf-300 font-sans">
                      Aderência firme e solado plano para cross-training e levantamento de peso.
                    </p>
                    <span className="text-xs font-mono text-white font-bold underline underline-offset-4 inline-block pt-1">
                      VER CALÇADOS DE TREINO →
                    </span>
                  </div>
                </Link>

                {/* Casual & Lifestyle */}
                <Link
                  href="/produtos?sport=lifestyle"
                  className="group relative min-h-[300px] bg-wolf-900 border border-wolf-800 hover:border-accent rounded-sm overflow-hidden p-6 flex flex-col justify-end transition-all shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&auto=format&fit=crop&q=80"
                    alt="Tênis Casual e Lifestyle"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/50 to-transparent" />
                  <div className="relative z-10 space-y-1.5">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
                      ESTILO URBANO
                    </span>
                    <h3 className="text-2xl font-black uppercase font-heading text-white group-hover:text-accent transition-colors">
                      CASUAL &amp; LIFESTYLE
                    </h3>
                    <p className="text-xs text-wolf-300 font-sans">
                      Silhuetas icônicas que unem conforto esportivo e atitude nas ruas.
                    </p>
                    <span className="text-xs font-mono text-white font-bold underline underline-offset-4 inline-block pt-1">
                      VER MODELOS CASUAIS →
                    </span>
                  </div>
                </Link>

                {/* Masculino */}
                <Link
                  href="/tenis/masculino"
                  className="group relative min-h-[260px] bg-wolf-900 border border-wolf-800 hover:border-accent rounded-sm overflow-hidden p-6 flex flex-col justify-end transition-all shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80"
                    alt="Tênis Masculino"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/50 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-[10px] font-mono text-accent uppercase font-bold">SELEÇÃO</span>
                    <h3 className="text-2xl font-black uppercase font-heading text-white">TÊNIS MASCULINO</h3>
                    <span className="text-xs font-mono text-white underline underline-offset-4 font-bold">VER LINHA COMPLETA →</span>
                  </div>
                </Link>

                {/* Feminino */}
                <Link
                  href="/tenis/feminino"
                  className="group relative min-h-[260px] bg-wolf-900 border border-wolf-800 hover:border-accent rounded-sm overflow-hidden p-6 flex flex-col justify-end transition-all shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
                    alt="Tênis Feminino"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/50 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-[10px] font-mono text-accent uppercase font-bold">SELEÇÃO</span>
                    <h3 className="text-2xl font-black uppercase font-heading text-white">TÊNIS FEMININO</h3>
                    <span className="text-xs font-mono text-white underline underline-offset-4 font-bold">VER LINHA COMPLETA →</span>
                  </div>
                </Link>

                {/* Ofertas */}
                <Link
                  href="/ofertas"
                  className="group relative min-h-[260px] bg-wolf-900 border border-rose-900/60 hover:border-accent rounded-sm overflow-hidden p-6 flex flex-col justify-end transition-all shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80"
                    alt="Tênis em Oferta"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/50 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-[10px] font-mono text-accent uppercase font-bold">OPORTUNIDADES</span>
                    <h3 className="text-2xl font-black uppercase font-heading text-white">OFERTAS &amp; PROMOÇÕES</h3>
                    <span className="text-xs font-mono text-accent underline underline-offset-4 font-bold">ATÉ 30% OFF →</span>
                  </div>
                </Link>
              </div>
            </section>

            {/* 5. SEÇÃO MARATONA / ALTA PERFORMANCE (CARBON PLATE) */}
            {maratonaProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="p-8 sm:p-12 bg-gradient-to-r from-emerald-950/80 via-wolf-900 to-black border border-emerald-800/60 rounded-sm relative overflow-hidden">
                  <div className="max-w-2xl space-y-4 relative z-10">
                    <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 border border-emerald-700/80 px-3 py-1 rounded-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      ESPAÇO MARATONISTA
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black uppercase font-heading tracking-tight text-white">
                      TECNOLOGIA DE PLACA DE CARBONO &amp; MÁXIMA PROPULSÃO
                    </h2>
                    <p className="text-xs sm:text-sm text-wolf-300 font-sans leading-relaxed">
                      Projetados para maratonistas e corredores que buscam amortecimento responsivo, economia de energia e tempos recordes nos 5k, 10k, 21k e 42k.
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/maratona"
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-wolf-950 font-mono text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 transition-all shadow-xl"
                      >
                        EXPLORAR LINHA MARATONA COMPLETA →
                      </Link>
                    </div>
                  </div>
                </div>

                <ProductCarousel
                  products={maratonaProducts}
                  emptyMessage="Nenhum tênis de maratona cadastrado no momento."
                />
              </section>
            )}

            {/* 6. MARCAS PARCEIRAS GLOBAIS (ESTILO NIKE: GRID MODERNO E LIMPO) */}
            {brands.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-end justify-between border-b border-wolf-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
                      CURADORIA OFICIAL
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase font-heading tracking-tight text-white mt-1">
                      MARCAS PARCEIRAS DE ELITE
                    </h2>
                  </div>
                  <Link href="/marcas" className="text-xs font-mono text-accent hover:underline uppercase font-bold">
                    VER TODAS AS MARCAS →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={`/marca/${b.slug}`}
                      className="p-8 bg-wolf-900/60 border border-wolf-800 hover:border-accent hover:bg-wolf-900 transition-all text-center space-y-3 rounded-xs group flex flex-col justify-between hover:-translate-y-1 transform shadow-lg"
                    >
                      <Tag className="w-7 h-7 text-accent mx-auto group-hover:scale-110 transition-transform" />
                      <div className="space-y-1">
                        <h3 className="text-xl font-black font-heading uppercase text-white group-hover:text-accent transition-colors">
                          {b.name}
                        </h3>
                        <p className="text-[11px] text-wolf-400 font-sans line-clamp-2">
                          {b.description || `Tênis oficiais ${b.name} com garantia.`}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-accent uppercase tracking-wider block font-bold pt-2">
                        VER COLEÇÃO →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 7. OFERTAS & LIQUIDAÇÃO (SE HOUVER DADOS REAIS DE PROMOÇÃO) */}
            {saleProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-end justify-between border-b border-wolf-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" /> PREÇOS REDUZIDOS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase font-heading tracking-tight text-white mt-1">
                      OFERTAS EM DESTAQUE
                    </h2>
                  </div>
                  <Link href="/ofertas" className="text-xs font-mono text-accent hover:underline uppercase font-bold">
                    VER TODAS AS OFERTAS →
                  </Link>
                </div>

                <ProductCarousel
                  products={saleProducts}
                  emptyMessage="Nenhuma oferta ativa no momento."
                />
              </section>
            )}

            {/* 8. MAIS DESEJADOS DA TEMPORADA (DADOS REAIS DE AVALIAÇÃO / PRODUTOS) */}
            {popularProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-end justify-between border-b border-wolf-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400" /> RECOMENDADOS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase font-heading tracking-tight text-white mt-1">
                      MAIS DESEJADOS DA TEMPORADA
                    </h2>
                  </div>
                  <Link href="/produtos" className="text-xs font-mono text-accent hover:underline uppercase font-bold">
                    EXPLORAR CATÁLOGO →
                  </Link>
                </div>

                <ProductGrid
                  products={popularProducts.slice(0, 8)}
                  emptyMessage="Carregando produtos recomendados..."
                />
              </section>
            )}
          </div>
        ) : (
          /* DYNAMIC SECTIONS RENDERER (CONTROLADO PELO DESIGNER ADMINISTRATIVO - TOTALMENTE PRESERVADO) */
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
                    emptyMessage="Nenhum produto cadastrado nesta vitrine no momento."
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
