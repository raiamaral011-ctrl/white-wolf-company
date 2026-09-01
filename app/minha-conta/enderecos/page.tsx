'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { MapPin, Plus, Trash2, X, Save, RefreshCw } from 'lucide-react';

export default function MeusEnderecosPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Residencial',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    is_default: true,
  });

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error('Error loading addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setModalOpen(false);
        setFormData({
          name: 'Residencial',
          cpf: '',
          cep: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          is_default: false,
        });
        loadAddresses();
      } else {
        alert(data.error || 'Erro ao cadastrar endereço.');
      }
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja remover este endereço?')) return;
    try {
      await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
      loadAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            ENTREGA E LOGÍSTICA
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <MapPin className="w-8 h-8 text-accent" /> MEUS ENDEREÇOS ({loading ? '...' : addresses.length})
          </h1>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-accent hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 rounded-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> NOVO ENDEREÇO
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 font-mono text-xs text-wolf-400 gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
            Carregando endereços...
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16 bg-wolf-900 border border-wolf-800 rounded-sm font-mono text-xs text-wolf-400">
            Nenhum endereço cadastrado ainda. Clique em &quot;NOVO ENDEREÇO&quot; para adicionar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-6 bg-wolf-900 border border-wolf-800 rounded-sm space-y-3 relative">
                {addr.is_default && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-wolf-950 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xs">
                    PRINCIPAL
                  </span>
                )}
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white uppercase text-sm font-heading">{addr.name}</h3>
                  <button onClick={() => handleDelete(addr.id)} className="text-wolf-500 hover:text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs font-mono text-wolf-300 space-y-1">
                  <p>{addr.street}, {addr.number} {addr.complement ? `- ${addr.complement}` : ''}</p>
                  <p>{addr.neighborhood} - {addr.city}/{addr.state}</p>
                  <p>CEP: {addr.cep}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* NEW ADDRESS MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-wolf-900 border border-wolf-800 max-w-lg w-full p-6 space-y-6 rounded-sm">
            <div className="flex justify-between items-center border-b border-wolf-800 pb-4">
              <h3 className="text-sm font-bold uppercase font-heading text-white tracking-wider">
                CADASTRAR NOVO ENDEREÇO
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-wolf-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-wolf-300 mb-1">NOME DO ENDEREÇO</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Casa, Trabalho"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-wolf-300 mb-1">CEP *</label>
                  <input
                    type="text"
                    required
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    placeholder="00000-000"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-wolf-300 mb-1">RUA / AVENIDA *</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-wolf-300 mb-1">NÚMERO *</label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-wolf-300 mb-1">COMPLEMENTO</label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    placeholder="Apto, Bloco..."
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-wolf-300 mb-1">BAIRRO *</label>
                  <input
                    type="text"
                    required
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-wolf-300 mb-1">CIDADE *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-wolf-300 mb-1">UF (ESTADO) *</label>
                  <input
                    type="text"
                    maxLength={2}
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="SP"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-white uppercase font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="accent-rose-600 w-4 h-4"
                />
                <label htmlFor="is_default" className="text-wolf-300 cursor-pointer">Definir como endereço principal de entrega</label>
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
                  {saving ? 'SALVANDO...' : 'SALVAR ENDEREÇO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
