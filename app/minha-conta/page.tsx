'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { createClient } from '@/lib/supabase/browser';
import { ShoppingBag, Heart, MapPin, User, LogOut, Package, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function MinhaContaDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string; name: string } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', authUser.id)
          .single();

        const resolvedName = profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Atleta';
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: resolvedName,
        });

        // Load real orders for this user
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Error loading account dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = 'ww_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
    router.refresh();
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'aprovado':
      case 'pagamento aprovado':
        return { label: 'Pagamento Aprovado', color: 'text-emerald-400' };
      case 'shipped':
      case 'enviado':
        return { label: 'Enviado', color: 'text-sky-400' };
      case 'delivered':
      case 'entregue':
        return { label: 'Entregue', color: 'text-emerald-300' };
      case 'cancelled':
      case 'cancelado':
        return { label: 'Cancelado', color: 'text-rose-400' };
      default:
        return { label: 'Pendente', color: 'text-amber-400' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center p-20 font-mono text-xs text-wolf-400 gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-accent" />
          Carregando seus dados do atleta...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col font-sans">
      <Header />

      <section className="bg-gradient-to-r from-wolf-950 via-wolf-900 to-black border-b border-wolf-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">
            PAINEL DO ATLETA
          </span>
          <h1 className="text-3xl font-black uppercase font-heading tracking-tight">
            OLÁ, {user?.name?.toUpperCase() || 'CLIENTE'}
          </h1>
          <p className="text-sm text-wolf-400 font-mono">
            {user?.email} • Gerencie seus pedidos, dados cadastrais e endereços de entrega.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ACCOUNT NAVIGATION MENU (4 Cols) */}
        <aside className="lg:col-span-4 bg-wolf-900 border border-wolf-800 p-6 rounded-sm space-y-2">
          <Link href="/minha-conta" className="flex items-center gap-3 p-3 bg-accent text-white font-bold text-xs uppercase tracking-wider rounded-xs">
            <User className="w-4 h-4" /> MINHA CONTA
          </Link>
          <Link href="/minha-conta/pedidos" className="flex items-center gap-3 p-3 text-wolf-300 hover:text-white hover:bg-wolf-800 font-mono text-xs uppercase rounded-xs transition-colors">
            <Package className="w-4 h-4 text-wolf-400" /> MEUS PEDIDOS ({orders.length})
          </Link>
          <Link href="/favoritos" className="flex items-center gap-3 p-3 text-wolf-300 hover:text-white hover:bg-wolf-800 font-mono text-xs uppercase rounded-xs transition-colors">
            <Heart className="w-4 h-4 text-wolf-400" /> FAVORITOS
          </Link>
          <Link href="/minha-conta/dados" className="flex items-center gap-3 p-3 text-wolf-300 hover:text-white hover:bg-wolf-800 font-mono text-xs uppercase rounded-xs transition-colors">
            <User className="w-4 h-4 text-wolf-400" /> DADOS PESSOAIS
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-rose-400 hover:bg-rose-950/40 font-mono text-xs uppercase rounded-xs transition-colors pt-4 border-t border-wolf-800 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> SAIR DA CONTA
          </button>
        </aside>

        {/* RECENT ORDERS & OVERVIEW (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-wolf-900 border border-wolf-800 p-6 space-y-6 rounded-sm">
            <div className="flex items-center justify-between border-b border-wolf-800 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white font-heading">
                ÚLTIMOS PEDIDOS REALIZADOS ({orders.length})
              </h2>
              {orders.length > 0 && (
                <Link href="/minha-conta/pedidos" className="text-xs font-mono text-accent hover:underline uppercase">
                  VER TODOS →
                </Link>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-wolf-950/60 border border-wolf-800/80 rounded-sm space-y-3 font-mono">
                <ShoppingBag className="w-8 h-8 text-wolf-600 mx-auto" />
                <p className="text-xs text-wolf-400">Você ainda não realizou compras com esta conta.</p>
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase hover:underline"
                >
                  Explorar Tênis Disponíveis <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => {
                  const badge = getStatusBadge(order.status);
                  const itemCount = order.items?.length || 1;
                  return (
                    <div key={order.id} className="p-4 bg-wolf-950 border border-wolf-800 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
                      <div className="space-y-1">
                        <span className="font-bold text-white text-sm block">#{order.id}</span>
                        <span className="text-wolf-400">
                          Data: {new Date(order.created_at || Date.now()).toLocaleDateString('pt-BR')} • {itemCount} item(s)
                        </span>
                      </div>
                      <div className="space-y-1 text-left sm:text-right">
                        <span className={`font-bold block ${badge.color}`}>{badge.label}</span>
                        <span className="text-white font-bold">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
