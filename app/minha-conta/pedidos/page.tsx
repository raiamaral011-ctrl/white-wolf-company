'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { formatCurrency } from '@/lib/utils';
import { Package, ArrowRight } from 'lucide-react';

export default function MeusPedidosPage() {
  const orders = [
    {
      id: 'ORD-172363000-482',
      date: '14/08/2026',
      total: 1199.90,
      status: 'Pagamento aprovado',
      statusColor: 'text-emerald-400',
      items: [
        { name: 'Tênis Ultraboost Light Tech', quantity: 1, price: 1199.90, size: '41', color: 'Preto/Vermelho' }
      ]
    },
    {
      id: 'ORD-172352000-112',
      date: '02/08/2026',
      total: 799.90,
      status: 'Entregue',
      statusColor: 'text-sky-400',
      items: [
        { name: 'Tênis Pegasus 40 React', quantity: 1, price: 799.90, size: '37', color: 'Azul Celeste' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            HISTÓRICO DE COMPRAS
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-accent" /> MEUS PEDIDOS ({orders.length})
          </h1>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-wolf-900 border border-wolf-800 p-6 space-y-4 rounded-sm">
            <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-wolf-800 gap-2 font-mono text-xs">
              <div>
                <span className="text-white font-bold text-sm block">#{order.id}</span>
                <span className="text-wolf-400">Data do Pedido: {order.date}</span>
              </div>
              <div className="text-left sm:text-right">
                <span className={`font-bold block ${order.statusColor}`}>{order.status}</span>
                <span className="text-white font-bold">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-mono text-wolf-300">
                  <div>
                    <span className="text-white font-bold block">{item.name}</span>
                    <span className="text-wolf-400">Tamanho: {item.size} • Cor: {item.color} • Qtd: {item.quantity}</span>
                  </div>
                  <span className="text-white font-bold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-wolf-800 flex justify-end">
              <Link
                href={`/minha-conta/pedidos/${order.id}`}
                className="px-4 py-2 bg-wolf-950 border border-wolf-700 hover:border-accent text-white font-mono text-xs uppercase font-bold flex items-center gap-1"
              >
                VER DETALHES DO PEDIDO <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
