'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Plus, Edit2, Trash2, X, Save, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminMarcasPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/brands');
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (err) {
      console.error('Error loading brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleOpenModal = (brand?: any) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name || '',
        description: brand.description || '',
        logo_url: brand.logo_url || '',
      });
    } else {
      setEditingBrand(null);
      setFormData({ name: '', description: '', logo_url: '' });
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      const method = editingBrand ? 'PUT' : 'POST';
      const body = editingBrand
        ? { id: editingBrand.id, ...formData }
        : formData;

      const res = await fetch('/api/admin/brands', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingBrand ? 'Marca atualizada!' : 'Marca cadastrada com sucesso!');
        setModalOpen(false);
        loadBrands();
      } else {
        showToast(data.message || 'Erro ao salvar marca.', 'error');
      }
    } catch (err: any) {
      showToast('Erro de conexão: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir a marca "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Marca excluída com sucesso!');
        loadBrands();
      } else {
        showToast(data.message || 'Erro ao excluir marca.', 'error');
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
              PARCEIROS REGISTRADOS
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
              GERENCIAMENTO DE MARCAS ({loading ? '...' : brands.length})
              {loading && <RefreshCw className="w-4 h-4 animate-spin text-accent" />}
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xs transition-colors"
          >
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
                <th className="p-4 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-wolf-950/50">
                  <td className="p-4 font-bold text-white uppercase">{b.name}</td>
                  <td className="p-4 text-accent">{b.slug}</td>
                  <td className="p-4 text-wolf-300 max-w-md truncate">{b.description || '-'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(b)}
                      className="p-1.5 bg-wolf-800 hover:bg-wolf-700 text-white rounded-xs"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.name)}
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
                {editingBrand ? 'EDITAR MARCA' : 'NOVA MARCA'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-wolf-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-wolf-300 mb-1">NOME DA MARCA *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Adidas"
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-wolf-300 mb-1">DESCRIÇÃO</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da marca..."
                  className="w-full bg-wolf-950 border border-wolf-800 p-3 text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-wolf-300 mb-1">URL DO LOGOTIPO (OPCIONAL)</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
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
