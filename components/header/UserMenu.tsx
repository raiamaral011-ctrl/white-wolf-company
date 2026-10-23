'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogIn, UserPlus, Shield, Package, Settings, LogOut, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/browser';

export function UserMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function getUserProfile() {
      try {
        // 1. Check Supabase Auth session first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('user_id', session.user.id)
            .single();

          if (isMounted) {
            setUser({
              email: session.user.email,
              name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              role: profile?.role || session.user.user_metadata?.role || 'customer',
            });
          }
          return;
        }

        // 2. Check if admin session cookie exists
        const res = await fetch('/api/admin/session');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user && isMounted) {
            setUser({
              email: data.user.email,
              name: data.user.username,
              role: 'admin',
            });
            return;
          }
        }

        if (isMounted) {
          setUser(null);
        }
      } catch (err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        if (isMounted) setUser(null);
      } else {
        getUserProfile();
      }
    });

    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      
      // 1. Client-side Supabase Auth signout
      await supabase.auth.signOut();

      // 2. Clear admin and server auth session cookies
      await Promise.all([
        fetch('/api/auth/logout', { method: 'POST' }),
        fetch('/api/admin/logout', { method: 'POST' }),
      ]);

      // 3. Immediately reset local state
      setUser(null);
      setStatusMsg({ type: 'success', text: 'Sessão encerrada com sucesso!' });

      setTimeout(() => {
        setIsOpen(false);
        setStatusMsg(null);
        // Hard reload to clean all client router caches and server component state
        window.location.href = '/';
      }, 500);

    } catch (err: any) {
      console.error('Logout error:', err);
      setStatusMsg({ type: 'error', text: 'Erro ao encerrar sessão.' });
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'master_admin';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 transition-colors flex items-center gap-1.5 rounded-sm ${
          user
            ? 'text-accent hover:text-white bg-wolf-900/80 border border-wolf-800'
            : 'text-wolf-300 hover:text-white'
        }`}
        title={user ? `Logado como ${user.name}` : 'Minha Conta / Entrar'}
      >
        <User className="w-5 h-5" />
        {user && (
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold max-w-[90px] truncate text-white">
              {user.name}
            </span>
            {isAdmin && (
              <span className="bg-accent/20 border border-accent/40 text-accent text-[9px] px-1 py-0.5 rounded-xs font-mono font-black uppercase">
                ADMIN
              </span>
            )}
          </div>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-wolf-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-wolf-950 border border-wolf-800 shadow-2xl rounded-sm py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-mono">
          {statusMsg && (
            <div className={`px-4 py-2 mx-2 mb-2 text-xs rounded-xs flex items-center gap-2 ${
              statusMsg.type === 'success' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-rose-950 border border-rose-800 text-rose-300'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {user ? (
            <>
              {/* User Header */}
              <div className="px-4 py-3 border-b border-wolf-800/80 bg-wolf-900/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate font-heading uppercase">
                    {user.name}
                  </span>
                  {isAdmin && (
                    <span className="bg-accent/20 text-accent text-[9px] px-1.5 py-0.5 rounded-xs font-bold uppercase tracking-wider">
                      ADMIN
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-wolf-400 truncate block mt-0.5">
                  {user.email}
                </span>
              </div>

              {/* Logged in options */}
              <div className="py-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-accent hover:bg-wolf-900 font-bold tracking-wider"
                  >
                    <Shield className="w-4 h-4 text-accent" />
                    PAINEL ADMINISTRATIVO
                  </Link>
                )}
                <Link
                  href="/minha-conta"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-wolf-200 hover:bg-wolf-900 hover:text-white"
                >
                  <User className="w-4 h-4 text-wolf-400" />
                  Minha Conta
                </Link>
                <Link
                  href="/minha-conta/pedidos"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-wolf-200 hover:bg-wolf-900 hover:text-white"
                >
                  <Package className="w-4 h-4 text-wolf-400" />
                  Meus Pedidos
                </Link>
                <Link
                  href="/minha-conta/dados"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-wolf-200 hover:bg-wolf-900 hover:text-white"
                >
                  <Settings className="w-4 h-4 text-wolf-400" />
                  Dados Pessoais
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-wolf-800/80 pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/40 text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sair da Conta
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Not Logged In */}
              <div className="px-4 py-3 border-b border-wolf-800/80">
                <span className="text-xs font-bold text-white uppercase block font-heading">
                  ÁREA DO CLIENTE
                </span>
                <span className="text-[10px] text-wolf-400 block mt-0.5">
                  Acesse para ver pedidos e ofertas
                </span>
              </div>

              <div className="py-2 px-3 space-y-1.5">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-accent hover:bg-accent/90 text-white font-bold text-xs uppercase rounded-xs transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Entrar
                </Link>

                <Link
                  href="/cadastro"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-wolf-900 hover:bg-wolf-800 text-wolf-200 hover:text-white font-bold text-xs uppercase border border-wolf-800 rounded-xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Criar Conta
                </Link>
              </div>

              <div className="border-t border-wolf-800/80 pt-2 px-3 pb-1">
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-[11px] text-wolf-500 hover:text-accent transition-colors py-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Acesso Administrativo
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
