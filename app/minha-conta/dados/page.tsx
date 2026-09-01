'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { User, Check, RefreshCw, AlertCircle } from 'lucide-react';

export default function MeusDadosPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFullName(data.profile.full_name || '');
            setEmail(data.profile.email || '');
            setCpf(data.profile.cpf || '');
            setPhone(data.profile.phone || '');
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          cpf,
          phone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        setError(data.error || 'Erro ao salvar alterações.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro de conexão.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            CADASTRO PESSOAL
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
            <User className="w-8 h-8 text-accent" /> MEUS DADOS PESSOAIS
          </h1>
        </div>
      </section>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20 font-mono text-xs text-wolf-400 gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
            Carregando seus dados cadastrais...
          </div>
        ) : (
          <>
            {saved && (
              <div className="mb-6 p-4 bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs flex items-center gap-2 rounded-sm">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Dados pessoais atualizados com sucesso no sistema!</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-rose-950 border border-rose-800 text-rose-300 font-mono text-xs flex items-center gap-2 rounded-sm">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="bg-wolf-900 border border-wolf-800 p-8 space-y-4 rounded-sm">
              <div>
                <label className="text-xs font-mono text-wolf-300 block mb-1">NOME COMPLETO</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-wolf-300 block mb-1">E-MAIL (REGISTRADO)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-wolf-950/50 border border-wolf-800 px-3 py-2.5 text-xs text-wolf-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">CPF</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-wolf-300 block mb-1">TELEFONE</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 90000-0000"
                    className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-accent hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest transition-colors mt-4"
              >
                {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
              </button>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
