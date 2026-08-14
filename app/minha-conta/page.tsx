'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ShoppingBag, Heart, MapPin, User, LogOut, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function MinhaContaDashboardPage() {
  const customerName = 'Lucas Silva';

  // Sample recent orders list
  const recentOrders = [
    {
      id: 'ORD-172363000-482',
      date: '14/08/2026',
      total: 1199.90,
      status: 'Pagamento aprovado',
      statusColor: 'text-emerald-400',
      itemsCount: 1,
    },
    {
      id: 'ORD-172352000-112',
      date: '02/08/2026',
      total: 799.90,
      status: 'Entregue',
      statusColor: 'text-sky-400',
      itemsCount: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            PAINEL DO ATLETA
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
            OLÁ, {customerName.toUpperCase()}
          </h1>
          <p className="text-sm text-wolf-400">
            Gerencie seus pedidos, dados cadastrais e endereços de entrega.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ACCOUNT NAVIGATION MENU (4 Cols) */}
        <aside className="lg:col-span-4 bg-wolf-900 border border-wolf-800 p-6 rounded-sm space-y-2">
          <Link href="/minha-conta" className="flex items-center gap-3 p-3 bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-xs">
            <User className="w-4 h-4" /> MINHA CONTA
          </Link>
          <Link href="/minha-conta/pedidos" className="flex items-center gap-3 p-3 text-wolf-300 hover:text-white hover:bg-wolf-800 font-mono text-xs uppercase rounded-xs transition-colors">
            <Package className="w-4 h-4 text-wolf-400" /> MEUS PEDIDOS
          </Link>
          <Link href="/minha-conta/favoritos" className="flex items-center gap-3 p-3 text-wolf-300 hover:text-white hover:bg-wolf-800 font-mono text-xs uppercase rounded-xs transition-colors">
            <Heart className="w-4 h-4 text-wolf-400" /> FAVORITOS
          </Link>
          <Link href="/minha-conta/enderecos" className="flex items-center gap-3 p-3 text-wolf-300 hover:text-white hover:bg-wolf-800 font-mono text-xs uppercase rounded-xs transition-colors">
            <MapPin className="w-4 h-4 text-wolf-400" /> ENDEREÇOS
          </Link>
          <Link href="/minha-conta/dados" className="flex items-center gap-3 p-3 text-wolf-300 hover:text-white hover:bg-wolf-800 font-mono text-xs uppercase rounded-xs transition-colors">
            <User className="w-4 h-4 text-wolf-400" /> DADOS PESSOAIS
          </Link>
          <button className="w-full flex items-center gap-3 p-3 text-rose-400 hover:bg-rose-950/40 font-mono text-xs uppercase rounded-xs transition-colors pt-4 border-t border-wolf-800">
            <LogOut className="w-4 h-4" /> SAIR DA CONTA
          </button>
        </aside>

        {/* RECENT ORDERS & OVERVIEW (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-wolf-900 border border-wolf-800 p-6 space-y-6 rounded-sm">
            <div className="flex items-center justify-between border-b border-wolf-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white font-heading">
                ÚLTIMOS PEDIDOS REALIZADOS
              </h2>
              <Link href="/minha-conta/pedidos" className="text-xs font-mono text-accent hover:underline uppercase">
                VER TODOS →
              </Link>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 bg-wolf-950 border border-wolf-800 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm block">#{order.id}</span>
                    <span className="text-wolf-400">Data: {order.date} • {order.itemsCount} item(s)</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className={`font-bold block ${order.statusColor}`}>{order.status}</span>
                    <span className="text-white font-bold">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
