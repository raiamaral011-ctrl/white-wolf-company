'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[85vh] bg-wolf-950 flex items-center justify-center overflow-hidden border-b border-wolf-800">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1920&auto=format&fit=crop&q=80"
          alt="High performance athletic training background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wolf-950 via-wolf-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-wolf-950 via-wolf-950/50 to-transparent" />
      </div>

      {/* CONTENT HERO CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col items-start space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-wolf-900/90 border border-accent/40 rounded-full backdrop-blur-md">
          <Zap className="w-4 h-4 text-accent animate-bounce" />
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-white">
            COLEÇÃO 2026 OUTONO/INVERNO
          </span>
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-none font-heading">
            PERFORMANCE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-rose-500">
              SEM LIMITES
            </span>
          </h1>
          <p className="text-base sm:text-lg text-wolf-300 max-w-xl font-sans leading-relaxed">
            Tênis, roupas e equipamentos de alta performance das melhores marcas do mundo: <strong className="text-white">Adidas, Nike, ASICS, Puma e New Balance</strong>.
          </p>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link
            href="/tenis"
            className="px-8 py-4 bg-accent hover:bg-rose-700 text-white font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-rose-950/50 hover:scale-105 transform"
          >
            COMPRAR AGORA
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/marcas"
            className="px-8 py-4 bg-wolf-900/80 hover:bg-wolf-800 border border-wolf-700 text-white font-bold text-sm uppercase tracking-widest transition-colors backdrop-blur-sm"
          >
            EXPLORAR MARCAS
          </Link>
        </div>

        {/* STATS BAR */}
        <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-8 text-wolf-300 border-t border-wolf-800/80 w-full max-w-xl">
          <div>
            <span className="text-2xl sm:text-3xl font-black font-mono text-white block">50+</span>
            <span className="text-[11px] font-mono text-wolf-400 uppercase tracking-wider">Produtos em Estoque</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 block">100%</span>
            <span className="text-[11px] font-mono text-wolf-400 uppercase tracking-wider">Produtos Originais</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white block">10x</span>
            <span className="text-[11px] font-mono text-wolf-400 uppercase tracking-wider">Sem Juros no Cartão</span>
          </div>
        </div>
      </div>
    </section>
  );
}
