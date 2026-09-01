'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Plus, Edit2, Trash2, X, Save, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image_url: category.image_url || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image_url: '' });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory
        ? { id: editingCategory.id, ...formData }
        : formData;

      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingCategory ? 'Categoria atualizada!' : 'Categoria criada com sucesso!');
        setModalOpen(false);
        loadCategories();
      } else {
        showToast(data.message || 'Erro ao salvar categoria.', 'error');
      }
    } catch (err: any) {
      showToast('Erro de conexão: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir a categoria "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Categoria excluída com sucesso!');
        loadCategories();
      } else {
        showToast(data.message || 'Erro ao excluir.', 'error');
      }
    } catch (err: any) {
      showToast('Erro: ' + err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 border text-white text-xs font-mono rounded-sm shadow-2xl flex items-center gap-3 max-w-sm ${
          toast.type === 'error' ? 'bg-rose-950 border-rose-600' : 'bg-wolf-900 border-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertTriangle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              TAXONOMIA DO SITE
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
              CATEGORIAS ({loading ? '...' : categories.length})
              {loading && <RefreshCw className="w-4 h-4 animate-spin text-accent" />}
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xs transition-colors"
          >
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
                <th className="p-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-wolf-950/50">
                  <td className="p-4 font-bold text-white uppercase">{c.name}</td>
                  <td className="p-4 text-accent">{c.slug}</td>
                  <td className="p-4 text-wolf-300 max-w-md truncate">{c.description || '-'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(c)}
                      className="p-1.5 bg-wolf-800 hover:bg-wolf-700 text-white rounded-xs"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-700 text-rose-400 hover:text-white border border-rose-900 rounded-xs"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-wolf-900 border border-wolf-800 max-w-md w-full p-6 space-y-6 rounded-sm">
            <div className="flex justify-between items-center border-b border-wolf-800 pb-4">
              <h3 className="text-sm font-bold uppercase font-heading text-white tracking-wider">
                {editingCategory ? 'EDITAR CATEGORIA' : 'NOVA CATEGORIA'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-wolf-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-wolf-300 mb-1">NOME DA CATEGORIA *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Tênis"
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-wolf-300 mb-1">DESCRIÇÃO</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da categoria..."
                  className="w-full bg-wolf-950 border border-wolf-800 p-3 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-wolf-300 mb-1">URL DA IMAGEM DE CAPA (OPCIONAL)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-wolf-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-wolf-800 text-white font-bold uppercase rounded-xs"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-accent hover:bg-rose-700 disabled:opacity-50 text-white font-bold uppercase rounded-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'SALVANDO...' : 'SALVAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
