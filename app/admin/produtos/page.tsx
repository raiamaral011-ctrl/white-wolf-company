'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { formatCurrency } from '@/lib/utils';
import { Plus, Edit, Trash2, Search, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Product } from '@/types';

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('Erro ao carregar produtos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteProduct = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast('Produto e variantes removidos com sucesso!', 'success');
      } else {
        showToast(data.message || 'Erro ao remover produto.', 'error');
      }
    } catch (err) {
      showToast('Erro de conexão ao excluir produto.', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.sku?.toLowerCase().includes(term) ||
      p.brand?.name?.toLowerCase().includes(term) ||
      p.category?.name?.toLowerCase().includes(term)
    );
  });

  const outOfStockCount = products.filter((p) => {
    const total = (p.variants || []).reduce((s, v) => s + (v.stock || 0), 0);
    return total <= 0 && (p.variants?.length || 0) > 0;
  }).length;

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      {/* Toast */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 p-4 border text-white text-xs font-mono rounded-sm shadow-2xl flex items-center gap-3 ${
          toastMessage.type === 'error'
            ? 'bg-rose-950 border-rose-600'
            : 'bg-wolf-900 border-emerald-600'
        }`}>
          {toastMessage.type === 'error'
            ? <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-wolf-950 border border-rose-700 max-w-md w-full p-6 space-y-4 rounded-sm shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-7 h-7 shrink-0" />
              <h2 className="text-sm font-black uppercase tracking-widest">CONFIRMAR EXCLUSÃO</h2>
            </div>
            <p className="text-xs font-mono text-wolf-300 leading-relaxed">
              Tem certeza que deseja remover este produto? Todas as suas <strong className="text-white">variantes, imagens e referências de estoque</strong> serão excluídas permanentemente do banco de dados.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleDeleteProduct(confirmDelete)}
                disabled={!!deletingId}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xs flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {deletingId === confirmDelete ? 'EXCLUINDO...' : 'SIM, EXCLUIR PRODUTO'}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-6 py-3 bg-wolf-800 hover:bg-wolf-700 text-white font-bold text-xs uppercase rounded-xs"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              GERENCIAMENTO DE CATÁLOGO
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
              PRODUTOS CADASTRADOS ({products.length})
            </h1>
            {outOfStockCount > 0 && (
              <span className="text-xs font-mono text-rose-400 mt-1 block">
                ⚠ {outOfStockCount} produto(s) com estoque zerado — exibidos como <strong>ESGOTADOS</strong> na loja.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="px-3 py-2.5 bg-wolf-900 hover:bg-wolf-800 border border-wolf-700 text-wolf-300 font-mono text-xs flex items-center gap-2 rounded-xs"
              title="Recarregar lista"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/admin/produtos/novo"
              className="px-4 py-2.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> CADASTRAR NOVO PRODUTO
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-wolf-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar produto, SKU, marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-wolf-900 border border-wolf-800 pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-wolf-600 focus:outline-none focus:border-accent rounded-xs"
          />
        </div>

        {/* Table */}
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
                  <th className="p-4">ESTOQUE</th>
                  <th className="p-4">DESTAQUE</th>
                  <th className="p-4 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wolf-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-wolf-500">
                      Carregando catálogo de produtos...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-wolf-500">
                      {search ? 'Nenhum produto encontrado para esta busca.' : 'Nenhum produto cadastrado ainda.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const totalStock = (product.variants || []).reduce((s, v) => s + (v.stock || 0), 0);
                    const hasVariants = (product.variants?.length || 0) > 0;
                    const isOutOfStock = hasVariants && totalStock <= 0;
                    const isLowStock = hasVariants && totalStock > 0 && totalStock <= 15;

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-wolf-950/50 transition-colors ${
                          isOutOfStock ? 'bg-rose-950/10' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.images?.[0]?.url && (
                              <div className="relative w-10 h-10 bg-wolf-800 rounded-xs overflow-hidden shrink-0">
                                <Image
                                  src={product.images[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-white block">{product.name}</span>
                              {product.is_new && (
                                <span className="text-[9px] bg-accent px-1.5 py-0.5 text-white font-bold uppercase rounded-xs">
                                  NOVO
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-accent font-bold uppercase">{product.brand?.name}</td>
                        <td className="p-4 text-wolf-300">{product.category?.name}</td>
                        <td className="p-4 text-wolf-400">{product.sku}</td>
                        <td className="p-4 font-bold text-emerald-400">{formatCurrency(product.price)}</td>

                        <td className="p-4">
                          {!hasVariants ? (
                            <span className="text-wolf-600 text-[10px]">SEM VARIANTES</span>
                          ) : isOutOfStock ? (
                            <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] uppercase rounded-xs">
                              ESGOTADO
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 bg-amber-500 text-wolf-950 font-bold text-[10px] uppercase rounded-xs">
                              BAIXO ({totalStock})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 font-bold text-[10px] uppercase rounded-xs border border-emerald-800">
                              OK ({totalStock})
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {product.featured ? (
                            <span className="px-2 py-0.5 bg-accent text-white text-[10px] uppercase font-bold rounded-xs">SIM</span>
                          ) : (
                            <span className="text-wolf-600">NÃO</span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/produto/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-wolf-800 hover:bg-wolf-700 text-wolf-300 hover:text-white inline-flex rounded-xs transition-colors"
                              title="Ver no site"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <Link
                              href={`/admin/produtos/${product.id}`}
                              className="p-1.5 bg-wolf-800 hover:bg-wolf-700 text-white inline-flex rounded-xs transition-colors"
                              title="Editar produto"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setConfirmDelete(product.id)}
                              disabled={deletingId === product.id}
                              className="p-1.5 bg-rose-950/60 hover:bg-rose-700 border border-rose-800 text-rose-400 hover:text-white inline-flex rounded-xs transition-colors disabled:opacity-40"
                              title="Excluir produto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
