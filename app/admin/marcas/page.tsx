import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BRANDS } from '@/lib/data/products';
import { Plus } from 'lucide-react';

export default function AdminMarcasPage() {
  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              PARCEIROS REGISTRADOS
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              GERENCIAMENTO DE MARCAS ({BRANDS.length})
            </h1>
          </div>
          <button className="px-4 py-2.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4" /> ADICIONAR MARCA
          </button>
        </div>

        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                <th className="p-4">MARCA</th>
                <th className="p-4">SLUG</th>
                <th className="p-4">DESCRIÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {BRANDS.map((b) => (
                <tr key={b.id} className="hover:bg-wolf-950/50">
                  <td className="p-4 font-bold text-white uppercase">{b.name}</td>
                  <td className="p-4 text-accent">{b.slug}</td>
                  <td className="p-4 text-wolf-300 max-w-md truncate">{b.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
