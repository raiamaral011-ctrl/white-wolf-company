'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, Layers, Tag, ArrowLeft, ShieldAlert } from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'DASHBOARD', icon: LayoutDashboard },
    { href: '/admin/produtos', label: 'PRODUTOS', icon: Package },
    { href: '/admin/pedidos', label: 'PEDIDOS', icon: ShoppingBag },
    { href: '/admin/clientes', label: 'CLIENTES', icon: Users },
    { href: '/admin/estoque', label: 'ESTOQUE', icon: ShieldAlert },
    { href: '/admin/marcas', label: 'MARCAS', icon: Tag },
    { href: '/admin/categorias', label: 'CATEGORIAS', icon: Layers },
  ];

  return (
    <aside className="w-full lg:w-64 bg-wolf-950 border-r border-wolf-800 p-6 space-y-8 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="font-heading text-lg font-black tracking-tighter text-white">
            WHITE WOLF <span className="text-accent">ADMIN</span>
          </span>
          <span className="text-[10px] font-mono text-wolf-400 block">SISTEMA DE GESTÃO ESPORTIVA</span>
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

      <div className="pt-6 border-t border-wolf-800">
        <Link href="/" className="flex items-center gap-2 text-xs font-mono text-wolf-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> VOLTAR PARA A LOJA
        </Link>
      </div>
    </aside>
  );
}
