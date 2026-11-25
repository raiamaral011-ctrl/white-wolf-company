'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useFavorites } from '@/context/favorites-context';
import { BrandBar } from './BrandBar';
import { CartDrawer } from './CartDrawer';
import { SearchModal } from './SearchModal';
import { UserMenu } from './UserMenu';
import {
  Search, Heart, ShoppingBag, Menu, X, ChevronDown, ChevronRight,
  Flame, Zap, Award, Sparkles, User, Package, Truck, ArrowRight
} from 'lucide-react';

const TOP_ANNOUNCEMENTS = [
  '⚡ FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 299 PARA TODO O BRASIL',
  '💳 ATÉ 10X SEM JUROS NO CARTÃO DE CRÉDITO OU 5% OFF NO PIX',
  '🏃 SELEÇÃO EXCLUSIVA DE TÊNIS COM PLACA DE CARBONO PARA MARATONA',
  '🔥 TÊNIS 100% ORIGINAIS COM GARANTIA DIRETA DAS MARCAS PARCEIRAS',
];

export function Header() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { favoritesCount } = useFavorites();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Rotate top announcement bar
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % TOP_ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-wolf-950/95 backdrop-blur-md border-b border-wolf-800">
      {/* 1. TOP TICKER / PROMO ANNOUNCEMENT BAR (ESTILO NIKE) */}
      <div className="bg-black text-wolf-300 border-b border-wolf-900 py-1.5 px-4 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono tracking-wider">
          <div className="hidden md:flex items-center gap-4 text-wolf-500">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-accent" /> Entrega Expressa
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> 100% Original
            </span>
          </div>

          <div className="flex-1 text-center font-bold text-white transition-all duration-500 flex items-center justify-center gap-2">
            <span>{TOP_ANNOUNCEMENTS[announcementIdx]}</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-wolf-400">
            <Link href="/minha-conta/pedidos" className="hover:text-white transition-colors">
              Rastrear Pedido
            </Link>
            <span>•</span>
            <Link href="/marcas" className="hover:text-accent transition-colors font-bold">
              Marcas Oficiais
            </Link>
          </div>
        </div>
      </div>

      {/* 2. BRAND BAR ACCELERATOR (PARCEIRAS OFICIAIS) */}
      <BrandBar />

      {/* 3. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-wolf-300 hover:text-white transition-colors"
          aria-label="Abrir menu de navegação"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6 text-accent" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* LOGO TEXT - WHITE WOLF COMPANY */}
        <Link href="/" className="flex flex-col group shrink-0">
          <span className="font-heading text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-accent transition-colors">
            WHITE WOLF <span className="text-accent font-light">CO.</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-wolf-400 font-semibold -mt-1 group-hover:text-wolf-300">
            PERFORMANCE &amp; STYLE
          </span>
        </Link>

        {/* DESKTOP NAVIGATION MENU (ESTILO NIKE: CLARO, ESTRUTURADO E ACESSÍVEL) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold uppercase tracking-wider text-wolf-300 h-full">
          {/* Início */}
          <Link
            href="/"
            className={`py-6 hover:text-white transition-colors relative ${
              pathname === '/' ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent' : ''
            }`}
          >
            INÍCIO
          </Link>

          {/* Todos os Tênis */}
          <div
            className="relative h-full flex items-center group cursor-pointer"
            onMouseEnter={() => setActiveDropdown('todos')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/produtos"
              className={`flex items-center gap-1 py-6 hover:text-white transition-colors ${
                pathname === '/produtos' && !pathname.includes('genero') ? 'text-white' : ''
              }`}
            >
              TODOS OS TÊNIS
              <ChevronDown className="w-3.5 h-3.5 text-wolf-500 group-hover:text-white transition-transform group-hover:rotate-180" />
            </Link>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 hidden group-hover:block w-64 bg-wolf-950 border border-wolf-800 shadow-2xl p-4 space-y-2 z-50">
              <div className="text-[10px] font-mono text-wolf-500 uppercase tracking-widest pb-1 border-b border-wolf-800">
                Categorias Principais
              </div>
              <Link href="/produtos" className="block text-white hover:text-accent font-mono text-xs py-1.5 transition-colors">
                👟 Ver Todos os Calçados
              </Link>
              <Link href="/tenis/masculino" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1.5 transition-colors">
                Tênis Masculino
              </Link>
              <Link href="/tenis/feminino" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1.5 transition-colors">
                Tênis Feminino
              </Link>
              <Link href="/tenis/infantil" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1.5 transition-colors">
                Tênis Infantil
              </Link>
              <Link href="/maratona" className="block text-emerald-400 hover:text-emerald-300 font-mono text-xs py-1.5 border-t border-wolf-800/80 pt-2 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                🏃 Tênis de Maratona
              </Link>
              <Link href="/ofertas" className="block text-accent hover:text-rose-400 font-mono text-xs py-1.5 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Ofertas &amp; Descontos
              </Link>
            </div>
          </div>

          {/* Masculino */}
          <div
            className="relative h-full flex items-center group cursor-pointer"
            onMouseEnter={() => setActiveDropdown('masculino')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/tenis/masculino"
              className={`flex items-center gap-1 py-6 hover:text-white transition-colors ${
                pathname === '/tenis/masculino' || pathname.includes('masculino') ? 'text-white' : ''
              }`}
            >
              MASCULINO
              <ChevronDown className="w-3.5 h-3.5 text-wolf-500 group-hover:text-white transition-transform group-hover:rotate-180" />
            </Link>

            <div className="absolute top-full left-0 hidden group-hover:block w-60 bg-wolf-950 border border-wolf-800 shadow-2xl p-4 space-y-2 z-50">
              <div className="text-[10px] font-mono text-wolf-500 uppercase tracking-widest pb-1 border-b border-wolf-800">
                Tênis Masculinos
              </div>
              <Link href="/tenis/masculino" className="block text-white hover:text-accent font-mono text-xs py-1.5 font-bold transition-colors">
                Ver Todos Masculinos →
              </Link>
              <Link href="/produtos?genero=masculino&sport=corrida" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Corrida de Rua
              </Link>
              <Link href="/produtos?genero=masculino&sport=academia" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Treino &amp; Academia
              </Link>
              <Link href="/produtos?genero=masculino&sport=lifestyle" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Casual &amp; Lifestyle
              </Link>
              <Link href="/maratona" className="block text-emerald-400 hover:text-emerald-300 font-mono text-xs py-1.5 border-t border-wolf-800/80 pt-2 font-bold">
                Placa de Carbono Masculino
              </Link>
            </div>
          </div>

          {/* Feminino */}
          <div
            className="relative h-full flex items-center group cursor-pointer"
            onMouseEnter={() => setActiveDropdown('feminino')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/tenis/feminino"
              className={`flex items-center gap-1 py-6 hover:text-white transition-colors ${
                pathname === '/tenis/feminino' || pathname.includes('feminino') ? 'text-white' : ''
              }`}
            >
              FEMININO
              <ChevronDown className="w-3.5 h-3.5 text-wolf-500 group-hover:text-white transition-transform group-hover:rotate-180" />
            </Link>

            <div className="absolute top-full left-0 hidden group-hover:block w-60 bg-wolf-950 border border-wolf-800 shadow-2xl p-4 space-y-2 z-50">
              <div className="text-[10px] font-mono text-wolf-500 uppercase tracking-widest pb-1 border-b border-wolf-800">
                Tênis Femininos
              </div>
              <Link href="/tenis/feminino" className="block text-white hover:text-accent font-mono text-xs py-1.5 font-bold transition-colors">
                Ver Todos Femininos →
              </Link>
              <Link href="/produtos?genero=feminino&sport=corrida" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Corrida &amp; Caminhada
              </Link>
              <Link href="/produtos?genero=feminino&sport=academia" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Treino &amp; Academia
              </Link>
              <Link href="/produtos?genero=feminino&sport=lifestyle" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Casual &amp; Estilo Urbano
              </Link>
              <Link href="/maratona" className="block text-emerald-400 hover:text-emerald-300 font-mono text-xs py-1.5 border-t border-wolf-800/80 pt-2 font-bold">
                Performance &amp; Maratona
              </Link>
            </div>
          </div>

          {/* Infantil */}
          <Link
            href="/tenis/infantil"
            className={`py-6 hover:text-white transition-colors ${
              pathname === '/tenis/infantil' || pathname.includes('infantil') ? 'text-white' : ''
            }`}
          >
            INFANTIL
          </Link>

          {/* Maratona (Destaque Performance) */}
          <Link
            href="/maratona"
            className="py-6 text-emerald-400 font-extrabold hover:text-emerald-300 transition-colors flex items-center gap-1.5 tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            MARATONA
          </Link>

          {/* Marcas */}
          <div
            className="relative h-full flex items-center group cursor-pointer"
            onMouseEnter={() => setActiveDropdown('marcas')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/marcas"
              className={`flex items-center gap-1 py-6 hover:text-white transition-colors ${
                pathname === '/marcas' || pathname.startsWith('/marca/') ? 'text-white' : ''
              }`}
            >
              MARCAS
              <ChevronDown className="w-3.5 h-3.5 text-wolf-500 group-hover:text-white transition-transform group-hover:rotate-180" />
            </Link>

            <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-wolf-950 border border-wolf-800 shadow-2xl p-4 space-y-2 z-50">
              <div className="text-[10px] font-mono text-wolf-500 uppercase tracking-widest pb-1 border-b border-wolf-800">
                Marcas Parceiras
              </div>
              <Link href="/marca/nike" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Nike Running &amp; Air
              </Link>
              <Link href="/marca/adidas" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Adidas Adizero &amp; Boost
              </Link>
              <Link href="/marca/asics" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                ASICS GEL Series
              </Link>
              <Link href="/marca/puma" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                Puma Nitro &amp; 180
              </Link>
              <Link href="/marca/new-balance" className="block text-wolf-300 hover:text-white font-mono text-xs py-1.5 transition-colors">
                New Balance 9060 &amp; 550
              </Link>
              <Link href="/marcas" className="block text-accent hover:text-rose-400 font-mono text-xs py-1.5 border-t border-wolf-800 pt-2 font-bold">
                Ver Todas as Marcas →
              </Link>
            </div>
          </div>

          {/* Ofertas */}
          <Link
            href="/ofertas"
            className="py-6 text-accent font-extrabold hover:text-rose-400 transition-colors flex items-center gap-1 tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            OFERTAS
          </Link>
        </nav>

        {/* RIGHT CONTROLS: PESQUISA, CONTA, FAVORITOS, CARRINHO */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Quick Search Button / Input (Desktop pill like Nike) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 bg-wolf-900/80 hover:bg-wolf-900 border border-wolf-800 rounded-full text-wolf-400 hover:text-white transition-all text-xs font-mono group"
            title="Buscar tênis por nome, marca ou categoria"
          >
            <Search className="w-4 h-4 text-wolf-400 group-hover:text-accent transition-colors" />
            <span className="text-wolf-400 group-hover:text-wolf-300">Buscar produtos...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-wolf-800 text-wolf-400 rounded-xs border border-wolf-700">
              /
            </kbd>
          </button>

          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 text-wolf-300 hover:text-white transition-colors"
            title="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Favorites */}
          <Link
            href="/favoritos"
            className="p-2 text-wolf-300 hover:text-white transition-colors relative"
            title="Meus Favoritos"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center animate-scale">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Account User Menu Dropdown */}
          <UserMenu />

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 sm:px-3 sm:py-2 bg-wolf-900 hover:bg-wolf-800 border border-wolf-800 rounded-full text-white flex items-center gap-2 transition-all hover:border-accent group"
            aria-label="Abrir carrinho de compras"
          >
            <ShoppingBag className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline-block text-xs font-mono font-bold">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* 4. MOBILE NAVIGATION DRAWER (ADAPTADA, INTUITIVA E RÁPIDA) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-wolf-950/98 backdrop-blur-xl border-b border-wolf-800 overflow-y-auto p-6 space-y-6 z-50 animate-fadeIn">
          {/* Mobile Search Trigger Bar */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-wolf-900 border border-wolf-800 rounded-sm text-wolf-400 text-xs font-mono"
          >
            <Search className="w-4 h-4 text-accent" />
            <span>Buscar por tênis, marca, corrida...</span>
          </button>

          {/* Categorias Principais */}
          <div className="space-y-1 border-b border-wolf-800 pb-4">
            <span className="text-[10px] font-mono text-wolf-500 uppercase tracking-widest block mb-2">
              NAVEGAÇÃO POR CATEGORIA
            </span>

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-bold uppercase text-white hover:text-accent border-b border-wolf-900"
            >
              <span>Início</span>
              <ChevronRight className="w-4 h-4 text-wolf-600" />
            </Link>

            <Link
              href="/produtos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-bold uppercase text-white hover:text-accent border-b border-wolf-900"
            >
              <span>Todos os Tênis</span>
              <ChevronRight className="w-4 h-4 text-wolf-600" />
            </Link>

            <Link
              href="/tenis/masculino"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-bold uppercase text-white hover:text-accent border-b border-wolf-900"
            >
              <span>Masculino</span>
              <span className="text-[10px] font-mono text-wolf-400 uppercase">Corrida / Treino</span>
            </Link>

            <Link
              href="/tenis/feminino"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-bold uppercase text-white hover:text-accent border-b border-wolf-900"
            >
              <span>Feminino</span>
              <span className="text-[10px] font-mono text-wolf-400 uppercase">Performance</span>
            </Link>

            <Link
              href="/tenis/infantil"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-bold uppercase text-white hover:text-accent border-b border-wolf-900"
            >
              <span>Infantil</span>
              <ChevronRight className="w-4 h-4 text-wolf-600" />
            </Link>

            <Link
              href="/maratona"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-extrabold uppercase text-emerald-400 hover:text-emerald-300 border-b border-wolf-900"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                🏃 Maratona (Placa de Carbono)
              </span>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </Link>

            <Link
              href="/marcas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-bold uppercase text-white hover:text-accent border-b border-wolf-900"
            >
              <span>Marcas Parceiras</span>
              <span className="text-[10px] font-mono text-accent uppercase">Nike, Adidas...</span>
            </Link>

            <Link
              href="/ofertas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-sm font-black uppercase text-accent hover:text-rose-400"
            >
              <span className="flex items-center gap-2">
                <Flame className="w-4 h-4" /> Ofertas &amp; Liquidação
              </span>
              <span className="text-[10px] font-mono bg-accent/20 text-accent px-2 py-0.5 rounded-xs">
                ATÉ 30% OFF
              </span>
            </Link>
          </div>

          {/* Marcas Rápidas no Mobile */}
          <div className="space-y-2 border-b border-wolf-800 pb-4">
            <span className="text-[10px] font-mono text-wolf-500 uppercase tracking-widest block">
              COMPRAR POR MARCA
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <Link href="/marca/nike" onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-wolf-900 border border-wolf-800 text-center text-wolf-300 hover:text-white rounded-xs">
                NIKE
              </Link>
              <Link href="/marca/adidas" onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-wolf-900 border border-wolf-800 text-center text-wolf-300 hover:text-white rounded-xs">
                ADIDAS
              </Link>
              <Link href="/marca/asics" onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-wolf-900 border border-wolf-800 text-center text-wolf-300 hover:text-white rounded-xs">
                ASICS
              </Link>
              <Link href="/marca/puma" onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-wolf-900 border border-wolf-800 text-center text-wolf-300 hover:text-white rounded-xs">
                PUMA
              </Link>
              <Link href="/marca/new-balance" onClick={() => setIsMobileMenuOpen(false)} className="col-span-2 p-2 bg-wolf-900 border border-wolf-800 text-center text-wolf-300 hover:text-white rounded-xs">
                NEW BALANCE
              </Link>
            </div>
          </div>

          {/* Acesso à Conta e Atalhos */}
          <div className="space-y-3 pt-2 text-xs font-mono">
            <Link
              href="/minha-conta"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 bg-wolf-900/60 border border-wolf-800 rounded-sm text-wolf-200 hover:text-white"
            >
              <User className="w-4 h-4 text-accent" />
              <span>Minha Conta / Meus Pedidos</span>
            </Link>
            <Link
              href="/favoritos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 bg-wolf-900/60 border border-wolf-800 rounded-sm text-wolf-200 hover:text-white"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Meus Favoritos ({favoritesCount})</span>
            </Link>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* CART DRAWER */}
      <CartDrawer />
    </header>
  );
}
