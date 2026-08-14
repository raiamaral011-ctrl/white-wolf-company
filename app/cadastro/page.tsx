'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { createClient } from '@/lib/supabase/browser';
import { registerSchema } from '@/lib/validation/schemas';
import { UserPlus, ArrowRight, AlertCircle } from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Validate schema
      const validated = registerSchema.parse(formData);

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            full_name: validated.fullName,
            cpf: validated.cpf,
            phone: validated.phone,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      router.push('/minha-conta');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.message || err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-lg w-full bg-wolf-900 border border-wolf-800 p-8 space-y-6 rounded-sm shadow-2xl">
          <div className="space-y-2 text-center">
            <span className="text-xs font-mono text-accent uppercase tracking-widest font-extrabold">
              NOVO CLIENTE
            </span>
            <h1 className="text-2xl font-black uppercase font-heading text-white">
              CRIAR SUA CONTA
            </h1>
            <p className="text-xs text-wolf-400">
              Junte-se à comunidade White Wolf Company e aproveite ofertas exclusivas.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-mono flex items-center gap-2 rounded-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">NOME COMPLETO *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Seu nome completo"
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-wolf-300 block mb-1">E-MAIL PRINCIPAL *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-wolf-300 block mb-1">SENHA *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-wolf-300 block mb-1">CONFIRMAR SENHA *</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repita sua senha"
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-wolf-300 block mb-1">CPF (OPCIONAL)</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-wolf-300 block mb-1">TELEFONE (OPCIONAL)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'CRIANDO CONTA...' : 'FINALIZAR CADASTRO'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-wolf-800 text-center text-xs text-wolf-400">
            Já possui uma conta registrada?{' '}
            <Link href="/login" className="text-accent font-bold hover:underline">
              Fazer Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
