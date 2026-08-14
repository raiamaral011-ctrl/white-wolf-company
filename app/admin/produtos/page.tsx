'use client';

import React from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MOCK_PRODUCTS } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminProdutosPage() {
  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              GERENCIAMENTO DE CATÁLOGO
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              PRODUTOS CADASTRADOS ({MOCK_PRODUCTS.length})
            </h1>
          </div>

          <Link
            href="/admin/produtos/novo"
            className="px-4 py-2.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> CADASTRAR NOVO PRODUTO
          </Link>
        </div>

        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                  <th className="p-4">PRODUTO</th>
                  <th className="p-4">MARCA</th>
                  <th className="p-4">CATEGORIA</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">PREÇO</th>
                  <th className="p-4">DESTAQUE</th>
                  <th className="p-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wolf-800/60">
                {MOCK_PRODUCTS.map((product) => (
                  <tr key={product.id} className="hover:bg-wolf-950/50">
                    <td className="p-4 font-bold text-white">{product.name}</td>
                    <td className="p-4 text-accent font-bold uppercase">{product.brand?.name}</td>
                    <td className="p-4 text-wolf-300">{product.category?.name}</td>
                    <td className="p-4 text-wolf-400">{product.sku}</td>
                    <td className="p-4 font-bold text-emerald-400">{formatCurrency(product.price)}</td>
                    <td className="p-4">
                      {product.featured ? (
                        <span className="px-2 py-0.5 bg-accent text-white text-[10px] uppercase font-bold">SIM</span>
                      ) : (
                        <span className="text-wolf-600">NÃO</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/produtos/${product.id}`}
                        className="p-1.5 bg-wolf-800 hover:bg-wolf-700 text-white inline-block rounded-xs"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </td>
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
