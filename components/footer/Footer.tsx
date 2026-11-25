'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Truck, RefreshCw, CreditCard, Mail, ArrowRight,
  Instagram, Facebook, Youtube, Twitter, Award, Zap, Phone, Clock
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-wolf-950 text-white border-t border-wolf-800">
      {/* 1. BENEFIT BANNERS (ESTILO NIKE) */}
      <div className="border-b border-wolf-800/80 py-8 bg-wolf-900/40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 border border-wolf-800/60 bg-wolf-950/60 rounded-xs">
            <Truck className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">FRETE GRÁTIS BRASIL</h4>
              <p className="text-[11px] text-wolf-400 font-mono">Em compras acima de R$ 299 para todas as capitais e regiões.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-wolf-800/60 bg-wolf-950/60 rounded-xs">
            <CreditCard className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">PAGAMENTO FACILITADO</h4>
              <p className="text-[11px] text-wolf-400 font-mono">Até 10x sem juros no cartão ou 5% de desconto via PIX.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-wolf-800/60 bg-wolf-950/60 rounded-xs">
            <RefreshCw className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">PRIMEIRA TROCA GRÁTIS</h4>
              <p className="text-[11px] text-wolf-400 font-mono">Até 30 dias após o recebimento para solicitar a troca sem custo.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border border-wolf-800/60 bg-wolf-950/60 rounded-xs">
            <ShieldCheck className="w-8 h-8 text-accent flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider font-heading">ORIGINALIDADE &amp; SEGURANÇA</h4>
              <p className="text-[11px] text-wolf-400 font-mono">Calçados 100% autênticos e checkout com criptografia SSL.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NEWSLETTER VIP */}
      <div className="py-12 px-4 border-b border-wolf-800 bg-wolf-950">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase font-mono tracking-[0.2em] text-accent font-extrabold flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5" /> CLUBE DE PERFORMANCE WHITE WOLF
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-heading">
            RECEBA LANÇAMENTOS ANTECIPADOS E CUPONS EXCLUSIVOS
          </h3>
          <p className="text-xs text-wolf-400 max-w-xl mx-auto font-sans">
            Inscreva-se gratuitamente para receber alertas sobre novos lotes de tênis de maratona e lançamentos oficiais Nike, Adidas, ASICS, Puma e New Balance.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-wolf-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="Digite seu melhor e-mail..."
                className="w-full bg-wolf-900 border border-wolf-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-wolf-500 rounded-xs focus:outline-none focus:border-accent font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors rounded-xs shadow-lg"
            >
              CADASTRAR
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. MAIN FOOTER LINKS (5 COLUNAS ESTRUTURADAS ESTILO NIKE) */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 text-xs">
        {/* BRAND COLUMN */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-block">
            <span className="font-heading text-xl font-black tracking-tighter text-white">
              WHITE WOLF <span className="text-accent font-light">CO.</span>
            </span>
          </Link>
          <p className="text-wolf-400 text-xs leading-relaxed">
            Plataforma especializada exclusivamente em tênis esportivos de elite, maratona com placa de carbono, corrida e treino de alta performance.
          </p>
          <div className="flex gap-2.5 text-wolf-400 pt-1">
            <a href="#" className="p-2 bg-wolf-900 border border-wolf-800 rounded-xs hover:text-accent transition-colors" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-wolf-900 border border-wolf-800 rounded-xs hover:text-accent transition-colors" aria-label="Facebook"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-wolf-900 border border-wolf-800 rounded-xs hover:text-accent transition-colors" aria-label="YouTube"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="p-2 bg-wolf-900 border border-wolf-800 rounded-xs hover:text-accent transition-colors" aria-label="Twitter"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>

        {/* NAVEGAÇÃO DE TÊNIS */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            TÊNIS &amp; MODALIDADES
          </h4>
          <ul className="space-y-2 text-wolf-400 font-mono text-[11px]">
            <li><Link href="/produtos" className="hover:text-white transition-colors">Todos os Tênis</Link></li>
            <li><Link href="/tenis/masculino" className="hover:text-white transition-colors">Tênis Masculino</Link></li>
            <li><Link href="/tenis/feminino" className="hover:text-white transition-colors">Tênis Feminino</Link></li>
            <li><Link href="/tenis/infantil" className="hover:text-white transition-colors">Tênis Infantil</Link></li>
            <li><Link href="/maratona" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">🏃 Linha Maratona</Link></li>
            <li><Link href="/ofertas" className="text-accent hover:text-rose-400 font-bold transition-colors">🔥 Ofertas Especiais</Link></li>
          </ul>
        </div>

        {/* MARCAS PARCEIRAS */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            MARCAS OFICIAIS
          </h4>
          <ul className="space-y-2 text-wolf-400 font-mono text-[11px]">
            <li><Link href="/marca/nike" className="hover:text-white transition-colors">Nike (Air &amp; Running)</Link></li>
            <li><Link href="/marca/adidas" className="hover:text-white transition-colors">Adidas (Adizero &amp; Boost)</Link></li>
            <li><Link href="/marca/asics" className="hover:text-white transition-colors">ASICS (GEL Series)</Link></li>
            <li><Link href="/marca/puma" className="hover:text-white transition-colors">Puma (Nitro &amp; 180)</Link></li>
            <li><Link href="/marca/new-balance" className="hover:text-white transition-colors">New Balance (9060 &amp; 550)</Link></li>
            <li><Link href="/marcas" className="text-accent hover:underline font-bold">Ver Todas as Marcas →</Link></li>
          </ul>
        </div>

        {/* AJUDA & CONTA */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            MINHA CONTA &amp; AJUDA
          </h4>
          <ul className="space-y-2 text-wolf-400 font-mono text-[11px]">
            <li><Link href="/minha-conta" className="hover:text-white transition-colors">Minha Conta</Link></li>
            <li><Link href="/minha-conta/pedidos" className="hover:text-white transition-colors">Rastreamento de Pedidos</Link></li>
            <li><Link href="/favoritos" className="hover:text-white transition-colors">Meus Favoritos</Link></li>
            <li><Link href="/carrinho" className="hover:text-white transition-colors">Carrinho de Compras</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Guia de Tamanhos (BR)</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Trocas e Devoluções</a></li>
          </ul>
        </div>

        {/* ATENDIMENTO & PAGAMENTOS */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
            ATENDIMENTO
          </h4>
          <div className="space-y-2 text-wolf-400 font-mono text-[11px]">
            <p className="flex items-center gap-1.5 text-white font-bold">
              <Clock className="w-3.5 h-3.5 text-accent" /> Seg. a Sex. 08h às 20h
            </p>
            <p className="text-white font-bold">contato@whitewolfco.com.br</p>
            <p className="text-emerald-400 font-bold">0800 999 8000</p>
            <div className="pt-2">
              <span className="text-[10px] font-mono text-wolf-500 uppercase tracking-widest block mb-1">
                PAGAMENTOS SEGUROS
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 bg-wolf-900 border border-wolf-800 text-[10px] font-mono text-emerald-400 rounded-xs">
                  PIX (5% OFF)
                </span>
                <span className="px-2 py-0.5 bg-wolf-900 border border-wolf-800 text-[10px] font-mono text-wolf-300 rounded-xs">
                  Cartão 10x
                </span>
                <span className="px-2 py-0.5 bg-wolf-900 border border-wolf-800 text-[10px] font-mono text-sky-400 rounded-xs">
                  Mercado Pago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM COPYRIGHT */}
      <div className="border-t border-wolf-900 py-6 bg-black text-center text-wolf-500 text-[11px] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} WHITE WOLF COMPANY. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
          <div className="flex items-center gap-4 text-wolf-600">
            <a href="#" className="hover:text-wolf-400">Termos de Uso</a>
            <span>•</span>
            <a href="#" className="hover:text-wolf-400">Privacidade</a>
            <span>•</span>
            <a href="#" className="hover:text-wolf-400">Segurança</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
