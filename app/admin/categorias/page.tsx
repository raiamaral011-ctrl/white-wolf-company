import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { CATEGORIES } from '@/lib/data/products';
import { Plus } from 'lucide-react';

export default function AdminCategoriasPage() {
  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              TAXONOMIA DO SITE
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              CATEGORIAS ({CATEGORIES.length})
            </h1>
          </div>
          <button className="px-4 py-2.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4" /> CRIAR CATEGORIA
          </button>
        </div>

        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                <th className="p-4">CATEGORIA</th>
                <th className="p-4">SLUG</th>
                <th className="p-4">DESCRIÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {CATEGORIES.map((c) => (
                <tr key={c.id} className="hover:bg-wolf-950/50">
                  <td className="p-4 font-bold text-white uppercase">{c.name}</td>
                  <td className="p-4 text-accent">{c.slug}</td>
                  <td className="p-4 text-wolf-300 max-w-md truncate">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
