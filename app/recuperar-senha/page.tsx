'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { createClient } from '@/lib/supabase/browser';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm shadow-2xl">
          <div className="space-y-2 text-center">
            <span className="text-xs font-mono text-accent uppercase tracking-widest font-extrabold">
              RECUPERAÇÃO DE ACESSO
            </span>
            <h1 className="text-2xl font-black uppercase font-heading text-white">
              RECUPERAR SENHA
            </h1>
            <p className="text-xs text-wolf-400">
              Digite seu e-mail cadastrado para receber as instruções de redefinição de senha.
            </p>
          </div>

          {sent ? (
            <div className="p-6 bg-wolf-950 border border-wolf-800 rounded-sm text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-xs text-wolf-300">
                Se este e-mail estiver cadastrado, você receberá um link de recuperação em alguns instantes.
              </p>
              <Link href="/login" className="inline-block text-xs font-mono text-accent font-bold uppercase underline">
                Voltar para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-wolf-300 block mb-1">E-MAIL CADASTRADO</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-wolf-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-wolf-950 border border-wolf-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR LINK DE RECUPERAÇÃO'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-wolf-800 text-center text-xs text-wolf-400">
            Lembrou da senha?{' '}
            <Link href="/login" className="text-accent font-bold hover:underline">
              Voltar ao Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
