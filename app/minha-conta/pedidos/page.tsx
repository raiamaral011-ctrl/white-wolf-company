'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { formatCurrency } from '@/lib/utils';
import { Package, ArrowRight, RefreshCw, ShoppingBag } from 'lucide-react';

export default function MeusPedidosPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserOrders() {
      setLoading(true);
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'aprovado':
      case 'pagamento aprovado':
        return { label: 'Pagamento Aprovado', color: 'text-emerald-400 border-emerald-800 bg-emerald-950' };
      case 'shipped':
      case 'enviado':
        return { label: 'Enviado', color: 'text-sky-400 border-sky-800 bg-sky-950' };
      case 'delivered':
      case 'entregue':
        return { label: 'Entregue', color: 'text-emerald-300 border-emerald-600 bg-emerald-900' };
      case 'cancelled':
      case 'cancelado':
        return { label: 'Cancelado', color: 'text-rose-400 border-rose-800 bg-rose-950' };
      default:
        return { label: 'Pendente', color: 'text-amber-400 border-amber-800 bg-amber-950' };
    }
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            HISTÓRICO DE COMPRAS
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-accent" /> MEUS PEDIDOS ({loading ? '...' : orders.length})
          </h1>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 font-mono text-xs text-wolf-400 gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
            Carregando seu histórico de pedidos...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-wolf-900 border border-wolf-800 rounded-sm space-y-4 font-mono">
            <ShoppingBag className="w-12 h-12 text-wolf-600 mx-auto" />
            <p className="text-sm text-wolf-300">Você ainda não possui pedidos registrados.</p>
            <Link
              href="/tenis"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-rose-700 text-white text-xs uppercase font-bold tracking-wider rounded-xs transition-colors"
            >
              EXPLORAR PRODUTOS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const items = order.items || [];
            return (
              <div key={order.id} className="bg-wolf-900 border border-wolf-800 p-6 space-y-4 rounded-sm">
                <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-wolf-800 gap-2 font-mono text-xs">
                  <div>
                    <span className="text-white font-bold text-sm block">#{order.id}</span>
                    <span className="text-wolf-400">Data: {new Date(order.created_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="text-left sm:text-right space-y-1">
                    <span className={`px-2 py-0.5 border text-[10px] uppercase font-bold rounded-xs inline-block ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-white font-bold block">{formatCurrency(order.total || 0)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-mono text-wolf-300">
                      <div>
                        <span className="text-white font-bold block">{item.product_name}</span>
                        <span className="text-wolf-400">SKU: {item.product_sku} • Tamanho: {item.size} • Cor: {item.color} • Qtd: {item.quantity}</span>
                      </div>
                      <span className="text-white font-bold">{formatCurrency((item.unit_price || 0) * (item.quantity || 1))}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-wolf-800 flex justify-end">
                  <Link
                    href={`/minha-conta/pedidos/${order.id}`}
                    className="px-4 py-2 bg-wolf-950 border border-wolf-700 hover:border-accent text-white font-mono text-xs uppercase font-bold flex items-center gap-1 transition-colors"
                  >
                    VER DETALHES DO PEDIDO <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </main>

      <Footer />
    </div>
  );
}
