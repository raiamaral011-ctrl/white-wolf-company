'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { formatCurrency } from '@/lib/utils';
import { Search, RefreshCw, UserCheck } from 'lucide-react';

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data || []);
      }
    } catch (err) {
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-wolf-950 text-white flex flex-col lg:flex-row font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wolf-800 pb-6">
          <div>
            <span className="text-xs font-mono text-accent uppercase font-bold tracking-widest">
              BASE DE USUÁRIOS
            </span>
            <h1 className="text-3xl font-black uppercase font-heading tracking-tight flex items-center gap-3">
              CLIENTES CADASTRADOS ({loading ? '...' : customers.length})
              {loading && <RefreshCw className="w-4 h-4 animate-spin text-accent" />}
            </h1>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-wolf-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, e-mail..."
              className="w-full bg-wolf-900 border border-wolf-800 text-xs font-mono pl-9 pr-3 py-2 text-white focus:outline-none focus:border-accent rounded-xs"
            />
          </div>
        </div>

        <div className="bg-wolf-900 border border-wolf-800 rounded-sm overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-wolf-800 text-wolf-400 bg-wolf-950">
                <th className="p-4">NOME</th>
                <th className="p-4">E-MAIL</th>
                <th className="p-4">CPF / TELEFONE</th>
                <th className="p-4">PEDIDOS</th>
                <th className="p-4">TOTAL GASTO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wolf-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-wolf-500 font-mono">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-wolf-950/50">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-accent shrink-0" />
                      {c.name}
                    </td>
                    <td className="p-4 text-wolf-300">{c.email}</td>
                    <td className="p-4 text-wolf-400">
                      <div>{c.cpf}</div>
                      <div className="text-[10px] text-wolf-500">{c.phone}</div>
                    </td>
                    <td className="p-4 font-bold text-accent">{c.ordersCount} pedido(s)</td>
                    <td className="p-4 font-bold text-emerald-400">{formatCurrency(c.totalSpent || 0)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
