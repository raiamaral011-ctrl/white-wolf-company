'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useFavorites } from '@/context/favorites-context';
import { BrandBar } from './BrandBar';
import { CartDrawer } from './CartDrawer';
import { SearchModal } from './SearchModal';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const { favoritesCount } = useFavorites();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-wolf-950/95 backdrop-blur-md border-b border-wolf-800">
      {/* BRAND BAR ACCELERATOR */}
      <BrandBar />

      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-wolf-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* LOGO TEXT - WHITE WOLF COMPANY */}
        <Link href="/" className="flex flex-col group">
          <span className="font-heading text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-accent transition-colors">
            WHITE WOLF <span className="text-accent font-light">CO.</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-wolf-400 font-semibold -mt-1">
            PERFORMANCE &amp; STYLE
          </span>
        </Link>

        {/* DESKTOP NAVIGATION MENU */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-wolf-300">
          {/* Tênis Dropdown */}
          <div className="relative group py-6">
            <Link href="/tenis" className="flex items-center gap-1 hover:text-white transition-colors">
              TÊNIS
              <ChevronDown className="w-3.5 h-3.5 text-wolf-500 group-hover:text-white transition-transform group-hover:rotate-180" />
            </Link>
            <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-wolf-900 border border-wolf-800 shadow-xl p-3 space-y-2">
              <Link href="/tenis/masculino" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                MASCULINO
              </Link>
              <Link href="/tenis/feminino" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                FEMININO
              </Link>
              <Link href="/tenis/infantil" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                INFANTIL
              </Link>
            </div>
          </div>

          {/* Roupas Dropdown */}
          <div className="relative group py-6">
            <Link href="/roupas" className="flex items-center gap-1 hover:text-white transition-colors">
              ROUPAS
              <ChevronDown className="w-3.5 h-3.5 text-wolf-500 group-hover:text-white transition-transform group-hover:rotate-180" />
            </Link>
            <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-wolf-900 border border-wolf-800 shadow-xl p-3 space-y-2">
              <Link href="/roupas/masculino" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                MASCULINO
              </Link>
              <Link href="/roupas/feminino" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                FEMININO
              </Link>
              <Link href="/roupas/camisetas" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                CAMISETAS
              </Link>
              <Link href="/roupas/shorts" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                SHORTS
              </Link>
              <Link href="/roupas/calcas" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                CALÇAS
              </Link>
              <Link href="/roupas/jaquetas" className="block text-wolf-300 hover:text-accent font-mono text-xs py-1">
                JAQUETAS
              </Link>
            </div>
          </div>

          <Link href="/acessorios" className="hover:text-white transition-colors">
            ACESSÓRIOS
          </Link>

          <Link href="/marcas" className="hover:text-white transition-colors">
            MARCAS
          </Link>

          <Link href="/ofertas" className="text-accent font-extrabold hover:text-rose-400 transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            OFERTAS
          </Link>
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-wolf-300 hover:text-white transition-colors relative"
            title="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account */}
          <Link
            href="/minha-conta"
            className="p-2 text-wolf-300 hover:text-white transition-colors"
            title="Minha Conta"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Favorites */}
          <Link
            href="/favoritos"
            className="p-2 text-wolf-300 hover:text-white transition-colors relative"
            title="Favoritos"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 bg-wolf-900 hover:bg-wolf-800 border border-wolf-800 rounded-sm text-white flex items-center gap-2 transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5 text-accent" />
            <span className="hidden sm:inline-block text-xs font-mono font-bold">
              {itemCount}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-wolf-950 border-b border-wolf-800 p-6 space-y-4 text-xs font-bold uppercase tracking-widest text-wolf-300">
          <Link href="/tenis" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-wolf-800 text-white">
            Tênis
          </Link>
          <div className="pl-4 space-y-2 font-mono text-[11px] text-wolf-400">
            <Link href="/tenis/masculino" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Tênis Masculino</Link>
            <Link href="/tenis/feminino" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Tênis Feminino</Link>
          </div>

          <Link href="/roupas" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-wolf-800 text-white">
            Roupas
          </Link>
          <div className="pl-4 space-y-2 font-mono text-[11px] text-wolf-400">
            <Link href="/roupas/camisetas" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Camisetas</Link>
            <Link href="/roupas/shorts" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Shorts</Link>
            <Link href="/roupas/calcas" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Calças</Link>
            <Link href="/roupas/jaquetas" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">Jaquetas</Link>
          </div>

          <Link href="/acessorios" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-wolf-800 text-white">
            Acessórios
          </Link>

          <Link href="/marcas" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-wolf-800 text-white">
            Marcas
          </Link>

          <Link href="/ofertas" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-accent font-extrabold">
            Ofertas
          </Link>
        </div>
      )}

      {/* SEARCH MODAL */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* CART DRAWER */}
      <CartDrawer />
    </header>
  );
}
