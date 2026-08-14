'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BRANDS, CATEGORIES } from '@/lib/data/products';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function AdminNovoProdutoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    brand_id: BRANDS[0].id,
    category_id: CATEGORIES[0].id,
    description: '',
    sku: '',
    price: '',
    compare_at_price: '',
    gender: 'unisex',
    featured: false,
    is_new: true,
    is_sale: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      router.push('/admin/produtos');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-wolf-800 pb-6">
          <div>
            <button onClick={() => router.back()} className="text-xs font-mono text-wolf-400 hover:text-white flex items-center gap-1 mb-2">
              <ArrowLeft className="w-4 h-4" /> VOLTAR PARA LISTA DE PRODUTOS
            </button>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              CADASTRAR NOVO PRODUTO
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-wolf-300 block mb-1">NOME DO PRODUTO *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Tênis Ultraboost Light Tech"
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">MARCA *</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent"
              >
                {BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">CATEGORIA *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">SKU UNÍVOCO *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="EX: ADI-UB-99"
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">PREÇO (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1199.90"
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-wolf-300 block mb-1">DESCRIÇÃO DETALHADA *</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o produto, tecnologias de amortecimento, composição..."
                className="w-full bg-wolf-950 border border-wolf-800 p-3 text-xs text-white focus:outline-none focus:border-accent font-sans"
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-wolf-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="accent-rose-600"
                />
                DESTAR PRODUTO NA HOME
              </label>

              <label className="flex items-center gap-2 text-xs font-mono text-wolf-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="accent-rose-600"
                />
                MARCAR COMO NOVIDADE
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-wolf-800">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'SALVANDO...' : 'SALVAR E PUBLICAR PRODUTO'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
