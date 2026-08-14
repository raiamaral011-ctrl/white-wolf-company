'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { User, Check } from 'lucide-react';

export default function MeusDadosPage() {
  const [fullName, setFullName] = useState('Lucas Silva');
  const [email, setEmail] = useState('lucas.silva@exemplo.com.br');
  const [cpf, setCpf] = useState('123.456.789-00');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        {saved && (
          <div className="mb-6 p-4 bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-xs flex items-center gap-2 rounded-sm">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Dados pessoais atualizados com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-wolf-900 border border-wolf-800 p-8 space-y-4 rounded-sm">
          <div>
            <label className="text-xs font-mono text-wolf-300 block mb-1">NOME COMPLETO</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-wolf-300 block mb-1">E-MAIL</label>
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
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">TELEFONE</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest transition-colors mt-4"
          >
            SALVAR ALTERAÇÕES
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
