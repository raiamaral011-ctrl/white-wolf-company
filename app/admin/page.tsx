'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0,
  };

  const topProducts = data?.topProducts || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              PAINEL ADMINISTRATIVO
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
              DASHBOARD DE VENDAS
              {loading && <RefreshCw className="w-5 h-5 text-accent animate-spin" />}
            </h1>
          </div>
          <span className="text-xs font-mono text-wolf-400 bg-wolf-900 border border-wolf-800 px-3 py-1.5 rounded-xs">
            SISTEMA AO VIVO • {new Date().toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* METRIC TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-2">
            <div className="flex justify-between items-center text-wolf-400">
              <span className="text-xs font-mono uppercase font-bold">VENDAS TOTAIS</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-2xl font-black font-mono text-white block">
              {loading ? '...' : formatCurrency(metrics.totalRevenue)}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Atualizado em tempo real
            </span>
          </div>

          <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-2">
            <div className="flex justify-between items-center text-wolf-400">
              <span className="text-xs font-mono uppercase font-bold">TOTAL DE PEDIDOS</span>
              <ShoppingBag className="w-5 h-5 text-accent" />
            </div>
            <span className="text-2xl font-black font-mono text-white block">
              {loading ? '...' : metrics.totalOrders}
            </span>
            <Link href="/admin/pedidos" className="text-[11px] font-mono text-accent hover:underline block">
              Gerenciar pedidos →
            </Link>
          </div>

          <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-2">
            <div className="flex justify-between items-center text-wolf-400">
              <span className="text-xs font-mono uppercase font-bold">CLIENTES</span>
              <Users className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-2xl font-black font-mono text-white block">
              {loading ? '...' : metrics.totalCustomers}
            </span>
            <Link href="/admin/clientes" className="text-[11px] font-mono text-sky-400 hover:underline block">
              Ver base de clientes →
            </Link>
          </div>

          <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-2">
            <div className="flex justify-between items-center text-wolf-400">
              <span className="text-xs font-mono uppercase font-bold">ALERTA DE ESTOQUE</span>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-2xl font-black font-mono text-white block">
              {loading ? '...' : metrics.lowStockCount}
            </span>
            <Link href="/admin/estoque" className="text-[11px] font-mono text-amber-400 hover:underline block">
              Ajustar estoque baixo →
            </Link>
          </div>
        </div>

        {/* TOP SELLING / FEATURED PRODUCTS */}
        <div className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-4">
          <div className="flex justify-between items-center border-b border-wolf-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white font-heading">
              PRODUTOS EM DESTAQUE E CATÁLOGO
            </h3>
            <Link href="/admin/produtos" className="text-xs font-mono text-accent hover:underline">
              VER TODOS OS PRODUTOS →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-wolf-800 text-wolf-400">
                  <th className="py-3">PRODUTO</th>
                  <th className="py-3">MARCA</th>
                  <th className="py-3">SKU</th>
                  <th className="py-3">PREÇO</th>
                  <th className="py-3">AVALIAÇÃO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wolf-800/60">
                {topProducts.map((product: any) => (
                  <tr key={product.id} className="hover:bg-wolf-950/50">
                    <td className="py-3 font-bold text-white">{product.name}</td>
                    <td className="py-3 text-accent uppercase font-bold">{product.brand?.name || 'Marca'}</td>
                    <td className="py-3 text-wolf-400">{product.sku}</td>
                    <td className="py-3 text-emerald-400 font-bold">{formatCurrency(product.price)}</td>
                    <td className="py-3 text-amber-400">★ {product.rating || 5.0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
