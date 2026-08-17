'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, Layers, Tag, ArrowLeft, ShieldAlert, LogOut, ShieldCheck } from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/admin', label: 'DASHBOARD', icon: LayoutDashboard },
    { href: '/admin/produtos', label: 'PRODUTOS', icon: Package },
    { href: '/admin/pedidos', label: 'PEDIDOS', icon: ShoppingBag },
    { href: '/admin/clientes', label: 'CLIENTES', icon: Users },
    { href: '/admin/estoque', label: 'ESTOQUE', icon: ShieldAlert },
    { href: '/admin/marcas', label: 'MARCAS', icon: Tag },
    { href: '/admin/categorias', label: 'CATEGORIAS', icon: Layers },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      router.push('/admin/login');
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-wolf-950 border-r border-wolf-800 p-6 space-y-8 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-heading text-lg font-black tracking-tighter text-white">
              WHITE WOLF <span className="text-accent">ADMIN</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded-xs">
              <ShieldCheck className="w-3 h-3" /> ONLINE
            </span>
          </div>
          <span className="text-[10px] font-mono text-wolf-400 block">SISTEMA DE GESTÃO ESPORTIVA</span>
        </div>

        {/* User Card */}
        <div className="p-3 bg-wolf-900/60 border border-wolf-800 rounded-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-xs font-mono">
            RA
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-mono font-bold text-white block truncate">
              raiamaral
            </span>
            <span className="text-[10px] font-mono text-wolf-400 block">
              Admin Master
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xs font-mono text-xs uppercase font-bold transition-colors ${
                  active ? 'bg-accent text-white' : 'text-wolf-300 hover:bg-wolf-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-wolf-800 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 p-2 rounded-xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> ENCERRAR SESSÃO
        </button>

        <Link href="/" className="flex items-center gap-2 text-xs font-mono text-wolf-400 hover:text-white p-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> VOLTAR PARA A LOJA
        </Link>
      </div>
    </aside>
  );
}
