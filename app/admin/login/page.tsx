'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 600);
      } else {
        setError(data.message || 'Usuário ou senha incorretos.');
      }
    } catch (err) {
      setError('Falha na comunicação com o servidor de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-accent selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-wolf-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="p-6 flex items-center justify-between border-b border-wolf-900 z-10">
        <Link href="/" className="flex items-center gap-2 text-wolf-400 hover:text-white text-xs font-mono transition-colors">
          <ArrowLeft className="w-4 h-4" /> VOLTAR PARA A LOJA
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-wolf-500">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>PAINEL ADMINISTRATIVO SEGURO</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-wolf-950/90 border border-wolf-800 rounded-sm p-8 shadow-2xl backdrop-blur-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-wolf-900 border border-wolf-800 text-accent mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black uppercase font-heading tracking-tight text-white">
              WHITE WOLF <span className="text-accent">ADMIN</span>
            </h1>
            <p className="text-xs text-wolf-400 font-mono">
              Digite suas credenciais de administrador master para acessar a central de controle.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-xs flex items-center gap-3 text-xs text-rose-300 font-mono animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/80 rounded-xs flex items-center gap-3 text-xs text-emerald-300 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Acesso validado! Redirecionando para o Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-wolf-300 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-wolf-400" />
                Usuário Master
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: raiamaral"
                className="w-full bg-wolf-900/90 border border-wolf-700 focus:border-accent text-white px-3.5 py-2.5 rounded-xs text-sm font-mono placeholder:text-wolf-600 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-wolf-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-wolf-400" />
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-wolf-900/90 border border-wolf-700 focus:border-accent text-white px-3.5 py-2.5 pr-10 rounded-xs text-sm font-mono placeholder:text-wolf-600 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-wolf-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-2 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-mono text-xs uppercase font-bold py-3 px-4 rounded-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 cursor-pointer"
            >
              {loading ? (
                <span>AUTENTICANDO...</span>
              ) : (
                <>
                  <span>ACESSAR CENTRAL DE COMANDO</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-wolf-900 text-center">
            <span className="text-[11px] font-mono text-wolf-500">
              White Wolf Company • Painel Administrativo v1.0
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs font-mono text-wolf-600 border-t border-wolf-900 z-10">
        Área restrita exclusivamente para administradores autorizados.
      </footer>
    </div>
  );
}
