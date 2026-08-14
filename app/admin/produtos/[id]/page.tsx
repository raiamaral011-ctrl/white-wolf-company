'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { BRANDS, CATEGORIES, MOCK_PRODUCTS } from '@/lib/data/products';
import { ArrowLeft, Save } from 'lucide-react';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function AdminEditProdutoPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id) || MOCK_PRODUCTS[0];

  const [formData, setFormData] = useState({
    name: product.name,
    brand_id: product.brand_id,
    category_id: product.category_id,
    description: product.description,
    sku: product.sku,
    price: product.price.toString(),
    featured: product.featured,
    is_new: product.is_new,
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
              <ArrowLeft className="w-4 h-4" /> VOLTAR PARA PRODUTOS
            </button>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              EDITAR PRODUTO: {product.name}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="text-xs font-mono text-wolf-300 block mb-1">NOME DO PRODUTO</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">PREÇO (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">SKU</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
          </button>
        </form>
      </main>
    </div>
  );
}
