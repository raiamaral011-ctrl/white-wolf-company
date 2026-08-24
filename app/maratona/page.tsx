'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Product } from '@/types';
import { Activity, Flame, Shield, Award, Sparkles, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MaratonaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  useEffect(() => {
    async function loadMarathonProducts() {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data: Product[] = await res.json();
          // Filter products relevant to runners and marathoners:
          // sport = 'corrida', or category = 'tenis' / 'roupas' and name matches running terms.
          const marathonItems = data.filter((p) => {
            const nameLower = p.name.toLowerCase();
            const descLower = p.description.toLowerCase();
            const isCorrida = p.sport === 'corrida' || p.sport === 'running';
            const matchesKeywords = 
              nameLower.includes('adizero') || 
              nameLower.includes('alphafly') || 
              nameLower.includes('nimbus') || 
              nameLower.includes('pegasus') || 
              nameLower.includes('marathon') || 
              nameLower.includes('corrida') || 
              nameLower.includes('run') || 
              descLower.includes('maratona') || 
              descLower.includes('distância');
            return isCorrida || matchesKeywords;
          });
          setProducts(marathonItems);
        }
      } catch (err) {
        console.error('Error fetching marathon products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMarathonProducts();
  }, []);

  const brandsList = Array.from(new Set(products.map(p => p.brand?.name).filter(Boolean))) as string[];

  const filteredProducts = selectedBrand === 'all'
    ? products
    : products.filter(p => p.brand?.name === selectedBrand);

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      {/* HERO BANNER - HIGH PERFORMANCE MARATHON */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden border-b border-wolf-800 bg-black">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1502224562085-639556652f33?w=1600&auto=format&fit=crop&q=80"
            alt="Marathon Runner"
            fill
            priority
            className="object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/60 to-transparent z-10" />

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="px-3 py-1 bg-accent text-white text-xs font-mono font-black uppercase tracking-widest rounded-xs inline-flex items-center gap-1.5 animate-pulse">
            <Activity className="w-3.5 h-3.5" /> FOCO PERFORMANCE
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-heading leading-none">
            ESPAÇO MARATONISTA
          </h1>
          <p className="text-base sm:text-lg text-wolf-300 max-w-2xl mx-auto leading-relaxed">
            Equipamentos de elite projetados para recordes pessoais. Encontre os maiores tênis de placa de carbono do mundo, vestuário refletivo e tecnologias de amortecimento responsivo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-wolf-400">
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-accent" /> Placas de Carbono</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-accent" /> Altíssima Durabilidade</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-accent" /> Peso Mínimo</span>
          </div>
        </div>
      </section>

      {/* BRAND FILTER BAR */}
      <section className="bg-wolf-900/60 border-b border-wolf-800 py-4 px-4 sticky top-[68px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-wolf-400 uppercase font-bold">FILTRAR POR MARCA:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs transition-colors uppercase ${
                  selectedBrand === 'all'
                    ? 'bg-accent text-white'
                    : 'bg-wolf-950 border border-wolf-800 text-wolf-400 hover:text-white'
                }`}
              >
                TODOS ({products.length})
              </button>
              {brandsList.map(brandName => {
                const count = products.filter(p => p.brand?.name === brandName).length;
                return (
                  <button
                    key={brandName}
                    onClick={() => setSelectedBrand(brandName)}
                    className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs transition-colors uppercase ${
                      selectedBrand === brandName
                        ? 'bg-accent text-white'
                        : 'bg-wolf-950 border border-wolf-800 text-wolf-400 hover:text-white'
                    }`}
                  >
                    {brandName} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <span className="text-xs font-mono text-wolf-400">
            EXIBINDO <strong className="text-white">{filteredProducts.length}</strong> PRODUTOS DE ELITE
          </span>
        </div>
      </section>

      {/* PRODUCTS GRID SECTION */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-wolf-500 font-mono text-sm gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-accent" />
            Buscando tênis de placa e artigos de maratona...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-wolf-500 font-mono text-sm space-y-4">
            <p>Nenhum produto voltado para maratona encontrado para os filtros selecionados.</p>
            <p className="text-xs text-wolf-600">Vá ao painel de cadastro e adicione novos tênis Adizero ou Alphafly com a tag &apos;corrida&apos;.</p>
          </div>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </main>

      {/* MOTIVATIONAL BANNER */}
      <section className="bg-black py-16 border-t border-wolf-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black font-heading text-white uppercase tracking-wider">
            &quot;A maratona não é apenas sobre correr. É sobre descobrir do que o seu corpo e mente são capazes.&quot;
          </h3>
          <p className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            — White Wolf Performance Lab
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
