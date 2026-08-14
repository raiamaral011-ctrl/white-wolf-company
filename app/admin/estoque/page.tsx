import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { MOCK_PRODUCTS } from '@/lib/data/products';

export default function AdminEstoquePage() {
  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="border-b border-wolf-800 pb-6">
          <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
            INVENTÁRIO E VARIANTES
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
            CONTROLE DE ESTOQUE
          </h1>
        </div>

        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                <th className="p-4">PRODUTO</th>
                <th className="p-4">SKU DA VARIANTE</th>
                <th className="p-4">TAMANHO</th>
                <th className="p-4">COR</th>
                <th className="p-4">ESTOQUE ATUAL</th>
                <th className="p-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {MOCK_PRODUCTS.flatMap((p) => p.variants || []).slice(0, 15).map((v) => (
                <tr key={v.id} className="hover:bg-wolf-950/50">
                  <td className="p-4 font-bold text-white">Variant Product</td>
                  <td className="p-4 text-wolf-400">{v.sku}</td>
                  <td className="p-4 font-bold text-accent">{v.size}</td>
                  <td className="p-4 text-wolf-300">{v.color_name}</td>
                  <td className="p-4 font-bold text-emerald-400">{v.stock} un.</td>
                  <td className="p-4 text-right">
                    <button className="px-3 py-1 bg-wolf-800 hover:bg-wolf-700 text-white font-mono text-[10px] uppercase font-bold">
                      ALTERAR ESTOQUE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
