'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Search, Save, AlertTriangle, CheckCircle2, RotateCcw, Plus, Minus, Filter } from 'lucide-react';

interface InventoryItem {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color_name: string;
  stock: number;
  product?: {
    id: string;
    name: string;
    sku: string;
    brand?: { name: string };
    category?: { name: string };
  };
}

export default function AdminEstoquePage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'out' | 'low'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStockChange = (id: string, newStock: number) => {
    const val = Math.max(0, newStock);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: val } : item))
    );
  };

  const handleSaveStock = async (id: string, currentStock: number) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: id, stock: currentStock }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          currentStock === 0
            ? 'Estoque zerado! O item agora aparece como ESGOTADO na loja.'
            : `Estoque atualizado para ${currentStock} unidades!`
        );
      } else {
        showToast(data.message || 'Erro ao atualizar estoque.');
      }
    } catch (err) {
      showToast('Erro de conexão ao salvar estoque.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSetStock = (id: string, value: number) => {
    handleStockChange(id, value);
    handleSaveStock(id, value);
  };

  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      item.sku?.toLowerCase().includes(term) ||
      item.size?.toLowerCase().includes(term) ||
      item.product?.name?.toLowerCase().includes(term) ||
      item.product?.brand?.name?.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (filterStock === 'out') return item.stock <= 0;
    if (filterStock === 'low') return item.stock > 0 && item.stock <= 5;
    return true;
  });

  const totalStockCount = items.reduce((acc, i) => acc + (i.stock || 0), 0);
  const outOfStockCount = items.filter((i) => (i.stock || 0) <= 0).length;
  const lowStockCount = items.filter((i) => (i.stock || 0) > 0 && (i.stock || 0) <= 5).length;

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 p-4 bg-wolf-900 border border-accent text-white text-xs font-mono rounded-sm shadow-2xl flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              INVENTÁRIO EM TEMPO REAL
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              CONTROLE DE ESTOQUE
            </h1>
            <p className="text-xs text-wolf-400 font-mono mt-1">
              Altere a quantidade de estoque de cada variante. Itens zerados ficam automaticamente <strong>INDISPONÍVEIS</strong> no site.
            </p>
          </div>

          <button
            onClick={fetchInventory}
            className="px-4 py-2 bg-wolf-900 hover:bg-wolf-800 border border-wolf-700 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 rounded-xs transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" /> RECARREGAR
          </button>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-wolf-900/60 border border-wolf-800 rounded-sm">
            <span className="text-xs font-mono text-wolf-400 block uppercase">TOTAL DE PEÇAS NO ESTOQUE</span>
            <span className="text-2xl font-black font-mono text-white mt-1 block">
              {totalStockCount} unidades
            </span>
          </div>
          <div
            onClick={() => setFilterStock(filterStock === 'out' ? 'all' : 'out')}
            className={`p-4 border rounded-sm cursor-pointer transition-colors ${
              filterStock === 'out'
                ? 'bg-rose-950/80 border-rose-600'
                : 'bg-wolf-900/60 border-wolf-800 hover:border-rose-800'
            }`}
          >
            <span className="text-xs font-mono text-rose-400 block uppercase font-bold">VARIANTES ESGOTADAS (0 UN)</span>
            <span className="text-2xl font-black font-mono text-rose-400 mt-1 block">
              {outOfStockCount} itens
            </span>
          </div>
          <div
            onClick={() => setFilterStock(filterStock === 'low' ? 'all' : 'low')}
            className={`p-4 border rounded-sm cursor-pointer transition-colors ${
              filterStock === 'low'
                ? 'bg-amber-950/80 border-amber-600'
                : 'bg-wolf-900/60 border-wolf-800 hover:border-amber-800'
            }`}
          >
            <span className="text-xs font-mono text-amber-400 block uppercase font-bold">BAIXO ESTOQUE (1-5 UN)</span>
            <span className="text-2xl font-black font-mono text-amber-400 mt-1 block">
              {lowStockCount} itens
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-wolf-900 border border-wolf-800 rounded-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-wolf-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por produto, SKU ou tamanho..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-wolf-950 border border-wolf-800 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-wolf-600 focus:outline-none focus:border-accent rounded-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs font-mono text-wolf-400 uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> FILTRAR:
            </span>
            <button
              onClick={() => setFilterStock('all')}
              className={`px-3 py-1.5 text-xs font-mono rounded-xs font-bold transition-colors ${
                filterStock === 'all' ? 'bg-accent text-white' : 'bg-wolf-950 text-wolf-400 hover:text-white'
              }`}
            >
              TODOS ({items.length})
            </button>
            <button
              onClick={() => setFilterStock('out')}
              className={`px-3 py-1.5 text-xs font-mono rounded-xs font-bold transition-colors ${
                filterStock === 'out' ? 'bg-rose-600 text-white' : 'bg-wolf-950 text-rose-400 hover:bg-rose-950/40'
              }`}
            >
              ESGOTADOS ({outOfStockCount})
            </button>
            <button
              onClick={() => setFilterStock('low')}
              className={`px-3 py-1.5 text-xs font-mono rounded-xs font-bold transition-colors ${
                filterStock === 'low' ? 'bg-amber-600 text-white' : 'bg-wolf-950 text-amber-400 hover:bg-amber-950/40'
              }`}
            >
              BAIXO ({lowStockCount})
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                  <th className="p-4">PRODUTO & MARCA</th>
                  <th className="p-4">SKU VARIANTE</th>
                  <th className="p-4">TAMANHO</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">AJUSTAR QUANTIDADE</th>
                  <th className="p-4 text-right">AÇÕES RÁPIDAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wolf-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-wolf-500">
                      Carregando dados de estoque do Supabase...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-wolf-500">
                      Nenhuma variante encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isUpdating = updatingId === item.id;
                    const isOutOfStock = item.stock <= 0;
                    const isLowStock = item.stock > 0 && item.stock <= 5;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-wolf-950/50 transition-colors ${
                          isOutOfStock ? 'bg-rose-950/20' : ''
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-bold text-white block text-sm">
                            {item.product?.name || 'Produto'}
                          </span>
                          <span className="text-[10px] text-accent font-bold uppercase">
                            {item.product?.brand?.name || 'Marca'} • {item.product?.category?.name || 'Geral'}
                          </span>
                        </td>

                        <td className="p-4 text-wolf-400 font-mono">
                          {item.sku}
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-wolf-950 border border-wolf-700 text-white font-bold font-mono rounded-xs">
                            {item.size}
                          </span>
                        </td>

                        <td className="p-4">
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] uppercase rounded-xs">
                              ESGOTADO (0)
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 bg-amber-500 text-wolf-950 font-bold text-[10px] uppercase rounded-xs">
                              ÚLTIMAS {item.stock} UN.
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] uppercase rounded-xs">
                              DISPONÍVEL ({item.stock})
                            </span>
                          )}
                        </td>

                        {/* Interactive Stock Number Stepper */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStockChange(item.id, (item.stock || 0) - 1)}
                              className="w-7 h-7 bg-wolf-800 hover:bg-wolf-700 active:bg-accent text-white flex items-center justify-center rounded-xs transition-colors"
                              title="Diminuir 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="number"
                              min={0}
                              value={item.stock}
                              onChange={(e) => handleStockChange(item.id, parseInt(e.target.value, 10) || 0)}
                              className="w-16 bg-wolf-950 border border-wolf-700 focus:border-accent text-center font-bold text-sm text-white py-1 rounded-xs focus:outline-none"
                            />

                            <button
                              onClick={() => handleStockChange(item.id, (item.stock || 0) + 1)}
                              className="w-7 h-7 bg-wolf-800 hover:bg-wolf-700 active:bg-accent text-white flex items-center justify-center rounded-xs transition-colors"
                              title="Aumentar 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleSaveStock(item.id, item.stock)}
                              disabled={isUpdating}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-[10px] uppercase rounded-xs flex items-center gap-1 ml-2 transition-colors cursor-pointer"
                              title="Salvar quantidade no banco de dados"
                            >
                              <Save className="w-3.5 h-3.5" />
                              {isUpdating ? '...' : 'SALVAR'}
                            </button>
                          </div>
                        </td>

                        {/* Quick Zero or Restock Actions */}
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleSetStock(item.id, 0)}
                            className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-[10px] font-bold uppercase rounded-xs transition-colors"
                            title="Zerar estoque e marcar como indisponível no site"
                          >
                            ZERAR
                          </button>

                          <button
                            onClick={() => handleSetStock(item.id, 10)}
                            className="px-2.5 py-1 bg-wolf-800 hover:bg-wolf-700 text-wolf-200 text-[10px] font-bold uppercase rounded-xs transition-colors"
                            title="Repor com 10 unidades"
                          >
                            REPOR (+10)
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
