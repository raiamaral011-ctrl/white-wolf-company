'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { createClient } from '@/lib/supabase/browser';
import { registerSchema } from '@/lib/validation/schemas';
import { UserPlus, ArrowRight, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

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
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const cleanData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        cpf: formData.cpf.trim(),
        phone: formData.phone.trim(),
      };

      // Validate schema
      const validated = registerSchema.parse(cleanData);

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          data: {
            full_name: validated.fullName,
            cpf: validated.cpf || null,
            phone: validated.phone || null,
            role: 'customer', // strictly enforce customer role
          },
        },
      });

      if (error) {
        let msg = error.message;
        if (
          error.message.includes('User already registered') ||
          (error as any).code === 'user_already_exists'
        ) {
          msg = 'Este e-mail já está cadastrado. Faça login para continuar.';
        } else if (error.message.includes('Password should be at least 6 characters')) {
          msg = 'A senha deve conter no mínimo 6 caracteres.';
        } else if (error.message.includes('valid email')) {
          msg = 'Por favor, informe um endereço de e-mail válido.';
        }
        throw new Error(msg);
      }

      // Check if user session was returned or sign in explicitly
      if (!data.session) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: validated.email,
          password: validated.password,
        });
        if (signInErr) {
          console.warn('Auto sign-in notice:', signInErr.message);
        }
      }

      setSuccessMsg('Conta criada com sucesso! Redirecionando para a sua área...');

      setTimeout(() => {
        window.location.href = '/minha-conta';
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err?.errors?.[0]?.message || err.message || 'Erro ao realizar cadastro.');
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
              Junte-se à comunidade White Wolf Company e aproveite uma experiência de compra exclusiva.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-mono flex items-center gap-2 rounded-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-mono flex items-center gap-2 rounded-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
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
                disabled={loading || !!successMsg}
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent disabled:opacity-50"
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
                disabled={loading || !!successMsg}
                className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent disabled:opacity-50"
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
                  disabled={loading || !!successMsg}
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent disabled:opacity-50"
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
                  disabled={loading || !!successMsg}
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent disabled:opacity-50"
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
                  disabled={loading || !!successMsg}
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-wolf-300 block mb-1">TELEFONE (OPCIONAL)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  disabled={loading || !!successMsg}
                  className="w-full bg-wolf-950 border border-wolf-800 px-3 py-2 text-xs text-white placeholder-wolf-500 focus:outline-none focus:border-accent disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!successMsg}
              className="w-full py-3.5 bg-accent hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  CRIANDO CONTA...
                </>
              ) : successMsg ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  CONTA CRIADA!
                </>
              ) : (
                <>
                  FINALIZAR CADASTRO
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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
