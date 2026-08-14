'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, CreditCard, Mail, ArrowRight, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-wolf-950 text-white border-t border-wolf-800">
      {/* BENEFIT BANNERS */}
      <div className="border-b border-wolf-800/80 py-8 bg-wolf-900/40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 border border-wolf-800/60 bg-wolf-950/60">
            <Truck className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">FRETE GRÁTIS</h4>
              <p className="text-[11px] text-wolf-400 font-mono">Em compras acima de R$ 299 para todo o Brasil.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-wolf-800/60 bg-wolf-950/60">
            <CreditCard className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">PARCELAMENTO</h4>
              <p className="text-[11px] text-wolf-400 font-mono">Até 10x sem juros no cartão ou PIX com desconto.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-wolf-800/60 bg-wolf-950/60">
            <RefreshCw className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">TROCA GRÁTIS</h4>
              <p className="text-[11px] text-wolf-400 font-mono">Até 30 dias para efetuar a primeira troca sem custo.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-wolf-800/60 bg-wolf-950/60">
            <ShieldCheck className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">SITE SEGURO</h4>
              <p className="text-[11px] text-wolf-400 font-mono">Certificado SSL 256-bits e checkout Mercado Pago.</p>
            </div>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="py-12 px-4 border-b border-wolf-800 bg-wolf-950">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase font-mono tracking-[0.2em] text-accent font-extrabold">
            CLUBE WHITE WOLF COMPANY
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-heading">
            RECEBA LANÇAMENTOS EXCLUSIVOS E OFERTAS VIP
          </h3>
          <p className="text-xs text-wolf-400 max-w-xl mx-auto font-sans">
            Inscreva-se para receber novidades em primeira mão sobre os principais lançamentos das marcas Adidas, Nike, ASICS, Puma e New Balance.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-wolf-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="Seu e-mail principal..."
                className="w-full bg-wolf-900 border border-wolf-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
            >
              CADASTRAR
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* MAIN FOOTER LINKS */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
        {/* BRAND COLUMN */}
        <div className="space-y-4">
          <span className="font-heading text-xl font-black tracking-tighter text-white">
            WHITE WOLF <span className="text-accent font-light">CO.</span>
          </span>
          <p className="text-wolf-400 text-xs leading-relaxed">
            Plataforma premium de e-commerce esportivo especializada em tênis de alta performance, artigos de treino, vestuário técnico e lifestyle urbano.
          </p>
          <div className="flex gap-3 text-wolf-400 pt-2">
            <a href="#" className="p-2 bg-wolf-900 border border-wolf-800 hover:text-accent transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-wolf-900 border border-wolf-800 hover:text-accent transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-wolf-900 border border-wolf-800 hover:text-accent transition-colors"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-wolf-900 border border-wolf-800 hover:text-accent transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>

        {/* MARCAS */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            MARCAS VENDIDAS
          </h4>
          <ul className="space-y-2 text-wolf-400 font-mono">
            <li><Link href="/marca/adidas" className="hover:text-white transition-colors">Adidas Performance</Link></li>
            <li><Link href="/marca/nike" className="hover:text-white transition-colors">Nike Running &amp; Air</Link></li>
            <li><Link href="/marca/asics" className="hover:text-white transition-colors">ASICS GEL Series</Link></li>
            <li><Link href="/marca/puma" className="hover:text-white transition-colors">Puma Nitro &amp; Suede</Link></li>
            <li><Link href="/marca/new-balance" className="hover:text-white transition-colors">New Balance 550 &amp; 9060</Link></li>
          </ul>
        </div>

        {/* INSTITUCIONAL */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            INSTITUCIONAL
          </h4>
          <ul className="space-y-2 text-wolf-400">
            <li><a href="#" className="hover:text-white transition-colors">Sobre a White Wolf Company</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Termos e Condições</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Trocas e Devoluções</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Guia de Tamanhos</a></li>
          </ul>
        </div>

        {/* ATENDIMENTO */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            ATENDIMENTO AO CLIENTE
          </h4>
          <div className="space-y-2 text-wolf-400">
            <p>Segunda a Sexta das 08h às 20h</p>
            <p className="font-mono text-white font-bold">contato@whitewolfco.com.br</p>
            <p className="font-mono text-white font-bold">0800 999 8000</p>
            <div className="pt-2">
              <span className="text-[10px] font-mono text-wolf-500 uppercase tracking-widest block mb-1">PAGAMENTOS PROCESSADOS POR</span>
              <span className="px-2 py-1 bg-wolf-900 border border-wolf-800 text-sky-400 font-mono text-xs font-bold rounded-xs inline-block">
                Mercado Pago (PIX / Cartão)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT */}
      <div className="border-t border-wolf-900 py-6 bg-black text-center text-wolf-500 text-[11px] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} WHITE WOLF COMPANY. Todos os direitos reservados.</p>
          <p className="text-wolf-600">Desenvolvido com Next.js 14, Supabase, Vercel Blob e Mercado Pago.</p>
        </div>
      </div>
    </footer>
  );
}
