'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { createClient } from '@/lib/supabase/browser';
import { Lock, Mail, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const cleanInput = (email || '').trim().toLowerCase();
      let targetEmail = cleanInput;

      if (!targetEmail.includes('@')) {
        targetEmail = `${cleanInput}@whitewolf.com`;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password,
      });

      if (error || !data.user) {
        throw new Error(error?.message || 'Credenciais inválidas.');
      }

      // Check role in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      const isAdmin = profile?.role === 'admin';

      if (isAdmin) {
        // Establish admin token cookie
        try {
          await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: targetEmail, password }),
          });
        } catch {}
      }

      const destination = redirectParam && redirectParam.startsWith('/')
        ? redirectParam
        : isAdmin
        ? '/admin'
        : '/minha-conta';

      window.location.href = destination;
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao realizar login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm shadow-2xl">
      <div className="space-y-2 text-center">
        <span className="text-xs font-mono text-accent uppercase tracking-widest font-extrabold">
          ÁREA DO CLIENTE
        </span>
        <h1 className="text-2xl font-black uppercase font-heading text-white">
          ENTRAR NA SUA CONTA
        </h1>
        <p className="text-xs text-wolf-400">
          Acesse seus pedidos, endereços salvos e lista de favoritos.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-mono flex items-center gap-2 rounded-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-mono text-wolf-300 block mb-1">E-MAIL</label>
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

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-mono text-wolf-300">SENHA</label>
            <Link href="/recuperar-senha" className="text-[11px] font-mono text-accent hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-wolf-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-wolf-950 border border-wolf-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? 'ENTRANDO...' : 'ACESSAR CONTA'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-wolf-800 text-center text-xs text-wolf-400">
        Ainda não tem uma conta?{' '}
        <Link href="/cadastro" className="text-accent font-bold hover:underline">
          Cadastre-se gratuitamente
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <Suspense fallback={
          <div className="p-12 text-center text-wolf-400 font-mono text-xs flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-accent" />
            Carregando login...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
